import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User, UserDocument } from './schemas/user.schema'

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(user: User): Promise<User> {
    const createdUser = new this.userModel({ ...user })
    return createdUser.save()
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec()
  }

  async findByWallet(wallet: string): Promise<User | null> {
    return this.userModel.findOne({ wallet }).exec()
  }
}
