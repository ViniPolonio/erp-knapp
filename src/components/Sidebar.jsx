import { Home, Settings, UserPlus, CheckCircle } from 'lucide-react'
import { NavLink } from 'react-router-dom'

export default function Sidebar() {
  return (
    <aside className="fixed top-16 left-0 bottom-0 w-64 bg-white shadow-md p-4">
      <nav className="space-y-1">
        {/* Seção Dashboard */}
        <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Dashboard
        </div>
        
        <NavLink
          to="/approval"
          className={({ isActive }) =>
            `flex items-center px-3 py-2 rounded-lg ${
              isActive ? 'bg-[#F3C300] text-white' : 'text-gray-700 hover:bg-gray-100'
            }`
          }
        >
          <CheckCircle size={18} className="mr-3" />
          Aprovação
        </NavLink>
        
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center px-3 py-2 rounded-lg ${
              isActive ? 'bg-[#F3C300] text-white' : 'text-gray-700 hover:bg-gray-100'
            }`
          }
        >
          <Settings size={18} className="mr-3" />
          Configurações
        </NavLink>
        
        <NavLink
          to="/users"
          className={({ isActive }) =>
            `flex items-center px-3 py-2 rounded-lg ${
              isActive ? 'bg-[#F3C300] text-white' : 'text-gray-700 hover:bg-gray-100'
            }`
          }
        >
          <UserPlus size={18} className="mr-3" />
          Cadastrar usuários
        </NavLink>
      </nav>
    </aside>
  )
}