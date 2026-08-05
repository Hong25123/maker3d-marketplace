import { createContext, useContext, useState, useEffect } from 'react'

const AdminAuthContext = createContext(null)

const ADMIN_PASSWORD = 'admin123'
const STORAGE_KEY = 'maker3d_admin_auth'

export function AdminAuthProvider({ children }) {
  const [isAuthed, setIsAuthed] = useState(false)

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY)
      if (saved === '1') setIsAuthed(true)
    } catch {}
  }, [])

  const login = (password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (password === ADMIN_PASSWORD) {
          setIsAuthed(true)
          try { sessionStorage.setItem(STORAGE_KEY, '1') } catch {}
          resolve(true)
        } else {
          reject(new Error('密码错误'))
        }
      }, 400)
    })
  }

  const logout = () => {
    setIsAuthed(false)
    try { sessionStorage.removeItem(STORAGE_KEY) } catch {}
  }

  return (
    <AdminAuthContext.Provider value={{ isAuthed, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider')
  return ctx
}
