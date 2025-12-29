'use client';

import { useEffect, useRef, ReactNode } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { setState, calculateActiveScene } from '@/lib/store';
import { useReducedMotion } from '@/lib/hooks';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface SmoothScrollProviderProps {
  children: ReactNode;
}

/**
 * SmoothScrollProvider sets up Lenis smooth scrolling
 * and integrates with GSAP ScrollTrigger for scroll-based animations
 * 
 * This is the core scroll orchestration layer that:
 * - Provides buttery smooth scrolling via Lenis
 * - Tracks scroll progress globally
 * - Updates the 3D scene based on scroll position
 * - Respects user preferences for reduced motion
 */
export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    // Skip smooth scroll if user prefers reduced motion
    if (reducedMotion) {
      // Still track scroll progress for scene changes
      const handleScroll = () => {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollHeight > 0 ? window.scrollY / scrollHeight : 0;
        const activeScene = calculateActiveScene(progress);
        setState({ scrollProgress: progress, activeScene });
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();

      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }

    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    // Integrate Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Use GSAP ticker for animation frame
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Track scroll progress
    lenis.on('scroll', ({ progress }: { progress: number }) => {
      const activeScene = calculateActiveScene(progress);
      setState({ scrollProgress: progress, activeScene });
    });

    // Setup main scroll timeline
    const scrollTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
      },
    });

    // This timeline can be extended for scroll-synced animations
    scrollTimeline.to({}, { duration: 1 });

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [reducedMotion]);

  // Expose lenis instance for imperative control
  useEffect(() => {
    if (lenisRef.current) {
      (window as Window & { lenis?: Lenis }).lenis = lenisRef.current;
    }
  }, []);

  return <>{children}</>;
}

