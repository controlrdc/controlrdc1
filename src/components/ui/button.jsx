export function Button({ children, variant='default', size='md', className='', ...props }) {
  const base = 'inline-flex items-center justify-center rounded-2xl px-3 py-2 text-sm transition border';
  const variants = {
    default: 'bg-slate-900 text-white border-slate-900 hover:opacity-90',
    secondary: 'bg-slate-100 text-slate-900 border-slate-200 hover:bg-slate-200',
    outline: 'bg-white text-slate-900 border-slate-300 hover:bg-slate-50',
    ghost: 'bg-transparent border-transparent hover:bg-slate-100',
  };
  const sizes = { sm: 'px-2 py-1 text-xs rounded-xl', md: '', lg: 'px-4 py-3 text-base' };
  return <button className={`${base} ${variants[variant]||variants.default} ${sizes[size]||''} ${className}`} {...props}>{children}</button>
}
