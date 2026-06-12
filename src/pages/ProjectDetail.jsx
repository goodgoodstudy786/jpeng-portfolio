import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import Navbar from "../components/Navbar"
import useInView from "../hooks/useInView"
import Contact from "../components/Contact"
import BackToTop from "../components/BackToTop"
import ThemeToggle from "../components/ThemeToggle"
import { fetchAllData } from "../api"
import "./DetailPage.css"

export default function ProjectDetail() {
  const { id } = useParams()
  const [project, setProject] = useState(null)
  const [projects, setProjects] = useState([])
  const [bodyRef, bodyInView] = useInView()

  useEffect(() => {
    fetchAllData().then((d) => {
      if (d.projects) setProjects(d.projects)
      const found = d.projects?.find((p) => p.id === id)
      if (found) setProject(found)
    }).catch(() => {})
  }, [id])

  const currentIdx = projects.findIndex((p) => p.id === id)
  const prevId = currentIdx > 0 ? projects[currentIdx - 1]?.id : null
  const nextId = currentIdx < projects.length - 1 ? projects[currentIdx + 1]?.id : null
  const prevTitle = prevId ? projects[currentIdx - 1]?.title : null
  const nextTitle = nextId ? projects[currentIdx + 1]?.title : null

  if (!project) {
    return (
      <div className="detail-page">
        <Navbar />
        <div className="container" style={{ paddingTop: "160px", textAlign: "center" }}>
          <h1>项目未找到</h1>
          <Link to="/" className="back-link" style={{ marginTop: "20px", display: "inline-block" }}>返回首页</Link>
        </div>
        <BackToTop /><ThemeToggle />
      </div>
    )
  }

  return (
    <div className="detail-page">
      <Navbar />
      <div className="detail-project-header">
        <div className="container">
          <Link to="/" className="detail-back-link">← 返回全部作品</Link>
          <div className="detail-tags">
            {(project.tags || []).map((t) => <span key={t} className="detail-tag">{t}</span>)}
          </div>
          <h1 className="detail-title">{project.title}</h1>
          <p className="detail-subtitle">{project.subtitle}</p>
          <div className="detail-meta">
            <span>{project.year}</span>
            <span className="meta-dot">·</span>
            <span>{project.role}</span>
          </div>
        </div>
      </div>
      <div className={`detail-body container ${bodyInView ? "in-view" : ""}`} ref={bodyRef}>
        <div className="detail-overview">
          <h2>项目概述</h2>
          <p>{project.overview}</p>
        </div>
        {(project.sections || []).map((sec, i) => (
          <div key={i} className="detail-section">
            <h2>{sec.heading}</h2>
            <p>{sec.content}</p>
          </div>
        ))}
      </div>

      <div className="container">
        <div className="detail-pager">
          {prevId ? (
            <Link to={`/project/${prevId}`} className="dp-link dp-prev">
              <span className="dp-arrow">←</span>
              <span className="dp-body">
                <span className="dp-label">上一篇</span>
                <span className="dp-title">{prevTitle || ""}</span>
              </span>
            </Link>
          ) : (
            <div className="dp-link dp-disabled">
              <span className="dp-body"><span className="dp-label" style={{color:"var(--text-muted)"}}>已是第一篇</span></span>
            </div>
          )}
          {nextId ? (
            <Link to={`/project/${nextId}`} className="dp-link dp-next">
              <span className="dp-body" style={{textAlign:"right"}}>
                <span className="dp-label">下一篇</span>
                <span className="dp-title">{nextTitle || ""}</span>
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
