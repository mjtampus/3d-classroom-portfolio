'use client'

import { useRef, Suspense, useEffect } from 'react'
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
  { id: 0, chapter: '00', label: 'Hello'    },
  { id: 1, chapter: '01', label: 'About'    },
  { id: 2, chapter: '02', label: 'Skills'   },
  { id: 3, chapter: '03', label: 'Projects' },
  { id: 4, chapter: '04', label: 'Contact'  },
]

// ── Camera path (scroll-driven) ────────────────────────────────────────────

const CAM_POSITIONS = [
  new THREE.Vector3(0,    4.5, 15),
  new THREE.Vector3(-3,   3.2,  8),
  new THREE.Vector3(-0.5, 3.0,  3),
  new THREE.Vector3(4.5,  3.0,  3),
  new THREE.Vector3(0,    5.5, 11),
]
const CAM_TARGETS = [
  new THREE.Vector3(0, 1.5,  0),
  new THREE.Vector3(0, 2.0,  0),
  new THREE.Vector3(0, 2.0, -4),
  new THREE.Vector3(0, 1.8,  0),
  new THREE.Vector3(0, 1.5,  0),
]

// ── Per-project 3-D placements inside the classroom ───────────────────────
// Each entry: where the card floats (pos) + where the camera moves to (cam + look)

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
  [ 0, 5, 10], [-2, 3, 4], [2, 3, -5], [-2, 4, -3], [0, 5, 6],
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

// 3-D floating project detail card
type Project = typeof PORTFOLIO.projects[0]

const TOTAL_PROJECTS = PORTFOLIO.projects.length

function ProjectDetailCard({ project, index, pos, onClose, onSelect }: {
  project: Project
  index: number
  pos: [number, number, number]
  onClose: () => void
  onSelect: (i: number) => void
}) {
  const hasPrev = index > 0
  const hasNext = index < TOTAL_PROJECTS - 1

  const navBtnStyle = (disabled: boolean): React.CSSProperties => ({
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: '36px', height: '36px',
    background: disabled ? 'rgba(255,255,255,0.03)' : 'rgba(168,216,255,0.1)',
    border: `1px solid ${disabled ? 'rgba(255,255,255,0.07)' : 'rgba(168,216,255,0.25)'}`,
    borderRadius: '8px', color: disabled ? 'rgba(255,255,255,0.2)' : 'white',
    cursor: disabled ? 'default' : 'pointer',
    flexShrink: 0, fontFamily: 'inherit',
  })

  return (
    <Float speed={1} floatIntensity={0.25} rotationIntensity={0} floatingRange={[-0.06, 0.06]}>
      <Html
        position={pos}
        center
        zIndexRange={[200, 0]}
        style={{ pointerEvents: 'auto' }}
        wrapperClass="project-detail-wrapper"
      >
        <div style={{
          width: 'min(340px, 92vw)',
          background: 'rgba(4,4,18,0.82)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(168,216,255,0.25)',
          borderRadius: '20px',
          boxShadow: '0 24px 64px rgba(0,0,0,0.75), 0 0 0 1px rgba(168,216,255,0.08) inset',
          fontFamily: 'var(--font-geist-sans, system-ui, sans-serif)',
          color: 'white',
          overflow: 'hidden',
          animation: 'detailIn 0.32s cubic-bezier(0.16,1,0.3,1) forwards',
        }}>
          {/* Media */}
          {project.image ? (
            <div style={{ width: '100%', height: 'min(180px, 45vw)', overflow: 'hidden', background: 'rgba(168,216,255,0.04)' }}>
              <img src={project.image} alt={project.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={e => { (e.target as HTMLImageElement).parentElement!.style.display = 'none' }}
              />
            </div>
          ) : project.video ? (
            <div style={{ width: '100%', height: 'min(190px, 48vw)', background: '#000' }}>
              <iframe src={project.video} title={project.title}
                style={{ width: '100%', height: '100%', border: 'none' }} allowFullScreen />
            </div>
          ) : (
            <div style={{ height: '100px', background: 'rgba(168,216,255,0.03)',
              display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '10px', letterSpacing: '3px' }}>NO PREVIEW</span>
            </div>
          )}

          {/* Content */}
          <div style={{ padding: '20px 22px 22px' }}>
            {/* Counter */}
            <div style={{ fontSize: '10px', letterSpacing: '3px', color: '#a8d8ff', opacity: 0.5, marginBottom: '6px' }}>
              {String(index + 1).padStart(2, '0')} / {String(TOTAL_PROJECTS).padStart(2, '0')}
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 8px', letterSpacing: '-0.2px' }}>
              {project.title}
            </h3>
            <p style={{ fontSize: '12.5px', lineHeight: 1.75, color: 'rgba(255,255,255,0.65)', margin: '0 0 14px' }}>
              {project.description}
            </p>

            {/* Tech tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '18px' }}>
              {project.technologies.map(t => (
                <span key={t} style={{
                  fontSize: '10px', padding: '3px 9px',
                  background: 'rgba(168,216,255,0.09)',
                  border: '1px solid rgba(168,216,255,0.2)',
                  borderRadius: '99px', color: '#a8d8ff',
                }}>{t}</span>
              ))}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {/* Prev */}
              <button
                onClick={() => hasPrev && onSelect(index - 1)}
                disabled={!hasPrev}
                style={navBtnStyle(!hasPrev)}
                onMouseEnter={e => { if (hasPrev) e.currentTarget.style.background = 'rgba(168,216,255,0.2)' }}
                onMouseLeave={e => { if (hasPrev) e.currentTarget.style.background = 'rgba(168,216,255,0.1)' }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {/* View Site */}
              <a href={project.link} target="_blank" rel="noopener noreferrer"
                style={{
                  flex: 1, display: 'inline-flex', alignItems: 'center',
                  justifyContent: 'center', gap: '6px',
                  padding: '10px 16px',
                  background: 'rgba(168,216,255,0.14)',
                  border: '1px solid rgba(168,216,255,0.35)',
                  borderRadius: '10px', color: 'white',
                  textDecoration: 'none', fontSize: '12px', fontWeight: 600,
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(168,216,255,0.26)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(168,216,255,0.14)')}
              >
                View Site
                <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
                  <path d="M2 12L12 2M12 2H5M12 2V9" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>

              {/* Next */}
              <button
                onClick={() => hasNext && onSelect(index + 1)}
                disabled={!hasNext}
                style={navBtnStyle(!hasNext)}
                onMouseEnter={e => { if (hasNext) e.currentTarget.style.background = 'rgba(168,216,255,0.2)' }}
                onMouseLeave={e => { if (hasNext) e.currentTarget.style.background = 'rgba(168,216,255,0.1)' }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            {/* Back link */}
            <button onClick={onClose}
              style={{
                marginTop: '10px', width: '100%',
                padding: '8px',
                background: 'transparent',
                border: 'none',
                color: 'rgba(255,255,255,0.3)', cursor: 'pointer',
                fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase',
                fontFamily: 'inherit',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.65)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
            >
              ← back to list
            </button>
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

      {/* 3-D project detail card — desktop only; mobile uses a DOM overlay instead */}
      {selectedProject !== null && !isMobile && (
        <ProjectDetailCard
          key={selectedProject}
          project={PORTFOLIO.projects[selectedProject]}
          index={selectedProject}
          pos={PROJECT_PLACEMENTS[selectedProject].pos}
          onClose={onCloseProject}
          onSelect={onSelectProject}
        />
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
