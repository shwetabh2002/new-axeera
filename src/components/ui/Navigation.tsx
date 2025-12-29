'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useStore } from '@/lib/hooks';
import { cn } from '@/lib/utils';

/**
 * Axeera Logo Icon - Triangle with gradient
 */
function AxeeraIcon({ className }: { className?: string }) {
  return (
    <svg 
      width="28" 
      height="28" 
      viewBox="0 0 32 32" 
      fill="none" 
      className={className}
    >
      <path 
        d="M6 24L16 6L26 24H6Z" 
        stroke="url(#logoGradient)" 
        strokeWidth="2.5" 
        fill="none"
      />
      <circle cx="16" cy="19" r="2" fill="url(#logoGradient)"/>
      <defs>
        <linearGradient id="logoGradient" x1="6" y1="6" x2="26" y2="24" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#818cf8"/>
          <stop offset="50%" stopColor="#c084fc"/>
          <stop offset="100%" stopColor="#f472b6"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

/**
 * Navigation component
 * Fixed header that always stays visible
 */
export function Navigation() {
  const store = useStore();
  const logoRef = useRef<HTMLDivElement>(null);

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
      className={cn(
        'fixed top-0 left-0 right-0 z-50',
        'px-6 py-5 md:px-12 md:py-6',
        'flex items-center justify-between',
        'pointer-events-auto'
      )}
    >
      {/* Logo with Icon */}
      <div 
        ref={logoRef}
        className="opacity-0"
      >
        <a 
          href="#" 
          className="flex items-center gap-3 group"
          aria-label="Axeera Home"
        >
          <AxeeraIcon className="transition-transform duration-300 group-hover:scale-110" />
          <span className="text-xl md:text-2xl font-bold tracking-wide text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:via-purple-400 group-hover:to-pink-400 transition-all duration-300">
            AXEERA<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">.</span>
          </span>
        </a>
      </div>

      {/* Nav links - larger text */}
      <div className="hidden md:flex items-center gap-10">
        <NavLink href="#work">Work</NavLink>
        <NavLink href="#about">About</NavLink>
        <NavLink href="#contact" accent>Contact</NavLink>
      </div>

      {/* Mobile menu button */}
      <button 
        className="md:hidden p-2 text-white/50 hover:text-white transition-colors"
        aria-label="Menu"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
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
        'text-base md:text-lg font-medium tracking-wide transition-all duration-300',
        accent 
          ? 'text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 hover:from-indigo-300 hover:via-purple-300 hover:to-pink-300' 
          : 'text-white/60 hover:text-white'
      )}
    >
      {children}
    </a>
  );
}
