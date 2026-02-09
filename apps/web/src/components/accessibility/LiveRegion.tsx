// Live Region Component - WCAG 4.1.3 Status Messages
import React from 'react';
import { cn } from '../../utils/cn';

type LiveRegionType = 'status' | 'alert' | 'polite' | 'assertive';

interface LiveRegionProps {
  message: string;
  type?: LiveRegionType;
  className?: string;
}

export function LiveRegion({ message, type = 'status', className }: LiveRegionProps) {
  const role = type === 'alert' || type === 'assertive' ? 'alert' : 'status';
  const ariaLive = type === 'assertive' ? 'assertive' : 'polite';

  return (
    <div
      role={role}
      aria-live={ariaLive}
      aria-atomic="true"
      className={cn('sr-only', className)}
    >
      {message}
    </div>
  );
}

// Status announcer for async operations
interface StatusAnnouncerProps {
  isLoading?: boolean;
  success?: string;
  error?: string;
}

export function StatusAnnouncer({
  isLoading,
  success,
  error,
}: StatusAnnouncerProps) {
  if (isLoading) {
    return (
      <LiveRegion
        message="Loading, please wait..."
        type="polite"
      />
    );
  }

  if (success) {
    return (
      <LiveRegion
        message={success}
        type="polite"
      />
    );
  }

  if (error) {
    return (
      <LiveRegion
        message={`Error: ${error}`}
        type="assertive"
      />
    );
  }

  return null;
}
