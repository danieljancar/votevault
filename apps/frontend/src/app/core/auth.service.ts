import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Keypair } from '@stellar/typescript-wallet-sdk'
import { firstValueFrom, Observable } from 'rxjs'
import { CookieService } from 'ngx-cookie-service'
import { Horizon } from '@stellar/stellar-sdk'
import { Router } from '@angular/router'

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private server = new Horizon.Server('https://horizon-testnet.stellar.org')

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private router: Router,
  ) {
    this.initializeKeypair()
  }

  generateKeypair(): Keypair {
    return Keypair.random() // This creates the wallet on the Stellar network
  }

  createAccount(publicKey: string, secretKey: string): boolean {
    try {
      this.cookieService.set('privateKey', secretKey)
      this.cookieService.set('publicKey', publicKey)
      return true
    } catch (error) {
      console.error('Failed to store keys in cookies:', error)
      return false
    }
  }

  getKeypair(): Keypair | null {
    const privateKey = this.cookieService.get('privateKey')
    if (privateKey) {
      try {
        return Keypair.fromSecret(privateKey)
      } catch (error) {
        console.error('Failed to retrieve keypair from cookie:', error)
        return null
      }
    }
    return null
  }

  async fundAccount(publicKey: string): Promise<boolean> {
    const response: Observable<any> = this.http.get(
      `https://friendbot.stellar.org?addr=${publicKey}`,
    )

    try {
      const data = await firstValueFrom(response)
      return data.successful
    } catch (error) {
      console.error('Error funding account:', error)
      return false
    }
  }

  async loginUsingPrivateKey(privateKey: string): Promise<boolean> {
    try {
      const keyPair = Keypair.fromSecret(privateKey)
      const publicKey = keyPair.publicKey()

      try {
        await this.server.accounts().accountId(publicKey).call()
        this.cookieService.set('privateKey', privateKey)
        this.cookieService.set('publicKey', publicKey)
        return true
      } catch (error) {
        console.error('Account does not exist or cannot be retrieved:', error)
        return false
      }
    } catch (error) {
      console.error('Failed to login:', error)
      return false
    }
  }

  async isLoggedIn(): Promise<boolean> {
    const keypair = this.getKeypair()
    if (keypair) {
      return await this.isAccountExist(keypair.publicKey())
    }
    return false
  }

  async isAccountExist(publicKey: string): Promise<boolean> {
    try {
      await this.server.accounts().accountId(publicKey).call()
      return true
    } catch (error) {
      return false
    }
  }

  logout(): void {
    this.cookieService.delete('privateKey')
    this.cookieService.delete('publicKey')
    this.router.navigate(['/login'])
  }

  private initializeKeypair(): void {
    const privateKey = this.cookieService.get('privateKey')
    if (privateKey) {
      try {
        const keypair = Keypair.fromSecret(privateKey)
        this.isAccountExist(keypair.publicKey())
          .then(exists => {
            if (!exists) {
              this.cookieService.delete('privateKey')
              this.cookieService.delete('publicKey')
            }
          })
          .catch(error =>
            console.error(
              'Error checking account existence during initialization:',
              error,
            ),
          )
      } catch (error) {
        console.error('Failed to initialize keypair from private key:', error)
      }
    }
  }
}
