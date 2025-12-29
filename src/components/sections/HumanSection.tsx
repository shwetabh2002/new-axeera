'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useSceneProgress, useStore } from '@/lib/hooks';
import { cn } from '@/lib/utils';

/**
 * Scene 5 — Human layer
 * 
 * - Reduce motion
 * - Gradient accent for warmth
 */
export function HumanSection() {
  const store = useStore();
  const sceneProgress = useSceneProgress(4);
  const containerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Animate based on scene progress
  useEffect(() => {
    if (!containerRef.current) return;
    
    const isActive = store.activeScene === 4;
    const opacity = isActive ? 1 : 0;
    
    gsap.to(containerRef.current, {
      opacity,
      duration: 0.6,
    });

    // Animate content
    if (isActive && contentRef.current) {
      const elements = contentRef.current.querySelectorAll('.animate-in');
      gsap.fromTo(
        elements,
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8, 
          stagger: 0.15,
          ease: 'power3.out',
        }
      );
    }
  }, [store.activeScene]);

  return (
    <section 
      ref={containerRef}
      id="about"
      className={cn(
        'section min-h-screen',
        'flex items-center justify-center',
        'relative opacity-0'
      )}
      aria-label="About"
    >
      <div ref={contentRef} className="max-w-4xl mx-auto px-6 text-center">
        {/* Gradient accent line */}
        <div className="animate-in flex justify-center mb-8">
          <div className="w-16 h-px bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400" />
        </div>

        {/* Human headline */}
        <h2 className="animate-in text-headline text-text-primary mb-8">
          Behind every system,
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
            there are people.
          </span>
        </h2>

        {/* Human copy */}
        <div className="animate-in space-y-6 text-body text-white/50 max-w-2xl mx-auto">
          <p>
            We're a small team of engineers, designers, and strategists 
            who believe that the best digital experiences come from 
            understanding both the technology and the humans who use it.
          </p>
          <p>
            We don't chase trends. We solve problems. And we do it with 
            the kind of care and precision that turns complex challenges 
            into elegant solutions.
          </p>
        </div>

        {/* Team stats with gradient values */}
        <div className="animate-in mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
          {[
            { value: '12', label: 'Team members' },
            { value: '8+', label: 'Years building' },
            { value: '∞', label: 'Curiosity' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-light text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 mb-2">
                {stat.value}
              </div>
              <div className="text-caption text-white/40 text-xs">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Closing gradient dot */}
        <div className="animate-in flex justify-center mt-12">
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-400" />
        </div>
      </div>
    </section>
  );
}
