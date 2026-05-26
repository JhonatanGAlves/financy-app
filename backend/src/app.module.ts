import { join } from 'path'

import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'

import { UsersModule } from '@users/users.module'

import { AuthModule } from '@auth/auth.module'
import { CategoriesModule } from '@categories/categories.module'
import { PrismaModule } from '@prisma-module/prisma.module'
import { TransactionsModule } from '@transactions/transactions.module'

const isDev = process.env.NODE_ENV !== 'production'

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      introspection: isDev,
      csrfPrevention: !isDev,
      playground: false,
    }),
    PrismaModule,
    AuthModule,
    CategoriesModule,
    TransactionsModule,
    UsersModule,
  ],
})
export class AppModule {}
