import { cn } from '@/lib/utils'

export function Card({ className, ...props }) {
  return (
    <div
      className={cn(
        'rounded-[16px] bg-card text-card-foreground shadow-card transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5',
        className
      )}
      {...props}
    />
  )
}

export function CardHeader({ className, ...props }) {
  return (
    <div className={cn('p-5 pb-3', className)} {...props} />
  )
}

export function CardTitle({ className, ...props }) {
  return (
    <h3 className={cn('text-lg font-bold leading-tight tracking-tight', className)} {...props} />
  )
}

export function CardDescription({ className, ...props }) {
  return (
    <p className={cn('text-sm text-secondary mt-1', className)} {...props} />
  )
}

export function CardContent({ className, ...props }) {
  return <div className={cn('p-5 pt-0', className)} {...props} />
}

export function CardFooter({ className, ...props }) {
  return (
    <div className={cn('p-5 pt-0 flex items-center', className)} {...props} />
  )
}

export default Card
