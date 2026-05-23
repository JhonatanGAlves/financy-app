import { Args, Mutation, Resolver } from '@nestjs/graphql'

import { AuthService } from './auth.service'
import { AuthResponse } from './dto/auth-response.dto'
import { LoginInput } from './dto/login.dto'
import { RegisterInput } from './dto/register.dto'

@Resolver()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponse)
  register(@Args('input') input: RegisterInput) {
    return this.authService.register(input)
  }

  @Mutation(() => AuthResponse)
  login(@Args('input') input: LoginInput) {
    return this.authService.login(input)
  }
}
