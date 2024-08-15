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
export class GetVoteResultsService {
  private contractId = CONTRACT_ID
  private dataArr: Array<{ key: string; val: string }> = []
  private isLoading = true
  private hasError = false
  private errorMessage = ''

  async getVoteResults(
    server: SorobanRpc.Server,
    sourceKeypair: Keypair,
    voteId: string,
  ) {
    this.resetData()

    try {
      const contract = new Contract(this.contractId)

      const sourceAccount = await server.getAccount(sourceKeypair.publicKey())

      const builtTransaction = new TransactionBuilder(sourceAccount, {
        fee: BASE_FEE,
        networkPassphrase: Networks.TESTNET,
      })
        .addOperation(
          contract.call(
            'get_vote_result',
            nativeToScVal(voteId, { type: 'string' }),
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
          if (!getResponse.returnValue?.map()) {
            return
          }
          getResponse.returnValue.map()?.forEach(item => {
            if (!item.val() || !item.key()) {
              return
            }
            const key = String(item.key()?.value())
            const val = String(item.val()?.value())
            this.dataArr.push({
              key: key,
              val: val,
            })
          })

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
      dataArr: this.dataArr,
      isLoading: this.isLoading,
      hasError: this.hasError,
      errorMessage: this.errorMessage,
    }
  }

  resetData() {
    this.dataArr = []
    this.isLoading = true
    this.hasError = false
    this.errorMessage = ''
  }
}
