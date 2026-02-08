// Organic OS - Video Module
// Video Practice & Content Creation

'use client';

import { useState } from 'react';

interface VideoProject {
  id: string;
  title: string;
  type: 'practice' | 'content' | 'presentation';
  status: 'draft' | 'recording' | 'editing' | 'published';
  thumbnail: string;
  duration: number;
  createdAt: Date;
}

const videoTypes = [
  { id: 'speaking', label: 'Speaking Practice', icon: '🎤', description: 'Record yourself practicing speeches' },
  { id: 'tutorial', label: 'Tutorial', icon: '📚', description: 'Teach a skill or concept' },
  { id: 'presentation', label: 'Presentation', icon: '📊', description: 'Slide-based presentations' },
  { id: 'vlog', label: 'Vlog', icon: '📹', description: 'Personal video journaling' },
  { id: 'feedback', label: 'Feedback Request', icon: '👂', description: 'Get AI or peer feedback' },
];

export default function VideoPage() {
  const [activeTab, setActiveTab] = useState<'create' | 'library' | 'practice'>('create');
  const [projects, setProjects] = useState<VideoProject[]>([
    {
      id: '1',
      title: 'Storytelling Practice',
      type: 'practice',
      status: 'draft',
      thumbnail: '/api/placeholder/320/180',
      duration: 0,
      createdAt: new Date(),
    },
  ]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const startRecording = () => {
    setIsRecording(true);
    // Simulate recording timer
    const interval = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
    // Store interval ID for cleanup (would be in real implementation)
  };

  const stopRecording = () => {
    setIsRecording(false);
    setRecordingTime(0);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* Header */}
      <div className="border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📹</span>
            <div>
              <h1 className="text-2xl font-bold">Video Studio</h1>
              <p className="text-sm text-neutral-400">Practice, create, and improve on camera</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {[
            { id: 'create', label: 'Create', icon: '➕' },
            { id: 'library', label: 'Library', icon: '📁' },
            { id: 'practice', label: 'Practice Mode', icon: '🎯' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-rose-600 text-white'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Create Tab */}
        {activeTab === 'create' && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Recording Studio */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Recording Studio</h2>
              
              {/* Video Preview */}
              <div className="aspect-video bg-neutral-800 rounded-lg mb-4 flex items-center justify-center">
                {isRecording ? (
                  <div className="text-center">
                    <span className="text-4xl block mb-2">🔴</span>
                    <span className="text-xl font-mono">
                      {Math.floor(recordingTime / 60)}:{String(recordingTime % 60).padStart(2, '0')}
                    </span>
                  </div>
                ) : (
                  <span className="text-4xl">📹</span>
                )}
              </div>

              {/* Recording Controls */}
              <div className="flex justify-center gap-4 mb-4">
                {!isRecording ? (
                  <button
                    onClick={startRecording}
                    className="bg-rose-600 hover:bg-rose-500 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    <span>🔴</span> Start Recording
                  </button>
                ) : (
                  <button
                    onClick={stopRecording}
                    className="bg-red-600 hover:bg-red-500 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    <span>⏹️</span> Stop
                  </button>
                )}
              </div>

              {/* Settings */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-neutral-400 mb-1">Camera</label>
                  <select className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2">
                    <option>Default Camera</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-neutral-400 mb-1">Microphone</label>
                  <select className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2">
                    <option>Default Microphone</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Quick Start Templates */}
            <div className="space-y-6">
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4">Quick Start Templates</h2>
                <div className="grid grid-cols-2 gap-3">
                  {videoTypes.map(type => (
                    <button
                      key={type.id}
                      className="p-4 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors text-left"
                    >
                      <span className="text-2xl mb-2 block">{type.icon}</span>
                      <h3 className="font-medium text-sm">{type.label}</h3>
                      <p className="text-xs text-neutral-400 mt-1">{type.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Script Assistant */}
              <div className="bg-rose-900/20 border border-rose-500/30 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">🤖</span>
                  <h2 className="text-lg font-semibold">AI Script Assistant</h2>
                </div>
                <p className="text-sm text-neutral-400 mb-4">
                  Get help structuring and writing your video script
                </p>
                <button className="w-full bg-rose-600 hover:bg-rose-500 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                  Generate Script
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Library Tab */}
        {activeTab === 'library' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              {projects.map(project => (
                <div key={project.id} className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
                  <div className="aspect-video bg-neutral-800 flex items-center justify-center">
                    <span className="text-4xl">🎬</span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium">{project.title}</h3>
                    <p className="text-sm text-neutral-400 capitalize">{project.type}</p>
                  </div>
                </div>
              ))}
              
              {/* Add New */}
              <button className="aspect-video bg-neutral-900 border border-neutral-800 border-dashed rounded-xl flex flex-col items-center justify-center hover:border-neutral-700 transition-colors">
                <span className="text-3xl mb-2">➕</span>
                <span className="text-sm text-neutral-400">New Video</span>
              </button>
            </div>
          </div>
        )}

        {/* Practice Mode Tab */}
        {activeTab === 'practice' && (
          <div className="space-y-6">
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Speaking Practice Challenges</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { title: '30-Second Pitch', description: 'Introduce yourself and your work', time: 30 },
                  { title: 'Story Share', description: 'Tell a meaningful personal story', time: 120 },
                  { title: 'Explain Concept', description: 'Explain something you know well', time: 180 },
                  { title: 'Impromptu Response', description: 'React to a random prompt', time: 60 },
                  { title: 'Thank You Speech', description: 'Express gratitude authentically', time: 90 },
                  { title: 'Vision Statement', description: 'Share your vision for the future', time: 120 },
                ].map((challenge, i) => (
                  <div key={i} className="p-4 bg-neutral-800 rounded-lg">
                    <h3 className="font-medium mb-1">{challenge.title}</h3>
                    <p className="text-sm text-neutral-400 mb-3">{challenge.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-neutral-500">{challenge.time} seconds</span>
                      <button className="text-rose-400 text-sm hover:text-rose-300">
                        Start →
                      </button>
                    </div>
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
