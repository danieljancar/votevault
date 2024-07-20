import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Cast, CastSchema } from './schemas/casts.schema'
import { CastController } from './cast.controller'
import { CastService } from './cast.service'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cast.name, schema: CastSchema }]),
  ],
  controllers: [CastController],
  providers: [CastService],
})
export class CastModule {}
