import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DB_PATH = path.join(__dirname, "data.json")

const DEFAULT_DATA = {
  site: {
    logo: "JPENG",
    logoUrl: "",
    siteTitle: "JPENG | \u89c6\u89c9 & AI \u8bbe\u8ba1\u5e08",
    footer: "\u00a9 2026 JPENG. All rights reserved.",
    contactBtnText: "\u8054\u7cfb\u6211",
  },
  nav: [
    { label: "\u7cbe\u9009\u4f5c\u54c1", href: "/#projects" },
    { label: "\u4e2a\u4eba\u4f18\u52bf", href: "/#strengths" },
    { label: "\u7075\u611f\u521b\u610f", href: "/#inspiration" },
  ],
  hero: {
    tagline: "Visual & AI Designer",
    subtitle: "\u89c6\u89c9\u4e0eAI\u8bbe\u8ba1\u5e08",
    btnPrimary: "Contact",
    btnSecondary: "View Works",
    basedIn: "Beijing",
  },
  projects: [
    { id: "p1", title: "AI \u521b\u610f\u5e73\u53f0", subtitle: "Creative AI Platform", year: "2025", role: "\u4ea7\u54c1\u8bbe\u8ba1 / UI \u8bbe\u8ba1 / AI \u8bbe\u8ba1", tags: ["AI \u8bbe\u8ba1", "\u4ea7\u54c1\u8bbe\u8ba1", "SaaS"], overview: "\u9762\u5411\u521b\u4f5c\u8005\u7684\u5168\u6808AI\u8bbe\u8ba1\u5e73\u53f0", sections: [{ heading: "\u8bbe\u8ba1\u76ee\u6807", content: "<p>\u6253\u9020AI\u5de5\u5177</p>" }] },
    { id: "p2", title: "\u54c1\u724c\u89c6\u89c9\u7cfb\u7edf", subtitle: "Brand Identity System", year: "2024", role: "\u54c1\u724c\u8bbe\u8ba1 / VI \u7cfb\u7edf", tags: ["\u54c1\u724c\u8bbe\u8ba1", "VI \u7cfb\u7edf"], overview: "\u4e3a\u79d1\u6280\u54c1\u724c\u6253\u9020\u7684\u5168\u5957\u89c6\u89c9\u8bc6\u522b\u7cfb\u7edf", sections: [{ heading: "\u54c1\u724c\u5b9a\u4f4d", content: "<p>AI\u57fa\u7840\u8bbe\u65bd\u516c\u53f8</p>" }] },
    { id: "p3", title: "\u6570\u636e\u53ef\u89c6\u5316\u5e73\u53f0", subtitle: "Data Dashboard", year: "2024", role: "UI \u8bbe\u8ba1 / \u6570\u636e\u53ef\u89c6\u5316", tags: ["UI \u8bbe\u8ba1", "\u6570\u636e\u53ef\u89c6\u5316", "B\u7aef"], overview: "\u4f01\u4e1a\u7ea7\u6570\u636e\u76d1\u63a7\u4e0e\u5206\u6790\u4eea\u8868\u76d8", sections: [{ heading: "\u4fe1\u606f\u67b6\u6784", content: "<p>\u5361\u7247\u5f0f\u5e03\u5c40</p>" }] },
    { id: "p4", title: "\u667a\u80fd\u751f\u6d3bApp", subtitle: "Smart Lifestyle App", year: "2023", role: "UX \u8bbe\u8ba1 / \u79fb\u52a8\u7aef\u8bbe\u8ba1", tags: ["\u79fb\u52a8\u7aef", "\u7528\u6237\u4f53\u9a8c"], overview: "\u57fa\u4e8eAI\u63a8\u8350\u7684\u751f\u6d3b\u7ba1\u7406\u5e94\u7528", sections: [{ heading: "\u7528\u6237\u7814\u7a76", content: "<p>\u6df1\u5ea6\u8bbf\u8c08</p>" }] },
  ],
  strengths: [
    { id: "s1", num: "01", title: "Visual Design", titleCN: "\u89c6\u89c9\u8bbe\u8ba1", desc: "6\u5e74\u89c6\u89c9\u8bbe\u8ba1\u7ecf\u9a8c\uff0c\u7cbe\u901a\u54c1\u724c\u8bc6\u522b\u4e0e\u6392\u7248\u4f53\u7cfb\u3002", tags: ["Brand Identity", "Typography", "Color System", "Layout Grid"] },
    { id: "s2", num: "02", title: "AI Design", titleCN: "AI \u8bbe\u8ba1", desc: "\u5c06AI\u5de5\u5177\u6df1\u5ea6\u878d\u5408\u8bbe\u8ba1\u6d41\u7a0b\u3002", tags: ["Midjourney", "Stable Diffusion", "GPT-4 Vision", "ComfyUI"] },
    { id: "s3", num: "03", title: "UI & UX", titleCN: "\u754c\u9762\u4e0e\u4f53\u9a8c", desc: "\u4ee5\u7528\u6237\u51fa\u53d1\u7684\u8bbe\u8ba1\u601d\u7ef4\u3002", tags: ["Figma", "Prototyping", "Design System", "User Research"] },
    { id: "s4", num: "04", title: "Design Tech", titleCN: "\u8bbe\u8ba1\u6280\u672f", desc: "\u719f\u6089HTML/CSS/JavaScript\u3002", tags: ["React", "CSS Animation", "Responsive", "Tailwind"] },
  ],
  inspirations: [
    { id: "i1", title: "\u6781\u7b80\u4e3b\u4e49\u8bbe\u8ba1\u8bed\u8a00", subtitle: "Minimalist Design Language", category: "\u8bbe\u8ba1\u8d8b\u52bf", link: "https://www.awwwards.com", content: "<p>\u6781\u7b80\u4e3b\u4e49\u5728UI\u8bbe\u8ba1\u4e2d\u4e0d\u4ec5\u4ec5\u662f\u4e00\u53e5\u53e3\u53f7\u3002</p>" },
    { id: "i2", title: "AI \u751f\u6210\u827a\u672f\u7684\u8fb9\u754c", subtitle: "Boundaries of AI Art", category: "AI \u521b\u610f", link: "https://www.midjourney.com", content: "<p>AI\u751f\u6210\u827a\u672f\u6b63\u5728\u91cd\u65b0\u5b9a\u4e49\u521b\u610f\u8868\u8fbe\u7684\u8fb9\u754c\u3002</p>" },
    { id: "i3", title: "\u8bbe\u8ba1\u7cfb\u7edf\u4e2d\u7684\u8272\u5f69\u79d1\u5b66", subtitle: "Color Science in Design Systems", category: "\u8bbe\u8ba1\u7cfb\u7edf", link: "https://design.google", content: "<p>\u8272\u5f69\u662f\u8bbe\u8ba1\u7cfb\u7edf\u4e2d\u6700\u5177\u5f71\u54cd\u529b\u7684\u5143\u7d20\u3002</p>" },
    { id: "i4", title: "\u4ea4\u4e92\u8bbe\u8ba1\u7684\u672a\u6765\u5f62\u6001", subtitle: "Future of Interaction Design", category: "\u4ea4\u4e92\u8bbe\u8ba1", link: "https://dribbble.com", content: "<p>\u4ea4\u4e92\u8bbe\u8ba1\u6b63\u5728\u5411\u66f4\u81ea\u7136\u7684\u65b9\u5411\u6f14\u8fdb\u3002</p>" },
    { id: "i5", title: "\u54c1\u724c\u6545\u4e8b\u7684\u53ef\u89c6\u5316\u8868\u8fbe", subtitle: "Visual Storytelling for Brands", category: "\u54c1\u724c\u8bbe\u8ba1", link: "https://www.behance.net", content: "<p>\u54c1\u724c\u6545\u4e8b\u7684\u53ef\u89c6\u5316\u662f\u5c06\u62bd\u8c61\u7406\u5ff5\u8f6c\u5316\u4e3a\u89c6\u89c9\u4f53\u9a8c\u3002</p>" },
    { id: "i6", title: "\u6697\u8272\u6a21\u5f0f\u7684\u754c\u9762\u8bbe\u8ba1", subtitle: "Dark Mode UI Design", category: "UI \u8bbe\u8ba1", link: "https://dribbble.com", content: "<p>\u6697\u8272\u6a21\u5f0f\u5df2\u6210\u4e3a\u73b0\u4ee3\u5e94\u7528\u7684\u6807\u914d\u3002</p>" },
  ],
  contact: {
    email: "jpeng.design@example.com",
    wechat: "JPENG_Design",
    phone: "+86 138-0000-0000",
    headline: "Let\u2019s create something great together",
    blurb: "\u5408\u4f5c \u00b7 \u4ea4\u6d41 \u00b7 \u60f3\u6cd5 \u2014 \u968f\u65f6\u627e\u6211\u804a\u804a",
    qrUrl: "",
  },
}

function isDataCorrupted(data) {
  const json = JSON.stringify(data)
  // Only check for replacement character (encoding corruption)
  if (json.includes("\ufffd")) return true
  return false
}

function load() {
  try {
    if (fs.existsSync(DB_PATH)) {
      const raw = fs.readFileSync(DB_PATH, "utf-8")
      const parsed = JSON.parse(raw)
      if (isDataCorrupted(parsed)) {
        console.log("Data corrupted, resetting to defaults")
        try { fs.unlinkSync(DB_PATH) } catch {}
      } else {
        return parsed
      }
    }
  } catch (e) {
    console.warn("DB load error, using defaults:", e.message)
    try { fs.unlinkSync(DB_PATH) } catch {}
  }
  const data = JSON.parse(JSON.stringify(DEFAULT_DATA))
  save(data)
  return data
}

function save(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8")
}

export default { load, save, DEFAULT_DATA }
