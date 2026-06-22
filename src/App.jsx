import { Suspense, lazy, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowUpRight,
  BriefcaseBusiness,
  CircleX,
  Clapperboard,
  Cpu,
  ExternalLink,
  Gem,
  Mail,
  MapPin,
  MessageCircle,
  MonitorPlay,
  Phone,
  Sparkles,
  Target,
  Volume2,
  VolumeX,
} from 'lucide-react';
import BorderGlow from './components/BorderGlow';
import CountUp from './components/CountUp';
import Folder from './components/Folder';
import SpotlightCard from './components/SpotlightCard';
import { portfolioWorks } from './portfolioWorks.generated';

const profileAvatarImage = '/assets/profile-avatar.jpg';

const CircularGallery = lazy(() => import('./components/CircularGallery'));
const ElasticSlider = lazy(() => import('./components/ElasticSlider'));
const Grainient = lazy(() => import('./components/Grainient'));
const Masonry = lazy(() => import('./components/Masonry'));
const TiltedCard = lazy(() => import('./components/TiltedCard'));

gsap.registerPlugin(ScrollTrigger);

const navItems = [
  { label: '工作经历', href: '#profile' },
  { label: '精选作品', href: '#projects' },
  { label: '个人优势', href: '#strengths' },
];

const stats = [
  { value: '45+', label: '月均创意/素材脚本' },
  { value: '7500W', label: '参与投放消耗量级' },
  { value: '2.1', label: '项目素材 ROI' },
  { value: '1200W', label: '内容累计播放' },
  { value: '100W$', label: '跨境订单参与金额' },
];

const contacts = [
  { icon: Phone, label: '手机', value: '18159520607', href: 'tel:18159520607' },
  { icon: MessageCircle, label: '微信', value: 'LinMMinL' },
  { icon: Mail, label: '邮箱', value: '1248591115@qq.com', href: 'mailto:1248591115@qq.com' },
  { icon: MapPin, label: '城市', value: '福建福州' },
];

const projects = [
  {
    title: 'Poster Design',
    cn: '海报主视觉',
    image: '/assets/poster-design.jpg',
    tags: ['构图', '配色', '字体层级', '主视觉合成'],
    desc: '城市漫游、烘焙、咖啡节、健身、老派黑白等主题海报，训练画面秩序与情绪表达。',
  },
  {
    title: 'UI Design',
    cn: '旅游APP / 游戏UI',
    image: '/assets/ui-design.jpg',
    tags: ['信息架构', '页面一致性', '用户路径'],
    desc: '完成福建旅游 APP 与手游 UI 设计，覆盖启动页、首页、详情、行程、地图、订单和个人中心等页面。',
  },
  {
    title: 'E-commerce Design',
    cn: '电商主图与卖点图',
    image: '/assets/business-design.jpg',
    tags: ['点击转化', '卖点可视化', '跨境表达'],
    desc: '覆盖 3C、家具、美妆、血压计、宠物饮水机、服装等品类，围绕用户点击动机组织视觉。',
  },
  {
    title: 'Package Design',
    cn: '包装与系列版式',
    image: '/assets/package-design.jpg',
    tags: ['包装版式', '工艺沟通', '品牌质感'],
    desc: '宠物食品、香薰护肤、旅游纪念品与产品展示图，强调系列化统一和交付可落地。',
  },
  {
    title: 'Cover Design',
    cn: '短剧 / 游戏封面',
    image: '/assets/cover-design.jpg',
    tags: ['情绪钩子', '角色张力', '内容封面'],
    desc: '结合短视频内容节奏、标题钩子和用户反馈经验，强化封面的第一眼吸引力。',
  },
  {
    title: 'Game Creative',
    cn: '游戏广告创意策划',
    image: '/assets/book-design.jpg',
    tags: ['买量素材', '脚本', '素材复盘'],
    desc: '参与 SLG、卡牌等游戏项目，拆解玩法、角色、付费点和活动节点，输出短视频脚本与素材 brief。',
  },
];

const heroGalleryItems = [
  {
    title: 'Illustration 01',
    cn: '插画作品',
    image: '/assets/hero-gallery/hero-01.jpg',
    text: 'Illustration',
    desc: '角色插画与氛围视觉作品，展示人物设定、构图和画面叙事能力。',
  },
  {
    title: 'Illustration 02',
    cn: '插画作品',
    image: '/assets/hero-gallery/hero-02.jpg',
    text: 'Illustration',
    desc: '角色插画与氛围视觉作品，展示人物设定、构图和画面叙事能力。',
  },
  {
    title: 'Illustration 03',
    cn: '插画作品',
    image: '/assets/hero-gallery/hero-03.jpg',
    text: 'Illustration',
    desc: '角色插画与氛围视觉作品，展示人物设定、构图和画面叙事能力。',
  },
  {
    title: 'Illustration 04',
    cn: '插画作品',
    image: '/assets/hero-gallery/hero-04.jpg',
    text: 'Illustration',
    desc: '角色插画与氛围视觉作品，展示人物设定、构图和画面叙事能力。',
  },
  {
    title: 'Illustration 05',
    cn: '插画作品',
    image: '/assets/hero-gallery/hero-05.jpg',
    text: 'Illustration',
    desc: '角色插画与氛围视觉作品，展示人物设定、构图和画面叙事能力。',
  },
  {
    title: 'IP Design 01',
    cn: '茶宝 IP 形象设计',
    image: '/assets/hero-gallery/hero-06.jpg',
    text: 'IP Design',
    desc: '茶饮品牌 IP 形象设定，包含三视图、表情延展、品牌色和应用延展。',
  },
  {
    title: 'IP Design 02',
    cn: '小薯 IP 形象设计',
    image: '/assets/hero-gallery/hero-07.jpg',
    text: 'IP Design',
    desc: '零食 IP 形象设定，覆盖角色档案、表情包、百变造型和包装周边应用。',
  },
  {
    title: 'IP Design 03',
    cn: '红军 IP 形象设计',
    image: '/assets/hero-gallery/hero-08.jpg',
    text: 'IP Design',
    desc: '红色文化 IP 形象设定，兼顾角色亲和力、文化识别和文创延展。',
  },
  {
    title: 'Package Design 01',
    cn: '猫粮包装设计',
    image: '/assets/hero-gallery/hero-09.jpg',
    text: 'Package Design',
    desc: '宠物零食系列包装设计，覆盖包装结构、品牌吉祥物、图标系统与细节展示。',
  },
  {
    title: 'Brand Design 01',
    cn: '有福鱼丸品牌视觉',
    image: '/assets/hero-gallery/hero-10.jpg',
    text: 'Brand Design',
    desc: '地方美食品牌视觉系统，包含标志、IP、辅助图形、包装及线下应用。',
  },
  {
    title: 'Brand Design 02',
    cn: '刺桐茶事品牌视觉',
    image: '/assets/hero-gallery/hero-11.jpg',
    text: 'Brand Design',
    desc: '茶文化品牌视觉系统，包含标志组合、色彩、纹样、包装和宣传应用。',
  },
  {
    title: 'Brand Design 03',
    cn: '簪花里品牌视觉',
    image: '/assets/hero-gallery/hero-12.jpg',
    text: 'Brand Design',
    desc: '泉州文化生活品牌视觉系统，覆盖品牌标识、图形延展、包装和物料应用。',
  },
  {
    title: 'E-commerce 01',
    cn: '耳机电商主图',
    image: '/assets/hero-gallery/hero-13.jpg',
    text: 'E-commerce',
    desc: '3C 产品电商主图设计，突出核心卖点、产品质感和点击转化信息。',
  },
  {
    title: 'E-commerce 02',
    cn: '键盘电商视觉',
    image: '/assets/hero-gallery/hero-14.jpg',
    text: 'E-commerce',
    desc: '机械键盘电商视觉，结合科技感、赛博氛围和卖点图形化表达。',
  },
  {
    title: 'E-commerce 03',
    cn: '美妆详情页设计',
    image: '/assets/hero-gallery/hero-15.jpg',
    text: 'E-commerce',
    desc: '美妆产品详情页设计，强调材质、色号、卖点分区和柔和品牌氛围。',
  },
  {
    title: 'Poster 01',
    cn: '夏日咖啡节海报',
    image: '/assets/hero-gallery/hero-16.jpg',
    text: 'Poster',
    desc: '主题海报排版练习，围绕节日氛围、图形构成和信息层级组织画面。',
  },
  {
    title: 'Poster 02',
    cn: '城市漫游海报',
    image: '/assets/hero-gallery/hero-17.jpg',
    text: 'Poster',
    desc: '插画海报设计，融合城市漫游主题、柔和色彩和编辑式排版。',
  },
  {
    title: 'Poster 03',
    cn: '夏夜音乐节海报',
    image: '/assets/hero-gallery/hero-18.jpg',
    text: 'Poster',
    desc: '音乐节活动海报，使用高对比色、舞台场景和强节奏字体强化传播感。',
  },
  {
    title: 'Book Cover 01',
    cn: '猫咪领养日书籍封面',
    image: '/assets/hero-gallery/hero-19.jpg',
    text: 'Book Cover',
    desc: '书籍封面排版练习，强调留白、主体摄影和温暖公益主题表达。',
  },
  {
    title: 'Book Cover 02',
    cn: '儿童鱼类书籍封面',
    image: '/assets/hero-gallery/hero-20.jpg',
    text: 'Book Cover',
    desc: '儿童书籍封面设计，使用高饱和插画、趣味角色和清晰信息层级。',
  },
  {
    title: 'Book Cover 03',
    cn: '漫画小说封面',
    image: '/assets/hero-gallery/hero-21.jpg',
    text: 'Book Cover',
    desc: '校园恋爱漫画封面设计，突出人物关系、系列感和商业出版信息。',
  },
  {
    title: 'Game UI 01',
    cn: '游戏 UI 设计作品',
    image: '/assets/hero-gallery/hero-22.jpg',
    text: 'Game UI',
    desc: '国风手游 UI 视觉系统展示，包含登录页、主界面、角色页、背包和活动页。',
  },
];

const heroGalleryDisplayItems = heroGalleryItems.map((item, index) => ({
  ...item,
  image: `/assets/hero-gallery/hero-${String(index + 1).padStart(2, '0')}.jpg`,
  text: '作者：LinM  杨君鸿',
}));

const masonryItem = (id, image, height) => ({
  id,
  img: image,
  url: image,
  height,
});

const selectedWorkMasonryItems = {
  graphic: [
    masonryItem('graphic-01', heroGalleryItems[0].image, 700),
    masonryItem('graphic-02', heroGalleryItems[1].image, 820),
    masonryItem('graphic-03', heroGalleryItems[2].image, 520),
    masonryItem('graphic-04', heroGalleryItems[3].image, 480),
    masonryItem('graphic-05', heroGalleryItems[4].image, 540),
    masonryItem('graphic-06', heroGalleryItems[15].image, 760),
    masonryItem('graphic-07', heroGalleryItems[16].image, 860),
    masonryItem('graphic-08', heroGalleryItems[17].image, 820),
    masonryItem('graphic-09', heroGalleryItems[18].image, 820),
    masonryItem('graphic-10', heroGalleryItems[19].image, 820),
    masonryItem('graphic-11', heroGalleryItems[20].image, 820),
    masonryItem('graphic-12', heroGalleryItems[21].image, 720),
  ],
  editing: [
    masonryItem(
      'editing-01',
      '/assets/hero-gallery/hero-01.jpg',
      720,
    ),
    masonryItem(
      'editing-02',
      '/assets/hero-gallery/hero-02.jpg',
      700,
    ),
    masonryItem(
      'editing-03',
      '/assets/hero-gallery/hero-03.jpg',
      700,
    ),
    masonryItem(
      'editing-04',
      '/assets/hero-gallery/hero-04.jpg',
      700,
    ),
    masonryItem(
      'editing-05',
      '/assets/hero-gallery/hero-05.jpg',
      520,
    ),
  ],
  ipProduct: [
    masonryItem('ip-product-01', heroGalleryItems[5].image, 760),
    masonryItem('ip-product-02', heroGalleryItems[6].image, 820),
    masonryItem('ip-product-03', heroGalleryItems[7].image, 820),
    masonryItem('ip-product-04', heroGalleryItems[8].image, 760),
    masonryItem('ip-product-05', heroGalleryItems[9].image, 760),
    masonryItem('ip-product-06', heroGalleryItems[10].image, 760),
    masonryItem('ip-product-07', heroGalleryItems[11].image, 760),
    masonryItem('ip-product-08', heroGalleryItems[12].image, 640),
    masonryItem('ip-product-09', heroGalleryItems[13].image, 760),
    masonryItem('ip-product-10', heroGalleryItems[14].image, 920),
  ],
};

const graphicDetailItems = portfolioWorks.graphic || [];
const editingDetailItems = portfolioWorks.editing || [];
const ipProductDetailItems = portfolioWorks.ipProduct || [];
const autoSelectedWorkMasonryItems = {
  graphic: graphicDetailItems.length ? graphicDetailItems : selectedWorkMasonryItems.graphic,
  editing: editingDetailItems.length ? editingDetailItems : selectedWorkMasonryItems.editing,
  ipProduct: ipProductDetailItems.length ? ipProductDetailItems : selectedWorkMasonryItems.ipProduct,
};

const coverImagesFromItems = (items) =>
  items
    .filter((item) => item.type !== 'video')
    .slice(0, 3)
    .map((item) => item.thumb || item.img || item.url);

const selectedWorkCoverImages = {
  graphic: coverImagesFromItems(autoSelectedWorkMasonryItems.graphic),
  editing: coverImagesFromItems(autoSelectedWorkMasonryItems.editing),
  ipProduct: coverImagesFromItems(autoSelectedWorkMasonryItems.ipProduct),
};
const selectedWorkDisplayCovers = {
  graphic: selectedWorkCoverImages.graphic.length ? selectedWorkCoverImages.graphic : coverImagesFromItems(autoSelectedWorkMasonryItems.graphic),
  editing: selectedWorkCoverImages.editing.length ? selectedWorkCoverImages.editing : coverImagesFromItems(autoSelectedWorkMasonryItems.editing),
  ipProduct: selectedWorkCoverImages.ipProduct.length
    ? selectedWorkCoverImages.ipProduct
    : coverImagesFromItems(autoSelectedWorkMasonryItems.ipProduct),
};

const uniqueAssets = (assets) => Array.from(new Set(assets.filter(Boolean)));

const detailPreloadItems = [
  ...autoSelectedWorkMasonryItems.graphic,
  ...autoSelectedWorkMasonryItems.editing,
  ...autoSelectedWorkMasonryItems.ipProduct,
];

const criticalPreloadAssets = uniqueAssets([
  '/assets/hero-background.webm',
  '/assets/hero-poster.jpg',
  profileAvatarImage,
  ...projects.map((project) => project.image),
  ...heroGalleryDisplayItems.map((item) => item.image),
  ...Object.values(selectedWorkDisplayCovers).flat(),
]);

const warmupPreloadAssets = uniqueAssets([
  ...heroGalleryDisplayItems.slice(0, 6).map((item) => item.image),
  ...detailPreloadItems.filter((item) => item.type !== 'video').map((item) => item.thumb || item.img || item.url),
  ...detailPreloadItems.filter((item) => item.type === 'video').slice(0, 4).map((item) => item.url || item.img),
]).filter((asset) => !criticalPreloadAssets.includes(asset) && !asset.includes('linm-hero-video.mp4'));

const isVideoAsset = (asset) => /\.(mp4|webm|mov)(\?|#|$)/i.test(asset);

const preloadImageAsset = (src) =>
  new Promise((resolve) => {
    const image = new Image();
    let timeoutId = 0;
    const done = () => {
      window.clearTimeout(timeoutId);
      resolve(src);
    };
    image.decoding = 'async';
    image.onload = () => {
      if (image.decode) image.decode().catch(() => {}).finally(done);
      else done();
    };
    image.onerror = done;
    timeoutId = window.setTimeout(done, 5200);
    image.src = src;
  });

const preloadVideoMetadata = (src) =>
  new Promise((resolve) => {
    const video = document.createElement('video');
    let timeoutId = 0;
    const done = () => {
      window.clearTimeout(timeoutId);
      video.removeAttribute('src');
      video.load();
      resolve(src);
    };

    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;
    video.onloadedmetadata = done;
    video.onerror = done;
    timeoutId = window.setTimeout(done, 4200);
    video.src = src;
    video.load();
  });

const preloadAsset = (src, { priority = false } = {}) => {
  if (!src || typeof window === 'undefined') return Promise.resolve(src);

  if (priority && src.includes('hero-background.webm') && window.fetch) {
    return fetch(src, { cache: 'force-cache' })
      .then((response) => response.blob())
      .catch(() => preloadVideoMetadata(src));
  }

  if (isVideoAsset(src)) return preloadVideoMetadata(src);
  return preloadImageAsset(src);
};

const scheduleIdle = (callback) => {
  if ('requestIdleCallback' in window) {
    return window.requestIdleCallback(callback, { timeout: 1400 });
  }

  return window.setTimeout(() => callback({ timeRemaining: () => 12, didTimeout: true }), 260);
};

const cancelIdle = (id) => {
  if (!id) return;
  if ('cancelIdleCallback' in window) window.cancelIdleCallback(id);
  else window.clearTimeout(id);
};

function usePortfolioPreloader() {
  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let cancelled = false;
    let hideTimer = 0;
    let warmupIdleId = 0;
    const startedAt = performance.now();
    const criticalAssets = criticalPreloadAssets;
    const total = Math.max(criticalAssets.length, 1);
    let loaded = 0;

    const updateProgress = () => {
      const next = Math.min(96, Math.round((loaded / total) * 92 + 4));
      setProgress((current) => Math.max(current, next));
    };

    const runWarmup = () => {
      let index = 0;

      const step = (deadline) => {
        while (index < warmupPreloadAssets.length && (deadline.timeRemaining() > 5 || deadline.didTimeout)) {
          preloadAsset(warmupPreloadAssets[index], { priority: false });
          index += 1;
        }

        if (!cancelled && index < warmupPreloadAssets.length) {
          warmupIdleId = scheduleIdle(step);
        }
      };

      warmupIdleId = scheduleIdle(step);
    };

    const tasks = criticalAssets.map((asset) =>
      preloadAsset(asset, { priority: true }).finally(() => {
        if (cancelled) return;
        loaded += 1;
        updateProgress();
      }),
    );

    Promise.allSettled(tasks).then(() => {
      const wait = Math.max(0, 1700 - (performance.now() - startedAt));

      window.setTimeout(() => {
        if (cancelled) return;
        setProgress(100);
        setIsReady(true);
        runWarmup();
        hideTimer = window.setTimeout(() => {
          if (!cancelled) setIsVisible(false);
        }, 920);
      }, wait);
    });

    return () => {
      cancelled = true;
      window.clearTimeout(hideTimer);
      cancelIdle(warmupIdleId);
    };
  }, []);

  return { progress, isReady, isVisible };
}

function OpeningPreloader({ progress, isComplete }) {
  return (
    <div className={`opening-loader ${isComplete ? 'is-complete' : ''}`} role="status" aria-live="polite">
      <div className="opening-loader__content">
        <span className="opening-loader__eyebrow">Loading Portfolio</span>
        <div className="opening-loader__number">
          <CountUp to={progress} from={0} duration={0.85} startWhen separator="" />
          <small>%</small>
        </div>
      </div>
    </div>
  );
}

const strengths = [
  {
    icon: Target,
    title: '从卖点倒推画面',
    text: '不只做“好看排版”，会从点击、卖点、受众心理和转化路径倒推视觉表达。',
  },
  {
    icon: Cpu,
    title: 'AI 辅助创意工作流',
    text: '熟悉 ChatGPT、Codex、Seedance2、Gemini、Coze，可用于创意发散、脚本推演与视觉方案迭代。',
  },
  {
    icon: MonitorPlay,
    title: '游戏与广告双视角',
    text: '理解 SLG、MOBA、ARPG、MMORPG、FPS 玩家爽点，可拆玩法、写脚本、配合剪辑和投放复盘。',
  },
  {
    icon: BriefcaseBusiness,
    title: '跨境项目推进',
    text: '有海外客户产品图、效果图、打样确认、生产沟通与交付追踪经验，能把设计推进到交付。',
  },
  {
    icon: Clapperboard,
    title: '内容节奏与剪辑感',
    text: 'B 站游戏内容累计 1.6 万粉丝、1200W 播放，理解标题钩子、视频节奏和社区反馈。',
  },
  {
    icon: Gem,
    title: '多品类视觉迁移',
    text: '覆盖海报、UI、电商主图、包装、书籍封面、短剧/游戏封面等场景，适配能力强。',
  },
];

const tools = ['Photoshop', 'Axure', 'XMind', 'Visio', 'Maya', 'Unity3D', 'C#', 'MySQL', 'ChatGPT', 'Codex', 'Seedance2', 'Gemini', 'Coze'];

const workMetrics = [
  { value: '45+', label: '月均创意/素材脚本' },
  { value: '7500W+', label: '参与项目素材消耗量级' },
  { value: '1200W+', label: '内容作品累计播放' },
  { value: '100W$', label: '参与跨境订单协作金额' },
];

const nowBuilding = ['品牌视觉', '游戏买量素材', '游戏创意设计', 'AIGC 设计工作流', '电商主图 & 详情页', '短视频创意', '海报 / 封面设计', 'UI 页面设计'];

const workTimeline = [
  {
    period: '2025.06 - 至今',
    company: '泉州晟竹贸易有限公司',
    role: '产品设计 / 跨境项目',
    text: '负责海外市场产品平面图、效果图、卖点展示图与基础视觉方案，参与打样确认、生产沟通和交付追踪。',
  },
  {
    period: '2024.02 - 2025.06',
    company: '福州浩凡网络有限公司',
    role: '创意策划 / 游戏广告 / 海外买量',
    text: '拆解玩法、角色、付费点与活动节点，输出短视频脚本、创意文案和素材 brief，参与素材结果复盘。',
  },
  {
    period: '2023.06 - 2023.09',
    company: '鲁诺米（SLG）',
    role: '游戏执行策划实习生',
    text: '参与产品调研、竞品分析、系统策划案撰写、脚本配置与测试跟进，整理体验问题与 BUG 反馈。',
  },
];

function usePortfolioMotion(rootRef, enabled = true) {
  useLayoutEffect(() => {
    if (!enabled) return undefined;

    const root = rootRef.current;
    if (!root) return undefined;
    const header = root.querySelector('.site-header');
    const updateFixedHeader = () => {
      if (!header) return;
      header.classList.toggle('is-fixed', window.scrollY > window.innerHeight * 0.78);
    };

    let scrollFrame = 0;
    const onScroll = () => {
      if (scrollFrame) return;
      scrollFrame = window.requestAnimationFrame(() => {
        scrollFrame = 0;
        updateFixedHeader();
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    updateFixedHeader();

    const ctx = gsap.context(() => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (reduceMotion) {
        return;
      }

      gsap.set('.site-header', { autoAlpha: 0, y: -72, filter: 'blur(10px)' });
      gsap.set('.hero-media-actions', { autoAlpha: 0, x: 18, y: -18, filter: 'blur(10px)' });
      gsap.set('.hero-copy', { autoAlpha: 0, y: 34 });
      gsap.set(['.hero-title-main', '.hero-title-sub'], {
        autoAlpha: 0,
        yPercent: 112,
        scaleX: 0.82,
        scaleY: 0.72,
        transformOrigin: '50% 100%',
        clipPath: 'inset(0% 0% 100% 0%)',
      });
      gsap.set('.hero-title em', { autoAlpha: 0, x: -54, y: 18, rotate: -18, scale: 0.86, filter: 'blur(10px)' });
      gsap.set('.hero-gallery-shell', { autoAlpha: 0, clipPath: 'inset(100% 0% 0% 0%)', filter: 'blur(10px)' });
      gsap.set('.hero-video', { scale: 1.09, filter: 'saturate(0.75) contrast(1.12) brightness(0.6) blur(4px)' });

      const opening = gsap.timeline({ defaults: { ease: 'expo.out' } });
      opening
        .to('.hero-video', { scale: 1, filter: 'saturate(0.95) contrast(1.05) brightness(0.82) blur(0px)', duration: 2.65 }, 0)
        .to('.site-header', { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 1.45 }, 0.18)
        .to('.hero-media-actions', { autoAlpha: 1, x: 0, y: 0, filter: 'blur(0px)', duration: 1.2 }, 0.38)
        .to(
          '.hero-title-main',
          { autoAlpha: 1, yPercent: 0, scaleX: 1, scaleY: 1, clipPath: 'inset(0% 0% 0% 0%)', duration: 1.7 },
          0.58,
        )
        .to(
          '.hero-title-sub',
          { autoAlpha: 1, yPercent: 0, scaleX: 1, scaleY: 1, clipPath: 'inset(0% 0% 0% 0%)', duration: 1.56 },
          0.86,
        )
        .to('.hero-title em', { autoAlpha: 1, x: 0, y: 0, scale: 1, rotate: -8, filter: 'blur(0px)', duration: 1.22 }, 1.18)
        .to('.hero-copy', { autoAlpha: 1, y: 0, duration: 1.14 }, 1.36)
        .to('.hero-gallery-shell', { autoAlpha: 1, clipPath: 'inset(0% 0% 0% 0%)', filter: 'blur(0px)', duration: 1.28 }, 1.52);

      gsap.utils.toArray('.work-heading h2, .block-heading h2, .contact-layout h2').forEach((heading) => {
        gsap.from(heading, {
          autoAlpha: 0,
          y: 148,
          scaleX: 0.68,
          skewX: -5,
          skewY: 4,
          filter: 'blur(16px)',
          clipPath: 'inset(0% 0% 100% 0%)',
          transformOrigin: '0% 50%',
          duration: 1.48,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: heading,
            start: 'top 84%',
            once: true,
          },
        });
      });

      gsap.utils.toArray('.work-heading p, .block-heading p, .section-kicker').forEach((item) => {
        gsap.from(item, {
          autoAlpha: 0,
          y: 26,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 86%',
            once: true,
          },
        });
      });

      [
        { trigger: '.profile-section', items: '.work-visual-card, .work-about, .timeline-item' },
        { trigger: '.projects-section', items: '.selected-work-card' },
        { trigger: '.strengths-section', items: '.strength-card, .personal-skills-title, .tool-strip span' },
        { trigger: '.contact-end', items: '.contact-layout > div' },
      ].forEach(({ trigger, items }) => {
        const elements = gsap.utils.toArray(items);
        if (!elements.length) return;

        gsap.from(elements, {
          autoAlpha: 0,
          y: 126,
          scale: 0.9,
          rotateX: 8,
          filter: 'blur(16px)',
          transformPerspective: 1200,
          transformOrigin: '50% 100%',
          duration: 1.35,
          ease: 'expo.out',
          stagger: 0.16,
          scrollTrigger: {
            trigger,
            start: 'top 72%',
            once: true,
          },
        });
      });

      gsap.utils.toArray('.selected-work-card, .project-card').forEach((card) => {
        const mediaItems = card.querySelectorAll('img, video');
        if (!mediaItems.length) return;

        mediaItems.forEach((image, mediaIndex) => {
          gsap.fromTo(
            image,
            { clipPath: 'inset(0% 0% 100% 0%)', scale: 1.2, y: -30, filter: 'blur(10px)' },
            {
              clipPath: 'inset(0% 0% 0% 0%)',
              scale: 1.04,
              y: 0,
              filter: 'blur(0px)',
              duration: 1.38,
              delay: mediaIndex * 0.06,
              ease: 'expo.out',
              scrollTrigger: {
                trigger: card,
                start: 'top 78%',
                once: true,
              },
            },
          );
        });

        gsap.to(mediaItems, {
          yPercent: -7,
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.8,
          },
        });
      });

      gsap.to('.hero-video', {
        yPercent: 10,
        scale: 1.04,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 0.85,
        },
      });
    }, root);

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (scrollFrame) window.cancelAnimationFrame(scrollFrame);
      ctx.revert();
    };
  }, [rootRef, enabled]);
}

function Header() {
  return (
    <header className="site-header">
      <a className="brand" href="#hero" aria-label="回到首页">
        <span className="brand-mark">LinM</span>
      </a>
      <nav className="nav-links" aria-label="主导航">
        {navItems.map((item) => (
          <a href={item.href} key={item.href}>
            {item.label}
          </a>
        ))}
      </nav>
      <a className="header-contact" href="mailto:1248591115@qq.com">
        <Mail size={18} aria-hidden="true" />
        联系我
      </a>
    </header>
  );
}

function HeroWorkRail({ onOpen }) {
  const handleGalleryClick = useCallback(
    (index) => {
      const project = heroGalleryItems[index % heroGalleryItems.length];
      if (project) onOpen(project);
    },
    [onOpen],
  );

  return (
    <Suspense fallback={<div className="hero-gallery-fallback" aria-hidden="true" />}>
      <CircularGallery
        items={heroGalleryDisplayItems}
        bend={2.85}
        borderRadius={0.08}
        scrollSpeed={1.75}
        scrollEase={0.045}
        showText
        textColor="#efe6ff"
        font='800 17px "Microsoft YaHei"'
        onItemClick={handleGalleryClick}
      />
    </Suspense>
  );

  const railRef = useRef(null);
  const arcFrameRef = useRef(0);
  const dragRef = useRef({
    active: false,
    startX: 0,
    lastX: 0,
    lastTime: 0,
    moved: false,
    velocity: 0,
    projectIndex: null,
    rafId: 0,
  });
  const loopedProjects = [...projects, ...projects, ...projects];

  const updateRailArc = (rail = railRef.current) => {
    if (!rail) return;
    const railRect = rail.getBoundingClientRect();
    const centerX = railRect.left + railRect.width / 2;
    const halfWidth = Math.max(1, railRect.width / 2);

    rail.querySelectorAll('.rail-card').forEach((card) => {
      const cardRect = card.getBoundingClientRect();
      const cardCenterX = cardRect.left + cardRect.width / 2;
      const distance = Math.min(1.25, Math.abs((cardCenterX - centerX) / halfWidth));
      const arcY = -18 + Math.pow(distance, 1.65) * 42;
      const scale = Math.max(0.88, 1.03 - distance * 0.1);

      card.style.setProperty('--arc-y', `${arcY.toFixed(2)}px`);
      card.style.setProperty('--arc-scale', scale.toFixed(3));
    });
  };

  const scheduleRailArc = () => {
    if (arcFrameRef.current) return;
    arcFrameRef.current = requestAnimationFrame(() => {
      arcFrameRef.current = 0;
      updateRailArc();
    });
  };

  const normalizeScrollPosition = (rail = railRef.current) => {
    if (!rail) return;
    const loopWidth = rail.scrollWidth / 3;
    if (!loopWidth) return;

    while (rail.scrollLeft < loopWidth * 0.5) {
      rail.scrollLeft += loopWidth;
    }

    while (rail.scrollLeft > loopWidth * 1.5) {
      rail.scrollLeft -= loopWidth;
    }
  };

  const stopInertia = () => {
    if (!dragRef.current.rafId) return;
    cancelAnimationFrame(dragRef.current.rafId);
    dragRef.current.rafId = 0;
  };

  const startInertia = () => {
    stopInertia();
    let velocity = Math.max(-2.2, Math.min(2.2, dragRef.current.velocity));

    const glide = () => {
      const rail = railRef.current;
      if (!rail || Math.abs(velocity) < 0.018) {
        dragRef.current.rafId = 0;
        return;
      }

      rail.scrollLeft -= velocity * 18;
      normalizeScrollPosition(rail);
      scheduleRailArc();
      velocity *= 0.93;
      dragRef.current.velocity = velocity;
      dragRef.current.rafId = requestAnimationFrame(glide);
    };

    dragRef.current.rafId = requestAnimationFrame(glide);
  };

  useLayoutEffect(() => {
    const rail = railRef.current;
    if (!rail) return undefined;

    let frameId = requestAnimationFrame(() => {
      const loopWidth = rail.scrollWidth / 3;
      if (loopWidth) rail.scrollLeft = loopWidth;
      updateRailArc(rail);
    });

    const handleScroll = () => {
      normalizeScrollPosition(rail);
      scheduleRailArc();
    };
    rail.addEventListener('scroll', handleScroll, { passive: true });

    const resizeObserver =
      typeof ResizeObserver === 'undefined'
        ? null
        : new ResizeObserver(() => {
            cancelAnimationFrame(frameId);
            frameId = requestAnimationFrame(() => {
              const loopWidth = rail.scrollWidth / 3;
              if (loopWidth) rail.scrollLeft = loopWidth;
              updateRailArc(rail);
            });
          });

    resizeObserver?.observe(rail);

    return () => {
      cancelAnimationFrame(frameId);
      cancelAnimationFrame(arcFrameRef.current);
      stopInertia();
      rail.removeEventListener('scroll', handleScroll);
      resizeObserver?.disconnect();
    };
  }, []);

  const handlePointerDown = (event) => {
    const rail = railRef.current;
    if (!rail) return;
    event.preventDefault();
    stopInertia();
    const targetCard = event.target.closest('.rail-card');
    const now = performance.now();
    dragRef.current = {
      active: true,
      startX: event.clientX,
      lastX: event.clientX,
      lastTime: now,
      moved: false,
      velocity: 0,
      projectIndex: targetCard ? Number(targetCard.dataset.projectIndex) : null,
      rafId: 0,
    };
    rail.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event) => {
    const rail = railRef.current;
    const drag = dragRef.current;
    if (!rail || !drag.active) return;
    const now = performance.now();
    const delta = event.clientX - drag.lastX;
    const totalDelta = event.clientX - drag.startX;
    const elapsed = Math.max(12, now - drag.lastTime);
    if (Math.abs(totalDelta) > 6) drag.moved = true;

    rail.scrollLeft -= delta * 1.18;
    normalizeScrollPosition(rail);
    scheduleRailArc();

    drag.velocity = delta / elapsed;
    drag.lastX = event.clientX;
    drag.lastTime = now;
  };

  const handlePointerUp = (event) => {
    const rail = railRef.current;
    if (!rail) return;
    const moved = dragRef.current.moved;
    const projectIndex = dragRef.current.projectIndex;
    dragRef.current.active = false;
    if (rail.hasPointerCapture(event.pointerId)) {
      rail.releasePointerCapture(event.pointerId);
    }

    if (!moved && projectIndex !== null) {
      const project = projects[projectIndex];
      if (project) onOpen(project);
    }

    if (moved) {
      dragRef.current.moved = false;
      startInertia();
    }
  };

  const stopDrag = (event) => {
    const rail = railRef.current;
    if (!rail) return;
    dragRef.current.active = false;
    if (rail.hasPointerCapture(event.pointerId)) {
      rail.releasePointerCapture(event.pointerId);
    }
    dragRef.current.velocity = 0;
  };

  return (
    <div
      className="hero-work-rail"
      ref={railRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={stopDrag}
      aria-label="可拖拽精选作品"
    >
      {loopedProjects.map((project, index) => {
        const projectIndex = index % projects.length;

        return (
        <button
          className="rail-card"
          type="button"
          key={`${project.title}-${index}`}
          data-project-index={projectIndex}
          aria-label={`${project.title} ${project.cn}`}
        >
          <img src={project.image} alt={`${project.cn}作品预览`} draggable="false" />
        </button>
        );
      })}
    </div>
  );
}

function ProjectModal({ project, onClose }) {
  const [activeDetailItem, setActiveDetailItem] = useState(null);
  const pushedDetailStateRef = useRef(false);

  useEffect(() => {
    setActiveDetailItem(null);
    pushedDetailStateRef.current = false;
  }, [project]);

  useEffect(() => {
    if (!project) return undefined;

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.paddingRight = previousBodyPaddingRight;
    };
  }, [project]);

  const returnToList = useCallback(() => {
    if (pushedDetailStateRef.current) {
      pushedDetailStateRef.current = false;
      window.history.back();
    }
    setActiveDetailItem(null);
  }, []);

  const handleClose = useCallback(() => {
    if (pushedDetailStateRef.current) {
      pushedDetailStateRef.current = false;
      window.history.back();
    }
    onClose();
  }, [onClose]);

  const openDetailItem = useCallback((item) => {
    setActiveDetailItem(item);
    if (!pushedDetailStateRef.current) {
      window.history.pushState({ portfolioDetailItem: item.id }, '', window.location.href);
      pushedDetailStateRef.current = true;
    }
  }, []);

  useEffect(() => {
    if (!project) return undefined;
    const handleKeyDown = (event) => {
      const target = event.target;
      const tagName = target?.tagName?.toLowerCase();
      const isEditable = tagName === 'input' || tagName === 'textarea' || target?.isContentEditable;

      if (activeDetailItem && (event.key === 'Escape' || (event.key === 'Backspace' && !isEditable))) {
        event.preventDefault();
        returnToList();
        return;
      }

      if (event.key === 'Escape') handleClose();
    };
    const handlePopState = () => {
      if (!activeDetailItem) return;
      pushedDetailStateRef.current = false;
      setActiveDetailItem(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [project, activeDetailItem, returnToList, handleClose]);

  if (!project) return null;
  const hasMasonry = Array.isArray(project.detailItems) && project.detailItems.length > 0;

  return (
    <div className="project-modal" role="dialog" aria-modal="true" aria-label={`${project.cn}作品预览`} onMouseDown={handleClose}>
      <div className={`modal-panel ${hasMasonry ? 'modal-panel-masonry' : 'modal-panel-single'} ${activeDetailItem ? 'modal-panel-detail' : ''}`} onMouseDown={(event) => event.stopPropagation()}>
        {hasMasonry && (
        <div className="modal-copy">
          <p>Selected Work</p>
          <h2>{project.cn}</h2>
          <span>{project.desc}</span>
        </div>
        )}
        {hasMasonry && activeDetailItem ? (
          <div className="modal-detail-view">
            <button className="modal-back" type="button" onClick={returnToList}>
              返回列表
            </button>
            <div className="modal-detail-media">
              {activeDetailItem.type === 'video' ? (
                <video src={activeDetailItem.url || activeDetailItem.img} controls autoPlay playsInline />
              ) : (
                <img
                  className="modal-detail-image"
                  src={activeDetailItem.img}
                  alt={activeDetailItem.title || `${project.cn}放大预览`}
                  loading="eager"
                  decoding="async"
                />
              )}
            </div>
            {activeDetailItem.title && <p className="modal-detail-title">{activeDetailItem.title}</p>}
          </div>
        ) : hasMasonry ? (
          <div className="modal-masonry-stage">
            <Suspense fallback={<div className="modal-loading">Loading selected works</div>}>
              <Masonry
                items={project.detailItems}
                ease="power3.out"
                duration={0.68}
                stagger={0.055}
                animateFrom="bottom"
                scaleOnHover
                hoverScale={0.965}
                blurToFocus
                colorShiftOnHover={false}
                onItemClick={openDetailItem}
              />
            </Suspense>
          </div>
        ) : (
          <div className="modal-single-view">
            <img
              className="modal-single-image"
              src={project.image}
              alt={`${project.cn}放大预览`}
              loading="eager"
              decoding="async"
            />
            <p className="modal-single-author">
              作者：<strong>LinM</strong>
              <span>杨君鸿</span>
            </p>
          </div>
        )}
        <button className="modal-close" type="button" onClick={handleClose} aria-label="关闭预览">
          <CircleX size={24} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

function Hero() {
  const [activeProject, setActiveProject] = useState(null);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(0);
  const videoRef = useRef(null);

  const handleVolumeChange = useCallback((nextValue) => {
    const video = videoRef.current;
    const nextVolume = Math.round(nextValue);
    const nextMuted = nextVolume <= 0;

    setVolume(nextVolume);
    setIsMuted(nextMuted);

    if (video) {
      video.muted = nextMuted;
      video.volume = nextMuted ? 0 : Math.min(nextVolume / 100, 1);
      if (!nextMuted) video.play().catch(() => {});
    }
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = isMuted;
    video.volume = isMuted ? 0 : Math.min(volume / 100, 1);
  }, [isMuted, volume]);

  return (
    <section className="hero" id="hero">
      <video
        ref={videoRef}
        className="hero-video"
        autoPlay
        muted={isMuted}
        loop
        playsInline
        poster="/assets/hero-poster.jpg"
        preload="metadata"
        aria-hidden="true"
      >
        <source src="/assets/hero-background.webm" type="video/webm" />
      </video>
      <div className="hero-shade" />
      <div className="hero-media-actions" aria-label="视频控制">
        <Suspense
          fallback={
            <div className="video-sound-toggle video-sound-fallback" aria-hidden="true">
              <VolumeX size={18} />
              <span>声音关闭</span>
            </div>
          }
        >
          <ElasticSlider
            className="video-sound-toggle"
            label="视频音量"
            mutedLabel="声音关闭"
            activeLabel="声音开启"
            value={volume}
            min={0}
            max={100}
            step={5}
            leftIcon={<VolumeX aria-hidden="true" />}
            rightIcon={<Volume2 aria-hidden="true" />}
            onChange={handleVolumeChange}
          />
        </Suspense>
        <a className="video-home-link" href="https://space.bilibili.com/10425526?" target="_blank" rel="noreferrer">
          本人B站视频主页
          <ExternalLink size={16} aria-hidden="true" />
        </a>
      </div>
      <div className="hero-inner shell">
        <h1 className="hero-title">
          <span className="hero-title-main">杨君鸿</span>
          <span className="hero-title-sub">PORTFOLIO</span>
          <em aria-label="LinM signature">
            <span>LinM</span>
          </em>
        </h1>
        <p
          className="hero-copy hero-roles"
          aria-label="视觉设计师 / AI设计师 / 品牌设计师 / 游戏广告创意策划师 / 平面设计师 / 插画师 / 剪辑师"
        >
          <span className="role-line">
            <span>视觉设计师</span>
            <span>AI设计师</span>
            <span>品牌设计师</span>
            <span>游戏广告创意策划师</span>
          </span>
          <span className="role-line">
            <span>平面设计师</span>
            <span>插画师</span>
            <span>剪辑师</span>
          </span>
        </p>
        <p className="hero-copy hero-copy-hidden" aria-hidden="true">
          视觉设计师 / AI设计师 / 品牌设计师 / 游戏广告创意策划师 / 平面设计师 / 剪辑师
        </p>
        <p className="hero-copy hero-copy-hidden" aria-hidden="true">
          用视觉系统与 AI 工作流，让品牌内容更快、更准、更有辨识度。
        </p>
      </div>
      <div className="hero-gallery-shell" aria-label="精选作品拖拽区">
        <HeroWorkRail onOpen={setActiveProject} />
      </div>
      <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />
    </section>
  );
}

function Profile() {
  return (
    <section className="section profile-section" id="profile">
      <div className="shell work-shell">
        <div className="work-heading">
          <h2>
            WORK EXPERIENCE
            <ArrowUpRight size={28} aria-hidden="true" />
          </h2>
          <p>个人经历</p>
        </div>

        <div className="work-intro-grid">
          <div className="work-visual-card profile-card-stage" aria-label="LinM profile card">
            <Suspense fallback={<div className="profile-card-fallback" aria-hidden="true" />}>
              <TiltedCard
                imageSrc={profileAvatarImage}
                altText="LinM profile visual"
                captionText="LinM / 商业视觉与产品设计方向"
                containerHeight="560px"
                containerWidth="100%"
                imageHeight="520px"
                imageWidth="374px"
                rotateAmplitude={13}
                scaleOnHover={1.08}
                showMobileWarning={false}
                showTooltip
                displayOverlayContent
                overlayContent={
                  <div className="tilted-profile-overlay">
                    <div className="tilted-profile-head">
                      <strong>LinM</strong>
                      <span>Visual / AI / Brand Designer</span>
                    </div>
                    <div className="tilted-profile-foot">
                      <div className="tilted-profile-id">
                        <b>@LinMMinL</b>
                        <small>商业视觉设计师｜AI视觉设计｜品牌视觉</small>
                      </div>
                      <span className="tilted-profile-pill">联系我</span>
                    </div>
                  </div>
                }
              />
            </Suspense>
          </div>

          <div className="work-about">
            <p className="section-kicker">ABOUT ME</p>
            <h3>Hi,我是杨君鸿</h3>
            <p>
              我是一名商业转化方向的视觉设计师，擅长把产品卖点、用户痛点、用户点击动机和平台内容节奏转化成具体视觉钩子并制作方案。
            </p>
            <p>
              我做过<strong>海内外游戏买量素材、品牌海报、包装版式、电商主图、UI 页面和短剧/游戏封面</strong>，也参与过<strong>跨境产品设计与客户交付</strong>。相比只做“好看排版”，我更关注设计能不能让用户点进来、看得懂、记得住，并最终帮助产品完成传播和转化。
            </p>

            <div className="work-info-grid">
              <div>
                <span>当前身份</span>
                <strong>商业视觉与产品设计方向/AI视觉设计师</strong>
              </div>
              <div>
                <span>服务方向</span>
                <strong>Brand / E-commerce / Poster / UI / AIGC</strong>
              </div>
              <div>
                <span>手机</span>
                <strong>181****607</strong>
              </div>
              <div>
                <span>邮箱</span>
                <strong>124****115@qq.com</strong>
              </div>
            </div>

            <div className="work-metrics">
              {workMetrics.map((item) => (
                <div key={item.label}>
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>

            <div className="now-building">
              <span>NOW BUILDING</span>
              <div>
                {nowBuilding.map((item) => (
                  <em key={item}>{item}</em>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="career-path">
          <div className="career-label">CAREER PATH</div>
          <div className="career-title">工作经历</div>
          <div className="timeline-line" />
          <div className="timeline-grid">
            {workTimeline.map((item) => (
              <article className="timeline-item" key={item.company}>
                <span className="timeline-dot" />
                <time>{item.period}</time>
                <h3>{item.company}</h3>
                <em>{item.role}</em>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Projects() {
  const [activeProject, setActiveProject] = useState(null);
  const featuredWorks = [
    {
      ...projects[0],
      title: 'Illustration / Graphic Design',
      cn: '插画/平面设计',
      displayTitle: '插画/平面设计',
      className: 'selected-wide',
      image: selectedWorkDisplayCovers.graphic[0] || projects[0].image,
      coverImages: selectedWorkDisplayCovers.graphic,
      folderColor: '#9d7dff',
      folderSize: 1.02,
      countLabel: `共 ${autoSelectedWorkMasonryItems.graphic.length} 项作品`,
      tags: ['插画视觉', '海报排版', '平面构成'],
      desc: '覆盖海报、插画视觉、版式系统与品牌平面延展，强调画面层级、信息传达和风格统一。',
      detailItems: autoSelectedWorkMasonryItems.graphic,
    },
    {
      ...projects[4],
      title: 'Film Editing',
      cn: '影视剪辑',
      displayTitle: '影视剪辑',
      className: 'selected-wide',
      image: selectedWorkDisplayCovers.editing[0] || projects[4].image,
      coverImages: selectedWorkDisplayCovers.editing,
      folderColor: '#6f72ff',
      folderSize: 1.02,
      countLabel: `共 ${autoSelectedWorkMasonryItems.editing.length} 项作品/视频`,
      tags: ['短视频节奏', '脚本分镜', '内容包装'],
      desc: '围绕短视频、广告素材和内容传播节奏进行剪辑包装，关注开头钩子、情绪推进与转化表达。',
      detailItems: autoSelectedWorkMasonryItems.editing,
    },
    {
      ...projects[3],
      title: 'IP / Product Design',
      cn: 'IP及产品设计',
      displayTitle: 'IP及产品设计',
      className: 'selected-tall',
      image: selectedWorkDisplayCovers.ipProduct[0] || projects[3].image,
      coverImages: selectedWorkDisplayCovers.ipProduct,
      folderColor: '#b99dff',
      folderSize: 1.2,
      countLabel: `共 ${autoSelectedWorkMasonryItems.ipProduct.length} 项作品`,
      tags: ['IP形象', '产品延展', '品牌质感'],
      desc: '从 IP 角色设定、产品视觉、包装版式到周边落地，建立可延展的视觉资产与商业表达。',
      detailItems: autoSelectedWorkMasonryItems.ipProduct,
    },
  ];

  const openProject = (project) => setActiveProject(project);
  const handleCardKeyDown = (event, project) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    openProject(project);
  };

  const renderSelectedCard = (project) => (
    <SpotlightCard
      className={`selected-work-card ${project.className}`}
      spotlightColor="rgba(216, 199, 255, 0.28)"
      key={project.displayTitle}
      role="button"
      tabIndex={0}
      aria-label={`查看${project.displayTitle}详情`}
      onClick={() => openProject(project)}
      onKeyDown={(event) => handleCardKeyDown(event, project)}
    >
      {project.coverImages?.length ? (
        <div className="selected-cover-collage" aria-hidden="true">
          {project.coverImages.slice(0, 3).map((image, index) => (
            <img src={image} alt="" key={`${project.displayTitle}-cover-${index}`} />
          ))}
        </div>
      ) : (
        <img className="selected-work-bg" src={project.image} alt={`${project.displayTitle}作品预览`} />
      )}
      <div
        className="selected-folder-stage"
        aria-hidden="true"
        onClick={(event) => event.stopPropagation()}
      >
        <Folder
          className="selected-folder"
          color={project.folderColor}
          size={project.folderSize}
          items={(project.coverImages?.length ? project.coverImages : [project.image]).slice(0, 3).map((image, index) => (
            <div className="folder-paper-preview" key={`${project.displayTitle}-folder-${index}`}>
              <img src={image} alt="" />
            </div>
          ))}
        />
      </div>
      <div className="selected-work-info">
        <h3>{project.displayTitle}</h3>
        <p>{project.tags.slice(0, 3).join(' / ')}</p>
        {project.countLabel && <small>{project.countLabel}</small>}
        <span className="selected-work-arrow" aria-hidden="true">
          <ArrowUpRight size={18} />
        </span>
      </div>
    </SpotlightCard>
  );

  return (
    <section className="section projects-section" id="projects">
      <div className="shell selected-shell">
        <div className="block-heading">
          <h2>
            SELECTED WORKS
            <ArrowUpRight size={26} aria-hidden="true" />
          </h2>
          <p>视觉作品</p>
        </div>

        <div className="selected-layout">
          <div className="selected-left">
            {featuredWorks.slice(0, 2).map((project) => renderSelectedCard(project))}
          </div>

          {renderSelectedCard(featuredWorks[2])}
        </div>

        <div className="project-grid project-grid-archive">
          {projects.slice(3).map((project) => (
            <article className="project-card" key={project.title}>
              <img src={project.image} alt={`${project.cn}作品预览`} />
              <div className="project-info">
                <p>{project.title}</p>
                <h3>{project.cn}</h3>
                <span>{project.desc}</span>
                <div className="tag-row">
                  {project.tags.map((tag) => (
                    <em key={tag}>{tag}</em>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
      <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />
    </section>
  );
}

function Strengths() {
  const strengthBubbleItems = [
    [
      { label: '卖点提炼', rotation: -7, hoverStyles: { bgColor: '#efe6ff', textColor: '#15101d' } },
      { label: '点击动机', rotation: 5, hoverStyles: { bgColor: '#cdb8ff', textColor: '#15101d' } },
      { label: '素材钩子', rotation: -4, hoverStyles: { bgColor: '#b99cff', textColor: '#ffffff' } },
    ],
    [
      { label: '游戏创意', rotation: -6, hoverStyles: { bgColor: '#efe6ff', textColor: '#15101d' } },
      { label: '电商视觉', rotation: 7, hoverStyles: { bgColor: '#cdb8ff', textColor: '#15101d' } },
      { label: 'IP设计', rotation: -5, hoverStyles: { bgColor: '#b99cff', textColor: '#ffffff' } },
    ],
    [
      { label: '创意发散', rotation: -7, hoverStyles: { bgColor: '#efe6ff', textColor: '#15101d' } },
      { label: '快速出图', rotation: 5, hoverStyles: { bgColor: '#cdb8ff', textColor: '#15101d' } },
      { label: '风格探索', rotation: -4, hoverStyles: { bgColor: '#b99cff', textColor: '#ffffff' } },
    ],
    [
      { label: '短视频钩子', rotation: -5, hoverStyles: { bgColor: '#efe6ff', textColor: '#15101d' } },
      { label: '素材脚本', rotation: 6, hoverStyles: { bgColor: '#cdb8ff', textColor: '#15101d' } },
      { label: '复盘优化', rotation: -5, hoverStyles: { bgColor: '#b99cff', textColor: '#ffffff' } },
    ],
    [
      { label: '需求拆解', rotation: -6, hoverStyles: { bgColor: '#efe6ff', textColor: '#15101d' } },
      { label: '反馈调整', rotation: 7, hoverStyles: { bgColor: '#cdb8ff', textColor: '#15101d' } },
      { label: '交付落地', rotation: -5, hoverStyles: { bgColor: '#b99cff', textColor: '#ffffff' } },
    ],
  ];
  const strengthCards = [
    { title: '视觉转化', label: 'CORE', text: '卖点提炼 / 点击动机 / 视觉表达 / 用户痛点 / 素材钩子' },
    { title: '多场景设计落地', label: 'CORE', text: '游戏创意 / 海报封面 / 电商视觉 / UI包装 / IP设计' },
    { title: 'AIGC 设计提效', label: 'SYSTEM', text: '创意发散 / 快速出图 / 风格探索' },
    { title: '海外素材创意', label: 'SYSTEM', text: '短视频钩子 / 短剧制作 / 素材脚本 / 复盘优化' },
    { title: '项目推进协作', label: 'SYSTEM', text: '需求拆解 / 反馈调整 / 交付落地' },
  ];

  return (
    <section className="section strengths-section" id="strengths">
      <div className="shell strength-shell">
        <div className="block-heading">
          <h2>
            CORE STRENGTHS
            <ArrowUpRight size={26} aria-hidden="true" />
          </h2>
          <p>个人优势</p>
        </div>

        <div className="strength-grid">
          {strengthCards.map(({ title, label, text }, index) => (
            <BorderGlow
              className="strength-card"
              key={title}
              edgeSensitivity={16}
              glowColor="294 100 78"
              backgroundColor="#090d14"
              borderRadius={20}
              glowRadius={66}
              glowIntensity={2.8}
              coneSpread={38}
              animated={index === 0}
              colors={['#ff4fd8', '#69f6ff', '#f6ff6b']}
              fillOpacity={0.78}
            >
              <div className="strength-card-top">
                <span>{String(index + 1).padStart(2, '0')}</span>
                <em>{label}</em>
              </div>
              <h3>{title}</h3>
              <p>{text}</p>
              <div className="strength-tag-orbit" aria-label={`${title} 关键词`}>
                {strengthBubbleItems[index].slice(0, 3).map((item) => (
                  <span key={item.label}>{item.label}</span>
                ))}
              </div>
            </BorderGlow>
          ))}
        </div>
        <div className="personal-skills" aria-labelledby="personal-skills-title">
          <h3 className="personal-skills-title" id="personal-skills-title">个人技能</h3>
          <div className="tool-strip" aria-label="个人技能工具">
            {tools.map((tool) => (
              <span key={tool}>{tool}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactEnd() {
  return (
    <section className="contact-end" id="contact">
      <div className="shell contact-layout">
        <div>
          <p className="section-kicker">Contact</p>
          <h2>我们一起成为创造者，让每个作品都附上生命。</h2>
          <p>
            如果你需要游戏创意设计、推广设计、游戏广告素材、商业视觉设计、电商主图、品牌包装、AI 辅助创意或视频内容方向的设计支持，欢迎通过邮箱、微信或电话联系我。
          </p>
        </div>
        <div className="contact-card">
          <Sparkles size={28} aria-hidden="true" />
          <h3>杨君鸿</h3>
          <a href="mailto:1248591115@qq.com">1248591115@qq.com</a>
          <a href="tel:18159520607">18159520607</a>
          <span>微信：LinMMinL</span>
          <a className="primary-action" href="mailto:1248591115@qq.com">
            发送邮件联系我
            <ArrowUpRight size={20} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}

export default function App() {
  const appRef = useRef(null);
  const { progress, isReady, isVisible } = usePortfolioPreloader();
  usePortfolioMotion(appRef, isReady);

  return (
    <div className="portfolio-app" ref={appRef}>
      {isVisible && <OpeningPreloader progress={progress} isComplete={isReady} />}
      <Header />
      <Hero />
      <main className="site-main">
        <div className="main-grainient-layer" aria-hidden="true">
          <Suspense fallback={null}>
            <Grainient
              color1="#d8c7ff"
              color2="#8f7bff"
              color3="#050509"
              timeSpeed={0.9}
              colorBalance={-0.06}
              warpStrength={1.22}
              warpFrequency={5.2}
              warpSpeed={2.15}
              warpAmplitude={42}
              blendAngle={-168}
              blendSoftness={0.12}
              rotationAmount={520}
              noiseScale={2.1}
              grainAmount={0.1}
              grainScale={2.35}
              grainAnimated
              contrast={1.36}
              gamma={1}
              saturation={1.05}
              centerX={-0.02}
              centerY={0.02}
              zoom={0.78}
              dprCap={1.35}
            />
          </Suspense>
        </div>
        <Profile />
        <Projects />
        <Strengths />
        <ContactEnd />
      </main>
    </div>
  );
}
