import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ArrowLeftRight, Lightbulb, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';

// Navigation items for the sidebar
const navItems = [

  { to: '/',             label: 'Dashboard',    icon: LayoutDashboard },
  { to: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { to: '/insights',     label: 'Insights',     icon: Lightbulb },
];


// Sidebar component
export default function Sidebar({ collapsed, onToggle }) {
  return (
    <>
      {/* ── Desktop Sidebar ───────────────────────────────────── */}
      <aside className={`hidden md:flex fixed top-0 left-0 h-screen flex-col z-[100]
        bg-sidebar dark:bg-sidebar-dark border-r border-white/[0.06]
        transition-all duration-300 ease-in-out overflow-hidden
        ${collapsed ? 'w-[72px]' : 'w-[260px]'}`}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 px-5 h-16 border-b border-white/[0.06] flex-shrink-0">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-primary">
            <TrendingUp size={18} />
          </div>
          {!collapsed && (
            <span className="text-lg font-bold bg-gradient-to-r from-white to-primary-light bg-clip-text text-transparent whitespace-nowrap">
              FinTrack
            </span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1 px-3 py-4 flex-1" aria-label="Main navigation">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              title={collapsed ? label : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 overflow-hidden whitespace-nowrap
                ${isActive
                  ? 'bg-primary text-white shadow-primary'
                  : 'text-slate-400 hover:bg-white/[0.07] hover:text-white'}`
              }
            >
              <span className="flex-shrink-0"><Icon size={18} /></span>
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Collapse toggle */}
        <button
          onClick={onToggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="flex items-center gap-2 mx-3 mb-4 px-3 py-2.5 rounded-xl text-slate-400 text-sm font-medium
            hover:bg-white/[0.07] hover:text-white transition-all duration-150 whitespace-nowrap overflow-hidden"
        >
          {collapsed ? <ChevronRight size={16} /> : <><ChevronLeft size={16} /><span>Collapse</span></>}
        </button>
      </aside>

      {/* ── Mobile Bottom Nav ─────────────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-[72px] z-[200]
        bg-white dark:bg-dark-card border-t border-slate-200 dark:border-dark-border
        flex shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
        aria-label="Mobile navigation"
      >
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 flex-1 text-[10px] font-medium transition-colors duration-150
              ${isActive ? 'text-primary' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`
            }
          >
            <Icon size={20} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
}
