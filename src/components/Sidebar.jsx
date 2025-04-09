// src/components/Sidebar.jsx
import { Home, Settings, LogOut } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Sidebar() {
  return (
    <aside className="w-64 bg-blue-700 text-white min-h-screen shadow-lg flex flex-col justify-between">
      <div>
        <div className="p-6 text-2xl font-bold border-b border-blue-800">
          Meu Painel
        </div>
        <nav className="flex flex-col gap-2 mt-4 px-4">
          <Link to="/" className="flex items-center gap-2 p-2 rounded hover:bg-blue-600 transition">
            <Home size={20} /> Dashboard
          </Link>
          <Link to="/settings" className="flex items-center gap-2 p-2 rounded hover:bg-blue-600 transition">
            <Settings size={20} /> Configurações
          </Link>
        </nav>
      </div>
      <div className="p-4 border-t border-blue-800">
        <button className="flex items-center gap-2 w-full text-left hover:bg-blue-600 p-2 rounded transition">
          <LogOut size={20} /> Sair
        </button>
      </div>
    </aside>
  )
}
