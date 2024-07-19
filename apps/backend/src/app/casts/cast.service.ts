import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {Cast} from "./schemas/casts.schema";
import {CreateCastDto} from "./dto/create-cast.dto";

@Injectable()
export class CastService {
  constructor(@InjectModel(Cast.name) private CastModel: Model<Cast>) {}

  async create(createCastDto: CreateCastDto): Promise<Cast> {
    const createdCast = new this.CastModel(createCastDto);
    return createdCast.save();
  }

  async findByVoteId(voteId: string): Promise<Cast[]> {
    return this.CastModel.find({ voteId }).exec();
  }
}
