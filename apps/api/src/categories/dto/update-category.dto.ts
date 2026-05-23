import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

const UpdateCategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
})

export class UpdateCategoryInput extends createZodDto(UpdateCategorySchema) {}
