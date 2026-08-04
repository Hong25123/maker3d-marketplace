import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext.jsx'
import { useToast } from '@/contexts/ToastContext.jsx'
import Card from '@/components/ui/Card.jsx'
import { Button } from '@/components/ui/Button.jsx'
import {
  ShoppingBag, Clock, Truck, CheckCircle2, Package,
  ChevronRight, FileText, Eye, Download, Star,
  Banknote, Receipt, MapPin, User as UserIcon, MoreHorizontal, Search
} from 'lucide-react'
import { cn } from '@/lib/utils'

const TABS = [
  { k: 'all', label: '全部', icon: FileText },
  { k: 'pending', label: '待付款', icon: Clock },
  { k: 'paid', label: '已付款', icon: Banknote },
  { k: 'shipping', label: '发货中', icon: Truck },
  { k: 'done', label: '已完成', icon: CheckCircle2 },
]

const INITIAL_ORDERS = [
  {
    id: '2025031800001',
    createTime: '2025-03-18 14:32',
    status: 'done',
    statusText: '已完成',
    items: [
      {
        id: 1,
        title: '可动机械花 · 升级版',
        cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=3D%20printed%20mechanical%20flower%20articulated%20product%20photo&image_size=square',
        spec: 'STL 文件 · 可动版',
        price: 9.9,
        qty: 1,
      },
      {
        id: 2,
        title: '多功能手机支架 Pro',
        cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=3D%20printed%20phone%20stand%20product%20photo&image_size=square',
        spec: 'STL 文件',
        price: 3.5,
        qty: 1,
      },
    ],
    total: 13.4,
    payMethod: '余额支付',
  },
  {
    id: '2025031600042',
    createTime: '2025-03-16 09:08',
    status: 'shipping',
    statusText: '打印中 / 发货中',
    items: [
      {
        id: 3,
        title: '敦煌纹样掐丝装饰盘',
        cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=3D%20printed%20dunhuang%20cloisonne%20decorative%20plate&image_size=square',
        spec: '实体打印 · 哑光 PLA+ · 白色',
        price: 68.0,
        qty: 1,
      },
    ],
    total: 68.0,
    payMethod: '微信支付',
    tracking: 'SF1234567890123',
  },
  {
    id: '2025031500087',
    createTime: '2025-03-15 21:44',
    status: 'paid',
    statusText: '待下载',
    items: [
      {
        id: 4,
        title: '可动机械恐龙玩具',
        cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=3D%20printed%20articulated%20dinosaur%20toy&image_size=square',
        spec: 'OBJ + STL 文件',
        price: 12.0,
        qty: 1,
      },
    ],
    total: 12.0,
    payMethod: '积分 + 余额',
  },
  {
    id: '2025031400023',
    createTime: '2025-03-14 11:20',
    status: 'pending',
    statusText: '待付款',
    items: [
      {
        id: 5,
        title: '多功能工具收纳组合',
        cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=3D%20printed%20tool%20organizer%20storage%20box&image_size=square',
        spec: 'STL 文件 · 全套',
        price: 15.0,
        qty: 1,
      },
    ],
    total: 15.0,
    payMethod: '待选择',
  },
]

const STATUS_COLOR = {
  pending: 'text-[#FF9500] bg-[#FF9500]/10',
  paid: 'text-primary bg-primary/10',
  shipping: 'text-[#5E5CE6] bg-[#5E5CE6]/10',
  done: 'text-[#34C759] bg-[#34C759]/10',
}

export default function OrdersPage({ onLoginNeeded, onNavigate }) {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [orders, setOrders] = useState(INITIAL_ORDERS)
  const [tab, setTab] = useState('all')
  const [keyword, setKeyword] = useState('')

  const guard = (fn) => { if (!user) return onLoginNeeded?.(); fn() }

  const count = (k) => k === 'all' ? orders.length : orders.filter(o => o.status === k).length
  const filtered = orders
    .filter(o => tab === 'all' || o.status === tab)
    .filter(o => !keyword || o.id.includes(keyword) || o.items.some(i => i.title.includes(keyword)))

  const payOrder = (id) => {
    guard(() => {
      setOrders(orders.map(o => o.id === id ? { ...o, status: 'paid', statusText: '待下载', payMethod: '余额支付' } : o))
      showToast('支付成功，已自动从余额扣除', 'success')
    })
  }

  const cancelOrder = (id) => {
    if (!confirm('确定要取消该订单吗？')) return
    setOrders(orders.filter(o => o.id !== id))
    showToast('订单已取消', 'success')
  }

  const confirmDone = (id) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: 'done', statusText: '已完成' } : o))
    showToast('已确认收货，欢迎再来～', 'success')
  }

  const totalSpent = orders
    .filter(o => o.status !== 'pending')
    .reduce((s, o) => s + o.total, 0)

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-5 space-y-5">
      {/* 标题 */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold flex items-center gap-2">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-[#2B7BD6] to-[#34C759] text-white flex items-center justify-center">
              <ShoppingBag size={20} />
            </div>
            我的订单
          </h1>
          <p className="text-sm text-secondary mt-2">管理你的模型订单与打印服务</p>
        </div>
        {/* 小统计 */}
        <div className="flex gap-3 shrink-0">
          <Card className="px-4 py-3 min-w-[110px]">
            <div className="text-xs text-secondary">{orders.length} 笔订单</div>
            <div className="text-lg font-extrabold text-primary mt-0.5">¥{totalSpent.toFixed(2)}</div>
          </Card>
        </div>
      </div>

      {/* 搜索框 */}
      <div className="relative">
        <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" />
        <input
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          placeholder="搜索订单号或商品名称..."
          className="w-full h-12 pl-11 pr-4 rounded-2xl bg-white border border-border/60 shadow-card/50 focus:border-primary/40 focus:ring-4 focus:ring-primary/10 text-sm transition"
        />
      </div>

      {/* 状态 Tab */}
      <div className="hide-scrollbar-x -mx-4 md:mx-0 px-4 md:px-0">
        <div className="flex gap-1 bg-muted p-1 rounded-2xl w-fit">
          {TABS.map(t => {
            const Icon = t.icon
            const c = count(t.k)
            return (
              <button
                key={t.k}
                onClick={() => setTab(t.k)}
                className={cn(
                  'px-3 md:px-4 py-2 rounded-xl text-sm font-semibold transition whitespace-nowrap flex items-center gap-1.5',
                  tab === t.k ? 'bg-white text-primary shadow-card' : 'text-secondary hover:text-foreground'
                )}
              >
                <Icon size={14} />
                {t.label}
                <span className={cn(
                  'text-[10px] px-1.5 py-0.5 rounded-full',
                  tab === t.k ? 'bg-primary/10 text-primary' : 'bg-foreground/5 text-secondary'
                )}>
                  {c}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 订单列表 */}
      {filtered.length === 0 ? (
        <Card className="p-16 text-center">
          <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center text-secondary">
            <Package size={28} />
          </div>
          <h3 className="text-lg font-bold mb-1">暂无订单</h3>
          <p className="text-sm text-secondary mb-5">去逛逛，挑选心仪的模型吧～</p>
          <Button onClick={() => onNavigate?.('/explore')}>去探索</Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {filtered.map(order => (
            <Card key={order.id} className="p-4 md:p-5 overflow-hidden">
              {/* 头部：订单号 + 状态 */}
              <div className="flex items-start justify-between pb-3 border-b border-border/60">
                <div>
                  <div className="text-xs text-secondary flex items-center gap-1.5">
                    <Clock size={11} /> {order.createTime}
                  </div>
                  <div className="text-sm font-bold mt-1 font-mono">{order.id}</div>
                </div>
                <span className={cn('px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1', STATUS_COLOR[order.status])}>
                  <Package size={11} /> {order.statusText}
                </span>
              </div>

              {/* 商品列表 */}
              <div className="py-3 space-y-3">
                {order.items.map(item => (
                  <div key={item.id} className="flex gap-3">
                    <div className="h-20 w-20 shrink-0 rounded-xl overflow-hidden bg-muted">
                      <img src={item.cover} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                      <div>
                        <div className="font-bold text-sm line-clamp-1">{item.title}</div>
                        <div className="text-xs text-secondary mt-0.5">{item.spec}</div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-primary font-extrabold">¥{item.price.toFixed(2)}</div>
                        <div className="text-xs text-secondary">× {item.qty}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 物流信息 */}
              {order.tracking && (
                <div className="pb-3 mb-2 border-b border-border/60">
                  <div className="flex items-start gap-2 p-3 rounded-xl bg-[#5E5CE6]/5 text-xs">
                    <Truck size={15} className="text-[#5E5CE6] mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <div className="font-semibold text-[#5E5CE6]">顺丰速运 · 运输中</div>
                      <div className="text-secondary mt-0.5 font-mono">{order.tracking}</div>
                      <div className="text-secondary mt-0.5">预计明天 18:00 前送达</div>
                    </div>
                    <ChevronRight size={15} className="text-[#5E5CE6] shrink-0" />
                  </div>
                </div>
              )}

              {/* 底部：合计 + 操作 */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pt-3 border-t border-border/60">
                <div>
                  <div className="text-xs text-secondary mb-0.5">
                    支付方式：<span className="text-foreground font-medium">{order.payMethod}</span>
                  </div>
                  <div className="text-sm">
                    共 <span className="font-bold">{order.items.length}</span> 件商品，合计：
                    <span className="text-lg font-extrabold text-primary ml-1">¥{order.total.toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex gap-2 md:justify-end flex-wrap">
                  {order.status === 'pending' && (
                    <>
                      <Button variant="outline" size="sm" onClick={() => cancelOrder(order.id)}>取消订单</Button>
                      <Button size="sm" className="gap-1.5" onClick={() => payOrder(order.id)}>
                        <Banknote size={13} /> 立即支付
                      </Button>
                    </>
                  )}
                  {order.status === 'paid' && (
                    <>
                      <Button variant="outline" size="sm" onClick={() => showToast('订单详情页开发中', 'info')}>
                        <Receipt size={13} /> 订单详情
                      </Button>
                      <Button size="sm" className="gap-1.5" onClick={() => showToast('开始下载模型文件...', 'success')}>
                        <Download size={13} /> 下载文件
                      </Button>
                    </>
                  )}
                  {order.status === 'shipping' && (
                    <>
                      <Button variant="outline" size="sm" onClick={() => showToast('物流轨迹：已到达【北京朝阳转运中心】', 'info')}>
                        <Eye size={13} /> 查看物流
                      </Button>
                      <Button size="sm" className="gap-1.5" onClick={() => confirmDone(order.id)}>
                        <CheckCircle2 size={13} /> 确认收货
                      </Button>
                    </>
                  )}
                  {order.status === 'done' && (
                    <>
                      <Button variant="outline" size="sm" onClick={() => showToast('已进入下载中心', 'success')}>
                        <Download size={13} /> 再次下载
                      </Button>
                      <Button variant="secondary" size="sm" className="gap-1.5" onClick={() => showToast('感谢您的评价！赠送 20 积分', 'success')}>
                        <Star size={13} /> 去评价
                      </Button>
                      <button className="h-9 w-9 rounded-full hover:bg-muted flex items-center justify-center text-secondary shrink-0">
                        <MoreHorizontal size={16} />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* 地址信息（有实体商品时） */}
              {order.status !== 'paid' && order.items.some(i => i.spec.includes('实体')) && (
                <div className="mt-4 p-3 rounded-xl bg-muted/60 text-xs flex items-start gap-2.5">
                  <MapPin size={14} className="text-primary mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <UserIcon size={11} className="text-secondary" />
                      <span className="font-semibold">李鸿</span>
                      <span className="text-secondary font-mono text-[11px]">138****8888</span>
                    </div>
                    <div className="text-secondary leading-5">
                      北京市 朝阳区 三里屯街道 XX 大厦 A 座 1001 室
                    </div>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      <div className="py-6 text-center text-xs text-secondary">—— 订单查询：如有问题请联系在线客服 ——</div>
    </div>
  )
}
