// Tests for Code Splitting and Lazy Loading

import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('Code Splitting', () => {
  describe('Lazy Components', () => {
    it('should export AnalyticsDashboard as lazy', async () => {
      const module = await import('../src/utils/code-splitting');
      expect(module.AnalyticsDashboard).toBeDefined();
    });
    
    it('should export GoogleCalendarIntegration as lazy', async () => {
      const module = await import('../src/utils/code-splitting');
      expect(module.GoogleCalendarIntegration).toBeDefined();
    });
  });
  
  describe('LoadingFallback', () => {
    it('should export LoadingFallback function', async () => {
      const { LoadingFallback } = await import('../src/utils/code-splitting');
      expect(LoadingFallback).toBeDefined();
      expect(typeof LoadingFallback).toBe('function');
    });
  });
});

describe('ErrorBoundary', () => {
  it('should export ErrorBoundary component', async () => {
    const { ErrorBoundary } = await import('../src/utils/code-splitting');
    expect(ErrorBoundary).toBeDefined();
  });
});
