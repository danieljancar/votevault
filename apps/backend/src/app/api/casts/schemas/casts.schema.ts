import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class Cast extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Vote', required: true })
  voteId: string;

  @Prop({ required: true })
  selectedOption: string;

  @Prop({ required: true })
  voterPublicKey: string; // Public key of the voter's wallet

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const CastSchema = SchemaFactory.createForClass(Cast);
