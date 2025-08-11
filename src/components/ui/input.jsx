export function Input({ className='', ...props }) {
  return <input className={`w-full rounded-2xl border px-3 py-2 text-sm outline-none focus:ring-2 ring-slate-300 ${className}`} {...props} />
}
