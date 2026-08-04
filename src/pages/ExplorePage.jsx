import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, Grid3X3, LayoutList, Heart } from 'lucide-react'
import Card from '@/components/ui/Card.jsx'
import { cn } from '@/lib/utils'
import { useToast } from '@/contexts/ToastContext.jsx'
import { useAuth } from '@/contexts/AuthContext.jsx'

const categories = [
  { key: 'all', label: '全部' },
  { key: 'home', label: '家居' },
  { key: 'decor', label: '装饰' },
  { key: 'toy', label: '玩具' },
  { key: 'tool', label: '工具' },
  { key: 'custom', label: '定制' },
  { key: 'lamp', label: '灯具' },
  { key: 'storage', label: '收纳' },
  { key: 'jewelry', label: '首饰' },
]

const sorts = [
  { key: 'recommend', label: '推荐' },
  { key: 'price-asc', label: '价格↑' },
  { key: 'price-desc', label: '价格↓' },
  { key: 'sales', label: '销量' },
  { key: 'likes', label: '点赞' },
  { key: 'newest', label: '最新' },
]

const IMG = (seed) =>
  `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(seed)}&image_size=square`

const allProducts = [
  { id: 1, name: '3D打印创意食人花摆件', designer: '创意工坊', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1', price: 39.9, likes: 2368, sales: 12053, category: 'decor', image: IMG('3D printed Demogorgon figurine product photo white background') },
  { id: 2, name: '飞天小老鼠摆件三件套', designer: '造物社', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2', price: 49.9, likes: 1842, sales: 8600, category: 'toy', image: IMG('3D printed cute flying mouse figurine cartoon product photo') },
  { id: 3, name: '可动霸王龙关节模型', designer: '奇趣实验室', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3', price: 59.9, likes: 5621, sales: 22100, category: 'toy', image: IMG('3D printed articulated T-Rex dinosaur toy') },
  { id: 4, name: '星星许愿瓶收纳罐', designer: '小清新杂货铺', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4', price: 29.9, likes: 3205, sales: 15400, category: 'storage', image: IMG('3D printed star wishing bottle product photo') },
  { id: 5, name: '拼接缝合兔潮玩手办', designer: '潮玩空间', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=5', price: 79.9, likes: 4102, sales: 9200, category: 'toy', image: IMG('3D printed stitched patchwork bunny product photo') },
  { id: 6, name: '月球灯氛围小夜灯', designer: '光之工坊', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=6', price: 89.9, likes: 8935, sales: 31200, category: 'lamp', image: IMG('3D printed moon lamp night light product photo') },
  { id: 7, name: '几何花器多肉花盆', designer: '自然美学', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=7', price: 45, likes: 1205, sales: 4200, category: 'home', image: IMG('3D printed geometric planter pot product photo') },
  { id: 8, name: '多功能工具收纳盒', designer: '实用主义', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=8', price: 69, likes: 2430, sales: 7800, category: 'tool', image: IMG('3D printed desktop organizer toolbox product photo') },
  { id: 9, name: '掐丝珐琅风格挂画', designer: '艺术工坊', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=9', price: 129, likes: 3560, sales: 5400, category: 'decor', image: IMG('cloisonne enamel style wall art gold wire product photo') },
  { id: 10, name: '3D打印可活动机甲战士', designer: '机甲狂魔', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=10', price: 199, likes: 7820, sales: 13200, category: 'toy', image: IMG('3D printed articulated mecha robot model product photo') },
  { id: 11, name: '复古机械键盘键帽', designer: '外设极客', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=11', price: 15, likes: 9540, sales: 45000, category: 'custom', image: IMG('3D printed artisan keycap mechanical keyboard product photo') },
  { id: 12, name: '北欧风极简花插', designer: '北欧生活', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=12', price: 59, likes: 1890, sales: 6100, category: 'home', image: IMG('3D printed minimalist nordic vase product photo') },
]

export default function ExplorePage({ onLoginNeeded }) {
  const [searchParams] = useSearchParams()
  const q = searchParams.get('q') || ''
  const [keyword, setKeyword] = useState(q)
  const [cat, setCat] = useState('all')
  const [sort, setSort] = useState('recommend')
  const [viewMode, setViewMode] = useState('grid')
  const [liked, setLiked] = useState({})
  const { user } = useAuth()
  const { showToast } = useToast()

  let list = allProducts.slice()
  if (cat !== 'all') list = list.filter(p => p.category === cat)
  if (keyword) list = list.filter(p => p.name.includes(keyword) || p.designer.includes(keyword))
  switch (sort) {
    case 'price-asc': list.sort((a, b) => a.price - b.price); break
    case 'price-desc': list.sort((a, b) => b.price - a.price); break
    case 'sales': list.sort((a, b) => b.sales - a.sales); break
    case 'likes': list.sort((a, b) => b.likes - a.likes); break
    case 'newest': list = list.slice().reverse(); break
    default: break
  }

  const fmt = n => n >= 10000 ? (n / 10000).toFixed(1) + 'w' : n.toLocaleString()

  const toggleLike = (e, id) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) return onLoginNeeded?.()
    setLiked(prev => {
      const on = !prev[id]
      showToast(on ? '已点赞' : '已取消', on ? 'success' : 'info')
      return { ...prev, [id]: on }
    })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-5 space-y-5">
      {/* 顶部搜索 */}
      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" />
        <input
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          placeholder="搜索模型、设计师或关键词"
          className="w-full h-12 rounded-2xl bg-white pl-11 pr-4 text-sm shadow-card focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      {/* 分类 */}
      <div className="hide-scrollbar-x -mx-4 md:mx-0 px-4 md:px-0">
        <div className="flex gap-2 pb-1">
          {categories.map(c => (
            <button
              key={c.key}
              onClick={() => setCat(c.key)}
              className={cn(
                'shrink-0 px-4 py-2 rounded-full text-sm font-medium transition',
                cat === c.key ? 'bg-primary text-white' : 'bg-white text-foreground hover:bg-accent shadow-card'
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* 筛选栏 */}
      <div className="flex items-center justify-between gap-3">
        <div className="hide-scrollbar-x flex-1 overflow-x-auto">
          <div className="flex gap-2 pb-1">
            {sorts.map(s => (
              <button
                key={s.key}
                onClick={() => setSort(s.key)}
                className={cn(
                  'shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition',
                  sort === s.key ? 'bg-[#1D1D1F] text-white' : 'bg-muted text-secondary hover:text-foreground'
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button className="h-9 w-9 rounded-xl bg-white shadow-card flex items-center justify-center hover:bg-muted">
            <SlidersHorizontal size={16} />
          </button>
          <div className="h-9 w-[1px] bg-border mx-1" />
          <button
            onClick={() => setViewMode('grid')}
            className={cn('h-9 w-9 rounded-xl flex items-center justify-center transition', viewMode === 'grid' ? 'bg-primary text-white' : 'bg-white text-secondary hover:bg-muted')}
          >
            <Grid3X3 size={16} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={cn('h-9 w-9 rounded-xl flex items-center justify-center transition', viewMode === 'list' ? 'bg-primary text-white' : 'bg-white text-secondary hover:bg-muted')}
          >
            <LayoutList size={16} />
          </button>
        </div>
      </div>

      {/* 结果数 */}
      <div className="text-xs text-secondary">共找到 <span className="text-foreground font-semibold">{list.length}</span> 件作品</div>

      {/* 产品列表 */}
      <div className={cn(
        viewMode === 'grid'
          ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5'
          : 'space-y-3'
      )}>
        {list.map(p => viewMode === 'grid' ? (
          <Link to={`/product/${p.id}`} key={p.id} className="group">
            <Card className="overflow-hidden">
              <div className="relative aspect-square overflow-hidden bg-muted">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <button
                  onClick={(e) => toggleLike(e, p.id)}
                  className="absolute top-2.5 right-2.5 h-8 w-8 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white hover:bg-[#FF3B30] transition"
                >
                  <Heart size={14} fill={liked[p.id] ? 'currentColor' : 'none'} className={liked[p.id] ? 'text-[#FF3B30]' : ''} />
                </button>
              </div>
              <div className="p-3">
                <h3 className="text-sm font-semibold line-clamp-2 mb-2 min-h-[40px]">{p.name}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <img src={p.avatar} className="h-4 w-4 rounded-full" alt="" />
                  <span className="text-xs text-secondary truncate">{p.designer}</span>
                </div>
                <div className="flex items-end justify-between">
                  <span className="text-primary font-black text-base">¥{p.price}</span>
                  <span className="text-[11px] text-secondary flex items-center gap-1">
                    <Heart size={10} fill="#FF3B30" className="text-[#FF3B30]" />{fmt(p.likes)}
                  </span>
                </div>
              </div>
            </Card>
          </Link>
        ) : (
          <Link to={`/product/${p.id}`} key={p.id} className="group">
            <Card className="flex p-3 gap-4">
              <div className="w-28 h-28 shrink-0 rounded-xl overflow-hidden bg-muted">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
              </div>
              <div className="flex-1 min-w-0 flex flex-col">
                <h3 className="text-sm font-bold line-clamp-2 group-hover:text-primary">{p.name}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <img src={p.avatar} className="h-4 w-4 rounded-full" alt="" />
                  <span className="text-xs text-secondary">{p.designer}</span>
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <div>
                    <span className="text-primary font-black text-lg">¥{p.price}</span>
                    <span className="text-[11px] text-secondary ml-2">已售 {fmt(p.sales)}</span>
                  </div>
                  <button
                    onClick={(e) => toggleLike(e, p.id)}
                    className="h-8 w-8 rounded-full bg-muted flex items-center justify-center hover:bg-[#FF3B30]/10 transition"
                  >
                    <Heart size={14} fill={liked[p.id] ? '#FF3B30' : 'none'} className={liked[p.id] ? 'text-[#FF3B30]' : ''} />
                  </button>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {list.length === 0 && <div className="py-20 text-center text-secondary">暂无匹配的作品</div>}
    </div>
  )
}
