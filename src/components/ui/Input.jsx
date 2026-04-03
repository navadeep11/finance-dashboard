import { forwardRef } from 'react';

const Input = forwardRef(function Input(
  { label, error, hint, leftIcon, rightIcon, className = '', id, ...props }, ref
) {
  const inputId = id || `input-${Math.random().toString(36).slice(2, 7)}`;
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-slate-500 dark:text-slate-400">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leftIcon && (
          <span className="absolute left-2.5 flex items-center text-slate-400 pointer-events-none">
            {leftIcon}
          </span>
        )}
        <input
          id={inputId}
          ref={ref}
          className={`w-full h-9 rounded-lg border text-sm bg-slate-100 dark:bg-dark-input text-slate-900 dark:text-slate-100
            placeholder:text-slate-400 outline-none transition-all duration-150
            ${error
              ? 'border-expense focus:ring-2 focus:ring-expense/20'
              : 'border-slate-200 dark:border-dark-border focus:border-primary focus:ring-2 focus:ring-primary/15 focus:bg-white dark:focus:bg-dark-input'}
            ${leftIcon  ? 'pl-9'  : 'pl-3'}
            ${rightIcon ? 'pr-9'  : 'pr-3'}`}
          {...props}
        />
        {rightIcon && (
          <span className="absolute right-2.5 flex items-center text-slate-400">
            {rightIcon}
          </span>
        )}
      </div>
      {error && <p className="text-xs text-expense">{error}</p>}
      {hint && !error && <p className="text-xs text-slate-400">{hint}</p>}
    </div>
  );
});

export default Input;
