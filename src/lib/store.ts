/**
 * Global state management for scroll progress and scene control
 * Using vanilla JS for simplicity - no external state library needed
 */

type Listener = () => void;

interface Store {
  // Scroll progress (0 to 1, representing full page scroll)
  scrollProgress: number;
  
  // Current active scene/section (0-5)
  activeScene: number;
  
  // Whether the experience has fully loaded
  isLoaded: boolean;
  
  // Whether user prefers reduced motion
  reducedMotion: boolean;
  
  // Mouse position normalized (-1 to 1)
  mousePosition: { x: number; y: number };
  
  // Is user on a low-end device
  isLowEnd: boolean;
}

const initialState: Store = {
  scrollProgress: 0,
  activeScene: 0,
  isLoaded: false,
  reducedMotion: false,
  mousePosition: { x: 0, y: 0 },
  isLowEnd: false,
};

let state: Store = { ...initialState };
const listeners: Set<Listener> = new Set();

/**
 * Subscribe to state changes
 */
export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * Get current state (snapshot)
 */
export function getState(): Readonly<Store> {
  return state;
}

/**
 * Update state and notify listeners
 */
export function setState(partial: Partial<Store>): void {
  state = { ...state, ...partial };
  listeners.forEach((listener) => listener());
}

/**
 * Scene boundaries as scroll progress values
 * Each scene takes approximately equal scroll distance
 */
export const SCENE_BOUNDARIES = {
  HERO: 0,           // 0% - 16%
  REVEAL: 0.16,      // 16% - 33%
  CAPABILITIES: 0.33, // 33% - 50%
  WORK: 0.50,        // 50% - 67%
  HUMAN: 0.67,       // 67% - 83%
  CTA: 0.83,         // 83% - 100%
} as const;

/**
 * Calculate active scene from scroll progress
 */
export function calculateActiveScene(progress: number): number {
  if (progress < SCENE_BOUNDARIES.REVEAL) return 0;
  if (progress < SCENE_BOUNDARIES.CAPABILITIES) return 1;
  if (progress < SCENE_BOUNDARIES.WORK) return 2;
  if (progress < SCENE_BOUNDARIES.HUMAN) return 3;
  if (progress < SCENE_BOUNDARIES.CTA) return 4;
  return 5;
}

/**
 * Get progress within current scene (0 to 1)
 */
export function getSceneProgress(globalProgress: number, scene: number): number {
  const boundaries = Object.values(SCENE_BOUNDARIES);
  const start = boundaries[scene] ?? 0;
  const end = boundaries[scene + 1] ?? 1;
  const range = end - start;
  
  if (range === 0) return 0;
  
  const localProgress = (globalProgress - start) / range;
  return Math.max(0, Math.min(1, localProgress));
}

