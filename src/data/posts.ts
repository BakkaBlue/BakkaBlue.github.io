export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  date: string
  tags: string[]
  /** simple paragraphs + headings for now (no markdown dep) */
  body: Array<
    | { type: 'p'; text: string }
    | { type: 'h2'; text: string }
    | { type: 'ul'; items: string[] }
    | { type: 'code'; text: string }
  >
}

export const posts: BlogPost[] = [
  {
    slug: 'ai-as-wheelchair-not-brain',
    title: '把 AI 当轮椅，而不是大脑',
    excerpt: '重度使用 AI 不丢人。丢人的是把判断力也外包出去。',
    date: '2026-07-12',
    tags: ['AI', '工作流'],
    body: [
      {
        type: 'p',
        text: '我经常自嘲“离了 AI 轮椅就是废人一个”。这句玩笑里其实藏着一个边界：工具可以替代体力，不该替代审美与决策。',
      },
      { type: 'h2', text: '轮椅负责速度' },
      {
        type: 'p',
        text: '脚手架、样板代码、文案草稿、排查路径——这些适合交给模型。它擅长把“已知路径”走快。',
      },
      { type: 'h2', text: '大脑负责方向' },
      {
        type: 'ul',
        items: [
          '这个功能值不值得做？',
          '交互是否克制、是否高级？',
          '错误假设有没有被模型带偏？',
          '上线后谁来维护、怎么验证？',
        ],
      },
      {
        type: 'p',
        text: '最好的协作状态，是你始终拿着方向盘：模型给候选，你做取舍；模型给补丁，你负责验收。',
      },
    ],
  },
  {
    slug: 'quiet-luxury-on-the-web',
    title: '网页上的 Quiet Luxury',
    excerpt: '高级感很少来自更多特效，而来自更少噪声、更稳的节奏。',
    date: '2026-07-08',
    tags: ['设计', '前端'],
    body: [
      {
        type: 'p',
        text: '做个人站时很容易陷入“特效竞赛”。真正耐看的页面往往相反：深色底、柔光、清楚层级、克制动效。',
      },
      { type: 'h2', text: '我在用的几条原则' },
      {
        type: 'ul',
        items: [
          '先保证信息结构，再谈氛围',
          '高光要可见，但不要闪',
          '动画服务呼吸感，不服务注意力劫持',
          '移动端优先减层，而不是等比压缩',
        ],
      },
      {
        type: 'p',
        text: '如果一个背景效果需要你“盯着看”才成立，它大概还不够高级。高级是余光里就对了。',
      },
    ],
  },
  {
    slug: 'shipping-small-projects',
    title: '小项目也要能打开',
    excerpt: '半成品堆仓库没意义。能点开、能玩、能分享，才算完成。',
    date: '2026-06-30',
    tags: ['产品', '工程'],
    body: [
      {
        type: 'p',
        text: 'Idle Realms、Color Wordle、Laohei Music 都不是“大而全”的产品，但它们都满足一个条件：链接点开就有反馈。',
      },
      { type: 'h2', text: '完成的最小定义' },
      {
        type: 'ul',
        items: [
          '有入口（主页能找到）',
          '有一次完整体验闭环',
          '有基本可读的说明',
          '部署后可访问，而不是只在本机',
        ],
      },
      {
        type: 'p',
        text: '小而可玩，胜过大而永久 WIP。这也是我维护 github.io 的方式：主页是门厅，项目是房间，博客是笔记墙。',
      },
    ],
  },
]

export function getPost(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug)
}

export function getAllPosts(): BlogPost[] {
  return [...posts].sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-')
  return `${y}.${m}.${d}`
}
