import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';


// Page titles for the layout
const PAGE_TITLES = {
  '/':             'Dashboard',
  '/transactions': 'Transactions',
  '/insights':     'Insights',
};


// Hook to check if the screen is desktop size
function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 768);
  useEffect(() => {
    const handler = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return isDesktop;
}


// Layout component
export default function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const isDesktop = useIsDesktop();
  const location  = useLocation();

  // Getting page title based on the current location
  const pageTitle = PAGE_TITLES[location.pathname] || 'Finance Dashboard';

  // Calculating sidebar offset based on screen size and collapsed state
  const sidebarOffset = isDesktop ? (collapsed ? 72 : 260) : 0;

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-dark-bg">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <div
        className="flex-1 min-h-screen transition-[margin] duration-300"
        style={{ marginLeft: sidebarOffset }}
      >
        <Topbar
          onMenuToggle={() => setCollapsed((c) => !c)}
          collapsed={collapsed}
        />
        <main className="pt-16 pb-20 md:pb-0 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
