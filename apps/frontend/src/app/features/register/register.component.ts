import { Component } from '@angular/core'
import { CommonModule, NgOptimizedImage } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { AuthService } from '../../core/auth.service'
import { Keypair } from '@stellar/typescript-wallet-sdk'

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, NgOptimizedImage, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  publicKey: string = ''
  secretKey: string = ''
  captchaImage: string = ''
  captchaId: string = ''
  transaction: string = ''
  captchaAnswer: string = ''
  authToken: string = ''

  constructor(private authService: AuthService) {}

  generateKeypair() {
    const keypair = Keypair.random()
    this.publicKey = keypair.publicKey()
    this.secretKey = keypair.secret()
  }

  generateChallenge() {
    this.authService.getChallenge(this.publicKey).subscribe(
      response => {
        this.transaction = response.transaction
        this.captchaId = response.captchaId
        this.captchaImage = response.captchaImage
      },
      error => {
        console.error('Error generating challenge:', error)
      },
    )
  }
}
