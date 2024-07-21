import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { ThrottlerModule } from '@nestjs/throttler'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { VotesModule } from './api/votes/votes.module'
import { CastModule } from './api/casts/cast.module'
import { AuthModule } from './auth/auth.module'
import { UserModule } from './api/user/user.module'
import { createThrottlerConfig } from './config/throttler.config'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../../.env',
      load: [
        () => ({
          PORT: parseInt(process.env.PORT, 10) || 3333,
          MONGODB_URI: process.env.MONGODB_URI,
          JWT_SECRET: process.env.JWT_SECRET,
          THROTTLER_LIMIT: process.env.THROTTLER_LIMIT,
          THROTTLER_TTL: process.env.THROTTLER_TTL,
          THROTTLER_BLOCK_DURATION: process.env.THROTTLER_BLOCK_DURATION,
        }),
      ],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) =>
        createThrottlerConfig(configService),
      inject: [ConfigService],
    }),
    VotesModule,
    CastModule,
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
