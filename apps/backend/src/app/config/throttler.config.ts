import {ConfigService} from '@nestjs/config';
import {ThrottlerModuleOptions, ThrottlerOptions} from "@nestjs/throttler";

export const createThrottlerConfig = async (configService: ConfigService): Promise<ThrottlerModuleOptions> => {
  const throttlerOptions: ThrottlerOptions = {
    name: 'apiThrottle',
    limit: parseInt(configService.get<string>('THROTTLER_LIMIT'), 10),
    ttl: parseInt(configService.get<string>('THROTTLER_TTL'), 10),
    blockDuration: parseInt(configService.get<string>('THROTTLER_BLOCK_DURATION'), 10),
    ignoreUserAgents: [],
    getTracker: (req) => req.headers['user-agent'] || 'unknown',
    generateKey: (context, trackerString, throttlerName) => `${trackerString}:${throttlerName}`,
  };

  return {
    throttlers: [throttlerOptions],
    errorMessage: 'Rate limit exceeded. Please try again later.',
  };
};
