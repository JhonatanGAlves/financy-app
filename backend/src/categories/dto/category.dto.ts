import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class CategoryObject {
  @Field(() => ID)
  id!: string

  @Field()
  name!: string

  @Field({ nullable: true })
  description?: string

  @Field()
  icon!: string

  @Field()
  color!: string

  @Field()
  userId!: string

  @Field()
  createdAt!: Date

  @Field()
  updatedAt!: Date
}
