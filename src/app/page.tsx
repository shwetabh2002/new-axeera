'use client';

import dynamic from 'next/dynamic';
import { SmoothScrollProvider } from '@/components/providers';
import { Navigation, ScrollIndicator, SceneIndicator, GlowingOrb } from '@/components/ui';
import { 
  HeroSection, 
  RevealSection, 
  CapabilitiesSection, 
  WorkSection, 
  HumanSection, 
  CTASection 
} from '@/components/sections';
import { useMousePosition, useReducedMotion, useDeviceCapabilities } from '@/lib/hooks';

// Dynamically import the 3D scene to avoid SSR issues
const Scene3D = dynamic(
  () => import('@/components/3d').then(mod => mod.Scene3D),
  { 
    ssr: false,
    loading: () => (
      <div className="canvas-container bg-void grain" aria-hidden="true" />
    ),
  }
);

/**
 * Axeera Homepage
 * 
 * A futuristic, technically sophisticated, 3D-driven agency website
 * that communicates engineering depth, system thinking, and technical confidence.
 * 
 * Architecture:
 * - Single 3D canvas as fixed background
 * - Content overlay scrolls over 3D scene
 * - Scroll progress drives camera position
 * - Each section reveals based on scroll position
 * 
 * Performance:
 * - Dynamic import for 3D scene
 * - Reduced motion support
 * - Device capability detection
 * - GPU-aware rendering
 */
export default function HomePage() {
  // Initialize global hooks at the top level
  useMousePosition();
  useReducedMotion();
  useDeviceCapabilities();

  return (
    <SmoothScrollProvider>
      {/* Glowing orb cursor effect */}
      <GlowingOrb />

      {/* 3D Background - Fixed canvas */}
      <Scene3D />

      {/* Content Layer - Scrolls over 3D */}
      <div className="content-layer grain">
        {/* Navigation */}
        <Navigation />

        {/* Scroll indicator (hero only) */}
        <ScrollIndicator />

        {/* Scene progress indicator */}
        <SceneIndicator />

        {/* Main content sections */}
        <main>
          {/* Scene 1: System Boot / Hero */}
          <HeroSection />

          {/* Scene 2: Dimensional Reveal */}
          <RevealSection />

          {/* Scene 3: Capabilities as Systems */}
          <CapabilitiesSection />

          {/* Scene 4: Work / Proof */}
          <WorkSection />

          {/* Scene 5: Human Layer */}
          <HumanSection />

          {/* Scene 6: CTA */}
          <CTASection />
        </main>
      </div>
    </SmoothScrollProvider>
  );
}
