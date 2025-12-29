'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useSceneProgress, useStore } from '@/lib/hooks';
import { cn } from '@/lib/utils';

/**
 * Scene 4 — Work / Proof
 * 
 * Projects with gradient accents
 */

const PROJECTS = [
  {
    id: 'project-1',
    title: 'Neural Interface',
    category: 'Product Design',
    year: '2024',
    gradient: 'from-indigo-500 to-purple-500',
  },
  {
    id: 'project-2',
    title: 'Quantum Dashboard',
    category: 'Web Application',
    year: '2024',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    id: 'project-3',
    title: 'Flow Protocol',
    category: 'System Design',
    year: '2023',
    gradient: 'from-pink-500 to-indigo-500',
  },
];

export function WorkSection() {
  const store = useStore();
  const sceneProgress = useSceneProgress(3);
  const containerRef = useRef<HTMLElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Animate based on scene progress
  useEffect(() => {
    if (!containerRef.current) return;
    
    const isActive = store.activeScene === 3;
    const opacity = isActive ? 1 : 0;
    
    gsap.to(containerRef.current, {
      opacity,
      duration: 0.5,
    });

    // Stagger cards
    if (isActive) {
      gsap.fromTo(
        cardsRef.current.filter(Boolean),
        { opacity: 0, y: 50, rotateY: -15 },
        { 
          opacity: 1, 
          y: 0,
          rotateY: 0,
          duration: 0.8, 
          stagger: 0.2,
          ease: 'power3.out',
        }
      );
    }
  }, [store.activeScene]);

  // Hover effect
  useEffect(() => {
    cardsRef.current.forEach((card, index) => {
      if (!card) return;
      
      const isHovered = hoveredIndex === index;
      const isOther = hoveredIndex !== null && hoveredIndex !== index;
      
      gsap.to(card, {
        scale: isHovered ? 1.05 : 1,
        opacity: isOther ? 0.5 : 1,
        duration: 0.3,
        ease: 'power2.out',
      });
    });
  }, [hoveredIndex]);

  return (
    <section 
      ref={containerRef}
      id="work"
      className={cn(
        'section min-h-screen',
        'flex items-center justify-center',
        'relative opacity-0'
      )}
      aria-label="Work"
    >
      <div className="max-w-6xl mx-auto px-6 w-full">
        {/* Section header */}
        <div className="mb-16">
          <div className="text-caption text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 mb-4">
            [ SELECTED WORK ]
          </div>
          <h2 className="text-headline text-text-primary">
            Proof of system
          </h2>
        </div>

        {/* Projects grid */}
        <div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          style={{ perspective: '1000px' }}
        >
          {PROJECTS.map((project, index) => (
            <div
              key={project.id}
              ref={(el) => { cardsRef.current[index] = el; }}
              className={cn(
                'group relative aspect-[4/3]',
                'bg-void-surface border border-neutral-800 rounded-lg',
                'cursor-pointer overflow-hidden',
                'transition-colors duration-300',
                'hover:border-purple-500/50'
              )}
              style={{ transformStyle: 'preserve-3d' }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Background gradient */}
              <div 
                className={cn(
                  'absolute inset-0 opacity-10 group-hover:opacity-25 transition-opacity duration-500',
                  `bg-gradient-to-br ${project.gradient}`
                )}
              />

              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-between">
                {/* Top */}
                <div className="flex justify-between items-start">
                  <span className="text-mono text-xs text-white/40">
                    {project.year}
                  </span>
                  <span 
                    className={cn(
                      'w-2 h-2 rounded-full bg-gradient-to-r',
                      project.gradient
                    )}
                  />
                </div>

                {/* Bottom */}
                <div>
                  <p className="text-caption text-white/40 mb-2">
                    {project.category}
                  </p>
                  <h3 className="text-title text-text-primary group-hover:text-white transition-colors">
                    {project.title}
                  </h3>
                </div>
              </div>

              {/* Hover arrow */}
              <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor"
                  className="text-white/60"
                >
                  <path d="M7 17L17 7M17 7H7M17 7V17" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* View all link with gradient hover */}
        <div className="mt-12 text-center">
          <a 
            href="#"
            className="inline-flex items-center gap-2 text-caption text-white/50 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-indigo-400 hover:via-purple-400 hover:to-pink-400 transition-all duration-300"
          >
            View all projects
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" strokeWidth="1.5" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
