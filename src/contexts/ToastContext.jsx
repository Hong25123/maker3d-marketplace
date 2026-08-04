import { createContext, useContext, useState, useCallback } from 'react'
import { cn } from '@/lib/utils'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((message, type = 'info', duration = 2500) => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, message, type }])
    if (duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id))
      }, duration)
    }
    return id
  }, [])

  const hideToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {/* Toast 容器 */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-2 pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={cn(
              "animate-fade-in px-5 py-3 rounded-full shadow-lg text-sm font-medium backdrop-blur-md",
              toast.type === 'success' && "bg-[#34C759]/95 text-white",
              toast.type === 'error' && "bg-[#FF3B30]/95 text-white",
              toast.type === 'warning' && "bg-[#FF9500]/95 text-white",
              toast.type === 'info' && "bg-[#1D1D1F]/90 text-white"
            )}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
