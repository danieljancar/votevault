import { Component, inject } from '@angular/core'
import { CommonModule, NgOptimizedImage } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { AuthService } from '../../core/auth.service'

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, NgOptimizedImage],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  publicKey = ''
  private authService = inject(AuthService)

  onSubmit() {
    if (this.publicKey) {
      this.authService.login(this.publicKey).subscribe(
        response => {
          console.log('Login successful', response)
        },
        error => {
          console.error('Login failed', error)
        },
      )
    }
  }
}
