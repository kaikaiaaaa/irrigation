import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { MobileNav } from './MobileNav';
import { DesktopSidebar } from './DesktopSidebar';

export const AppLayout: React.FC = () => {
  const location = useLocation();
  
  // 隐藏导航栏的页面
  const hideNavPaths = ['/add'];
  const showNav = !hideNavPaths.includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* 桌面端侧边栏 */}
      <div className="hidden md:flex">
        <DesktopSidebar />
        <main className="flex-1 ml-64 p-6 pb-24">
          <Outlet />
        </main>
      </div>

      {/* 移动端布局 */}
      <div className="md:hidden flex flex-col min-h-screen">
        <main className="flex-1 p-4 pb-24">
          <Outlet />
        </main>
        {showNav && <MobileNav />}
      </div>
    </div>
  );
};
