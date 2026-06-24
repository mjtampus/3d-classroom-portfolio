'use client'

import { useState, useEffect } from 'react'
import { Float, Html } from '@react-three/drei'
import { PORTFOLIO } from '../../data/portfolio'
import { CAROUSEL_CENTER } from './constants'

const projects = PORTFOLIO.projects
const n = projects.length

function slotPixelX(off: number): number {
  if (off <= -3) return -90
  if (off <= -2) return -90 + 120 * (off + 3)
  if (off <= -1) return  30 + 100 * (off + 2)
  if (off <=  0) return 130 + 190 * (off + 1)
  if (off <=  1) return 320 + 190 *  off
  if (off <=  2) return 510 + 100 * (off - 1)
  return                 610 + 120 * (off - 2)
}

function slotOpacity(abs: number): number {
  if (abs >= 2.5) return 0
  if (abs >= 2)   return 0.16
  if (abs >= 1)   return 0.42
  return 1
}

function navBtnStyle(enabled: boolean): React.CSSProperties {
  return {
    width: '40px', height: '40px', flexShrink: 0,
    background: 'transparent',
    border: `1px solid ${enabled ? 'rgba(168,216,255,0.38)' : 'rgba(255,255,255,0.08)'}`,
    borderRadius: '10px',
    color: enabled ? '#a8d8ff' : 'rgba(255,255,255,0.12)',
    cursor: enabled ? 'pointer' : 'default',
    fontSize: '22px', lineHeight: '1',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: 'inherit',
    transition: 'background 0.15s, box-shadow 0.15s',
  }
}

export function ProjectCarousel({ onSelect }: { onSelect: (i: number) => void }) {
  const [active, setActive] = useState(2)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft')  setActive(a => Math.max(0, a - 1))
      if (e.key === 'ArrowRight') setActive(a => Math.min(n - 1, a + 1))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const canPrev = active > 0
  const canNext = active < n - 1

  return (
    <Float speed={0.5} floatIntensity={0.12} rotationIntensity={0} floatingRange={[-0.05, 0.05]}>
      <Html
        position={CAROUSEL_CENTER}
        center
        zIndexRange={[100, 0]}
        style={{ pointerEvents: 'auto' }}
        scale={0.1}
        transform
      >
        <div style={{
          width: '640px',
          fontFamily: 'var(--font-geist-sans, system-ui, sans-serif)',
          color: 'white',
          textAlign: 'center',
          userSelect: 'none',
        }}>

          {/* Sliding title track */}
          <div style={{ position: 'relative', width: '640px', height: '90px', overflow: 'hidden' }}>
            {projects.map((p, i) => {
              const off = i - active
              if (Math.abs(off) > 3) return null
              const abs = Math.abs(off)
              const isCenter = off === 0
              return (
                <div
                  key={i}
                  onClick={() => { if (!isCenter && abs <= 2) setActive(i) }}
                  style={{
                    position: 'absolute',
                    left: `${slotPixelX(off)}px`,
                    top: '50%',
                    transform: 'translate(-50%, -50%) translateZ(0)',
                    width: isCenter ? '220px' : abs === 1 ? '130px' : '70px',
                    opacity: slotOpacity(abs),
                    textAlign: 'center',
                    overflow: 'hidden',
                    cursor: !isCenter && abs <= 2 ? 'pointer' : 'default',
                    pointerEvents: abs > 2 ? 'none' : 'auto',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    gap: '4px',
                    willChange: 'left, opacity',
                    transition: 'left 0.45s cubic-bezier(0.16,1,0.3,1), opacity 0.45s ease',
                  }}
                >
                  {isCenter && (
                    <div style={{ fontSize: '10px', letterSpacing: '4px', color: '#a8d8ff', opacity: 0.5 }}>
                      {String(active + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}
                    </div>
                  )}
                  <div style={{
                    fontSize: isCenter ? '28px' : abs === 1 ? '15px' : '12px',
                    fontWeight: isCenter ? 800 : 600,
                    letterSpacing: isCenter ? '-0.3px' : '0',
                    lineHeight: 1.2,
                    textShadow: isCenter
                      ? '0 0 40px rgba(168,216,255,0.8), 0 0 80px rgba(168,216,255,0.4)'
                      : 'none',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    maxWidth: '100%',
                  }}>
                    {p.title}
                  </div>
                  {isCenter && (
                    <div style={{ fontSize: '11px', color: '#a8d8ff', opacity: 0.62, letterSpacing: '0.5px' }}>
                      {p.tech}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Divider */}
          <div style={{ width: '36px', height: '1px', background: 'rgba(168,216,255,0.35)', margin: '16px auto 14px' }} />

          {/* Dot indicators */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginBottom: '16px' }}>
            {Array.from({ length: n }, (_, i) => (
              <div key={i} onClick={() => setActive(i)} style={{
                width: i === active ? '20px' : '6px',
                height: '6px',
                borderRadius: '99px',
                background: i === active ? '#a8d8ff' : 'rgba(168,216,255,0.22)',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
              }} />
            ))}
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center' }}>
            <button
              onClick={() => canPrev && setActive(a => a - 1)}
              style={navBtnStyle(canPrev)}
              onMouseEnter={e => { if (canPrev) { e.currentTarget.style.background = 'rgba(168,216,255,0.1)'; e.currentTarget.style.boxShadow = '0 0 16px rgba(168,216,255,0.18)' } }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.boxShadow = 'none' }}
            >‹</button>

            <button
              onClick={() => onSelect(active)}
              style={{
                padding: '10px 28px',
                background: 'transparent',
                border: '1px solid rgba(168,216,255,0.48)',
                borderRadius: '10px',
                color: '#a8d8ff',
                cursor: 'pointer',
                fontSize: '12px', fontWeight: 700, letterSpacing: '1px',
                textShadow: '0 0 16px rgba(168,216,255,0.6)',
                fontFamily: 'inherit',
                transition: 'background 0.15s, box-shadow 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(168,216,255,0.1)'; e.currentTarget.style.boxShadow = '0 0 24px rgba(168,216,255,0.2)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.boxShadow = 'none' }}
            >
              EXPLORE →
            </button>

            <button
              onClick={() => canNext && setActive(a => a + 1)}
              style={navBtnStyle(canNext)}
              onMouseEnter={e => { if (canNext) { e.currentTarget.style.background = 'rgba(168,216,255,0.1)'; e.currentTarget.style.boxShadow = '0 0 16px rgba(168,216,255,0.18)' } }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.boxShadow = 'none' }}
            >›</button>
          </div>

        </div>
      </Html>
    </Float>
  )
}
