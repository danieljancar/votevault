import { Injectable } from '@nestjs/common'
import { SERVER_KEYPAIR, TOML_ENDPOINT } from './config/config'

@Injectable()
export class AppService {
  getStellarToml() {
    return {
      WEB_AUTH_ACCOUNT: SERVER_KEYPAIR.publicKey(),
      WEB_AUTH_ENDPOINT: TOML_ENDPOINT,
    }
  }
}
