import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Plus, Settings } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const navItems = [
    { to: '/', icon: Home, label: '设备' },
    { to: '/add', icon: Plus, label: '添加' },
    { to: '/settings', icon: Settings, label: '设置' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-pb">
      <div className="flex justify-around items-center h-16">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full h-full touch-target transition-colors ${
                isActive
                  ? 'text-primary-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`
            }
          >
            <Icon size={22} />
            <span className="text-xs mt-0.5">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
