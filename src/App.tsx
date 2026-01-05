import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DashboardLayout } from './components/layout';
import { PageTransitionProvider } from './core/transitions';
import {
  SpatialLandingPage,
  LandingPage,
  DashboardPage,
  LeadDetailPage,
  BasketPage,
  PricingPage,
} from './pages';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <PageTransitionProvider>
          <Routes>
            {/* Public routes */}
            {/* Use SpatialLandingPage for immersive 3D tree hero */}
            <Route path="/" element={<SpatialLandingPage />} />
            {/* Keep classic landing available at /classic */}
            <Route path="/classic" element={<LandingPage />} />
            <Route path="/pricing" element={<PricingPage />} />

            {/* Dashboard routes - wrapped in layout */}
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/leads" element={<DashboardPage />} />
              <Route path="/leads/:id" element={<LeadDetailPage />} />
              <Route path="/basket" element={<BasketPage />} />
              <Route path="/analytics" element={<DashboardPage />} />
              <Route path="/activity" element={<DashboardPage />} />
              <Route path="/team" element={<DashboardPage />} />
              <Route path="/settings" element={<DashboardPage />} />
              <Route path="/help" element={<DashboardPage />} />
            </Route>

            {/* Catch all - redirect to landing */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </PageTransitionProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
