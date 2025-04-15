import { Search, ChevronDown } from 'lucide-react'

export default function Topbar() {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white shadow-sm flex items-center px-6 z-50">
      {/* Logo à esquerda */}
      <div className="flex items-center">
        <img 
          src="/knapp_logo.svg.png" 
          alt="Logo Knapp" 
          className="h-10 w-auto"
        />
        <span className="ml-3 text-xl font-bold text-gray-800">KNAPP</span>
      </div>

      {/* Área de pesquisa central */}
      <div className="mx-6 flex-1 max-w-2xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Pesquisar..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#F3C300] focus:border-transparent"
          />
        </div>
      </div>

      {/* Usuário à direita */}
      <div className="flex items-center space-x-4">
        <div className="text-right">
          <p className="font-medium text-gray-800">Vinicius Polonio</p>
          <p className="text-sm text-gray-500">enm@mail.com</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-800 font-medium">
          VP
        </div>
        <ChevronDown className="text-gray-500" size={20} />
      </div>
    </header>
  )
}