// This file helps TypeScript understand the Three.js types better

import type * as THREE from "three"

declare module "three" {
    // Ensure these types are recognized
    export type Mesh = THREE.Mesh
    export type Group = THREE.Group
    export type Points = THREE.Points
}

declare module "@react-three/fiber" {
    // Add any missing types from react-three/fiber
}

declare module "@react-three/drei" {
    // Add any missing types from react-three/drei
}
