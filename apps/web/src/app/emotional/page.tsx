// Organic OS - Emotional Module
// Master Emotional Intelligence

'use client';

import { useState } from 'react';

// Emotion taxonomy from emotional-mastery
const emotionCategories = {
  primary: [
    { name: 'Joy', icon: '😊', color: 'bg-yellow-500', opposites: ['Sadness'] },
    { name: 'Sadness', icon: '😢', color: 'bg-blue-500', opposites: ['Joy'] },
    { name: 'Anger', icon: '😠', color: 'bg-red-500', opposites: ['Fear'] },
    { name: 'Fear', icon: '😨', color: 'bg-purple-500', opposites: ['Anger'] },
    { name: 'Surprise', icon: '😲', color: 'bg-orange-400', opposites: ['Anticipation'] },
    { name: 'Anticipation', icon: '🤔', color: 'bg-green-500', opposites: ['Surprise'] },
    { name: 'Trust', icon: '🤝', color: 'bg-cyan-500', opposites: ['Disgust'] },
    { name: 'Disgust', icon: '🤢', color: 'bg-lime-600', opposites: ['Trust'] },
  ],
  secondary: [
    'Amusement', 'Anxiety', 'Awe', 'Boredom', 'Calmness', 'Confusion',
    'Curiosity', 'Embarrassment', 'Envy', 'Excitement', 'Guilt', 'Hope',
    'Interest', 'Nostalgia', 'Pride', 'Relief', 'Remorse', 'Shame'
  ],
};

interface JournalEntry {
  id: string;
  emotion: string;
  intensity: number;
  triggers: string[];
  thoughts: string;
  regulationStrategy: string;
  timestamp: Date;
}

export default function EmotionalPage() {
  const [activeTab, setActiveTab] = useState<'journal' | 'taxonomy' | 'practice'>('journal');
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [newEntry, setNewEntry] = useState({
    emotion: '',
    intensity: 5,
    triggers: '',
    thoughts: '',
    regulationStrategy: '',
  });
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);

  const addEntry = () => {
    if (newEntry.emotion) {
      setJournalEntries([
        {
          id: Date.now().toString(),
          ...newEntry,
          triggers: newEntry.triggers.split(',').map(t => t.trim()),
          timestamp: new Date(),
        },
        ...journalEntries,
      ]);
      setNewEntry({
        emotion: '',
        intensity: 5,
        triggers: '',
        thoughts: '',
        regulationStrategy: '',
      });
    }
  };

  const regulationStrategies = [
    { name: 'Deep Breathing', description: '4-7-8 technique', icon: '🫁' },
    { name: 'Progressive Muscle Relaxation', description: 'Tense and release', icon: '💪' },
    { name: 'Cognitive Reframing', description: 'Change perspective', icon: '🔄' },
    { name: 'Grounding', description: '5-4-3-2-1 technique', icon: '🎯' },
    { name: 'Journaling', description: 'Express in writing', icon: '📝' },
    { name: 'Physical Activity', description: 'Move your body', icon: '🏃' },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* Header */}
      <div className="border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">💚</span>
            <div>
              <h1 className="text-2xl font-bold">Emotional Mastery</h1>
              <p className="text-sm text-neutral-400">Understand, express, and regulate your emotions</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {[
            { id: 'journal', label: 'Emotion Journal', icon: '📓' },
            { id: 'taxonomy', label: 'Emotion Taxonomy', icon: '📊' },
            { id: 'practice', label: 'Practice', icon: '🏋️' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-green-600 text-white'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Journal Tab */}
        {activeTab === 'journal' && (
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4">Log Your Emotion</h2>
                
                {/* Emotion Selection */}
                <div className="mb-4">
                  <label className="block text-sm text-neutral-400 mb-2">What emotion are you feeling?</label>
                  <div className="flex flex-wrap gap-2">
                    {emotionCategories.primary.map(emotion => (
                      <button
                        key={emotion.name}
                        onClick={() => setNewEntry({ ...newEntry, emotion: emotion.name })}
                        className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                          newEntry.emotion === emotion.name
                            ? `${emotion.color} text-white scale-105`
                            : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                        }`}
                      >
                        <span className="mr-1">{emotion.icon}</span>
                        {emotion.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Secondary Emotions */}
                <div className="mb-4">
                  <label className="block text-sm text-neutral-400 mb-2">Or select a secondary emotion:</label>
                  <div className="flex flex-wrap gap-2">
                    {emotionCategories.secondary.map(emotion => (
                      <button
                        key={emotion}
                        onClick={() => setNewEntry({ ...newEntry, emotion })}
                        className={`px-3 py-1 rounded-lg text-xs transition-all ${
                          newEntry.emotion === emotion
                            ? 'bg-green-500 text-white'
                            : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                        }`}
                      >
                        {emotion}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Intensity */}
                <div className="mb-4">
                  <div className="flex justify-between mb-1">
                    <label className="text-sm text-neutral-400">Intensity</label>
                    <span className="text-green-400">{newEntry.intensity}/10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={newEntry.intensity}
                    onChange={(e) => setNewEntry({ ...newEntry, intensity: parseInt(e.target.value) })}
                    className="w-full accent-green-500"
                  />
                </div>

                {/* Triggers */}
                <div className="mb-4">
                  <label className="block text-sm text-neutral-400 mb-1">What triggered this emotion?</label>
                  <input
                    type="text"
                    value={newEntry.triggers}
                    onChange={(e) => setNewEntry({ ...newEntry, triggers: e.target.value })}
                    placeholder="What happened?"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                {/* Thoughts */}
                <div className="mb-4">
                  <label className="block text-sm text-neutral-400 mb-1">What thoughts came up?</label>
                  <textarea
                    value={newEntry.thoughts}
                    onChange={(e) => setNewEntry({ ...newEntry, thoughts: e.target.value })}
                    placeholder="What were you thinking?"
                    className="w-full h-24 bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                  />
                </div>

                {/* Regulation Strategy */}
                <div className="mb-4">
                  <label className="block text-sm text-neutral-400 mb-1">What did you do to regulate?</label>
                  <select
                    value={newEntry.regulationStrategy}
                    onChange={(e) => setNewEntry({ ...newEntry, regulationStrategy: e.target.value })}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select a strategy...</option>
                    {regulationStrategies.map(strategy => (
                      <option key={strategy.name} value={strategy.name}>
                        {strategy.icon} {strategy.name}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={addEntry}
                  className="w-full bg-green-600 hover:bg-green-500 text-white px-4 py-3 rounded-lg font-medium transition-colors"
                >
                  Save Entry
                </button>
              </div>
            </div>

            {/* Recent Entries */}
            <div className="space-y-6">
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4">Recent Entries</h2>
                {journalEntries.length === 0 ? (
                  <p className="text-neutral-400">No entries yet. Start logging your emotions!</p>
                ) : (
                  <div className="space-y-4">
                    {journalEntries.slice(0, 5).map(entry => {
                      const emotionData = emotionCategories.primary.find(e => e.name === entry.emotion);
                      return (
                        <div key={entry.id} className="p-4 bg-neutral-800 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`w-3 h-3 rounded-full ${emotionData?.color || 'bg-neutral-500'}`} />
                            <span className="font-medium">{entry.emotion}</span>
                            <span className="text-xs text-neutral-400">
                              {entry.intensity}/10 • {entry.timestamp.toLocaleDateString()}
                            </span>
                          </div>
                          {entry.triggers.length > 0 && (
                            <p className="text-sm text-neutral-400">Trigger: {entry.triggers.join(', ')}</p>
                          )}
                          {entry.regulationStrategy && (
                            <p className="text-sm text-green-400">
                              Strategy: {entry.regulationStrategy}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Emotion Insights */}
              <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-6">
                <h2 className="text-lg font-semibold mb-4">AI Emotion Insights</h2>
                <p className="text-sm text-neutral-400 mb-4">
                  Patterns and suggestions based on your journal entries
                </p>
                <button className="w-full bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                  Analyze Patterns
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Taxonomy Tab */}
        {activeTab === 'taxonomy' && (
          <div className="space-y-8">
            {/* Primary Emotions */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Primary Emotions</h2>
              <div className="grid md:grid-cols-4 gap-4">
                {emotionCategories.primary.map(emotion => (
                  <div
                    key={emotion.name}
                    onClick={() => setSelectedEmotion(emotion.name)}
                    className={`p-4 rounded-xl cursor-pointer transition-all hover:scale-105 ${
                      selectedEmotion === emotion.name ? `${emotion.color} text-white` : 'bg-neutral-900 border border-neutral-800'
                    }`}
                  >
                    <span className="text-3xl block mb-2">{emotion.icon}</span>
                    <h3 className="font-semibold">{emotion.name}</h3>
                    <p className={`text-xs mt-1 ${selectedEmotion === emotion.name ? 'text-white/80' : 'text-neutral-400'}`}>
                      Opposite: {emotion.opposites.join(', ')}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Secondary Emotions */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Secondary Emotions</h2>
              <div className="flex flex-wrap gap-2">
                {emotionCategories.secondary.map(emotion => (
                  <button
                    key={emotion}
                    onClick={() => setSelectedEmotion(emotion)}
                    className={`px-4 py-2 rounded-lg text-sm transition-all ${
                      selectedEmotion === emotion
                        ? 'bg-green-500 text-white'
                        : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                    }`}
                  >
                    {emotion}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Emotion Detail */}
            {selectedEmotion && (
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">{selectedEmotion}</h2>
                  <button onClick={() => setSelectedEmotion(null)} className="text-neutral-400 hover:text-white">
                    ×
                  </button>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-neutral-400 mb-2">Definition</h3>
                    <p className="text-sm">
                      {selectedEmotion === 'Joy' && 'A state of happiness, contentment, and well-being.'}
                      {selectedEmotion === 'Sadness' && 'Emotion resulting from loss, disappointment, or grief.'}
                      {selectedEmotion === 'Anger' && 'Strong emotion from feeling wronged or frustrated.'}
                      {selectedEmotion === 'Fear' && 'Response to perceived threat or danger.'}
                      {!['Joy', 'Sadness', 'Anger', 'Fear'].includes(selectedEmotion) &&
                        'A complex emotional state requiring introspection.'}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-neutral-400 mb-2">Physical Signs</h3>
                    <ul className="text-sm space-y-1">
                      <li>• Notice bodily sensations</li>
                      <li>• Observe tension patterns</li>
                      <li>• Track breathing changes</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-neutral-400 mb-2">Healthy Expression</h3>
                    <ul className="text-sm space-y-1">
                      <li>• Acknowledge without judgment</li>
                      <li>• Choose appropriate time/place</li>
                      <li>• Use constructive communication</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Practice Tab */}
        {activeTab === 'practice' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {regulationStrategies.map(strategy => (
                <div key={strategy.name} className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                  <span className="text-3xl mb-3 block">{strategy.icon}</span>
                  <h3 className="text-lg font-semibold mb-1">{strategy.name}</h3>
                  <p className="text-sm text-neutral-400 mb-4">{strategy.description}</p>
                  <button className="w-full bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                    Practice Now
                  </button>
                </div>
              ))}
            </div>

            {/* Daily Practice */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Daily Practice Challenge</h2>
              <p className="text-neutral-400 mb-4">
                Complete one emotion regulation exercise each day to build your EI muscles.
              </p>
              <div className="grid md:grid-cols-7 gap-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                  <div
                    key={day}
                    className={`p-3 rounded-lg text-center ${
                      i < 3 ? 'bg-green-500/20 border border-green-500' : 'bg-neutral-800'
                    }`}
                  >
                    <p className="text-xs text-neutral-400">{day}</p>
                    {i < 3 && <span className="text-green-400">✓</span>}
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
