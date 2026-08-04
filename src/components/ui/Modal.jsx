import { useEffect } from 'react'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'

export function Modal({ open, onClose, children, className, title }) {
  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (e.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[80] flex items-end md:items-center justify-center p-0 md:p-6 animate-fade-in">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={cn(
          'relative z-10 w-full max-w-md bg-white rounded-t-[24px] md:rounded-[24px] shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto',
          className
        )}
      >
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 className="text-lg font-bold">{title}</h2>
            <button
              onClick={onClose}
              className="h-8 w-8 rounded-full hover:bg-muted flex items-center justify-center transition"
              aria-label="close"
            >
              <X size={18} className="text-secondary" />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  )
}

export default Modal
