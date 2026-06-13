import React from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import App from "./App"
import "./index.css"

window.onerror = function(msg, url, line, col, err) {
  const el = document.getElementById("root")
  if (el) el.innerHTML = "<div style='color:#C0FE27;padding:40px;font-family:Sora,sans-serif'>Error: " + msg + "</div>"
}

try {
  const root = createRoot(document.getElementById("root"))
  root.render(
    React.createElement(BrowserRouter, null,
      React.createElement(App, null)
    )
  )
} catch(e) {
  document.getElementById("root").innerHTML = "<div style='color:#C0FE27;padding:40px;font-family:Sora,sans-serif'>Render Error: " + e.message + "</div>"
}