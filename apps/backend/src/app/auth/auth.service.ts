import { Injectable } from '@nestjs/common'
import {
  Account,
  Keypair,
  Operation,
  Transaction,
  TransactionBuilder,
} from '@stellar/stellar-sdk'
import {
  CHALLENGE_EXPIRATION,
  INVALID_SEQUENCE,
  JWT_SECRET_KEY,
  JWT_TOKEN_LIFETIME,
  SERVER_KEYPAIR,
  STELLAR_NETWORK_PASSPHRASE,
  TOML_ENDPOINT,
} from '../config/config'
import * as crypto from 'crypto'
import { Server } from '@stellar/stellar-sdk/lib/horizon'
import { JwtService } from '@nestjs/jwt'
import { CaptchaService } from './captcha.service'
import Timebounds = Server.Timebounds

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private captchaService: CaptchaService,
  ) {}

  async generateChallenge(clientPublicKey: string) {
    const account = new Account(SERVER_KEYPAIR.publicKey(), INVALID_SEQUENCE)

    const randomNonce = () => {
      return crypto.randomBytes(32).toString('hex')
    }

    const minTime = Date.now()
    const maxTime = minTime + Number(CHALLENGE_EXPIRATION)

    const timeBounds: Timebounds = {
      minTime,
      maxTime,
    }

    const op = Operation['manageData']({
      source: clientPublicKey,
      name: randomNonce(),
      value: clientPublicKey,
    })

    const tx = new TransactionBuilder(account, {
      timebounds: timeBounds,
      fee: '100',
    })
      .addOperation(op)
      .build()

    tx.sign(SERVER_KEYPAIR)

    const { imageUrl, captchaId } = await this.captchaService.generateCaptcha()

    return {
      transaction: tx.toEnvelope().toXDR('base64'),
      captchaImage: imageUrl,
      captchaId,
    }
  }

  async validateChallenge(
    transactionXDR: string,
    clientPublicKey: string,
    captchaId: string,
    captchaAnswer: string,
  ) {
    if (!this.captchaService.validateCaptcha(captchaId, captchaAnswer)) {
      throw new Error('Invalid CAPTCHA answer')
    }

    const tx = new Transaction(transactionXDR, STELLAR_NETWORK_PASSPHRASE)
    const op = tx.operations[0]
    const { signatures } = tx
    const hash = tx.hash()

    if (tx.source != SERVER_KEYPAIR.publicKey()) {
      return new Error('Invalid transaction source')
    }

    if (
      !signatures.some(signature =>
        SERVER_KEYPAIR.verify(hash, signature.signature()),
      )
    ) {
      return new Error('Invalid transaction signature')
    }

    if (
      !(
        tx.timeBounds &&
        Date.now() > Number.parseInt(tx.timeBounds.minTime, 10) &&
        Date.now() < Number.parseInt(tx.timeBounds.maxTime, 10)
      )
    ) {
      return new Error('Transaction expired')
    }

    if (op.type != 'manageData') {
      return new Error('Invalid operation type')
    }

    if (!op.source) {
      return new Error('Invalid operation source')
    }

    const clientKeypair = Keypair.fromPublicKey(clientPublicKey)

    if (
      !signatures.some(signature =>
        clientKeypair.verify(hash, signature.signature()),
      )
    ) {
      return new Error('Invalid or missing client signature')
    }

    const payload = {
      iss: TOML_ENDPOINT,
      sub: op.source,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + Number(JWT_TOKEN_LIFETIME),
      jwtid: tx.hash().toString('hex'),
      JWT_SECRET_KEY,
    }

    return {
      vvb_access_token: await this.jwtService.signAsync(payload, {
        secret: JWT_SECRET_KEY,
      }),
    }
  }
}
