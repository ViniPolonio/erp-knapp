// src/components/Layout.jsx
import Sidebar from './Sidebar.jsx'
import Footer from './Footer.jsx'
import { Outlet } from 'react-router-dom'

function Layout({ children }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-4 bg-gray-100">
          {children || <Outlet />}
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default Layout
