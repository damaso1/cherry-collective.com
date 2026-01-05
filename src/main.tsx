import { StrictMode, Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';
import App from './App.tsx';

// Core providers
import { ImmersiveProvider } from './core/providers/ImmersiveProvider';
import { AudioManager, MuteToggle } from './core/audio/AudioManager';
import CherryCursor from './core/cursor/CherryCursor';
import CursorTrail from './core/cursor/CursorTrail';

// Lazy load heavy 3D components
const ImmersiveCanvas = lazy(() => import('./core/canvas/ImmersiveCanvas'));

// ============================================================================
// INTELLECTUAL PROPERTY PROTECTION
// ============================================================================

// Console warning for developers
const consoleWarning = () => {
  const warningStyle = [
    'color: #C41E3A',
    'font-size: 24px',
    'font-weight: bold',
    'text-shadow: 1px 1px 2px rgba(0,0,0,0.3)',
  ].join(';');

  const infoStyle = [
    'color: #FFB7C5',
    'font-size: 14px',
  ].join(';');

  const legalStyle = [
    'color: #888',
    'font-size: 11px',
  ].join(';');

  console.log('%c STOP!', warningStyle);
  console.log('%c This is a protected environment.', infoStyle);
  console.log('%c The "Immersive Orchard" UI and all associated code, designs, and assets are the exclusive intellectual property of Cherry Enterprise (ABN: 89 767 167 506).', legalStyle);
  console.log('%c Unauthorized copying, reverse engineering, or reproduction is strictly prohibited and may result in legal action under the Australian Copyright Act 1968 and international treaties.', legalStyle);
  console.log('%c For licensing inquiries: legal@cherry-collective.com', legalStyle);
};

// Right-click protection
const setupRightClickProtection = () => {
  document.addEventListener('contextmenu', (e) => {
    // Allow right-click on inputs and textareas for accessibility
    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
      return;
    }
    e.preventDefault();
    console.warn('[Cherry Enterprise] Right-click is disabled on this site.');
  });
};

// Prevent common dev tools shortcuts (optional deterrent)
const setupDevToolsProtection = () => {
  document.addEventListener('keydown', (e) => {
    // Prevent F12
    if (e.key === 'F12') {
      e.preventDefault();
      console.warn('[Cherry Enterprise] Developer tools access is monitored.');
    }
    // Prevent Ctrl+Shift+I (Dev Tools)
    if (e.ctrlKey && e.shiftKey && e.key === 'I') {
      e.preventDefault();
    }
    // Prevent Ctrl+Shift+J (Console)
    if (e.ctrlKey && e.shiftKey && e.key === 'J') {
      e.preventDefault();
    }
    // Prevent Ctrl+U (View Source)
    if (e.ctrlKey && e.key === 'u') {
      e.preventDefault();
      console.warn('[Cherry Enterprise] View source is disabled.');
    }
    // Prevent Ctrl+S (Save Page)
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
    }
  });
};

// Disable text selection on specific elements (not all, for accessibility)
const setupSelectionProtection = () => {
  const style = document.createElement('style');
  style.textContent = `
    .protected-content,
    .cherry-bubble,
    .immersive-canvas,
    canvas {
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }
  `;
  document.head.appendChild(style);
};

// Initialize all protection measures
if (typeof window !== 'undefined') {
  consoleWarning();
  setupRightClickProtection();
  setupDevToolsProtection();
  setupSelectionProtection();
}

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

// Loading fallback for 3D canvas
const CanvasLoader = () => (
  <div className="fixed inset-0 -z-10 bg-bark-dark">
    <div className="absolute inset-0 bg-gradient-radial from-cherry-dark/20 via-transparent to-transparent" />
  </div>
);

// Main app wrapper with all providers
const Root = () => {
  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ImmersiveProvider>
          <AudioManager>
            {/* 3D Background Canvas */}
            <Suspense fallback={<CanvasLoader />}>
              <ImmersiveCanvas enableOrchard={true} enableParticles={true} />
            </Suspense>

            {/* Custom Cursor */}
            <CherryCursor />
            <CursorTrail />

            {/* Main App */}
            <App />

            {/* Audio Mute Toggle */}
            <MuteToggle />
          </AudioManager>
        </ImmersiveProvider>
      </QueryClientProvider>
    </StrictMode>
  );
};

createRoot(document.getElementById('root')!).render(<Root />);
