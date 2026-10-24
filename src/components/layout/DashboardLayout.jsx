import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="dashboard-shell min-h-screen flex bg-[#f5f7fb] text-slate-900">
      {/* Overlay mobile quand la sidebar est ouverte */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-slate-950/30 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Navigation Latérale */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Zone de contenu principal */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <Topbar setIsOpen={setSidebarOpen} />
        
        <main className="mx-auto w-full max-w-7xl flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
