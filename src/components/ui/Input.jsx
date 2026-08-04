import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

const Input = forwardRef(function Input(
  { className, type = 'text', ...props },
  ref
) {
  return (
    <input
      type={type}
      ref={ref}
      className={cn(
        'flex h-11 w-full rounded-xl border border-border bg-white px-4 py-2 text-sm text-foreground placeholder:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200',
        className
      )}
      {...props}
    />
  )
})

const Textarea = forwardRef(function Textarea(
  { className, ...props },
  ref
) {
  return (
    <textarea
      ref={ref}
      className={cn(
        'flex w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-foreground placeholder:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 resize-none min-h-[100px]',
        className
      )}
      {...props}
    />
  )
})

export { Input, Textarea }
export default Input
