import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { fetchAllData } from "../api"
import "./Navbar.css"

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [navLinks, setNavLinks] = useState([])
  const [logo, setLogo] = useState("JPENG")
  const location = useLocation()

  useEffect(() => {
    fetchAllData().then((d) => {
      if (d.nav) setNavLinks(d.nav)
      if (d.site?.logo) setLogo(d.site.logo)
    }).catch(() => {})
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    if (showPopup) {
      const handler = (e) => {
        if (!e.target.closest(".contact-popup") && !e.target.closest(".nav-contact-btn")) {
          setShowPopup(false)
        }
      }
      document.addEventListener("click", handler)
      return () => document.removeEventListener("click", handler)
    }
  }, [showPopup])

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [menuOpen])

  const handleNav = (e, href) => {
    setMenuOpen(false)
    if (!href.startsWith("/#")) return
    const id = href.slice(2)
    if (location.pathname !== "/") { window.location.href = href; return }
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  }

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
    alert(`已复制 ${text}`)
  }

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""} ${menuOpen ? "menu-open" : ""}`}>
      <Link to="/" className="logo" onClick={() => setMenuOpen(false)}>
        <span className="logo-glow" />
        <span className="logo-text">{logo}</span>
      </Link>

      <div className={`nav-center ${menuOpen ? "open" : ""}`}>
        {navLinks.map((link) => (
          <a key={link.href} href={link.href} className="nav-item" onClick={(e) => handleNav(e, link.href)}>
            <span className="nav-item-cn">{link.label}</span>
          </a>
        ))}
        <button className="nav-contact-btn mobile-contact" onClick={() => { setShowPopup(!showPopup); setMenuOpen(false) }}>
          <span className="nav-contact-icon">✦</span>
          <span className="nav-contact-text">联系我</span>
        </button>
      </div>

      <div className="nav-right">
        <button className="nav-contact-btn desktop-contact" onClick={() => setShowPopup(!showPopup)}>
          <span className="nav-contact-icon">✦</span>
          <span className="nav-contact-text">联系我</span>
        </button>
        <button className={`hamburger ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </div>

      {showPopup && (
        <div className="contact-popup">
          <div className="popup-arrow" />
          <div className="popup-header">
            <span className="popup-title">联系方式</span>
            <span className="popup-eng">Contact</span>
          </div>
          <div className="popup-body">
            <div className="popup-item" onClick={() => handleCopy("jpeng.design@example.com")}>
              <span className="popup-item-icon">✉</span>
              <div className="popup-item-info">
                <span className="popup-item-label">Email</span>
                <span className="popup-item-value">jpeng.design@example.com</span>
              </div>
              <span className="popup-item-copy">复制</span>
            </div>
            <div className="popup-item" onClick={() => handleCopy("+86 138-0000-0000")}>
              <span className="popup-item-icon">📞</span>
              <div className="popup-item-info">
                <span className="popup-item-label">Phone</span>
                <span className="popup-item-value">+86 138-0000-0000</span>
              </div>
              <span className="popup-item-copy">复制</span>
            </div>
            <div className="popup-item" onClick={() => handleCopy("JPENG_Design")}>
              <span className="popup-item-icon">💬</span>
              <div className="popup-item-info">
                <span className="popup-item-label">WeChat</span>
                <span className="popup-item-value">JPENG_Design</span>
              </div>
              <span className="popup-item-copy">复制</span>
            </div>
            <div className="popup-qr">
              <div className="popup-qr-visual">
                <div className="popup-qr-grid">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className={`pq-cell ${[0,2,4,6,8].includes(i) ? "on" : ""}`} />
                  ))}
                </div>
                <div className="popup-qr-text">JPENG</div>
              </div>
              <span className="popup-qr-label">微信扫码</span>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
