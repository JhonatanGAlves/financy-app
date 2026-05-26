import { Field, ID, InputType } from '@nestjs/graphql'

import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

const UpdateCategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  description: z.string().max(255).optional(),
  icon: z.string().min(1),
  color: z.string().min(1),
})

@InputType()
export class UpdateCategoryInput extends createZodDto(UpdateCategorySchema) {
  @Field(() => ID)
  id!: string

  @Field()
  name!: string

  @Field({ nullable: true })
  description?: string

  @Field()
  icon!: string

  @Field()
  color!: string
}
