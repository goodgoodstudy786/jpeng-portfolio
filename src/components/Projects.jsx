import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import useInView from "../hooks/useInView"
import { fetchAllData } from "../api"
import "./Projects.css"

const TABS = [
  { id: "all", label: "All" },
  { id: "app", label: "App UI" },
  { id: "web", label: "Web UI" },
  { id: "brand", label: "Brand" },
  { id: "ai", label: "AI" },
]

export default function Projects() {
  const [activeTab, setActiveTab] = useState("all")
  const [expanded, setExpanded] = useState(false)
  const [sectionRef, inView] = useInView()
  const [projects, setProjects] = useState([])

  useEffect(() => {
    fetchAllData().then((d) => {
      if (d.projects) setProjects(d.projects)
    }).catch(() => {})
  }, [])

  const filtered = activeTab === "all"
    ? projects
    : projects.filter((p) => {
        const tags = (p.tags || []).map((t) => t.toLowerCase())
        return tags.some((t) => t.includes(activeTab))
      })
  const visible = expanded ? filtered : filtered.slice(0, 6)

  return (
    <section className={`work-section ${inView ? "in-view" : ""}`} id="projects" ref={sectionRef}>
      <div className="container">
        <div className="work-top">
          <div className="work-header">
            <div className="section-label">Portfolio</div>
            <h2 className="section-title">
              <span className="title-en">Selected</span>
              <span className="title-cn">精选作品</span>
            </h2>
          </div>
          <div className="tabs">
            {TABS.map((tab) => (
              <button key={tab.id} className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => { setActiveTab(tab.id); setExpanded(false) }}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="work-masonry">
          {visible.map((p, i) => (
            <Link to={`/project/${p.id}`} key={p.id} className="work-card" style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="work-card-visual" style={{ background: "linear-gradient(135deg, #C0FE27, #9ddb10)" }}>
                <div className="work-card-pattern">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <div key={j} className="w-dot" style={{
                      background: "rgba(0,0,0,0.08)",
                      width: `${20 + j * 8}px`, height: `${20 + j * 8}px`,
                      animationDelay: `${j * 0.15}s`
                    }} />
                  ))}
                </div>
                <div className="work-card-overlay">
                  <span className="work-card-view">View →</span>
                </div>
              </div>
              <div className="work-card-info">
                <div className="work-card-tags">
                  {(p.tags || []).map((t) => <span key={t} className="w-tag">{t}</span>)}
                </div>
                <h3 className="work-card-title">
                  <span className="w-title-en">{p.subtitle || p.title}</span>
                  <span className="w-title-cn">{p.title}</span>
                </h3>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length > 6 && (
          <div className="work-expand">
            <button className="expand-btn" onClick={() => setExpanded(!expanded)}>
              {expanded ? "Show Less ↑" : "View All →"}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
