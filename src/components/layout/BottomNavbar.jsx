import { NavLink, useNavigate } from 'react-router-dom'
import { Home, Compass, MessageCircleHeart, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext.jsx'

const items = [
  { to: '/', icon: Home, label: '首页' },
  { to: '/explore', icon: Compass, label: '探索' },
  { to: '/community', icon: MessageCircleHeart, label: '社区' },
  { to: '/profile', icon: User, label: '我的' },
]

export default function BottomNavbar() {
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 backdrop-blur-md border-t border-border/60 safe-area-bottom">
      <div className="h-16 max-w-lg mx-auto px-2 flex items-center justify-around">
        {items.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={e => {
              // 拦截需要鉴权的tab
              if (!user && (item.to === '/profile')) {
                e.preventDefault()
                // App 层没有在此子组件直接触发 login 弹窗，我们跳转登录页也可以
                navigate('/login')
                return
              }
            }}
            className={({ isActive }) => cn(
              'flex-1 h-full flex flex-col items-center justify-center gap-0.5 transition-all duration-200',
            )}
          >
            {({ isActive }) => (
              <>
                <div
                  className={cn(
                    'p-1.5 rounded-xl transition-all duration-200',
                    isActive ? 'bg-primary/10 text-primary' : 'text-secondary hover:text-foreground'
                  )}
                >
                  <item.icon size={22} strokeWidth={isActive ? 2.4 : 2} />
                </div>
                <span
                  className={cn(
                    'text-[11px] font-medium transition-colors',
                    isActive ? 'text-primary' : 'text-secondary'
                  )}
                >
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
