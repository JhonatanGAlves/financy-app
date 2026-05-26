import { UseGuards } from '@nestjs/common'
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql'

import { CurrentUser } from '@common/decorators/current-user.decorator'
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard'

import { CategoriesService } from './categories.service'
import { CategoryObject } from './dto/category.dto'
import { CreateCategoryInput } from './dto/create-category.dto'
import { UpdateCategoryInput } from './dto/update-category.dto'

@Resolver()
@UseGuards(JwtAuthGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Query(() => [CategoryObject])
  categories(@CurrentUser() user: { userId: string }) {
    return this.categoriesService.list(user.userId)
  }

  @Mutation(() => CategoryObject)
  createCategory(
    @CurrentUser() user: { userId: string },
    @Args('input') input: CreateCategoryInput,
  ) {
    return this.categoriesService.create(user.userId, input)
  }

  @Mutation(() => CategoryObject)
  updateCategory(
    @CurrentUser() user: { userId: string },
    @Args('input') input: UpdateCategoryInput,
  ) {
    return this.categoriesService.update(user.userId, input)
  }

  @Mutation(() => Boolean)
  deleteCategory(
    @CurrentUser() user: { userId: string },
    @Args('id', { type: () => ID }) id: string,
  ) {
    return this.categoriesService.delete(user.userId, id)
  }
}
