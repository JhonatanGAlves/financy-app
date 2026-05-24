import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from '@apollo/client'

import { env } from '@/config/env'

const TOKEN_KEY = 'financy:token'

const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) {
    operation.setContext(
      ({ headers = {} }: { headers: Record<string, string> }) => ({
        headers: {
          ...headers,
          authorization: `Bearer ${token}`,
        },
      }),
    )
  }
  return forward(operation)
})

const httpLink = new HttpLink({
  uri: `${env.VITE_BACKEND_URL}/graphql`,
})

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([authLink, httpLink]),
  cache: new InMemoryCache(),
})
