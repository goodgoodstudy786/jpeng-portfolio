# 已知问题 & 待修复

## 1. 后台文本编辑器上传图片前台不显示
**根因**: 图片通过 /api/upload 上传到 ackend/uploads/，URL 为 /uploads/uuid.png。前台用 dangerouslySetInnerHTML 渲染 <img src="/uploads/uuid.png">。问题在于：
- Railway 部署时 uploads/ 目录会随代码上传，但**运行中新上传的图片在下次部署会丢失**（Railway 文件系统是临时的）
- Express 的 catch-all 路由会拦截不存在的文件路径，返回 SPA 的 HTML 页面（状态码 200）而非 404

## 2. 后台页面响应式布局
- 侧边栏 240px，主内容区 flex:1
- 移动端 768px 以下：侧边栏变为汉堡菜单抽屉
- 布局代码已写入 ackend/admin/index.html

## 3. 后端 index.js 和 dist 问题
- 本地路径为 C:\Users\Administrator\Documents\个人网站2.0\jpeng-portfolio
- 但 Rails 等外部依赖可能有路径假设

## 4. 历史遗留问题（可能已修复）
- Quill 编辑器 CDN 加载失败 → 已改为本地托管
- JavaScript 语法错误（多余 });）→ 已修复
- Express 中间件顺序导致静态文件返回 HTML → 已修复
- closeModal 中 destroyProjectQuill 未定义 → 已修复

## 5. 建议图片方案
建议改为将图片上传到云存储（如 Cloudinary, AWS S3 等），返回完整 URL。这样 Railway 部署后图片不会丢失。
