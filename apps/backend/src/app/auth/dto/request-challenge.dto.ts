import { IsNotEmpty } from 'class-validator'

export class RequestChallengeDto {
  @IsNotEmpty()
  publicKey: string
}
