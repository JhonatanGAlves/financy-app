import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'

import { env } from '@/config/env'

const httpLink = new HttpLink({
  uri: `${env.VITE_BACKEND_URL}/graphql`,
  credentials: 'include',
})

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
})
