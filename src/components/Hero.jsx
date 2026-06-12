import { useEffect, useRef, useState } from "react"
import { fetchAllData } from "../api"
import "./Hero.css"

export default function Hero() {
  const containerRef = useRef(null)
  const [tagline, setTagline] = useState("")
  const [showSub, setShowSub] = useState(false)
  const [heroData, setHeroData] = useState({ tagline: "Visual & AI Designer", subtitle: "设计代码之间 · 创造有意义的体验", btnPrimary: "Contact", btnSecondary: "View Works", basedIn: "Beijing" })

  useEffect(() => {
    fetchAllData().then((d) => {
      if (d.hero) setHeroData(d.hero)
    }).catch(() => {})
  }, [])

  useEffect(() => {
    const fullTagline = heroData.tagline
    let i = 0
    const timer = setInterval(() => {
      i++
      setTagline(fullTagline.slice(0, i))
      if (i >= fullTagline.length) {
        clearInterval(timer)
        setTimeout(() => setShowSub(true), 200)
      }
    }, 50)
    return () => clearInterval(timer)
  }, [heroData.tagline])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    canvas.className = "hero-canvas-interactive"
    container.appendChild(canvas)

    let w, h, cells = [], animId
    const CELL = 60, RADIUS = 220

    const resize = () => {
      w = canvas.width = window.innerWidth
      h = canvas.height = window.innerHeight
      cells = []
      const cols = Math.ceil(w / CELL) + 2, rows = Math.ceil(h / CELL) + 2
      for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++)
          cells.push({ x: c * CELL + (r % 2) * (CELL / 2), y: r * CELL * 0.86, baseA: 0, targetA: 0, currentA: 0 })
    }
    resize()
    window.addEventListener("resize", resize)

    let mouse = { x: -9999, y: -9999 }
    const onMouse = (e) => { const rect = canvas.getBoundingClientRect(); mouse.x = e.clientX - rect.left; mouse.y = e.clientY - rect.top }
    const onTouch = (e) => { const touch = e.touches[0]; if (!touch) return; const rect = canvas.getBoundingClientRect(); mouse.x = touch.clientX - rect.left; mouse.y = touch.clientY - rect.top }
    window.addEventListener("mousemove", onMouse)
    window.addEventListener("touchmove", onTouch)

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      cells.forEach((cell) => {
        const dx = mouse.x - cell.x, dy = mouse.y - cell.y, dist = Math.sqrt(dx * dx + dy * dy)
        cell.targetA = Math.max(0, 1 - dist / RADIUS)
        cell.currentA += (cell.targetA - cell.currentA) * 0.1
        const a = cell.currentA
        if (a < 0.005) return
        const gs = a * 18 + 3
        const grad = ctx.createRadialGradient(cell.x, cell.y, 0, cell.x, cell.y, gs)
        grad.addColorStop(0, `rgba(192,254,39,${a * 0.7})`)
        grad.addColorStop(0.5, `rgba(192,254,39,${a * 0.2})`)
        grad.addColorStop(1, "rgba(192,254,39,0)")
        ctx.beginPath(); ctx.arc(cell.x, cell.y, gs, 0, Math.PI * 2); ctx.fillStyle = grad; ctx.fill()
        for (let d2 = -CELL; d2 <= CELL; d2 += CELL) { const nx = cell.x + d2; if (nx < 0 || nx > w) continue; const ta = a * Math.max(0, 1 - Math.abs(d2) / CELL); if (ta < 0.01) continue; ctx.beginPath(); ctx.moveTo(cell.x, cell.y); ctx.lineTo(nx, cell.y); ctx.strokeStyle = `rgba(192,254,39,${ta * 0.25})`; ctx.lineWidth = 1; ctx.stroke() }
        for (let d2 = -CELL * 0.86; d2 <= CELL * 0.86; d2 += CELL * 0.86) { const ny = cell.y + d2; if (ny < 0 || ny > h) continue; const ta = a * Math.max(0, 1 - Math.abs(d2) / (CELL * 0.86)); if (ta < 0.01) continue; ctx.beginPath(); ctx.moveTo(cell.x, cell.y); ctx.lineTo(cell.x, ny); ctx.strokeStyle = `rgba(192,254,39,${ta * 0.2})`; ctx.lineWidth = 1; ctx.stroke() }
        ctx.beginPath(); ctx.arc(cell.x, cell.y, a * 2 + 1, 0, Math.PI * 2); ctx.fillStyle = `rgba(192,254,39,${a})`; ctx.fill()
      })
      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", onMouse)
      window.removeEventListener("touchmove", onTouch)
      canvas.remove()
    }
  }, [])

  const handleCopy = () => { navigator.clipboard.writeText("JPENG_Design"); alert("微信号 JPENG_Design 已复制") }

  return (
    <section className="hero-section" id="hero" ref={containerRef}>
      <div className="hero-bg">
        <div className="hero-grid-overlay" />
        <div className="hero-glow-center" />
        <div className="hero-glow-top-right" />
      </div>
      <div className="floating-shape shape-1" /><div className="floating-shape shape-2" /><div className="floating-shape shape-3" />
      <div className="hero-content">
        <div className="hero-brand">
          <span className="hero-brand-glow" />
          <span className="hero-brand-text" data-text="JPENG">JPENG</span>
        </div>
        <p className="hero-tagline">{tagline}<span className={`cursor ${tagline.length === heroData.tagline.length ? "blink" : ""}`}>|</span></p>
        <p className={`hero-sub ${showSub ? "visible" : ""}`}>{heroData.subtitle}</p>
        <div className="hero-actions">
          <button className="hero-btn" onClick={handleCopy}>{heroData.btnPrimary} <span>→</span></button>
          <a href="#projects" className="hero-btn-outline" onClick={(e) => { e.preventDefault(); document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" }) }}>{heroData.btnSecondary}</a>
        </div>
      </div>
      <div className="hero-footer">
        <span className="hero-footer-item">Based in {heroData.basedIn}</span>
        <div className="hero-divider" />
        <span className="hero-footer-item">6+ Years Experience</span>
        <div className="hero-divider" />
        <span className="hero-footer-item">UI / Visual / AI Design</span>
        <div className="hero-footer-spacer" />
        <button className="scroll-btn" onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}><span>↓</span></button>
      </div>
    </section>
  )
}
