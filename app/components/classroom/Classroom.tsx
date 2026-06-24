'use client'

import { useGLTF } from '@react-three/drei'

export function Classroom() {
  const { scene } = useGLTF('/models/anime_class_room.glb')
  return <primitive object={scene} />
}

useGLTF.preload('/models/anime_class_room.glb')
