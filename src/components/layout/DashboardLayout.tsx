import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { ToastContainer } from '../ui/Toast';

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-bark-dark">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main content area */}
      <motion.main
        className="min-h-screen transition-all duration-300"
        animate={{
          marginLeft: sidebarCollapsed ? 72 : 240,
        }}
      >
        {/* Page content */}
        <div className="min-h-screen">
          {children || <Outlet />}
        </div>
      </motion.main>

      {/* Toast notifications */}
      <ToastContainer />
    </div>
  );
};

export default DashboardLayout;
