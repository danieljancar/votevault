import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type UserDocument = User & Document

@Schema()
export class User {
  @Prop({ required: true, unique: true, type: String, index: true })
  wallet: string

  @Prop({ default: Date.now, required: false, type: Date })
  createdAt: Date
}

export const UserSchema = SchemaFactory.createForClass(User)
