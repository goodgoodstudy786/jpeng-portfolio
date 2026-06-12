import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Projects from '../components/Projects'
import Strengths from '../components/Strengths'
import Inspiration from '../components/Inspiration'
import Contact from '../components/Contact'
import BackToTop from '../components/BackToTop'
import ThemeToggle from '../components/ThemeToggle'

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Projects />
      <Strengths />
      <Inspiration />
      <Contact />
      <ThemeToggle />
      <BackToTop />
    </main>
  )
}
