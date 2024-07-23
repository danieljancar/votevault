import { Controller, Get, Param, Post, Body, UseGuards } from '@nestjs/common'
import { UserService } from './user.service'
import { User } from './schemas/user.schema'
import { AuthGuard } from '../guards/auth.guard'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  async createUser(@Body() user: User): Promise<User> {
    return this.userService.create(user)
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<User | null> {
    return this.userService.findById(id)
  }
}
