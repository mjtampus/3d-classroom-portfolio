'use client'

import { useEffect } from 'react'
import { PORTFOLIO } from './ClassroomCanvas'

// ── Shared styles ─────────────────────────────────────────────────────────

const CARD: React.CSSProperties = {
  background: 'rgba(4, 4, 18, 0.72)',
  backdropFilter: 'blur(22px)',
  WebkitBackdropFilter: 'blur(22px)',
  border: '1px solid rgba(168,216,255,0.2)',
  borderRadius: '20px',
  boxShadow: '0 20px 56px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.06)',
  fontFamily: 'var(--font-geist-sans, system-ui, sans-serif)',
  color: 'white',
  width: 'min(420px, 92vw)',
}
const LBL: React.CSSProperties = {
  fontSize: '10px', letterSpacing: '4px', textTransform: 'uppercase',
  color: '#a8d8ff', opacity: 0.65, marginBottom: '10px',
}
const TTL: React.CSSProperties = {
  fontSize: '26px', fontWeight: 700, lineHeight: 1.15,
  margin: '0 0 4px', letterSpacing: '-0.3px',
}
const SUB: React.CSSProperties = {
  fontSize: '14px', fontWeight: 500, color: '#a8d8ff',
  margin: '0 0 16px', opacity: 0.9,
}
const BODY: React.CSSProperties = {
  fontSize: '13px', lineHeight: 1.8, color: 'rgba(255,255,255,0.7)', margin: 0,
}
const HR: React.CSSProperties = {
  border: 'none', borderTop: '1px solid rgba(168,216,255,0.1)', margin: '14px 0',
}

// ── Section cards ─────────────────────────────────────────────────────────

function HeroCard() {
  return (
    <div style={{ ...CARD, padding: '32px 38px' }}>
      <div style={LBL}>Portfolio · 2025</div>
      <h1 style={{ ...TTL, fontSize: '30px' }}>Hello, I'm Michael.</h1>
      <h2 style={{ ...SUB, fontSize: '15px' }}>{PORTFOLIO.role}</h2>
      <p style={BODY}>{PORTFOLIO.about}</p>
    </div>
  )
}

function AboutCard() {
  return (
    <div style={{ ...CARD, padding: '28px 34px' }}>
      <div style={LBL}>About — Lesson 01</div>
      <h2 style={TTL}>Experience</h2>
      {PORTFOLIO.experience.map((job, i) => (
        <div key={i}>
          <hr style={{ ...HR, marginTop: i === 0 ? '14px' : 0 }} />
          <div style={{ fontSize: '13.5px', fontWeight: 600 }}>{job.position}</div>
          <div style={{ fontSize: '12px', color: '#a8d8ff', marginBottom: '8px' }}>
            {job.company} · {job.period}
          </div>
          <ul style={{ margin: 0, paddingLeft: '16px', ...BODY }}>
            {job.highlights.map((h, j) => <li key={j}>{h}</li>)}
          </ul>
        </div>
      ))}
      <hr style={HR} />
      <div style={LBL}>Education</div>
      <div style={{ ...BODY, fontSize: '12px' }}>Cordova Public College — College Degree</div>
    </div>
  )
}

function SkillsCard() {
  return (
    <div style={{ ...CARD, padding: '28px 34px' }}>
      <div style={LBL}>Skills — Lesson 02</div>
      <h2 style={{ ...TTL, marginBottom: '16px' }}>My Stack</h2>
      {Object.entries(PORTFOLIO.skills).map(([cat, tools]) => (
        <div key={cat} style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: '#a8d8ff', opacity: 0.6, marginBottom: '5px' }}>
            {cat}
          </div>
          <div style={{ fontSize: '12.5px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.6 }}>
            {tools}
          </div>
        </div>
      ))}
      <hr style={HR} />
      <div style={LBL}>Certifications</div>
      {PORTFOLIO.certifications.map((c, i) => (
        <div key={i} style={{ ...BODY, fontSize: '12px', marginBottom: '3px' }}>· {c}</div>
      ))}
    </div>
  )
}

function ProjectsCard({ onSelect, dimmed, isActive }: {
  onSelect: (i: number) => void
  dimmed: boolean
  isActive: boolean
}) {
  return (
    <div style={{
      ...CARD, padding: '28px 34px',
      opacity: dimmed ? 0 : 1,
      pointerEvents: dimmed ? 'none' : 'auto',
      transition: 'opacity 0.2s ease',
    }}>
      <div style={LBL}>Projects — Lesson 03</div>
      <h2 style={{ ...TTL, marginBottom: '4px' }}>Featured Work</h2>
      <p style={{ ...BODY, fontSize: '12px', marginBottom: '16px', opacity: 0.6 }}>
        Click a project — it floats in the classroom
      </p>
      {PORTFOLIO.projects.map((p, i) => (
        <button
          key={i}
          disabled={!isActive}
          onClick={() => isActive && onSelect(i)}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            width: '100%', padding: '10px 12px', marginBottom: '6px',
            background: 'rgba(168,216,255,0.05)',
            border: '1px solid rgba(168,216,255,0.1)',
            borderRadius: '10px', color: 'white',
            cursor: isActive ? 'pointer' : 'default', textAlign: 'left',
            fontFamily: 'inherit', transition: 'background 0.15s, border-color 0.15s',
          }}
          onMouseEnter={e => {
            if (!isActive) return
            e.currentTarget.style.background = 'rgba(168,216,255,0.13)'
            e.currentTarget.style.borderColor = 'rgba(168,216,255,0.25)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(168,216,255,0.05)'
            e.currentTarget.style.borderColor = 'rgba(168,216,255,0.1)'
          }}
        >
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600 }}>{p.title}</div>
            <div style={{ fontSize: '11px', color: '#a8d8ff', opacity: 0.75, marginTop: '2px' }}>{p.tech}</div>
          </div>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ opacity: 0.45, flexShrink: 0, marginLeft: '8px' }}>
            <path d="M6 3l5 5-5 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      ))}
    </div>
  )
}

function ContactCard() {
  return (
    <div style={{ ...CARD, padding: '32px 38px' }}>
      <div style={LBL}>Contact — Class Dismissed</div>
      <h2 style={{ ...TTL, marginBottom: '6px' }}>Let's Build Together</h2>
      <p style={{ ...BODY, marginBottom: '22px' }}>
        Open for freelance &amp; full-time roles. Let's create something impactful.
      </p>
      <a
        href={`mailto:${PORTFOLIO.contact.email}`}
        style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '13px 16px', marginBottom: '10px',
          background: 'rgba(168,216,255,0.08)',
          border: '1px solid rgba(168,216,255,0.2)',
          borderRadius: '12px', textDecoration: 'none', color: 'white', fontSize: '13px',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(168,216,255,0.16)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'rgba(168,216,255,0.08)')}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <rect x="2" y="4" width="20" height="16" rx="2" stroke="#a8d8ff" strokeWidth="1.5"/>
          <path d="M2 8l10 6 10-6" stroke="#a8d8ff" strokeWidth="1.5"/>
        </svg>
        {PORTFOLIO.contact.email}
      </a>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '13px 16px',
        background: 'rgba(168,216,255,0.08)',
        border: '1px solid rgba(168,216,255,0.2)',
        borderRadius: '12px', fontSize: '13px',
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M6.6 10.8a15.4 15.4 0 006.6 6.6l2.2-2.2a1 1 0 011.1-.2 11.5 11.5 0 003.6 1.1 1 1 0 011 1V21a1 1 0 01-1 1A17 17 0 013 5a1 1 0 011-1h3.5a1 1 0 011 1 11.5 11.5 0 001.1 3.6 1 1 0 01-.2 1.1L6.6 10.8z" stroke="#a8d8ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        {PORTFOLIO.contact.phone}
      </div>
    </div>
  )
}

// ── Mobile project detail overlay ─────────────────────────────────────────

const TOTAL = PORTFOLIO.projects.length

function MobileProjectDetail({ index, onClose, onSelect }: {
  index: number
  onClose: () => void
  onSelect: (i: number) => void
}) {
  const project = PORTFOLIO.projects[index]
  const hasPrev = index > 0
  const hasNext = index < TOTAL - 1

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const navBtn = (active: boolean): React.CSSProperties => ({
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: '48px', height: '48px', flexShrink: 0,
    background: active ? 'rgba(168,216,255,0.12)' : 'rgba(255,255,255,0.04)',
    border: `1px solid ${active ? 'rgba(168,216,255,0.3)' : 'rgba(255,255,255,0.08)'}`,
    borderRadius: '12px', color: active ? 'white' : 'rgba(255,255,255,0.2)',
    cursor: active ? 'pointer' : 'default', fontFamily: 'inherit',
  })

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, zIndex: 30,
        background: 'rgba(0,0,0,0.65)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        animation: 'fadeBg 0.2s ease forwards',
      }} />

      {/* Flexbox centering wrapper — avoids transform conflict with animation */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 31,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        pointerEvents: 'none',
      }}>
      {/* Card */}
      <div style={{
        pointerEvents: 'auto',
        width: 'min(400px, 94vw)',
        maxHeight: '88vh', overflowY: 'auto',
        background: 'rgba(4,4,18,0.92)',
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        border: '1px solid rgba(168,216,255,0.22)',
        borderRadius: '22px',
        boxShadow: '0 28px 72px rgba(0,0,0,0.8)',
        fontFamily: 'var(--font-geist-sans, system-ui, sans-serif)',
        color: 'white',
        animation: 'mobileDetailIn 0.28s cubic-bezier(0.16,1,0.3,1) forwards',
      }}>
        {/* Media */}
        {project.image ? (
          <div style={{ width: '100%', height: 'min(200px, 50vw)', overflow: 'hidden', borderRadius: '22px 22px 0 0', background: 'rgba(168,216,255,0.04)' }}>
            <img src={project.image} alt={project.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={e => { (e.target as HTMLImageElement).parentElement!.style.display = 'none' }}
            />
          </div>
        ) : project.video ? (
          <div style={{ width: '100%', height: 'min(210px, 52vw)', borderRadius: '22px 22px 0 0', overflow: 'hidden', background: '#000' }}>
            <iframe src={project.video} title={project.title}
              style={{ width: '100%', height: '100%', border: 'none' }} allowFullScreen />
          </div>
        ) : (
          <div style={{ height: '100px', borderRadius: '22px 22px 0 0', background: 'rgba(168,216,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '10px', letterSpacing: '3px' }}>NO PREVIEW</span>
          </div>
        )}

        <div style={{ padding: '22px 24px 28px' }}>
          {/* Counter */}
          <div style={{ fontSize: '10px', letterSpacing: '3px', color: '#a8d8ff', opacity: 0.5, marginBottom: '6px' }}>
            {String(index + 1).padStart(2, '0')} / {String(TOTAL).padStart(2, '0')}
          </div>

          <h3 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 8px', letterSpacing: '-0.2px' }}>
            {project.title}
          </h3>
          <p style={{ fontSize: '13px', lineHeight: 1.75, color: 'rgba(255,255,255,0.65)', margin: '0 0 14px' }}>
            {project.description}
          </p>

          {/* Tech tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '20px' }}>
            {project.technologies.map(t => (
              <span key={t} style={{
                fontSize: '11px', padding: '4px 10px',
                background: 'rgba(168,216,255,0.09)',
                border: '1px solid rgba(168,216,255,0.2)',
                borderRadius: '99px', color: '#a8d8ff',
              }}>{t}</span>
            ))}
          </div>

          {/* Actions row */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button onClick={() => hasPrev && onSelect(index - 1)} disabled={!hasPrev} style={navBtn(hasPrev)}>
              <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
                <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            <a href={project.link} target="_blank" rel="noopener noreferrer"
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                padding: '14px', background: 'rgba(168,216,255,0.14)',
                border: '1px solid rgba(168,216,255,0.35)', borderRadius: '12px',
                color: 'white', textDecoration: 'none', fontSize: '14px', fontWeight: 600,
              }}
            >
              View Site
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                <path d="M2 12L12 2M12 2H5M12 2V9" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>

            <button onClick={() => hasNext && onSelect(index + 1)} disabled={!hasNext} style={navBtn(hasNext)}>
              <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
                <path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* Back */}
          <button onClick={onClose} style={{
            marginTop: '12px', width: '100%', padding: '10px',
            background: 'transparent', border: 'none',
            color: 'rgba(255,255,255,0.3)', cursor: 'pointer',
            fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase',
            fontFamily: 'inherit',
          }}>
            ← back to list
          </button>
        </div>
      </div>
      </div>
    </>
  )
}

// ── Card layout config ─────────────────────────────────────────────────────

const POSITIONS_DESKTOP = [
  { left: '5vw',  right: 'auto' },
  { left: 'auto', right: '5vw'  },
  { left: '5vw',  right: 'auto' },
  { left: 'auto', right: '5vw'  },
  { left: '5vw',  right: 'auto' },
]

// ── Export ─────────────────────────────────────────────────────────────────

export default function SectionCards({ activeSection, selectedProject, onSelectProject, onCloseProject, isMobile }: {
  activeSection: number
  selectedProject: number | null
  onSelectProject: (i: number) => void
  onCloseProject: () => void
  isMobile: boolean
}) {
  const cards = [
    <HeroCard key={0} />,
    <AboutCard key={1} />,
    <SkillsCard key={2} />,
    <ProjectsCard key={3} onSelect={onSelectProject} dimmed={selectedProject !== null} isActive={activeSection === 3} />,
    <ContactCard key={4} />,
  ]

  return (
    <>
      {/* Mobile project detail — rendered as DOM overlay so buttons are tappable */}
      {isMobile && selectedProject !== null && (
        <MobileProjectDetail
          index={selectedProject}
          onClose={onCloseProject}
          onSelect={onSelectProject}
        />
      )}

      {cards.map((card, i) => {
        const isActive = activeSection === i
        const pos = POSITIONS_DESKTOP[i]

        const mobileStyle: React.CSSProperties = {
          position: 'fixed',
          left: '50%',
          right: 'auto',
          top: isMobile ? '54%' : '50%',
          transform: isActive
            ? 'translate(-50%, -50%) scale(1)'
            : 'translate(-50%, calc(-50% + 18px)) scale(0.97)',
        }

        const desktopStyle: React.CSSProperties = {
          position: 'fixed',
          left: pos.left,
          right: pos.right,
          top: '50%',
          transform: isActive
            ? 'translateY(-50%) scale(1)'
            : 'translateY(calc(-50% + 18px)) scale(0.97)',
        }

        return (
          <div
            key={i}
            style={{
              ...(isMobile ? mobileStyle : desktopStyle),
              zIndex: 5,
              opacity: isActive ? 1 : 0,
              pointerEvents: isActive ? 'auto' : 'none',
              transition: 'opacity 0.1s ease, transform 0.25s cubic-bezier(0.16,1,0.3,1)',
              maxHeight: isMobile ? '80vh' : 'none',
              overflowY: isMobile ? 'auto' : 'visible',
            }}
          >
            {card}
          </div>
        )
      })}
    </>
  )
}
