import { Field, InputType } from '@nestjs/graphql'

import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

const CreateCategorySchema = z.object({
  name: z.string().min(1).max(100),
})

@InputType()
export class CreateCategoryInput extends createZodDto(CreateCategorySchema) {
  @Field()
  name!: string
}
