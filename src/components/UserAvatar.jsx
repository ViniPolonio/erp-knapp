import { ChevronDown } from "lucide-react";

// src/components/UserAvatar.jsx
export default function UserAvatar() {
    return (
      <div className="flex items-center space-x-1">
        <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-white font-bold text-sm">
          VP
        </div>
        <ChevronDown size={16} className="text-gray-700" />
      </div>
    )
  }