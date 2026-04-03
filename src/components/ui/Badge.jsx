const variantMap = {
  income:  'bg-income/10 text-income',
  expense: 'bg-expense/10 text-expense',
  primary: 'bg-primary/10 text-primary',
  warning: 'bg-warning/10 text-warning',
  info:    'bg-info/10 text-info',
  purple:  'bg-violet/10 text-violet',
  neutral: 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400',
  admin:   'bg-violet/15 text-violet',
  viewer:  'bg-info/15 text-info',
};

export default function Badge({ children, variant = 'neutral', className = '', dot = false }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide whitespace-nowrap ${variantMap[variant] || variantMap.neutral} ${className}`}>
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}
