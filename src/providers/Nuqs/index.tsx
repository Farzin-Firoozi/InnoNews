import type { FC, PropsWithChildren } from 'react'

import { NuqsAdapter } from 'nuqs/adapters/react-router/v7'

const NuqsProvider: FC<PropsWithChildren> = (props) => {
  const { children } = props

  return <NuqsAdapter>{children}</NuqsAdapter>
}

export default NuqsProvider
