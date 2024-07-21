import { Controller, Post, Body } from '@nestjs/common'
import { AuthService } from './auth.service'
import { RequestChallengeDto } from './dto/request-challenge.dto'
import { VerifySignatureDto } from './dto/verify-signature.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('request-challenge')
  async requestChallenge(@Body() requestChallengeDto: RequestChallengeDto) {
    return this.authService.generateChallenge(requestChallengeDto.publicKey)
  }

  @Post('verify')
  async verify(@Body() verifySignatureDto: VerifySignatureDto) {
    return this.authService.verifySignature(
      verifySignatureDto.publicKey,
      verifySignatureDto.signature,
    )
  }
}
