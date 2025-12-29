'use client';

import { useStore } from '@/lib/hooks';
import { cn } from '@/lib/utils';

const SCENE_NAMES = [
  'System',
  'Depth',
  'Capabilities',
  'Work',
  'Human',
  'Connect',
];

/**
 * Vertical scene indicator showing current position in the experience
 * Uses gradient accent for active state
 */
export function SceneIndicator() {
  const store = useStore();

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-end gap-4 pointer-events-none">
      {SCENE_NAMES.map((name, index) => {
        const isActive = store.activeScene === index;
        const isPast = store.activeScene > index;
        
        return (
          <div 
            key={name}
            className="flex items-center gap-3"
          >
            <span 
              className={cn(
                'text-caption text-xs transition-all duration-500',
                isActive 
                  ? 'opacity-100 translate-x-0 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400' 
                  : 'opacity-0 translate-x-2 text-white/60'
              )}
            >
              {name}
            </span>
            <div 
              className={cn(
                'w-2 h-2 rounded-full transition-all duration-500',
                isActive 
                  ? 'bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 scale-125 shadow-lg shadow-purple-500/50' 
                  : isPast 
                    ? 'bg-purple-400/50' 
                    : 'bg-neutral-700'
              )}
            />
          </div>
        );
      })}
    </div>
  );
}
