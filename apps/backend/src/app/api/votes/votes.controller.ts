import { Controller, Get, Post, Body, Param } from '@nestjs/common'
import { VotesService } from './votes.service'
import { CreateVoteDto } from './dto/create-vote.dto'

@Controller('votes')
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  @Post()
  async create(@Body() createVoteDto: CreateVoteDto) {
    return this.votesService.create(createVoteDto)
  }

  @Get()
  async findAll() {
    return this.votesService.findAll()
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.votesService.findOne(id)
  }
}
