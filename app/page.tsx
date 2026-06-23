'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect, useCallback } from 'react'
import { SECTIONS } from './components/ClassroomCanvas'
import SectionCards from './components/SectionCards'

const ClassroomCanvas = dynamic(() => import('./components/ClassroomCanvas'), { ssr: false })

const SECTION_COUNT = SECTIONS.length

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  return isMobile
}

// ── Loading screen ─────────────────────────────────────────────────────────

function LoadingScreen({ visible }: { visible: boolean }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: '#0b0b18',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: '32px',
      opacity: visible ? 1 : 0,
      pointerEvents: visible ? 'auto' : 'none',
      transition: 'opacity 0.8s ease',
    }}>
      {/* Classroom desk icon */}
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none" style={{ opacity: 0.6 }}>
        <rect x="8" y="32" width="40" height="4" rx="2" fill="#a8d8ff"/>
        <rect x="12" y="36" width="4" height="12" rx="2" fill="#a8d8ff"/>
        <rect x="40" y="36" width="4" height="12" rx="2" fill="#a8d8ff"/>
        <rect x="14" y="18" width="28" height="18" rx="3" fill="rgba(168,216,255,0.15)" stroke="#a8d8ff" strokeWidth="1.5"/>
        <line x1="20" y1="24" x2="36" y2="24" stroke="#a8d8ff" strokeWidth="1.2" strokeLinecap="round"/>
        <line x1="20" y1="28" x2="30" y2="28" stroke="#a8d8ff" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>

      {/* Label */}
      <div style={{
        fontFamily: 'var(--font-geist-sans, system-ui, sans-serif)',
        fontSize: '11px', letterSpacing: '5px', textTransform: 'uppercase',
        color: 'rgba(168,216,255,0.7)',
      }}>
        Entering Classroom
      </div>

      {/* Animated dots bar */}
      <div style={{ display: 'flex', gap: '8px' }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: '6px', height: '6px', borderRadius: '50%',
            background: '#a8d8ff',
            animation: `loadDot 1.4s ease-in-out ${i * 0.2}s infinite`,
          }} />
        ))}
      </div>
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function Home() {
  const [scrollProgress,  setScrollProgress]  = useState(0)
  const [activeSection,   setActiveSection]    = useState(0)
  const [selectedProject, setSelectedProject]  = useState<number | null>(null)
  const [loaded,          setLoaded]           = useState(false)
  const [showLoader,      setShowLoader]        = useState(true)
  const isMobile = useIsMobile()

  const onScroll = useCallback(() => {
    const el  = document.documentElement
    const max = el.scrollHeight - el.clientHeight
    if (max <= 0) return
    const p = Math.min(1, Math.max(0, el.scrollTop / max))
    setScrollProgress(p)
    setActiveSection(Math.round(p * (SECTION_COUNT - 1)))
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [onScroll])

  useEffect(() => {
    if (activeSection !== 3) setSelectedProject(null)
  }, [activeSection])

  // Start fade-out, then unmount loader after transition
  const handleLoaded = useCallback(() => {
    setLoaded(true)
    setTimeout(() => setShowLoader(false), 900)
  }, [])

  const scrollToSection = (i: number) => {
    const max = document.documentElement.scrollHeight - window.innerHeight
    window.scrollTo({ top: (i / (SECTION_COUNT - 1)) * max, behavior: 'smooth' })
  }

  return (
    <main style={{ background: '#0d0d1a' }}>
      {showLoader && <LoadingScreen visible={!loaded} />}

      <ClassroomCanvas
        scrollProgress={scrollProgress}
        activeSection={activeSection}
        selectedProject={selectedProject}
        onCloseProject={() => setSelectedProject(null)}
        onSelectProject={setSelectedProject}
        isMobile={isMobile}
        onLoaded={handleLoaded}
      />

      <SectionCards
        activeSection={activeSection}
        selectedProject={selectedProject}
        onSelectProject={setSelectedProject}
        onCloseProject={() => setSelectedProject(null)}
        isMobile={isMobile}
      />

      {SECTIONS.map((_, i) => (
        <div key={i} aria-hidden style={{
          height: '100vh', scrollSnapAlign: 'start',
          position: 'relative', zIndex: 1, pointerEvents: 'none',
        }} />
      ))}

      {/* Top-left counter */}
      <div style={{
        position: 'fixed', top: isMobile ? 20 : 32, left: isMobile ? 16 : 40, zIndex: 10,
        color: 'rgba(255,255,255,0.4)', fontSize: isMobile ? '10px' : '11px',
        letterSpacing: '3px', textTransform: 'uppercase',
        fontFamily: 'var(--font-geist-sans, system-ui, sans-serif)',
      }}>
        {String(activeSection + 1).padStart(2, '0')}&nbsp;/&nbsp;{String(SECTION_COUNT).padStart(2, '0')}
      </div>

      {/* Section label top-right */}
      <div style={{
        position: 'fixed', top: isMobile ? 20 : 32,
        right: isMobile ? 44 : 64, zIndex: 10,
        color: 'rgba(168,216,255,0.6)', fontSize: isMobile ? '10px' : '11px',
        letterSpacing: '3px', textTransform: 'uppercase',
        fontFamily: 'var(--font-geist-sans, system-ui, sans-serif)',
      }}>
        {SECTIONS[activeSection].label}
      </div>

      {/* Dot navigation */}
      <nav aria-label="Section navigation" style={{
        position: 'fixed',
        right: isMobile ? 14 : 28,
        top: '50%', transform: 'translateY(-50%)',
        zIndex: 10, display: 'flex', flexDirection: 'column',
        gap: isMobile ? '10px' : '14px', alignItems: 'center',
      }}>
        {SECTIONS.map((s, i) => (
          <button key={i} onClick={() => scrollToSection(i)}
            aria-label={`Go to ${s.label}`} title={s.label}
            style={{
              width:  activeSection === i ? (isMobile ? '7px' : '9px') : (isMobile ? '4px' : '5px'),
              height: activeSection === i ? (isMobile ? '7px' : '9px') : (isMobile ? '4px' : '5px'),
              borderRadius: '50%',
              background: activeSection === i ? '#a8d8ff' : 'rgba(255,255,255,0.3)',
              border: 'none', cursor: 'pointer', padding: 0, outline: 'none',
              transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
            }}
          />
        ))}
      </nav>

      {/* Progress bar */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, height: '2px',
        width: `${scrollProgress * 100}%`,
        background: 'linear-gradient(90deg, #a8d8ff, #80c8ff)',
        zIndex: 10, transition: 'width 0.15s linear',
        boxShadow: '0 0 8px rgba(168,216,255,0.5)',
      }} />

      {/* Scroll hint */}
      {activeSection === 0 && loaded && (
        <div style={{
          position: 'fixed', bottom: isMobile ? 28 : 40, left: '50%', transform: 'translateX(-50%)',
          zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
          color: 'rgba(255,255,255,0.35)', fontSize: '10px',
          letterSpacing: '4px', textTransform: 'uppercase',
          fontFamily: 'var(--font-geist-sans, system-ui, sans-serif)',
          animation: 'scrollBounce 2.2s ease-in-out infinite', pointerEvents: 'none',
        }}>
          <span>Scroll</span>
          <svg width="14" height="22" viewBox="0 0 14 22" fill="none">
            <rect x="0.75" y="0.75" width="12.5" height="20.5" rx="6.25" stroke="currentColor" strokeWidth="1.5"/>
            <circle cx="7" cy="5.5" r="2" fill="currentColor" style={{ animation: 'dotDrop 2.2s ease-in-out infinite' }}/>
          </svg>
        </div>
      )}
    </main>
  )
}
