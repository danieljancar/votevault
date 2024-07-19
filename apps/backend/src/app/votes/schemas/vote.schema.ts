import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Vote extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  options: string[];

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ required: true })
  createdBy: string; // Public key of the creator's wallet
}

export const VoteSchema = SchemaFactory.createForClass(Vote);
