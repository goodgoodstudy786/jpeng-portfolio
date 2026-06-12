import { useState, useEffect } from "react"
import "./ThemeToggle.css"

export default function ThemeToggle() {
  const [dark, setDark] = useState(true)

  useEffect(() => {
    const t = localStorage.getItem("jpeng-theme") || "dark"
    setDark(t !== "light")
  }, [])

  const toggle = () => {
    const next = !dark
    setDark(next)
    const theme = next ? "dark" : "light"
    document.documentElement.setAttribute("data-theme", theme)
    localStorage.setItem("jpeng-theme", theme)
  }

  return (
    <button className="theme-toggle" onClick={toggle} aria-label="切换亮暗模式">
      {dark ? "☀" : "☾"}
    </button>
  )
}
