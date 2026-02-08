"""
Holistic Alchemy Page - Organic OS

Comprehensive wellness integration module combining multiple dimensions of holistic health:
- Physical vitality and body mechanics
- Mental clarity and cognitive optimization
- Emotional intelligence and regulation
- Spiritual connection and meaning
- Environmental harmony and sustainable living
"""

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface HolisticMetrics {
  physical_vitality: number;
  mental_clarity: number;
  emotional_intelligence: number;
  spiritual_connection: number;
  environmental_harmony: number;
}

interface Practice {
  id: string;
  category: string;
  name: string;
  description: string;
  duration: number;
  benefits: string[];
  frequency: string;
}

interface WellnessEntry {
  id: string;
  date: string;
  category: string;
  practice: string;
  duration: number;
  notes: string;
  mood_before: number;
  mood_after: number;
}

export default function HolisticAlchemyPage() {
  const [metrics, setMetrics] = useState<HolisticMetrics | null>(null);
  const [practices, setPractices] = useState<Practice[]>([]);
  const [entries, setEntries] = useState<WellnessEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchDashboard();
    loadPractices();
    loadEntries();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await fetch('/api/v1/wellness/holistic-alchemy/dashboard');
      if (response.ok) {
        const data = await response.json();
        setMetrics(data.metrics);
      } else {
        // Fallback mock data
        setMetrics({
          physical_vitality: 72,
          mental_clarity: 68,
          emotional_intelligence: 75,
          spiritual_connection: 60,
          environmental_harmony: 80,
        });
      }
    } catch {
      setMetrics({
        physical_vitality: 72,
        mental_clarity: 68,
        emotional_intelligence: 75,
        spiritual_connection: 60,
        environmental_harmony: 80,
      });
    }
    setLoading(false);
  };

  const loadPractices = async () => {
    const defaultPractices: Practice[] = [
      {
        id: 'breathwork',
        category: 'physical',
        name: 'Coherent Breathing',
        description: 'Balanced breathing at 6 breaths/minute to activate parasympathetic nervous system',
        duration: 10,
        benefits: ['Stress reduction', 'Heart rate variability', 'Mental clarity'],
        frequency: 'Daily',
      },
      {
        id: 'meditation',
        category: 'mental',
        name: 'Focused Attention Meditation',
        description: 'Single-pointed concentration practice to train mental focus',
        duration: 20,
        benefits: ['Attention span', 'Emotional regulation', 'Self-awareness'],
        frequency: 'Morning',
      },
      {
        id: 'journaling',
        category: 'emotional',
        name: 'Emotion Journaling',
        description: 'Express and process emotions through structured writing',
        duration: 15,
        benefits: ['Emotional intelligence', 'Self-understanding', 'Stress release'],
        frequency: 'Evening',
      },
      {
        id: 'gratitude',
        category: 'spiritual',
        name: 'Gratitude Practice',
        description: 'Cultivate appreciation for life\'s abundance',
        duration: 5,
        benefits: ['Positivity', 'Social bonds', 'Physical health'],
        frequency: 'Morning & Evening',
      },
      {
        id: 'nature-connection',
        category: 'environmental',
        name: 'Nature Immersion',
        description: 'Mindful presence in natural environments',
        duration: 30,
        benefits: ['Reduced cortisol', 'Creative inspiration', 'Ecological awareness'],
        frequency: 'Weekly',
      },
      {
        id: 'body-scan',
        category: 'physical',
        name: 'Body Scan Meditation',
        description: 'Systematic awareness of bodily sensations',
        duration: 25,
        benefits: ['Body awareness', 'Pain management', 'Relaxation'],
        frequency: 'As needed',
      },
      {
        id: 'visualization',
        category: 'mental',
        name: 'Guided Visualization',
        description: 'Mental imagery for desired outcomes and healing',
        duration: 15,
        benefits: ['Goal achievement', 'Performance', 'Healing'],
        frequency: 'As needed',
      },
      {
        id: 'loving-kindness',
        category: 'emotional',
        name: 'Metta Meditation',
        description: 'Cultivate unconditional love and compassion',
        duration: 20,
        benefits: ['Compassion', 'Relationships', 'Self-acceptance'],
        frequency: 'Daily',
      },
    ];
    setPractices(defaultPractices);
  };

  const loadEntries = async () => {
    const today = new Date().toISOString().split('T')[0];
    const mockEntries: WellnessEntry[] = [
      {
        id: '1',
        date: today,
        category: 'physical',
        practice: 'Coherent Breathing',
        duration: 10,
        notes: 'Felt more centered after session',
        mood_before: 5,
        mood_after: 7,
      },
      {
        id: '2',
        date: today,
        category: 'emotional',
        practice: 'Emotion Journaling',
        duration: 15,
        notes: 'Processed work stress effectively',
        mood_before: 4,
        mood_after: 6,
      },
    ];
    setEntries(mockEntries);
  };

  const categories = [
    { id: 'all', label: 'All Practices', icon: '🌟' },
    { id: 'physical', label: 'Physical', icon: '💪' },
    { id: 'mental', label: 'Mental', icon: '🧠' },
    { id: 'emotional', label: 'Emotional', icon: '💚' },
    { id: 'spiritual', label: 'Spiritual', icon: '🙏' },
    { id: 'environmental', label: 'Environmental', icon: '🌍' },
  ];

  const filteredPractices = selectedCategory === 'all'
    ? practices
    : practices.filter(p => p.category === selectedCategory);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/sustainability" className="text-teal-600 hover:text-teal-700 mb-4 inline-block">
          ← Back to Sustainability
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Holistic Alchemy</h1>
        <p className="text-gray-600">
          Transform your life through integrated wellness practices across physical, mental, emotional, spiritual, and environmental dimensions.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-4 mb-8 border-b border-gray-200">
        {['dashboard', 'practices', 'journal', 'insights'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 px-4 font-medium capitalize ${
              activeTab === tab
                ? 'border-b-2 border-teal-600 text-teal-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && metrics && (
        <div>
          {/* Wellness Radar */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[
              { key: 'physical_vitality', label: 'Physical Vitality', icon: '💪' },
              { key: 'mental_clarity', label: 'Mental Clarity', icon: '🧠' },
              { key: 'emotional_intelligence', label: 'Emotional Intelligence', icon: '💚' },
              { key: 'spiritual_connection', label: 'Spiritual Connection', icon: '🙏' },
              { key: 'environmental_harmony', label: 'Environmental Harmony', icon: '🌍' },
            ].map(({ key, label, icon }) => {
              const score = metrics[key as keyof HolisticMetrics];
              return (
                <div key={key} className={`rounded-xl p-6 ${getScoreBg(score)}`}>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl">{icon}</span>
                    <span className={`text-3xl font-bold ${getScoreColor(score)}`}>{score}%</span>
                  </div>
                  <h3 className="font-semibold text-gray-800">{label}</h3>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                    <div
                      className={`h-2 rounded-full ${score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      style={{ width: `${score}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-4">Today's Practices</h3>
              <div className="text-4xl font-bold text-teal-600">{entries.length}</div>
              <p className="text-gray-500 text-sm mt-1">completed sessions</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-4">Total Time</h3>
              <div className="text-4xl font-bold text-teal-600">
                {entries.reduce((acc, e) => acc + e.duration, 0)}
              </div>
              <p className="text-gray-500 text-sm mt-1">minutes invested</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-4">Mood Shift</h3>
              <div className="text-4xl font-bold text-green-600">
                +{entries.reduce((acc, e) => acc + (e.mood_after - e.mood_before), 0)}
              </div>
              <p className="text-gray-500 text-sm mt-1">average improvement</p>
            </div>
          </div>
        </div>
      )}

      {/* Practices Tab */}
      {activeTab === 'practices' && (
        <div>
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-teal-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>

          {/* Practices Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPractices.map(practice => (
              <div key={practice.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="text-xs font-medium px-2 py-1 bg-teal-100 text-teal-700 rounded-full capitalize">
                      {practice.category}
                    </span>
                    <h3 className="text-xl font-semibold text-gray-800 mt-2">{practice.name}</h3>
                  </div>
                  <span className="text-sm text-gray-500">{practice.duration} min</span>
                </div>
                <p className="text-gray-600 mb-4">{practice.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {practice.benefits.map((benefit, i) => (
                    <span key={i} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      {benefit}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-sm text-gray-500">Best: {practice.frequency}</span>
                  <button className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors">
                    Start Practice
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Journal Tab */}
      {activeTab === 'journal' && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Wellness Journal</h2>
            <button className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors">
              + New Entry
            </button>
          </div>

          <div className="space-y-4">
            {entries.map(entry => (
              <div key={entry.id} className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">{entry.date}</span>
                  <span className="text-xs font-medium px-2 py-1 bg-teal-100 text-teal-700 rounded-full capitalize">
                    {entry.category}
                  </span>
                </div>
                <h4 className="font-medium text-gray-800">{entry.practice}</h4>
                <p className="text-gray-600 text-sm mt-1">{entry.notes}</p>
                <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                  <span>⏱ {entry.duration} min</span>
                  <span>😊 Before: {entry.mood_before} → After: {entry.mood_after}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Insights Tab */}
      {activeTab === 'insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">🌱 Growth Areas</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Spiritual practices show lowest engagement - consider morning gratitude ritual
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                Physical practices are consistent - maintain momentum
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Emotional intelligence improving steadily
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">✨ Recommendations</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-teal-500 rounded-full"></span>
                Try 5-minute breathwork before meetings for mental clarity
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                Nature immersion on weekends boosts all metrics
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                Evening journaling improves sleep quality
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">📅 Weekly Goals</h3>
            <div className="space-y-3">
              {[
                { goal: 'Complete 3 meditation sessions', progress: 2 },
                { goal: 'Practice coherent breathing daily', progress: 5 },
                { goal: 'Nature walk twice this week', progress: 1 },
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">{item.goal}</span>
                    <span className="text-gray-500">{item.progress}/3</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-teal-500 h-2 rounded-full"
                      style={{ width: `${(item.progress / 3) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">🔮 30-Day Vision</h3>
            <p className="text-gray-600 mb-4">
              Based on your current practices, in 30 days you could achieve:
            </p>
            <div className="space-y-2">
              {[
                { metric: 'Physical Vitality', current: 72, projected: 78 },
                { metric: 'Mental Clarity', current: 68, projected: 75 },
                { metric: 'Emotional Intelligence', current: 75, projected: 82 },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">{item.metric}</span>
                  <span className="text-green-600 font-medium">
                    {item.current}% → {item.projected}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
