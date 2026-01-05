# Cherry Collective

**The Immersive Cherry Orchard UI** - A premium 3D interactive experience for B2B SaaS.

## Features

### Visual Environment
- 3D Cherry Orchard scene with React Three Fiber
- Cherry blossom particle system with falling petals
- Dynamic parallax depth layers
- Bark-dark theme (#1a0f0f) with glowing cherry-red accents

### Interaction Design
- **Cherry Bubble Components** - Organic, fruit-shaped UI elements
- **Magnetic Elements** - UI components that lean toward cursor
- **Page Transitions** - Cherry particle dissolve/reform effects
- **Custom Cursor** - Cherry cursor with petal trail

### Audio Identity
- Ambient orchard soundscape
- Synthesized interaction sounds (Web Audio API)
- Transition sweeps (descending dissolve, ascending reform)
- Hover sparkles and click feedback

### Pages
- **Landing** - Hero tree with credential bubbles
- **Dashboard** - "The Harvest" with cherry basket leads
- **Pricing** - "Ripeness Tiers" from green to deep red
- **Lead Detail** - Large ripeness score bubble
- **Basket** - Collection visualization

## Tech Stack

- **React 19** + TypeScript
- **Vite 7** - Build tooling
- **Three.js** / React Three Fiber - 3D graphics
- **Framer Motion** - 2D animations
- **Tailwind CSS 4** - Styling
- **GSAP** - Complex animations
- **Howler.js** - Audio management

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── core/
│   ├── canvas/          # 3D environment (Three.js)
│   ├── cursor/          # Custom cursor system
│   ├── audio/           # Sound management
│   ├── transitions/     # Page transitions
│   └── providers/       # Context providers
├── components/
│   ├── cherry/          # Organic bubble components
│   ├── effects/         # Visual effects (magnetic, ripple)
│   ├── icons/           # Cherry icons
│   ├── ui/              # UI components
│   ├── layout/          # Layout components
│   └── dashboard/       # Dashboard widgets
├── pages/               # Page components
└── hooks/               # Custom hooks
```

## Design System

### Colors
- **Cherry Ripe:** #C41E3A (primary)
- **Cherry Dark:** #8B0000
- **Cherry Light:** #FF6B6B
- **Cherry Bright:** #FF1744
- **Bark Dark:** #1A0A0A (background)
- **Stem Light:** #32CD32 (success)
- **Gold:** #FFD700 (highlight)

### Typography
- **Display:** Playfair Display
- **Body:** Nunito
- **Mono:** JetBrains Mono

## Deployment

Configured for Vercel deployment with SPA routing.

```bash
vercel --prod
```

---

**Cherry Collective** - ABN: 89 767 167 506
https://cherry-collective.com
