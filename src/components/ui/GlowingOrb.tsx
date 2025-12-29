'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

/**
 * GlowingOrb - A mesmerizing white orb that follows the cursor
 * 
 * Features:
 * - Smooth GSAP-powered movement with spring physics
 * - Multi-layered glow effect for depth
 * - Subtle pulse animation
 * - Trail effect via blur
 */
export function GlowingOrb() {
  const orbRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const orb = orbRef.current;
    const glow = glowRef.current;
    const trail = trailRef.current;
    
    if (!orb || !glow || !trail) return;

    // Initial position off-screen
    gsap.set([orb, glow, trail], { 
      xPercent: -50, 
      yPercent: -50,
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
    });

    // Subtle breathing animation on the glow
    gsap.to(glow, {
      scale: 1.2,
      opacity: 0.6,
      duration: 2,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });

    // Inner orb pulse
    gsap.to(orb, {
      scale: 1.1,
      duration: 1.5,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });

    const handleMouseMove = (e: MouseEvent) => {
      positionRef.current = { x: e.clientX, y: e.clientY };

      // Main orb follows with spring physics
      gsap.to(orb, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.6,
        ease: 'power3.out',
      });

      // Glow follows slightly slower for depth
      gsap.to(glow, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.8,
        ease: 'power2.out',
      });

      // Trail follows even slower
      gsap.to(trail, {
        x: e.clientX,
        y: e.clientY,
        duration: 1.2,
        ease: 'power1.out',
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {/* Outer trail - softest, slowest */}
      <div
        ref={trailRef}
        className="absolute w-32 h-32 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)',
          filter: 'blur(20px)',
        }}
      />

      {/* Middle glow layer */}
      <div
        ref={glowRef}
        className="absolute w-24 h-24 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 40%, transparent 70%)',
          filter: 'blur(12px)',
          boxShadow: '0 0 60px 20px rgba(255,255,255,0.1)',
        }}
      />

      {/* Core orb - brightest, fastest */}
      <div
        ref={orbRef}
        className="absolute w-4 h-4 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.7) 50%, transparent 100%)',
          boxShadow: `
            0 0 10px 2px rgba(255,255,255,0.8),
            0 0 20px 4px rgba(255,255,255,0.5),
            0 0 40px 8px rgba(255,255,255,0.3),
            0 0 80px 16px rgba(255,255,255,0.1)
          `,
        }}
      />
    </div>
  );
}

