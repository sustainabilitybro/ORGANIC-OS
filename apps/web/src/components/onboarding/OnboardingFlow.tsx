// Onboarding Flow
// Multi-step onboarding with progress tracking

import React, { useState, useCallback } from 'react';
import { Card, Button, Input, Select, Progress, Badge, Switch } from '../design-system';

// ============ Types ============

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  component: React.ComponentType<OnboardingData>;
}

interface OnboardingData {
  // User info
  name?: string;
  email?: string;
  timezone?: string;
  
  // Preferences
  theme?: 'light' | 'dark' | 'system';
  language?: string;
  
  // Goals
  primaryGoal?: string;
  challenges?: string[];
  dailyAvailability?: number;
  
  // Notifications
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  reminderTime?: string;
  
  // Onboarding complete
  completedAt?: string;
}

interface OnboardingFlowProps {
  onComplete: (data: OnboardingData) => void;
  onSkip?: () => void;
  initialData?: Partial<OnboardingData>;
}

// ============ Steps ============

const STEPS: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Organic OS',
    description: 'Let\'s personalize your experience',
    component: WelcomeStep,
  },
  {
    id: 'profile',
    title: 'Your Profile',
    description: 'Tell us about yourself',
    component: ProfileStep,
  },
  {
    id: 'goals',
    title: 'Your Goals',
    description: 'What do you want to achieve?',
    component: GoalsStep,
  },
  {
    id: 'preferences',
    title: 'Preferences',
    description: 'Customize your experience',
    component: PreferencesStep,
  },
  {
    id: 'notifications',
    title: 'Notifications',
    description: 'Stay on track',
    component: NotificationsStep,
  },
  {
    id: 'complete',
    title: 'You\'re All Set!',
    description: 'Let\'s begin your journey',
    component: CompleteStep,
  },
];

// ============ Step Components ============

function WelcomeStep({ data, updateData }: OnboardingData & { updateData: (d: Partial<OnboardingData>) => void }) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
          Welcome to Organic OS! 🌿
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400">
          Your personal development platform, customized for you.
        </p>
      </div>
      
      <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-6">
        <h3 className="font-semibold text-primary-800 dark:text-primary-200 mb-3">
          What you&apos;ll get:
        </h3>
        <ul className="space-y-2 text-sm text-primary-700 dark:text-primary-300">
          <li className="flex items-center">
            <span className="mr-2">✓</span>
            Personalized growth recommendations
          </li>
          <li className="flex items-center">
            <span className="mr-2">✓</span>
            Evidence-based interventions
          </li>
          <li className="flex items-center">
            <span className="mr-2">✓</span>
            Progress tracking & insights
          </li>
          <li className="flex items-center">
            <span className="mr-2">✓</span>
            AI-powered coaching
          </li>
        </ul>
      </div>
      
      <Button onClick={() => updateData({})} className="w-full" size="lg">
        Get Started
      </Button>
    </div>
  );
}

function ProfileStep({ data, updateData }: OnboardingData & { updateData: (d: Partial<OnboardingData>) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
          Your Profile
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400">
          We need a few details to personalize your experience.
        </p>
      </div>
      
      <Input
        label="What should we call you?"
        placeholder="Your name"
        value={data.name || ''}
        onChange={(e) => updateData({ name: e.target.value })}
        error={data.name === '' ? 'Name is required' : undefined}
      />
      
      <Input
        label="Email (for account recovery)"
        type="email"
        placeholder="your@email.com"
        value={data.email || ''}
        onChange={(e) => updateData({ email: e.target.value })}
      />
      
      <Select
        label="Your timezone"
        value={data.timezone || 'UTC'}
        onChange={(e) => updateData({ timezone: e.target.value })}
        options={[
          { value: 'UTC', label: 'UTC' },
          { value: 'America/New_York', label: 'Eastern Time' },
          { value: 'America/Los_Angeles', label: 'Pacific Time' },
          { value: 'Europe/London', label: 'London' },
          { value: 'Europe/Berlin', label: 'Berlin' },
          { value: 'Asia/Tokyo', label: 'Tokyo' },
        ]}
      />
    </div>
  );
}

function GoalsStep({ data, updateData }: OnboardingData & { updateData: (d: Partial<OnboardingData>) => void }) {
  const goalOptions = [
    { value: 'mental_health', label: 'Improve mental health', icon: '🧠' },
    { value: 'productivity', label: 'Boost productivity', icon: '⚡' },
    { value: 'relationships', label: 'Better relationships', icon: '💛' },
    { value: 'physical', label: 'Physical wellness', icon: '💪' },
    { value: 'career', label: 'Career growth', icon: '📈' },
    { value: 'learning', label: 'Continuous learning', icon: '📚' },
    { value: 'purpose', label: 'Find purpose', icon: '🎯' },
    { value: 'overall', label: 'Overall wellness', icon: '🌱' },
  ];
  
  const toggleChallenge = (value: string) => {
    const current = data.challenges || [];
    if (current.includes(value)) {
      updateData({ challenges: current.filter(c => c !== value) });
    } else {
      updateData({ challenges: [...current, value] });
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
          Your Goals
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400">
          What&apos;s your primary focus right now?
        </p>
      </div>
      
      <Select
        label="Primary Goal"
        value={data.primaryGoal || ''}
        onChange={(e) => updateData({ primaryGoal: e.target.value })}
        options={[
          { value: '', label: 'Select your goal...' },
          ...goalOptions.map(g => ({ value: g.value, label: `${g.icon} ${g.label}` })),
        ]}
      />
      
      <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-3">
          What challenges are you facing?
        </label>
        <div className="grid grid-cols-2 gap-2">
          {[
            'Stress', 'Anxiety', 'Burnout', 'Procrastination',
            'Poor sleep', 'Low motivation', 'Overwhelm', 'Focus issues',
          ].map((challenge) => (
            <button
              key={challenge}
              type="button"
              onClick={() => toggleChallenge(challenge)}
              className={cn(
                'p-3 rounded-lg border text-sm font-medium transition-colors',
                data.challenges?.includes(challenge)
                  ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                  : 'border-neutral-200 hover:border-primary-300 dark:border-neutral-700'
              )}
            >
              {challenge}
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-2">
          Daily time available (minutes)
        </label>
        <input
          type="range"
          min="5"
          max="60"
          step="5"
          value={data.dailyAvailability || 15}
          onChange={(e) => updateData({ dailyAvailability: parseInt(e.target.value) })}
          className="w-full"
        />
        <p className="text-center text-sm text-neutral-600 dark:text-neutral-400">
          {data.dailyAvailability || 15} minutes/day
        </p>
      </div>
    </div>
  );
}

function PreferencesStep({ data, updateData }: OnboardingData & { updateData: (d: Partial<OnboardingData>) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
          Preferences
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400">
          Make Organic OS feel like home.
        </p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-3">
          Theme
        </label>
        <div className="grid grid-cols-3 gap-3">
          {(['light', 'dark', 'system'] as const).map((theme) => (
            <button
              key={theme}
              type="button"
              onClick={() => updateData({ theme })}
              className={cn(
                'p-4 rounded-lg border capitalize text-center transition-colors',
                data.theme === theme
                  ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/30'
                  : 'border-neutral-200 hover:border-primary-300 dark:border-neutral-700'
              )}
            >
              {theme === 'light' && '☀️ Light'}
              {theme === 'dark' && '🌙 Dark'}
              {theme === 'system' && '💻 System'}
            </button>
          ))}
        </div>
      </div>
      
      <Select
        label="Language"
        value={data.language || 'en'}
        onChange={(e) => updateData({ language: e.target.value })}
        options={[
          { value: 'en', label: 'English' },
          { value: 'de', label: 'Deutsch' },
          { value: 'es', label: 'Español' },
          { value: 'fr', label: 'Français' },
        ]}
      />
    </div>
  );
}

function NotificationsStep({ data, updateData }: OnboardingData & { updateData: (d: Partial<OnboardingData>) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
          Notifications
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400">
          Stay on track without the noise.
        </p>
      </div>
      
      <div className="space-y-4">
        <Switch
          label="Email notifications"
          checked={data.emailNotifications ?? true}
          onChange={(e) => updateData({ emailNotifications: e.target.checked })}
        />
        
        <Switch
          label="Push notifications"
          checked={data.pushNotifications ?? true}
          onChange={(e) => updateData({ pushNotifications: e.target.checked })}
        />
        
        {data.pushNotifications && (
          <div className="pl-12">
            <Select
              label="Reminder time"
              value={data.reminderTime || '09:00'}
              onChange={(e) => updateData({ reminderTime: e.target.value })}
              options={[
                { value: '07:00', label: '7:00 AM' },
                { value: '08:00', label: '8:00 AM' },
                { value: '09:00', label: '9:00 AM' },
                { value: '12:00', label: '12:00 PM' },
                { value: '18:00', label: '6:00 PM' },
              ]}
            />
          </div>
        )}
      </div>
      
      <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
        <p className="text-sm text-green-800 dark:text-green-200">
          💡 You can always adjust these settings later in your profile.
        </p>
      </div>
    </div>
  );
}

function CompleteStep({ data, complete }: OnboardingData & { complete: () => void }) {
  return (
    <div className="space-y-6 text-center">
      <div className="text-6xl mb-4">🎉</div>
      
      <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
        You&apos;re All Set!
      </h2>
      
      <p className="text-neutral-600 dark:text-neutral-400 max-w-sm mx-auto">
        Your personalized growth journey begins now. We&apos;ve configured everything based on your preferences.
      </p>
      
      <Card variant="outlined" className="max-w-sm mx-auto text-left">
        <h3 className="font-semibold mb-3">Your Setup:</h3>
        <ul className="space-y-2 text-sm">
          <li className="flex justify-between">
            <span className="text-neutral-500">Name:</span>
            <span className="font-medium">{data.name || 'Guest'}</span>
          </li>
          <li className="flex justify-between">
            <span className="text-neutral-500">Goal:</span>
            <span className="font-medium capitalize">{data.primaryGoal?.replace('_', ' ')}</span>
          </li>
          <li className="flex justify-between">
            <span className="text-neutral-500">Daily:</span>
            <span className="font-medium">{data.dailyAvailability || 15} min</span>
          </li>
          <li className="flex justify-between">
            <span className="text-neutral-500">Theme:</span>
            <span className="font-medium capitalize">{data.theme || 'system'}</span>
          </li>
        </ul>
      </Card>
      
      <Button onClick={complete} size="lg" className="w-full max-w-xs">
        Start My Journey
      </Button>
    </div>
  );
}

// ============ Main Component ============

export function OnboardingFlow({ onComplete, onSkip, initialData }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    name: '',
    email: '',
    timezone: 'UTC',
    theme: 'system',
    language: 'en',
    challenges: [],
    dailyAvailability: 15,
    emailNotifications: true,
    pushNotifications: true,
    reminderTime: '09:00',
    ...initialData,
  });
  
  const step = STEPS[currentStep];
  const progress = ((currentStep + 1) / STEPS.length) * 100;
  
  const updateData = useCallback((updates: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...updates }));
  }, []);
  
  const goNext = useCallback(() => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep]);
  
  const goBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);
  
  const complete = useCallback(() => {
    onComplete({
      ...data,
      completedAt: new Date().toISOString(),
    });
  }, [data, onComplete]);
  
  const Component = step.component;
  
  return (
    <div className="max-w-xl mx-auto">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-neutral-500">
            Step {currentStep + 1} of {STEPS.length}
          </span>
          <span className="text-sm text-neutral-500">
            {step.title}
          </span>
        </div>
        <Progress value={progress} showLabel />
      </div>
      
      {/* Step Content */}
      <Card className="mb-6">
        <Component data={data} updateData={updateData} complete={complete} />
      </Card>
      
      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="ghost"
          onClick={onSkip || goBack}
          disabled={currentStep === 0 && !onSkip}
        >
          {currentStep === 0 ? 'Skip for now' : 'Back'}
        </Button>
        
        {currentStep < STEPS.length - 1 ? (
          <Button onClick={goNext}>
            Continue
          </Button>
        ) : (
          <Button onClick={complete}>
            Finish Setup
          </Button>
        )}
      </div>
      
      {/* Step Indicators */}
      <div className="flex justify-center mt-8 space-x-2">
        {STEPS.map((s, i) => (
          <div
            key={s.id}
            className={cn(
              'w-2 h-2 rounded-full transition-colors',
              i === currentStep 
                ? 'bg-primary-500' 
                : i < currentStep 
                  ? 'bg-primary-200' 
                  : 'bg-neutral-200 dark:bg-neutral-700'
            )}
          />
        ))}
      </div>
    </div>
  );
}

// ============ Utility ============

function cn(...inputs: (string | undefined | null | false)[]) {
  return inputs.filter(Boolean).join(' ');
}
