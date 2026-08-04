import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

const STORAGE_KEY = 'maker3d_user'

const mockUser = {
  id: '1',
  nickname: '创意设计师',
  phone: '138****8888',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maker3d',
  level: '资深创客',
  points: 2680,
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        setUser(JSON.parse(saved))
      }
    } catch (e) {
      console.error('Failed to load user', e)
    } finally {
      setLoading(false)
    }
  }, [])

  const login = (data, code) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // 支持两种调用方式：1) login(userData) 直接传对象；2) login(phone, code)
        const userData = typeof data === 'object' && data !== null ? data : (
          (data && code && String(code).length >= 4 ? { ...mockUser, phone: String(data).slice(0, 3) + '****' + String(data).slice(7) } : null)
        )
        if (userData) {
          setUser(userData)
          try { localStorage.setItem(STORAGE_KEY, JSON.stringify(userData)) } catch (e) {}
          resolve(userData)
        } else {
          reject(new Error('登录失败，请检查手机号和验证码'))
        }
      }, 600)
    })
  }

  const register = (userData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setUser(userData)
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(userData)) } catch (e) {}
        resolve(userData)
      }, 400)
    })
  }

  const logout = () => {
    setUser(null)
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (e) {}
  }

  // 鉴权守卫包装函数
  const requireAuth = (callback) => {
    if (!user) {
      throw new Error('NEED_LOGIN')
    }
    if (callback) return callback()
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, requireAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}
