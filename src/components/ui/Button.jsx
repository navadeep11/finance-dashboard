const variantMap = {
  primary:   'bg-primary text-white border border-primary hover:bg-primary-dark hover:shadow-primary active:scale-95 disabled:opacity-50',
  secondary: 'bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-600/60 hover:border-primary/50 active:scale-95 disabled:opacity-50',
  ghost:     'bg-transparent text-slate-500 dark:text-slate-400 border border-transparent hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white active:scale-95 disabled:opacity-50',
  danger:    'bg-expense/10 text-expense border border-expense/10 hover:bg-expense hover:text-white hover:shadow-expense active:scale-95 disabled:opacity-50',
  success:   'bg-income/10 text-income border border-income/10 hover:bg-income hover:text-white hover:shadow-income active:scale-95 disabled:opacity-50',
  outline:   'bg-transparent text-primary border border-primary hover:bg-primary/10 active:scale-95 disabled:opacity-50',
};

const sizeMap = {
  sm:   'px-3 h-8 text-xs rounded-md gap-1.5',
  md:   'px-4 h-9 text-sm rounded-lg gap-2',
  lg:   'px-6 h-11 text-base rounded-xl gap-2',
  icon: 'w-9 h-9 rounded-lg p-0',
};

export default function Button({
  children, variant = 'primary', size = 'md',
  className = '', disabled = false, loading = false,
  leftIcon, rightIcon, ...props
}) {
  return (
    <button
      className={`inline-flex items-center justify-center font-medium transition-all duration-150 cursor-pointer select-none whitespace-nowrap
        ${variantMap[variant] || variantMap.primary}
        ${sizeMap[size] || sizeMap.md}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {leftIcon  && <span className="inline-flex items-center">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="inline-flex items-center">{rightIcon}</span>}
        </>
      )}
    </button>
  );
}
