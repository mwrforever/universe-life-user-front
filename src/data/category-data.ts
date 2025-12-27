// 分类数据配置

// 内联类型定义
interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  description?: string;
  subcategories?: Subcategory[];
  featuredItems?: FeaturedItem[];
}

interface Subcategory {
  id: string;
  name: string;
  icon?: React.ReactNode;
  link?: string;
}

interface FeaturedItem {
  id: string;
  title: string;
  description: string;
  image: string;
  link?: string;
  badge?: string;
}


export const categoryData: Category[] = [
  {
    id: 'gaming',
    name: '游戏竞技',
    icon: '🎮',
    color: '#ff6b00',
    description: '游戏代练、电竞陪练、游戏账号交易',
    subcategories: [
      { id: 'lol-coaching', name: 'LOL代练', icon: '🎯', link: '/gaming/lol' },
      { id: 'game-items', name: '游戏道具', icon: '🎪', link: '/gaming/items' },
      { id: 'game-accounts', name: '游戏账号', icon: '🎭', link: '/gaming/accounts' },
      { id: 'esports-coaching', name: '电竞陪练', icon: '🏆', link: '/gaming/coaching' },
    ],
    featuredItems: [
      {
        id: 'featured-1',
        title: '专业LOL段位提升',
        description: '国服顶尖选手团队，快速提升段位',
        image: '/images/gaming-banner-1.jpg',
        link: '/gaming/lol-boosting',
        badge: '热门'
      },
      {
        id: 'featured-2',
        title: '王者荣耀陪练',
        description: '技术主播1对1指导，提升游戏水平',
        image: '/images/gaming-banner-2.jpg',
        link: '/gaming/honor-coaching',
        badge: '推荐'
      }
    ]
  },
  {
    id: 'enterprise',
    name: '企业服务',
    icon: '🏢',
    color: '#1890ff',
    description: '企业注册、财务代账、法律咨询',
    subcategories: [
      { id: 'company-registration', name: '公司注册', icon: '📝', link: '/enterprise/registration' },
      { id: 'accounting', name: '财务代账', icon: '💰', link: '/enterprise/accounting' },
      { id: 'legal-service', name: '法律服务', icon: '⚖️', link: '/enterprise/legal' },
      { id: 'brand-design', name: '品牌设计', icon: '🎨', link: '/enterprise/design' },
    ],
    featuredItems: [
      {
        id: 'featured-3',
        title: '快速公司注册',
        description: '3天拿证，专业团队全程代办',
        image: '/images/enterprise-banner-1.jpg',
        link: '/enterprise/quick-registration',
        badge: '特惠'
      }
    ]
  },
  {
    id: 'campus',
    name: '校园服务',
    icon: '📚',
    color: '#52c41a',
    description: '论文指导、技能培训、实习推荐',
    subcategories: [
      { id: 'tutoring', name: '论文辅导', icon: '📖', link: '/campus/tutoring' },
      { id: 'skill-training', name: '技能培训', icon: '🎓', link: '/campus/training' },
      { id: 'internship', name: '实习推荐', icon: '💼', link: '/campus/internship' },
      { id: 'campus-jobs', name: '校园兼职', icon: '👔', link: '/campus/jobs' },
    ],
    featuredItems: [
      {
        id: 'featured-4',
        title: '毕业论文指导',
        description: '名校博士团队，全程指导修改',
        image: '/images/campus-banner-1.jpg',
        link: '/campus/thesis-guidance',
        badge: '专业'
      }
    ]
  },
  {
    id: 'design',
    name: '设计创作',
    icon: '🎨',
    color: '#722ed1',
    description: 'UI设计、平面设计、视频剪辑',
    subcategories: [
      { id: 'ui-design', name: 'UI设计', icon: '🖌️', link: '/design/ui' },
      { id: 'graphic-design', name: '平面设计', icon: '📐', link: '/design/graphic' },
      { id: 'video-editing', name: '视频剪辑', icon: '🎬', link: '/design/video' },
      { id: '3d-modeling', name: '3D建模', icon: '🏗️', link: '/design/3d' },
    ],
    featuredItems: [
      {
        id: 'featured-5',
        title: '专业UI设计',
        description: '资深设计师团队，打造精品界面',
        image: '/images/design-banner-1.jpg',
        link: '/design/ui-service',
        badge: '精品'
      }
    ]
  },
  {
    id: 'lifestyle',
    name: '生活服务',
    icon: '🏠',
    color: '#fa541c',
    description: '家政保洁、维修安装、代办跑腿',
    subcategories: [
      { id: 'cleaning', name: '家政保洁', icon: '🧹', link: '/lifestyle/cleaning' },
      { id: 'repair', name: '维修安装', icon: '🔧', link: '/lifestyle/repair' },
      { id: 'errand', name: '代办跑腿', icon: '🏃', link: '/lifestyle/errand' },
      { id: 'pet-service', name: '宠物服务', icon: '🐾', link: '/lifestyle/pet' },
    ],
    featuredItems: [
      {
        id: 'featured-6',
        title: '专业家政保洁',
        description: '经验丰富的保洁团队，让家焕然一新',
        image: '/images/lifestyle-banner-1.jpg',
        link: '/lifestyle/cleaning-service',
        badge: '信赖'
      }
    ]
  },
  {
    id: 'transportation',
    name: '出行交通',
    icon: '🚗',
    color: '#13c2c2',
    description: '租车服务、代驾服务、机场接送',
    subcategories: [
      { id: 'car-rental', name: '租车服务', icon: '🚙', link: '/transportation/rental' },
      { id: 'designated-driver', name: '代驾服务', icon: '👨‍✈️', link: '/transportation/driver' },
      { id: 'airport-transfer', name: '机场接送', icon: '✈️', link: '/transportation/airport' },
      { id: 'long-distance', name: '长途货运', icon: '🚚', link: '/transportation/freight' },
    ],
    featuredItems: [
      {
        id: 'featured-7',
        title: '安全代驾服务',
        description: '专业司机团队，安全有保障',
        image: '/images/transportation-banner-1.jpg',
        link: '/transportation/designated-driver',
        badge: '安全'
      }
    ]
  }
];

// 轮播图数据
export const carouselData = [
  {
    id: 'carousel-1',
    title: '专业游戏代练',
    subtitle: '国服顶尖选手，快速提升段位',
    image: '/images/hero-banner-gaming.svg',
    ctaText: '立即体验',
    ctaLink: '/gaming',
    type: 'internal' as const,
    backgroundColor: 'linear-gradient(135deg, #ff6b00 0%, #ff8c00 100%)',
    textColor: '#ffffff'
  },
  {
    id: 'carousel-2',
    title: '企业服务专家',
    subtitle: '一站式企业服务解决方案',
    image: '/images/hero-banner-enterprise.svg',
    ctaText: '咨询详情',
    ctaLink: '/enterprise',
    type: 'internal' as const,
    backgroundColor: 'linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)',
    textColor: '#ffffff'
  },
  {
    id: 'carousel-3',
    title: '校园生活助手',
    subtitle: '论文、实习、技能提升一站式服务',
    image: '/images/hero-banner-campus.svg',
    ctaText: '探索更多',
    ctaLink: '/campus',
    type: 'internal' as const,
    backgroundColor: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)',
    textColor: '#ffffff'
  },
  {
    id: 'carousel-4',
    title: '创意设计服务',
    subtitle: '专业设计团队，打造视觉精品',
    image: '/images/hero-banner-design.svg',
    ctaText: '查看作品',
    ctaLink: '/design',
    type: 'internal' as const,
    backgroundColor: 'linear-gradient(135deg, #722ed1 0%, #9254de 100%)',
    textColor: '#ffffff'
  }
];