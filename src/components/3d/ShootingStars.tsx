'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ShootingStar {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  active: boolean;
  trail: THREE.Vector3[];
  life: number;
}

const TRAIL_LENGTH = 20;

/**
 * ShootingStars - Slow, graceful shooting stars
 * Sometimes 2, sometimes 3 at once for variety
 */
export function ShootingStars() {
  const groupRef = useRef<THREE.Group>(null);
  const starsRef = useRef<ShootingStar[]>([]);
  const linesRef = useRef<THREE.Line[]>([]);
  const lastSpawnRef = useRef(0);
  
  const maxStars = 4;
  const spawnInterval = 6;
  
  // Create line objects
  useEffect(() => {
    if (!groupRef.current) return;
    
    // Clear existing
    while (groupRef.current.children.length > 0) {
      groupRef.current.remove(groupRef.current.children[0]);
    }
    linesRef.current = [];
    
    // Create new lines
    for (let i = 0; i < maxStars; i++) {
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
      
      const line = new THREE.Line(geometry, material);
      line.visible = false;
      
      groupRef.current.add(line);
      linesRef.current.push(line);
    }
    
    // Initialize star data
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
    
    const startX = 5 + Math.random() * 10;
    const startY = 3 + Math.random() * 5;
    const startZ = -2 - Math.random() * 5;
    
    inactiveStar.position.set(startX, startY, startZ);
    inactiveStar.trail.forEach(p => p.set(startX, startY, startZ));
    
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
    const count = Math.random() > 0.5 ? 2 : 3;
    for (let i = 0; i < count; i++) {
      setTimeout(() => spawnSingleStar(), i * 300);
    }
  };

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;
    
    if (time - lastSpawnRef.current > spawnInterval + Math.random() * 8) {
      spawnStars();
      lastSpawnRef.current = time;
    }
    
    starsRef.current.forEach((star, starIndex) => {
      const line = linesRef.current[starIndex];
      if (!line) return;
      
      if (!star.active) {
        line.visible = false;
        return;
      }
      
      star.life += delta;
      star.position.add(star.velocity.clone().multiplyScalar(delta));
      
      if (star.position.x < -12 || star.position.y < -8) {
        star.active = false;
        line.visible = false;
        return;
      }
      
      // Update trail
      for (let i = TRAIL_LENGTH - 1; i > 0; i--) {
        star.trail[i].lerp(star.trail[i - 1], 0.4);
      }
      star.trail[0].copy(star.position);
      
      // Update geometry
      const geometry = line.geometry as THREE.BufferGeometry;
      const positions = geometry.attributes.position.array as Float32Array;
      const colors = geometry.attributes.color.array as Float32Array;
      
      for (let i = 0; i < TRAIL_LENGTH; i++) {
        const idx = i * 3;
        positions[idx] = star.trail[i].x;
        positions[idx + 1] = star.trail[i].y;
        positions[idx + 2] = star.trail[i].z;
        
        const fade = 1 - (i / TRAIL_LENGTH);
        const brightness = Math.pow(fade, 1.5);
        colors[idx] = brightness;
        colors[idx + 1] = brightness;
        colors[idx + 2] = brightness * 0.95;
      }
      
      geometry.attributes.position.needsUpdate = true;
      geometry.attributes.color.needsUpdate = true;
      
      line.visible = true;
    });
  });

  return <group ref={groupRef} />;
}
