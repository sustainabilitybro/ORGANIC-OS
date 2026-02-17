// Code Splitting - Route-based lazy loading
// @ts-nocheck

import { lazy } from 'react';

// Lazy loaded components
export const AnalyticsDashboard = lazy(() => 
  import('../components/analytics/AnalyticsDashboard').then(mod => ({ default: mod.default }))
);

export const OnboardingFlow = lazy(() => 
  import('../components/onboarding/OnboardingFlow').then(mod => ({ default: mod.default }))
);

export const DataExport = lazy(() => 
  import('../components/data-export/DataExport').then(mod => ({ default: mod.default }))
);

export const GoogleCalendarIntegration = lazy(() => 
  import('../components/integrations/GoogleCalendarIntegration').then(mod => ({ default: mod.default }))
);

export const PushNotifications = lazy(() => 
  import('../components/ui/PushNotifications').then(mod => ({ default: mod.default }))
);
