'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { gridVertexShader, gridFragmentShader } from '@/shaders/grid.glsl';
import { getState } from '@/lib/store';

interface GridPlaneProps {
  size?: number;
  color?: string;
  opacity?: number;
}

/**
 * GridPlane creates a technical grid on the ground
 * Fades into the distance for depth perception
 */
export function GridPlane({ 
  size = 100, 
  color = '#ffffff',
  opacity = 0.1 
}: GridPlaneProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor: { value: new THREE.Color(color) },
    uOpacity: { value: opacity },
  }), [color, opacity]);

  useFrame((state) => {
    if (!materialRef.current) return;
    
    const store = getState();
    
    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    
    // Adjust opacity based on active scene
    const targetOpacity = store.activeScene >= 4 ? opacity * 0.3 : opacity;
    materialRef.current.uniforms.uOpacity.value += 
      (targetOpacity - materialRef.current.uniforms.uOpacity.value) * 0.05;
  });

  return (
    <mesh 
      ref={meshRef} 
      rotation={[-Math.PI / 2, 0, 0]} 
      position={[0, -3, 0]}
    >
      <planeGeometry args={[size, size, 1, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={gridVertexShader}
        fragmentShader={gridFragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

