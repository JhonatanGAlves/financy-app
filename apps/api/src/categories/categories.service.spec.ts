import { ForbiddenException, NotFoundException } from '@nestjs/common'
import { Test } from '@nestjs/testing'

import { PrismaService } from '@prisma-module/prisma.service'

import { CategoriesService } from './categories.service'

const mockPrisma = {
  category: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}

const userId = 'user-1'
const categoryId = 'cat-1'
const category = {
  id: categoryId,
  name: 'Food',
  userId,
  createdAt: new Date(),
  updatedAt: new Date(),
}

describe('CategoriesService', () => {
  let service: CategoriesService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CategoriesService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile()

    service = module.get(CategoriesService)
    jest.clearAllMocks()
  })

  it('list returns only user categories', async () => {
    mockPrisma.category.findMany.mockResolvedValue([category])
    const result = await service.list(userId)
    expect(result).toEqual([category])
    expect(mockPrisma.category.findMany).toHaveBeenCalledWith({
      where: { userId },
    })
  })

  it('create returns new category', async () => {
    mockPrisma.category.create.mockResolvedValue(category)
    const result = await service.create(userId, { name: 'Food' })
    expect(result).toEqual(category)
  })

  describe('update', () => {
    it('updates and returns category', async () => {
      mockPrisma.category.findUnique.mockResolvedValue(category)
      mockPrisma.category.update.mockResolvedValue({
        ...category,
        name: 'Groceries',
      })
      const result = await service.update(userId, {
        id: categoryId,
        name: 'Groceries',
      })
      expect(result.name).toBe('Groceries')
    })

    it('throws NotFoundException when category does not exist', async () => {
      mockPrisma.category.findUnique.mockResolvedValue(null)
      await expect(
        service.update(userId, { id: categoryId, name: 'X' }),
      ).rejects.toThrow(NotFoundException)
    })

    it('throws ForbiddenException when category belongs to another user', async () => {
      mockPrisma.category.findUnique.mockResolvedValue({
        ...category,
        userId: 'other-user',
      })
      await expect(
        service.update(userId, { id: categoryId, name: 'X' }),
      ).rejects.toThrow(ForbiddenException)
    })
  })

  describe('delete', () => {
    it('deletes and returns true', async () => {
      mockPrisma.category.findUnique.mockResolvedValue(category)
      mockPrisma.category.delete.mockResolvedValue(category)
      const result = await service.delete(userId, categoryId)
      expect(result).toBe(true)
    })

    it('throws NotFoundException when category does not exist', async () => {
      mockPrisma.category.findUnique.mockResolvedValue(null)
      await expect(service.delete(userId, categoryId)).rejects.toThrow(
        NotFoundException,
      )
    })

    it('throws ForbiddenException when category belongs to another user', async () => {
      mockPrisma.category.findUnique.mockResolvedValue({
        ...category,
        userId: 'other-user',
      })
      await expect(service.delete(userId, categoryId)).rejects.toThrow(
        ForbiddenException,
      )
    })
  })
})
