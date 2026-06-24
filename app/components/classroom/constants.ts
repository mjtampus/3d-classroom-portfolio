import * as THREE from 'three'

export const CAM_POSITIONS = [
  new THREE.Vector3(0,    4.5, 15),
  new THREE.Vector3(-4,   3.2,  8),
  new THREE.Vector3(-0.5, 3.0,  3),
  new THREE.Vector3(0,    3.0,  3),
  new THREE.Vector3(0,    5.5, 11),
]

export const CAM_TARGETS = [
  new THREE.Vector3(0, 1.5,  0),
  new THREE.Vector3(0, 2.0,  0),
  new THREE.Vector3(0, 2.0, -4),
  new THREE.Vector3(0, 3,    0),
  new THREE.Vector3(0, 1.5,  0),
]

export const CAROUSEL_CENTER: [number, number, number] = [0, 2.92, 2]

export const PROJECT_PLACEMENTS = [
  { cam: new THREE.Vector3(-2.5, 3.5, 15.5), look: new THREE.Vector3(-2.5, 3.6, -4) },
  { cam: new THREE.Vector3( 1.5, 3.5, 10.5), look: new THREE.Vector3( 2.5, 2.6, -4) },
  { cam: new THREE.Vector3( 0,   3.5,  8.5), look: new THREE.Vector3(-4.5, 2.6,  0) },
  { cam: new THREE.Vector3( 0,   3.5,  2.5), look: new THREE.Vector3( 4.5, 2.6,  0) },
  { cam: new THREE.Vector3( 1,   3.5,  9  ), look: new THREE.Vector3(-2.0, 2.6,  5) },
  { cam: new THREE.Vector3( 0,   4.5, 12  ), look: new THREE.Vector3( 0,   3.2,  7) },
]

export const CHAPTER_POS: [number, number, number][] = [
  [ 0, 5,    10  ],
  [-2, 3,     4  ],
  [ 2, 3,    -5  ],
  [-3, 6.10, -5.9],
  [ 0, 5,     6  ],
]
