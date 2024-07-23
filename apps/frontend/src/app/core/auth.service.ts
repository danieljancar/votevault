import { Injectable } from '@angular/core'
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { Observable, of, throwError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { Keypair } from '@stellar/stellar-sdk'

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  generateKeyPair(): Keypair {
    return Keypair.random()
  }

  register(publicKey: string): Observable<any> {
    return this.http
      .post('/api/users/register', { publicKey })
      .pipe(catchError(this.handleError))
  }

  login(publicKey: string): Observable<any> {
    return this.http
      .post('/api/auth/login', { publicKey }, { withCredentials: true })
      .pipe(catchError(this.handleError))
  }

  isAuthenticated(): Observable<boolean> {
    return this.http.get('/api/auth/check', { withCredentials: true }).pipe(
      catchError(() => of({ authenticated: false })),
      map((response: any) => response.authenticated),
    )
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error.message)
    return throwError(
      () => new Error('Something went wrong. Please try again later.'),
    )
  }
}
