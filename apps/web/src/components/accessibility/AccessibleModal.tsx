// Accessible Modal Component - WCAG 2.4.3 Focus Order

import React, { useEffect, useRef, ReactNode } from 'react';

interface AccessibleModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export default function AccessibleModal({ isOpen, onClose, title, children }: AccessibleModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      
      // Focus the modal
      const modal = modalRef.current;
      const focusableElements = modal?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstFocusable = focusableElements?.[0] as HTMLElement;
      const lastFocusable = focusableElements?.[
        focusableElements.length - 1
      ] as HTMLElement;

      // Handle tab navigation
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
          return;
        }

        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === firstFocusable) {
              e.preventDefault();
              lastFocusable?.focus();
            }
          } else {
            if (document.activeElement === lastFocusable) {
              e.preventDefault();
              firstFocusable?.focus();
            }
          }
        }
      };

      modal?.addEventListener('keydown', handleKeyDown);
      firstFocusable?.focus();

      return () => {
        modal?.removeEventListener('keydown', handleKeyDown);
        previousActiveElement.current?.focus();
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 max-w-lg w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 id="modal-title" className="text-xl font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
