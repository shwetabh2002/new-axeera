'use client';

import { useEffect, useState, useCallback, useSyncExternalStore, useRef } from 'react';
import { subscribe, getState, setState, calculateActiveScene, getSceneProgress } from './store';

/**
 * Hook to subscribe to the global store
 */
export function useStore() {
  return useSyncExternalStore(subscribe, getState, getState);
}

/**
 * Hook for scroll progress
 */
export function useScrollProgress() {
  const store = useStore();
  return store.scrollProgress;
}

/**
 * Hook for active scene
 */
export function useActiveScene() {
  const store = useStore();
  return store.activeScene;
}

/**
 * Hook for scene-specific progress
 */
export function useSceneProgress(scene: number) {
  const scrollProgress = useScrollProgress();
  return getSceneProgress(scrollProgress, scene);
}

/**
 * Hook to detect reduced motion preference
 */
export function useReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    setState({ reducedMotion: mediaQuery.matches });

    const handler = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
      setState({ reducedMotion: e.matches });
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return reducedMotion;
}

/**
 * Hook to detect low-end devices
 */
export function useDeviceCapabilities() {
  const [isLowEnd, setIsLowEnd] = useState(false);

  useEffect(() => {
    const checkCapabilities = () => {
      // Check for hardware concurrency (CPU cores)
      const cores = navigator.hardwareConcurrency || 4;
      
      // Check for device memory (if available)
      const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory || 4;
      
      // Check for connection type
      const connection = (navigator as Navigator & { connection?: { effectiveType?: string } }).connection;
      const slowConnection = connection?.effectiveType === '2g' || connection?.effectiveType === 'slow-2g';
      
      // Determine if low-end
      const lowEnd = cores <= 2 || memory <= 2 || slowConnection;
      
      setIsLowEnd(lowEnd);
      setState({ isLowEnd: lowEnd });
    };

    checkCapabilities();
  }, []);

  return isLowEnd;
}

/**
 * Hook for mouse position tracking (normalized -1 to 1)
 */
export function useMousePosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let rafId: number;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = (e.clientX / window.innerWidth) * 2 - 1;
      targetY = (e.clientY / window.innerHeight) * 2 - 1;
    };

    // Smooth interpolation
    const animate = () => {
      currentX += (targetX - currentX) * 0.1;
      currentY += (targetY - currentY) * 0.1;
      
      setPosition({ x: currentX, y: currentY });
      setState({ mousePosition: { x: currentX, y: currentY } });
      
      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return position;
}

/**
 * Hook for intersection observer based visibility
 */
export function useInView(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting);
    }, {
      threshold: 0.1,
      ...options,
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [options]);

  return { ref, isInView };
}

/**
 * Hook for managing scroll-triggered animations
 */
export function useScrollTrigger() {
  const store = useStore();
  
  const updateScroll = useCallback((progress: number) => {
    const activeScene = calculateActiveScene(progress);
    setState({ 
      scrollProgress: progress,
      activeScene 
    });
  }, []);

  return {
    scrollProgress: store.scrollProgress,
    activeScene: store.activeScene,
    updateScroll,
  };
}

/**
 * Hook for loading state management
 */
export function useLoading() {
  const store = useStore();
  
  const setLoaded = useCallback((loaded: boolean) => {
    setState({ isLoaded: loaded });
  }, []);

  return {
    isLoaded: store.isLoaded,
    setLoaded,
  };
}

