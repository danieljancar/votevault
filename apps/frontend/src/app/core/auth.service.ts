import { Injectable, EventEmitter } from '@angular/core'
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
  public loginStatusChanged = new EventEmitter<boolean>()

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private router: Router,
  ) {
    this.initializeKeypair()
  }

  generateKeypair(): Keypair {
    return Keypair.random()
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
        this.loginStatusChanged.emit(true)
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
    this.loginStatusChanged.emit(false)
    return false
  }

  async isAccountExist(publicKey: string): Promise<boolean> {
    try {
      await this.server.accounts().accountId(publicKey).call()
      this.loginStatusChanged.emit(true)
      return true
    } catch (error) {
      this.loginStatusChanged.emit(false)
      return false
    }
  }

  async logout(): Promise<void> {
    this.cookieService.delete('privateKey')
    this.cookieService.delete('publicKey')
    this.loginStatusChanged.emit(false)
    await this.router.navigate(['/login'])
  }

  private async initializeKeypair(): Promise<void> {
    const privateKey = this.cookieService.get('privateKey')
    if (privateKey) {
      try {
        const keypair = Keypair.fromSecret(privateKey)
        const exists = await this.isAccountExist(keypair.publicKey())
        if (!exists) {
          this.cookieService.delete('privateKey')
          this.cookieService.delete('publicKey')
          this.loginStatusChanged.emit(false)
        } else {
          this.loginStatusChanged.emit(true)
        }
      } catch (error) {
        console.error('Failed to initialize keypair from private key:', error)
      }
    }
  }
}
