import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'

import { AppModule } from './app/app.module'
import * as process from 'process'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const port = process.env.PORT || 3333
  await app.listen(port)
  Logger.log(`🚀 Application is running on: http://localhost:${port}}`)
}

bootstrap()
  .then(() => Logger.log('Application started'))
  .catch(e => Logger.error(e))
