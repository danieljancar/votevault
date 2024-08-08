import { ChangeDetectorRef, Component, OnInit } from '@angular/core'
import { CommonModule, NgOptimizedImage } from '@angular/common'
import { AuthService } from '../../../core/auth.service'

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  isMenuOpen = false
  isLoggedIn = true

  constructor(
    private authService: AuthService,
    private cd: ChangeDetectorRef,
  ) {}

  async ngOnInit(): Promise<void> {
    await this.updateLoginStatus()
  }

  async updateLoginStatus(): Promise<void> {
    this.isLoggedIn = await this.authService.isLoggedIn()
    this.cd.detectChanges()
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen
  }

  closeMenu(): void {
    this.isMenuOpen = false
  }

  async logout(): Promise<void> {
    this.closeMenu()
    this.authService.logout()
    await this.updateLoginStatus()
    this.cd.detectChanges()
  }
}
