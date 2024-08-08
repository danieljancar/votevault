import { Keypair } from '@stellar/typescript-wallet-sdk'
import { SorobanRpc } from '@stellar/stellar-sdk'

export type BaseVoteConfig = {
  server: SorobanRpc.Server
  sourceKeypair: Keypair
}
