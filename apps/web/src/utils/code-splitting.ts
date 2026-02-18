// Code Splitting - Route-based lazy loading

import React, { lazy, Suspense, ReactNode } from 'react';

// Loading fallback
interface LoadingProps {
  message?: string;
  minHeight?: string;
}

export function LoadingFallback({ message = 'Loading...', minHeight = '200px' }: LoadingProps) {
  return React.createElement('div', { 
    style: { minHeight, display: 'flex', alignItems: 'center', justifyContent: 'center' } 
  },
    React.createElement('div', { className: 'loading' },
      React.createElement('span', { className: 'spinner' }),
      React.createElement('p', null, message)
    )
  );
}

// Error fallback component  
function ErrorDiv() {
  return React.createElement('div', { style: { padding: '2rem', textAlign: 'center' } },
    React.createElement('h3', null, 'Something went wrong'),
    React.createElement('button', { onClick: () => window.location.reload() }, 'Refresh')
  );
}

// Lazy loaded components - only existing ones
export const AnalyticsDashboard = lazy(() => 
  import('../components/analytics/AnalyticsDashboard') as any
);

export const GoogleCalendarIntegration = lazy(() => 
  import('../components/integrations/GoogleCalendarIntegration') as any
);

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
      return React.createElement(ErrorDiv);
    }
    return this.props.children;
  }
}

// Preloader hook
export function usePreloadRoutes() {
  const preload = (route: string) => {
    switch (route) {
      case '/analytics': import('../components/analytics/AnalyticsDashboard'); break;
      case '/integrations/calendar': import('../components/integrations/GoogleCalendarIntegration'); break;
    }
  };
  return { preload };
}

// Re-export
export { lazy, Suspense };
