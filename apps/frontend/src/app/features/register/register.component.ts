import { Component } from '@angular/core'
import { CommonModule, NgOptimizedImage } from '@angular/common'
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'
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
    ReactiveFormsModule,
    ErrorComponent,
    LoadingComponent,
    SuccessComponent,
    NgOptimizedImage,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  protected registerForm: FormGroup
  protected publicKey = ''
  protected secretKey = ''
  protected hasDownloaded = false

  protected isLoading = false
  protected hasError = false
  protected errorMessage = ''
  protected successMessage = ''

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.registerForm = this.fb.group({
      publicKey: [{ value: '', disabled: true }, Validators.required],
      privateKey: [{ value: '', disabled: true }, Validators.required],
    })
  }

  async generateKeypair() {
    const keypair = this.authService.generateKeypair()
    if (keypair) {
      this.publicKey = keypair.publicKey()
      this.secretKey = keypair.secret()
      this.registerForm.patchValue({
        publicKey: this.publicKey,
        privateKey: this.secretKey,
      })
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

  async onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true
      const accountCreated = this.authService.createAccount(
        this.publicKey,
        this.secretKey,
      )

      if (accountCreated) {
        await this.fundAccount()
      } else {
        this.hasError = true
        this.errorMessage = 'Account creation failed'
      }

      this.isLoading = false
    }
  }

  downloadSecretKey() {
    const keyData = `Public Key: ${this.publicKey}\nSecret Key: ${this.secretKey}`
    const blob = new Blob([keyData], { type: 'text/plain;charset=utf-8' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'keypair.txt'
    a.click()
    window.URL.revokeObjectURL(url)
    this.hasDownloaded = true
  }

  continueToLogin() {
    this.router.navigate(['/login'])
  }

  errorAction() {
    this.hasError = false
  }
}
