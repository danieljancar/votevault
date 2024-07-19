import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VotesController } from './votes.controller';
import { VotesService } from './votes.service';
import { Vote, VoteSchema } from './schemas/vote.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Vote.name, schema: VoteSchema }])],
  controllers: [VotesController],
  providers: [VotesService],
})
export class VotesModule {}
