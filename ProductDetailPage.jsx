import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Heart, Share2, Download, ShoppingCart, ChevronRight, Star, Package } from 'lucide-react'
import { Card } from '@/components/ui/Card.jsx'
import { Button } from '@/components/ui/Button.jsx'
import { useState } from 'react'
import { useToast } from '@/contexts/ToastContext.jsx'
import { useAuth } from '@/contexts/AuthContext.jsx'
import { cn } from '@/lib/utils'

const IMG = (seed) =>
  `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(seed)}&image_size=square`

const mockProduct = {
  id: 1,
  name: '3D打印创意食人花摆件 搞怪大眼睛模型 潮玩桌面装饰',
  designer: '创意工坊',
  designerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=studio',
  designerBio: '专注3D打印潮玩模型设计，粉丝2.3w，作品获赞超10w',
  price: 39.9, origPrice: 59.9, likes: 2368, sales: 12053, downloads: 3420,
  rating: 4.8, ratingCount: 1286,
  image: IMG('3D printed Demogorgon figurine cute big eyes flower monster product photo white background'),
  tags: ['热卖', '新品'],
  category: '装饰',
  description: '灵感来自怪奇物语中的Demogorgon形象，可爱化设计，大眼睛萌系风格。PLA环保材料高精度打印，表面细腻光滑，细节丰富。适合桌面装饰、玩具收藏、节日送礼。',
  specs: [
    { label: '尺寸', value: '120 × 100 × 80 mm' },
    { label: '重量', value: '约 85 g' },
    { label: '材料', value: 'PLA 环保塑料' },
    { label: '精度', value: '0.15 mm 层高' },
    { label: '颜色', value: '棕色 + 红色（可定制颜色）' },
  ],
  formats: ['STL', 'OBJ', '3MF'],
  includes: ['3D模型源文件', '切片配置推荐参数', '打印教程PDF', '7×24技术支持'],
}

export default function ProductDetailPage({ onLoginNeeded }) {
  const { id } = useParams()
  const { user } = useAuth()
  const { showToast } = useToast()
  const [liked, setLiked] = useState(false)
  const [qty, setQty] = useState(1)
  const [activeTab, setActiveTab] = useState('detail')

  const p = { ...mockProduct, id: parseInt(id) || 1 }

  const guard = (fn) => {
    if (!user) return onLoginNeeded?.()
    fn()
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* 顶部返回 */}
      <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border/60 px-4 md:px-6 py-3 flex items-center gap-3">
        <Link to=".." className="h-9 w-9 rounded-full bg-white shadow-card hover:bg-muted flex items-center justify-center transition">
          <ArrowLeft size={18} />
        </Link>
        <div className="flex-1 truncate font-semibold text-sm">商品详情</div>
        <button
          onClick={() => guard(() => showToast('已复制分享链接', 'success'))}
          className="h-9 w-9 rounded-full bg-white shadow-card hover:bg-muted flex items-center justify-center transition"
        >
          <Share2 size={16} />
        </button>
      </div>

      <div className="px-4 md:px-6 py-5 space-y-6">
        {/* 商品主体 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 主图 */}
          <div className="rounded-[20px] overflow-hidden bg-white shadow-card aspect-square md:aspect-auto">
            <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
          </div>
          {/* 信息 */}
          <div className="flex flex-col">
            <div className="flex flex-wrap gap-2 mb-3">
              {p.tags.map(t => (
                <span key={t} className={cn(
                  'px-2.5 py-1 rounded-full text-xs font-bold',
                  t === '热卖' && 'bg-[#FF3B30]/10 text-[#FF3B30]',
                  t === '新品' && 'bg-[#34C759]/10 text-[#34C759]',
                )}>
                  {t}
                </span>
              ))}
              <span className="px-2.5 py-1 rounded-full text-xs bg-primary/10 text-primary font-medium">{p.category}</span>
            </div>
            <h1 className="text-xl md:text-2xl font-extrabold leading-snug mb-3">{p.name}</h1>

            {/* 评分销量 */}
            <div className="flex items-center gap-4 text-xs text-secondary mb-4">
              <span className="flex items-center gap-1">
                <Star size={14} fill="#FFB800" className="text-[#FFB800]" />
                <b className="text-foreground">{p.rating}</b> ({p.ratingCount}评价)
              </span>
              <span>已售 <b className="text-foreground">{p.sales.toLocaleString()}</b></span>
              <span>{p.downloads.toLocaleString()} 下载</span>
            </div>

            {/* 价格 */}
            <div className="rounded-2xl bg-gradient-to-r from-primary/10 to-accent p-4 md:p-5 mb-5">
              <div className="flex items-baseline gap-3">
                <span className="text-primary text-3xl md:text-4xl font-black leading-none">¥{p.price}</span>
                <span className="text-secondary line-through text-sm">¥{p.origPrice}</span>
                <span className="px-2 py-0.5 rounded-md bg-[#FF3B30] text-white text-[11px] font-bold">
                  省 ¥{(p.origPrice - p.price).toFixed(1)}
                </span>
              </div>
            </div>

            {/* 设计师 */}
            <Card className="p-4 mb-5 flex items-center gap-4">
              <img src={p.designerAvatar} className="h-12 w-12 rounded-full" alt="" />
              <div className="flex-1 min-w-0">
                <div className="font-bold">{p.designer}</div>
                <div className="text-xs text-secondary truncate mt-0.5">{p.designerBio}</div>
              </div>
              <Button size="sm" variant="outline">关注</Button>
            </Card>

            {/* 数量 */}
            <div className="flex items-center gap-4 mb-5">
              <span className="text-sm text-secondary shrink-0">数量</span>
              <div className="inline-flex items-center rounded-full bg-muted overflow-hidden">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="h-9 w-9 flex items-center justify-center hover:bg-background transition"
                >−</button>
                <span className="w-10 text-center text-sm font-semibold">{qty}</span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="h-9 w-9 flex items-center justify-center hover:bg-background transition"
                >+</button>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-3 mt-auto">
              <Button
                variant="outline"
                className="flex-1 h-13 text-base gap-2"
                onClick={() => guard(() => setLiked(v => { showToast(!v ? '已加入收藏 ❤️' : '已取消收藏', 'success'); return !v }))}
              >
                <Heart size={18} fill={liked ? '#FF3B30' : 'none'} className={liked ? 'text-[#FF3B30]' : ''} />
                {liked ? '已收藏' : '收藏'}
              </Button>
              <Button
                variant="secondary"
                className="flex-1 h-13 text-base gap-2"
                onClick={() => guard(() => showToast('已加入购物车 🛒', 'success'))}
              >
                <ShoppingCart size={18} />
                加购物车
              </Button>
              <Button
                className="flex-1 h-13 text-base gap-2 font-bold"
                onClick={() => guard(() => showToast(`购买成功！共 ¥${(p.price * qty).toFixed(1)}`, 'success'))}
              >
                立即购买
              </Button>
            </div>
          </div>
        </div>

        {/* Tab 切换 */}
        <div className="border-b border-border/60 -mx-4 md:mx-0 px-4 md:px-0">
          <div className="flex gap-6">
            {[
              { k: 'detail', label: '商品详情' },
              { k: 'specs', label: '规格参数' },
              { k: 'files', label: '文件信息' },
              { k: 'review', label: '用户评价' },
            ].map(t => (
              <button
                key={t.k}
                onClick={() => setActiveTab(t.k)}
                className={cn(
                  'relative py-3 text-sm font-medium transition whitespace-nowrap',
                  activeTab === t.k ? 'text-primary' : 'text-secondary hover:text-foreground'
                )}
              >
                {t.label}
                {activeTab === t.k && (
                  <span className="absolute -bottom-px left-1/2 -translate-x-1/2 h-0.5 w-6 rounded-full bg-primary" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab 内容 */}
        <div className="pb-10">
          {activeTab === 'detail' && (
            <Card className="p-5 md:p-6">
              <h3 className="text-base font-bold mb-3">商品介绍</h3>
              <p className="text-sm leading-7 text-foreground/80 mb-5">{p.description}</p>
              <div className="aspect-video rounded-xl overflow-hidden bg-muted">
                <img src={p.image} className="w-full h-full object-cover" alt="" />
              </div>
            </Card>
          )}

          {activeTab === 'specs' && (
            <Card className="p-5 md:p-6">
              <h3 className="text-base font-bold mb-4">规格参数</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {p.specs.map((s, i) => (
                  <div key={i} className="flex items-center p-3 rounded-xl bg-muted/50 border border-border/50">
                    <span className="text-xs text-secondary w-20 shrink-0">{s.label}</span>
                    <span className="text-sm font-semibold flex-1">{s.value}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {activeTab === 'files' && (
            <Card className="p-5 md:p-6 space-y-5">
              <div>
                <h3 className="text-base font-bold mb-3 flex items-center gap-2">
                  <Package size={18} className="text-primary" />
                  可用文件格式
                </h3>
                <div className="flex flex-wrap gap-2">
                  {p.formats.map(f => (
                    <span key={f} className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-bold">{f}</span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-base font-bold mb-3">打包内容</h3>
                <ul className="space-y-2">
                  {p.includes.map((x, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" /> {x}
                    </li>
                  ))}
                </ul>
              </div>
              <Button
                size="lg"
                className="gap-2 w-full md:w-auto"
                onClick={() => guard(() => showToast('开始下载模型文件...', 'success'))}
              >
                <Download size={18} />
                下载全部文件 (4.2 MB)
              </Button>
            </Card>
          )}

          {activeTab === 'review' && (
            <Card className="p-5 md:p-6">
              <div className="flex items-center gap-4 pb-5 border-b border-border/60 mb-5">
                <div className="text-center">
                  <div className="text-3xl font-black">{p.rating}</div>
                  <div className="flex items-center justify-center gap-0.5 mt-1">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} size={12} fill={i <= Math.round(p.rating) ? '#FFB800' : 'none'} className="text-[#FFB800]" />
                    ))}
                  </div>
                  <div className="text-xs text-secondary mt-1">{p.ratingCount}条评价</div>
                </div>
              </div>
              <div className="space-y-5">
                {[
                  { name: '创客小明', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=a', content: '质量超好！细节做得很到位，摆在桌面很吸睛，朋友来都问我在哪买的😄', time: '3天前', rating: 5 },
                  { name: 'Away123', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=b', content: '发货快，打印精度很高，眼睛是灵魂！颜色也很漂亮，超值。', time: '1周前', rating: 5 },
                ].map((r, i) => (
                  <div key={i} className="flex gap-3">
                    <img src={r.avatar} className="h-9 w-9 rounded-full" alt="" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold">{r.name}</span>
                        <div className="flex items-center">
                          {Array.from({ length: r.rating }).map((_, j) => <Star key={j} size={10} fill="#FFB800" className="text-[#FFB800]" />)}
                        </div>
                        <span className="text-xs text-secondary ml-auto">{r.time}</span>
                      </div>
                      <p className="text-sm leading-6 text-foreground/80">{r.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
