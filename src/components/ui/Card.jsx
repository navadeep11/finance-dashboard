export default function Card({ children, className = '', glass = false, hover = false, padding = true, ...props }) {
  return (
    <div
      className={`
        rounded-2xl border transition-all duration-200
        ${glass
          ? 'bg-white/5 backdrop-blur-xl border-white/10 dark:bg-white/4'
          : 'bg-white dark:bg-dark-card border-slate-200 dark:border-dark-border shadow-sm'}
        ${hover ? 'hover:shadow-md hover:-translate-y-0.5 hover:border-primary/40' : ''}
        ${padding ? 'p-6' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

// card header
export function CardHeader({ children, className = '', action }) {
  return (
    <div className={`flex items-start justify-between gap-4 mb-5 ${className}`}>
      <div className="flex-1">{children}</div>
      {action && <div className="flex-shrink-0 flex items-center gap-2">{action}</div>}
    </div>
  );
}

// card title
export function CardTitle({ children, className = '' }) {
  return <h3 className={`text-base font-semibold text-slate-900 dark:text-slate-100 leading-tight ${className}`}>{children}</h3>;
}

// card subtitle
export function CardSubtitle({ children, className = '' }) {
  return <p className={`text-sm text-slate-500 dark:text-slate-400 mt-0.5 ${className}`}>{children}</p>;
}

// card body
export function CardBody({ children, className = '' }) {
  return <div className={className}>{children}</div>;
}
