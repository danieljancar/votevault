import { SorobanRpc } from '@stellar/stellar-sdk'
import { TEST_ACCOUNT } from '../config/config'
import { Keypair } from '@stellar/typescript-wallet-sdk'

/*
 * Returns the base vote configuration
 */
export function getBaseVoteConfig(): {
  server: SorobanRpc.Server
  sourceKeypair: Keypair
} {
  return {
    server: new SorobanRpc.Server('https://soroban-testnet.stellar.org'),
    sourceKeypair: Keypair.fromSecret(TEST_ACCOUNT),
  }
}
