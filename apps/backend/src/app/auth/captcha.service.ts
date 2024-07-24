import { Injectable } from '@nestjs/common'
import { v4 as uuidv4 } from 'uuid'
import { createHash } from 'crypto'
import Jimp from 'jimp'
import { resolve } from 'path'
import { promises as fs } from 'fs'

@Injectable()
export class CaptchaService {
  private captchaStore = new Map<string, string>()

  async generateCaptcha(): Promise<{ imageUrl: string; captchaId: string }> {
    const captchaId = uuidv4()
    const answer = this.generateRandomAnswer()
    const answerHash = createHash('sha256').update(answer).digest('hex')
    this.captchaStore.set(captchaId, answerHash)
    const imageUrl = await this.createCaptchaImage(answer, captchaId)
    return { imageUrl, captchaId }
  }

  validateCaptcha(captchaId: string, answer: string): boolean {
    const storedHash = this.captchaStore.get(captchaId)
    if (!storedHash) return false
    const answerHash = createHash('sha256').update(answer).digest('hex')
    return storedHash === answerHash
  }

  private generateRandomAnswer(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase()
  }

  private async createCaptchaImage(
    answer: string,
    captchaId: string,
  ): Promise<string> {
    const image = new Jimp(200, 100, 'white')
    await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK).then(font => {
      // @ts-expect-error - TS doesn't know about the print method
      image.print(font, 50, 50, answer)
    })

    const imagePath = resolve('public', 'captchas', `${captchaId}.png`)

    await fs.mkdir(resolve('public', 'captchas'), { recursive: true })

    await image.writeAsync(imagePath)

    return `/public/captchas/${captchaId}.png`
  }
}
