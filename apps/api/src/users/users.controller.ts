import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { CurrentUser } from '@common/decorators/current-user.decorator'
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard'

import { UpdateProfileInput } from './dto/update-profile.dto'
import { UserObject } from './dto/user.dto'
import { UsersService } from './users.service'

@Resolver()
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => UserObject)
  me(@CurrentUser() user: { userId: string }) {
    return this.usersService.me(user.userId)
  }

  @Mutation(() => UserObject)
  updateProfile(
    @CurrentUser() user: { userId: string },
    @Args('input') input: UpdateProfileInput,
  ) {
    return this.usersService.updateProfile(user.userId, input)
  }
}
