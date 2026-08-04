import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import TopNavbar from '@/components/layout/TopNavbar.jsx'
import BottomNavbar from '@/components/layout/BottomNavbar.jsx'
import SideDrawer from '@/components/layout/SideDrawer.jsx'
import LoginModal from '@/components/ui/LoginModal.jsx'
import HomePage from '@/pages/HomePage.jsx'
import CommunityPage from '@/pages/CommunityPage.jsx'
import ImageTo3DPage from '@/pages/ImageTo3DPage.jsx'
import CloisonnePage from '@/pages/CloisonnePage.jsx'
import ShareModelPage from '@/pages/ShareModelPage.jsx'
import OrdersPage from '@/pages/OrdersPage.jsx'
import SettingsPage from '@/pages/SettingsPage.jsx'
import ExplorePage from '@/pages/ExplorePage.jsx'
import ProductDetailPage from '@/pages/ProductDetailPage.jsx'
import AuthPage from '@/pages/AuthPage.jsx'
import { useAuth } from '@/contexts/AuthContext.jsx'

export default function App() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { logout } = useAuth()

  // 监听路由变化，关闭抽屉
  useEffect(() => {
    setDrawerOpen(false)
  }, [location.pathname])

  // 需要鉴权的路径触发登录弹窗（也可以通过requireAuth守卫触发）
  const guardedAction = (callback) => {
    // 交给 AuthContext.requireAuth，我们在 component 内捕获 NEED_LOGIN 错误
    try {
      return callback()
    } catch (e) {
      if (e.message === 'NEED_LOGIN') {
        setLoginOpen(true)
      } else {
        throw e
      }
    }
  }

  // 登录/注册页面隐藏底部导航和侧边菜单
  const isAuthPage = location.pathname === '/login'
  const hideBottomNav = isAuthPage

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {!isAuthPage && (
        <TopNavbar
          onMenuClick={() => setDrawerOpen(true)}
          onSearchClick={() => setSearchOpen(v => !v)}
          searchOpen={searchOpen}
          onLoginNeeded={() => setLoginOpen(true)}
        />
      )}

      <main className={hideBottomNav ? "flex-1" : "flex-1 pb-20 md:pb-6"}>
        <Routes>
          <Route path="/" element={<HomePage onLoginNeeded={() => setLoginOpen(true)} />} />
          <Route path="/explore" element={<ExplorePage onLoginNeeded={() => setLoginOpen(true)} />} />
          <Route path="/community" element={<CommunityPage onLoginNeeded={() => setLoginOpen(true)} />} />
          <Route path="/image-to-3d" element={<ImageTo3DPage onLoginNeeded={() => setLoginOpen(true)} />} />
          <Route path="/cloisonne" element={<CloisonnePage onLoginNeeded={() => setLoginOpen(true)} />} />
          <Route path="/share-model" element={<ShareModelPage onLoginNeeded={() => setLoginOpen(true)} />} />
          <Route path="/orders" element={<OrdersPage onLoginNeeded={() => setLoginOpen(true)} onNavigate={navigate} />} />
          <Route path="/settings" element={<SettingsPage onLogout={logout} />} />
          <Route path="/product/:id" element={<ProductDetailPage onLoginNeeded={() => setLoginOpen(true)} />} />
          <Route path="/login" element={<AuthPage mode="page" />} />
          <Route path="*" element={<HomePage onLoginNeeded={() => setLoginOpen(true)} />} />
        </Routes>
      </main>

      {!hideBottomNav && <BottomNavbar />}

      <SideDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onLoginNeeded={() => setLoginOpen(true)} />

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </div>
  )
}
