import { Field, InputType } from '@nestjs/graphql'

import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

const RegisterSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(6),
})

@InputType()
export class RegisterInput extends createZodDto(RegisterSchema) {
  @Field()
  name!: string

  @Field()
  email!: string

  @Field()
  password!: string
}
