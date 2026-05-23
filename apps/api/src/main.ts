import { ZodValidationPipe } from 'nestjs-zod'
import { NestFactory } from '@nestjs/core'

import { AppModule } from './app.module'
import './config/env'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(new ZodValidationPipe())
  await app.listen(3000)
}

bootstrap()
