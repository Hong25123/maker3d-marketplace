import { useState, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext.jsx'
import { useToast } from '@/contexts/ToastContext.jsx'
import Card from '@/components/ui/Card.jsx'
import { Button } from '@/components/ui/Button.jsx'
import { Input, Textarea } from '@/components/ui/Input.jsx'
import {
  UploadCloud, FileType, Image as ImageIcon, Tag, Box,
  Check, DollarSign, Eye, Download, Trash2, Edit3, X, Plus,
  FileBox, Settings2, Heart, MessageSquare, Users, Clock
} from 'lucide-react'
import { cn } from '@/lib/utils'

const CATEGORIES = [
  { k: 'home', label: '🏠 家居' },
  { k: 'decor', label: '🎨 装饰' },
  { k: 'toy', label: '🎮 玩具' },
  { k: 'tool', label: '🔧 工具' },
  { k: 'fashion', label: '👗 时尚' },
  { k: 'art', label: '🖼️ 艺术' },
  { k: 'custom', label: '✨ 定制' },
]

const INITIAL_ITEMS = [
  {
    id: 1, title: '机械花（可动）', category: 'decor',
    price: 9.90, desc: '每一片花瓣都可独立开合，装饰性极强',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=3D%20printed%20articulated%20mechanical%20flower%20pink%20color%20product%20photo&image_size=square_hd',
    file: 'mechanical_flower_v2.stl', fileSize: '18.6 MB', status: 'published',
    stats: { views: 3256, downloads: 892, likes: 458, comments: 37 },
    publishedAt: '3天前',
  },
  {
    id: 2, title: '多功能手机支架', category: 'tool',
    price: 3.50, desc: '支持横屏竖屏，可调节角度，兼容 4.7-6.9 寸手机',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=3D%20printed%20phone%20stand%20holder%20minimal%20design%20product%20photo&image_size=square_hd',
    file: 'phone_stand_pro.stl', fileSize: '7.2 MB', status: 'published',
    stats: { views: 2130, downloads: 1245, likes: 302, comments: 19 },
    publishedAt: '7天前',
  },
  {
    id: 3, title: '敦煌纹样掐丝装饰盘', category: 'art',
    price: 12.00, desc: '传统敦煌配色，掐丝工艺纹样，可作为墙面或桌面装饰',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=3D%20printed%20dunhuang%20cloisonne%20style%20decorative%20plate%20product%20photo&image_size=square_hd',
    file: 'dunhuang_plate.obj', fileSize: '25.3 MB', status: 'draft',
    stats: { views: 0, downloads: 0, likes: 0, comments: 0 },
    publishedAt: '未发布',
  },
]

export default function ShareModelPage({ onLoginNeeded }) {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [items, setItems] = useState(INITIAL_ITEMS)
  const [tab, setTab] = useState('new') // new | my
  const [filter, setFilter] = useState('all')

  const modelRef = useRef(null)
  const coverRef = useRef(null)

  const [form, setForm] = useState({
    title: '', category: 'home', price: '0',
    desc: '', tags: [],
    modelFile: null, coverFile: null,
    modelPreview: null, coverPreview: null,
  })

  const [tagInput, setTagInput] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const guard = (fn) => { if (!user) return onLoginNeeded?.(); fn() }

  const update = (patch) => setForm({ ...form, ...patch })

  const onModelFile = (e) => {
    guard(() => {
      const f = e.target.files?.[0]
      if (!f) return
      const ok = /\.(stl|obj|3mf|gltf|glb)$/i.test(f.name)
      if (!ok) {
        showToast('仅支持 STL / OBJ / 3MF / GLTF / GLB 格式', 'error')
        return
      }
      if (f.size > 200 * 1024 * 1024) {
        showToast('模型文件不能超过 200MB', 'error')
        return
      }
      const icon = f.name.endsWith('.stl') ? 'STL' : f.name.endsWith('.obj') ? 'OBJ' : '3D'
      update({
        modelFile: f,
        modelPreview: { name: f.name, size: (f.size / 1024 / 1024).toFixed(2) + ' MB', icon },
      })
    })
  }

  const onCoverFile = (e) => {
    guard(() => {
      const f = e.target.files?.[0]
      if (!f) return
      if (!f.type.startsWith('image/')) {
        showToast('请选择图片文件', 'error')
        return
      }
      update({ coverFile: f, coverPreview: URL.createObjectURL(f) })
    })
  }

  const addTag = () => {
    const t = tagInput.trim()
    if (!t) return
    if (form.tags.length >= 6) {
      showToast('最多添加 6 个标签', 'warning')
      return
    }
    if (form.tags.includes(t)) return
    update({ tags: [...form.tags, t] })
    setTagInput('')
  }

  const removeTag = (t) => update({ tags: form.tags.filter(x => x !== t) })

  const submit = (isDraft = false) => {
    guard(() => {
      if (!form.title.trim()) return showToast('请输入模型名称', 'warning')
      if (!form.modelFile) return showToast('请上传模型文件', 'warning')
      if (!isDraft && !form.coverFile) return showToast('请上传封面图', 'warning')
      if (!isDraft && Number(form.price) < 0) return showToast('价格不能为负数', 'warning')

      setSubmitting(true)
      setTimeout(() => {
        const catLabel = CATEGORIES.find(c => c.k === form.category)?.label || form.category
        const newItem = {
          id: Date.now(),
          title: form.title,
          category: form.category,
          price: Number(form.price),
          desc: form.desc || '暂无描述',
          cover: form.coverPreview ||
            `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent('3D printed ' + form.title + ' product photo')}&image_size=square_hd`,
          file: form.modelPreview?.name || 'model.stl',
          fileSize: form.modelPreview?.size || 'N/A',
          status: isDraft ? 'draft' : 'published',
          stats: { views: 0, downloads: 0, likes: 0, comments: 0 },
          publishedAt: isDraft ? '未发布' : '刚刚',
        }
        setItems([newItem, ...items])
        // 重置表单
        setForm({
          title: '', category: 'home', price: '0',
          desc: '', tags: [],
          modelFile: null, coverFile: null,
          modelPreview: null, coverPreview: null,
        })
        setTab('my')
        setSubmitting(false)
        showToast(isDraft ? '草稿已保存' : '🎉 模型发布成功！', 'success')
      }, 900)
    })
  }

  const togglePublish = (id) => {
    setItems(items.map(it => it.id === id ? {
      ...it,
      status: it.status === 'published' ? 'draft' : 'published',
      publishedAt: it.status === 'published' ? '未发布' : '刚刚',
    } : it))
    showToast('状态已更新', 'success')
  }

  const delItem = (id) => {
    if (!confirm('确定要删除该模型吗？此操作不可恢复')) return
    setItems(items.filter(it => it.id !== id))
    showToast('删除成功', 'success')
  }

  const filteredItems = filter === 'all' ? items : items.filter(it => it.category === filter)
  const publishedCount = items.filter(i => i.status === 'published').length
  const totalDownloads = items.reduce((s, i) => s + i.stats.downloads, 0)
  const totalLikes = items.reduce((s, i) => s + i.stats.likes, 0)

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-5 space-y-6">
      {/* 标题 & 统计 */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold flex items-center gap-2">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-[#34C759] to-[#32ADE6] text-white flex items-center justify-center">
              <Box size={20} />
            </div>
            模型分享
          </h1>
          <p className="text-sm text-secondary mt-2">上传并分享你自己的 3D 模型，与全平台爱好者一起创造</p>
        </div>

        {/* 统计卡片组（仅在用户有数据时更有意义） */}
        <div className="grid grid-cols-3 gap-2 md:gap-3 shrink-0">
          {[
            { l: '已发布', v: publishedCount, icon: Check, c: 'from-[#34C759] to-[#32ADE6]' },
            { l: '累计下载', v: totalDownloads.toLocaleString(), icon: Download, c: 'from-[#2B7BD6] to-[#5E5CE6]' },
            { l: '累计点赞', v: totalLikes.toLocaleString(), icon: Heart, c: 'from-[#FF9500] to-[#FF3B30]' },
          ].map(s => {
            const I = s.icon
            return (
              <Card key={s.l} className="p-3 md:p-4 min-w-[108px]">
                <div className={cn('h-8 w-8 rounded-xl bg-gradient-to-br', s.c, 'text-white flex items-center justify-center mb-2')}>
                  <I size={15} />
                </div>
                <div className="text-lg md:text-xl font-extrabold">{s.v}</div>
                <div className="text-[11px] md:text-xs text-secondary mt-0.5">{s.l}</div>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Tab 切换 */}
      <div className="hide-scrollbar-x -mx-4 md:mx-0 px-4 md:px-0">
        <div className="flex gap-1 bg-muted p-1 rounded-2xl w-fit">
          {[
            { k: 'new', label: '📤 上传新模型' },
            { k: 'my', label: '📚 我的分享' },
          ].map(t => (
            <button
              key={t.k}
              onClick={() => setTab(t.k)}
              className={cn(
                'px-5 py-2 rounded-xl text-sm font-semibold transition whitespace-nowrap',
                tab === t.k ? 'bg-white text-primary shadow-card' : 'text-secondary hover:text-foreground'
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* =================== TAB: 上传新模型 =================== */}
      {tab === 'new' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-5">
            {/* 基本信息 */}
            <Card className="p-5 md:p-6 space-y-5">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Edit3 size={17} className="text-primary" /> 基本信息
              </h3>

              <div>
                <label className="text-sm font-semibold mb-1.5 block">模型名称 <span className="text-[#FF3B30]">*</span></label>
                <Input
                  value={form.title}
                  onChange={e => update({ title: e.target.value })}
                  onFocus={() => { if (!user) onLoginNeeded?.() }}
                  placeholder="如：可动机械花（升级版）"
                  maxLength={40}
                />
                <div className="text-right text-xs text-secondary mt-1">{form.title.length}/40</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold mb-1.5 block">所属分类 <span className="text-[#FF3B30]">*</span></label>
                  <select
                    value={form.category}
                    onChange={e => update({ category: e.target.value })}
                    className="w-full h-11 px-3.5 rounded-xl bg-muted border-2 border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 text-sm transition"
                  >
                    {CATEGORIES.map(c => <option key={c.k} value={c.k}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold mb-1.5 flex items-center gap-1">
                    <DollarSign size={14} className="text-primary" />
                    价格 (元)
                  </label>
                  <div className="relative">
                    <Input
                      type="number" min="0" step="0.5"
                      value={form.price}
                      onChange={e => update({ price: e.target.value })}
                      onFocus={() => { if (!user) onLoginNeeded?.() }}
                      placeholder="0 表示免费分享"
                      className="pl-8"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-sm">¥</span>
                  </div>
                  <div className="text-[11px] text-secondary mt-1">定价 0 元即为免费下载分享</div>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold mb-1.5 block">模型描述</label>
                <Textarea
                  value={form.desc}
                  onChange={e => update({ desc: e.target.value })}
                  onFocus={() => { if (!user) onLoginNeeded?.() }}
                  placeholder="介绍模型的设计理念、打印建议（耗材/层高/是否需要支撑）、使用场景等，帮助下载者更好地理解你的作品"
                  className="min-h-[130px] bg-muted/50 border-transparent focus:bg-white"
                  maxLength={500}
                />
                <div className="text-right text-xs text-secondary mt-1">{form.desc.length}/500</div>
              </div>

              <div>
                <label className="text-sm font-semibold mb-1.5 flex items-center gap-2">
                  <Tag size={14} className="text-primary" /> 标签 (最多 6 个)
                </label>
                <div className="flex flex-wrap gap-2 p-2 rounded-xl bg-muted min-h-[48px] items-center">
                  {form.tags.map(t => (
                    <span key={t} className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                      #{t}
                      <button onClick={() => removeTag(t)} className="h-4 w-4 rounded-full hover:bg-primary/20 flex items-center justify-center">
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                  <div className="flex items-center gap-2 flex-1 min-w-[140px]">
                    <input
                      value={tagInput}
                      onChange={e => setTagInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
                      onFocus={() => { if (!user) onLoginNeeded?.() }}
                      placeholder="回车添加标签..."
                      className="flex-1 h-8 px-3 rounded-lg bg-transparent text-sm focus:outline-none focus:bg-white"
                    />
                    <button
                      onClick={addTag}
                      className="h-7 w-7 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary flex items-center justify-center transition"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </Card>

            {/* 文件上传 */}
            <Card className="p-5 md:p-6 space-y-5">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <FileType size={17} className="text-primary" /> 上传文件
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 模型文件 */}
                <div>
                  <label className="text-sm font-semibold mb-2 flex items-center gap-1.5">
                    <FileBox size={14} />
                    模型文件 <span className="text-[#FF3B30]">*</span>
                  </label>
                  <input ref={modelRef} type="file" accept=".stl,.obj,.3mf,.gltf,.glb" onChange={onModelFile} className="hidden" />
                  {form.modelPreview ? (
                    <div
                      onClick={() => guard(() => modelRef.current?.click())}
                      className="rounded-2xl border-2 border-primary/50 bg-primary/5 p-4 cursor-pointer hover:bg-primary/10 transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-[#2B7BD6] to-[#5E5CE6] text-white flex items-center justify-center font-black text-lg shadow-md">
                          {form.modelPreview.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold truncate">{form.modelPreview.name}</div>
                          <div className="text-xs text-secondary mt-0.5">{form.modelPreview.size}</div>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); update({ modelFile: null, modelPreview: null }) }}
                          className="h-7 w-7 rounded-full hover:bg-black/5 text-secondary flex items-center justify-center"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => guard(() => modelRef.current?.click())}
                      className="rounded-2xl border-2 border-dashed border-border bg-muted/40 hover:border-primary/50 hover:bg-primary/5 p-8 text-center cursor-pointer transition-all duration-300 h-full flex flex-col items-center justify-center"
                    >
                      <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                        <UploadCloud size={22} />
                      </div>
                      <div className="text-sm font-semibold">上传模型文件</div>
                      <div className="text-xs text-secondary mt-1">STL / OBJ / 3MF，最大 200MB</div>
                    </div>
                  )}
                </div>

                {/* 封面图 */}
                <div>
                  <label className="text-sm font-semibold mb-2 flex items-center gap-1.5">
                    <ImageIcon size={14} />
                    封面图
                  </label>
                  <input ref={coverRef} type="file" accept="image/*" onChange={onCoverFile} className="hidden" />
                  {form.coverPreview ? (
                    <div
                      onClick={() => guard(() => coverRef.current?.click())}
                      className="relative rounded-2xl overflow-hidden border-2 border-primary/50 aspect-[4/3] cursor-pointer group"
                    >
                      <img src={form.coverPreview} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 text-white text-sm font-medium px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md transition">
                          点击更换
                        </span>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); update({ coverFile: null, coverPreview: null }) }}
                        className="absolute top-2 right-2 h-7 w-7 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/70"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => guard(() => coverRef.current?.click())}
                      className="rounded-2xl border-2 border-dashed border-border bg-muted/40 hover:border-primary/50 hover:bg-primary/5 p-8 text-center cursor-pointer transition-all duration-300 aspect-[4/3] flex flex-col items-center justify-center"
                    >
                      <div className="h-12 w-12 rounded-2xl bg-[#FF9500]/10 text-[#FF9500] flex items-center justify-center mb-3">
                        <ImageIcon size={22} />
                      </div>
                      <div className="text-sm font-semibold">上传封面图</div>
                      <div className="text-xs text-secondary mt-1">正方形最佳，不超过 10MB</div>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* 操作按钮 */}
            <div className="flex flex-col md:flex-row gap-3">
              <Button
                variant="secondary"
                size="lg"
                className="flex-1 h-13"
                onClick={() => submit(true)}
                disabled={submitting}
              >
                保存为草稿
              </Button>
              <Button
                size="lg"
                className="flex-1 h-13 text-base gap-2 shadow-lg shadow-primary/20"
                onClick={() => submit(false)}
                disabled={submitting}
              >
                {submitting ? <><UploadCloud size={17} className="animate-pulse" /> 发布中...</> : <><UploadCloud size={17} /> 发布模型</>}
              </Button>
            </div>
          </div>

          {/* 右侧：预览 + 说明 */}
          <div className="space-y-5">
            <Card className="p-5 space-y-4 overflow-hidden">
              <h4 className="text-sm font-bold flex items-center gap-2">
                <Eye size={14} className="text-primary" /> 卡片预览
              </h4>
              <div className="aspect-square rounded-2xl bg-muted overflow-hidden">
                {form.coverPreview ? (
                  <img src={form.coverPreview} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-secondary text-xs">
                    <div className="text-center">
                      <ImageIcon size={28} className="mx-auto mb-2 opacity-40" />
                      <div>封面预览</div>
                    </div>
                  </div>
                )}
              </div>
              <div>
                <div className="text-base font-bold truncate">{form.title || '模型名称（预览）'}</div>
                <div className="flex items-center justify-between mt-1.5">
                  <div className="flex items-center gap-1.5">
                    {user && <img src={user.avatar} className="h-5 w-5 rounded-full" alt="" />}
                    <span className="text-xs text-secondary">{user?.nickname || '设计师'}</span>
                  </div>
                  <div className="text-sm font-extrabold text-primary">
                    {Number(form.price) === 0 ? '免费' : '¥' + Number(form.price).toFixed(2)}
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {form.tags.slice(0, 3).map(t => (
                    <span key={t} className="px-1.5 py-0.5 rounded-md bg-muted text-[10px] text-secondary">#{t}</span>
                  ))}
                  <span className="px-1.5 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-medium">
                    {CATEGORIES.find(c => c.k === form.category)?.label}
                  </span>
                </div>
              </div>
            </Card>

            <Card className="p-5 space-y-3 bg-gradient-to-br from-primary/5 via-transparent to-[#AF52DE]/5">
              <h4 className="text-sm font-bold flex items-center gap-2">
                <Settings2 size={14} className="text-primary" /> 发布须知
              </h4>
              <ul className="space-y-2 text-xs text-foreground/80 leading-6">
                {[
                  '确保你对上传的模型拥有完整版权或授权',
                  '不允许上传低俗、暴力、侵权等违规内容',
                  '鼓励提供清晰的打印参数和组装说明',
                  '优质模型将获得官方推荐位与额外曝光',
                ].map((t, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      )}

      {/* =================== TAB: 我的分享 =================== */}
      {tab === 'my' && (
        <div className="space-y-5">
          {/* 分类筛选 */}
          <div className="hide-scrollbar-x -mx-4 md:mx-0 px-4 md:px-0">
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition',
                  filter === 'all' ? 'bg-primary text-white shadow-md' : 'bg-white border border-border/60 hover:border-primary/40 text-secondary hover:text-foreground'
                )}
              >
                全部 ({items.length})
              </button>
              {CATEGORIES.map(c => {
                const count = items.filter(x => x.category === c.k).length
                if (count === 0) return null
                return (
                  <button
                    key={c.k}
                    onClick={() => setFilter(c.k)}
                    className={cn(
                      'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition',
                      filter === c.k ? 'bg-primary text-white shadow-md' : 'bg-white border border-border/60 hover:border-primary/40 text-secondary hover:text-foreground'
                    )}
                  >
                    {c.label} ({count})
                  </button>
                )
              })}
            </div>
          </div>

          {/* 列表 */}
          {filteredItems.length === 0 ? (
            <Card className="p-16 text-center">
              <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center text-secondary">
                <Box size={28} />
              </div>
              <h3 className="text-lg font-bold mb-1">暂无模型</h3>
              <p className="text-sm text-secondary mb-5">快去上传你的第一个作品吧～</p>
              <Button onClick={() => setTab('new')}>
                <UploadCloud size={16} /> 去上传
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
              {filteredItems.map(it => (
                <Card key={it.id} className="overflow-hidden group hover:shadow-card-hover hover:-translate-y-0.5 transition">
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    <img src={it.cover} alt="" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    <div className="absolute top-2 left-2 flex gap-1.5">
                      {it.status === 'published' ? (
                        <span className="px-2 py-0.5 rounded-full bg-[#34C759] text-white text-[10px] font-bold flex items-center gap-1">
                          <Check size={10} /> 已发布
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-[#FF9500] text-white text-[10px] font-bold">草稿</span>
                      )}
                      <span className="px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md text-white text-[10px]">
                        {CATEGORIES.find(c => c.k === it.category)?.label}
                      </span>
                    </div>
                    <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-extrabold">
                      {Number(it.price) === 0 ? '免费' : '¥' + Number(it.price).toFixed(2)}
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-bold text-base line-clamp-1">{it.title}</h3>
                      <p className="text-xs text-secondary mt-1 line-clamp-2">{it.desc}</p>
                    </div>

                    {/* 数据 */}
                    <div className="grid grid-cols-4 gap-2 py-2 border-y border-border/50">
                      {[
                        { icon: Eye, label: it.stats.views, size: 12 },
                        { icon: Download, label: it.stats.downloads, size: 12 },
                        { icon: Heart, label: it.stats.likes, size: 12 },
                        { icon: MessageSquare, label: it.stats.comments, size: 12 },
                      ].map((s, i) => (
                        <div key={i} className="flex items-center justify-center gap-1 text-xs text-secondary">
                          <s.icon size={s.size} /> {s.label}
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-secondary flex items-center gap-1">
                        <Clock size={11} /> {it.publishedAt}
                      </span>
                      <span className="text-secondary truncate max-w-[50%]">{it.file}</span>
                    </div>

                    {/* 操作 */}
                    <div className="grid grid-cols-3 gap-2 pt-1">
                      <Button variant="outline" size="sm" onClick={() => togglePublish(it.id)}>
                        {it.status === 'published' ? '下架' : '发布'}
                      </Button>
                      <Button variant="secondary" size="sm" onClick={() => { setForm({ ...form, title: it.title, category: it.category, price: String(it.price), desc: it.desc }); setTab('new'); showToast('已载入到编辑表单', 'success') }}>
                        <Edit3 size={13} /> 编辑
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => delItem(it.id)}>
                        <Trash2 size={13} /> 删除
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
