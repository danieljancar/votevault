import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common'
import { AuthService } from './auth.service'
import { Response } from 'express'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('challenge')
  async getChallenge(
    @Query('public_key') publicKey: string,
    @Res() res: Response,
  ) {
    const challenge = await this.authService.generateChallenge(publicKey)
    return res.json(challenge)
  }

  @Post('authenticate')
  async authenticate(
    @Body('transaction') transaction: string,
    @Body('public_key') clientPublicKey: string,
    @Body('captchaId') captchaId: string,
    @Body('captchaAnswer') captchaAnswer: string,
    @Res() res: Response,
  ) {
    try {
      const token = await this.authService.validateChallenge(
        transaction,
        clientPublicKey,
        captchaId,
        captchaAnswer,
      )
      return res.json({ token })
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
  }
}
