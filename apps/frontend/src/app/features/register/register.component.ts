import { Component } from '@angular/core'
import { CommonModule, NgOptimizedImage } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { AuthService } from '../../core/auth.service'
import { Router } from '@angular/router'
import { ErrorComponent } from '../../shared/feedback/error/error.component'
import { LoadingComponent } from '../../shared/feedback/loading/loading.component'
import { SuccessComponent } from '../../shared/feedback/success/success.component'

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgOptimizedImage,
    ReactiveFormsModule,
    ErrorComponent,
    LoadingComponent,
    SuccessComponent,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  protected publicKey = ''
  protected secretKey = ''

  protected isLoading = false
  protected hasError = false
  protected errorMessage = ''
  protected successMessage = ''

  constructor(private authService: AuthService, private router: Router) {}

  async generateKeypair() {
    const keypair = this.authService.generateKeypair()
    if (keypair) {
      this.publicKey = keypair.publicKey()
      this.secretKey = keypair.secret()
    }
  }

  async fundAccount() {
    this.isLoading = true
    const success = await this.authService.fundAccount(this.publicKey)

    if (success) {
      this.successMessage = 'Account funded successfully'
    } else {
      this.hasError = true
      this.errorMessage = 'Failed to fund account'
    }

    this.isLoading = false
  }

  downloadSecretKey() {
    const blob = new Blob([this.secretKey], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'secretKey.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  continueToLogin() {
    this.router.navigate(['/login'])
  }

  errorAction = (): void => {
    this.hasError = false
    this.errorMessage = ''
    this.successMessage = ''
  }
}
