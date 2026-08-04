import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext.jsx'
import { useToast } from '@/contexts/ToastContext.jsx'
import Card from '@/components/ui/Card.jsx'
import { Button } from '@/components/ui/Button.jsx'
import { Input } from '@/components/ui/Input.jsx'
import {
  Phone, ShieldCheck, ArrowLeft, X, CheckCircle2,
  UserPlus, LogIn, Sparkles, Apple, Chrome, Github
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function AuthPage({ mode = 'modal', onClose }) {
  const navigate = useNavigate()
  const { login, register } = useAuth()
  const { showToast } = useToast()

  const [tab, setTab] = useState('login') // login | register
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [nickname, setNickname] = useState('')
  const [agree, setAgree] = useState(true)
  const [countdown, setCountdown] = useState(0)
  const [sending, setSending] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [])

  const validPhone = /^1[3-9]\d{9}$/.test(phone)
  const validCode = /^\d{6}$/.test(code)

  const sendCode = () => {
    if (!validPhone) {
      showToast('请输入正确的手机号', 'warning')
      return
    }
    setSending(true)
    setTimeout(() => {
      setSending(false)
      setCountdown(60)
      showToast('验证码已发送，测试码：123456', 'success')
      timerRef.current = setInterval(() => {
        setCountdown(c => {
          if (c <= 1) {
            clearInterval(timerRef.current)
            return 0
          }
          return c - 1
        })
      }, 1000)
    }, 700)
  }

  const doSubmit = () => {
    if (!validPhone) return showToast('请输入正确的手机号', 'warning')
    if (!validCode) return showToast('请输入 6 位验证码', 'warning')
    if (!agree) return showToast('请先同意用户协议', 'warning')

    // 测试验证码：任何 6 位数字 + 真实手机号即可通过；或精确 123456
    if (code !== '123456' && code !== '000000') {
      // 为了演示更流畅，这里也允许通过（但提示）
      showToast('演示模式：验证码通过（正确应为 123456）', 'success')
    }

    setSubmitting(true)
    setTimeout(() => {
      const finalNickname = nickname.trim() || (tab === 'register' ? `创客${phone.slice(-4)}` : `用户${phone.slice(-4)}`)
      const userData = {
        phone,
        nickname: finalNickname,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(finalNickname)}`,
        level: tab === 'register' ? '新手创客' : '活跃用户',
        points: tab === 'register' ? 100 : 320,
      }
      if (tab === 'register') {
        register(userData)
        showToast('🎉 注册成功！欢迎加入，赠送 100 积分', 'success')
      } else {
        login(userData)
        showToast('登录成功，欢迎回来～', 'success')
      }
      setSubmitting(false)
      if (mode === 'modal') onClose?.()
      else navigate('/')
    }, 900)
  }

  const Wrapper = mode === 'modal'
    ? ({ children }) => (
      <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in" onClick={(e) => { if (e.target === e.currentTarget) onClose?.() }}>
        <div className="relative w-full md:max-w-md md:rounded-3xl rounded-t-3xl max-h-[92vh] overflow-y-auto bg-background shadow-2xl animate-slide-up">
          <button onClick={onClose} className="absolute top-3 right-3 h-9 w-9 rounded-full hover:bg-muted flex items-center justify-center text-secondary z-10">
            <X size={18} />
          </button>
          {children}
        </div>
      </div>
    )
    : ({ children }) => (
      <div className="min-h-screen flex flex-col">
        <div className="px-4 pt-4 flex items-center gap-2">
          <button onClick={() => navigate(-1)} className="h-9 w-9 rounded-full hover:bg-muted flex items-center justify-center text-secondary">
            <ArrowLeft size={18} />
          </button>
          <span className="text-sm font-semibold">返回</span>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-md p-0 overflow-hidden shadow-2xl">
            {children}
          </Card>
        </div>
      </div>
    )

  return (
    <Wrapper>
      {/* 顶部 Banner */}
      <div className="relative p-6 md:p-8 overflow-hidden bg-gradient-to-br from-[#2B7BD6] via-[#5E5CE6] to-[#AF52DE] text-white">
        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-20 -left-10 w-56 h-56 rounded-full bg-white/10 blur-2xl" />
        <div className="relative">
          <div className="h-12 w-12 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center mb-4 shadow-xl">
            <Sparkles size={22} />
          </div>
          <h2 className="text-2xl font-extrabold">
            {tab === 'register' ? '加入创作者社区' : '欢迎回来'}
          </h2>
          <p className="text-sm text-white/85 mt-1.5">
            {tab === 'register' ? '注册即送 100 积分，解锁全部功能' : '登录后即可发布作品、购买模型'}
          </p>
        </div>
      </div>

      <div className="p-5 md:p-7 space-y-5">
        {/* Tab */}
        <div className="flex p-1 bg-muted rounded-2xl">
          <button
            onClick={() => setTab('login')}
            className={cn(
              'flex-1 h-10 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-1.5',
              tab === 'login' ? 'bg-white text-primary shadow-card' : 'text-secondary hover:text-foreground'
            )}
          >
            <LogIn size={15} /> 登录
          </button>
          <button
            onClick={() => setTab('register')}
            className={cn(
              'flex-1 h-10 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-1.5',
              tab === 'register' ? 'bg-white text-primary shadow-card' : 'text-secondary hover:text-foreground'
            )}
          >
            <UserPlus size={15} /> 注册
          </button>
        </div>

        {/* 表单 */}
        <div className="space-y-4">
          {/* 手机号 */}
          <div>
            <label className="text-xs font-semibold text-secondary mb-1.5 ml-1 block">手机号</label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-2 pr-2.5 border-r border-border">
                <Phone size={16} className="text-primary" />
                <span className="text-sm font-bold">+86</span>
              </div>
              <Input
                type="tel"
                inputMode="numeric"
                maxLength={11}
                placeholder="请输入手机号"
                value={phone}
                onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                className="pl-[104px] h-13"
              />
            </div>
          </div>

          {/* 验证码 */}
          <div>
            <label className="text-xs font-semibold text-secondary mb-1.5 ml-1 block flex items-center gap-1">
              验证码
              <span className="text-[10px] text-[#FF9500] font-medium px-1.5 py-0.5 rounded bg-[#FF9500]/10">测试 123456</span>
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <ShieldCheck size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary" />
                <Input
                  type="tel"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="请输入 6 位验证码"
                  value={code}
                  onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
                  className="pl-11 h-13 tracking-[0.4em] font-mono"
                />
              </div>
              <Button
                variant="outline"
                className="h-13 px-4 shrink-0 min-w-[120px]"
                disabled={countdown > 0 || sending || !validPhone}
                onClick={sendCode}
              >
                {sending ? '发送中...' : countdown > 0 ? `${countdown}s 后重试` : '获取验证码'}
              </Button>
            </div>
          </div>

          {/* 注册：昵称 */}
          {tab === 'register' && (
            <div>
              <label className="text-xs font-semibold text-secondary mb-1.5 ml-1 block">昵称 (可选)</label>
              <Input
                placeholder="给自己取个好听的名字吧"
                value={nickname}
                onChange={e => setNickname(e.target.value)}
                maxLength={16}
                className="h-13"
              />
            </div>
          )}

          {/* 协议同意 */}
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <button
              type="button"
              onClick={() => setAgree(!agree)}
              className={cn(
                'mt-0.5 h-5 w-5 shrink-0 rounded-md border-2 flex items-center justify-center transition',
                agree ? 'bg-primary border-primary' : 'border-border/80 hover:border-primary/60'
              )}
            >
              {agree && <CheckCircle2 size={14} className="text-white -m-0.5" />}
            </button>
            <span className="text-xs text-secondary leading-6">
              我已阅读并同意
              <a className="text-primary font-medium hover:underline mx-0.5">《用户协议》</a>
              与
              <a className="text-primary font-medium hover:underline mx-0.5">《隐私政策》</a>
              ，并承诺上传内容符合相关法律法规
            </span>
          </label>

          {/* 提交 */}
          <Button
            className="w-full h-13 text-base font-bold gap-2 shadow-lg shadow-primary/25"
            size="lg"
            disabled={submitting || !validPhone || !validCode || !agree}
            onClick={doSubmit}
          >
            {submitting ? (
              <>提交中...</>
            ) : tab === 'register' ? (
              <><UserPlus size={17} /> 创建账号</>
            ) : (
              <><LogIn size={17} /> 登录</>
            )}
          </Button>
        </div>

        {/* 第三方登录（仅演示视觉） */}
        <div className="pt-1">
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/60" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-background px-3 text-[11px] text-secondary">其他登录方式</span>
            </div>
          </div>

          <div className="flex justify-center gap-3">
            {[
              { icon: Apple, label: 'Apple' },
              { icon: Chrome, label: 'Google' },
              { icon: Github, label: 'GitHub' },
            ].map(o => (
              <button
                key={o.label}
                onClick={() => showToast(`${o.label} 登录功能开发中，敬请期待～`, 'info')}
                className="group h-12 w-12 rounded-2xl bg-muted hover:bg-primary/10 hover:text-primary border border-border/60 flex items-center justify-center transition hover:-translate-y-0.5 shadow-sm"
                title={o.label + ' 登录'}
              >
                <o.icon size={18} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </Wrapper>
  )
}
