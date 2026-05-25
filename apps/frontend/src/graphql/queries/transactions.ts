import { gql } from '@apollo/client'

export const GET_TRANSACTIONS = gql`
  query GetTransactions {
    transactions {
      id
      amount
      description
      type
      categoryId
      date
      createdAt
      updatedAt
    }
  }
`
