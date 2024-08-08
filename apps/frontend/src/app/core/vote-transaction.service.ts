import { Injectable } from '@angular/core'
import { SorobanRpc } from '@stellar/stellar-sdk'
import { Keypair } from '@stellar/typescript-wallet-sdk'
import { AuthService } from './auth.service'

@Injectable({
  providedIn: 'root',
})
export class VoteConfigService {
  constructor(private authService: AuthService) {}

  async getBaseVoteConfig(): Promise<{
    server: SorobanRpc.Server
    sourceKeypair: Keypair
  }> {
    const keypair = this.authService.getKeypair()

    if (!keypair) {
      throw new Error('No keypair found. Please ensure you are logged in.')
    }

    return {
      server: new SorobanRpc.Server('https://soroban-testnet.stellar.org'),
      sourceKeypair: keypair,
    }
  }
}
