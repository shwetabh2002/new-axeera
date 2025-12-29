'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ShootingStar {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  active: boolean;
  trail: THREE.Vector3[];
  life: number;
}

const TRAIL_LENGTH = 20; // Longer trail for smoother look

/**
 * ShootingStars - Slow, graceful shooting stars
 * Sometimes 2, sometimes 3 at once for variety
 */
export function ShootingStars() {
  const starsRef = useRef<ShootingStar[]>([]);
  const linesRef = useRef<(THREE.Line | null)[]>([]);
  const lastSpawnRef = useRef(0);
  
  const maxStars = 4; // Pool of 4 to allow 2-3 simultaneous
  const spawnInterval = 6; // Base interval
  
  // Create geometries and materials
  const starData = useMemo(() => {
    return Array(maxStars).fill(null).map(() => {
      const positions = new Float32Array(TRAIL_LENGTH * 3);
      const colors = new Float32Array(TRAIL_LENGTH * 3);
      
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      
      const material = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 1,
        blending: THREE.AdditiveBlending,
      });
      
      return { geometry, material };
    });
  }, []);
  
  // Initialize stars
  useMemo(() => {
    starsRef.current = Array(maxStars).fill(null).map(() => ({
      position: new THREE.Vector3(100, 100, -5),
      velocity: new THREE.Vector3(),
      active: false,
      trail: Array(TRAIL_LENGTH).fill(null).map(() => new THREE.Vector3(100, 100, -5)),
      life: 0,
    }));
  }, []);

  const spawnSingleStar = () => {
    const inactiveStar = starsRef.current.find(s => !s.active);
    if (!inactiveStar) return;
    
    // Start from upper-right area with some spread
    const startX = 5 + Math.random() * 10;
    const startY = 3 + Math.random() * 5;
    const startZ = -2 - Math.random() * 5;
    
    inactiveStar.position.set(startX, startY, startZ);
    
    // Reset trail
    inactiveStar.trail.forEach(p => p.set(startX, startY, startZ));
    
    // Slow speed - gentle diagonal movement
    const speed = 3 + Math.random() * 2;
    const angle = Math.PI * 0.8 + (Math.random() - 0.5) * 0.25;
    
    inactiveStar.velocity.set(
      Math.cos(angle) * speed,
      -Math.abs(Math.sin(angle) * speed),
      0
    );
    
    inactiveStar.active = true;
    inactiveStar.life = 0;
  };

  const spawnStars = () => {
    // Randomly spawn 2 or 3 stars
    const count = Math.random() > 0.5 ? 2 : 3;
    
    for (let i = 0; i < count; i++) {
      // Stagger spawn slightly for natural look
      setTimeout(() => spawnSingleStar(), i * 300);
    }
  };

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;
    
    // Spawn 2-3 stars at intervals
    if (time - lastSpawnRef.current > spawnInterval + Math.random() * 8) {
      spawnStars();
      lastSpawnRef.current = time;
    }
    
    starsRef.current.forEach((star, starIndex) => {
      const line = linesRef.current[starIndex];
      const data = starData[starIndex];
      if (!line || !data) return;
      
      if (!star.active) {
        line.visible = false;
        return;
      }
      
      star.life += delta;
      
      // Move slowly
      star.position.add(star.velocity.clone().multiplyScalar(delta));
      
      // Disappear when out of view
      if (star.position.x < -12 || star.position.y < -8) {
        star.active = false;
        line.visible = false;
        return;
      }
      
      // Update trail with smooth interpolation
      for (let i = TRAIL_LENGTH - 1; i > 0; i--) {
        // Smooth trail following
        star.trail[i].lerp(star.trail[i - 1], 0.4);
      }
      star.trail[0].copy(star.position);
      
      // Update geometry
      const positions = data.geometry.attributes.position.array as Float32Array;
      const colors = data.geometry.attributes.color.array as Float32Array;
      
      for (let i = 0; i < TRAIL_LENGTH; i++) {
        const idx = i * 3;
        positions[idx] = star.trail[i].x;
        positions[idx + 1] = star.trail[i].y;
        positions[idx + 2] = star.trail[i].z;
        
        // Gradual fade from head to tail
        const fade = 1 - (i / TRAIL_LENGTH);
        const brightness = Math.pow(fade, 1.5); // Gentle falloff
        colors[idx] = brightness;
        colors[idx + 1] = brightness;
        colors[idx + 2] = brightness * 0.95; // Slight warm tint
      }
      
      data.geometry.attributes.position.needsUpdate = true;
      data.geometry.attributes.color.needsUpdate = true;
      
      line.visible = true;
    });
  });

  return (
    <group>
      {starData.map((data, i) => (
        <line
          key={i}
          ref={(el) => { linesRef.current[i] = el as THREE.Line; }}
          geometry={data.geometry}
          material={data.material}
          visible={false}
        />
      ))}
    </group>
  );
}
