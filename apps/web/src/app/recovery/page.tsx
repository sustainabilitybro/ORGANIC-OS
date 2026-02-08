// Organic OS - Recovery Module
// Burnout Prevention & Stress Management

'use client';

import { useState } from 'react';

interface BurnoutAssessment {
  exhaustion: number;
  cynicism: number;
  inefficacy: number;
  lastAssessment: Date;
}

interface StressLog {
  id: string;
  source: string;
  intensity: number;
  duration: number;
  copingStrategies: string[];
  effectiveness: number;
  date: Date;
}

const stressSources = [
  'Work deadline', 'Relationship conflict', 'Financial worry', 'Health concern',
  'Too many responsibilities', 'Lack of sleep', 'Social pressure', 'Perfectionism',
  'Uncertainty', 'Physical pain', 'Technology overload', 'Information overload'
];

const copingStrategies = [
  'Deep breathing', 'Exercise', 'Meditation', 'Nature walk', 'Journaling',
  'Talk to friend', 'Creative expression', 'Boundaries', 'Time management',
  'Rest', 'Nutrition', 'Social connection', 'Professional help'
];

export default function RecoveryPage() {
  const [activeTab, setActiveTab] = useState<'assessment' | 'stress-log' | 'protocols' | 'tracking'>('assessment');
  const [assessment, setAssessment] = useState<BurnoutAssessment>({
    exhaustion: 5,
    cynicism: 5,
    inefficacy: 5,
    lastAssessment: new Date(),
  });
  const [stressLogs, setStressLogs] = useState<StressLog[]>([]);
  const [newLog, setNewLog] = useState({
    source: '',
    intensity: 5,
    duration: 30,
    copingStrategies: [] as string[],
    effectiveness: 5,
  });
  const [weeklyGoal, setWeeklyGoal] = useState({
    meditation: 60,
    exercise: 180,
    sleep: 56,
    nature: 60,
  });

  const calculateRiskLevel = () => {
    const avg = (assessment.exhaustion + assessment.cynicism + assessment.inefficacy) / 3;
    if (avg <= 3) return { level: 'Low', color: 'text-green-400', bg: 'bg-green-500' };
    if (avg <= 5) return { level: 'Moderate', color: 'text-yellow-400', bg: 'bg-yellow-500' };
    if (avg <= 7) return { level: 'High', color: 'text-orange-400', bg: 'bg-orange-500' };
    return { level: 'Severe', color: 'text-red-400', bg: 'bg-red-500' };
  };

  const risk = calculateRiskLevel();

  const addStressLog = () => {
    if (newLog.source) {
      setStressLogs([
        {
          id: Date.now().toString(),
          ...newLog,
          date: new Date(),
        },
        ...stressLogs,
      ]);
      setNewLog({
        source: '',
        intensity: 5,
        duration: 30,
        copingStrategies: [],
        effectiveness: 5,
      });
    }
  };

  const toggleCopingStrategy = (strategy: string) => {
    if (newLog.copingStrategies.includes(strategy)) {
      setNewLog({
        ...newLog,
        copingStrategies: newLog.copingStrategies.filter(s => s !== strategy),
      });
    } else {
      setNewLog({
        ...newLog,
        copingStrategies: [...newLog.copingStrategies, strategy],
      });
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* Header */}
      <div className="border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🔋</span>
            <div>
              <h1 className="text-2xl font-bold">Recovery Module</h1>
              <p className="text-sm text-neutral-400">Burnout prevention & stress management</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Risk Banner */}
        <div className={`mb-8 p-6 rounded-xl border ${risk.level === 'Low' ? 'bg-green-900/20 border-green-500/30' : risk.level === 'Moderate' ? 'bg-yellow-900/20 border-yellow-500/30' : risk.level === 'High' ? 'bg-orange-900/20 border-orange-500/30' : 'bg-red-900/20 border-red-500/30'}`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Burnout Risk Level: <span className={risk.color}>{risk.level}</span></h2>
              <p className="text-sm text-neutral-400 mt-1">
                Last assessed: {assessment.lastAssessment.toLocaleDateString()}
              </p>
            </div>
            <button className="bg-neutral-800 hover:bg-neutral-700 px-4 py-2 rounded-lg text-sm transition-colors">
              Reassess Now
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {[
            { id: 'assessment', label: 'Burnout Assessment', icon: '📋' },
            { id: 'stress-log', label: 'Stress Log', icon: '📝' },
            { id: 'protocols', label: 'Recovery Protocols', icon: '💊' },
            { id: 'tracking', label: 'Progress Tracking', icon: '📈' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-amber-600 text-white'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Assessment Tab */}
        {activeTab === 'assessment' && (
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-6">Burnout Assessment</h2>
              
              {/* Exhaustion */}
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <label className="font-medium">Exhaustion</label>
                  <span className="text-amber-400">{assessment.exhaustion}/10</span>
                </div>
                <p className="text-sm text-neutral-400 mb-2">How drained do you feel on a typical day?</p>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={assessment.exhaustion}
                  onChange={(e) => setAssessment({ ...assessment, exhaustion: parseInt(e.target.value) })}
                  className="w-full accent-amber-500"
                />
              </div>

              {/* Cynicism */}
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <label className="font-medium">Cynicism</label>
                  <span className="text-amber-400">{assessment.cynicism}/10</span>
                </div>
                <p className="text-sm text-neutral-400 mb-2">How detached or cynical do you feel about work/life?</p>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={assessment.cynicism}
                  onChange={(e) => setAssessment({ ...assessment, cynicism: parseInt(e.target.value) })}
                  className="w-full accent-amber-500"
                />
              </div>

              {/* Inefficacy */}
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <label className="font-medium">Inefficacy</label>
                  <span className="text-amber-400">{assessment.inefficacy}/10</span>
                </div>
                <p className="text-sm text-neutral-400 mb-2">How much do you feel you're not making a difference?</p>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={assessment.inefficacy}
                  onChange={(e) => setAssessment({ ...assessment, inefficacy: parseInt(e.target.value) })}
                  className="w-full accent-amber-500"
                />
              </div>

              <button className="w-full bg-amber-600 hover:bg-amber-500 text-white px-4 py-3 rounded-lg font-medium transition-colors">
                Save Assessment
              </button>
            </div>

            <div className="space-y-6">
              {/* Recommendations */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                <h2 className="text-lg font-semibold mb-4">Personalized Recommendations</h2>
                <div className="space-y-3">
                  {risk.level === 'Low' && (
                    <>
                      <p className="text-green-400">✓ You're in a good place! Keep maintaining your balance.</p>
                      <div className="p-3 bg-neutral-800 rounded-lg">
                        <h3 className="font-medium">Maintain</h3>
                        <p className="text-sm text-neutral-400">Continue your current self-care practices</p>
                      </div>
                    </>
                  )}
                  {risk.level === 'Moderate' && (
                    <>
                      <p className="text-yellow-400">⚠ Time to pay attention and make adjustments.</p>
                      <div className="p-3 bg-neutral-800 rounded-lg">
                        <h3 className="font-medium">Priority Actions</h3>
                        <ul className="text-sm text-neutral-400 space-y-1 mt-1">
                          <li>• Take at least one full rest day per week</li>
                          <li>• Review your workload and delegate if possible</li>
                          <li>• Increase physical activity by 30 min daily</li>
                        </ul>
                      </div>
                    </>
                  )}
                  {(risk.level === 'High' || risk.level === 'Severe') && (
                    <>
                      <p className="text-red-400">⚠ Your burnout risk is significant. Action needed now.</p>
                      <div className="p-3 bg-red-900/30 border border-red-500/30 rounded-lg">
                        <h3 className="font-medium text-red-400">Urgent Actions</h3>
                        <ul className="text-sm text-neutral-300 space-y-1 mt-1">
                          <li>• Consider taking time off if possible</li>
                          <li>• Speak with a mental health professional</li>
                          <li>• Reduce commitments immediately</li>
                          <li>• Focus on non-negotiable self-care</li>
                        </ul>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* AI Coach */}
              <div className="bg-amber-900/20 border border-amber-500/30 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">🤖</span>
                  <h2 className="text-lg font-semibold">Recovery Coach</h2>
                </div>
                <p className="text-sm text-neutral-400 mb-4">
                  Get personalized recovery strategies based on your assessment
                </p>
                <button className="w-full bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                  Get Personalized Plan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stress Log Tab */}
        {activeTab === 'stress-log' && (
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Log Stress Event</h2>
              
              <div className="mb-4">
                <label className="block text-sm text-neutral-400 mb-2">Stress Source</label>
                <select
                  value={newLog.source}
                  onChange={(e) => setNewLog({ ...newLog, source: e.target.value })}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="">Select source...</option>
                  {stressSources.map(source => (
                    <option key={source} value={source}>{source}</option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <div className="flex justify-between mb-1">
                  <label className="text-sm text-neutral-400">Intensity</label>
                  <span className="text-amber-400">{newLog.intensity}/10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={newLog.intensity}
                  onChange={(e) => setNewLog({ ...newLog, intensity: parseInt(e.target.value) })}
                  className="w-full accent-amber-500"
                />
              </div>

              <div className="mb-4">
                <div className="flex justify-between mb-1">
                  <label className="text-sm text-neutral-400">Duration (minutes)</label>
                  <span className="text-amber-400">{newLog.duration}</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="480"
                  step="15"
                  value={newLog.duration}
                  onChange={(e) => setNewLog({ ...newLog, duration: parseInt(e.target.value) })}
                  className="w-full accent-amber-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm text-neutral-400 mb-2">Coping Strategies Used</label>
                <div className="flex flex-wrap gap-2">
                  {copingStrategies.map(strategy => (
                    <button
                      key={strategy}
                      onClick={() => toggleCopingStrategy(strategy)}
                      className={`px-2 py-1 rounded-lg text-xs transition-colors ${
                        newLog.copingStrategies.includes(strategy)
                          ? 'bg-amber-500 text-white'
                          : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                      }`}
                    >
                      {strategy}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between mb-1">
                  <label className="text-sm text-neutral-400">Effectiveness</label>
                  <span className="text-amber-400">{newLog.effectiveness}/10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={newLog.effectiveness}
                  onChange={(e) => setNewLog({ ...newLog, effectiveness: parseInt(e.target.value) })}
                  className="w-full accent-amber-500"
                />
              </div>

              <button
                onClick={addStressLog}
                className="w-full bg-amber-600 hover:bg-amber-500 text-white px-4 py-3 rounded-lg font-medium transition-colors"
              >
                Save Entry
              </button>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Recent Logs</h2>
              {stressLogs.length === 0 ? (
                <p className="text-neutral-400">No stress logs yet. Start tracking!</p>
              ) : (
                <div className="space-y-3">
                  {stressLogs.slice(0, 5).map(log => (
                    <div key={log.id} className="p-4 bg-neutral-800 rounded-lg">
                      <div className="flex justify-between mb-1">
                        <span className="font-medium">{log.source}</span>
                        <span className="text-xs text-neutral-400">{log.date.toLocaleDateString()}</span>
                      </div>
                      <div className="flex gap-4 text-xs text-neutral-400">
                        <span>Intensity: {log.intensity}/10</span>
                        <span>Duration: {log.duration}min</span>
                        <span>Effectiveness: {log.effectiveness}/10</span>
                      </div>
                      {log.copingStrategies.length > 0 && (
                        <div className="flex gap-1 mt-2 flex-wrap">
                          {log.copingStrategies.map(s => (
                            <span key={s} className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded">
                              {s}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Protocols Tab */}
        {activeTab === 'protocols' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: '24-Hour Reset', description: 'Complete rest day protocol', duration: '1 day', icon: '🌙' },
              { name: 'Weekend Recovery', description: 'Extended rest and restoration', duration: '2 days', icon: '🛋️' },
              { name: 'Digital Detox', description: 'Technology-free recovery period', duration: '24-72 hours', icon: '📵' },
              { name: 'Nature Immersion', description: 'Outdoor healing and grounding', duration: '2-4 hours', icon: '🌲' },
              { name: 'Sleep Extension', description: 'Prioritize restorative sleep', duration: '1+ weeks', icon: '😴' },
              { name: 'Social Connection', description: 'Meaningful relationship time', duration: 'Varies', icon: '👥' },
              { name: 'Creative Flow', description: 'Low-pressure creative expression', duration: '1-2 hours', icon: '🎨' },
              { name: 'Body-based Release', description: 'Movement for stress release', duration: '30-60 min', icon: '🏃' },
              { name: 'Mindful Pause', description: 'Micro-meditation breaks', duration: '5-15 min', icon: '🧘' },
            ].map(protocol => (
              <div key={protocol.name} className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                <span className="text-3xl mb-3 block">{protocol.icon}</span>
                <h3 className="text-lg font-semibold mb-1">{protocol.name}</h3>
                <p className="text-sm text-neutral-400 mb-3">{protocol.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-neutral-500">{protocol.duration}</span>
                  <button className="text-amber-400 text-sm hover:text-amber-300">
                    Start Protocol →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tracking Tab */}
        {activeTab === 'tracking' && (
          <div className="space-y-6">
            {/* Weekly Goals */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-6">Weekly Recovery Goals</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { key: 'meditation', label: 'Meditation', unit: 'min', icon: '🧘' },
                  { key: 'exercise', label: 'Exercise', unit: 'min', icon: '🏃' },
                  { key: 'sleep', label: 'Sleep', unit: 'hrs', icon: '😴' },
                  { key: 'nature', label: 'Nature Time', unit: 'min', icon: '🌲' },
                ].map(goal => (
                  <div key={goal.key}>
                    <div className="flex justify-between mb-2">
                      <span className="flex items-center gap-2">
                        <span>{goal.icon}</span>
                        <span>{goal.label}</span>
                      </span>
                      <span className="text-amber-400">{weeklyGoal[goal.key as keyof typeof weeklyGoal]}{goal.unit}/week</span>
                    </div>
                    <div className="h-3 bg-neutral-800 rounded-full">
                      <div
                        className="h-full bg-amber-500 rounded-full transition-all"
                        style={{ width: `${Math.min((weeklyGoal[goal.key as keyof typeof weeklyGoal] / 100) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Progress Stats */}
            <div className="grid md:grid-cols-4 gap-4">
              {[
                { label: 'Days Since Last Burnout', value: '47', icon: '📅' },
                { label: 'Stress Events This Week', value: '3', icon: '⚡' },
                { label: 'Recovery Score', value: '78%', icon: '📊' },
                { label: 'Streak', value: '12 days', icon: '🔥' },
              ].map(stat => (
                <div key={stat.label} className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 text-center">
                  <span className="text-2xl mb-2 block">{stat.icon}</span>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-neutral-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
