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
import { ErrorComponent } from '../../shared/error/error.component'
import { LoadingComponent } from '../../shared/loading/loading.component'
import { SuccessComponent } from '../../shared/success/success.component'

@Component({
  selector: 'app-login',
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
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  protected loginForm: FormGroup

  protected hasError = false
  protected errorMessage = ''
  protected successMessage = ''

  constructor(private authService: AuthService, private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      privateKey: ['', Validators.required],
    })
  }

  logInUsingPrivateKey() {
    const couldLogin = this.authService.loginUsingPrivateKey(
      this.loginForm.value.privateKey,
    )

    if (couldLogin) {
      this.successMessage = 'Login successful. You can now vote.'
    } else {
      this.hasError = true
      this.errorMessage = 'Failed to login. Please check your private key.'
    }
  }

  errorAction = (): void => {
    this.hasError = false
    this.errorMessage = ''
    this.successMessage = ''
  }
}
