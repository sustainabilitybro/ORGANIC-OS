// Mobile Responsiveness Hooks and Utilities

import { useState, useEffect, useCallback } from 'react';

// ============ Breakpoints ============

export const BREAKPOINTS = {
  sm: 640,    // Small tablets
  md: 768,    // Tablets
  lg: 1024,   // Small laptops
  xl: 1280,   // Laptops
  '2xl': 1536 // Desktops
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

// ============ useMediaQuery ============

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  
  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);
  
  return matches;
}

// ============ Mobile Detection ============

export function useIsMobile(): boolean {
  return useMediaQuery(`(max-width: ${BREAKPOINTS.md - 1}px)`);
}

export function useIsTablet(): boolean {
  return useMediaQuery(
    `(min-width: ${BREAKPOINTS.md}px) and (max-width: ${BREAKPOINTS.lg - 1}px)`
  );
}

export function useIsDesktop(): boolean {
  return useMediaQuery(`(min-width: ${BREAKPOINTS.lg}px)`);
}

export function useIsPortrait(): boolean {
  return useMediaQuery('(orientation: portrait)');
}

export function useIsLandscape(): boolean {
  return useMediaQuery('(orientation: landscape)');
}

export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}

// Export alias for backwards compatibility

// ============ Device Info ============

export function useDeviceInfo(): { isMobile: boolean; isTablet: boolean; isDesktop: boolean; orientation: string } {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isDesktop = useIsDesktop();
  const orientation = useIsPortrait() ? 'portrait' : 'landscape';
  
  return { isMobile, isTablet, isDesktop, orientation };
}
