import { IsNotEmpty } from 'class-validator'

export class VerifySignatureDto {
  @IsNotEmpty()
  publicKey: string

  @IsNotEmpty()
  signature: string
}
