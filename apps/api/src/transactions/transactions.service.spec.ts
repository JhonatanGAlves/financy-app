import { ForbiddenException, NotFoundException } from '@nestjs/common'
import { Test } from '@nestjs/testing'

import { PrismaService } from '@prisma-module/prisma.service'

import { TransactionsService } from './transactions.service'

const mockPrisma = {
  transaction: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}

const userId = 'user-1'
const transactionId = 'tx-1'
const transaction = {
  id: transactionId,
  amount: 100,
  description: 'Salary',
  type: 'INCOME',
  categoryId: 'cat-1',
  userId,
  date: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
}

describe('TransactionsService', () => {
  let service: TransactionsService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TransactionsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile()

    service = module.get(TransactionsService)
    jest.clearAllMocks()
  })

  it('list returns only user transactions', async () => {
    mockPrisma.transaction.findMany.mockResolvedValue([transaction])
    const result = await service.list(userId)
    expect(result).toEqual([transaction])
    expect(mockPrisma.transaction.findMany).toHaveBeenCalledWith({
      where: { userId },
    })
  })

  it('create returns new transaction', async () => {
    mockPrisma.transaction.create.mockResolvedValue(transaction)
    const result = await service.create(userId, {
      amount: 100,
      description: 'Salary',
      type: 'INCOME',
      categoryId: 'cat-1',
      date: new Date(),
    })
    expect(result).toEqual(transaction)
  })

  describe('update', () => {
    it('updates and returns transaction', async () => {
      mockPrisma.transaction.findUnique.mockResolvedValue(transaction)
      mockPrisma.transaction.update.mockResolvedValue({
        ...transaction,
        amount: 200,
      })
      const result = await service.update(userId, {
        id: transactionId,
        amount: 200,
      })
      expect(result.amount).toBe(200)
    })

    it('throws NotFoundException when transaction does not exist', async () => {
      mockPrisma.transaction.findUnique.mockResolvedValue(null)
      await expect(
        service.update(userId, { id: transactionId }),
      ).rejects.toThrow(NotFoundException)
    })

    it('throws ForbiddenException when transaction belongs to another user', async () => {
      mockPrisma.transaction.findUnique.mockResolvedValue({
        ...transaction,
        userId: 'other',
      })
      await expect(
        service.update(userId, { id: transactionId }),
      ).rejects.toThrow(ForbiddenException)
    })
  })

  describe('delete', () => {
    it('deletes and returns true', async () => {
      mockPrisma.transaction.findUnique.mockResolvedValue(transaction)
      mockPrisma.transaction.delete.mockResolvedValue(transaction)
      const result = await service.delete(userId, transactionId)
      expect(result).toBe(true)
    })

    it('throws NotFoundException when transaction does not exist', async () => {
      mockPrisma.transaction.findUnique.mockResolvedValue(null)
      await expect(service.delete(userId, transactionId)).rejects.toThrow(
        NotFoundException,
      )
    })

    it('throws ForbiddenException when transaction belongs to another user', async () => {
      mockPrisma.transaction.findUnique.mockResolvedValue({
        ...transaction,
        userId: 'other',
      })
      await expect(service.delete(userId, transactionId)).rejects.toThrow(
        ForbiddenException,
      )
    })
  })
})
