import { UseGuards } from '@nestjs/common'
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql'

import { CurrentUser } from '@common/decorators/current-user.decorator'
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard'

import { CreateTransactionInput } from './dto/create-transaction.dto'
import { TransactionObject } from './dto/transaction.dto'
import { UpdateTransactionInput } from './dto/update-transaction.dto'
import { TransactionsService } from './transactions.service'

@Resolver()
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Query(() => [TransactionObject])
  transactions(@CurrentUser() user: { userId: string }) {
    return this.transactionsService.list(user.userId)
  }

  @Mutation(() => TransactionObject)
  createTransaction(
    @CurrentUser() user: { userId: string },
    @Args('input') input: CreateTransactionInput,
  ) {
    return this.transactionsService.create(user.userId, input)
  }

  @Mutation(() => TransactionObject)
  updateTransaction(
    @CurrentUser() user: { userId: string },
    @Args('input') input: UpdateTransactionInput,
  ) {
    return this.transactionsService.update(user.userId, input)
  }

  @Mutation(() => Boolean)
  deleteTransaction(
    @CurrentUser() user: { userId: string },
    @Args('id', { type: () => ID }) id: string,
  ) {
    return this.transactionsService.delete(user.userId, id)
  }
}
