import "./Loading.css"

export default function Loading() {
  return (
    <div className="loading-page">
      <div className="loading-spinner">
        <div className="loading-dot" />
        <div className="loading-dot" />
        <div className="loading-dot" />
      </div>
    </div>
  )
}