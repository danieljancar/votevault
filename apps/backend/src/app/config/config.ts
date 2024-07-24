import { Keypair } from '@stellar/stellar-sdk'
import * as process from 'process'

const PORT = process.env.PORT || 3000
const HOST = process.env.HOST || 'localhost'
const HTTP_PROTOCOL = process.env.HTTP_PROTOCOL || 'http'

const SERVER_PRIVATE_KEY = process.env.SERVER_PRIVATE_KEY
const CHALLENGE_EXPIRATION = process.env.CHALLENGE_EXPIRATION || 300
const INVALID_SEQUENCE = String(process.env.INVALID_SEQUENCE) || '0'
const STELLAR_SERVER =
  process.env.STELLAR_SERVER || 'https://horizon-testnet.stellar.org'
const STELLAR_NETWORK_PASSPHRASE =
  process.env.STELLAR_NETWORK_PASSPHRASE || 'Test SDF Network ; September 2015'
const TOML_ENDPOINT = `${HTTP_PROTOCOL}://${HOST}:${PORT}/${process.env.TOML_ENDPOINT}`

const JWT_TOKEN_LIFETIME = process.env.JWT_TOKEN_LIFETIME || 3600
const JWT_SECRET_KEY = process.env.JWT_SECRET

const SERVER_KEYPAIR = Keypair.fromSecret(SERVER_PRIVATE_KEY)

export {
  PORT,
  HOST,
  HTTP_PROTOCOL,
  SERVER_PRIVATE_KEY,
  CHALLENGE_EXPIRATION,
  INVALID_SEQUENCE,
  STELLAR_SERVER,
  STELLAR_NETWORK_PASSPHRASE,
  TOML_ENDPOINT,
  JWT_TOKEN_LIFETIME,
  JWT_SECRET_KEY,
  SERVER_KEYPAIR,
}
