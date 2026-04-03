import { forwardRef } from 'react';

const Select = forwardRef(function Select(
  { label, error, options = [], className = '', id, placeholder = 'Select...', ...props }, ref
) {
  const selectId = id || `select-${Math.random().toString(36).slice(2, 7)}`;
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-slate-500 dark:text-slate-400">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          ref={ref}
          className={`w-full h-9 pl-3 pr-8 rounded-lg border text-sm appearance-none cursor-pointer
            bg-slate-100 dark:bg-dark-input text-slate-900 dark:text-slate-100 outline-none transition-all duration-150
            ${error
              ? 'border-expense focus:ring-2 focus:ring-expense/20'
              : 'border-slate-200 dark:border-dark-border focus:border-primary focus:ring-2 focus:ring-primary/15'}`}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) =>
            typeof opt === 'string'
              ? <option key={opt} value={opt}>{opt}</option>
              : <option key={opt.value} value={opt.value}>{opt.label}</option>
          )}
        </select>
        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">▾</span>
      </div>
      {error && <p className="text-xs text-expense">{error}</p>}
    </div>
  );
});

export default Select;
