import { Injectable } from '@nestjs/common'
import { UserService } from '../user/user.service'
import { User } from '../user/schemas/user.schema'
import { JwtService } from '@nestjs/jwt'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(walletKey: string): Promise<User | null> {
    return await this.userService.findByWallet(walletKey)
  }

  async login(walletKey: string) {
    const user = await this.validateUser(walletKey)
    if (!user) {
      throw new Error('User not found')
    }

    const token = await this.jwtService.signAsync(
      { sub: user['_id'], username: user.wallet },
      { jwtid: uuidv4(), subject: user['_id'] },
    )

    return { user, token }
  }
}
