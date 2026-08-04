import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext.jsx'
import { useToast } from '@/contexts/ToastContext.jsx'
import Card from '@/components/ui/Card.jsx'
import { Button } from '@/components/ui/Button.jsx'
import { Textarea } from '@/components/ui/Input.jsx'
import {
  Sparkles, Download, Share2, RotateCcw, Palette, Wand2,
  Paintbrush, Layers, Image as ImageIcon, Copy, Check, History
} from 'lucide-react'
import { cn } from '@/lib/utils'

// 风格选项
const STYLES = [
  { k: 'outline', label: '线稿', desc: '纯净金丝线条，无填充', icon: Paintbrush,
    hint: '适合用于激光雕刻、刺绣底图' },
  { k: 'enamel', label: '彩色珐琅', desc: '经典掐丝珐琅 + 彩色填色', icon: Palette,
    hint: '最经典的掐丝珐琅风格，色彩绚丽' },
  { k: 'goldline', label: '简约金线', desc: '黑底金线，高级质感', icon: Layers,
    hint: '极简高级，适合装饰画、封面图' },
  { k: 'dunhuang', label: '敦煌纹样', desc: '中式敦煌配色与图案', icon: Wand2,
    hint: '国风爱好者首选，文化氛围拉满' },
]

const PRESET_PROMPTS = [
  '掐丝珐琅金丝线稿，黑底金线，掐丝工艺，精致复杂花纹，传统图案',
  '敦煌风格飞天图案，掐丝珐琅，金色轮廓，石青朱砂配色，复古华贵',
  '梅花图案掐丝珐琅，粉色花瓣，金色花蕊，青色叶子，古典中式',
  '神兽凤凰掐丝珐琅，金线描边，彩色填充，华丽繁复，大气磅礴',
  '几何圆形花卉纹样，掐丝工艺，简约金线，黑背景，现代装饰画',
]

const RESULT_IMAGES = {
  outline: 'cloisonne%20gold%20wire%20outline%20pattern%20black%20background%20clean%20line%20art%20luxury',
  enamel: 'chinese%20cloisonne%20enamel%20colorful%20pattern%20gold%20wire%20vibrant%20traditional%20craft%20art',
  goldline: 'minimal%20cloisonne%20style%20black%20background%20thin%20gold%20lines%20luxury%20elegant%20pattern%20art',
  dunhuang: 'dunhuang%20mural%20style%20cloisonne%20gold%20wire%20chinese%20traditional%20pattern%20zenith%20art',
}

const IMG = (seed) =>
  `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${seed}&image_size=square_hd`

export default function CloisonnePage({ onLoginNeeded }) {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [style, setStyle] = useState('enamel')
  const [prompt, setPrompt] = useState('')
  const [stage, setStage] = useState('idle') // idle / generating / success
  const [progress, setProgress] = useState(0)
  const [progressText, setProgressText] = useState('')
  const [result, setResult] = useState(null) // { image, style, prompt }
  const [history, setHistory] = useState([]) // 历史记录
  const [copied, setCopied] = useState(false)

  const guard = (fn) => { if (!user) return onLoginNeeded?.(); fn() }

  useEffect(() => {
    if (stage !== 'generating') return
    setProgress(0)
    const steps = [
      { p: 18, t: '分析描述词结构...' },
      { p: 40, t: '生成掐丝金线结构...' },
      { p: 66, t: '应用色彩填充与珐琅质感...' },
      { p: 88, t: '细化细节与纹理...' },
      { p: 100, t: '生成完成！' },
    ]
    let idx = 0
    const t = setInterval(() => {
      if (idx >= steps.length) {
        clearInterval(t)
        // 模拟成功
        const imgSeed = RESULT_IMAGES[style] + '%20' + encodeURIComponent(prompt.slice(0, 40))
        const img = IMG(imgSeed)
        const item = {
          id: Date.now(),
          image: img,
          styleKey: style,
          prompt: prompt || STYLES.find(s => s.k === style).desc,
          time: '刚刚',
        }
        setResult(item)
        setHistory([item, ...history].slice(0, 8))
        setStage('success')
        showToast('✨ 掐丝作品生成成功！', 'success')
        return
      }
      setProgress(steps[idx].p)
      setProgressText(steps[idx].t)
      idx++
    }, 1400)
    return () => clearInterval(t)
  }, [stage, style, prompt, history, showToast])

  const doGenerate = () => {
    guard(() => {
      if (!prompt.trim()) {
        showToast('请输入描述词，或点击下方预设提示词', 'warning')
        return
      }
      setStage('generating')
    })
  }

  const usePrompt = (p) => {
    setPrompt(p)
    showToast('已应用预设提示词', 'success')
  }

  const tryStyle = (k) => {
    setStyle(k)
    if (stage === 'success') setStage('idle')
  }

  const copyPrompt = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
    showToast('提示词已复制', 'success')
  }

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-5 space-y-6">
      {/* 标题 */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold flex items-center gap-2">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-[#FF9500] via-[#FF3B30] to-[#AF52DE] text-white flex items-center justify-center shadow-lg">
              <Palette size={20} />
            </div>
            掐丝生成器
          </h1>
          <p className="text-sm text-secondary mt-2">输入描述词，AI 一键生成传统掐丝珐琅风格艺术作品</p>
        </div>
        {(stage !== 'idle') && (
          <Button variant="outline" onClick={() => setStage('idle')} className="gap-2 self-start md:self-end">
            <RotateCcw size={16} /> 重新创作
          </Button>
        )}
      </div>

      {/* 工作区（左右布局：左参数、右预览） */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* 左：输入参数 */}
        <div className="lg:col-span-2 space-y-5">
          {/* 描述词 */}
          <Card className="p-5">
            <label className="text-sm font-bold mb-2.5 flex items-center gap-2">
              <Wand2 size={15} className="text-primary" />
              描述词
            </label>
            <Textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              onFocus={() => { if (!user) onLoginNeeded?.() }}
              placeholder="掐丝珐琅金丝线稿，黑底金线，掐丝工艺，精致复杂花纹，传统图案..."
              className="min-h-[120px] bg-muted/50 border-transparent focus:bg-white"
            />
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-secondary">{prompt.length} / 500 字</span>
              <button
                onClick={copyPrompt}
                className="text-xs text-secondary hover:text-primary flex items-center gap-1"
                disabled={!prompt}
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                {copied ? '已复制' : '复制提示词'}
              </button>
            </div>

            {/* 预设提示词 */}
            <div className="mt-4 pt-4 border-t border-border/60">
              <div className="text-xs font-semibold text-secondary mb-2.5 flex items-center gap-1.5">
                <Sparkles size={12} /> 试试这些灵感提示词
              </div>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_PROMPTS.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => usePrompt(p)}
                    className="px-2.5 py-1.5 rounded-full bg-muted hover:bg-primary/10 hover:text-primary text-xs text-foreground/75 transition truncate max-w-full"
                    title={p}
                  >
                    {p.length > 22 ? p.slice(0, 22) + '…' : p}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* 风格选项 */}
          <Card className="p-5">
            <label className="text-sm font-bold mb-3 flex items-center gap-2">
              <Palette size={15} className="text-primary" />
              选择风格
            </label>
            <div className="space-y-2.5">
              {STYLES.map(s => {
                const Icon = s.icon
                const active = style === s.k
                return (
                  <button
                    key={s.k}
                    onClick={() => tryStyle(s.k)}
                    className={cn(
                      'w-full text-left p-3.5 rounded-2xl transition border-2',
                      active
                        ? 'border-primary bg-primary/5 shadow-[0_0_0_3px_rgba(43,123,214,0.1)]'
                        : 'border-transparent bg-muted/40 hover:bg-muted'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        'h-10 w-10 shrink-0 rounded-xl flex items-center justify-center transition',
                        active ? 'bg-primary text-white' : 'bg-background text-secondary'
                      )}>
                        <Icon size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{s.label}</span>
                          {active && <span className="px-1.5 py-0.5 rounded-full bg-primary text-white text-[10px]">已选</span>}
                        </div>
                        <div className="text-xs text-secondary mt-0.5">{s.desc}</div>
                        <div className="text-[11px] text-primary/80 mt-1.5 flex items-center gap-1">
                          <Sparkles size={10} /> {s.hint}
                        </div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </Card>

          {/* 生成按钮 */}
          <Button
            className="w-full h-14 text-lg gap-2 shadow-lg shadow-primary/20"
            size="lg"
            disabled={stage === 'generating'}
            onClick={doGenerate}
          >
            {stage === 'generating' ? (
              <><Sparkles size={20} className="animate-pulse" /> 正在生成中...</>
            ) : (
              <><Sparkles size={20} /> 立即生成掐丝作品</>
            )}
          </Button>
        </div>

        {/* 右：预览区 */}
        <div className="lg:col-span-3 space-y-5">
          {/* 主预览 */}
          <Card className="p-0 overflow-hidden min-h-[480px] relative">
            {/* IDLE */}
            {stage === 'idle' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-muted/30 to-transparent">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#FF9500]/20 to-[#AF52DE]/20 text-[#FF3B30] flex items-center justify-center mb-5 animate-pulse">
                  <Paintbrush size={40} />
                </div>
                <h3 className="text-xl font-bold mb-2">等待创作</h3>
                <p className="text-sm text-secondary max-w-sm mb-5">
                  在左侧输入你的描述词，选择喜欢的风格，点击「立即生成」即可获得专属掐丝珐琅作品
                </p>
                <div className="grid grid-cols-4 gap-2 w-full max-w-md">
                  {STYLES.map(s => (
                    <div key={s.k} className="aspect-square rounded-xl bg-gradient-to-br from-white to-muted border border-border/60 flex items-center justify-center text-xs text-secondary">
                      {s.label}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* GENERATING */}
            {stage === 'generating' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                {/* 艺术化加载：一个图案逐渐显现 */}
                <div className="relative w-52 h-52 md:w-64 md:h-64 mb-6">
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#FF9500]/10 via-[#FF3B30]/10 to-[#AF52DE]/10 border-2 border-dashed border-[#FF9500]/40 animate-pulse" />
                  <div className="absolute inset-4 rounded-2xl bg-gradient-to-br from-[#FF9500]/20 via-[#FF3B30]/20 to-[#AF52DE]/20 animate-[spin_4s_linear_infinite]" style={{ animationDuration: '8s' }} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles size={48} className="text-[#FF9500] animate-bounce" />
                  </div>
                </div>
                <h3 className="text-lg font-bold mb-2">正在创作掐丝作品中...</h3>
                <p className="text-sm text-secondary mb-4 h-5">{progressText}</p>
                <div className="w-full max-w-md h-2.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#FF9500] via-[#FF3B30] to-[#AF52DE] transition-all duration-1000"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="mt-2 text-xs font-bold text-[#FF9500]">{progress}%</div>
              </div>
            )}

            {/* SUCCESS */}
            {stage === 'success' && result && (
              <div>
                <div className="relative aspect-square md:aspect-[4/3] bg-black">
                  <img
                    src={result.image}
                    alt="掐丝作品"
                    className="w-full h-full object-cover animate-fade-in"
                  />
                  {/* 角标 */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-1.5">
                      <Palette size={12} />
                      {STYLES.find(s => s.k === result.styleKey)?.label}风格
                    </span>
                    <span className="px-3 py-1.5 rounded-full bg-[#34C759]/80 backdrop-blur-md text-white text-xs font-semibold">
                      ✓ 生成完成
                    </span>
                  </div>
                  {/* 操作按钮（悬浮） */}
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    <button
                      onClick={() => showToast('开始下载高清大图...', 'success')}
                      className="h-11 px-4 rounded-full bg-white/95 backdrop-blur-md text-foreground text-sm font-bold shadow-xl flex items-center gap-1.5 hover:scale-105 transition"
                    >
                      <Download size={15} /> 下载高清图
                    </button>
                  </div>
                </div>
                {/* 底部信息 & 操作 */}
                <div className="p-5 space-y-4">
                  <div>
                    <div className="text-xs font-bold text-secondary mb-1.5">创作提示词</div>
                    <div className="text-sm leading-7 bg-muted rounded-xl px-4 py-3 text-foreground/85">
                      {result.prompt}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                    <Button className="h-12 gap-2" onClick={() => showToast('开始下载高清图 (4096×4096)', 'success')}>
                      <Download size={16} /> 下载高清图
                    </Button>
                    <Button variant="outline" className="h-12 gap-2" onClick={() => showToast('纹理已应用到模型，请到 3D 编辑器查看', 'success')}>
                      <ImageIcon size={16} /> 应用到模型纹理
                    </Button>
                    <Button variant="secondary" className="h-12 gap-2" onClick={() => showToast('分享链接已复制', 'success')}>
                      <Share2 size={16} /> 分享作品
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* 历史记录 */}
          {history.length > 0 && (
            <Card className="p-5">
              <h4 className="text-sm font-bold mb-3 flex items-center gap-2">
                <History size={15} className="text-primary" /> 最近创作
              </h4>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-2.5">
                {history.map(h => (
                  <button
                    key={h.id}
                    onClick={() => { setResult(h); setStyle(h.styleKey); setPrompt(h.prompt); setStage('success') }}
                    className="group relative aspect-square rounded-xl overflow-hidden border border-border/60 hover:border-primary transition shadow-card hover:-translate-y-0.5"
                  >
                    <img src={h.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition" />
                    <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/60 text-white text-[10px]">
                      {STYLES.find(s => s.k === h.styleKey)?.label}
                    </span>
                  </button>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
