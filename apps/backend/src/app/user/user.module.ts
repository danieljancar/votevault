import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { User, UserSchema } from './schemas/user.schema'
import { AuthGuard } from '../guards/auth.guard'
import { AuthModule } from '../auth/auth.module'
import { JwtService } from '@nestjs/jwt'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UserService, JwtService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
