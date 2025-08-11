export function Badge({ children, variant='secondary', className='' }) {
  const variants = {
    secondary: 'bg-slate-100 text-slate-900',
    destructive: 'bg-red-100 text-red-800',
  };
  return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${variants[variant]||''} ${className}`}>{children}</span>
}
