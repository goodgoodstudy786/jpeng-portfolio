# Full Conversation Context & Debug Info

## Current State (2026-06-13)
All files are as they currently exist on disk. The admin page has been heavily modified.

## Key Files
- ackend/server.js -- Express server (ESM). Port 3001. Routes: /api/*, /jpeng-cms/* (admin), / (frontend SPA)
- ackend/admin/index.html -- Monolithic admin SPA. 700+ lines. All CSS inline, all JS inline.
- ackend/data.json -- JSON data store. Projects, inspirations, site settings, etc.
- ackend/db.js -- DB loader/saver module.
- src/pages/ProjectDetail.jsx -- React project detail page. Uses dangerouslySetInnerHTML.
- src/pages/InspirationDetail.jsx -- React inspiration detail page. Uses dangerouslySetInnerHTML.
- src/components/Loading.jsx + Loading.css -- Loading spinner component.

## Admin Panel Features
- Login: jpeng / jpeng2024
- Sections: 网站设置, 导航菜单, Banner设置, 精选作品, 个人优势, 灵感收藏, 联系方式
- Project editing modal with Quill rich text editor (self-hosted)
- Image upload: Quill image button -> file dialog -> /api/upload -> inserts <img src="/uploads/uuid.png">
- Cancel button: calls closeModal() -> destroyProjectQuill/InspirationQuill -> removes .open class

## Fixes Applied (in order)
1. Removed max-width:1200px from .main, made sidebar 240px, added responsive breakpoints
2. Added hamburger menu for mobile (sidebar-overlay, toggleSidebar function)
3. Added e.stopPropagation() on modal-content to prevent Quill dropdown clicks from closing modal
4. Added custom Quill image upload handler (quillImageHandler) with savedRange for cursor preservation
5. Self-hosted Quill editor files (quill.min.js, quill.snow.css) under backend/admin/quill/
6. Added Cache-Control: no-store headers to admin page
7. Fixed Express middleware ordering: admin static serve before admin fallback (so quill files serve correctly)
8. Fixed JavaScript syntax error: extra }); in initProjectQuill and initInspirationQuill (replaced with local Quill init)

## Remaining Issues
### Image Persistence on Railway
When using ailway up, the local uploads/ directory is included in the deploy. But images uploaded via admin panel at runtime are saved to Railway's ephemeral filesystem and WILL BE LOST on next deploy. Recommend using cloud storage (S3, Cloudinary).

### Frontend Image Display
Works locally (verified with Playwright Chrome). Images load from /uploads/ path. The key requirement is that the uploaded file exists on disk and the Express static middleware can serve it.

### Railway Deploy
- ailway up --yes from project root uploads current directory
- Procfile: web: node backend/server.js
- Build: 
pm run build (builds frontend to dist/)
- URL: https://web-production-0f5d7.up.railway.app/
- Admin: https://web-production-0f5d7.up.railway.app/jpeng-cms/

### Git
- Remote: https://github.com/goodgoodstudy786/jpeng-portfolio.git
- GitHub push may fail (connection timeout in current environment)
- Use ailway up --yes to deploy without GitHub

## Railway CLI
- Installed at: C:\Users\Administrator\AppData\Roaming\npm\railway.ps1
- Project: jpeng-portfolio (ID: 1d8ac168-b6ac-4d16-b779-a3cbf92ba6c8)
- Service: web (ID: 8e3498ce-3f3e-44ed-8a74-188fa4f5f3f0)
- Environment: production (ID: 4a3542d3-a202-4059-a707-8dd661cf0698)
