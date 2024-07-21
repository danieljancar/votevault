import { Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';
import {Keypair} from "@stellar/stellar-sdk";
import { JwtService } from '@nestjs/jwt';
import {UserService} from "../user/user.service";

@Injectable()
export class AuthService {
  private challenges = new Map<string, string>();

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async generateChallenge(publicKey: string) {
    const challenge = randomBytes(32).toString('hex');
    this.challenges.set(publicKey, challenge);
    return { challenge };
  }

  async verifySignature(publicKey: string, signature: string) {
    const challenge = this.challenges.get(publicKey);
    if (!challenge) {
      throw new Error('No challenge found for public key');
    }

    const keypair = Keypair.fromPublicKey(publicKey);
    const isValid = keypair.verify(Buffer.from(challenge, 'hex'), Buffer.from(signature, 'base64'));

    if (!isValid) {
      throw new Error('Invalid signature');
    }

    let user = await this.userService.findUserByPublicKey(publicKey);
    if (!user) {
      user = await this.userService.createUser(publicKey);
    }

    const payload = { publicKey };
    const accessToken = this.jwtService.sign(payload);
    this.challenges.delete(publicKey);

    return { access_token: accessToken };
  }
}
