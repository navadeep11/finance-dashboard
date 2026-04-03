import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon, Shield, Eye, TrendingUp, Bell } from 'lucide-react';
import { setRole, toggleTheme, selectRole, selectTheme } from '../../app/auth/roleSlice';
import Badge from '../ui/Badge';

export default function Topbar({ onMenuToggle, collapsed }) {

  // Dispatch and store
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const role  = useSelector(selectRole);
  const theme = useSelector(selectTheme);
  
  // Offset for the sidebar
  const leftOffset = collapsed ? 'md:left-[72px]' : 'md:left-[260px]';

  return (
    <header className={`fixed top-0 right-0 left-0 ${leftOffset} h-16 z-[90]
      bg-white dark:bg-dark-card/95 backdrop-blur-sm
      border-b border-slate-200 dark:border-dark-border
      flex items-center justify-between px-6 gap-4
      transition-all duration-300`}
    >
      {/* Left */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
        <div className="md:hidden w-8 h-8 sm:w-9 sm:h-9 bg-primary rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-primary">
          <TrendingUp size={16} className="sm:w-[18px] sm:h-[18px]" />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">

        {/* Role switcher */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-dark-border rounded-full px-1.5 py-1 sm:px-3">
          <span className="hidden sm:inline text-xs text-slate-400 font-medium">Role:</span>
          <div className="flex gap-0.5 bg-slate-200 dark:bg-slate-700 rounded-full p-0.5">
            {[
              { value: 'admin',  label: 'Admin',  Icon: Shield },
              { value: 'viewer', label: 'Viewer', Icon: Eye },
            ].map(({ value, label, Icon }) => (
              <button
                key={value}
                id={`role-btn-${value}`}
                title={label}
                onClick={() => {
                  dispatch(setRole(value));
                  if (value === 'admin') navigate('/transactions');
                  else navigate('/');
                }}
                className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-150
                  ${role === value
                    ? 'bg-white dark:bg-slate-600 text-primary shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
              >
                <Icon size={14} className="sm:w-3 sm:h-3" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
          <div className="hidden lg:block">
            <Badge variant={role === 'admin' ? 'admin' : 'viewer'} dot>
              {role === 'admin' ? 'Admin' : 'Viewer'}
            </Badge>
          </div>
        </div>

        {/* Theme toggle */}
        <button
          id="theme-toggle-btn"
          onClick={() => dispatch(toggleTheme())}
          aria-label="Toggle theme"
          className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl text-slate-500 dark:text-slate-400
            hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          {theme === 'dark' ? <Sun size={16} className="sm:w-[18px] sm:h-[18px]" /> : <Moon size={16} className="sm:w-[18px] sm:h-[18px]" />}
        </button>

        {/* Bell */}
        <button className="relative w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl text-slate-500 dark:text-slate-400
            hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors" aria-label="Notifications">
          <Bell size={16} className="sm:w-[18px] sm:h-[18px]" />
          <span className="absolute top-1 sm:top-1.5 right-1 sm:right-1.5 w-2 h-2 bg-expense rounded-full border-2 border-white dark:border-dark-card" />
        </button>

        {/* Avatar */}
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-primary to-violet flex items-center justify-center
          text-white text-xs sm:text-sm font-bold cursor-pointer shadow-primary flex-shrink-0"
          aria-label="User profile"
        >
          N
        </div>
      </div>
    </header>
  );
}
