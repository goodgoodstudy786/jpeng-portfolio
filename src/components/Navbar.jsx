import { useState, useEffect, useRef, useCallback } from "react"
import { Link, useLocation } from "react-router-dom"
import { Mail, Phone, MessageCircle } from "lucide-react"
import { fetchAllData } from "../api"
import "./Navbar.css"

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [navLinks, setNavLinks] = useState([])
  const [logo, setLogo] = useState("JPENG")
  const [logoUrl, setLogoUrl] = useState("")
  const [contactData, setContactData] = useState({ email: "", wechat: "", phone: "", qrUrl: "", headline: "联系方式" })
  const [btnText, setBtnText] = useState("联系我")
  const [toast, setToast] = useState(null)
  const toastTimer = useRef(null)
  const location = useLocation()

  useEffect(() => {
    const init = window.__SITE_DATA__
    if (init) {
      if (init.logoUrl) setLogoUrl(init.logoUrl)
      if (init.logo) setLogo(init.logo)
    }
    fetchAllData().then((d) => {
      if (d.nav) setNavLinks(d.nav)
      if (d.site?.logoUrl) setLogoUrl(d.site.logoUrl)
      if (d.site?.logo) setLogo(d.site.logo)
      if (d.site?.contactBtnText) setBtnText(d.site.contactBtnText)
      if (d.contact) setContactData(d.contact)
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

  const showToastMsg = useCallback((msg) => {
    setToast(msg)
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 2000)
  }, [])

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
    showToastMsg("已复制")
  }

  return (
    <>
    <nav className={`navbar ${scrolled ? "scrolled" : ""} ${menuOpen ? "menu-open" : ""}`}>
      <Link to="/" className="logo" onClick={() => setMenuOpen(false)}>
        <span className="logo-glow" />
        {logoUrl ? (
          <img src={logoUrl} alt={logo} className="logo-img" />
        ) : (
          <span className="logo-text">{logo}</span>
        )}
      </Link>

      <div className={`nav-center ${menuOpen ? "open" : ""}`}>
        {navLinks.map((link) => (
          <a key={link.href} href={link.href} className="nav-item" onClick={(e) => handleNav(e, link.href)}>
            <span className="nav-item-cn">{link.label}</span>
          </a>
        ))}
        <button className="nav-contact-btn mobile-contact" onClick={() => { setShowPopup(!showPopup); setMenuOpen(false) }}>
          <span className="nav-contact-icon">✦</span>
          <span className="nav-contact-text">{btnText}</span>
        </button>
      </div>

      <div className="nav-right">
        <button className="nav-contact-btn desktop-contact" onClick={() => setShowPopup(!showPopup)}>
          <span className="nav-contact-icon">✦</span>
          <span className="nav-contact-text">{btnText}</span>
        </button>
        <button className={`hamburger ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </div>

      {showPopup && (
        <div className="contact-popup">
          <div className="popup-arrow" />
          <div className="popup-header">
            <span className="popup-title">{contactData.headline || "联系方式"}</span>
            <span className="popup-eng">Contact</span>
          </div>
          <div className="popup-body">
            <div className="popup-item" onClick={() => handleCopy(contactData.email)}>
              <span className="popup-item-icon"><Mail size={18} strokeWidth={1.5} /></span>
              <div className="popup-item-info">
                <span className="popup-item-label">Email</span>
                <span className="popup-item-value">{contactData.email}</span>
              </div>
            </div>
            <div className="popup-item" onClick={() => handleCopy(contactData.phone)}>
              <span className="popup-item-icon"><Phone size={18} strokeWidth={1.5} /></span>
              <div className="popup-item-info">
                <span className="popup-item-label">Phone</span>
                <span className="popup-item-value">{contactData.phone}</span>
              </div>
            </div>
            <div className="popup-item" onClick={() => handleCopy(contactData.wechat)}>
              <span className="popup-item-icon"><MessageCircle size={18} strokeWidth={1.5} /></span>
              <div className="popup-item-info">
                <span className="popup-item-label">WeChat</span>
                <span className="popup-item-value">{contactData.wechat}</span>
              </div>
            </div>
            {contactData.qrUrl && (
              <div className="popup-qr">
                <img src={contactData.qrUrl} alt="QR Code" className="popup-qr-img" />
                <span className="popup-qr-label">微信扫码</span>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
    {toast && <div className="nav-toast">{toast}</div>}
    </>
  )
}