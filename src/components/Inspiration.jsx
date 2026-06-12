import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import useInView from "../hooks/useInView"
import { fetchAllData } from "../api"
import "./Inspiration.css"

export default function Inspiration() {
  const [sectionRef, inView] = useInView()
  const [items, setItems] = useState([])

  useEffect(() => {
    fetchAllData().then((d) => {
      if (d.inspirations) setItems(d.inspirations)
    }).catch(() => {})
  }, [])

  return (
    <section className={`inspiration-section ${inView ? "in-view" : ""}`} id="inspiration" ref={sectionRef}>
      <div className="container">
        <div className="inspiration-header">
          <div className="section-label">Inspiration</div>
          <h2 className="section-title">
            <span className="title-en">Inspirations</span>
            <span className="title-cn">灵感收藏</span>
          </h2>
        </div>
        <div className="inspiration-grid">
          {items.map((item, i) => (
            <Link
              to={`/inspiration/${item.id}`}
              key={item.id}
              className={`inspo-card ${i % 3 === 0 ? "wide" : ""}`}
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <span className="inspo-card-num">{String(i + 1).padStart(2, "0")}</span>
              <div className="inspo-card-body">
                <span className="inspo-card-cat">{item.category}</span>
                <span className="inspo-card-title">{item.title}</span>
              </div>
              <span className="inspo-card-arrow">→</span>
            </Link>
          ))}
        </div>
        <div className="inspiration-more">
          <Link to="/inspirations" className="inspiration-more-btn">
            全部灵感 <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
