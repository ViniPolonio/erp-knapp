// src/components/NavSection.jsx
import { NavLink } from 'react-router-dom'

export default function NavSection({ title, items }) {
  return (
    <>
      <div className="text-xs text-gray-400 uppercase mt-6 mb-2 px-2">
        {title}
      </div>
      
      {items.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => 
            `flex items-center p-2 rounded-lg ${
              isActive ? 'bg-[#F3C300] text-black' : 'hover:bg-gray-700'
            }`
          }
        >
          <item.icon size={18} className="mr-2" />
          {item.label}
        </NavLink>
      ))}
    </>
  )
}