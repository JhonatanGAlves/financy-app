import { Module } from '@nestjs/common'

import { TransactionsController } from './transactions.controller'
import { TransactionsService } from './transactions.service'

@Module({
  providers: [TransactionsService, TransactionsController],
})
export class TransactionsModule {}
