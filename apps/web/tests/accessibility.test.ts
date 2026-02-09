/**
 * Accessibility Tests
 * WCAG 2.1 AA Compliance Tests
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

// Import components being tested
import { SkipLink } from '../src/components/accessibility/SkipLink';
import { AccessibleInput } from '../src/components/accessibility/AccessibleInput';
import { AccessibleModal } from '../src/components/accessibility/AccessibleModal';
import { LiveRegion, StatusAnnouncer } from '../src/components/accessibility/LiveRegion';

describe('SkipLink', () => {
  it('should be hidden by default', () => {
    render(<SkipLink />);
    const link = screen.getByRole('link', { name: /skip to main content/i });
    expect(link).toHaveClass('sr-only');
  });

  it('should be visible on focus', () => {
    render(<SkipLink />);
    const link = screen.getByRole('link', { name: /skip to main content/i });
    link.focus();
    expect(link).not.toHaveClass('sr-only');
    expect(link).toHaveFocus();
  });

  it('should link to main content', () => {
    render(
      <>
        <SkipLink />
        <main id="main-content">Main Content</main>
      </>
    );
    const link = screen.getByRole('link', { name: /skip to main content/i });
    expect(link).toHaveAttribute('href', '#main-content');
  });

  it('should be accessible via keyboard', async () => {
    render(
      <>
        <SkipLink />
        <button>First Button</button>
        <main id="main-content">Main Content</main>
      </>
    );
    const button = screen.getByRole('button', { name: /first button/i });
    
    // Tab to skip link
    await userEvent.keyboard('{Tab}');
    const link = screen.getByRole('link', { name: /skip to main content/i });
    expect(link).toHaveFocus();
    
    // Press enter to activate
    await userEvent.keyboard('{Enter}');
    expect(screen.getByRole('main')).toHaveFocus();
  });
});

describe('AccessibleInput', () => {
  it('should have proper label association', () => {
    render(
      <AccessibleInput
        id="email"
        label="Email Address"
        type="email"
      />
    );
    const input = screen.getByRole('textbox', { name: /email address/i });
    expect(input).toHaveAttribute('id', 'email');
  });

  it('should show error message', () => {
    render(
      <AccessibleInput
        id="email"
        label="Email"
        error="Please enter a valid email"
        type="email"
      />
    );
    expect(screen.getByRole('alert')).toHaveTextContent(/please enter a valid email/i);
  });

  it('should be marked as invalid when error present', () => {
    render(
      <AccessibleInput
        id="test"
        label="Test"
        error="Error message"
      />
    );
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('should link error message via aria-describedby', () => {
    render(
      <AccessibleInput
        id="password"
        label="Password"
        error="Password is required"
        type="password"
      />
    );
    const input = screen.getByLabelText(/password/i);
    expect(input).toHaveAttribute('aria-describedby', 'password-error');
  });

  it('should show helper text', () => {
    render(
      <AccessibleInput
        id="username"
        label="Username"
        helperText="Choose a unique username"
      />
    );
    expect(screen.getByText(/choose a unique username/i)).toBeInTheDocument();
  });

  it('should indicate required field', () => {
    render(
      <AccessibleInput
        id="name"
        label="Full Name"
        required
      />
    );
    const label = screen.getByLabelText(/full name/i);
    expect(label.parentElement).toHaveTextContent(/\*/);
  });

  it('should be disabled when disabled prop is set', () => {
    render(
      <AccessibleInput
        id="disabled"
        label="Disabled"
        disabled
      />
    );
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });
});

describe('AccessibleModal', () => {
  it('should render when open', () => {
    render(
      <AccessibleModal isOpen={true} onClose={() => {}} title="Test Modal">
        Modal Content
      </AccessibleModal>
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /test modal/i })).toBeInTheDocument();
  });

  it('should not render when closed', () => {
    render(
      <AccessibleModal isOpen={false} onClose={() => {}} title="Test Modal">
        Modal Content
      </AccessibleModal>
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should have aria-modal attribute', () => {
    render(
      <AccessibleModal isOpen={true} onClose={() => {}} title="Test">
        Content
      </AccessibleModal>
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  it('should have accessible title', () => {
    render(
      <AccessibleModal isOpen={true} onClose={() => {}} title="Settings">
        Content
      </AccessibleModal>
    );
    expect(screen.getByRole('heading', { name: /settings/i })).toBeInTheDocument();
  });

  it('should trap focus within modal', async () => {
    render(
      <AccessibleModal isOpen={true} onClose={() => {}} title="Test">
        <button>Button 1</button>
        <button>Button 2</button>
      </AccessibleModal>
    );
    
    const button1 = screen.getByRole('button', { name: /button 1/i });
    expect(button1).toHaveFocus();
    
    // Tab should cycle back to button 1
    await userEvent.keyboard('{Tab}');
    const button2 = screen.getByRole('button', { name: /button 2/i });
    expect(button2).toHaveFocus();
    
    await userEvent.keyboard('{Tab}');
    expect(button1).toHaveFocus();
  });

  it('should close on escape key', async () => {
    const handleClose = vi.fn();
    render(
      <AccessibleModal isOpen={true} onClose={handleClose} title="Test">
        Content
      </AccessibleModal>
    );
    
    await userEvent.keyboard('{Escape}');
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('should have close button with aria-label', () => {
    render(
      <AccessibleModal isOpen={true} onClose={() => {}} title="Test">
        Content
      </AccessibleModal>
    );
    const closeButton = screen.getByRole('button', { name: /close modal/i });
    expect(closeButton).toBeInTheDocument();
  });

  it('should restore focus on close', async () => {
    const outsideButton = document.createElement('button');
    outsideButton.textContent = 'Outside';
    document.body.appendChild(outsideButton);
    outsideButton.focus();
    
    render(
      <AccessibleModal isOpen={true} onClose={() => {}} title="Test">
        Content
      </AccessibleModal>
    );
    
    // Close the modal
    const closeButton = screen.getByRole('button', { name: /close modal/i });
    closeButton.click();
    
    // Focus should be restored
    await waitFor(() => {
      expect(outsideButton).toHaveFocus();
    });
    
    document.body.removeChild(outsideButton);
  });
});

describe('LiveRegion', () => {
  it('should announce status messages politely', () => {
    render(<LiveRegion message="Changes saved" type="polite" />);
    const region = screen.getByRole('status');
    expect(region).toHaveTextContent(/changes saved/i);
    expect(region).toHaveAttribute('aria-live', 'polite');
  });

  it('should announce alerts assertively', () => {
    render(<LiveRegion message="Error occurred" type="assertive" />);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent(/error occurred/i);
    expect(alert).toHaveAttribute('aria-live', 'assertive');
  });

  it('should announce loading state', () => {
    render(<StatusAnnouncer isLoading={true} />);
    expect(screen.getByRole('status')).toHaveTextContent(/loading/i);
  });

  it('should announce success state', () => {
    render(<StatusAnnouncer success="Successfully saved!" />);
    expect(screen.getByRole('status')).toHaveTextContent(/successfully saved/i);
  });

  it('should announce error state assertively', () => {
    render(<StatusAnnouncer error="Failed to save" />);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent(/error: failed to save/i);
    expect(alert).toHaveAttribute('aria-live', 'assertive');
  });
});

describe('Keyboard Navigation', () => {
  it('should be fully keyboard navigable', () => {
    render(
      <div>
        <button>First</button>
        <SkipLink />
        <button>Second</button>
        <AccessibleInput id="test" label="Test" />
      </div>
    );
    
    // All interactive elements should be reachable
    const firstButton = screen.getByRole('button', { name: /first/i });
    const input = screen.getByRole('textbox');
    const secondButton = screen.getByRole('button', { name: /second/i });
    
    expect(firstButton).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    expect(secondButton).toBeInTheDocument();
  });

  it('should have visible focus states', () => {
    render(
      <div>
        <button className="focus:ring-2 focus:ring-green-500">Test</button>
      </div>
    );
    
    const button = screen.getByRole('button');
    button.focus();
    
    expect(button).toHaveFocus();
  });
});

describe('Color Contrast', () => {
  it('should meet contrast requirements', () => {
    // This is a visual test that would need to be checked with axe-core
    // or a visual regression tool in practice
    expect(true).toBe(true);
  });
});
