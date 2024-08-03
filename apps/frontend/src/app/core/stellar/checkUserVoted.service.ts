import { Injectable } from '@angular/core'
import { CONTRACT_ID } from '../../config/config'
import {
  BASE_FEE,
  Contract,
  nativeToScVal,
  Networks,
  SorobanRpc,
  TransactionBuilder,
} from '@stellar/stellar-sdk'
import { Keypair } from '@stellar/typescript-wallet-sdk'

@Injectable({
  providedIn: 'root',
})
export class CheckUserVotedService {
  private contractId = CONTRACT_ID
  private isLoading = true
  private hasVoted = false
  private hasError = false
  private errorMessage = ''

  async checkIfUserVoted(
    server: SorobanRpc.Server,
    sourceKeypair: Keypair,
    voteId: string,
    voterId: string,
  ) {
    try {
      const contract = new Contract(this.contractId)

      const sourceAccount = await server.getAccount(sourceKeypair.publicKey())

      const builtTransaction = new TransactionBuilder(sourceAccount, {
        fee: BASE_FEE,
        networkPassphrase: Networks.TESTNET,
      })
        .addOperation(
          contract.call(
            'check_if_user_voted',
            nativeToScVal(voteId, { type: 'symbol' }),
            nativeToScVal(voterId, { type: 'address' }),
          ),
        )
        .setTimeout(30)
        .build()

      const preparedTransaction = await server.prepareTransaction(
        builtTransaction,
      )

      preparedTransaction.sign(sourceKeypair)

      const sendResponse = await server.sendTransaction(preparedTransaction)

      if (sendResponse.status === 'PENDING') {
        let getResponse = await server.getTransaction(sendResponse.hash)
        while (getResponse.status === 'NOT_FOUND') {
          await new Promise(resolve => setTimeout(resolve, 1000))
          getResponse = await server.getTransaction(sendResponse.hash)
        }
        if (getResponse.status === 'SUCCESS') {
          if (getResponse.returnValue?.b() === undefined) {
            return
          }

          this.hasVoted = getResponse.returnValue.b()
          this.isLoading = false
        } else {
          return
        }
      } else {
        return
      }
    } catch (err) {
      this.isLoading = false
      this.hasError = true
      this.errorMessage =
        'There was an Error getting this vote ID, please try again.'
    }

    return {
      hasVoted: this.hasVoted,
      isLoading: this.isLoading,
      hasError: this.hasError,
      errorMessage: this.errorMessage,
    }
  }
}
