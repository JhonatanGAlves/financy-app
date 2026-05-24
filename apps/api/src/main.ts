import { NestFactory } from '@nestjs/core'

import { ZodValidationPipe } from 'nestjs-zod'

import { AppModule } from './app.module'
import './config/env'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(new ZodValidationPipe())
  app.enableCors({ origin: '*' })
  await app.listen(3000)
}

bootstrap()
