'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useStore } from '@/lib/hooks';

/**
 * Subtle scroll indicator shown in hero section
 * Uses gradient accent, fades out as user scrolls
 */
export function ScrollIndicator() {
  const store = useStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !store.isLoaded) return;

    // Entrance animation
    gsap.fromTo(containerRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 1.5 }
    );

    // Animated line
    if (lineRef.current) {
      gsap.to(lineRef.current, {
        scaleY: 1,
        duration: 1.5,
        ease: 'power2.inOut',
        repeat: -1,
        yoyo: true,
      });
    }
  }, [store.isLoaded]);

  // Fade out on scroll
  useEffect(() => {
    if (!containerRef.current) return;
    
    const opacity = Math.max(0, 1 - store.scrollProgress * 10);
    gsap.to(containerRef.current, {
      opacity,
      duration: 0.3,
    });
  }, [store.scrollProgress]);

  return (
    <div 
      ref={containerRef}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-0 pointer-events-none"
    >
      <span className="text-caption text-white/40">Scroll</span>
      <div className="w-px h-12 bg-neutral-800 overflow-hidden">
        <div 
          ref={lineRef}
          className="w-full h-full bg-gradient-to-b from-indigo-400 via-purple-400 to-pink-400 origin-top scale-y-0"
        />
      </div>
    </div>
  );
}
