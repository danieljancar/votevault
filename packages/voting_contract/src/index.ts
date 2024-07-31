import { Buffer } from 'buffer'
import { Address } from '@stellar/stellar-sdk'
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  Result,
  Spec as ContractSpec,
} from '@stellar/stellar-sdk/contract'
import type {
  u32,
  i32,
  u64,
  i64,
  u128,
  i128,
  u256,
  i256,
  Option,
  Typepoint,
  Duration,
} from '@stellar/stellar-sdk/contract'
export * from '@stellar/stellar-sdk'
export * as contract from '@stellar/stellar-sdk/contract'
export * as rpc from '@stellar/stellar-sdk/rpc'

if (typeof window !== 'undefined') {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer
}

export const networks = {
  testnet: {
    networkPassphrase: 'Test SDF Network ; September 2015',
    contractId: 'CA6Z3UEZ6EH6VHKO2EEVDGOZI7CT4SATQP7HNTPWODL5OJSDRULXRJCG',
  },
} as const

export const Errors = {}

export interface Client {
  /**
   * Construct and simulate a create_vote transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  create_vote: (
    {
      vote_id,
      vote_options,
      title,
      description,
      start_date,
      end_date,
    }: {
      vote_id: string
      vote_options: Array<string>
      title: string
      description: string
      start_date: string
      end_date: string
    },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean
    },
  ) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a get_vote transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_vote: (
    { vote_id }: { vote_id: string },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean
    },
  ) => Promise<AssembledTransaction<Array<string>>>

  /**
   * Construct and simulate a cast transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  cast: (
    {
      vote_id,
      option,
      voter,
    }: { vote_id: string; option: string; voter: string },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean
    },
  ) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a get_vote_result transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_vote_result: (
    { vote_id }: { vote_id: string },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean
    },
  ) => Promise<AssembledTransaction<Map<string, u32>>>
}
export class Client extends ContractClient {
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([
        'AAAAAAAAAAAAAAALY3JlYXRlX3ZvdGUAAAAABgAAAAAAAAAHdm90ZV9pZAAAAAARAAAAAAAAAAx2b3RlX29wdGlvbnMAAAPqAAAAEQAAAAAAAAAFdGl0bGUAAAAAAAAQAAAAAAAAAAtkZXNjcmlwdGlvbgAAAAAQAAAAAAAAAApzdGFydF9kYXRlAAAAAAAQAAAAAAAAAAhlbmRfZGF0ZQAAABAAAAAA',
        'AAAAAAAAAAAAAAAIZ2V0X3ZvdGUAAAABAAAAAAAAAAd2b3RlX2lkAAAAABEAAAABAAAD6gAAABA=',
        'AAAAAAAAAAAAAAAEY2FzdAAAAAMAAAAAAAAAB3ZvdGVfaWQAAAAAEQAAAAAAAAAGb3B0aW9uAAAAAAARAAAAAAAAAAV2b3RlcgAAAAAAABMAAAAA',
        'AAAAAAAAAAAAAAAPZ2V0X3ZvdGVfcmVzdWx0AAAAAAEAAAAAAAAAB3ZvdGVfaWQAAAAAEQAAAAEAAAPsAAAAEQAAAAQ=',
      ]),
      options,
    )
  }
  public readonly fromJSON = {
    create_vote: this.txFromJSON<null>,
    get_vote: this.txFromJSON<Array<string>>,
    cast: this.txFromJSON<null>,
    get_vote_result: this.txFromJSON<Map<string, u32>>,
  }
}
