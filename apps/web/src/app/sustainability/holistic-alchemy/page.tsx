'use client';

import { useState } from 'react';
import { Card } from '@/components/design-system';

interface HolisticEntry {
  id: string;
  section: string;
  content: string;
  createdAt: Date;
}

interface TransformationPhase {
  phase: number;
  title: string;
  duration: string;
  focus: string[];
  outcomes: string[];
}

const transformationPhases: TransformationPhase[] = [
  {
    phase: 1,
    title: 'Foundation',
    duration: 'Weeks 1-4',
    focus: ['Vision clarification', 'Values identification', 'Barrier assessment'],
    outcomes: ['Clear vision statement', 'Core values list', 'Obstacle map']
  },
  {
    phase: 2,
    title: 'Identity Work',
    duration: 'Weeks 5-8',
    focus: ['Identity exploration', 'Belief restructuring', 'Self-image work'],
    outcomes: ['New identity narrative', 'Empowering beliefs', 'Future self visualization']
  },
  {
    phase: 3,
    title: 'Habit Architecture',
    duration: 'Weeks 9-12',
    focus: ['Habit stacking', 'Barnacle removal', 'Environment design'],
    outcomes: ['Habit implementation plan', 'Drag elimination list', 'Optimized environment']
  },
  {
    phase: 4,
    title: 'Integration',
    duration: 'Weeks 13-16',
    focus: ['Practice routines', 'Feedback loops', 'Social reinforcement'],
    outcomes: ['Sustained practices', 'Progress tracking', 'Support network']
  }
];

const psychologyConcepts = [
  { name: 'Law of Attraction', description: 'Like attracts like - focus on what you want' },
  { name: 'Cognitive Dissonance', description: 'Align beliefs with desired identity' },
  { name: 'Self-Efficacy', description: 'Belief in capability to achieve goals' },
  { name: 'Growth Mindset', description: 'Abilities can be developed through effort' },
  { name: 'Neural Plasticity', description: 'Brain can change through practice' },
  { name: 'Implementation Intentions', description: 'Specific plans for goal achievement' }
];

export default function HolisticAlchemyPage() {
  const [entries, setEntries] = useState<HolisticEntry[]>([]);
  const [activeSection, setActiveSection] = useState('vision');
  const [newEntry, setNewEntry] = useState('');
  const [expandedPhases, setExpandedPhases] = useState<number[]>([1]);

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
        'Who will benefit from your transformation?',
      ],
    },
    identity: {
      title: 'Identity',
      description: 'Explore who you are becoming through this journey.',
      prompts: [
        'Who do you need to become?',
        'What are your core values?',
        'What beliefs support your transformation?',
        'What old identity must you release?',
      ],
    },
    psychology: {
      title: 'Psychology',
      description: 'Understand the psychological principles at play.',
      prompts: [
        'What psychological barriers might you face?',
        'How can you use the law of attraction?',
        'What frame control techniques apply?',
        'How will you build self-efficacy?',
      ],
    },
    habits: {
      title: 'Habits & Barnacles',
      description: 'Identify what to add and what to release.',
      prompts: [
        'What habits do you need to build?',
        'What "barnacles" (drag) need to be released?',
        'Who supports your journey?',
        'What systems will you use?',
      ],
    },
    sequence: {
      title: 'Transformation Sequence',
      description: 'Map out your phased approach to change.',
      prompts: [
        'What is your phase 1 focus?',
        'What is your phase 2 milestone?',
        'How will you measure progress?',
        'What triggers phase transitions?',
      ],
    },
    resilience: {
      title: 'Resilience',
      description: 'Build mental and emotional strength.',
      prompts: [
        'How will you handle setbacks?',
        'What triggers your resilience?',
        'What support systems do you have?',
        'What is your recovery protocol?',
      ],
    },
    communication: {
      title: 'Communication',
      description: 'Master expression and influence.',
      prompts: [
        'How will you share your journey?',
        'What storytelling elements apply?',
        'Who is your audience?',
        'What channels will you use?',
      ],
    },
  };

  const addEntry = () => {
    if (!newEntry.trim()) return;
    const entry: HolisticEntry = {
      id: Date.now().toString(),
      section: activeSection,
      content: newEntry,
      createdAt: new Date(),
    };
    setEntries([...entries, entry]);
    setNewEntry('');
  };

  const togglePhase = (phase: number) => {
    setExpandedPhases(prev => 
      prev.includes(phase) ? prev.filter(p => p !== phase) : [...prev, phase]
    );
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">🧪 Holistic Alchemy</h1>
          <p className="text-neutral-400">
            Transform consciousness through alchemical practices
          </p>
        </div>

        {/* Transformation Phases Overview */}
        <Card className="bg-neutral-900 border border-neutral-800 mb-6">
          <h2 className="text-xl font-bold mb-4">🚀 Transformation Sequence</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {transformationPhases.map((phase) => (
              <div 
                key={phase.phase}
                className={`p-4 rounded-lg cursor-pointer transition-all ${
                  expandedPhases.includes(phase.phase) 
                    ? 'bg-emerald-900/30 border border-emerald-500/50' 
                    : 'bg-neutral-800 hover:bg-neutral-700'
                }`}
                onClick={() => togglePhase(phase.phase)}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-emerald-400 font-bold">Phase {phase.phase}</span>
                  <span className="text-xs text-neutral-500">{phase.duration}</span>
                </div>
                <h3 className="font-semibold mb-2">{phase.title}</h3>
                {expandedPhases.includes(phase.phase) && (
                  <div className="mt-3 pt-3 border-t border-neutral-700 text-sm">
                    <p className="text-neutral-400 mb-2"><strong>Focus:</strong></p>
                    <ul className="list-disc list-inside text-neutral-300 mb-2">
                      {phase.focus.map((f, i) => <li key={i}>{f}</li>)}
                    </ul>
                    <p className="text-neutral-400 mb-2"><strong>Outcomes:</strong></p>
                    <ul className="list-disc list-inside text-neutral-300">
                      {phase.outcomes.map((o, i) => <li key={i}>{o}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-neutral-900 border border-neutral-800">
              <h3 className="font-bold mb-4">Modules</h3>
              <div className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${
                      activeSection === section.id
                        ? 'bg-emerald-600 text-white'
                        : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                    }`}
                  >
                    <span>{section.icon}</span>
                    <span>{section.label}</span>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            <Card className="bg-neutral-900 border border-neutral-800">
              <h2 className="text-2xl font-bold mb-2">
                {sectionContent[activeSection as keyof typeof sectionContent].title}
              </h2>
              <p className="text-neutral-400 mb-6">
                {sectionContent[activeSection as keyof typeof sectionContent].description}
              </p>

              <h3 className="font-semibold mb-3 text-emerald-400">Reflection Prompts</h3>
              <div className="space-y-2 mb-6">
                {sectionContent[activeSection as keyof typeof sectionContent].prompts.map((prompt, idx) => (
                  <div key={idx} className="flex gap-3 items-start p-3 bg-neutral-800 rounded-lg">
                    <span className="text-emerald-400">▸</span>
                    <span className="text-neutral-300">{prompt}</span>
                  </div>
                ))}
              </div>

              {/* Add Entry */}
              <div className="mt-6">
                <h3 className="font-semibold mb-3 text-emerald-400">Your Notes</h3>
                <div className="flex gap-2">
                  <textarea
                    value={newEntry}
                    onChange={(e) => setNewEntry(e.target.value)}
                    placeholder="Write your reflection..."
                    className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white resize-none h-24"
                  />
                  <button
                    onClick={addEntry}
                    className="bg-emerald-600 hover:bg-emerald-700 px-6 rounded-lg font-medium"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Entry List */}
              {entries.filter(e => e.section === activeSection).length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold mb-3 text-emerald-400">Your Entries</h3>
                  <div className="space-y-2">
                    {entries.filter(e => e.section === activeSection).map((entry) => (
                      <div key={entry.id} className="p-4 bg-neutral-800 rounded-lg">
                        <p className="text-neutral-300">{entry.content}</p>
                        <span className="text-xs text-neutral-500 mt-2 block">
                          {entry.createdAt.toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>

            {/* Psychology Concepts */}
            <Card className="bg-neutral-900 border border-neutral-800">
              <h2 className="text-xl font-bold mb-4">🧠 Psychology Concepts</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {psychologyConcepts.map((concept, idx) => (
                  <div key={idx} className="p-3 bg-neutral-800 rounded-lg">
                    <h4 className="font-semibold text-emerald-400 mb-1">{concept.name}</h4>
                    <p className="text-sm text-neutral-400">{concept.description}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
