import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import Navbar from "../components/Navbar"
import Loading from "../components/Loading"
import Contact from "../components/Contact"
import BackToTop from "../components/BackToTop"
import ThemeToggle from "../components/ThemeToggle"
import { fetchAllData } from "../api"
import "./DetailPage.css"

export default function InspirationDetail() {
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [item, setItem] = useState(null)
  const [items, setItems] = useState([])

  useEffect(() => {
    setLoading(true)
    setItem(null)
    fetchAllData().then((d) => {
      if (d.inspirations) setItems(d.inspirations)
      const found = d.inspirations?.find((i) => i.id === id)
      if (found) setItem(found)
    }).catch(() => {}).finally(() => {
      setLoading(false)
    })
  }, [id])

  const currentIdx = items.findIndex((i) => i.id === id)
  const prevId = currentIdx > 0 ? items[currentIdx - 1]?.id : null
  const nextId = currentIdx < items.length - 1 ? items[currentIdx + 1]?.id : null

  if (loading) {
    return <Loading />
  }

  if (!item) {
    return (
      <div className="detail-page">
        <Navbar />
        <div className="container" style={{ paddingTop: "160px", textAlign: "center" }}>
          <h1>灵感笔记未找到</h1>
          <Link to="/" className="back-link" style={{ marginTop: "20px", display: "inline-block" }}>返回首页</Link>
        </div>
        <BackToTop /><ThemeToggle />
      </div>
    )
  }

  const handleOpenLink = () => { window.open(item.link, "_blank", "noopener,noreferrer") }

  return (
    <div className="detail-page">
      <Navbar />
      <div className="detail-body container" style={{ paddingTop: "140px" }}>
        <Link to="/inspirations" className="detail-back-link" style={{ marginBottom: "24px", display: "inline-block" }}>← 返回灵感列表</Link>
        <div className="detail-meta-header">
          <span className="inspiration-category">{item.category}</span>
        </div>
        <h1 className="detail-title" style={{ fontSize: "clamp(2rem,4vw,3rem)", marginBottom: "8px" }}>{item.title}</h1>
        <p className="detail-subtitle" style={{ marginBottom: "48px" }}>{item.subtitle}</p>
        <div className="detail-content-text">
          <div className="detail-content-html" dangerouslySetInnerHTML={{ __html: item.content || "" }} />
        </div>
        <div className="inspiration-footer-actions">
          <button className="inspiration-link-btn" onClick={handleOpenLink}>
            <span>🔗</span> 查看灵感来源
          </button>
        </div>
      </div>

      <div className="container">
        <div className="detail-pager">
          {prevId ? (
            <Link to={"/inspiration/" + prevId} className="dp-link dp-prev">
              <span className="dp-arrow">←</span>
              <span className="dp-body">
                <span className="dp-label">上一篇</span>
                <span className="dp-title">{items[currentIdx - 1]?.title || ""}</span>
              </span>
            </Link>
          ) : (
            <div className="dp-link dp-disabled">
              <span className="dp-body"><span className="dp-label" style={{color:"var(--text-muted)"}}>已是第一篇</span></span>
            </div>
          )}
          {nextId ? (
            <Link to={"/inspiration/" + nextId} className="dp-link dp-next">
              <span className="dp-body" style={{textAlign:"right"}}>
                <span className="dp-label">下一篇</span>
                <span className="dp-title">{items[currentIdx + 1]?.title || ""}</span>
              </span>
              <span className="dp-arrow">→</span>
            </Link>
          ) : (
            <div className="dp-link dp-disabled dp-next">
              <span className="dp-body" style={{textAlign:"right"}}><span className="dp-label" style={{color:"var(--text-muted)"}}>已是最后一篇</span></span>
            </div>
          )}
        </div>
      </div>

      <Contact /><ThemeToggle /><BackToTop />
    </div>
  )
}
