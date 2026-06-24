'use client'

import { useRef, Suspense, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, Html, Float, Environment, Text } from '@react-three/drei'
import * as THREE from 'three'
import { PCFShadowMap } from 'three'

// ── Portfolio data ─────────────────────────────────────────────────────────

export const PORTFOLIO = {
  name: 'Michael Tampus',
  role: 'Web Lead Developer',
  about:
    'Passionate Web Lead Developer with extensive experience building responsive, high-performance web applications. I specialize in React and Next.js with a strong background in team mentoring, SEO, and web performance optimization.',
  experience: [
    {
      position: 'Web Lead Developer',
      company: 'Agile Web Works',
      period: 'Current',
      highlights: [
        'Oversees website design, content strategy & SEO',
        'Leads cross-functional team on responsive frontends',
        'Focuses on performance, SEO & UX',
      ],
    },
    {
      position: 'Web Developer',
      company: 'Halcyon Digital Media Inc.',
      period: '2024 – 2025',
      highlights: [
        'Built high-performance SEO-optimized websites',
        'Mentored interns on CMS & agile practices',
        'Trained in leadership & agile development',
      ],
    },
  ],
  skills: {
    Frontend: 'Next.js · React · Vue.js · React Native · Ionic · Tailwind CSS · Bootstrap · HTML · CSS',
    Backend: 'Node.js · Express · Laravel · PHP PDO · MySQL · MongoDB',
    'Version Control': 'Git · GitHub · Bitbucket',
    Hosting: 'Vercel · Netlify · Render · Cloudflare · CleverCloud',
  },
  certifications: [
    'Programming (Java) NC III — TESDA, 240 hrs',
    'Creative Web Design — TESDA, 102 hrs',
    'Computer System Servicing NC II',
  ],
  projects: [
    {
      image: '/projects/clovr.webp',
      video: null,
      title: 'Clovr Life Spa',
      description: 'Wellness Reimagined — A Life Spa Redefined by Intention. A modern spa website focused on clean UI, performance, and SEO.',
      technologies: ['Next.js', 'Tailwind CSS'],
      tech: 'Next.js · Tailwind',
      link: 'https://www.clovrlifespa.com/',
    },
    {
      image: '/projects/wedding.webp',
      video: null,
      title: "Ej & Chenee's Wedding",
      description: 'A heartfelt wedding experience website celebrating love and togetherness. Guests can view details and feel the warmth of the occasion.',
      technologies: ['React', 'TypeScript', 'Tailwind CSS'],
      tech: 'React · TypeScript · Tailwind',
      link: 'https://ej-and-chenee.vercel.app/',
    },
    {
      image: '/projects/city-de-mare.webp',
      video: null,
      title: 'City De Mare',
      description: 'City de Mare transforms scattered efforts into focused progress — digital solutions that foster meaningful work, structured decision-making, and real impact.',
      technologies: ['Next.js', 'Tailwind CSS', 'CMS'],
      tech: 'Next.js · Tailwind · CMS',
      link: 'https://www.citydimare.com/',
    },
    {
      image: '/projects/discovery-suites.webp',
      video: null,
      title: 'Discovery Suites',
      description: 'Excellent for long stays, Discovery Suites Manila is located in Ortigas CBD near SM Megamall, Podium Mall, and Asian Development Bank.',
      technologies: ['Next.js', 'Tailwind CSS', 'CMS'],
      tech: 'Next.js · Tailwind · CMS',
      link: 'https://www.discoverysuites.com/',
    },
    {
      image: '/projects/island.webp',
      video: null,
      title: 'Island Property',
      description: "Vanuatu's leading Real Estate Marketplace, Agency and Property Developer — trading continuously since 1991 with extensive listings.",
      technologies: ['Next.js', 'Tailwind CSS', 'CMS'],
      tech: 'Next.js · Tailwind · CMS',
      link: 'https://www.islandproperty.com/',
    },
    {
      image: null,
      video: 'https://www.youtube.com/embed/5YDcLRVu80U?si=AuXxty5_AETNGSqT',
      title: 'MCMC App',
      description: 'MCM church website with post reading and expense tracking. I contributed to design and led both frontend and backend functionalities.',
      technologies: ['Vue.js', 'Tailwind CSS', 'Node.js', 'Express', 'MySQL'],
      tech: 'Vue.js · Node.js · MySQL',
      link: 'https://mcmc-church.netlify.app/',
    },
  ],
  contact: {
    email: 'michaeltampus1123@gmail.com',
    phone: '+63 924-058-7551',
  },
}

// ── Section config ─────────────────────────────────────────────────────────

export const SECTIONS = [
  { id: 0, chapter: 'HOME', label: 'Hello'    },
  { id: 1, chapter: 'ABOUT', label: 'About'    },
  { id: 2, chapter: 'SKILLS', label: 'Skills'   },
  { id: 3, chapter: 'PROJECTS', label: 'Projects' },
  { id: 4, chapter: 'CONTACT', label: 'Contact'  },
]

// ── Camera path (scroll-driven) ────────────────────────────────────────────

const CAM_POSITIONS = [
  new THREE.Vector3(0,    4.5, 15),
  new THREE.Vector3(-4,   3.2,  8),
  new THREE.Vector3(-0.5, 3.0,  3),
  new THREE.Vector3(0,  3.0,  3),
  new THREE.Vector3(0,    5.5, 11),
]
const CAM_TARGETS = [
  new THREE.Vector3(0, 1.5,  0),
  new THREE.Vector3(0, 2.0,  0),
  new THREE.Vector3(0, 2.0, -4),
  new THREE.Vector3(0, 3,  0),
  new THREE.Vector3(0, 1.5,  0),
]

// ── Per-project 3-D placements inside the classroom ───────────────────────
// Each entry: where the card floats (pos) + where the camera moves to (cam + look)

// ── 3-D carousel constants ─────────────────────────────────────────────────

// Section-3 camera is at [0.5, 3, 3] looking at [0, 2.8, 0].
// Look dir ≈ [-0.164, -0.066, -0.984]; right vector ≈ [0.986, 0, -0.164].
// Centre at ~2 units depth along look ray ≈ [0.2, 2.9, 1.0].
const CAROUSEL_CENTER: [number, number, number] = [0, 2.92, 2]


const PROJECT_PLACEMENTS = [
  { pos: [-2.5, 2.8, -4] as [number,number,number], cam: new THREE.Vector3(-2.5, 3.5, 15.5), look: new THREE.Vector3(-2.5, 2.6, -4) },   // front-left  (chalkboard)
  { pos: [ 2.5, 1.8, -4] as [number,number,number], cam: new THREE.Vector3( 1.5, 3.5, -0.5), look: new THREE.Vector3( 2.5, 2.6, -4) },   // front-right
  { pos: [-3.5, 2.8,  2] as [number,number,number], cam: new THREE.Vector3( 0,   3.5,  2.5), look: new THREE.Vector3(-4.5, 2.6,  0) },   // left wall
  { pos: [ 4.5, 1.8,  0] as [number,number,number], cam: new THREE.Vector3( 0,   3.5,  2.5), look: new THREE.Vector3( 4.5, 2.6,  0) },   // right wall
  { pos: [-2.0, 0.8,  3] as [number,number,number], cam: new THREE.Vector3( 1,   3.5,  9  ), look: new THREE.Vector3(-2.0, 2.6,  5) },   // back-left
  { pos: [ 0,   2.6,  7] as [number,number,number], cam: new THREE.Vector3( 0,   4.5, 12  ), look: new THREE.Vector3( 0,   3.2,  7) },   // back-center (MCMC video)
]

// ── Scene components ───────────────────────────────────────────────────────

function Classroom() {
  const { scene } = useGLTF('/models/anime_class_room.glb')
  return <primitive object={scene} />
}
useGLTF.preload('/models/anime_class_room.glb')

function CameraRig({ scrollProgress, selectedProject }: {
  scrollProgress: number
  selectedProject: number | null
}) {
  const { camera } = useThree()
  const tPos  = useRef(new THREE.Vector3())
  const tLook = useRef(new THREE.Vector3())
  const sLook = useRef(new THREE.Vector3(0, 1.5, 0))
  const total = CAM_POSITIONS.length - 1

  useFrame(() => {
    if (selectedProject !== null) {
      // Fly camera to face the selected project card
      const p = PROJECT_PLACEMENTS[selectedProject]
      tPos.current.copy(p.cam)
      tLook.current.copy(p.look)
    } else {
      // Scroll-driven path
      const raw = Math.min(scrollProgress * total, total - 0.001)
      const i   = Math.floor(raw)
      const t   = raw - i
      tPos.current.lerpVectors(CAM_POSITIONS[i], CAM_POSITIONS[i + 1], t)
      tLook.current.lerpVectors(CAM_TARGETS[i], CAM_TARGETS[i + 1], t)
    }

    camera.position.lerp(tPos.current, 0.055)
    sLook.current.lerp(tLook.current, 0.055)
    camera.lookAt(sLook.current)
  })

  return null
}

// Watermark chapter numbers
const CHAPTER_POS: [number, number, number][] = [
  [ 0, 5, 10], [-2, 3, 4], [2, 3, -5], [-3, 6.10, -5.9], [0, 5, 6],
]

function ChapterTag({ position, chapter, visible }: {
  position: [number, number, number]; chapter: string; visible: boolean
}) {
  const ref = useRef<THREE.Mesh>(null!)
  useFrame(({ clock }) => {
    if (ref.current)
      ref.current.position.y = position[1] + Math.sin(clock.elapsedTime * 0.8) * 0.1
  })
  return (
    <Text ref={ref} position={position} fontSize={2.2} color="#ffffff"
      anchorX="center" anchorY="middle" font={undefined}
      fillOpacity={visible ? 0.06 : 0}
      outlineColor="#a8d8ff" outlineOpacity={visible ? 0.45 : 0} outlineWidth={0.015}
    >
      {chapter}
    </Text>
  )
}

// Floating project detail — pure text in 3-D, no card background
type Project = typeof PORTFOLIO.projects[0]

const TOTAL_PROJECTS = PORTFOLIO.projects.length

function ProjectDetailText({ project, index, pos, onClose, onSelect }: {
  project: Project
  index: number
  pos: [number, number, number]
  onClose: () => void
  onSelect: (i: number) => void
}) {
  const hasPrev = index > 0
  const hasNext = index < TOTAL_PROJECTS - 1

  const navBtn = (active: boolean): React.CSSProperties => ({
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: '38px', height: '38px',
    background: 'transparent',
    border: `1px solid ${active ? 'rgba(168,216,255,0.45)' : 'rgba(255,255,255,0.1)'}`,
    borderRadius: '9px',
    color: active ? 'rgba(168,216,255,0.9)' : 'rgba(255,255,255,0.18)',
    cursor: active ? 'pointer' : 'default',
    flexShrink: 0, fontFamily: 'inherit',
    transition: 'background 0.15s, box-shadow 0.15s',
  })

  return (
    <Float speed={0.8} floatIntensity={0.18} rotationIntensity={0} floatingRange={[-0.06, 0.06]}>
      <Html
        position={pos}
        center
        zIndexRange={[200, 0]}
        style={{ pointerEvents: 'auto' }}
        wrapperClass="project-detail-wrapper"
      >
        <div style={{
          width: 'min(380px, 92vw)',
          fontFamily: 'var(--font-geist-sans, system-ui, sans-serif)',
          color: 'white',
          textAlign: 'center',
          animation: 'detailIn 0.35s cubic-bezier(0.16,1,0.3,1) forwards',
        }}>
          {/* Counter */}
          <div style={{
            fontSize: '10px', letterSpacing: '4px', color: '#a8d8ff',
            opacity: 0.5, marginBottom: '12px',
          }}>
            {String(index + 1).padStart(2, '0')} · {String(TOTAL_PROJECTS).padStart(2, '0')}
          </div>

          {/* Title — big glowing text */}
          <h3 style={{
            fontSize: '34px', fontWeight: 800, margin: '0 0 10px',
            letterSpacing: '-0.5px', lineHeight: 1.1,
            textShadow: '0 0 40px rgba(168,216,255,0.75), 0 0 80px rgba(168,216,255,0.35)',
          }}>
            {project.title}
          </h3>

          {/* Thin divider */}
          <div style={{
            width: '36px', height: '1px',
            background: 'rgba(168,216,255,0.45)',
            margin: '0 auto 16px',
          }} />

          {/* Description */}
          <p style={{
            fontSize: '13px', lineHeight: 1.85,
            color: 'rgba(255,255,255,0.62)',
            margin: '0 0 18px',
          }}>
            {project.description}
          </p>

          {/* Tech tags */}
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: '6px',
            justifyContent: 'center', marginBottom: '24px',
          }}>
            {project.technologies.map(t => (
              <span key={t} style={{
                fontSize: '10px', padding: '3px 11px',
                background: 'rgba(168,216,255,0.06)',
                border: '1px solid rgba(168,216,255,0.28)',
                borderRadius: '99px', color: '#a8d8ff',
                letterSpacing: '0.5px',
              }}>{t}</span>
            ))}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'center' }}>
            {/* Prev */}
            <button
              onClick={() => hasPrev && onSelect(index - 1)}
              disabled={!hasPrev}
              style={navBtn(hasPrev)}
              onMouseEnter={e => { if (hasPrev) { e.currentTarget.style.background = 'rgba(168,216,255,0.12)'; e.currentTarget.style.boxShadow = '0 0 18px rgba(168,216,255,0.2)' } }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.boxShadow = 'none' }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {/* View Site */}
            <a href={project.link} target="_blank" rel="noopener noreferrer"
              style={{
                flex: 1, display: 'inline-flex', alignItems: 'center',
                justifyContent: 'center', gap: '7px',
                padding: '11px 18px',
                background: 'transparent',
                border: '1px solid rgba(168,216,255,0.5)',
                borderRadius: '10px',
                color: '#a8d8ff', textDecoration: 'none',
                fontSize: '12px', fontWeight: 700, letterSpacing: '0.5px',
                textShadow: '0 0 18px rgba(168,216,255,0.7)',
                boxShadow: '0 0 22px rgba(168,216,255,0.1)',
                transition: 'background 0.15s, box-shadow 0.15s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(168,216,255,0.1)'
                e.currentTarget.style.boxShadow = '0 0 34px rgba(168,216,255,0.28)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.boxShadow = '0 0 22px rgba(168,216,255,0.1)'
              }}
            >
              View Site
              <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
                <path d="M2 12L12 2M12 2H5M12 2V9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>

            {/* Next */}
            <button
              onClick={() => hasNext && onSelect(index + 1)}
              disabled={!hasNext}
              style={navBtn(hasNext)}
              onMouseEnter={e => { if (hasNext) { e.currentTarget.style.background = 'rgba(168,216,255,0.12)'; e.currentTarget.style.boxShadow = '0 0 18px rgba(168,216,255,0.2)' } }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.boxShadow = 'none' }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* Back */}
          <button onClick={onClose}
            style={{
              marginTop: '14px', width: '100%', padding: '8px',
              background: 'transparent', border: 'none',
              color: 'rgba(255,255,255,0.22)', cursor: 'pointer',
              fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase',
              fontFamily: 'inherit', transition: 'color 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.22)')}
          >
            ← back to list
          </button>
        </div>
      </Html>
    </Float>
  )
}

// ── 3-D carousel ──────────────────────────────────────────────────────────────

function ProjectCarousel({ onSelect }: { onSelect: (i: number) => void }) {
  const [active, setActive] = useState(2)
  const n = PORTFOLIO.projects.length

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft')  setActive(a => Math.max(0, a - 1))
      if (e.key === 'ArrowRight') setActive(a => Math.min(n - 1, a + 1))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [n])

  const canPrev = active > 0
  const canNext = active < n - 1

  const navBtn = (enabled: boolean): React.CSSProperties => ({
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
  })

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

          {/* Sliding title track — each item is absolutely positioned; CSS handles the animation */}
          <div style={{ position: 'relative', width: '640px', height: '90px', overflow: 'hidden' }}>
            {PORTFOLIO.projects.map((p, i) => {
              const off = i - active
              if (Math.abs(off) > 3) return null
              const abs = Math.abs(off)
              // pixel x-center for each slot in a 640px track; ±3 slots are just off-screen
              const slotX = off <= -3 ? -90
                : off <= -2 ? -90 + 120 * (off + 3)
                : off <= -1 ? 30  + 100 * (off + 2)
                : off <=  0 ? 130 + 190 * (off + 1)
                : off <=  1 ? 320 + 190 *  off
                : off <=  2 ? 510 + 100 * (off - 1)
                :             610 + 120 * (off - 2)
              const opacity = abs >= 2.5 ? 0 : abs >= 2 ? 0.16 : abs >= 1 ? 0.42 : 1
              const isCenter = off === 0
              return (
                <div
                  key={i}
                  onClick={() => { if (!isCenter && abs <= 2) setActive(i) }}
                  style={{
                    position: 'absolute',
                    left: `${slotX}px`,
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: isCenter ? '220px' : abs === 1 ? '130px' : '70px',
                    opacity,
                    textAlign: 'center',
                    overflow: 'hidden',
                    cursor: !isCenter && abs <= 2 ? 'pointer' : 'default',
                    pointerEvents: abs > 2 ? 'none' : 'auto',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    gap: '4px',
                    transition: [
                      'left 0.45s cubic-bezier(0.16,1,0.3,1)',
                      'opacity 0.45s ease',
                      'width 0.45s cubic-bezier(0.16,1,0.3,1)',
                    ].join(', '),
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
                    transition: 'font-size 0.45s cubic-bezier(0.16,1,0.3,1)',
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
              style={navBtn(canPrev)}
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
              style={navBtn(canNext)}
              onMouseEnter={e => { if (canNext) { e.currentTarget.style.background = 'rgba(168,216,255,0.1)'; e.currentTarget.style.boxShadow = '0 0 16px rgba(168,216,255,0.18)' } }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.boxShadow = 'none' }}
            >›</button>
          </div>

        </div>
      </Html>
    </Float>
  )
}

function Loader() {
  return (
    <Html center>
      <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', letterSpacing: '4px', textTransform: 'uppercase', fontFamily: 'system-ui, sans-serif' }}>
        Entering classroom…
      </div>
    </Html>
  )
}

// Fires onLoaded once after the scene first mounts (GLB resolved by Suspense)
function SceneReady({ onLoaded }: { onLoaded: () => void }) {
  useEffect(() => { onLoaded() }, [onLoaded])
  return null
}

function Scene({ scrollProgress, activeSection, selectedProject, onCloseProject, onSelectProject, isMobile, onLoaded }: {
  scrollProgress: number
  activeSection: number
  selectedProject: number | null
  onCloseProject: () => void
  onSelectProject: (i: number) => void
  isMobile: boolean
  onLoaded: () => void
}) {
  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 9, 6]} intensity={1.1} color="#fff6e0" castShadow shadow-mapSize={[1024, 1024]} />
      <pointLight position={[0, 5, 2]} intensity={0.7} color="#ffd580" />
      <pointLight position={[-4, 4, -4]} intensity={0.35} color="#80c8ff" />
      <fog attach="fog" args={['#0d0d1a', 18, 38]} />
      <Environment preset="night" />
      <Classroom />
      <SceneReady onLoaded={onLoaded} />

      {/* Watermark chapter numbers */}
      {SECTIONS.map((s) => (
        <ChapterTag key={s.id} position={CHAPTER_POS[s.id]} chapter={s.chapter}
          visible={activeSection === s.id && selectedProject === null}
        />
      ))}

      {/* Floating project detail text — desktop only; mobile uses a DOM overlay instead */}
      {selectedProject !== null && !isMobile && (
        <ProjectDetailText
          key={selectedProject}
          project={PORTFOLIO.projects[selectedProject]}
          index={selectedProject}
          pos={PROJECT_PLACEMENTS[selectedProject].pos}
          onClose={onCloseProject}
          onSelect={onSelectProject}
        />
      )}

      {/* 3-D carousel — desktop only, visible in section 3 before selection */}
      {!isMobile && activeSection === 3 && selectedProject === null && (
        <ProjectCarousel onSelect={onSelectProject} />
      )}

      <CameraRig scrollProgress={scrollProgress} selectedProject={selectedProject} />
    </>
  )
}

// ── Export ─────────────────────────────────────────────────────────────────

export default function ClassroomCanvas({ scrollProgress, activeSection, selectedProject, onCloseProject, onSelectProject, isMobile, onLoaded }: {
  scrollProgress: number
  activeSection: number
  selectedProject: number | null
  onCloseProject: () => void
  onSelectProject: (i: number) => void
  isMobile: boolean
  onLoaded: () => void
}) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
      <Canvas
        camera={{ position: [0, 4.5, 15], fov: 58, near: 0.1, far: 120 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 1.5]}
        shadows={{ type: PCFShadowMap }}
      >
        <Suspense fallback={<Loader />}>
          <Scene
            scrollProgress={scrollProgress}
            activeSection={activeSection}
            selectedProject={selectedProject}
            onCloseProject={onCloseProject}
            onSelectProject={onSelectProject}
            isMobile={isMobile}
            onLoaded={onLoaded}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}
