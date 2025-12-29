'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getState } from '@/lib/store';
import { lerp } from '@/lib/utils';

/**
 * Abstract geometric shapes representing system concepts
 * Each shape represents a capability: Architecture, Scale, Performance, Experience
 */

interface ShapeProps {
  position: [number, number, number];
  targetScene: number;
  rotationSpeed?: number;
  scale?: number;
}

function AbstractShape({ 
  children, 
  position, 
  targetScene, 
  rotationSpeed = 0.001,
  scale = 1 
}: ShapeProps & { children: React.ReactNode }) {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  
  useFrame((state) => {
    if (!groupRef.current || !materialRef.current) return;
    
    const store = getState();
    const { activeScene, reducedMotion } = store;
    
    // Only visible during capabilities scene (scene 2)
    const isActive = activeScene === targetScene;
    const targetOpacity = isActive ? 0.8 : 0;
    
    materialRef.current.opacity = lerp(
      materialRef.current.opacity, 
      targetOpacity, 
      0.05
    );
    
    // Subtle rotation when active
    if (!reducedMotion && isActive) {
      groupRef.current.rotation.y += rotationSpeed;
      groupRef.current.rotation.x += rotationSpeed * 0.5;
    }
    
    // Floating motion
    if (!reducedMotion) {
      groupRef.current.position.y = position[1] + 
        Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      <mesh>
        {children}
        <meshStandardMaterial
          ref={materialRef}
          color="#ffffff"
          transparent
          opacity={0}
          wireframe
          emissive="#ffffff"
          emissiveIntensity={0.2}
        />
      </mesh>
    </group>
  );
}

// Architecture - Octahedron (structural, foundational)
export function ArchitectureShape() {
  return (
    <AbstractShape position={[-4, 0, -2]} targetScene={2} rotationSpeed={0.002}>
      <octahedronGeometry args={[1, 0]} />
    </AbstractShape>
  );
}

// Scale - Icosahedron (complexity, faceted growth)
export function ScaleShape() {
  return (
    <AbstractShape position={[-1.5, 1, -3]} targetScene={2} rotationSpeed={0.0015} scale={0.8}>
      <icosahedronGeometry args={[1, 0]} />
    </AbstractShape>
  );
}

// Performance - Tetrahedron (sharp, efficient, minimal)
export function PerformanceShape() {
  return (
    <AbstractShape position={[1.5, -0.5, -2.5]} targetScene={2} rotationSpeed={0.0025} scale={0.9}>
      <tetrahedronGeometry args={[1, 0]} />
    </AbstractShape>
  );
}

// Experience - Torus (continuous, connected, flowing)
export function ExperienceShape() {
  return (
    <AbstractShape position={[4, 0.5, -2]} targetScene={2} rotationSpeed={0.001}>
      <torusGeometry args={[0.8, 0.3, 8, 24]} />
    </AbstractShape>
  );
}

/**
 * Floating panels for the Work section
 */
interface WorkPanelProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  size?: [number, number];
  index: number;
}

export function WorkPanel({ 
  position, 
  rotation = [0, 0, 0],
  size = [2, 1.2],
  index 
}: WorkPanelProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const edgesRef = useRef<THREE.LineSegments>(null);
  
  // Create edge geometry
  const edgesGeometry = useMemo(() => {
    const planeGeo = new THREE.PlaneGeometry(...size);
    return new THREE.EdgesGeometry(planeGeo);
  }, [size]);
  
  useFrame((state) => {
    if (!meshRef.current || !materialRef.current) return;
    
    const store = getState();
    const { activeScene, reducedMotion, mousePosition } = store;
    
    // Only visible during work scene (scene 3)
    const isActive = activeScene === 3;
    const targetOpacity = isActive ? 0.9 : 0;
    
    materialRef.current.opacity = lerp(
      materialRef.current.opacity, 
      targetOpacity, 
      0.05
    );
    
    // Update edges opacity
    if (edgesRef.current) {
      const edgeMat = edgesRef.current.material as THREE.LineBasicMaterial;
      edgeMat.opacity = lerp(edgeMat.opacity, isActive ? 0.5 : 0, 0.05);
    }
    
    // Subtle hover effect based on mouse
    if (!reducedMotion && isActive) {
      const hoverOffset = Math.sin(state.clock.elapsedTime * 0.8 + index) * 0.05;
      meshRef.current.position.y = position[1] + hoverOffset;
      
      // Slight rotation towards mouse
      meshRef.current.rotation.y = rotation[1] + mousePosition.x * 0.1;
      meshRef.current.rotation.x = rotation[0] + mousePosition.y * 0.05;
    }
  });

  return (
    <group position={position} rotation={rotation}>
      <mesh ref={meshRef}>
        <planeGeometry args={size} />
        <meshStandardMaterial
          ref={materialRef}
          color="#18181b"
          transparent
          opacity={0}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Border glow */}
      <lineSegments ref={edgesRef} geometry={edgesGeometry}>
        <lineBasicMaterial color="#ffffff" transparent opacity={0} />
      </lineSegments>
    </group>
  );
}

/**
 * All work panels arranged in 3D space
 */
export function WorkPanels() {
  const panels = [
    { position: [-3, 0.5, -1] as [number, number, number], rotation: [0, 0.3, 0] as [number, number, number] },
    { position: [0, 0, -2] as [number, number, number], rotation: [0, 0, 0] as [number, number, number] },
    { position: [3, 0.3, -1.5] as [number, number, number], rotation: [0, -0.2, 0] as [number, number, number] },
  ];

  return (
    <>
      {panels.map((panel, i) => (
        <WorkPanel key={i} index={i} {...panel} />
      ))}
    </>
  );
}
