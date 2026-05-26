import { Field, InputType } from '@nestjs/graphql'

import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

const CreateCategorySchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(255).optional(),
  icon: z.string().min(1).default('briefcase'),
  color: z.string().min(1).default('green'),
})

@InputType()
export class CreateCategoryInput extends createZodDto(CreateCategorySchema) {
  @Field()
  name!: string

  @Field({ nullable: true })
  description?: string

  @Field()
  icon!: string

  @Field()
  color!: string
}
