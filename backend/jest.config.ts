import type { Config } from 'jest'

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  setupFiles: ['dotenv/config'],
  moduleNameMapper: {
    '^@auth/(.*)$': '<rootDir>/auth/$1',
    '^@categories/(.*)$': '<rootDir>/categories/$1',
    '^@transactions/(.*)$': '<rootDir>/transactions/$1',
    '^@prisma-module/(.*)$': '<rootDir>/prisma/$1',
    '^@common/(.*)$': '<rootDir>/common/$1',
    '^@config/(.*)$': '<rootDir>/config/$1',
  },
}

export default config
