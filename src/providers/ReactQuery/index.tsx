import type { FC, PropsWithChildren } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient()

const ReactQueryProvider: FC<PropsWithChildren> = (props) => {
  const { children } = props

  return (
    <QueryClientProvider client={queryClient}>
      <>{children}</>

      {import.meta.env.DEV && <ReactQueryDevtools />}
    </QueryClientProvider>
  )
}

export default ReactQueryProvider
