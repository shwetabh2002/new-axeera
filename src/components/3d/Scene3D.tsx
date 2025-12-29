'use client';

import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import * as THREE from 'three';
import { ParticleField } from './ParticleField';
import { GridPlane } from './GridPlane';
import { CameraController } from './CameraController';
import { ShootingStars } from './ShootingStars';
import { 
  ArchitectureShape, 
  ScaleShape, 
  PerformanceShape, 
  ExperienceShape,
  WorkPanels 
} from './AbstractShapes';
import { useReducedMotion, useDeviceCapabilities, useLoading } from '@/lib/hooks';

/**
 * Scene3D is the primary 3D environment
 * Contains all 3D elements and camera control
 * 
 * Performance considerations:
 * - Single canvas for entire experience
 * - Conditional particle count based on device
 * - Reduced motion support
 * - Graceful degradation for low-end devices
 */
export function Scene3D() {
  const reducedMotion = useReducedMotion();
  const isLowEnd = useDeviceCapabilities();
  const { setLoaded } = useLoading();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render on server
  if (!mounted) {
    return (
      <div className="canvas-container bg-black" aria-hidden="true">
        {/* Placeholder while loading */}
      </div>
    );
  }

  // Graceful fallback for very low-end devices or reduced motion
  if (reducedMotion && isLowEnd) {
    return (
      <div 
        className="canvas-container bg-black" 
        aria-hidden="true"
      />
    );
  }

  const particleCount = isLowEnd ? 200 : 500;

  return (
    <div className="canvas-container" aria-hidden="true">
      <Canvas
        gl={{ 
          antialias: !isLowEnd,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        dpr={isLowEnd ? 1 : Math.min(window.devicePixelRatio, 2)}
        camera={{ 
          fov: 50, 
          near: 0.1, 
          far: 100,
          position: [0, 0, 10]
        }}
        onCreated={({ gl }) => {
          // No tone mapping for true black
          gl.toneMapping = THREE.NoToneMapping;
          setLoaded(true);
        }}
      >
        <Suspense fallback={null}>
          {/* Minimal lighting - only for 3D shapes */}
          <ambientLight intensity={0.02} />
          <pointLight position={[10, 10, 10]} intensity={0.3} />
          <pointLight position={[-10, -10, -10]} intensity={0.1} color="#818cf8" />

          {/* Background color - absolute black */}
          <color attach="background" args={['#000000']} />
          
          {/* No fog - pure black space */}

          {/* Camera control */}
          <CameraController />

          {/* Particle field - always visible */}
          <ParticleField 
            count={particleCount} 
            spread={30} 
            color="#ffffff" 
          />

          {/* Occasional shooting stars */}
          {!isLowEnd && <ShootingStars />}

          {/* Grid plane - very subtle */}
          <GridPlane size={100} color="#ffffff" opacity={0.04} />

          {/* Abstract shapes for capabilities section */}
          <ArchitectureShape />
          <ScaleShape />
          <PerformanceShape />
          <ExperienceShape />

          {/* Work panels */}
          <WorkPanels />

          {/* Preload assets */}
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}

