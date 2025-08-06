import React from 'react'
import {Router} from '@/router'
import {AuthProvider} from '@/lib/utils/user-auth'
import {QueryClient, QueryClientProvider} from 'react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false
    }
  }
})

export const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
