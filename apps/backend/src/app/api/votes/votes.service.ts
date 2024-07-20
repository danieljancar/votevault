import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Vote } from './schemas/vote.schema'
import { CreateVoteDto } from './dto/create-vote.dto'

@Injectable()
export class VotesService {
  constructor(@InjectModel(Vote.name) private voteModel: Model<Vote>) {}

  async create(createVoteDto: CreateVoteDto): Promise<Vote> {
    const createdVote = new this.voteModel(createVoteDto)
    return createdVote.save()
  }

  async findAll(): Promise<Vote[]> {
    return this.voteModel.find().exec()
  }

  async findOne(id: string): Promise<Vote> {
    return this.voteModel.findById(id).exec()
  }
}
