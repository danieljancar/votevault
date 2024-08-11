import { ChangeDetectorRef, Component } from '@angular/core'
import { CommonModule, NgOptimizedImage } from '@angular/common'
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'
import { AuthService } from '../../core/auth.service'
import { ErrorComponent } from '../../shared/feedback/error/error.component'
import { LoadingComponent } from '../../shared/feedback/loading/loading.component'
import { SuccessComponent } from '../../shared/feedback/success/success.component'
import { RouterLink } from '@angular/router'

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
    RouterLink,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  protected loginForm: FormGroup
  protected hasError = false
  protected errorMessage = ''
  protected successMessage = ''

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
  ) {
    this.loginForm = this.fb.group({
      privateKey: ['', Validators.required],
    })
  }

  async logInUsingPrivateKey() {
    const privateKey = this.loginForm.value.privateKey
    const couldLogin = await this.authService.loginUsingPrivateKey(privateKey)

    if (couldLogin) {
      this.successMessage = 'Successfully logged in!'
      this.hasError = false
      this.cd.detectChanges()
    } else {
      this.hasError = true
      this.errorMessage =
        'Failed to login. Please check your private key or register a new account.'
      this.loginForm.reset()
    }
  }

  errorAction = (): void => {
    this.hasError = false
    this.errorMessage = ''
    this.successMessage = ''
  }
}
