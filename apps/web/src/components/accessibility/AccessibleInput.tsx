// Accessible Input Component - WCAG 3.3.2 Labels or Instructions
import React, { InputHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

interface AccessibleInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  id: string;
}

export function AccessibleInput({
  label,
  error,
  helperText,
  id,
  className,
  ...props
}: AccessibleInputProps) {
  const errorId = `${id}-error`;
  const helperId = `${id}-helper`;
  
  return (
    <div className="space-y-1">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 dark:text-gray-200"
      >
        {label}
        {props.required && (
          <span className="text-red-500 ml-1" aria-hidden="true">*</span>
        )}
      </label>
      
      <input
        id={id}
        aria-describedby={cn(
          error ? errorId : undefined,
          helperText ? helperId : undefined
        )}
        aria-invalid={error ? 'true' : 'false'}
        aria-required={props.required ? 'true' : 'false'}
        className={cn(
          'w-full px-4 py-2 border rounded-lg transition-colors',
          'bg-white dark:bg-gray-800',
          'text-gray-900 dark:text-white',
          'placeholder-gray-400 dark:placeholder-gray-500',
          error
            ? 'border-red-500 focus:ring-red-500'
            : 'border-gray-300 dark:border-gray-600',
          'focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none',
          'disabled:bg-gray-100 disabled:cursor-not-allowed',
          className
        )}
        {...props}
      />
      
      {error && (
        <p
          id={errorId}
          className="text-sm text-red-600 dark:text-red-400"
          role="alert"
          aria-live="polite"
        >
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p id={helperId} className="text-sm text-gray-500 dark:text-gray-400">
          {helperText}
        </p>
      )}
    </div>
  );
}
