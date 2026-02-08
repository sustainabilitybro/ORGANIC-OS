// Organic OS - Sensory Module
// Explore and Optimize Your Human Senses

'use client';

import { useState } from 'react';

interface SensoryProfile {
  visual: { sensitivity: number; preferences: string[]; triggers: string[] };
  auditory: { sensitivity: number; preferences: string[]; triggers: string[] };
  kinesthetic: { sensitivity: number; preferences: string[]; triggers: string[] };
  olfactory: { sensitivity: number; preferences: string[]; triggers: string[] };
  gustatory: { sensitivity: number; preferences: string[]; triggers: string[] };
}

const senseIcons = {
  visual: '👁️',
  auditory: '👂',
  kinesthetic: '🫳',
  olfactory: '👃',
  gustatory: '👅',
};

const senseNames = {
  visual: 'Visual',
  auditory: 'Auditory',
  kinesthetic: 'Kinesthetic (Touch)',
  olfactory: 'Olfactory (Smell)',
  gustatory: 'Taste',
};

const senseDescriptions = {
  visual: 'How you perceive light, color, and visual information',
  auditory: 'How you process sound and verbal information',
  kinesthetic: 'How you experience touch, movement, and body awareness',
  olfactory: 'How you respond to smells and scents',
  gustatory: 'How you experience taste and food preferences',
};

export default function SensoryPage() {
  const [activeSense, setActiveSense] = useState<keyof typeof senseIcons>('visual');
  const [profiles, setProfiles] = useState<SensoryProfile>({
    visual: { sensitivity: 5, preferences: [], triggers: [] },
    auditory: { sensitivity: 5, preferences: [], triggers: [] },
    kinesthetic: { sensitivity: 5, preferences: [], triggers: [] },
    olfactory: { sensitivity: 5, preferences: [], triggers: [] },
    gustatory: { sensitivity: 5, preferences: [], triggers: [] },
  });
  const [newPreference, setNewPreference] = useState('');
  const [newTrigger, setNewTrigger] = useState('');

  const updateProfile = (sense: keyof SensoryProfile, field: string, value: any) => {
    setProfiles(prev => ({
      ...prev,
      [sense]: { ...prev[sense], [field]: value },
    }));
  };

  const addPreference = (sense: keyof SensoryProfile) => {
    if (newPreference.trim()) {
      updateProfile(sense, 'preferences', [...profiles[sense].preferences, newPreference.trim()]);
      setNewPreference('');
    }
  };

  const addTrigger = (sense: keyof SensoryProfile) => {
    if (newTrigger.trim()) {
      updateProfile(sense, 'triggers', [...profiles[sense].triggers, newTrigger.trim()]);
      setNewTrigger('');
    }
  };

  const currentProfile = profiles[activeSense];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* Header */}
      <div className="border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">👁️</span>
            <div>
              <h1 className="text-2xl font-bold">Sensory Module</h1>
              <p className="text-sm text-neutral-400">Explore and optimize your human senses</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Sense Tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {Object.entries(senseIcons).map(([sense, icon]) => (
            <button
              key={sense}
              onClick={() => setActiveSense(sense as keyof typeof senseIcons)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeSense === sense
                  ? 'bg-cyan-600 text-white'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              }`}
            >
              <span className="mr-2">{icon}</span>
              {senseNames[sense as keyof typeof senseNames]}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Profile */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">{senseIcons[activeSense]}</span>
                <div>
                  <h2 className="text-xl font-semibold">{senseNames[activeSense]}</h2>
                  <p className="text-sm text-neutral-400">{senseDescriptions[activeSense]}</p>
                </div>
              </div>

              {/* Sensitivity Slider */}
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span>Sensitivity Level</span>
                  <span className="text-cyan-400">{currentProfile.sensitivity}/10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={currentProfile.sensitivity}
                  onChange={(e) => updateProfile(activeSense, 'sensitivity', parseInt(e.target.value))}
                  className="w-full accent-cyan-500"
                />
                <div className="flex justify-between text-xs text-neutral-500 mt-1">
                  <span>Low</span>
                  <span>Average</span>
                  <span>High</span>
                </div>
              </div>

              {/* Sensory Diet Recommendation */}
              <div className="p-4 bg-cyan-900/20 border border-cyan-500/30 rounded-lg mb-6">
                <h3 className="font-medium mb-2 flex items-center gap-2">
                  <span>📋</span> Recommended Sensory Diet
                </h3>
                <p className="text-sm text-neutral-400">
                  {activeSense === 'visual' && '20-20-20 rule: Every 20 min, look 20ft away for 20 seconds. Limit screen brightness.'}
                  {activeSense === 'auditory' && 'Protect hearing with breaks from loud environments. Use noise-canceling headphones.'}
                  {activeSense === 'kinesthetic' && 'Regular movement breaks every hour. Incorporate proprioceptive activities.'}
                  {activeSense === 'olfactory' && 'Avoid strong synthetic fragrances. Use essential oils mindfully.'}
                  {activeSense === 'gustatory' && 'Mindful eating practices. Stay hydrated. Limit extreme flavors.'}
                </p>
              </div>

              {/* Preferences & Triggers */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-3">Preferences</h3>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newPreference}
                      onChange={(e) => setNewPreference(e.target.value)}
                      placeholder="Add preference..."
                      className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                    <button
                      onClick={() => addPreference(activeSense)}
                      className="bg-cyan-600 hover:bg-cyan-500 px-3 py-2 rounded-lg text-sm"
                    >
                      +
                    </button>
                  </div>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {currentProfile.preferences.map((pref, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <span className="text-green-400">✓</span>
                        {pref}
                      </div>
                    ))}
                    {currentProfile.preferences.length === 0 && (
                      <p className="text-neutral-500 text-sm">No preferences added</p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-3">Triggers</h3>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newTrigger}
                      onChange={(e) => setNewTrigger(e.target.value)}
                      placeholder="Add trigger..."
                      className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                    <button
                      onClick={() => addTrigger(activeSense)}
                      className="bg-amber-600 hover:bg-amber-500 px-3 py-2 rounded-lg text-sm"
                    >
                      +
                    </button>
                  </div>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {currentProfile.triggers.map((trigger, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <span className="text-amber-400">⚠</span>
                        {trigger}
                      </div>
                    ))}
                    {currentProfile.triggers.length === 0 && (
                      <p className="text-neutral-500 text-sm">No triggers added</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Exercises */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Sensory Exercises</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { name: 'Grounding', duration: '5 min', description: '5-4-3-2-1 sensory scan' },
                  { name: 'Mindful Focus', duration: '10 min', description: 'Single-sense attention practice' },
                  { name: 'Desensitization', duration: '15 min', description: 'Gradual exposure to triggers' },
                  { name: 'Enhancement', duration: '10 min', description: 'Sensory acuity exercises' },
                ].map(exercise => (
                  <div key={exercise.name} className="p-4 bg-neutral-800 rounded-lg">
                    <div className="flex justify-between mb-1">
                      <h3 className="font-medium">{exercise.name}</h3>
                      <span className="text-xs text-neutral-400">{exercise.duration}</span>
                    </div>
                    <p className="text-sm text-neutral-400">{exercise.description}</p>
                    <button className="mt-2 text-cyan-400 text-sm hover:text-cyan-300">
                      Start Exercise →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Overall Profile */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4">Sensory Profile Overview</h2>
              <div className="space-y-3">
                {Object.entries(profiles).map(([sense, profile]) => (
                  <div key={sense}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="flex items-center gap-1">
                        <span>{senseIcons[sense as keyof typeof senseIcons]}</span>
                        {senseNames[sense as keyof typeof senseNames]}
                      </span>
                      <span>{profile.sensitivity}</span>
                    </div>
                    <div className="h-2 bg-neutral-800 rounded-full">
                      <div
                        className="h-full bg-cyan-500 rounded-full transition-all"
                        style={{ width: `${profile.sensitivity * 10}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Coach */}
            <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">🤖</span>
                <h2 className="text-lg font-semibold">Sensory Coach</h2>
              </div>
              <p className="text-sm text-neutral-400 mb-4">
                Get personalized exercises and environment recommendations
              </p>
              <button className="w-full bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                Get Recommendations
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
