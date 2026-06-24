'use client'

import { useRef, Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { PCFShadowMap } from 'three'
import { Scene, Loader } from './classroom/Scene'
import { ProjectDetailText } from './classroom/ProjectDetailText'
import { PORTFOLIO } from '../data/portfolio'

export { PORTFOLIO } from '../data/portfolio'
export { SECTIONS }  from '../data/portfolio'

export default function ClassroomCanvas({ scrollProgress, activeSection, selectedProject, onCloseProject, onSelectProject, isMobile, onLoaded }: {
  scrollProgress: number
  activeSection: number
  selectedProject: number | null
  onCloseProject: () => void
  onSelectProject: (i: number) => void
  isMobile: boolean
  onLoaded: () => void
}) {
  const panRef = useRef(0)
  const [navDir, setNavDir] = useState(0)

  function handleSelectProject(i: number) {
    if (selectedProject !== null) {
      const dir = i > selectedProject ? 1 : -1
      panRef.current = dir
      setNavDir(dir)
    } else {
      setNavDir(0)
    }
    onSelectProject(i)
  }

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
            onSelectProject={handleSelectProject}
            isMobile={isMobile}
            onLoaded={onLoaded}
            panRef={panRef}
          />
        </Suspense>
      </Canvas>

      {!isMobile && selectedProject !== null && (
        <ProjectDetailText
          key={selectedProject}
          project={PORTFOLIO.projects[selectedProject]}
          index={selectedProject}
          direction={navDir}
          onClose={onCloseProject}
          onSelect={handleSelectProject}
        />
      )}
    </div>
  )
}
