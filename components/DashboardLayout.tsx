
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Bell } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (t: string) => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#0B0B0B] text-white overflow-hidden">
      <Sidebar 
        collapsed={collapsed} 
        setCollapsed={setCollapsed} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 border-b border-white/5 bg-[#1A1A1A] flex items-center justify-between px-8 z-30">
          <h2 className="text-lg font-bold tracking-tight text-white uppercase opacity-80">
            {activeTab.replace('-', ' ')}
          </h2>
          <div className="flex items-center gap-6">
            <button className="relative p-2 hover:bg-white/5 rounded-full transition-colors group">
              <Bell size={20} className="text-gray-400 group-hover:text-[#F97316]" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#F97316] border-2 border-[#1A1A1A] rounded-full" />
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-8 bg-[#0B0B0B]">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
