import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { AppModule } from './app/app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const globalPrefix = 'api'
  app.setGlobalPrefix(globalPrefix)

  const configService = app.get(ConfigService)
  app.enableCors({
    origin: 'http://localhost:4200',
    credentials: true,
  })

  const port = configService.get<number>('PORT') || 3000
  await app.listen(port, () => {
    Logger.log(
      `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
    )
  })
}

bootstrap()
