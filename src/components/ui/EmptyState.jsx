export default function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center gap-3 animate-fade-slide-up">
      {icon && (
        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 mb-2">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
      {description && (
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">{description}</p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
