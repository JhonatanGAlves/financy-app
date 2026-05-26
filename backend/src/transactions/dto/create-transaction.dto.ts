import { Field, Float, InputType } from '@nestjs/graphql'

import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

import { TransactionType } from './transaction.dto'

const CreateTransactionSchema = z.object({
  amount: z.number().positive(),
  description: z.string().min(1).max(255),
  type: z.enum(['INCOME', 'EXPENSE']),
  categoryId: z.string().uuid(),
  date: z.coerce.date(),
})

@InputType()
export class CreateTransactionInput extends createZodDto(
  CreateTransactionSchema,
) {
  @Field(() => Float)
  amount!: number

  @Field()
  description!: string

  @Field(() => TransactionType)
  type!: TransactionType

  @Field()
  categoryId!: string

  @Field()
  date!: Date
}
