export interface Config {
  PORT?: number
  JWT_SECRET?: string
  THROTTLER_LIMIT?: string
  THROTTLER_TTL?: string
  THROTTLER_BLOCK_DURATION?: string
}
