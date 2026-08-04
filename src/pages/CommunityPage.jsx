import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext.jsx'
import { useToast } from '@/contexts/ToastContext.jsx'
import Card from '@/components/ui/Card.jsx'
import { Button } from '@/components/ui/Button.jsx'
import { Textarea } from '@/components/ui/Input.jsx'
import {
  ImagePlus, Send, Heart, MessageCircle, Share2, MoreHorizontal,
  Image as ImageIcon, Link as LinkIcon, Smile, ThumbsUp, X, ChevronDown
} from 'lucide-react'
import { cn } from '@/lib/utils'

const INITIAL_POSTS = [
  {
    id: 1,
    user: { name: '造物达人阿杰', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=u1', level: '金牌创客' },
    time: '2小时前',
    text: '新做了一个可动的机械花模型！每一片花瓣都能独立开合，打印了整整18小时，效果太惊艳了 🌸 模型文件已上传，欢迎下载打印～',
    images: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=3D%20printed%20mechanical%20flower%20articulated%20petals%20pink%20color%20product%20photo&image_size=square',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=3D%20printed%20rose%20flower%20closeup%20detail%20petal%20product%20photo&image_size=square',
    ],
    likes: 256, comments: 38, shares: 12,
    liked: false,
    commentList: [
      { id: 1, user: '小李老师', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=c1', text: '太厉害了！请问用的什么材料？', time: '1小时前', likes: 3 },
      { id: 2, user: '创客小白', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=c2', text: '已下载打印，效果超棒，感谢分享！', time: '30分钟前', likes: 5 },
    ],
  },
  {
    id: 2,
    user: { name: '3D设计师小萌', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=u2', level: '资深设计师' },
    time: '5小时前',
    text: '今日份灵感分享：用掐丝生成器做的敦煌风格纹样，金线配朱红底，太有氛围感了！准备把它做成实体装饰画✨',
    images: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cloisonne%20dunhuang%20style%20gold%20wire%20red%20background%20pattern%20art&image_size=square',
    ],
    likes: 892, comments: 126, shares: 87,
    liked: true,
    commentList: [
      { id: 1, user: '艺术发烧友', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=c3', text: '这个颜色搭配绝了！求教程🙏', time: '4小时前', likes: 12 },
    ],
  },
  {
    id: 3,
    user: { name: '极客爸爸', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=u3', level: '活跃用户' },
    time: '昨天',
    text: '用图片转3D功能把儿子画的恐龙变成了实物模型！打印出来那一刻他直接尖叫哈哈哈，强烈推荐大家试试这个功能，太有仪式感了！',
    images: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=child%20drawing%20dinosaur%20compared%20with%203D%20printed%20dinosaur%20toy%20happy%20family&image_size=square',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=kids%20drawing%20crayon%20dinosaur%20on%20paper%20cute&image_size=square',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=3D%20printed%20cartoon%20dinosaur%20colorful%20toy%20product%20photo&image_size=square',
    ],
    likes: 1285, comments: 203, shares: 156,
    liked: false,
    commentList: [],
  },
]

export default function CommunityPage({ onLoginNeeded }) {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [posts, setPosts] = useState(INITIAL_POSTS)
  const [draft, setDraft] = useState('')
  const [draftImages, setDraftImages] = useState([])
  const [expandedComments, setExpandedComments] = useState({})
  const [newComments, setNewComments] = useState({})
  const [tab, setTab] = useState('hot')

  const guard = (fn) => {
    if (!user) return onLoginNeeded?.()
    fn()
  }

  const doPublish = () => {
    guard(() => {
      const text = draft.trim()
      if (!text && draftImages.length === 0) {
        showToast('写点内容或加张图片吧～', 'warning')
        return
      }
      const newPost = {
        id: Date.now(),
        user: { name: user.nickname, avatar: user.avatar, level: user.level },
        time: '刚刚',
        text,
        images: draftImages,
        likes: 0, comments: 0, shares: 0,
        liked: false,
        commentList: [],
      }
      setPosts([newPost, ...posts])
      setDraft('')
      setDraftImages([])
      showToast('发布成功！', 'success')
    })
  }

  const addMockImage = () => {
    guard(() => {
      if (draftImages.length >= 6) {
        showToast('最多上传6张图片', 'warning')
        return
      }
      const samples = [
        'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=3D%20printed%20creative%20toy%20cute%20product%20photo&image_size=square',
        'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=creative%203D%20printing%20workshop%20aesthetic%20photo&image_size=square',
      ]
      setDraftImages([...draftImages, samples[draftImages.length % samples.length]])
    })
  }

  const toggleLike = (postId) => {
    guard(() => {
      setPosts(posts.map(p => p.id === postId ? {
        ...p, liked: !p.liked, likes: p.likes + (p.liked ? -1 : 1)
      } : p))
    })
  }

  const toggleComments = (postId) => {
    setExpandedComments(prev => ({ ...prev, [postId]: !prev[postId] }))
  }

  const submitComment = (postId) => {
    guard(() => {
      const text = (newComments[postId] || '').trim()
      if (!text) return showToast('请输入评论内容', 'warning')
      setPosts(posts.map(p => p.id === postId ? {
        ...p,
        comments: p.comments + 1,
        commentList: [...p.commentList, {
          id: Date.now(),
          user: user.nickname, avatar: user.avatar,
          text, time: '刚刚', likes: 0,
        }],
      } : p))
      setNewComments(prev => ({ ...prev, [postId]: '' }))
      showToast('评论发送成功', 'success')
    })
  }

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-6 py-5 space-y-5">
      {/* Tab */}
      <div className="hide-scrollbar-x -mx-4 md:mx-0 px-4 md:px-0">
        <div className="flex gap-1 bg-muted p-1 rounded-2xl w-fit">
          {[
            { k: 'hot', label: '🔥 热门' },
            { k: 'new', label: '✨ 最新' },
            { k: 'follow', label: '👥 关注' },
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

      {/* 发布框 */}
      <Card className="p-4 md:p-5">
        <div className="flex gap-3">
          <img
            src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=guest'}
            className="h-11 w-11 rounded-full bg-muted shrink-0"
            alt=""
          />
          <div className="flex-1 min-w-0 space-y-3">
            <Textarea
              placeholder={user ? '分享你的创作灵感、作品或技术心得...' : '登录后即可发布帖子'}
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onFocus={() => { if (!user) onLoginNeeded?.() }}
              className="bg-muted/50 min-h-[88px] border-transparent focus:bg-white"
            />
            {/* 图片预览 */}
            {draftImages.length > 0 && (
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                {draftImages.map((src, i) => (
                  <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    <button
                      onClick={() => setDraftImages(draftImages.filter((_, j) => j !== i))}
                      className="absolute top-1 right-1 h-5 w-5 rounded-full bg-black/50 text-white flex items-center justify-center"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {/* 工具栏 */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={addMockImage}
                  className="h-9 px-3 rounded-full hover:bg-muted flex items-center gap-1.5 text-sm text-secondary transition"
                >
                  <ImagePlus size={16} />
                  <span className="hidden sm:inline">图片</span>
                </button>
                <button className="h-9 px-3 rounded-full hover:bg-muted flex items-center gap-1.5 text-sm text-secondary transition">
                  <LinkIcon size={16} />
                  <span className="hidden sm:inline">链接</span>
                </button>
                <button className="h-9 px-3 rounded-full hover:bg-muted flex items-center gap-1.5 text-sm text-secondary transition">
                  <Smile size={16} />
                  <span className="hidden sm:inline">表情</span>
                </button>
              </div>
              <Button onClick={doPublish} className="gap-1.5" disabled={!user}>
                <Send size={15} />
                发布
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* 帖子流 */}
      <div className="space-y-4">
        {posts.map(post => (
          <Card key={post.id} className="p-4 md:p-5">
            {/* 用户信息 */}
            <div className="flex items-start gap-3 mb-3">
              <img src={post.user.avatar} className="h-11 w-11 rounded-full bg-muted" alt="" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold">{post.user.name}</span>
                  <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold">{post.user.level}</span>
                </div>
                <div className="text-xs text-secondary mt-0.5">{post.time}</div>
              </div>
              <button className="h-8 w-8 rounded-full hover:bg-muted flex items-center justify-center text-secondary">
                <MoreHorizontal size={16} />
              </button>
            </div>

            {/* 内容 */}
            {post.text && (
              <p className="text-sm leading-7 mb-3 whitespace-pre-wrap">{post.text}</p>
            )}

            {/* 图片网格 */}
            {post.images && post.images.length > 0 && (
              <div className={cn(
                'grid gap-2 mb-3 rounded-xl overflow-hidden',
                post.images.length === 1 ? 'grid-cols-1' :
                  post.images.length === 2 ? 'grid-cols-2' :
                    post.images.length === 4 ? 'grid-cols-2' :
                      'grid-cols-3'
              )}>
                {post.images.map((src, i) => (
                  <div
                    key={i}
                    className={cn(
                      'relative overflow-hidden bg-muted',
                      post.images.length === 1 ? 'aspect-[4/3] rounded-xl' : 'aspect-square rounded-lg'
                    )}
                  >
                    <img src={src} alt="" loading="lazy" className="w-full h-full object-cover hover:scale-105 transition duration-500" />
                  </div>
                ))}
              </div>
            )}

            {/* 操作栏 */}
            <div className="flex items-center justify-between border-t border-border/60 pt-3 -mx-1">
              <button
                onClick={() => toggleLike(post.id)}
                className={cn(
                  'flex-1 h-9 flex items-center justify-center gap-1.5 rounded-xl text-sm font-medium transition',
                  post.liked ? 'text-[#FF3B30] bg-[#FF3B30]/5' : 'text-secondary hover:bg-muted'
                )}
              >
                <Heart size={16} fill={post.liked ? 'currentColor' : 'none'} />
                {post.likes}
              </button>
              <button
                onClick={() => toggleComments(post.id)}
                className="flex-1 h-9 flex items-center justify-center gap-1.5 rounded-xl text-sm font-medium text-secondary hover:bg-muted transition"
              >
                <MessageCircle size={16} />
                {post.comments}
              </button>
              <button
                onClick={() => guard(() => showToast('链接已复制，快去分享吧～', 'success'))}
                className="flex-1 h-9 flex items-center justify-center gap-1.5 rounded-xl text-sm font-medium text-secondary hover:bg-muted transition"
              >
                <Share2 size={16} />
                {post.shares}
              </button>
            </div>

            {/* 评论区 */}
            {expandedComments[post.id] && (
              <div className="mt-4 pt-4 border-t border-border/60 space-y-4 animate-fade-in">
                {/* 评论列表 */}
                {post.commentList.length > 0 ? (
                  <div className="space-y-4">
                    {post.commentList.map(c => (
                      <div key={c.id} className="flex gap-3">
                        <img src={c.avatar} className="h-8 w-8 rounded-full bg-muted shrink-0" alt="" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold">{c.user}</span>
                            <span className="text-xs text-secondary">{c.time}</span>
                          </div>
                          <p className="text-sm leading-6 mt-1">{c.text}</p>
                          <button
                            onClick={() => guard(() => showToast('点赞成功', 'success'))}
                            className="mt-1 inline-flex items-center gap-1 text-xs text-secondary hover:text-[#FF3B30] transition"
                          >
                            <ThumbsUp size={12} /> {c.likes}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-secondary text-sm">暂无评论，来抢沙发吧～</div>
                )}

                {/* 评论输入 */}
                <div className="flex gap-2 pt-2">
                  <img
                    src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=guest'}
                    className="h-8 w-8 rounded-full bg-muted shrink-0"
                    alt=""
                  />
                  <div className="flex-1 flex gap-2">
                    <input
                      value={newComments[post.id] || ''}
                      onChange={e => setNewComments({ ...newComments, [post.id]: e.target.value })}
                      onKeyDown={e => { if (e.key === 'Enter') submitComment(post.id) }}
                      onFocus={() => { if (!user) onLoginNeeded?.() }}
                      placeholder="友善评论，用心交流..."
                      className="flex-1 h-9 px-4 rounded-full bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                    <Button size="sm" onClick={() => submitComment(post.id)}>
                      <Send size={13} />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      <div className="py-8 text-center text-xs text-secondary">—— 已经到底啦，去发布第一条帖子吧 ——</div>
    </div>
  )
}
