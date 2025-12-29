'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useSceneProgress, useStore } from '@/lib/hooks';
import { cn } from '@/lib/utils';

/**
 * Scene 3 — Capabilities as systems
 * 
 * Gradient accent on section label and icons
 */

const CAPABILITIES = [
  {
    id: 'architecture',
    label: 'Architecture',
    description: 'Foundational structures that scale',
    icon: '◇',
  },
  {
    id: 'scale',
    label: 'Scale',
    description: 'Systems that grow with purpose',
    icon: '⬡',
  },
  {
    id: 'performance',
    label: 'Performance',
    description: 'Optimized to the last millisecond',
    icon: '△',
  },
  {
    id: 'experience',
    label: 'Experience',
    description: 'Interfaces that feel inevitable',
    icon: '○',
  },
];

export function CapabilitiesSection() {
  const store = useStore();
  const sceneProgress = useSceneProgress(2);
  const containerRef = useRef<HTMLElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Animate based on scene progress
  useEffect(() => {
    if (!containerRef.current) return;
    
    const isActive = store.activeScene === 2;
    const opacity = isActive ? 1 : 0;
    
    gsap.to(containerRef.current, {
      opacity,
      duration: 0.5,
    });

    // Stagger items
    if (isActive) {
      gsap.fromTo(
        itemsRef.current.filter(Boolean),
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.6, 
          stagger: 0.15,
          ease: 'power3.out',
        }
      );
    }
  }, [store.activeScene]);

  return (
    <section 
      ref={containerRef}
      className={cn(
        'section min-h-screen',
        'flex items-center justify-center',
        'relative opacity-0'
      )}
      aria-label="Capabilities"
    >
      <div className="max-w-6xl mx-auto px-6 w-full">
        {/* Section header */}
        <div className="mb-16 text-center">
          <div className="text-caption text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 mb-4">
            [ SYSTEM CAPABILITIES ]
          </div>
          <h2 className="text-headline text-text-primary">
            What we build
          </h2>
        </div>

        {/* Capabilities grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {CAPABILITIES.map((capability, index) => (
            <div
              key={capability.id}
              ref={(el) => { itemsRef.current[index] = el; }}
              className={cn(
                'group relative',
                'p-6 border border-neutral-800 rounded-lg',
                'bg-void-elevated/50 backdrop-blur-sm',
                'hover:border-purple-500/50 transition-all duration-500',
                'cursor-default'
              )}
            >
              {/* Icon with gradient */}
              <div className="text-4xl text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 mb-6 opacity-60 group-hover:opacity-100 transition-opacity">
                {capability.icon}
              </div>

              {/* Label */}
              <h3 className="text-title text-text-primary mb-2">
                {capability.label}
              </h3>

              {/* Description */}
              <p className="text-body text-white/40 text-sm">
                {capability.description}
              </p>

              {/* Corner gradient accent */}
              <div className="absolute top-0 right-0 w-12 h-12 overflow-hidden rounded-tr-lg">
                <div className="absolute top-0 right-0 w-full h-px bg-gradient-to-l from-purple-500/50 to-transparent" />
                <div className="absolute top-0 right-0 h-full w-px bg-gradient-to-b from-purple-500/50 to-transparent" />
              </div>

              {/* Index number */}
              <div className="absolute bottom-4 right-4 text-mono text-xs text-white/20">
                0{index + 1}
              </div>
            </div>
          ))}
        </div>

        {/* Technical footer */}
        <div className="mt-16 flex justify-between text-mono text-xs text-white/30">
          <span>capabilities.length: {CAPABILITIES.length}</span>
          <span>render.mode: abstract</span>
        </div>
      </div>
    </section>
  );
}
