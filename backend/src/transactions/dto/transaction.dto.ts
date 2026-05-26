import { Field, Float, ID, ObjectType, registerEnumType } from '@nestjs/graphql'

export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

registerEnumType(TransactionType, { name: 'TransactionType' })

@ObjectType()
export class TransactionObject {
  @Field(() => ID)
  id!: string

  @Field(() => Float)
  amount!: number

  @Field()
  description!: string

  @Field(() => TransactionType)
  type!: TransactionType

  @Field()
  categoryId!: string

  @Field()
  userId!: string

  @Field()
  date!: Date

  @Field()
  createdAt!: Date

  @Field()
  updatedAt!: Date
}
