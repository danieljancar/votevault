import { Component, OnInit, OnDestroy } from '@angular/core'
import { AuthService } from '../../../core/auth.service'
import { Subscription } from 'rxjs'
import { CommonModule, NgOptimizedImage } from '@angular/common'

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  isMenuOpen = false
  isLoggedIn = false
  private subscription: Subscription = new Subscription()

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.subscription.add(
      this.authService.loginStatusChanged.subscribe(status => {
        this.isLoggedIn = status
      }),
    )
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen
  }

  closeMenu(): void {
    this.isMenuOpen = false
  }

  async logout(): Promise<void> {
    this.closeMenu()
    await this.authService.logout()
  }
}
