'use client'

import { useState } from 'react'
import { Card, Button, Spinner } from '@/components/design-system'

const emotionalTopics = [
  { id: 'identify', name: 'Identification', icon: '🔍', description: 'Recognize and name emotions' },
  { id: 'regulate', name: 'Regulation', icon: '⚖️', description: 'Manage emotional responses' },
  { id: 'express', name: 'Expression', icon: '🎭', description: 'Communicate feelings effectively' },
  { id: 'understand', name: 'Understanding', icon: '🧠', description: 'Why you feel what you feel' },
  { id: 'empathy', name: 'Empathy', icon: '💚', description: 'Connect with others emotions' },
  { id: 'resilience', name: 'Resilience', icon: '🦾', description: 'Bounce from emotional challenges' },
]

export default function EmotionalPage() {
  const [activeTopic, setActiveTopic] = useState('identify')
  const [userInput, setUserInput] = useState('')
  const [aiResponse, setAiResponse] = useState('')
  const [loading, setLoading] = useState(false)

  const currentTopic = emotionalTopics.find(t => t.id === activeTopic)!

  const handleAskAI = async () => {
    if (!userInput.trim()) return
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setAiResponse(`Understanding ${currentTopic.name.toLowerCase()} is key to emotional mastery.

The ${currentTopic.name.toLowerCase()} framework includes:
1. Awareness practices
2. Daily exercises
3. Progress tracking
4. Integration with other emotional skills`)
    setLoading(false)
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <span className="text-5xl">💚</span>
          <div>
            <h1 className="text-4xl font-display font-bold">Emotional</h1>
            <p className="text-text-secondary text-lg">
              Master emotional intelligence
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <h2 className="text-lg font-semibold mb-4 text-text-muted uppercase tracking-wider">
            Skills
          </h2>
          <div className="space-y-2">
            {emotionalTopics.map((topic) => (
              <button
                key={topic.id}
                onClick={() => setActiveTopic(topic.id)}
                className={`w-full flex items-center gap-3 p-4 rounded-lg transition-all ${
                  activeTopic === topic.id
                    ? 'bg-accent-primary/10 border border-accent-primary/30 text-accent-primary'
                    : 'bg-surface-primary border border-surface-secondary hover:border-accent-primary/30'
                }`}
              >
                <span className="text-2xl">{topic.icon}</span>
                <div className="text-left">
                  <p className="font-medium">{topic.name}</p>
                  <p className="text-xs text-text-muted">{topic.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3">
              <span className="text-3xl">{currentTopic.icon}</span>
              {currentTopic.name}
            </h2>
            <p className="text-text-secondary mb-6">
              {currentTopic.description}. Build this essential emotional skill.
            </p>

            <div className="border-t border-surface-secondary pt-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span>🤖</span> AI Coach
              </h3>
              <textarea
                placeholder={`Ask about ${currentTopic.name.toLowerCase()}...`}
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="w-full px-4 py-3 bg-background-secondary border border-surface-secondary rounded-lg text-text-primary placeholder-text-muted resize-none min-h-[100px]"
              />
              <div className="flex gap-3 mt-4">
                <Button onClick={handleAskAI} disabled={loading || !userInput.trim()}>
                  {loading ? <><Spinner className="mr-2" />Thinking...</> : 'Explore with AI →'}
                </Button>
              </div>
              {aiResponse && (
                <div className="mt-6 p-4 bg-accent-primary/5 border border-accent-primary/20 rounded-lg">
                  <p className="text-text-primary">{aiResponse}</p>
                </div>
              )}
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="secondary" className="justify-start gap-2">
                <span>📓</span> Emotion Journal
              </Button>
              <Button variant="secondary" className="justify-start gap-2">
                <span>🎯</span> Daily Check-in
              </Button>
              <Button variant="secondary" className="justify-start gap-2">
                <span>🧘</span> Regulation Exercises
              </Button>
              <Button variant="secondary" className="justify-start gap-2">
                <span>📊</span> Mood Tracker
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
