import { Field, InputType } from '@nestjs/graphql'

import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

@InputType()
export class LoginInput extends createZodDto(LoginSchema) {
  @Field()
  email!: string

  @Field()
  password!: string
}
