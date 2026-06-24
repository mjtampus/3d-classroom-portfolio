'use client'

import { useState, useEffect } from 'react'
import { PORTFOLIO } from '../../data/portfolio'

type Project = typeof PORTFOLIO.projects[0]

const TOTAL_PROJECTS = PORTFOLIO.projects.length

export function ProjectDetailText({ project, index, direction, onClose, onSelect }: {
  project: Project
  index: number
  direction: number   // -1 from left · 0 fade · 1 from right
  onClose: () => void
  onSelect: (i: number) => void
}) {
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    const id = requestAnimationFrame(() => setEntered(true))
    return () => cancelAnimationFrame(id)
  }, [])

  const hasPrev = index > 0
  const hasNext = index < TOTAL_PROJECTS - 1
  const slideX  = direction > 0 ? '36px' : direction < 0 ? '-36px' : '0px'

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 20,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      pointerEvents: 'none',
    }}>
      <div style={{
        zoom: '2',
        pointerEvents: 'auto',
        width: 'min(400px, 100vw)',
        fontFamily: 'var(--font-geist-sans, system-ui, sans-serif)',
        color: 'white',
        textAlign: 'center',
        transform: entered
          ? 'translateX(0) translateY(0)'
          : `translateX(${slideX}) translateY(10px)`,
        opacity: entered ? 1 : 0,
        transition: 'transform 0.45s cubic-bezier(0.16,1,0.3,1), opacity 0.35s ease',
      }}>

        {/* Counter */}
        <div style={{ fontSize: '10px', letterSpacing: '5px', color: 'rgba(168,216,255,0.38)', marginBottom: '20px' }}>
          {String(index + 1).padStart(2, '0')} / {String(TOTAL_PROJECTS).padStart(2, '0')}
        </div>

        {/* Title */}
        <h3 style={{
          fontSize: '40px', fontWeight: 800, margin: '0 0 10px',
          letterSpacing: '-0.5px', lineHeight: 1.0,
          textShadow: '0 0 60px rgba(168,216,255,0.95), 0 0 120px rgba(168,216,255,0.5)',
        }}>
          {project.title}
        </h3>

        {/* Tech stack */}
        <div style={{
          fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase',
          color: 'rgba(168,216,255,0.45)', marginBottom: '22px',
        }}>
          {project.technologies.join(' · ')}
        </div>

        {/* Hairline */}
        <div style={{ width: '28px', height: '1px', background: 'rgba(168,216,255,0.22)', margin: '0 auto 22px' }} />

        {/* Description */}
        <p style={{ fontSize: '13px', lineHeight: 2.0, fontStyle: 'italic', color: 'rgba(255,255,255,0.42)', margin: '0 0 28px' }}>
          {project.description}
        </p>

        {/* Navigation + link */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px' }}>
          <button
            onClick={() => hasPrev && onSelect(index - 1)}
            disabled={!hasPrev}
            style={{ background: 'none', border: 'none', padding: '0', color: hasPrev ? 'rgba(168,216,255,0.6)' : 'rgba(255,255,255,0.08)', cursor: hasPrev ? 'pointer' : 'default', fontSize: '28px', lineHeight: '1', fontFamily: 'inherit', transition: 'color 0.15s, text-shadow 0.15s' }}
            onMouseEnter={e => { if (hasPrev) e.currentTarget.style.textShadow = '0 0 20px rgba(168,216,255,0.7)' }}
            onMouseLeave={e => { e.currentTarget.style.textShadow = 'none' }}
          >←</button>

          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'rgba(168,216,255,0.75)', textDecoration: 'none', fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', textShadow: '0 0 22px rgba(168,216,255,0.55)', borderBottom: '1px solid rgba(168,216,255,0.25)', paddingBottom: '3px', transition: 'color 0.15s, text-shadow 0.15s, border-color 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'rgba(168,216,255,1)'; e.currentTarget.style.textShadow = '0 0 30px rgba(168,216,255,0.9)'; e.currentTarget.style.borderColor = 'rgba(168,216,255,0.6)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(168,216,255,0.75)'; e.currentTarget.style.textShadow = '0 0 22px rgba(168,216,255,0.55)'; e.currentTarget.style.borderColor = 'rgba(168,216,255,0.25)' }}
          >
            View Site ↗
          </a>

          <button
            onClick={() => hasNext && onSelect(index + 1)}
            disabled={!hasNext}
            style={{ background: 'none', border: 'none', padding: '0', color: hasNext ? 'rgba(168,216,255,0.6)' : 'rgba(255,255,255,0.08)', cursor: hasNext ? 'pointer' : 'default', fontSize: '28px', lineHeight: '1', fontFamily: 'inherit', transition: 'color 0.15s, text-shadow 0.15s' }}
            onMouseEnter={e => { if (hasNext) e.currentTarget.style.textShadow = '0 0 20px rgba(168,216,255,0.7)' }}
            onMouseLeave={e => { e.currentTarget.style.textShadow = 'none' }}
          >→</button>
        </div>

        {/* Back */}
        <button
          onClick={onClose}
          style={{ marginTop: '22px', display: 'block', width: '100%', padding: '6px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.15)', cursor: 'pointer', fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', fontFamily: 'inherit', transition: 'color 0.15s' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.15)')}
        >
          esc · back
        </button>

      </div>
    </div>
  )
}
