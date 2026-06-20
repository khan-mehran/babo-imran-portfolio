import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { LangProvider } from './context/LangContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import BottomNav from './components/BottomNav'
import BismillahBar from './components/BismillahBar'
import PWAInstallSheet from './components/PWAInstallSheet'
import Home from './pages/Home'
import Booklet from './pages/Booklet'
import Videos from './pages/Videos'
import Download from './pages/Download'

function ScrollTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <div key={location.pathname} className="page-content">
      <Routes location={location}>
        <Route path="/" element={<Home />} />
        <Route path="/booklet" element={<Booklet />} />
        <Route path="/videos" element={<Videos />} />
        <Route path="/download" element={<Download />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </div>
  )
}

export default function App() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js').catch(() => {})
    }
  }, [])

  return (
    <LangProvider>
      <BismillahBar />
      <Navbar />
      <ScrollTop />
      <AnimatedRoutes />
      <Footer />
      <BottomNav />
      <PWAInstallSheet />
    </LangProvider>
  )
}
