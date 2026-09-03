import { createBrowserRouter, Outlet, RouterProvider } from 'react-router'

import AppLayout from '@/layouts/AppLayout'
import DetailsPage from '@/pages/Details'
import HomePage from '@/pages/Home'
import NuqsProvider from '@/providers/Nuqs'

function Root() {
  return (
    <NuqsProvider>
      <Outlet />
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
