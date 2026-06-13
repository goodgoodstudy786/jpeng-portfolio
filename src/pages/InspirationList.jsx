import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"
import Contact from "../components/Contact"
import BackToTop from "../components/BackToTop"
import ThemeToggle from "../components/ThemeToggle"
import useInView from "../hooks/useInView"
import { fetchAllData } from "../api"
import "./DetailPage.css"

export default function InspirationList() {
  const [items, setItems] = useState([])
  const [sectionRef, inView] = useInView()

  useEffect(() => {
    fetchAllData().then((d) => {
      if (d.inspirations) setItems(d.inspirations)
    }).catch(() => {})
  }, [])

  return (
    <div className="detail-page">
      <Navbar />
      <div className={`detail-body ${inView ? "in-view" : ""}`} ref={sectionRef} style={{ paddingTop: "140px", maxWidth: "1100px" }}>
        <div className="container">
          <Link to="/" className="detail-back-link">← 返回首页</Link>
          <div className="detail-meta-header">
            <span className="inspiration-category">Inspiration</span>
          </div>
          <h1 className="detail-title" style={{ fontSize: "clamp(2.4rem,4vw,3.6rem)", marginBottom: "48px" }}>
            灵感收藏
          </h1>
          <div className="inspiration-grid-full">
            {items.map((item, i) => (
              <Link to={"/inspiration/" + item.id} key={item.id} className={`inspo-card-full ${i % 4 === 0 ? "wide" : ""}`}>
                <span className="icf-num">{String(i + 1).padStart(2, "0")}</span>
                <div className="icf-body">
                  <span className="icf-cat">{item.category}</span>
                  <span className="icf-title">{item.title}</span>
                </div>
                <span className="icf-arrow">→</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Contact /><ThemeToggle /><BackToTop />
    </div>
  )
}
