import { Routes, Route } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import ProjectDetail from './pages/ProjectDetail'
import InspirationDetail from './pages/InspirationDetail'
import InspirationList from './pages/InspirationList'

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/project/:id" element={<ProjectDetail />} />
        <Route path="/inspiration/:id" element={<InspirationDetail />} />
        <Route path="/inspirations" element={<InspirationList />} />
      </Routes>
    </>
  )
}
