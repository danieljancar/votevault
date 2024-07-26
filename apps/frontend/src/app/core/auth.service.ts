import { Injectable } from '@angular/core'
import { API_URL } from '../config/config'
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiURL = API_URL

  constructor(private http: HttpClient) {}

  getChallenge(publicKey: string) {
    return this.http.get<any>(`${this.apiURL}/auth/challenge}`, {
      params: { publicKey },
    })
  }

  authenticate(
    transaction: string,
    publicKey: string,
    captchaId: string,
    captchaAnswer: string,
  ) {
    return this.http.post<any>(`${this.apiURL}/auth/authenticate`, {
      transaction,
      publicKey: publicKey,
      captchaId,
      captchaAnswer,
    })
  }
}
