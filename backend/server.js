import express from "express"
import cors from "cors"
import multer from "multer"
import path from "path"
import fs from "fs"
import crypto from "crypto"
import { fileURLToPath } from "url"
import { v4 as uuidv4 } from "uuid"
import db from "./db.js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DB_PATH = path.join(__dirname, "data.json")
const app = express()
const PORT = process.env.PORT || 3001

const ADMIN_USER = process.env.ADMIN_USER || "jpeng"
const ADMIN_PASS = process.env.ADMIN_PASS || "jpeng2024"
const ADMIN_PATH = process.env.ADMIN_PATH || "/jpeng-cms"
const TOKEN_SECRET = crypto.randomBytes(32).toString("hex")

app.use(cors())
app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ extended: true, limit: "50mb" }))

app.use("/uploads", express.static(path.join(__dirname, "uploads")))

function parseToken(token) {
  try {
    const parts = token.split(".")
    if (parts.length !== 2) return null
    const payload = JSON.parse(Buffer.from(parts[0], "base64").toString())
    const sig = crypto.createHmac("sha256", TOKEN_SECRET).update(parts[0]).digest("base64url")
    if (sig !== parts[1]) return null
    if (payload.exp && payload.exp < Date.now()) return null
    return payload
  } catch { return null }
}

function createToken() {
  const payload = Buffer.from(JSON.stringify({ user: ADMIN_USER, exp: Date.now() + 86400000 })).toString("base64")
  const sig = crypto.createHmac("sha256", TOKEN_SECRET).update(payload).digest("base64url")
  return payload + "." + sig
}

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization
  if (!auth) return res.status(401).json({ error: "Unauthorized" })
  const token = auth.replace("Bearer ", "")
  const payload = parseToken(token)
  if (!payload) return res.status(401).json({ error: "Invalid token" })
  req.user = payload
  next()
}

// ── Auth routes ──
app.post("/api/login", (req, res) => {
  const { username, password } = req.body
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const token = createToken()
    res.json({ success: true, token })
  } else {
    res.status(401).json({ error: "用户名或密码错误" })
  }
})

app.get("/api/check-auth", authMiddleware, (req, res) => {
  res.json({ authenticated: true, user: req.user })
})

// ── Admin routes (with auth protection + static serve) ──



app.use(ADMIN_PATH, function(req, res, next) { res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate"); next(); }, express.static(path.join(__dirname, "admin")));
// ── Frontend dist ──
const distPath = path.join(__dirname, "..", "dist")

// ── Serve frontend root with data injection ──
app.use(ADMIN_PATH, function(req, res, next) { res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate"); next(); }, express.static(path.join(__dirname, "admin")));

app.get("/", (req, res) => {
  const data = getData();
  const siteData = JSON.stringify({
    logo: data.site?.logo || "JPENG",
    logoUrl: data.site?.logoUrl || "",
    siteTitle: data.site?.siteTitle || "JPENG | 视觉 & AI 设计师",
    footer: data.site?.footer || ""
  });
  let html = fs.readFileSync(path.join(distPath, "index.html"), "utf-8");
  html = html.replace("<title>", "<script>window.__SITE_DATA__=" + siteData + "</script><title>");
  html = html.replace(/<title>[^<]*<\/title>/, "<title>" + (data.site?.siteTitle || "JPENG | 视觉 & AI 设计师") + "</title>");
  res.send(html);
});

app.use(express.static(distPath))

// ── Upload ──
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "uploads")),
  filename: (req, file, cb) => { cb(null, uuidv4() + path.extname(file.originalname)) },
})
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } })

function getData() { return db.load() }
function saveData(data) { db.save(data) }

// ── API (protected by authMiddleware) ──
app.get("/api/data", (req, res) => { res.set("Cache-Control", "no-store, no-cache, must-revalidate"); res.json(getData()) })

app.put("/api/site", authMiddleware, (req, res) => {
  const data = getData(); data.site = { ...data.site, ...req.body }; saveData(data); res.json({ success: true })
})
app.put("/api/nav", authMiddleware, (req, res) => {
  const data = getData(); data.nav = req.body; saveData(data); res.json({ success: true })
})
app.put("/api/hero", authMiddleware, (req, res) => {
  const data = getData(); data.hero = { ...data.hero, ...req.body }; saveData(data); res.json({ success: true })
})

app.get("/api/projects", (req, res) => { res.json(getData().projects) })
app.post("/api/projects", authMiddleware, (req, res) => {
  const data = getData(); const project = { id: uuidv4(), ...req.body }; data.projects.push(project); saveData(data); res.json(project)
})
app.put("/api/projects/:id", authMiddleware, (req, res) => {
  const data = getData(); const idx = data.projects.findIndex((p) => p.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: "Not found" })
  data.projects[idx] = { ...data.projects[idx], ...req.body }; saveData(data); res.json(data.projects[idx])
})
app.delete("/api/projects/:id", authMiddleware, (req, res) => {
  const data = getData(); data.projects = data.projects.filter((p) => p.id !== req.params.id); saveData(data); res.json({ success: true })
})

app.get("/api/strengths", (req, res) => { res.json(getData().strengths) })
app.post("/api/strengths", authMiddleware, (req, res) => {
  const data = getData(); const item = { id: uuidv4(), ...req.body }; data.strengths.push(item); saveData(data); res.json(item)
})
app.put("/api/strengths/:id", authMiddleware, (req, res) => {
  const data = getData(); const idx = data.strengths.findIndex((s) => s.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: "Not found" })
  data.strengths[idx] = { ...data.strengths[idx], ...req.body }; saveData(data); res.json(data.strengths[idx])
})
app.delete("/api/strengths/:id", authMiddleware, (req, res) => {
  const data = getData(); data.strengths = data.strengths.filter((s) => s.id !== req.params.id); saveData(data); res.json({ success: true })
})

app.get("/api/inspirations", (req, res) => { res.json(getData().inspirations) })
app.post("/api/inspirations", authMiddleware, (req, res) => {
  const data = getData(); const item = { id: uuidv4(), ...req.body }; data.inspirations.push(item); saveData(data); res.json(item)
})
app.put("/api/inspirations/:id", authMiddleware, (req, res) => {
  const data = getData(); const idx = data.inspirations.findIndex((i) => i.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: "Not found" })
  data.inspirations[idx] = { ...data.inspirations[idx], ...req.body }; saveData(data); res.json(data.inspirations[idx])
})
app.delete("/api/inspirations/:id", authMiddleware, (req, res) => {
  const data = getData(); data.inspirations = data.inspirations.filter((i) => i.id !== req.params.id); saveData(data); res.json({ success: true })
})

app.put("/api/contact", authMiddleware, (req, res) => {
  const data = getData(); data.contact = { ...data.contact, ...req.body }; saveData(data); res.json({ success: true })
})

app.post("/api/upload", authMiddleware, upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file" })
  res.json({ url: "/uploads/" + req.file.filename })
})

// Reset data to defaults (protected by auth)
app.post("/api/reset-data", authMiddleware, (req, res) => {
  try { fs.unlinkSync(DB_PATH) } catch {}
  const data = db.load()
  res.json({ success: true, message: "Data reset to defaults" })
})

app.use((req, res) => { res.sendFile(path.join(distPath, "index.html")) })

app.listen(PORT, "::", () => {
  // Force reset corrupted data on startup
  try {
    const raw = fs.readFileSync(DB_PATH, "utf-8")
    const parsed = JSON.parse(raw)
    const json = JSON.stringify(parsed)
    // Only check for replacement character (encoding corruption)
    if (/[\u3400-\u4dff]/.test(json) || json.includes("\ufffd")) {
      console.log("Corrupted data detected on startup, deleting and resetting")
      fs.unlinkSync(DB_PATH)
    }
  } catch {}
  console.log("Server: http://localhost:" + PORT)
  console.log("Admin: http://localhost:" + PORT + ADMIN_PATH)
})
