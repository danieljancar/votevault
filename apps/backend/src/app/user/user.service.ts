import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findUserByPublicKey(publicKey: string): Promise<User | null> {
    return this.userModel.findOne({ publicKey }).exec();
  }

  async createUser(publicKey: string): Promise<User> {
    const newUser = new this.userModel({ publicKey });
    return newUser.save();
  }
}
