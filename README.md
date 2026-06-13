# JPENG Portfolio - 完整项目资料

## 基本信息
- **项目名称**: jpeng-portfolio（个人作品集网站）
- **技术栈**: 前端 React + Vite，后端 Express (ESM)，数据存储 JSON 文件
- **服务器端口**: 3001
- **线上地址**: https://web-production-0f5d7.up.railway.app/
- **后台地址**: /jpeng-cms
- **账号**: jpeng / jpeng2024

## 项目结构
jpeng-portfolio/
├── backend/
│   ├── server.js          # Express 服务器（ESM）
│   ├── db.js              # JSON 数据库
│   ├── data.json          # 持久化数据
│   ├── admin/
│   │   ├── index.html     # 后台管理页面（单文件，内联 CSS+JS）
│   │   └── quill/         # 本地托管的 Quill 编辑器文件
│   └── uploads/           # 上传的图片
├── src/                   # 前端 React 源码
│   ├── App.jsx
│   ├── pages/
│   │   ├── ProjectDetail.jsx    # 项目详情（已用 dangerouslySetInnerHTML）
│   │   ├── InspirationDetail.jsx # 灵感详情（已用 dangerouslySetInnerHTML）
│   ├── components/
│   │   ├── Projects.jsx
│   │   └── Loading.jsx          # 加载组件（修复"项目未找到"闪烁）
│   └── api.js             # 前端 API 调用
├── dist/                  # 前端构建产物
├── Procfile               # Railway: web: node backend/server.js
└── package.json
