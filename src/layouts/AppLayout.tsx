import { Outlet, ScrollRestoration } from 'react-router'

import Footer from '@/components/Footer'
import Header from '@/components/Header'

const AppLayout = () => {
  return (
    <div id="top" className="min-h-screen bg-white">
      <Header />

      <Outlet />

      <Footer />
      <ScrollRestoration />
    </div>
  )
}

export default AppLayout
