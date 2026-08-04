import { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { cva } from 'class-variance-authority'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm',
        secondary: 'bg-muted text-foreground hover:bg-muted/80',
        outline: 'border border-border bg-transparent hover:bg-muted text-foreground',
        ghost: 'hover:bg-muted text-foreground',
        destructive: 'bg-[#FF3B30] text-white hover:bg-[#FF3B30]/90',
        link: 'text-primary underline-offset-4 hover:underline p-0 h-auto',
      },
      size: {
        default: 'h-11 px-6',
        sm: 'h-9 px-4 text-xs',
        lg: 'h-13 px-8 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

const Button = forwardRef(function Button(
  { className, variant, size, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
})

export { Button, buttonVariants }
export default Button
