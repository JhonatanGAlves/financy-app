import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { PrismaService } from '@prisma-module/prisma.service'

import { CreateCategoryInput } from './dto/create-category.dto'
import { UpdateCategoryInput } from './dto/update-category.dto'

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  list(userId: string) {
    return this.prisma.category.findMany({ where: { userId } })
  }

  create(userId: string, input: CreateCategoryInput) {
    return this.prisma.category.create({ data: { name: input.name, userId } })
  }

  async update(userId: string, input: UpdateCategoryInput) {
    await this.assertOwnership(input.id, userId)
    return this.prisma.category.update({
      where: { id: input.id },
      data: { name: input.name },
    })
  }

  async delete(userId: string, id: string) {
    await this.assertOwnership(id, userId)
    await this.prisma.category.delete({ where: { id } })
    return true
  }

  private async assertOwnership(id: string, userId: string) {
    const category = await this.prisma.category.findUnique({ where: { id } })
    if (!category) throw new NotFoundException('Category not found')
    if (category.userId !== userId) throw new ForbiddenException()
  }
}
