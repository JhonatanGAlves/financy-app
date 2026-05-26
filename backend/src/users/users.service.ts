import { Injectable } from '@nestjs/common'

import { PrismaService } from '@prisma-module/prisma.service'

import { UpdateProfileInput } from './dto/update-profile.dto'

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  me(userId: string) {
    return this.prisma.user.findUniqueOrThrow({ where: { id: userId } })
  }

  updateProfile(userId: string, input: UpdateProfileInput) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { name: input.name },
    })
  }
}
