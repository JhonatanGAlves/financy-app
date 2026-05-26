import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { PrismaService } from '@prisma-module/prisma.service'

import { CreateTransactionInput } from './dto/create-transaction.dto'
import { UpdateTransactionInput } from './dto/update-transaction.dto'

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  list(userId: string) {
    return this.prisma.transaction.findMany({ where: { userId } })
  }

  create(userId: string, input: CreateTransactionInput) {
    return this.prisma.transaction.create({
      data: {
        amount: input.amount,
        description: input.description,
        type: input.type,
        categoryId: input.categoryId,
        date: input.date,
        userId,
      },
    })
  }

  async update(userId: string, input: UpdateTransactionInput) {
    await this.assertOwnership(input.id, userId)
    return this.prisma.transaction.update({
      where: { id: input.id },
      data: {
        amount: input.amount,
        description: input.description,
        type: input.type,
        categoryId: input.categoryId,
        date: input.date,
      },
    })
  }

  async delete(userId: string, id: string) {
    await this.assertOwnership(id, userId)
    await this.prisma.transaction.delete({ where: { id } })
    return true
  }

  private async assertOwnership(id: string, userId: string) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
    })
    if (!transaction) throw new NotFoundException('Transaction not found')
    if (transaction.userId !== userId) throw new ForbiddenException()
  }
}
