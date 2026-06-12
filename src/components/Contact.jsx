import { useState, useEffect, useRef } from "react"
import useInView from "../hooks/useInView"
import "./Contact.css"

export default function Contact() {
  const [sectionRef, inView] = useInView()
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    let w, h, particles = [], animId, mouse = { x: -9999, y: -9999 }

    const resize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight }
    resize()
    window.addEventListener("resize", resize)

    class Particle {
      constructor() {
        this.reset()
      }
      reset() { this.x = Math.random() * w; this.y = Math.random() * h; this.vx = (Math.random() - 0.5) * 0.3; this.vy = (Math.random() - 0.5) * 0.3; this.r = Math.random() * 1.8 + 0.3; this.alpha = Math.random() * 0.2 + 0.02 }
      update() {
        const dx = mouse.x - this.x, dy = mouse.y - this.y, dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 300) { this.vx += dx * 0.00015; this.vy += dy * 0.00015 }
        this.vx *= 0.98; this.vy *= 0.98
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy)
        if (speed > 0.6) { this.vx *= 0.6 / speed; this.vy *= 0.6 / speed }
        this.x += this.vx; this.y += this.vy
        if (this.x < -20 || this.x > w + 20 || this.y < -20 || this.y > h + 20) this.reset()
      }
      draw() { ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(192,254,39,${this.alpha})`; ctx.fill() }
    }

    const count = Math.min(60, Math.floor(w * h / 20000))
    for (let i = 0; i < count; i++) particles.push(new Particle())

    const onMove = (e) => { const rect = canvas.getBoundingClientRect(); mouse.x = e.clientX - rect.left; mouse.y = e.clientY - rect.top }
    window.addEventListener("mousemove", onMove)

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      particles.forEach((p, i) => {
        p.update(); p.draw()
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j], dx = p.x - p2.x, dy = p.y - p2.y, dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 100) { ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y); ctx.strokeStyle = `rgba(192,254,39,${0.02 * (1 - dist / 100)})`; ctx.lineWidth = 0.3; ctx.stroke() }
        }
      })
      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); window.removeEventListener("mousemove", onMove); canvas.remove() }
  }, [])

  return (
    <section className={`contact-section ${inView ? "in-view" : ""}`} id="contact" ref={sectionRef}>
      <canvas ref={canvasRef} className="contact-canvas" />
      <footer className="site-footer">
        <div className="footer-bar">
          <div className="footer-bar-inner">
            <div className="footer-bar-left">
              <span className="copyright">© 2026 JPENG. All rights reserved</span>
              <a href="#" className="footer-link">Terms & Conditions</a>
            </div>
            <div className="footer-bar-right">
              <span>Designed by JPENG</span>
              <a href="#" className="footer-link">@JPENG.design</a>
            </div>
          </div>
        </div>
        <div className="footer-brand-area">
          <div className="footer-brand-inner">
            <span className="footer-brand-large">JPENG</span>
          </div>
        </div>
      </footer>
    </section>
  )
}
