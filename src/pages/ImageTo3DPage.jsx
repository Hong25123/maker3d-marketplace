import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext.jsx'
import { useToast } from '@/contexts/ToastContext.jsx'
import Card from '@/components/ui/Card.jsx'
import { Button } from '@/components/ui/Button.jsx'
import {
  UploadCloud, Image as ImageIcon, Sparkles, Loader2,
  Download, Share2, RotateCcw, Layers, Maximize2, Info, AlertTriangle, X, Wand2
} from 'lucide-react'
import { cn } from '@/lib/utils'

// 5种状态：idle | uploaded | generating | success | error

const SAMPLE_IMAGES = [
  { label: '卡通恐龙', seed: 'cartoon dinosaur kids drawing crayon style' },
  { label: '猫咪头像', seed: 'cute cat portrait cartoon style' },
  { label: '城堡线稿', seed: 'fantasy castle line art illustration' },
  { label: '机械风机器人', seed: 'mecha robot sketch drawing' },
]

const IMG = (seed) =>
  `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(seed)}&image_size=square`

const RESULT_PRESETS = [
  {
    name: '自动生成的3D模型',
    faces: '约 24,560 面',
    tris: '约 48,890 三角面',
    size: '3.2 MB',
    dimensions: '120 × 90 × 80 mm',
  }
]

export default function ImageTo3DPage({ onLoginNeeded }) {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [stage, setStage] = useState('idle') // idle/uploaded/generating/success/error
  const [uploadedImage, setUploadedImage] = useState(null)
  const [progress, setProgress] = useState(0)
  const [progressText, setProgressText] = useState('')
  const fileRef = useRef(null)
  const [rotateAngle, setRotateAngle] = useState(0)

  const guard = (fn) => { if (!user) return onLoginNeeded?.(); fn() }

  // 生成进度动画
  useEffect(() => {
    if (stage !== 'generating') return
    setProgress(0)
    setProgressText('正在解析图片轮廓...')
    const steps = [
      { p: 20, t: '正在识别主体形状...' },
      { p: 45, t: '正在构建3D几何体...' },
      { p: 70, t: '正在生成细节纹理...' },
      { p: 92, t: '正在优化模型网格...' },
      { p: 100, t: '生成完成！' },
    ]
    let idx = 0
    const t = setInterval(() => {
      if (idx >= steps.length) {
        clearInterval(t)
        setStage('success')
        showToast('🎉 3D模型生成成功！', 'success')
        return
      }
      setProgress(steps[idx].p)
      setProgressText(steps[idx].t)
      idx++
    }, 1800)
    return () => clearInterval(t)
  }, [stage, showToast])

  const pickSample = (seed) => {
    guard(() => {
      setUploadedImage(IMG(seed))
      setStage('uploaded')
    })
  }

  const onFileChange = (e) => {
    guard(() => {
      const f = e.target.files?.[0]
      if (!f) return
      if (!f.type.startsWith('image/')) {
        showToast('请选择图片文件', 'error')
        return
      }
      if (f.size > 10 * 1024 * 1024) {
        showToast('图片大小不能超过10MB', 'error')
        return
      }
      const url = URL.createObjectURL(f)
      setUploadedImage(url)
      setStage('uploaded')
    })
  }

  const onDrop = (e) => {
    e.preventDefault()
    guard(() => {
      const f = e.dataTransfer.files?.[0]
      if (!f || !f.type.startsWith('image/')) {
        showToast('请拖入图片文件', 'error')
        return
      }
      const url = URL.createObjectURL(f)
      setUploadedImage(url)
      setStage('uploaded')
    })
  }

  const startGenerate = () => {
    if (!uploadedImage) return
    setStage('generating')
  }

  const resetAll = () => {
    setStage('idle')
    setUploadedImage(null)
    setProgress(0)
    setProgressText('')
  }

  const result = RESULT_PRESETS[0]

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-5 space-y-6">
      {/* 标题 */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold flex items-center gap-2">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-[#2B7BD6] to-[#6AA9E8] text-white flex items-center justify-center">
              <Wand2 size={20} />
            </div>
            图生3D模型
          </h1>
          <p className="text-sm text-secondary mt-2">上传任意图片，AI 一键将其转换为可打印的 3D 模型</p>
        </div>
        {(stage !== 'idle') && (
          <Button variant="outline" onClick={resetAll} className="gap-2 self-start md:self-end">
            <RotateCcw size={16} /> 重新开始
          </Button>
        )}
      </div>

      {/* 工作区 */}
      <Card className="p-5 md:p-8 min-h-[480px]">
        {/* ================== IDLE / UPLOADED 状态 ================== */}
        {(stage === 'idle' || stage === 'uploaded') && (
          <div className="space-y-6">
            {/* 上传区 */}
            <div
              onClick={() => guard(() => fileRef.current?.click())}
              onDragOver={(e) => e.preventDefault()}
              onDrop={onDrop}
              className={cn(
                'relative rounded-3xl border-2 border-dashed transition-all duration-300 cursor-pointer overflow-hidden',
                stage === 'uploaded'
                  ? 'border-primary/50 bg-primary/5 p-4 md:p-6'
                  : 'border-border bg-muted/40 hover:border-primary/50 hover:bg-primary/5 p-8 md:p-12 text-center'
              )}
            >
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onFileChange}
              />
              {stage === 'uploaded' ? (
                <div className="flex flex-col md:flex-row items-center gap-5">
                  <div className="relative shrink-0 w-full md:w-56 aspect-square rounded-2xl overflow-hidden bg-muted shadow-card">
                    <img src={uploadedImage} alt="" className="w-full h-full object-cover" />
                    <button
                      onClick={(e) => { e.stopPropagation(); setStage('idle'); setUploadedImage(null) }}
                      className="absolute top-2 right-2 h-7 w-7 rounded-full bg-black/50 text-white flex items-center justify-center backdrop-blur-md hover:bg-black/70"
                    >
                      <X size={14} />
                    </button>
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-md text-white text-[10px] font-medium">
                      已上传
                    </span>
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-lg font-bold mb-1">图片上传成功 ✨</h3>
                    <p className="text-sm text-secondary mb-4">点击右侧按钮开始生成，或重新选择其他图片</p>
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                      <Button className="gap-2" size="lg" onClick={(e) => { e.stopPropagation(); startGenerate() }}>
                        <Sparkles size={17} />
                        生成3D模型
                      </Button>
                      <Button variant="outline" size="lg" onClick={(e) => { e.stopPropagation(); fileRef.current?.click() }} className="gap-2">
                        <ImageIcon size={16} />
                        更换图片
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-primary/10 text-primary flex items-center justify-center">
                    <UploadCloud size={36} />
                  </div>
                  <h3 className="text-xl font-bold mb-1">点击或拖拽图片到此区域</h3>
                  <p className="text-sm text-secondary mb-5">支持 JPG / PNG / WEBP，最大 10MB · 建议主体清晰、背景干净</p>
                  <Button variant="outline" className="gap-2" onClick={(e) => { e.stopPropagation(); guard(() => fileRef.current?.click()) }}>
                    <ImageIcon size={16} />
                    选择图片
                  </Button>
                </div>
              )}
            </div>

            {/* 示例图（仅 idle 时展示） */}
            {stage === 'idle' && (
              <div>
                <div className="flex items-center gap-2 mb-3 px-1">
                  <Sparkles size={15} className="text-primary" />
                  <span className="text-sm font-semibold">试试这些示例图</span>
                  <span className="text-xs text-secondary">（点击直接使用）</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {SAMPLE_IMAGES.map(s => (
                    <button
                      key={s.label}
                      onClick={() => pickSample(s.seed)}
                      className="group relative aspect-square rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition"
                    >
                      <img src={IMG(s.seed)} alt={s.label} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <span className="absolute bottom-2 left-2 right-2 text-white text-xs font-semibold text-left">{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================== GENERATING 状态 ================== */}
        {stage === 'generating' && (
          <div className="flex flex-col items-center justify-center py-14 space-y-6">
            {/* 3D 旋转加载动画 */}
            <div className="relative">
              <div
                className="w-32 h-32 md:w-40 md:h-40 perspective-1000 animate-spin"
                style={{ animationDuration: '3s' }}
              >
                <div className="w-full h-full rounded-3xl bg-gradient-to-br from-primary via-[#6AA9E8] to-[#AF52DE] shadow-2xl opacity-80 flex items-center justify-center">
                  <div className="w-16 h-20 md:w-20 md:h-24 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30" />
                </div>
              </div>
              <div className="absolute inset-0 animate-ping opacity-20">
                <div className="w-full h-full rounded-full border-4 border-primary" />
              </div>
            </div>

            <div className="text-center max-w-md">
              <h3 className="text-xl font-bold mb-2">AI 正在生成您的3D模型...</h3>
              <p className="text-sm text-secondary mb-5 h-5">{progressText}</p>
              <div className="relative h-3 rounded-full bg-muted overflow-hidden mx-auto max-w-xs">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-[#6AA9E8] transition-all duration-1000 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="mt-2 text-xs font-bold text-primary">{progress}%</div>
            </div>

            <p className="text-xs text-secondary flex items-center gap-1.5">
              <Info size={12} />
              预计需要 15 秒，请耐心等待，不要关闭此页面
            </p>
          </div>
        )}

        {/* ================== SUCCESS 状态 ================== */}
        {stage === 'success' && (
          <div className="space-y-5">
            <div className="rounded-2xl bg-[#34C759]/10 border border-[#34C759]/20 p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-[#34C759] text-white flex items-center justify-center shrink-0">
                ✓
              </div>
              <div>
                <div className="font-bold text-[#1F8A3D]">模型生成完成！</div>
                <div className="text-xs text-[#1F8A3D]/80">已自动优化网格，可直接用于3D打印或编辑</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
              {/* 左：3D预览 */}
              <div className="lg:col-span-3 space-y-3">
                <div className="relative aspect-[4/3] md:aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 shadow-card group">
                  {/* 伪3D预览（placeholder） */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className="relative transition-transform duration-500 ease-out"
                      style={{ transform: `rotateY(${rotateAngle}deg) rotateX(20deg)` }}
                    >
                      <div
                        onClick={() => setRotateAngle(a => a + 45)}
                        className="w-48 h-60 md:w-56 md:h-72 cursor-pointer"
                      >
                        <div className="w-full h-full relative transform-style-preserve-3d perspective-1000">
                          <img src={uploadedImage} alt="" className="absolute inset-0 w-full h-full object-cover rounded-3xl opacity-90" />
                          <div className="absolute inset-0 rounded-3xl border border-white/20 bg-gradient-to-br from-white/10 via-transparent to-white/5" />
                          <div className="absolute bottom-3 left-3 right-3 py-1.5 px-3 rounded-full bg-black/40 backdrop-blur-md text-white text-[10px] flex items-center justify-center gap-2">
                            <Layers size={11} /> 3D 预览 · 点击旋转
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* 工具条 */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-white text-[11px] font-medium flex items-center gap-1.5">
                      <Maximize2 size={11} /> 3D 预览区
                    </span>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => setRotateAngle(a => a - 45)}
                        className="h-8 w-8 rounded-lg bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition"
                      >
                        <RotateCcw size={14} />
                      </button>
                      <button
                        onClick={() => setRotateAngle(a => a + 45)}
                        className="h-8 w-8 rounded-lg bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition"
                      >
                        <RotateCcw size={14} className="scale-x-[-1]" />
                      </button>
                    </div>
                  </div>
                  {/* 底部参考图小缩略 */}
                  <div className="absolute bottom-3 right-3 flex gap-2">
                    <div className="h-12 w-12 rounded-lg border border-white/20 overflow-hidden bg-muted shadow-lg">
                      <img src={uploadedImage} alt="" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>

                <p className="text-xs text-secondary text-center">提示：可拖拽预览区旋转查看模型不同角度（示例）</p>
              </div>

              {/* 右：模型信息 + 操作 */}
              <div className="lg:col-span-2 space-y-4">
                <Card className="p-5 space-y-4 shadow-none border border-border/60">
                  <h3 className="font-bold text-base flex items-center gap-2">
                    <Info size={16} className="text-primary" /> 模型信息
                  </h3>
                  <div className="space-y-3 text-sm">
                    {[
                      { label: '模型名称', value: result.name },
                      { label: '几何面数', value: result.faces },
                      { label: '三角面数', value: result.tris },
                      { label: '文件大小', value: result.size },
                      { label: '建议尺寸', value: result.dimensions },
                    ].map(item => (
                      <div key={item.label} className="flex items-center justify-between pb-2 border-b border-border/50 last:border-0 last:pb-0">
                        <span className="text-secondary">{item.label}</span>
                        <span className="font-semibold">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                <div className="space-y-2.5">
                  <Button className="w-full h-13 gap-2 text-base" onClick={() => showToast('开始下载 OBJ 文件...', 'success')}>
                    <Download size={18} /> 下载 OBJ 格式
                  </Button>
                  <Button variant="outline" className="w-full h-13 gap-2" onClick={() => showToast('开始下载 STL 文件...', 'success')}>
                    <Download size={18} /> 下载 STL 格式
                  </Button>
                  <Button variant="secondary" className="w-full h-12 gap-2" onClick={() => showToast('分享链接已复制', 'success')}>
                    <Share2 size={16} /> 分享这个模型
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================== ERROR 状态 ================== */}
        {stage === 'error' && (
          <div className="flex flex-col items-center justify-center py-16 space-y-5 text-center">
            <div className="h-16 w-16 rounded-full bg-[#FF3B30]/10 text-[#FF3B30] flex items-center justify-center">
              <AlertTriangle size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-1">生成失败</h3>
              <p className="text-sm text-secondary">无法识别图片主体，请尝试使用主体更清晰的图片</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={resetAll}>换张图片</Button>
              <Button onClick={startGenerate} className="gap-2">
                <RotateCcw size={15} /> 重试生成
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* 小提示 */}
      <Card className="p-5">
        <h4 className="text-sm font-bold mb-3 flex items-center gap-2">
          <Info size={15} className="text-primary" /> 小贴士 · 获得更好的效果
        </h4>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-sm text-foreground/75">
          {[
            '使用正面视角、主体居中的图片',
            '尽量选择高对比度、背景干净的图片',
            '避免图片中出现过多文字或水印',
            '卡通风格、线稿图效果通常更好',
          ].map((tip, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" /> {tip}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}
