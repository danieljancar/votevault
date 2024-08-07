import { Component } from '@angular/core'
import { CommonModule, NgOptimizedImage } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { AuthService } from '../../core/auth.service'
import { ErrorComponent } from '../../shared/error/error.component'
import { LoadingComponent } from '../../shared/loading/loading.component'
import { SuccessComponent } from '../../shared/success/success.component'
import { Router } from '@angular/router'

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
    const keypair = this.authService.getKeypair()
    this.publicKey = keypair.publicKey()
    this.secretKey = keypair.secret()
  }

  fundAccount() {
    this.isLoading = true
    this.authService
      .fundAccount(this.publicKey)
      .then(
        value => {
          if (value) {
            this.successMessage = 'Account funded successfully'
          } else {
            this.hasError = true
            this.errorMessage = 'Failed to fund account'
          }
        },
        () => {
          this.hasError = true
          this.errorMessage = 'Failed to fund account'
        },
      )
      .finally(() => {
        this.isLoading = false
      })
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
