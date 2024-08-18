import { Injectable } from '@angular/core'
import { CanActivate, Router } from '@angular/router'
import { AuthService } from '../core/auth.service'

@Injectable({
  providedIn: 'root',
})
export class NotAuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    try {
      const isLoggedIn = await this.authService.isLoggedIn()
      if (!isLoggedIn) {
        return true
      } else {
        this.router.navigate(['/'])
        return false
      }
    } catch (error) {
      console.error('Error checking authentication status', error)
      this.router.navigate(['/'])
      return false
    }
  }
}