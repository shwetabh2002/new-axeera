'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useSceneProgress, useStore } from '@/lib/hooks';
import { cn } from '@/lib/utils';

/**
 * Scene 2 — Dimensional reveal (Scroll-driven)
 * 
 * Gradient accent on key elements
 */
export function RevealSection() {
  const store = useStore();
  const sceneProgress = useSceneProgress(1);
  const containerRef = useRef<HTMLElement>(null);
  const layer1Ref = useRef<HTMLDivElement>(null);
  const layer2Ref = useRef<HTMLDivElement>(null);
  const layer3Ref = useRef<HTMLDivElement>(null);

  // Animate based on scene progress
  useEffect(() => {
    if (!containerRef.current) return;
    
    const isActive = store.activeScene === 1;
    const opacity = isActive ? Math.min(1, sceneProgress * 3) : Math.max(0, 1 - sceneProgress);
    
    gsap.to(containerRef.current, {
      opacity,
      duration: 0.3,
    });
  }, [store.activeScene, sceneProgress]);

  // Parallax layers
  useEffect(() => {
    const { mousePosition } = store;
    
    if (layer1Ref.current) {
      gsap.to(layer1Ref.current, {
        x: mousePosition.x * 30,
        y: mousePosition.y * 20,
        duration: 0.5,
      });
    }
    
    if (layer2Ref.current) {
      gsap.to(layer2Ref.current, {
        x: mousePosition.x * 20,
        y: mousePosition.y * 15,
        duration: 0.5,
      });
    }
    
    if (layer3Ref.current) {
      gsap.to(layer3Ref.current, {
        x: mousePosition.x * 10,
        y: mousePosition.y * 8,
        duration: 0.5,
      });
    }
  }, [store.mousePosition]);

  return (
    <section 
      ref={containerRef}
      className={cn(
        'section min-h-screen',
        'flex items-center justify-center',
        'relative opacity-0'
      )}
      aria-label="Dimensional Reveal"
    >
      {/* Depth Layer 1 - Far */}
      <div 
        ref={layer1Ref}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ transform: 'translateZ(-100px)' }}
      >
        <div className="text-[20vw] font-light text-neutral-900 select-none">
          DEPTH
        </div>
      </div>

      {/* Depth Layer 2 - Mid - Gradient lines */}
      <div 
        ref={layer2Ref}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <div className="grid grid-cols-3 gap-8 opacity-30">
          {[...Array(9)].map((_, i) => (
            <div 
              key={i} 
              className="w-px h-32 bg-gradient-to-b from-transparent via-purple-400 to-transparent"
            />
          ))}
        </div>
      </div>

      {/* Depth Layer 3 - Near (Content) */}
      <div 
        ref={layer3Ref}
        className="relative z-10 max-w-4xl mx-auto px-6"
      >
        <div className="text-caption text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 mb-4">
          [ NAVIGATING COMPLEXITY ]
        </div>
        <h2 className="text-headline text-text-primary mb-6">
          We move through layers of abstraction
        </h2>
        <p className="text-body text-white/50 max-w-2xl">
          From the foundational architecture to the final pixel, 
          every layer is intentional. Every transition, considered.
        </p>
      </div>

      {/* Floating data points with gradient dots */}
      <div className="absolute top-1/4 left-1/4 text-mono text-xs text-white/40">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">●</span> layer.depth: 3
      </div>
      
      <div className="absolute bottom-1/3 right-1/4 text-mono text-xs text-white/40">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">●</span> motion.parallax: true
      </div>
    </section>
  );
}
