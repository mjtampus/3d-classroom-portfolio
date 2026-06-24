'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'

export function ChapterTag({ position, chapter, visible }: {
  position: [number, number, number]
  chapter: string
  visible: boolean
}) {
  const ref = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    if (ref.current)
      ref.current.position.y = position[1] + Math.sin(clock.elapsedTime * 0.8) * 0.1
  })

  return (
    <Text
      ref={ref}
      position={position}
      fontSize={2.2}
      color="#ffffff"
      anchorX="center"
      anchorY="middle"
      font={undefined}
      fillOpacity={visible ? 0.06 : 0}
      outlineColor="#a8d8ff"
      outlineOpacity={visible ? 0.45 : 0}
      outlineWidth={0.015}
    >
      {chapter}
    </Text>
  )
}
