import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import {CastService} from "./cast.service";
import {CreateCastDto} from "./dto/create-cast.dto";

@Controller('casts')
export class CastController {
  constructor(private readonly castService: CastService) {}

  @Post()
  async create(@Body() createCastDto: CreateCastDto) {
    return this.castService.create(createCastDto);
  }

  @Get(':voteId')
  async findByVoteId(@Param('voteId') voteId: string) {
    return this.castService.findByVoteId(voteId);
  }
}
