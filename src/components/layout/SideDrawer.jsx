import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext.jsx'
import {
  X, ChevronRight, LogIn, Users, ImagePlus, Palette,
  Upload, Package, Settings, HelpCircle, Info,
  Zap, Star,
} from 'lucide-react'
import { Button } from '@/components/ui/Button.jsx'
import { cn } from '@/lib/utils'

const menuItems = [
  { to: '/community', icon: Users, label: '社区', desc: '浏览创作者动态与讨论' },
  { to: '/image-to-3d', icon: ImagePlus, label: '图生3D模型', desc: '上传图片一键生成3D模型', badge: '新' },
  { to: '/cloisonne', icon: Palette, label: '掐丝生成器', desc: '掐丝珐琅风格AI生成', badge: '热' },
  { to: '/share-model', icon: Upload, label: '模型分享', desc: '上传并分享你的作品' },
  { to: '/orders', icon: Package, label: '我的订单', desc: '查看订单与物流信息' },
  { to: '/settings', icon: Settings, label: '设置', desc: '账号与系统偏好' },
]

const bottomLinks = [
  { to: '/settings', label: '帮助中心' },
  { to: '/settings', label: '关于我们' },
]

export default function SideDrawer({ open, onClose, onLoginNeeded }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [open])

  const handleItemClick = (e, needsAuth) => {
    if (needsAuth && !user) {
      e.preventDefault()
      onClose?.()
      onLoginNeeded?.()
    }
  }

  return (
    <>
      {/* 遮罩 */}
      <div
        className={cn(
          'fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm transition-opacity duration-300',
          open ? 'opacity-100 animate-fade-in' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      {/* 抽屉面板 */}
      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 z-[80] w-[85%] max-w-[340px] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 h-9 w-9 rounded-full hover:bg-muted flex items-center justify-center transition"
          aria-label="关闭菜单"
        >
          <X size={20} className="text-secondary" />
        </button>

        {/* 用户区 */}
        <div className="pt-10 pb-6 px-6 bg-gradient-to-br from-primary/5 via-white to-accent/30 border-b border-border/60">
          {user ? (
            <Link to="/profile" onClick={(e) => handleItemClick(e, true)} className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={user.avatar}
                  alt="avatar"
                  className="h-16 w-16 rounded-full object-cover border-2 border-white shadow-md"
                />
                <span className="absolute -bottom-0.5 -right-0.5 h-5 w-5 rounded-full bg-[#34C759] border-2 border-white flex items-center justify-center">
                  <Star size={10} className="text-white" fill="currentColor" />
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-lg leading-tight truncate">{user.nickname}</div>
                <div className="text-xs text-secondary mt-1">{user.level}</div>
                <div className="mt-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-semibold">
                  <Zap size={12} />
                  {user.points} 积分
                </div>
              </div>
              <ChevronRight size={18} className="text-secondary" />
            </Link>
          ) : (
            <div>
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-3">
                <Zap size={28} className="text-secondary" />
              </div>
              <div className="font-bold text-lg mb-1">加入 Maker3D 大家庭</div>
              <div className="text-sm text-secondary mb-4">登录后发布作品、探索创意、赚取积分</div>
              <Button
                onClick={() => { onClose?.(); onLoginNeeded?.() }}
                className="gap-2"
              >
                <LogIn size={16} />
                登录 / 注册
              </Button>
            </div>
          )}
        </div>

        {/* 菜单列表 */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 no-scrollbar">
          {menuItems.map(item => (
            <Link
              key={item.to}
              to={item.to}
              onClick={(e) => handleItemClick(e, true)}
              className="group flex items-center gap-4 px-4 py-3.5 rounded-2xl hover:bg-muted transition-all duration-200 active:scale-[0.98]"
            >
              <div className="h-10 w-10 rounded-xl bg-muted group-hover:bg-white group-hover:shadow-sm flex items-center justify-center transition">
                <item.icon size={20} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">{item.label}</span>
                  {item.badge && (
                    <span className={cn(
                      'text-[10px] font-bold px-1.5 py-0.5 rounded-full',
                      item.badge === '新' && 'bg-[#34C759]/15 text-[#34C759]',
                      item.badge === '热' && 'bg-[#FF3B30]/15 text-[#FF3B30]',
                    )}>
                      {item.badge}
                    </span>
                  )}
                </div>
                <div className="text-xs text-secondary mt-0.5 truncate">{item.desc}</div>
              </div>
              <ChevronRight size={16} className="text-secondary opacity-0 group-hover:opacity-100 transition" />
            </Link>
          ))}
        </nav>

        {/* 底部链接 */}
        <div className="px-6 py-4 border-t border-border/60 space-y-3">
          <div className="flex items-center gap-4 text-xs text-secondary">
            {bottomLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-center gap-1 hover:text-foreground transition"
                onClick={onClose}
              >
                {link.label === '帮助中心' ? <HelpCircle size={13} /> : <Info size={13} />}
                {link.label}
              </Link>
            ))}
          </div>
          {user && (
            <button
              onClick={() => { logout(); onClose?.(); }}
              className="w-full text-xs text-[#FF3B30] py-2 rounded-xl hover:bg-[#FF3B30]/5 transition font-medium"
            >
              退出登录
            </button>
          )}
          <div className="text-[10px] text-secondary/70 text-center">
            Maker3D v1.0.0 · © 2026
          </div>
        </div>
      </aside>
    </>
  )
}
