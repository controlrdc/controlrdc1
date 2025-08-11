import React from 'react'
export function Tabs({ value, onValueChange, children, className='' }) {
  const ctx = { value, onValueChange }
  return <div className={className}>{React.Children.map(children, c => React.cloneElement(c, { __ctx: ctx }))}</div>
}
export function TabsList({ children, className='' }) { return <div className={`rounded-2xl bg-slate-100 p-1 flex gap-1 ${className}`}>{children}</div> }
export function TabsTrigger({ value, __ctx, children }) {
  const active = __ctx?.value === value
  return <button onClick={()=>__ctx?.onValueChange?.(value)} className={`px-3 py-1.5 rounded-2xl text-sm ${active?'bg-white shadow':'text-slate-600'}`}>{children}</button>
}
export function TabsContent({ value, __ctx, children, className='' }) {
  if (__ctx?.value !== value) return null
  return <div className={className}>{children}</div>
}
