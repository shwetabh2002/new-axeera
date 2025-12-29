'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { particleVertexShader, particleFragmentShader } from '@/shaders/particles.glsl';
import { getState } from '@/lib/store';

interface ParticleFieldProps {
  count?: number;
  spread?: number;
  color?: string;
}

/**
 * ParticleField creates a field of floating particles with depth
 * Particles respond to scroll and mouse movement for subtle parallax
 */
export function ParticleField({ 
  count = 500, 
  spread = 30,
  color = '#ffffff'
}: ParticleFieldProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  // Generate particle positions and attributes
  const { positions, scales, randomness } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const randomness = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      // Distribute particles in a cylinder-like shape
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * spread * 0.5;
      
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = (Math.random() - 0.5) * spread * 0.3;
      positions[i * 3 + 2] = (Math.random() - 0.5) * spread;
      
      scales[i] = Math.random() * 0.5 + 0.5;
      randomness[i] = Math.random();
    }
    
    return { positions, scales, randomness };
  }, [count, spread]);

  // Create geometry with attributes
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
    geo.setAttribute('aRandomness', new THREE.BufferAttribute(randomness, 1));
    return geo;
  }, [positions, scales, randomness]);

  // Shader uniforms
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uScrollProgress: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uColor: { value: new THREE.Color(color) },
  }), [color]);

  // Animation frame
  useFrame((state) => {
    if (!materialRef.current) return;
    
    const store = getState();
    
    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    materialRef.current.uniforms.uScrollProgress.value = store.scrollProgress;
    materialRef.current.uniforms.uMouse.value.set(
      store.mousePosition.x,
      store.mousePosition.y
    );
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={particleVertexShader}
        fragmentShader={particleFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
