// Organic OS - Communication Module
// Public Speaking & Expression Mastery

'use client';

import { useState } from 'react';

interface SpeakingGoal {
  id: string;
  name: string;
  targetEvent: string;
  targetDate: Date;
  progress: number;
  milestones: string[];
}

interface PracticeSession {
  id: string;
  type: 'impromptu' | 'prepared' | 'feedback' | 'video';
  topic: string;
  duration: number;
  rating: number;
  feedback: string;
  date: Date;
}

const speakingTypes = [
  { id: 'keynote', label: 'Keynote Speech', icon: '🎤', description: 'Formal, 30+ min presentations' },
  { id: 'pitch', label: 'Elevator Pitch', icon: '💡', description: '30 sec - 2 min persuasive talks' },
  { id: 'workshop', label: 'Workshop Facilitation', icon: '👥', description: 'Interactive teaching sessions' },
  { id: 'panel', label: 'Panel Discussion', icon: '🗣️', description: 'Expert dialogue formats' },
  { id: 'impromptu', label: 'Impromptu Speaking', icon: '⚡', description: 'Spontaneous response practice' },
  { id: 'storytelling', label: 'Storytelling', icon: '📖', description: 'Narrative and anecdote mastery' },
];

export default function CommunicationPage() {
  const [activeTab, setActiveTab] = useState<'goals' | 'practice' | 'frameworks' | 'feedback'>('goals');
  const [goals, setGoals] = useState<SpeakingGoal[]>([
    {
      id: '1',
      name: 'Master storytelling',
      targetEvent: 'Team presentation',
      targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      progress: 35,
      milestones: ['Learn story structure', 'Practice 3 stories', 'Record and review', 'Get live feedback'],
    },
  ]);
  const [sessions, setSessions] = useState<PracticeSession[]>([]);
  const [newGoal, setNewGoal] = useState({
    name: '',
    targetEvent: '',
    targetDate: '',
  });

  const addGoal = () => {
    if (newGoal.name) {
      setGoals([
        {
          id: Date.now().toString(),
          ...newGoal,
          targetDate: new Date(newGoal.targetDate),
          progress: 0,
          milestones: [],
        },
        ...goals,
      ]);
      setNewGoal({ name: '', targetEvent: '', targetDate: '' });
    }
  };

  const frameworks = [
    {
      name: 'PREP',
      structure: 'Point → Reason → Example → Point',
      useCase: 'Quick pitches, elevator speeches',
      icon: '📍',
    },
    {
      name: 'AIDA',
      structure: 'Attention → Interest → Desire → Action',
      useCase: 'Persuasive presentations',
      icon: '🎯',
    },
    {
      name: 'STAR',
      structure: 'Situation → Task → Action → Result',
      useCase: 'Stories, interviews, case studies',
      icon: '⭐',
    },
    {
      name: 'Monroe\'s Motivated Sequence',
      structure: 'Attention → Need → Satisfaction → Visualization → Action',
      useCase: 'Persuasive speeches, sales',
      icon: '🔄',
    },
    {
      name: 'Past-Present-Future',
      structure: 'Past context → Present situation → Future vision',
      useCase: 'Roadmaps, strategic presentations',
      icon: '📅',
    },
    {
      name: 'What-So What-Now What',
      structure: 'Key point → Significance → Implications',
      useCase: 'Executive summaries, updates',
      icon: '🔍',
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* Header */}
      <div className="border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎤</span>
            <div>
              <h1 className="text-2xl font-bold">Communication Module</h1>
              <p className="text-sm text-neutral-400">Master the art of expression</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Speaking Types Quick Access */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Speaking Formats</h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-3">
            {speakingTypes.map(type => (
              <button
                key={type.id}
                className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl hover:border-neutral-700 transition-colors text-left"
              >
                <span className="text-2xl mb-2 block">{type.icon}</span>
                <h3 className="font-medium text-sm">{type.label}</h3>
                <p className="text-xs text-neutral-400 mt-1">{type.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {[
            { id: 'goals', label: 'Speaking Goals', icon: '🎯' },
            { id: 'practice', label: 'Practice', icon: '🏋️' },
            { id: 'frameworks', label: 'Frameworks', icon: '📐' },
            { id: 'feedback', label: 'AI Feedback', icon: '🤖' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Goals Tab */}
        {activeTab === 'goals' && (
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4">Set Speaking Goal</h2>
                
                <div className="mb-4">
                  <label className="block text-sm text-neutral-400 mb-1">Goal Name</label>
                  <input
                    type="text"
                    value={newGoal.name}
                    onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                    placeholder="e.g., Master storytelling"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm text-neutral-400 mb-1">Target Event</label>
                  <input
                    type="text"
                    value={newGoal.targetEvent}
                    onChange={(e) => setNewGoal({ ...newGoal, targetEvent: e.target.value })}
                    placeholder="e.g., Team presentation, conference"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm text-neutral-400 mb-1">Target Date</label>
                  <input
                    type="date"
                    value={newGoal.targetDate}
                    onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <button
                  onClick={addGoal}
                  className="w-full bg-purple-600 hover:bg-purple-500 text-white px-4 py-3 rounded-lg font-medium transition-colors"
                >
                  Create Goal
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4">Your Speaking Goals</h2>
                {goals.length === 0 ? (
                  <p className="text-neutral-400">No goals set yet. Start with your first speaking goal!</p>
                ) : (
                  <div className="space-y-4">
                    {goals.map(goal => (
                      <div key={goal.id} className="p-4 bg-neutral-800 rounded-lg">
                        <div className="flex justify-between mb-2">
                          <h3 className="font-medium">{goal.name}</h3>
                          <span className="text-xs text-neutral-400">
                            {Math.ceil((goal.targetDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000))} days left
                          </span>
                        </div>
                        <p className="text-sm text-neutral-400 mb-3">{goal.targetEvent}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-neutral-700 rounded-full">
                            <div
                              className="h-full bg-purple-500 rounded-full transition-all"
                              style={{ width: `${goal.progress}%` }}
                            />
                          </div>
                          <span className="text-sm text-purple-400">{goal.progress}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Practice Tab */}
        {activeTab === 'practice' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-4 gap-4">
              {[
                { type: 'impromptu', label: 'Impromptu', icon: '⚡', prompt: 'Speak for 2 min on: Your biggest learning from last month' },
                { type: 'prepared', label: 'Prepared', icon: '📝', prompt: 'Record a 5-min talk on your expertise' },
                { type: 'feedback', label: 'Get Feedback', icon: '👂', prompt: 'Upload speech for AI analysis' },
                { type: 'video', label: 'Video Review', icon: '📹', prompt: 'Record yourself and review body language' },
              ].map(practice => (
                <div key={practice.type} className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                  <span className="text-3xl mb-3 block">{practice.icon}</span>
                  <h3 className="font-semibold mb-2">{practice.label}</h3>
                  <p className="text-sm text-neutral-400 mb-4">{practice.prompt}</p>
                  <button className="w-full bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                    Start Practice
                  </button>
                </div>
              ))}
            </div>

            {/* Recent Sessions */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Recent Practice Sessions</h2>
              {sessions.length === 0 ? (
                <div className="text-center py-8">
                  <span className="text-4xl mb-4 block">🎤</span>
                  <p className="text-neutral-400">No practice sessions recorded yet</p>
                  <p className="text-sm text-neutral-500 mt-1">Start practicing to track your progress</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {sessions.map(session => (
                    <div key={session.id} className="p-4 bg-neutral-800 rounded-lg">
                      <div className="flex justify-between mb-1">
                        <span className="font-medium capitalize">{session.type} Practice</span>
                        <span className="text-xs text-neutral-400">{session.date.toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-neutral-400">{session.topic} • {session.duration} min</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Frameworks Tab */}
        {activeTab === 'frameworks' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {frameworks.map(framework => (
              <div key={framework.name} className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                <span className="text-3xl mb-3 block">{framework.icon}</span>
                <h3 className="text-lg font-semibold mb-2">{framework.name}</h3>
                <p className="text-sm text-purple-400 mb-2">{framework.structure}</p>
                <p className="text-sm text-neutral-400">{framework.useCase}</p>
                <button className="mt-4 text-purple-400 text-sm hover:text-purple-300">
                  Use Framework →
                </button>
              </div>
            ))}
          </div>
        )}

        {/* AI Feedback Tab */}
        {activeTab === 'feedback' && (
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Upload for AI Feedback</h2>
              <div className="border-2 border-dashed border-neutral-700 rounded-lg p-8 text-center mb-4">
                <span className="text-4xl mb-2 block">📹</span>
                <p className="text-neutral-400">Drop video or audio file</p>
                <p className="text-xs text-neutral-500 mt-1">MP4, MP3, WAV supported</p>
              </div>
              <button className="w-full bg-purple-600 hover:bg-purple-500 text-white px-4 py-3 rounded-lg font-medium transition-colors">
                Analyze Speech
              </button>
            </div>

            <div className="space-y-6">
              <div className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">🤖</span>
                  <h2 className="text-lg font-semibold">AI Speaking Coach</h2>
                </div>
                <p className="text-sm text-neutral-400 mb-4">
                  Get detailed feedback on your delivery, content, and presence.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-purple-400">✓</span>
                    <span>Pacing and vocal variety analysis</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-purple-400">✓</span>
                    <span>Body language and eye contact</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-purple-400">✓</span>
                    <span>Content structure recommendations</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-purple-400">✓</span>
                    <span>Filler word detection</span>
                  </div>
                </div>
              </div>

              {/* Sample Feedback */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                <h2 className="text-lg font-semibold mb-4">Sample Feedback</h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Pacing</span>
                      <span className="text-sm text-green-400">8/10</span>
                    </div>
                    <div className="h-2 bg-neutral-800 rounded-full">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: '80%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Clarity</span>
                      <span className="text-sm text-yellow-400">6/10</span>
                    </div>
                    <div className="h-2 bg-neutral-800 rounded-full">
                      <div className="h-full bg-yellow-500 rounded-full" style={{ width: '60%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Engagement</span>
                      <span className="text-sm text-green-400">7/10</span>
                    </div>
                    <div className="h-2 bg-neutral-800 rounded-full">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: '70%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
