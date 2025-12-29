'use client';

import { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import { useStore } from '@/lib/hooks';
import { cn } from '@/lib/utils';

/**
 * Navigation component
 * Minimal, fixed header with gradient accent on contact
 */
export function Navigation() {
  const store = useStore();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollProgress, setLastScrollProgress] = useState(0);
  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Show/hide based on scroll direction
    if (store.scrollProgress > lastScrollProgress && store.scrollProgress > 0.1) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
    setLastScrollProgress(store.scrollProgress);
  }, [store.scrollProgress, lastScrollProgress]);

  useEffect(() => {
    if (!navRef.current) return;
    
    gsap.to(navRef.current, {
      y: isVisible ? 0 : -100,
      duration: 0.5,
      ease: 'power3.out',
    });
  }, [isVisible]);

  // Animate logo on load
  useEffect(() => {
    if (!logoRef.current || !store.isLoaded) return;
    
    gsap.fromTo(logoRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.5 }
    );
  }, [store.isLoaded]);

  return (
    <nav 
      ref={navRef}
      className={cn(
        'fixed top-0 left-0 right-0 z-50',
        'px-6 py-5 md:px-12 md:py-6',
        'flex items-center justify-between',
        'pointer-events-auto'
      )}
    >
      {/* Logo */}
      <div 
        ref={logoRef}
        className="opacity-0"
      >
        <a 
          href="#" 
          className="text-mono text-text-primary tracking-wider hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-indigo-400 hover:via-purple-400 hover:to-pink-400 transition-all duration-300"
          aria-label="Axeera Home"
        >
          AXEERA
        </a>
      </div>

      {/* Minimal nav links */}
      <div className="hidden md:flex items-center gap-8">
        <NavLink href="#work">Work</NavLink>
        <NavLink href="#about">About</NavLink>
        <NavLink href="#contact" accent>Contact</NavLink>
      </div>

      {/* Mobile menu button */}
      <button 
        className="md:hidden p-2 text-white/50 hover:text-white transition-colors"
        aria-label="Menu"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <line x1="4" y1="8" x2="20" y2="8" />
          <line x1="4" y1="16" x2="20" y2="16" />
        </svg>
      </button>
    </nav>
  );
}

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  accent?: boolean;
}

function NavLink({ href, children, accent }: NavLinkProps) {
  return (
    <a
      href={href}
      className={cn(
        'text-caption tracking-wider transition-all duration-300',
        accent 
          ? 'text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 hover:from-indigo-300 hover:via-purple-300 hover:to-pink-300' 
          : 'text-white/50 hover:text-white'
      )}
    >
      {children}
    </a>
  );
}
