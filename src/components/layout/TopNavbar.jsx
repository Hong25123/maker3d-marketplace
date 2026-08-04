import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext.jsx'
import {
  Menu, Search, ShoppingCart, User, X, ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function TopNavbar({ onMenuClick, onSearchClick, searchOpen, onLoginNeeded }) {
  const [searchText, setSearchText] = useState('')
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-border/60">
      {/* 顶部主导航栏 */}
      <div className="h-14 px-4 md:px-6 flex items-center justify-between gap-3 max-w-7xl mx-auto">
        {/* 左侧：汉堡菜单 */}
        <button
          onClick={onMenuClick}
          className="h-10 w-10 rounded-full hover:bg-muted flex items-center justify-center transition active:scale-95"
          aria-label="菜单"
        >
          <Menu size={22} className="text-foreground" strokeWidth={2.2} />
        </button>

        {/* 中间：Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-[#2B7BD6] to-[#6AA9E8] flex items-center justify-center shadow-sm group-hover:shadow-md transition">
            <span className="text-white font-black text-sm">M</span>
          </div>
          <span className="text-lg font-extrabold tracking-tight hidden sm:block">
            Maker<span className="text-primary">3D</span>
          </span>
        </Link>

        {/* 右侧：搜索/购物车/用户 */}
        <div className="flex items-center gap-1">
          <button
            onClick={onSearchClick}
            className={cn(
              "h-10 w-10 rounded-full hover:bg-muted flex items-center justify-center transition active:scale-95",
              searchOpen && "bg-accent text-primary"
            )}
            aria-label="搜索"
          >
            <Search size={20} />
          </button>
          <button
            onClick={() => {
              if (!user) return onLoginNeeded?.()
              navigate('/orders')
            }}
            className="relative h-10 w-10 rounded-full hover:bg-muted flex items-center justify-center transition active:scale-95"
            aria-label="购物车"
          >
            <ShoppingCart size={20} />
            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-[#FF3B30] text-white text-[10px] font-bold flex items-center justify-center">
              2
            </span>
          </button>
          <button
            onClick={() => {
              if (!user) return onLoginNeeded?.()
              navigate('/profile')
            }}
            className="h-10 w-10 rounded-full hover:bg-muted flex items-center justify-center transition active:scale-95 overflow-hidden"
            aria-label="用户中心"
          >
            {user?.avatar ? (
              <img src={user.avatar} alt="avatar" className="h-7 w-7 rounded-full object-cover" />
            ) : (
              <User size={20} />
            )}
          </button>
        </div>
      </div>

      {/* 搜索展开栏 */}
      {searchOpen && (
        <div className="px-4 md:px-6 pb-3 max-w-7xl mx-auto animate-fade-in">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" />
            <input
              autoFocus
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              placeholder="搜索模型、设计师或关键词"
              className="w-full h-12 rounded-2xl bg-muted pl-11 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
              onKeyDown={e => {
                if (e.key === 'Enter' && searchText.trim()) {
                  navigate(`/explore?q=${encodeURIComponent(searchText.trim())}`)
                  onSearchClick?.()
                }
              }}
            />
            {searchText && (
              <button
                onClick={() => setSearchText('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full hover:bg-background flex items-center justify-center"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
