import { useState, useEffect, useMemo } from "react"
import useInView from "../hooks/useInView"
import { fetchAllData } from "../api"
import "./Strengths.css"

const TAG_OFFSETS = [
  { x: 0, y: -2, rot: -6 },
  { x: -55, y: 6, rot: 14 },
  { x: -115, y: -8, rot: -4 },
  { x: -35, y: 24, rot: 9 },
]

function getRandomRotation() {
  return (Math.random() - 0.5) * 6
}

export default function Strengths() {
  const [hovered, setHovered] = useState(null)
  const [sectionRef, inView] = useInView()
  const [strengths, setStrengths] = useState([])

  useEffect(() => {
    fetchAllData().then((d) => {
      if (d.strengths) setStrengths(d.strengths)
    }).catch(() => {})
  }, [])

  const rotations = useMemo(() => {
    return strengths.map(() => getRandomRotation())
  }, [strengths])

  return (
    <section className={`strengths-section ${inView ? "in-view" : ""}`} id="strengths" ref={sectionRef}>
      <div className="container">
        <div className="strengths-header">
          <div className="section-label">Expertise</div>
          <h2 className="section-title">
            <span className="title-en">Capabilities</span>
            <span className="title-cn">个人优势</span>
          </h2>
        </div>
        <div className="strengths-grid">
          {strengths.map((s, i) => {
            const rot = rotations[i] || 0
            const isHovered = hovered === i
            return (
              <div
                key={s.id || i}
                className={`strength-card ${isHovered ? "hovered" : ""}`}
                style={{
                  transform: isHovered ? "rotate(0deg) scale(1.03)" : `rotate(${rot}deg)`,
                  zIndex: isHovered ? 10 : 1,
                  animationDelay: `${i * 0.12}s`,
                }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                <div className="sc-inner">
                  <span className="sc-num">{s.num}</span>
                  <h3 className="sc-title">{s.title}</h3>
                  <span className="sc-cn">{s.titleCN}</span>
                  <p className="sc-desc">{s.desc}</p>
                  <div className="sc-tags-pile">
                    {(s.tags || []).map((tag, j) => {
                      const o = TAG_OFFSETS[j] || { x: -j * 55, y: j * 8, rot: (j - 1.5) * 8 }
                      return (
                        <span
                          key={tag}
                          className={`sc-tag ${isHovered ? "fall" : ""}`}
                          style={{
                            "--offset-x": `${o.x}px`,
                            "--offset-y": `${o.y}px`,
                            "--rot": `${o.rot}deg`,
                            "--fall-delay": `${j * 0.1}s`,
                            zIndex: isHovered ? 10 - j : 1 + j,
                          }}
                        >
                          {tag}
                        </span>
                      )
                    })}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
