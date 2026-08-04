import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext.jsx'
import { useToast } from '@/contexts/ToastContext.jsx'
import Card from '@/components/ui/Card.jsx'
import { Button } from '@/components/ui/Button.jsx'
import { Input } from '@/components/ui/Input.jsx'
import {
  Settings, User, Shield, Bell, Moon, Sun, Globe, HelpCircle,
  Info, LogOut, ChevronRight, Check, Camera, AtSign,
  Lock, Eye, EyeOff, Palette, Mail, Smartphone, AlertTriangle
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function SettingsPage({ onLogout }) {
  const { user } = useAuth()
  const { showToast } = useToast()

  const [nickname, setNickname] = useState(user?.nickname || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [email, setEmail] = useState('')
  const [dark, setDark] = useState(false)
  const [notif, setNotif] = useState(true)
  const [lang, setLang] = useState('zh-CN')
  const [cacheSize] = useState('128.6 MB')
  const [showOldPwd, setShowOldPwd] = useState(false)
  const [showNewPwd, setShowNewPwd] = useState(false)
  const [oldPwd, setOldPwd] = useState('')
  const [newPwd, setNewPwd] = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')

  const Toggle = ({ checked, onChange, size = 'md' }) => {
    const sz = size === 'sm' ? 'h-5 w-9' : 'h-6 w-11'
    const knob = size === 'sm' ? 'h-3.5 w-3.5 left-0.5' : 'h-4.5 w-4.5 left-0.5'
    const onW = size === 'sm' ? 'left-[18px]' : 'left-[22px]'
    return (
      <button
        type="button"
        onClick={() => onChange?.(!checked)}
        className={cn(
          'relative inline-flex shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
          sz,
          checked ? 'bg-primary' : 'bg-muted'
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none inline-block transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out top-1/2 -translate-y-1/2 absolute',
            knob,
            checked ? onW : ''
          )}
        />
      </button>
    )
  }

  const saveProfile = () => {
    if (!nickname.trim()) return showToast('昵称不能为空', 'warning')
    showToast('个人资料已更新', 'success')
  }

  const changePwd = () => {
    if (!oldPwd || !newPwd || !confirmPwd) return showToast('请填写完整密码信息', 'warning')
    if (newPwd.length < 6) return showToast('新密码至少 6 位', 'warning')
    if (newPwd !== confirmPwd) return showToast('两次输入的新密码不一致', 'warning')
    setOldPwd(''); setNewPwd(''); setConfirmPwd('')
    showToast('密码修改成功', 'success')
  }

  const clearCache = () => {
    if (!confirm('确定要清除本地缓存数据吗？')) return
    showToast('缓存已清理', 'success')
  }

  const groups = [
    {
      title: '账号', icon: User, items: [
        { icon: User, label: '编辑资料', desc: nickname || '设置昵称、头像', onClick: () => showToast('已打开编辑面板（上方）', 'success') },
        { icon: Lock, label: '修改密码', desc: '定期修改密码更安全', onClick: () => showToast('已打开密码面板（上方）', 'success') },
        { icon: Smartphone, label: '绑定手机', desc: phone ? `已绑定 ${phone.slice(0, 3)}****${phone.slice(-4)}` : '未绑定', onClick: () => showToast('手机号绑定', 'info') },
        { icon: Mail, label: '绑定邮箱', desc: email || '未绑定（可用于找回密码）', onClick: () => showToast('邮箱绑定', 'info') },
      ]
    },
    {
      title: '偏好设置', icon: Palette, items: [
        {
          icon: dark ? Moon : Sun, label: '深色模式', desc: dark ? '当前：深色' : '当前：浅色',
          custom: <Toggle checked={dark} onChange={(v) => { setDark(v); showToast(v ? '已切换深色模式' : '已切换浅色模式', 'success') }} />
        },
        {
          icon: Bell, label: '消息通知', desc: notif ? '已开启推送' : '已关闭推送',
          custom: <Toggle checked={notif} onChange={(v) => { setNotif(v); showToast(v ? '通知已开启' : '通知已关闭', 'info') }} />
        },
        {
          icon: Globe, label: '语言', desc: lang === 'zh-CN' ? '简体中文' : 'English',
          custom: (
            <div className="flex gap-1 p-0.5 bg-muted rounded-lg">
              {[
                { k: 'zh-CN', l: '中文' }, { k: 'en-US', l: 'EN' },
              ].map(l => (
                <button
                  key={l.k}
                  onClick={() => { setLang(l.k); showToast('已切换到 ' + l.l, 'success') }}
                  className={cn(
                    'px-3 py-1 rounded-md text-xs font-semibold transition',
                    lang === l.k ? 'bg-white text-primary shadow-sm' : 'text-secondary hover:text-foreground'
                  )}
                >
                  {l.l}
                </button>
              ))}
            </div>
          )
        },
      ]
    },
    {
      title: '存储与帮助', icon: HelpCircle, items: [
        { icon: Shield, label: '隐私与安全', desc: '管理数据与权限', onClick: () => showToast('隐私设置页', 'info') },
        { icon: Info, label: '清除缓存', desc: `当前占用 ${cacheSize}`, onClick: clearCache },
        { icon: HelpCircle, label: '帮助中心', desc: '常见问题解答', onClick: () => showToast('跳转帮助中心...', 'info') },
        { icon: Info, label: '关于我们', desc: '版本 v1.0.0', onClick: () => showToast('3D创客空间 v1.0.0 · Made with ❤️', 'success') },
      ]
    },
  ]

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-5 space-y-5">
      {/* 标题 */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-[#5E5CE6] to-[#2B7BD6] text-white flex items-center justify-center shrink-0">
          <Settings size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold">账号设置</h1>
          <p className="text-xs text-secondary mt-0.5">管理个人信息、偏好与安全</p>
        </div>
      </div>

      {/* 个人信息卡片 */}
      <Card className="p-5 md:p-6 space-y-5">
        <div className="flex items-center gap-4">
          <div className="relative shrink-0 group">
            <img
              src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
              className="h-20 w-20 md:h-24 md:w-24 rounded-3xl bg-muted shadow-md"
              alt=""
            />
            <button
              onClick={() => showToast('头像上传选择中...（演示）', 'success')}
              className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center shadow-md hover:scale-110 transition"
            >
              <Camera size={14} />
            </button>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-lg md:text-xl font-bold truncate">{user?.nickname || '未登录用户'}</div>
            <div className="text-xs text-secondary mt-1 flex items-center gap-3 flex-wrap">
              <span className="inline-flex items-center gap-1">
                <AtSign size={12} /> {user?.phone ? `${user.phone.slice(0,3)}****${user.phone.slice(-4)}` : '未绑定'}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                {user?.level || '新手创客'}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#FF9500]/10 text-[#FF9500] text-[10px] font-bold">
                {user?.points || 0} 积分
              </span>
            </div>
          </div>
        </div>

        {/* 编辑资料表单 */}
        <div className="pt-2 border-t border-border/60 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-secondary mb-1.5 ml-1 block">昵称</label>
            <Input value={nickname} onChange={e => setNickname(e.target.value)} maxLength={16} className="h-12" />
          </div>
          <div>
            <label className="text-xs font-semibold text-secondary mb-1.5 ml-1 block">手机号</label>
            <Input value={phone} disabled className="h-12 bg-muted/60" />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs font-semibold text-secondary mb-1.5 ml-1 block">邮箱 (可选)</label>
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="h-12"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={saveProfile} className="gap-1.5">
            <Check size={15} /> 保存资料
          </Button>
        </div>
      </Card>

      {/* 修改密码 */}
      <Card className="p-5 md:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold flex items-center gap-2">
            <Lock size={16} className="text-primary" /> 修改密码
          </h3>
          <span className="text-xs text-secondary flex items-center gap-1">
            <AlertTriangle size={11} className="text-[#FF9500]" /> 建议每 3 个月更换一次
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <label className="text-xs font-semibold text-secondary mb-1.5 ml-1 block">当前密码</label>
            <Input
              type={showOldPwd ? 'text' : 'password'}
              value={oldPwd}
              onChange={e => setOldPwd(e.target.value)}
              className="h-12 pr-10"
              placeholder="输入当前密码"
            />
            <button onClick={() => setShowOldPwd(!showOldPwd)} className="absolute right-3 top-8 text-secondary hover:text-primary">
              {showOldPwd ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <div className="relative">
            <label className="text-xs font-semibold text-secondary mb-1.5 ml-1 block">新密码</label>
            <Input
              type={showNewPwd ? 'text' : 'password'}
              value={newPwd}
              onChange={e => setNewPwd(e.target.value)}
              className="h-12 pr-10"
              placeholder="至少 6 位"
            />
            <button onClick={() => setShowNewPwd(!showNewPwd)} className="absolute right-3 top-8 text-secondary hover:text-primary">
              {showNewPwd ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <div>
            <label className="text-xs font-semibold text-secondary mb-1.5 ml-1 block">确认新密码</label>
            <Input
              type="password"
              value={confirmPwd}
              onChange={e => setConfirmPwd(e.target.value)}
              className="h-12"
              placeholder="再次输入新密码"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button variant="outline" onClick={changePwd} className="gap-1.5">
            <Shield size={15} /> 确认修改
          </Button>
        </div>
      </Card>

      {/* 设置分组列表 */}
      <div className="space-y-4">
        {groups.map(g => {
          const Icon = g.icon
          return (
            <Card key={g.title} className="p-3 md:p-4">
              <div className="px-2 py-2 flex items-center gap-2">
                <Icon size={15} className="text-primary" />
                <span className="text-sm font-bold">{g.title}</span>
              </div>
              <div className="space-y-0.5">
                {g.items.map((it, i) => {
                  const I = it.icon
                  return (
                    <button
                      key={i}
                      onClick={it.onClick}
                      className={cn(
                        'w-full text-left flex items-center gap-3 p-3 rounded-xl transition group',
                        it.onClick ? 'hover:bg-muted' : ''
                      )}
                    >
                      <div className="h-9 w-9 shrink-0 rounded-xl bg-muted group-hover:bg-primary/10 group-hover:text-primary text-secondary flex items-center justify-center transition">
                        <I size={17} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold">{it.label}</div>
                        {it.desc && <div className="text-xs text-secondary mt-0.5 truncate">{it.desc}</div>}
                      </div>
                      {it.custom ?? (
                        it.onClick && <ChevronRight size={16} className="text-secondary shrink-0 group-hover:translate-x-0.5 transition" />
                      )}
                    </button>
                  )
                })}
              </div>
            </Card>
          )
        })}
      </div>

      {/* 退出登录 */}
      {user && (
        <Card className="p-3 md:p-4 overflow-hidden">
          <button
            onClick={() => { if (confirm('确定要退出登录吗？')) { onLogout?.(); showToast('已退出登录', 'success') } }}
            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[#FF3B30]/5 text-[#FF3B30] group transition"
          >
            <div className="h-9 w-9 shrink-0 rounded-xl bg-[#FF3B30]/10 group-hover:bg-[#FF3B30]/20 flex items-center justify-center">
              <LogOut size={17} />
            </div>
            <div className="flex-1 text-left">
              <div className="text-sm font-bold">退出当前账号</div>
              <div className="text-xs text-secondary mt-0.5">你需要重新登录才能发布内容</div>
            </div>
          </button>
        </Card>
      )}

      <div className="text-center py-4 text-xs text-secondary space-y-1">
        <div>3D 创客空间 v1.0.0</div>
        <div>© 2025 Maker World Clone · Made with ❤️</div>
      </div>
    </div>
  )
}
