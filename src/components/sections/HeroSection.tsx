'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useStore, useSceneProgress } from '@/lib/hooks';
import { cn } from '@/lib/utils';

/**
 * Scene 1 — System boot (Hero)
 * 
 * Fullscreen 3D environment with:
 * - Dark base with indigo/purple glowing orb
 * - Staggered entrance animations
 * - Gradient text on "experiences"
 * - Scroll fade-out with scale
 */
export function HeroSection() {
  const store = useStore();
  const sceneProgress = useSceneProgress(0);
  const containerRef = useRef<HTMLElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const sublineRef = useRef<HTMLParagraphElement>(null);

  // Background orb mouse parallax
  useEffect(() => {
    if (!orbRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      
      gsap.to(orbRef.current, {
        x: x * 20, // 2% movement
        y: y * 20,
        duration: 1,
        ease: 'power2.out',
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Background orb breathing animation
  useEffect(() => {
    if (!orbRef.current) return;

    gsap.to(orbRef.current, {
      scale: 1.1,
      duration: 4,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });
  }, []);

  // Entrance animation
  useEffect(() => {
    if (!store.isLoaded) return;

    const tl = gsap.timeline();

    // Label entrance
    if (labelRef.current) {
      tl.fromTo(labelRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
        0.3
      );
    }

    // Headline entrance
    if (headlineRef.current) {
      tl.fromTo(headlineRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
        0.5
      );
    }

    // Subline entrance
    if (sublineRef.current) {
      tl.fromTo(sublineRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
        0.7
      );
    }
  }, [store.isLoaded]);

  // Fade out on scroll (at 15% scroll progress)
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Map scene progress to fade: 0-15% -> 1-0 opacity
    const fadeProgress = Math.min(sceneProgress / 0.15, 1);
    const opacity = Math.max(0, 1 - fadeProgress);
    const scale = 1 - fadeProgress * 0.2; // 1 -> 0.8
    const translateY = fadeProgress * -100;
    
    gsap.to(containerRef.current, {
      opacity,
      scale,
      y: translateY,
      duration: 0.1,
    });
  }, [sceneProgress]);

  return (
    <section 
      ref={containerRef}
      className={cn(
        'h-screen min-h-screen',
        'flex items-center justify-center',
        'relative overflow-hidden'
      )}
      aria-label="Hero"
    >
      {/* Background Glowing Orb */}
      <div
        ref={orbRef}
        className="absolute pointer-events-none"
        style={{
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: `radial-gradient(
            circle at 30% 30%,
            rgba(99, 102, 241, 0.3),
            rgba(139, 92, 246, 0.1),
            transparent 70%
          )`,
          filter: 'blur(60px)',
        }}
      />

      <div className="max-w-5xl mx-auto text-center px-6 relative z-10">
        {/* Label */}
        <div 
          ref={labelRef}
          className="text-white/40 text-sm tracking-[0.3em] uppercase mb-8 opacity-0"
        >
          Digital Agency
        </div>

        {/* Main headline */}
        <h1 
          ref={headlineRef}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.9] mb-8 opacity-0"
        >
          <span className="text-white">We craft digital</span>
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
            experiences
          </span>
        </h1>

        {/* Subtitle */}
        <p 
          ref={sublineRef}
          className="text-white/50 text-lg md:text-xl max-w-2xl mx-auto mb-12 opacity-0"
        >
          Engineering the systems businesses run on. Websites. Dashboards. Invoicing. ERP.
        </p>
      </div>

      {/* Technical corner elements */}
      <div className="absolute top-8 left-8 text-white/20 font-mono">
        <div className="text-xs tracking-wider">SYS.INIT</div>
      </div>
      
      <div className="absolute bottom-8 right-8 text-white/20 font-mono">
        <div className="text-xs tracking-wider">v1.0.0</div>
      </div>
    </section>
  );
}
