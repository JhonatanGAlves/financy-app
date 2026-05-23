import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

const UpdateTransactionSchema = z.object({
  id: z.string().uuid(),
  amount: z.number().positive().optional(),
  description: z.string().min(1).max(255).optional(),
  type: z.enum(['INCOME', 'EXPENSE']).optional(),
  categoryId: z.string().uuid().optional(),
  date: z.coerce.date().optional(),
})

export class UpdateTransactionInput extends createZodDto(
  UpdateTransactionSchema,
) {}
