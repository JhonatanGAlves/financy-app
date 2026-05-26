import { ConflictException, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'

import * as bcryptjs from 'bcryptjs'

import { PrismaService } from '@prisma-module/prisma.service'

import { AuthService } from './auth.service'

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}))

const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
}

const mockJwt = {
  sign: jest.fn().mockReturnValue('token'),
}

describe('AuthService', () => {
  let service: AuthService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwt },
      ],
    }).compile()

    service = module.get(AuthService)
    jest.clearAllMocks()
  })

  describe('register', () => {
    it('creates user and returns token', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null)
      mockPrisma.user.create.mockResolvedValue({ id: 'user-1' })
      ;(bcryptjs.hash as jest.Mock).mockResolvedValue('hashed')

      const result = await service.register({
        name: 'John',
        email: 'j@test.com',
        password: '123456',
      })

      expect(result).toEqual({ accessToken: 'token' })
      expect(mockPrisma.user.create).toHaveBeenCalledWith({
        data: { name: 'John', email: 'j@test.com', password: 'hashed' },
      })
    })

    it('throws ConflictException when email already exists', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'user-1' })

      await expect(
        service.register({
          name: 'John',
          email: 'j@test.com',
          password: '123456',
        }),
      ).rejects.toThrow(ConflictException)
    })
  })

  describe('login', () => {
    it('returns token on valid credentials', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        password: 'hashed',
      })
      ;(bcryptjs.compare as jest.Mock).mockResolvedValue(true)

      const result = await service.login({
        email: 'j@test.com',
        password: '123456',
      })

      expect(result).toEqual({ accessToken: 'token' })
    })

    it('throws UnauthorizedException when user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null)

      await expect(
        service.login({ email: 'j@test.com', password: '123456' }),
      ).rejects.toThrow(UnauthorizedException)
    })

    it('throws UnauthorizedException when password is wrong', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        password: 'hashed',
      })
      ;(bcryptjs.compare as jest.Mock).mockResolvedValue(false)

      await expect(
        service.login({ email: 'j@test.com', password: 'wrong' }),
      ).rejects.toThrow(UnauthorizedException)
    })
  })
})
