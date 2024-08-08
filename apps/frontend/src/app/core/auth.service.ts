import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Keypair } from '@stellar/typescript-wallet-sdk'
import { firstValueFrom, Observable } from 'rxjs'
import { CookieService } from 'ngx-cookie-service'

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private cookieService: CookieService) {}

  getKeypair(): Keypair {
    return Keypair.random()
  }

  async fundAccount(publicKey: string): Promise<boolean> {
    const response: Observable<any> = this.http.get(
      `https://friendbot.stellar.org?addr=${publicKey}`,
    )

    try {
      const data = await firstValueFrom(response)
      return data.successful
    } catch (error) {
      console.error('Error funding account!')
      return false
    }
  }

  loginUsingPrivateKey(privateKey: string): boolean {
    try {
      const keyPair = Keypair.fromSecret(privateKey)
      if (keyPair) {
        this.cookieService.set('privateKey', privateKey)
        return true
      } else {
        return false
      }
    } catch (error) {
      return false
    }
  }

  isLoggedIn(): boolean {
    const isSet = this.cookieService.check('privateKey')
    if (isSet) {
      const privateKey = this.cookieService.get('privateKey')
      try {
        Keypair.fromSecret(privateKey)
        return true
      } catch (error) {
        return false
      }
    } else {
      return false
    }
  }

  getPrivateKey(): string {
    return this.cookieService.get('privateKey')
  }
}
