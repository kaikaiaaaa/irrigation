import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Plus, Settings, Droplets } from 'lucide-react';

export const DesktopSidebar: React.FC = () => {
  const navItems = [
    { to: '/', icon: Home, label: '我的设备' },
    { to: '/add', icon: Plus, label: '添加设备' },
    { to: '/settings', icon: Settings, label: '设置' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-50">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-primary-700 rounded-lg flex items-center justify-center">
            <Droplets className="text-white" size={24} />
          </div>
          <h1 className="text-xl font-bold text-gray-900">放心灌</h1>
        </div>

        <nav className="space-y-2">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <Icon size={20} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};
