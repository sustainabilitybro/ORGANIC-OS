// Code Splitting - Route-based lazy loading

import { lazy, Suspense, ReactNode } from 'react';

// Lazy loaded components
export const AnalyticsDashboard = lazy(() =>
  import('../components/analytics/AnalyticsDashboard').catch(() => ({
    default: () => <div>Loading analytics...</div>
  }))
);

export const OnboardingFlow = lazy(() =>
  import('../components/onboarding/OnboardingFlow').catch(() => ({
    default: () => <div>Loading onboarding...</div>
  }))
);

export const GoogleCalendarIntegration = lazy(() =>
  import('../components/integrations/GoogleCalendarIntegration').catch(() => ({
    default: () => <div>Loading integration...</div>
  }))
);

export const AIChat = lazy(() =>
  import('../components/ai/AIChat').catch(() => ({
    default: () => <div>Loading AI...</div>
  }))
);

export const ReportGenerator = lazy(() =>
  import('../components/reports/ReportGenerator').catch(() => ({
    default: () => <div>Loading report...</div>
  }))
);

// Loading fallback
interface LoadingProps {
  message?: string;
  minHeight?: string;
}

export function LoadingFallback({ message = 'Loading...', minHeight = '200px' }: LoadingProps) {
  return (
    <div style={{ minHeight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="loading">
        <span className="spinner" />
        <p>{message}</p>
      </div>
    </div>
  );
}

// Error boundary
interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<
  { children: ReactNode },
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };
  
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h3>Something went wrong</h3>
          <button onClick={() => window.location.reload()}>Refresh</button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Preloader hook
export function usePreloadRoutes() {
  const preload = (route: string) => {
    switch (route) {
      case '/analytics': import('../components/analytics/AnalyticsDashboard'); break;
      case '/onboarding': import('../components/onboarding/OnboardingFlow'); break;
      case '/ai': import('../components/ai/AIChat'); break;
    }
  };
  return { preload };
}

// Re-export
export { lazy, Suspense };
