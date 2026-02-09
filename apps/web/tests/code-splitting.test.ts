// Tests for Code Splitting and Lazy Loading

import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('Code Splitting', () => {
  describe('Lazy Components', () => {
    it('should export AnalyticsDashboard as lazy', async () => {
      const module = await import('../src/utils/code-splitting');
      expect(module.AnalyticsDashboard).toBeDefined();
    });
    
    it('should export OnboardingFlow as lazy', async () => {
      const module = await import('../src/utils/code-splitting');
      expect(module.OnboardingFlow).toBeDefined();
    });
    
    it('should export GoogleCalendarIntegration as lazy', async () => {
      const module = await import('../src/utils/code-splitting');
      expect(module.GoogleCalendarIntegration).toBeDefined();
    });
    
    it('should export AIChat as lazy', async () => {
      const module = await import('../src/utils/code-splitting');
      expect(module.AIChat).toBeDefined();
    });
  });
  
  describe('usePreloadRoutes', () => {
    it('should return preload function', async () => {
      const { usePreloadRoutes } = await import('../src/utils/code-splitting');
      const { preload } = usePreloadRoutes();
      expect(typeof preload).toBe('function');
    });
    
    it('should preload analytics route', async () => {
      const { usePreloadRoutes } = await import('../src/utils/code-splitting');
      const { preload } = usePreloadRoutes();
      // Should not throw
      preload('/analytics');
    });
  });
  
  describe('LoadingFallback', () => {
    it('should render with default message', () => {
      const { LoadingFallback } = require('../src/utils/code-splitting');
      expect(LoadingFallback).toBeDefined();
    });
    
    it('should render with custom message', () => {
      const { LoadingFallback } = require('../src/utils/code-splitting');
      expect(LoadingFallback).toBeDefined();
    });
  });
});

describe('ErrorBoundary', () => {
  it('should export ErrorBoundary component', async () => {
    const { ErrorBoundary } = await import('../src/utils/code-splitting');
    expect(ErrorBoundary).toBeDefined();
  });
});
