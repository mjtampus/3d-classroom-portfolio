'use client'

import { useEffect } from 'react'
import { Html, Environment } from '@react-three/drei'
import { SECTIONS } from '../../data/portfolio'
import { CHAPTER_POS } from './constants'
import { Classroom } from './Classroom'
import { CameraRig } from './CameraRig'
import { ChapterTag } from './ChapterTag'
import { ProjectCarousel } from './ProjectCarousel'

function Loader() {
  return (
    <Html center>
      <div style={{
        color: 'rgba(255,255,255,0.7)',
        fontSize: '11px',
        letterSpacing: '4px',
        textTransform: 'uppercase',
        fontFamily: 'system-ui, sans-serif',
      }}>
        Entering classroom…
      </div>
    </Html>
  )
}

function SceneReady({ onLoaded }: { onLoaded: () => void }) {
  useEffect(() => { onLoaded() }, [onLoaded])
  return null
}

export { Loader }

export function Scene({ scrollProgress, activeSection, selectedProject, onSelectProject, isMobile, onLoaded, panRef }: {
  scrollProgress: number
  activeSection: number
  selectedProject: number | null
  onSelectProject: (i: number) => void
  isMobile: boolean
  onLoaded: () => void
  panRef: React.RefObject<number>
}) {
  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight
        position={[4, 9, 6]}
        intensity={1.1}
        color="#fff6e0"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[0, 5, 2]}   intensity={0.7}  color="#ffd580" />
      <pointLight position={[-4, 4, -4]} intensity={0.35} color="#80c8ff" />
      <fog attach="fog" args={['#0d0d1a', 18, 38]} />
      <Environment preset="night" />

      <Classroom />
      <SceneReady onLoaded={onLoaded} />

      {SECTIONS.map((s) => (
        <ChapterTag
          key={s.id}
          position={CHAPTER_POS[s.id]}
          chapter={s.chapter}
          visible={activeSection === s.id && selectedProject === null}
        />
      ))}

      {!isMobile && activeSection === 3 && selectedProject === null && (
        <ProjectCarousel onSelect={onSelectProject} />
      )}

      <CameraRig
        scrollProgress={scrollProgress}
        selectedProject={selectedProject}
        panRef={panRef}
      />
    </>
  )
}
