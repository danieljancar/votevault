// src/main.ts

import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { AppModule } from './app/app.module'
import { HttpExceptionFilter } from './app/filters/http-exception.filter'
import helmet from 'helmet'
import { Config } from './app/interfaces/env.interface'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const globalPrefix = 'api'
  app.setGlobalPrefix(globalPrefix)

  const configService = app.get<ConfigService<Config>>(ConfigService)
  app.useGlobalFilters(new HttpExceptionFilter())
  app.use(helmet())

  const port = configService.get<number>('PORT') || 3333
  await app.listen(port, () => {
    Logger.log(
      `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
    )
  })
}

bootstrap()
