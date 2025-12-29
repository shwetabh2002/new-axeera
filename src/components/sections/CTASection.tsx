'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useSceneProgress, useStore } from '@/lib/hooks';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

/**
 * Scene 6 — CTA
 * 
 * - Calm, confident call to action
 * - Gradient accent on key phrase
 */
export function CTASection() {
  const store = useStore();
  const sceneProgress = useSceneProgress(5);
  const containerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Animate based on scene progress
  useEffect(() => {
    if (!containerRef.current) return;
    
    const isActive = store.activeScene === 5;
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
        { opacity: 0, y: 40 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1, 
          stagger: 0.2,
          ease: 'power3.out',
        }
      );
    }
  }, [store.activeScene]);

  return (
    <section 
      ref={containerRef}
      id="contact"
      className={cn(
        'section min-h-screen',
        'flex items-center justify-center',
        'relative opacity-0'
      )}
      aria-label="Contact"
    >
      <div ref={contentRef} className="max-w-3xl mx-auto px-6 text-center">
        {/* Main CTA headline */}
        <h2 className="animate-in text-display text-text-primary mb-8">
          <span className="whitespace-nowrap">Let's build something</span>
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 whitespace-nowrap">
            meaningful & great.
          </span>
        </h2>

        {/* Subtitle */}
        <p className="animate-in text-body text-white/50 mb-12 max-w-xl mx-auto">
          Have a complex problem that needs an elegant solution? 
          Let's talk about how we can help.
        </p>

        {/* CTA Button */}
        <div className="animate-in">
          <Button variant="primary" size="lg">
            Start a conversation
          </Button>
        </div>

        {/* Alternative contact */}
        <p className="animate-in mt-8 text-caption text-white/40">
          Or reach us directly at{' '}
          <a 
            href="mailto:hello@axeera.com" 
            className="text-white/60 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-indigo-400 hover:via-purple-400 hover:to-pink-400 transition-all duration-300"
          >
            hello@axeera.com
          </a>
        </p>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 right-0 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-mono text-xs text-white/30">
            © 2024 Axeera. All systems operational.
          </div>
          
          <div className="flex items-center gap-6">
            <a 
              href="#" 
              className="text-caption text-xs text-white/30 hover:text-white/60 transition-colors"
            >
              Twitter
            </a>
            <a 
              href="#" 
              className="text-caption text-xs text-white/30 hover:text-white/60 transition-colors"
            >
              LinkedIn
            </a>
            <a 
              href="#" 
              className="text-caption text-xs text-white/30 hover:text-white/60 transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </section>
  );
}
