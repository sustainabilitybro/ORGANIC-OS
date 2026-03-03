'use client';

import { useState } from 'react';
import { Card } from '@/components/design-system';

interface HolisticEntry {
  id: string;
  section: string;
  content: string;
  createdAt: Date;
}

export default function HolisticAlchemyPage() {
  const [entries, setEntries] = useState<HolisticEntry[]>([]);
  const [activeSection, setActiveSection] = useState('vision');

  const sections = [
    { id: 'vision', label: 'Vision & Purpose', icon: '🔮' },
    { id: 'identity', label: 'Identity', icon: '🪞' },
    { id: 'psychology', label: 'Psychology', icon: '🧠' },
    { id: 'habits', label: 'Habits & Barnacles', icon: '⚓' },
    { id: 'sequence', label: 'Transformation Sequence', icon: '📈' },
    { id: 'resilience', label: 'Resilience', icon: '💪' },
    { id: 'communication', label: 'Communication', icon: '💬' },
  ];

  const sectionContent = {
    vision: {
      title: 'Vision & Purpose',
      description: 'Define your ideal future and the change you want to create.',
      prompts: [
        'What excites you most about this transformation?',
        'What makes your approach innovative?',
        'How is your approach different from others?',
        'What is your vision of success?',
      ],
    },
    identity: {
      title: 'Identity',
      description: 'Explore who you are becoming through this journey.',
      prompts: [
        'Who do you need to become?',
        'What are your core values?',
        'What beliefs support your transformation?',
      ],
    },
    psychology: {
      title: 'Psychology',
      description: 'Understand the psychological principles at play.',
      prompts: [
        'What psychological barriers might you face?',
        'How can you use the law of attraction?',
        'What frame control techniques apply?',
      ],
    },
    habits: {
      title: 'Habits & Barnacles',
      description: 'Identify what to add and what to release.',
      prompts: [
        'What habits do you need to build?',
        'What "barnacles" (drag) need to be released?',
        'Who supports your journey?',
      ],
    },
    sequence: {
      title: 'Transformation Sequence',
      description: 'Map out your phased approach to change.',
      prompts: [
        'What is your phase 1 focus?',
        'What is your phase 2 milestone?',
        'How will you measure progress?',
      ],
    },
    resilience: {
      title: 'Resilience',
      description: 'Build mental and emotional strength.',
      prompts: [
        'How will you handle setbacks?',
        'What triggers your resilience?',
        'What support systems do you have?',
      ],
    },
    communication: {
      title: 'Communication',
      description: 'Master the art of expression and influence.',
      prompts: [
        'What is your communication style?',
        'How will you practice accountability?',
        'How will you celebrate wins?',
      ],
    },
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
            🔮 Holistic Alchemy
          </h1>
          <p className="mt-2 text-neutral-600 dark:text-neutral-400">
            Comprehensive wellness integration through transformation science.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <aside className="md:col-span-1">
            <Card className="p-4 sticky top-4">
              <h2 className="font-semibold mb-4 text-neutral-700 dark:text-neutral-300">
                Modules
              </h2>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      activeSection === section.id
                        ? 'bg-emerald-600 text-white'
                        : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                    }`}
                  >
                    <span className="mr-2">{section.icon}</span>
                    {section.label}
                  </button>
                ))}
              </nav>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="md:col-span-3 space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
                {sectionContent[activeSection as keyof typeof sectionContent].title}
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                {sectionContent[activeSection as keyof typeof sectionContent].description}
              </p>

              <div className="space-y-4">
                {sectionContent[activeSection as keyof typeof sectionContent].prompts.map(
                  (prompt, index) => (
                    <div key={index}>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        {prompt}
                      </label>
                      <textarea
                        className="w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        rows={3}
                        placeholder="Write your thoughts..."
                      />
                    </div>
                  )
                )}
              </div>

              <button className="mt-6 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                Save Progress
              </button>
            </Card>

            {/* Progress Overview */}
            <Card className="p-6">
              <h3 className="font-semibold text-lg text-neutral-900 dark:text-white mb-4">
                Your Journey Progress
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {sections.map((section) => {
                  const sectionEntries = entries.filter(
                    (e) => e.section === section.id
                  );
                  const progress = Math.min(100, sectionEntries.length * 25);
                  return (
                    <div key={section.id} className="text-center">
                      <div className="relative w-16 h-16 mx-auto mb-2">
                        <svg className="w-16 h-16 transform -rotate-90">
                          <circle
                            cx="32"
                            cy="32"
                            r="28"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                            className="text-neutral-200 dark:text-neutral-700"
                          />
                          <circle
                            cx="32"
                            cy="32"
                            r="28"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                            strokeDasharray={`${progress * 1.76} 176`}
                            className="text-emerald-500"
                          />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-sm font-medium">
                          {progress}%
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500">{section.label}</p>
                    </div>
                  );
                })}
              </div>
            </Card>
          </main>
        </div>
      </div>
    </div>
  );
}
