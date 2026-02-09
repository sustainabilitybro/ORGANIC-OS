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

// ============ Breakpoint Detection ============

export function useBreakpoint(): Breakpoint {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('md');
  
  useEffect(() => {
    const checkBreakpoint = () => {
      const width = window.innerWidth;
      if (width >= BREAKPOINTS['2xl']) return '2xl' as Breakpoint;
      if (width >= BREAKPOINTS.xl) return 'xl' as Breakpoint;
      if (width >= BREAKPOINTS.lg) return 'lg' as Breakpoint;
      if (width >= BREAKPOINTS.md) return 'md' as Breakpoint;
      return 'sm' as Breakpoint;
    };
    
    setBreakpoint(checkBreakpoint());
    
    const handler = () => setBreakpoint(checkBreakpoint());
    window.addEventListener('resize', handler, { passive: true });
    return () => window.removeEventListener('resize', handler);
  }, []);
  
  return breakpoint;
}

// ============ Touch Detection ============

export function useIsTouchDevice(): boolean {
  const [isTouch, setIsTouch] = useState(false);
  
  useEffect(() => {
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);
  
  return isTouch;
}

// ============ Viewport Dimensions ============

export function useViewportSize(): { width: number; height: number } {
  const [size, setSize] = useState({ width: 0, height: 0 });
  
  useEffect(() => {
    const handleResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };
    
    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return size;
}

// ============ Orientation ============

export type Orientation = 'portrait' | 'landscape';

export function useOrientation(): Orientation {
  const orientation = useMediaQuery('(orientation: portrait)') ? 'portrait' : 'landscape';
  return orientation;
}

// ============ Reduced Motion ============

export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}

// ============ Mobile Menu ============

interface UseMobileMenuReturn {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
  open: () => void;
}

export function useMobileMenu(initialOpen = false): UseMobileMenuReturn {
  const [isOpen, setIsOpen] = useState(initialOpen);
  
  const toggle = useCallback(() => setIsOpen(prev => !prev), []);
  const close = useCallback(() => setIsOpen(false), []);
  const open = useCallback(() => setIsOpen(true), []);
  
  // Close on route change
  useEffect(() => {
    setIsOpen(false);
  }, []);
  
  return { isOpen, toggle, close, open };
}

// ============ Mobile Search ============

interface UseMobileSearchReturn {
  isActive: boolean;
  show: () => void;
  hide: () => void;
  toggle: () => void;
}

export function useMobileSearch(initialActive = false): UseMobileSearchReturn {
  const [isActive, setIsActive] = useState(initialActive);
  
  const show = useCallback(() => setIsActive(true), []);
  const hide = useCallback(() => setIsActive(false), []);
  const toggle = useCallback(() => setIsActive(prev => !prev), []);
  
  return { isActive, show, hide, toggle };
}

// ============ Responsive Value ============

export function useResponsiveValue<T>(values: {
  default: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  '2xl'?: T;
}): T {
  const breakpoint = useBreakpoint();
  
  return values[breakpoint] ?? values.default;
}

// ============ Grid Columns ============

export function useResponsiveGridColumns(defaultCols = 1): {
  cols: number;
  span: string;
} {
  const breakpoint = useBreakpoint();
  
  const columns: Record<Breakpoint, number> = {
    sm: 1,
    md: 2,
    lg: 3,
    xl: 4,
    '2xl': 4
  };
  
  return {
    cols: columns[breakpoint] || defaultCols,
    span: `span 1 / span 1`
  };
}

// ============ Responsive Spacing ============

export function useResponsiveSpacing(defaultSpacing = 4): {
  padding: number;
  margin: number;
  gap: number;
} {
  const breakpoint = useBreakpoint();
  
  const spacing: Record<Breakpoint, number> = {
    sm: 2,
    md: 3,
    lg: 4,
    xl: 6,
    '2xl': 8
  };
  
  return {
    padding: spacing[breakpoint] || defaultSpacing,
    margin: spacing[breakpoint] || defaultSpacing,
    gap: spacing[breakpoint] || defaultSpacing
  };
}

// ============ Mobile Safe Areas ============

export function useSafeAreaInsets(): {
  top: number;
  right: number;
  bottom: number;
  left: number;
} {
  const [insets, setInsets] = useState({ top: 0, right: 0, bottom: 0, left: 0 });
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const updateInsets = () => {
      setInsets({
        top: Number(getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-top').replace('px', '')) || 0,
        right: Number(getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-right').replace('px', '')) || 0,
        bottom: Number(getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-bottom').replace('px', '')) || 0,
        left: Number(getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-left').replace('px', '')) || 0,
      });
    };
    
    updateInsets();
    window.addEventListener('resize', updateInsets, { passive: true });
    return () => window.removeEventListener('resize', updateInsets);
  }, []);
  
  return insets;
}

// ============ Visibility Control ============

interface UseHideOnScrollReturn {
  isVisible: boolean;
  show: () => void;
  hide: () => void;
}

export function useHideOnScroll(initialVisible = true): UseHideOnScrollReturn {
  const [isVisible, setIsVisible] = useState(initialVisible);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isScrollingDown = currentScrollY > lastScrollY;
      
      // Hide when scrolling down, show when scrolling up
      if (isScrollingDown && currentScrollY > 50) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);
  
  return {
    isVisible,
    show: () => setIsVisible(true),
    hide: () => setIsVisible(false)
  };
}

// ============ Export ============

export {
  useMediaQuery,
  useIsMobile,
  useIsTablet,
  useIsDesktop,
  useBreakpoint,
  useIsTouchDevice,
  useViewportSize,
  useOrientation,
  usePrefersReducedMotion,
  useMobileMenu,
  useMobileSearch,
  useResponsiveValue,
  useResponsiveGridColumns,
  useResponsiveSpacing,
  useSafeAreaInsets,
  useHideOnScroll
};
