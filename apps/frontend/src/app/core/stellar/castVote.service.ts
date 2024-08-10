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
export class CastVoteService {
  private contractId = CONTRACT_ID
  private isLoading = true
  private hasError = false
  private errorMessage = ''

  async castVote(
    server: SorobanRpc.Server,
    sourceKeypair: Keypair,
    voteId: string,
    currentOption: string,
  ) {
    try {
      this.hasError = false
      const contract = new Contract(this.contractId)

      const sourceAccount = await server.getAccount(sourceKeypair.publicKey())

      const builtTransaction = new TransactionBuilder(sourceAccount, {
        fee: BASE_FEE,
        networkPassphrase: Networks.TESTNET,
      })
        .addOperation(
          contract.call(
            'cast',
            nativeToScVal(voteId, { type: 'string' }),
            nativeToScVal(currentOption, { type: 'string' }),
            nativeToScVal(sourceKeypair.publicKey(), { type: 'address' }),
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
          this.isLoading = false
        } else {
          return
        }
      } else {
        return
      }
    } catch (err: any) {
      if (err?.code === undefined) {
        this.errorMessage =
          'You have already voted, you cannot vote again on the same poll'
      } else {
        this.errorMessage =
          'There was an Error submitting your vote, please try again later'
      }
      this.isLoading = false
      this.hasError = true
    }

    return {
      isLoading: this.isLoading,
      hasError: this.hasError,
      errorMessage: this.errorMessage,
    }
  }
}
