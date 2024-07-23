import { Injectable } from '@angular/core'
import { CanActivate, Router } from '@angular/router'
import { Observable, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { AuthService } from '../core/auth.service'

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.isAuthenticated().pipe(
      map(authenticated => {
        if (!authenticated) {
          this.router.navigate(['/login'])
          return false
        }
        return true
      }),
      catchError(() => {
        this.router.navigate(['/login'])
        return of(false)
      }),
    )
  }
}
