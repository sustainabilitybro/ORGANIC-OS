// Organic OS - Identity Module
// Identity Command Center - Discover Your Authentic Self

'use client';

import { useState } from 'react';

// Core Values Assessment State
interface ValuesAssessment {
  values: string[];
  priorities: Record<string, number>; // 1-10
  examples: Record<string, string>;
}

// Sample values from identity command center
const coreValues = [
  'Authenticity', 'Integrity', 'Growth', 'Connection', 'Freedom',
  'Security', 'Creativity', 'Impact', 'Balance', 'Health',
  'Wisdom', 'Play', 'Service', 'Excellence', 'Peace'
];

export default function IdentityPage() {
  const [activeTab, setActiveTab] = useState<'values' | 'purpose' | 'strengths' | 'boundaries'>('values');
  const [values, setValues] = useState<string[]>([]);
  const [priorities, setPriorities] = useState<Record<string, number>>({});
  const [lifePurpose, setLifePurpose] = useState('');
  const [strengths, setStrengths] = useState<string[]>([]);
  const [boundaries, setBoundaries] = useState<string[]>([]);

  const toggleValue = (value: string) => {
    if (values.includes(value)) {
      setValues(values.filter(v => v !== value));
      const newPriors = { ...priorities };
      delete newPriors[value];
      setPriorities(newPriors);
    } else if (values.length < 5) {
      setValues([...values, value]);
    }
  };

  const aiCoachingPrompt = `Based on my core values (${values.join(', ')}), priorities ${
    Object.entries(priorities).map(([v, p]) => `${v}: ${p}`).join(', ')
  }, help me discover my life purpose. Ask me reflective questions one at a time.`;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* Header */}
      <div className="border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">👤</span>
            <div>
              <h1 className="text-2xl font-bold">Identity Command Center</h1>
              <p className="text-sm text-neutral-400">Discover your authentic self</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {[
            { id: 'values', label: 'Core Values', icon: '🎯' },
            { id: 'purpose', label: 'Life Purpose', icon: '✨' },
            { id: 'strengths', label: 'Strengths', icon: '💪' },
            { id: 'boundaries', label: 'Boundaries', icon: '🛡️' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-emerald-600 text-white'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Core Values Tab */}
        {activeTab === 'values' && (
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4">Select Your Core Values</h2>
                <p className="text-sm text-neutral-400 mb-4">
                  Choose up to 5 values that matter most to you
                </p>
                <div className="flex flex-wrap gap-2">
                  {coreValues.map(value => (
                    <button
                      key={value}
                      onClick={() => toggleValue(value)}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        values.includes(value)
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500'
                          : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                      }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>

              {values.length > 0 && (
                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                  <h2 className="text-xl font-semibold mb-4">Prioritize Your Values</h2>
                  {values.map(value => (
                    <div key={value} className="mb-4">
                      <div className="flex justify-between mb-1">
                        <span>{value}</span>
                        <span className="text-neutral-400">{priorities[value] || 5}/10</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={priorities[value] || 5}
                        onChange={(e) => setPriorities({ ...priorities, [value]: parseInt(e.target.value) })}
                        className="w-full accent-emerald-500"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Selected Values Summary */}
            <div className="space-y-6">
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4">Your Value Hierarchy</h2>
                {values.length === 0 ? (
                  <p className="text-neutral-400">Select values to see your hierarchy</p>
                ) : (
                  <div className="space-y-3">
                    {values
                      .sort((a, b) => (priorities[b] || 0) - (priorities[a] || 0))
                      .map((value, index) => (
                        <div key={value} className="flex items-center gap-3">
                          <span className="text-lg">{['🥇', '🥈', '🥉', '4️⃣', '5️⃣'][index]}</span>
                          <div className="flex-1">
                            <div className="flex justify-between text-sm">
                              <span>{value}</span>
                              <span className="text-neutral-400">{priorities[value] || 5}</span>
                            </div>
                            <div className="h-2 bg-neutral-800 rounded-full mt-1">
                              <div
                                className="h-full bg-emerald-500 rounded-full transition-all"
                                style={{ width: `${(priorities[value] || 5) * 10}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* AI Coach */}
              <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">🤖</span>
                  <h2 className="text-lg font-semibold">AI Values Coach</h2>
                </div>
                <p className="text-sm text-neutral-400 mb-4">
                  Get personalized guidance on discovering and living your values
                </p>
                <button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                  Start Values Conversation
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Life Purpose Tab */}
        {activeTab === 'purpose' && (
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Craft Your Life Purpose</h2>
              <p className="text-sm text-neutral-400 mb-4">
                Your life purpose is your north star — a guiding direction that gives meaning to your choices.
              </p>
              <textarea
                value={lifePurpose}
                onChange={(e) => setLifePurpose(e.target.value)}
                placeholder="Start writing your life purpose draft here..."
                className="w-full h-64 bg-neutral-800 border border-neutral-700 rounded-lg p-4 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <div className="flex gap-2 mt-4">
                <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                  Save Draft
                </button>
                <button className="bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                  Get AI Feedback
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4">Purpose Framework</h2>
                <div className="space-y-4">
                  <div className="p-4 bg-neutral-800 rounded-lg">
                    <h3 className="font-medium mb-2">The Ikigai Model</h3>
                    <p className="text-sm text-neutral-400">
                      Find your intersection of: What you love × What you're good at × What the world needs × What you can be paid for
                    </p>
                  </div>
                  <div className="p-4 bg-neutral-800 rounded-lg">
                    <h3 className="font-medium mb-2">The "Legacy" Question</h3>
                    <p className="text-sm text-neutral-400">
                      How do you want people to remember you? What difference do you want to make?
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Strengths Tab */}
        {activeTab === 'strengths' && (
          <div className="space-y-6">
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Discover Your Strengths</h2>
              <p className="text-neutral-400 mb-6">
                Knowing your strengths helps you focus energy where it matters most.
              </p>
              
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { category: 'Thinking', strengths: ['Analytical', 'Strategic', 'Creative', 'Curious'] },
                  { category: 'Relating', strengths: ['Empathetic', 'Collaborative', 'Supportive', 'Communicative'] },
                  { category: 'Achieving', strengths: ['Determined', 'Organized', 'Initiative', 'Resilient'] },
                ].map(group => (
                  <div key={group.category} className="p-4 bg-neutral-800 rounded-lg">
                    <h3 className="font-medium mb-3 text-emerald-400">{group.category}</h3>
                    <div className="space-y-2">
                      {group.strengths.map(strength => (
                        <label key={strength} className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" className="accent-emerald-500" />
                          <span className="text-sm">{strength}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Boundaries Tab */}
        {activeTab === 'boundaries' && (
          <div className="space-y-6">
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Set Your Boundaries</h2>
              <p className="text-neutral-400 mb-6">
                Boundaries protect your wellbeing and define how you want to be treated.
              </p>
              
              <div className="space-y-4">
                {[
                  { type: 'Time', example: 'I don\'t check email after 8 PM' },
                  { type: 'Energy', example: 'I limit time with people who drain me' },
                  { type: 'Digital', example: 'I take social media breaks weekly' },
                  { type: 'Relationship', example: 'I won\'t tolerate disrespect' },
                ].map(boundary => (
                  <div key={boundary.type} className="p-4 bg-neutral-800 rounded-lg flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{boundary.type} Boundaries</h3>
                      <p className="text-sm text-neutral-400">{boundary.example}</p>
                    </div>
                    <button className="text-emerald-400 hover:text-emerald-300 text-sm">
                      Add +
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
