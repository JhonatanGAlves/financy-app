import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class CategoryObject {
  @Field(() => ID)
  id!: string

  @Field()
  name!: string

  @Field()
  userId!: string

  @Field()
  createdAt!: Date

  @Field()
  updatedAt!: Date
}
