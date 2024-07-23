import { Controller, Post, Body } from '@nestjs/common'
import { AuthService } from './auth.service'
import { UserService } from '../user/user.service'
import { Account } from '@stellar/stellar-sdk'
import { User } from '../user/schemas/user.schema'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('login')
  async login(@Body('wallet') walletKey: string) {
    const user = await this.userService.findByWallet(walletKey)

    if (!user) {
      const newUser: User = {
        wallet: walletKey,
        createdAt: new Date(),
      }
      await new Account(walletKey, '0')
      const createdUser = await this.userService.create(newUser)
      return this.authService.login(createdUser.wallet)
    }

    return this.authService.login(user.wallet)
  }
}
