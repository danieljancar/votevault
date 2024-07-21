import { ExecutionContext } from '@nestjs/common/interfaces'
import { ThrottlerStorage } from '@nestjs/throttler'
import { ThrottlerLimitDetail } from '@nestjs/throttler/dist/throttler.guard.interface'

export type Resolvable<T extends number | string | boolean> =
  | T
  | ((context: ExecutionContext) => T | Promise<T>)

export interface ThrottlerOptions {
  name?: string
  limit: Resolvable<number>
  ttl: Resolvable<number>
  blockDuration?: Resolvable<number>
  ignoreUserAgents?: RegExp[]
  skipIf?: (context: ExecutionContext) => boolean
  getTracker?: ThrottlerGetTrackerFunction
  generateKey?: ThrottlerGenerateKeyFunction
}

export type ThrottlerModuleOptions =
  | Array<ThrottlerOptions>
  | {
      skipIf?: (context: ExecutionContext) => boolean
      ignoreUserAgents?: RegExp[]
      getTracker?: ThrottlerGetTrackerFunction
      generateKey?: ThrottlerGenerateKeyFunction
      errorMessage?:
        | string
        | ((
            context: ExecutionContext,
            throttlerLimitDetail: ThrottlerLimitDetail,
          ) => string)
      storage?: ThrottlerStorage
      throttlers: Array<ThrottlerOptions>
    }

export type ThrottlerGetTrackerFunction = (
  req: ExecutionContext,
) => Promise<string> | string
export type ThrottlerGenerateKeyFunction = (
  context: ExecutionContext,
  trackerString: string,
  throttlerName: string,
) => string

export interface ThrottlerOptions {
  name?: string
  limit: Resolvable<number>
  ttl: Resolvable<number>
  blockDuration?: Resolvable<number>
  ignoreUserAgents?: RegExp[]
  skipIf?: (context: ExecutionContext) => boolean
  getTracker?: ThrottlerGetTrackerFunction
  generateKey?: ThrottlerGenerateKeyFunction
}
