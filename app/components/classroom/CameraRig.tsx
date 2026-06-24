'use client'

import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { CAM_POSITIONS, CAM_TARGETS, PROJECT_PLACEMENTS } from './constants'

export function CameraRig({ scrollProgress, selectedProject, panRef }: {
  scrollProgress: number
  selectedProject: number | null
  panRef: React.RefObject<number>
}) {
  const { camera } = useThree()
  const tPos  = useRef(new THREE.Vector3())
  const tLook = useRef(new THREE.Vector3())
  const sLook = useRef(new THREE.Vector3(0, 1.5, 0))
  const total = CAM_POSITIONS.length - 1

  useFrame(() => {
    if (selectedProject !== null) {
      const p = PROJECT_PLACEMENTS[selectedProject]
      tPos.current.copy(p.cam)
      tLook.current.set(p.look.x + panRef.current * 2.8, p.look.y, p.look.z)
      panRef.current *= 0.87
    } else {
      panRef.current = 0
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
