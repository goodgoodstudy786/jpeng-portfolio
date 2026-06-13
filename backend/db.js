import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DB_PATH = path.join(__dirname, "data.json")

const DEFAULT_DATA = {
  site: {
    logo: "JPENG",
    logoUrl: "",
    siteTitle: "JPENG | 视觉 & AI 设计师",
    footer: "© 2026 JPENG. All rights reserved",
    contactBtnText: "联系我",
  },
  nav: [
    { label: "精选作品", href: "/#projects" },
    { label: "个人优势", href: "/#strengths" },
    { label: "灵感创意", href: "/#inspiration" },
  ],
  hero: {
    tagline: "Visual & AI Designer",
    subtitle: "设计代码之间 · 创造有意义的体验",
    btnPrimary: "Contact",
    btnSecondary: "View Works",
    basedIn: "Beijing",
  },
  projects: [
    { id: "p1", title: "AI 创意平台", subtitle: "Creative AI Platform", year: "2025", role: "产品设计 / UI 设计 / AI 设计", tags: ["AI 设计", "产品设计", "SaaS"], overview: "面向创作者的全栈AI设计平台", sections: [{ heading: "设计目标", content: "打造AI工具" }] },
    { id: "p2", title: "品牌视觉系统", subtitle: "Brand Identity System", year: "2024", role: "品牌设计 / VI 系统", tags: ["品牌设计", "VI 系统"], overview: "为科技品牌打造的全套视觉识别系统", sections: [{ heading: "品牌定位", content: "AI基础设施公司" }] },
    { id: "p3", title: "数据可视化平台", subtitle: "Data Dashboard", year: "2024", role: "UI 设计 / 数据可视化", tags: ["UI 设计", "数据可视化", "B端"], overview: "企业级数据监控与分析仪表盘", sections: [{ heading: "信息架构", content: "卡片式布局" }] },
    { id: "p4", title: "智能生活App", subtitle: "Smart Lifestyle App", year: "2023", role: "UX 设计 / 移动端设计", tags: ["移动端", "用户体验"], overview: "基于AI推荐的生活管理应用", sections: [{ heading: "用户研究", content: "深度访谈" }] },
  ],
  strengths: [
    { id: "s1", num: "01", title: "Visual Design", titleCN: "视觉设计", desc: "6年视觉设计经验，精通品牌识别与排版体系。", tags: ["Brand Identity", "Typography", "Color System", "Layout Grid"] },
    { id: "s2", num: "02", title: "AI Design", titleCN: "AI 设计", desc: "将AI工具深度融合设计流程。", tags: ["Midjourney", "Stable Diffusion", "GPT-4 Vision", "ComfyUI"] },
    { id: "s3", num: "03", title: "UI & UX", titleCN: "界面与体验", desc: "以用户出发的设计思维。", tags: ["Figma", "Prototyping", "Design System", "User Research"] },
    { id: "s4", num: "04", title: "Design Tech", titleCN: "设计技术", desc: "熟悉HTML/CSS/JavaScript。", tags: ["React", "CSS Animation", "Responsive", "Tailwind"] },
  ],
  inspirations: [
    { id: "i1", title: "极简主义设计语言", subtitle: "Minimalist Design Language", category: "设计趋势", link: "https://www.awwwards.com", content: "极简主义在UI设计中不仅仅是一句口号。" },
    { id: "i2", title: "AI 生成艺术的边界", subtitle: "Boundaries of AI Art", category: "AI 创意", link: "https://www.midjourney.com", content: "AI生成艺术正在重新定义创意表达的边界。" },
    { id: "i3", title: "设计系统中的色彩科学", subtitle: "Color Science in Design Systems", category: "设计系统", link: "https://design.google", content: "色彩是设计系统中最具影响力的元素。" },
    { id: "i4", title: "交互设计的未来形态", subtitle: "Future of Interaction Design", category: "交互设计", link: "https://dribbble.com", content: "交互设计正在向更自然的方向演进。" },
    { id: "i5", title: "品牌故事的可视化表达", subtitle: "Visual Storytelling for Brands", category: "品牌设计", link: "https://www.behance.net", content: "品牌故事的可视化是将抽象理念转化为视觉体验。" },
    { id: "i6", title: "暗色模式的界面设计", subtitle: "Dark Mode UI Design", category: "UI 设计", link: "https://dribbble.com", content: "暗色模式已成为现代应用的标配。" },
  ],
  contact: {
    email: "jpeng.design@example.com",
    wechat: "JPENG_Design",
    phone: "+86 138-0000-0000",
    headline: "Let\u2019s create something great together",
    blurb: "合作 · 交流 · 想法 — 随时找我聊聊",
    qrUrl: "",
  },
}

function load() {
  try {
    if (fs.existsSync(DB_PATH)) {
      const raw = fs.readFileSync(DB_PATH, "utf-8")
      return JSON.parse(raw)
    }
  } catch (e) {
    console.warn("DB load error, using defaults:", e.message)
  }
  save(DEFAULT_DATA)
  return JSON.parse(JSON.stringify(DEFAULT_DATA))
}

function save(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8")
}

export default { load, save, DEFAULT_DATA }

