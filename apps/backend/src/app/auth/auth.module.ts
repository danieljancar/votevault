import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtModule } from '@nestjs/jwt'
import { JWT_SECRET_KEY } from '../config/config'
import { CaptchaService } from './captcha.service'

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: JWT_SECRET_KEY,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, CaptchaService],
})
export class AuthModule {}
