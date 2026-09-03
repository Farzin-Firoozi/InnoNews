import { Outlet } from 'react-router'

import Footer from '@/components/Footer'
import Header from '@/components/Header'

const AppLayout = () => {
  return (
    <div id="top" className="bg-white min-h-screen">
      <Header />

      <Outlet />

      <Footer />
    </div>
  )
}

export default AppLayout
