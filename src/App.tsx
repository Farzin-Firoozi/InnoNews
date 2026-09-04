import { lazy, Suspense } from 'react'
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router'

import AppLayout from '@/layouts/AppLayout'
import NuqsProvider from '@/providers/Nuqs'

const HomePage = lazy(() => import('@/pages/Home'))
const DetailsPage = lazy(() => import('@/pages/Details'))

function Root() {
  return (
    <NuqsProvider>
      <Suspense fallback={null}>
        <Outlet />
      </Suspense>
    </NuqsProvider>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      {
        Component: AppLayout,
        children: [
          { index: true, Component: HomePage },
          { path: 'article/:source/:id', Component: DetailsPage },
        ],
      },
    ],
  },
])

const App = () => {
  return <RouterProvider router={router} />
}

export default App
