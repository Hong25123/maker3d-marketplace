Award } from 'lucide-react'
  Award, Palette } from 'lucide-react'import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Search, Heart, ChevronRight, TrendingUp, Sparkles, Flame, Award } from 'lucide-react'
import Card from '@/components/ui/Card.jsx'
import { Button } from '@/components/ui/Button.jsx'
import { cn } from '@/lib/utils'
import { useToast } from '@/contexts/ToastContext.jsx'
import { useAuth } from '@/contexts/AuthContext.jsx'

const categories = [
  { key: 'all', label: '全部', icon: '🌐' },
  { key: 'home', label: '家居', icon: '🏠' },
  { key: 'decor', label: '装饰', icon: '🎨' },
  { key: 'toy', label: '玩具', icon: '🧸' },
  { key: 'tool', label: '工具', icon: '🔧' },
  { key: 'custom', label: '定制', icon: '✏️' },
  { key: 'lamp', label: '灯具', icon: '💡' },
  { key: 'storage', label: '收纳', icon: '📦' },
  { key: 'jewelry', label: '首饰', icon: '💎' },
]

const IMG = (seed, w = 400, h = 400) =>
  `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(seed)}&image_size=square`

const mockProducts = [
  {
    id: 1, name: '3D打印创意食人花摆件 搞怪大眼睛模型',
    designer: '创意工坊', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=studio1',
    price: 39.9, origPrice: 59.9, likes: 2368, sales: 12053, category: 'decor',
    image: IMG('3D printed Demogorgon figurine cute big eyes flower monster retro brown red petal teeth collectible toy product photo white background'),
    tags: ['热卖', '新品'],
  },
  {
    id: 2, name: '3D打印卡通飞天小老鼠摆件 可爱萌宠',
    designer: '造物社', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=studio2',
    price: 49.9, likes: 1842, sales: 8600, category: 'toy',
    image: IMG('3D printed cute flying mouse figurine cartoon style big round eyes pink orange blue yellow set of three desk decor product photo dark background'),
    tags: ['精选'],
  },
  {
    id: 3, name: '3D打印可动霸王龙玩具 仿真恐龙模型',
    designer: '奇趣实验室', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lab1',
    price: 59.9, origPrice: 89.9, likes: 5621, sales: 22100, category: 'toy',
    image: IMG('3D printed articulated T-Rex dinosaur toy realistic red color movable jaw joints held in hand children toy product photo'),
    tags: ['折扣', '热销'],
  },
  {
    id: 4, name: '3D 打印星星许愿瓶 透明竖纹收纳罐',
    designer: '小清新杂货铺', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zaka',
    price: 29.9, origPrice: 39.9, likes: 3205, sales: 15400, category: 'storage',
    image: IMG('3D printed cute star wishing bottle jar transparent ribbed texture pink lid pastel candy color stars decorative jewelry storage jar LED fairy lights product photo'),
    tags: ['新品'],
  },
  {
    id: 5, name: '3D 打印甜酷拼接缝合兔 潮玩手办',
    designer: '潮玩空间', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=trendy',
    price: 79.9, likes: 4102, sales: 9200, category: 'toy',
    image: IMG('3D printed cute stitched patchwork bunny rabbit doll half pink half white silver X stitches blue eyes pink bow kawaii aesthetic keychain figurine product photo'),
    tags: ['限量'],
  },
  {
    id: 6, name: '3D打印月球灯 氛围灯床头小夜灯',
    designer: '光之工坊', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=light',
    price: 89.9, origPrice: 129.9, likes: 8935, sales: 31200, category: 'lamp',
    image: IMG('3D printed moon lamp night light realistic craters texture warm LED glow wooden base ambient bedroom lighting product photo'),
    tags: ['热卖'],
  },
  {
    id: 7, name: '3D打印几何花器 多肉花盆桌面装饰',
    designer: '自然美学', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nature',
    price: 45.0, likes: 1205, sales: 4200, category: 'home',
    image: IMG('3D printed geometric planter pot matte white modern minimalist succulent cactus holder ceramic texture indoor decor product photo'),
    tags: [],
  },
  {
    id: 8, name: '3D打印多功能工具收纳盒 桌面整理',
    designer: '实用主义', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=toolbox',
    price: 69.0, origPrice: 99.0, likes: 2430, sales: 7800, category: 'tool',
    image: IMG('3D printed desktop organizer toolbox modular compartments black matte finish holding pens clips scissors office desk product photo'),
    tags: ['折扣'],
  },
]

const banners = [
  {
    id: 1,
    title: '图生3D模型上线',
    desc: '上传图片一键生成3D模型，限时免费体验',
    gradient: 'from-[#2B7BD6] to-[#6AA9E8]',
    icon: <Sparkles size={20} />,
    link: '/image-to-3d',
  },
  {
    id: 2,
    title: '掐丝AI生成器',
    desc: '掐丝珐琅金丝线稿风格，一键生成精美艺术画',
    gradient: 'from-[#AF52DE] to-[#E879F9]',
    icon: <Palette size={20} />,
    link: '/cloisonne',
  },
]

function paletteIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
      <circle cx="13.5" cy="6.5" r="1.5" /><circle cx="17.5" cy="10.5" r="1.5" /><circle cx="8.5" cy="7.5" r="1.5" />
      <circle cx="6.5" cy="12.5" r="1.5" /><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.8 0 1.5-.7 1.5-1.5 0-.4-.2-.8-.4-1-.2-.3-.4-.6-.4-1 0-.8.7-1.5 1.5-1.5H16c3.3 0 6-2.7 6-6 0-5-4.5-9-10-9z" />
    </svg>
  )
}
// Patch: use inline SVG to avoid dynamic import issue — not used, imported directly.

export default function HomePage({ onLoginNeeded }) {
  const [activeCategory, setActiveCategory] = useState('all')
  const [likedMap, setLikedMap] = useState({})
  const { user } = useAuth()
  const { showToast } = useToast()

  const filtered = useMemo(() => {
    if (activeCategory === 'all') return mockProducts
    return mockProducts.filter(p => p.category === activeCategory)
  }, [activeCategory])

  const toggleLike = (e, id) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) return onLoginNeeded?.()
    setLikedMap(prev => {
      const next = !prev[id]
      showToast(next ? '已加入收藏 ❤️' : '已取消收藏', next ? 'success' : 'info')
      return { ...prev, [id]: next }
    })
  }

  const formatNum = n => n >= 10000 ? (n / 10000).toFixed(1) + 'w' : n.toLocaleString()

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-5 space-y-6">
      {/* Hero Banners */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {banners.map(b => (
          <Link
            key={b.id}
            to={b.link}
            className={cn(
              'relative overflow-hidden rounded-[20px] p-5 md:p-7 text-white bg-gradient-to-br',
              b.gradient,
              'shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 group'
            )}
          >
            <div className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-white/10 backdrop-blur-xl" />
            <div className="absolute right-5 top-5 h-10 w-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md group-hover:bg-white group-hover:text-primary transition">
              {b.icon}
            </div>
            <h3 className="text-lg md:text-xl font-bold mb-1">{b.title}</h3>
            <p className="text-sm text-white/85 mb-4">{b.desc}</p>
            <span className="inline-flex items-center gap-1 px-4 py-2 rounded-full bg-white/20 text-sm font-medium backdrop-blur-md group-hover:bg-white group-hover:text-primary transition">
              立即体验 <ChevronRight size={16} />
            </span>
          </Link>
        ))}
      </section>

      {/* 搜索框（大） */}
      <section>
        <div className="relative">
          <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-secondary" />
          <Link
            to="/explore"
            className="block w-full h-14 rounded-[20px] bg-white shadow-card hover:shadow-card-hover transition border border-transparent hover:border-primary/20"
          >
            <div className="h-full pl-14 pr-5 flex items-center text-secondary text-sm">
              搜索模型、设计师或关键词
              <span className="ml-auto px-3 py-1.5 rounded-full bg-muted text-xs font-medium hidden sm:block">
                ⌘K
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* 分类标签 —— 横向滚动 */}
      <section>
        <div className="hide-scrollbar-x -mx-4 md:mx-0 px-4 md:px-0">
          <div className="flex gap-2.5 md:gap-3 pb-1">
            {categories.map(cat => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={cn(
                  'shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200',
                  activeCategory === cat.key
                    ? 'bg-primary text-white shadow-sm shadow-primary/30 scale-[1.02]'
                    : 'bg-white text-foreground hover:bg-accent shadow-card'
                )}
              >
                <span className="text-base">{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 精选板块 */}
      <section>
        <div className="flex items-end justify-between mb-4 px-1">
          <div>
            <h2 className="text-xl md:text-2xl font-extrabold flex items-center gap-2">
              <TrendingUp size={22} className="text-primary" />
              本周精选
            </h2>
            <p className="text-sm text-secondary mt-0.5">设计师推荐的热门3D打印好物</p>
          </div>
          <Link to="/explore" className="text-sm text-primary font-medium flex items-center gap-0.5 hover:gap-1 transition-all">
            查看更多 <ChevronRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {filtered.map(p => (
            <Link
              key={p.id}
              to={`/product/${p.id}`}
              className="group"
            >
              <Card className="overflow-hidden h-full flex flex-col">
                {/* 图片区 */}
                <div className="relative aspect-square overflow-hidden bg-muted">
                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    onError={(e) => { e.currentTarget.style.display = 'none' }}
                  />
                  {/* 徽章 */}
                  <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1">
                    {p.tags.includes('热卖') && <span className="px-2 py-0.5 rounded-full bg-[#FF3B30] text-white text-[10px] font-bold flex items-center gap-0.5"><Flame size={10} fill="currentColor" />热卖</span>}
                    {p.tags.includes('新品') && <span className="px-2 py-0.5 rounded-full bg-[#34C759] text-white text-[10px] font-bold">新品</span>}
                    {p.tags.includes('折扣') && <span className="px-2 py-0.5 rounded-full bg-[#FF9500] text-white text-[10px] font-bold flex items-center gap-0.5"><Award size={10} fill="currentColor" />折扣</span>}
                    {p.tags.includes('精选') && <span className="px-2 py-0.5 rounded-full bg-[#2B7BD6] text-white text-[10px] font-bold">精选</span>}
                    {p.tags.includes('限量') && <span className="px-2 py-0.5 rounded-full bg-[#AF52DE] text-white text-[10px] font-bold">限量</span>}
                  </div>
                  {/* 点赞按钮 */}
                  <button
                    onClick={(e) => toggleLike(e, p.id)}
                    className="absolute top-2.5 right-2.5 h-8 w-8 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white hover:bg-[#FF3B30] active:scale-90 transition-all duration-200"
                    aria-label="点赞"
                  >
                    <Heart
                      size={15}
                      fill={likedMap[p.id] ? 'currentColor' : 'none'}
                      className={likedMap[p.id] ? 'text-[#FF3B30]' : ''}
                    />
                  </button>
                  {/* 销量 */}
                  <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md text-white text-[10px] font-medium">
                    已售 {formatNum(p.sales)}
                  </div>
                </div>

                {/* 信息区 */}
                <div className="p-3 md:p-4 flex-1 flex flex-col">
                  <h3 className="text-sm font-semibold leading-snug line-clamp-2 mb-2.5 group-hover:text-primary transition-colors">
                    {p.name}
                  </h3>

                  <div className="flex items-center gap-2 mb-3 mt-auto">
                    <img src={p.avatar} alt="avatar" className="h-5 w-5 rounded-full bg-muted" />
                    <span className="text-xs text-secondary truncate">{p.designer}</span>
                  </div>

                  <div className="flex items-end justify-between">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-primary font-black text-lg leading-none">¥{p.price}</span>
                      {p.origPrice && (
                        <span className="text-[11px] text-secondary line-through">¥{p.origPrice}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-secondary">
                      <Heart size={12} fill="#FF3B30" className="text-[#FF3B30]" />
                      {formatNum(likedMap[p.id] ? p.likes + 1 : p.likes)}
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-20 text-center text-secondary text-sm">该分类暂无商品，敬请期待</div>
        )}
      </section>

      {/* CTA 发布按钮 */}
      <section className="pt-2">
        <div
          onClick={() => { if (!user) return onLoginNeeded?.(); showToast('已跳转到模型分享页', 'info') }}
          className="rounded-[20px] border-2 border-dashed border-primary/30 bg-white/60 hover:bg-accent hover:border-primary transition p-5 md:p-7 flex flex-col md:flex-row items-center justify-between gap-4 cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <Sparkles size={24} />
            </div>
            <div>
              <h3 className="font-bold text-base">发布你的原创3D模型</h3>
              <p className="text-sm text-secondary mt-0.5">分享作品、赚取收益，与百万创作者共同成长</p>
            </div>
          </div>
          <Link to="/share-model" onClick={(e) => { if (!user) { e.preventDefault(); onLoginNeeded?.() } }}>
            <Button size="lg">立即发布</Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
