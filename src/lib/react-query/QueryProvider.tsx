import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {Children, ReactNode} from 'react'

const queryClient = new QueryClient();

export const QueryProvider = ({children}: {children: ReactNode}) => {
  return (
    <QueryClientProvider client={queryClient}>
        {children}
    </QueryClientProvider>
  )
}

export default QueryProvider