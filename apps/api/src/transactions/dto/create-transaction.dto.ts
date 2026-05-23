import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

const CreateTransactionSchema = z.object({
  amount: z.number().positive(),
  description: z.string().min(1).max(255),
  type: z.enum(['INCOME', 'EXPENSE']),
  categoryId: z.string().uuid(),
  date: z.coerce.date(),
})

export class CreateTransactionInput extends createZodDto(
  CreateTransactionSchema,
) {}
