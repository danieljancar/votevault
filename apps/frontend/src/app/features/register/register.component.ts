import { Component, inject } from '@angular/core'
import { CommonModule, NgOptimizedImage } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { AuthService } from '../../core/auth.service'

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, NgOptimizedImage, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  publicKey: string = ''
  privateKey: string = ''
  private authService = inject(AuthService)

  generateKeyPair() {
    const keypair = this.authService.generateKeyPair()
    this.publicKey = keypair.publicKey()
    this.privateKey = keypair.secret()
  }

  onSubmit() {
    if (this.publicKey) {
      this.authService.register(this.publicKey).subscribe(
        response => {
          console.log('Registration successful', response)
        },
        error => {
          console.error('Registration failed', error)
        },
      )
    }
  }
}
