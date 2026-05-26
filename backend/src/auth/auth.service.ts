import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { compare, hash } from 'bcryptjs'

import { PrismaService } from '@prisma-module/prisma.service'

import { LoginInput } from './dto/login.dto'
import { RegisterInput } from './dto/register.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async register(input: RegisterInput) {
    const existing = await this.prisma.user.findUnique({ where: { email: input.email } })
    if (existing) throw new ConflictException('Email already in use')

    const passwordHash = await hash(input.password, 10)
    const user = await this.prisma.user.create({
      data: { name: input.name, email: input.email, password: passwordHash },
    })

    return { accessToken: this.jwt.sign({ sub: user.id }) }
  }

  async login(input: LoginInput) {
    const user = await this.prisma.user.findUnique({ where: { email: input.email } })
    if (!user) throw new UnauthorizedException('Invalid credentials')

    const valid = await compare(input.password, user.password)
    if (!valid) throw new UnauthorizedException('Invalid credentials')

    return { accessToken: this.jwt.sign({ sub: user.id }) }
  }
}
