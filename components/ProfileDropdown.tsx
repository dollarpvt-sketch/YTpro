import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const ProfileDropdown: React.FC = () => {
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!user) {
    return null;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center space-x-2">
        <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full border-2 border-primary" />
        <span className="text-text-main font-semibold hidden sm:inline">{user.name}</span>
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-card border border-secondary rounded-lg shadow-lg py-2 animate-fade-in-down">
          <a href="#" className="block px-4 py-2 text-text-secondary hover:bg-secondary">Tài khoản</a>
          <button onClick={() => { signOut(); setIsOpen(false); }} className="block w-full text-left px-4 py-2 text-text-secondary hover:bg-secondary">
            Đăng xuất
          </button>
        </div>
      )}
      <style>{`
        @keyframes fade-in-down {
          0% {
            opacity: 0;
            transform: translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ProfileDropdown;
