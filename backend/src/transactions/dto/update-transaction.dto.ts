import { Field, Float, ID, InputType } from '@nestjs/graphql'

import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

import { TransactionType } from './transaction.dto'

const UpdateTransactionSchema = z.object({
  id: z.string().uuid(),
  amount: z.number().positive().optional(),
  description: z.string().min(1).max(255).optional(),
  type: z.enum(['INCOME', 'EXPENSE']).optional(),
  categoryId: z.string().uuid().optional(),
  date: z.coerce.date().optional(),
})

@InputType()
export class UpdateTransactionInput extends createZodDto(
  UpdateTransactionSchema,
) {
  @Field(() => ID)
  id!: string

  @Field(() => Float, { nullable: true })
  amount?: number

  @Field({ nullable: true })
  description?: string

  @Field(() => TransactionType, { nullable: true })
  type?: TransactionType

  @Field({ nullable: true })
  categoryId?: string

  @Field({ nullable: true })
  date?: Date
}
