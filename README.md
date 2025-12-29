# Axeera — Engineering Digital Systems Beyond the Screen

A futuristic, technically sophisticated, 3D-driven agency website that communicates engineering depth, system thinking, and technical confidence.

## 🎯 Design Philosophy

The website is built as a **live digital system**, not a marketing template. Every element conveys:
- **Engineering depth** through technical precision
- **System thinking** through structured, hierarchical design
- **Technical confidence** through restrained, purposeful motion

> "These people understand complex systems and can turn them into elegant experiences."

## 🏗 Architecture

```
src/
├── app/                    # Next.js App Router
│   ├── globals.css         # Design system & CSS variables
│   ├── layout.tsx          # Root layout with fonts & metadata
│   └── page.tsx            # Homepage orchestrator
├── components/
│   ├── 3d/                 # Three.js / React Three Fiber
│   │   ├── Scene3D.tsx     # Primary 3D environment
│   │   ├── ParticleField.tsx   # Floating particle system
│   │   ├── GridPlane.tsx   # Technical ground grid
│   │   ├── CameraController.tsx # Scroll-driven camera
│   │   └── AbstractShapes.tsx  # Capability visualizations
│   ├── sections/           # Page sections (6 scenes)
│   │   ├── HeroSection.tsx     # Scene 1: System boot
│   │   ├── RevealSection.tsx   # Scene 2: Dimensional reveal
│   │   ├── CapabilitiesSection.tsx # Scene 3: Abstract systems
│   │   ├── WorkSection.tsx     # Scene 4: Floating panels
│   │   ├── HumanSection.tsx    # Scene 5: Warm human layer
│   │   └── CTASection.tsx      # Scene 6: Confident close
│   ├── ui/                 # UI overlay components
│   │   ├── Navigation.tsx
│   │   ├── ScrollIndicator.tsx
│   │   ├── SceneIndicator.tsx
│   │   └── Button.tsx
│   └── providers/
│       └── SmoothScrollProvider.tsx # Lenis + GSAP integration
├── lib/
│   ├── store.ts            # Global state management
│   ├── hooks.ts            # Custom React hooks
│   └── utils.ts            # Utility functions
└── shaders/
    ├── noise.glsl.ts       # Simplex noise, grain, vignette
    ├── particles.glsl.ts   # Particle vertex/fragment shaders
    └── grid.glsl.ts        # Grid plane shaders
```

## 🎬 Experience Narrative

### Scene 1 — System Boot (Hero)
- Fullscreen 3D environment with dark base
- Subtle shader grain for texture
- Slow camera drift in Z-axis depth
- Single precise headline: "Engineering digital systems beyond the screen."
- No visual clutter

### Scene 2 — Dimensional Reveal
- Scrolling moves camera forward through space
- UI elements at different depth layers
- Subtle parallax tied to cursor movement
- Engineered, purposeful motion

### Scene 3 — Capabilities as Systems
- Abstract geometric representations:
  - **Architecture** — Octahedron (foundational)
  - **Scale** — Icosahedron (complexity)
  - **Performance** — Tetrahedron (efficient)
  - **Experience** — Torus (continuous)
- Minimal labels, visuals explain first

### Scene 4 — Work / Proof
- Projects as floating panels in 3D space
- Hover triggers subtle camera focus
- No verbose descriptions

### Scene 5 — Human Layer
- Reduced motion
- Warmer accent color (#f6ad55)
- Short, human-written copy
- Team presence

### Scene 6 — CTA
- Calm, confident close
- "Let's engineer something meaningful."

## 🎮 3D & Motion Rules

1. **Camera motion > Object motion** — The world moves, not individual objects
2. **No constant animation loops** — Motion is triggered, not endless
3. **Custom easing** — Consistent `ease-out-expo` feel throughout
4. **Motion breathes** — Pauses and rests are intentional
5. **Depth-based journey** — Camera travels through Z-axis

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| 3D Engine | Three.js via React Three Fiber |
| Motion | GSAP + ScrollTrigger |
| Smooth Scroll | Lenis |
| Styling | Tailwind CSS v4 |

## ⚡ Performance

- **Dynamic imports** for 3D scene (no SSR)
- **Device capability detection** for adaptive rendering
- **Reduced motion support** respects user preferences
- **GPU-aware** particle count adjustment
- **Single canvas** for entire experience

## 🎨 Design System

### Colors
```css
--void: #0a0a0b          /* Primary background */
--void-elevated: #111113  /* Elevated surfaces */
--accent-cold: #4fd1c5    /* Technical accent */
--accent-warm: #f6ad55    /* Human warmth */
```

### Typography
- **Display**: clamp(2.5rem, 8vw, 6rem), weight 300
- **Headline**: clamp(1.75rem, 5vw, 3.5rem), weight 400
- **Body**: clamp(1rem, 1.5vw, 1.125rem), weight 400
- **Caption**: 0.875rem, uppercase, tracked

### Easing
```css
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1)
--ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1)
```

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## ♿ Accessibility

- Respects `prefers-reduced-motion`
- Maintains text readability at all times
- Proper ARIA labels on interactive elements
- Focus-visible styling for keyboard navigation
- Graceful degradation for low-end devices

## 📝 Key Files Explained

### `CameraController.tsx`
Manages all camera motion based on scroll progress. Uses keyframe positions for each scene and smoothly interpolates between them. Adds subtle mouse parallax.

### `SmoothScrollProvider.tsx`
Integrates Lenis smooth scrolling with GSAP ScrollTrigger. Tracks global scroll progress and updates the store, which drives the entire 3D experience.

### `store.ts`
Simple vanilla JS state management. No external library needed. Tracks:
- Scroll progress (0-1)
- Active scene (0-5)
- Mouse position (normalized -1 to 1)
- Device capabilities

### Shaders
Custom GLSL shaders for:
- Particle system with depth-based alpha
- Grid plane with multi-scale pattern
- All optimized for performance

---

Built with precision and restraint.

**Axeera** — Engineering digital systems beyond the screen.
