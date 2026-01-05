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
