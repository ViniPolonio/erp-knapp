import { Outlet } from 'react-router-dom'
import Topbar from './Topbar'
import Sidebar from './Sidebar'

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Topbar />
      
      <div className="flex flex-1 pt-16"> {/* Compensa a altura do Topbar */}
        <Sidebar />
        
        {/* Área de conteúdo principal */}
        <main className="flex-1 p-6 ml-64"> {/* ml-64 compensa a largura do Sidebar */}
          <Outlet />
        </main>
      </div>
    </div>
  )
}