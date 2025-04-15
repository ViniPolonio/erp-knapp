import { Bell } from "lucide-react";

// src/components/NotificationBadge.jsx
export default function NotificationBadge({ count }) {
    return (
      <div className="relative">
        <Bell size={20} className="text-gray-700 hover:text-black" />
        {count > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
            {count}
          </span>
        )}
      </div>
    )
  }