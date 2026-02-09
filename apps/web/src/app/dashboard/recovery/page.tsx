'use client'

import { useState } from 'react'
import { Card, Button, Spinner } from '@/components/design-system'

const recoveryTopics = [
  { id: 'assess', name: 'Burnout Assessment', icon: '🔥', description: 'Measure your burnout levels' },
  { id: 'stress', name: 'Stress Tracking', icon: '📊', description: 'Monitor stress patterns' },
  { id: 'recovery', name: 'Recovery Protocols', icon: '🔋', description: 'Evidence-based recovery methods' },
  { id: 'habits', name: 'Sustainable Habits', icon: '🌱', description: 'Build lasting healthy routines' },
  { id: 'boundaries', name: 'Boundaries', icon: '🛡️', description: 'Set and maintain limits' },
  { id: 'resilience', name: 'Resilience', icon: '💪', description: 'Build long-term resilience' },
]

export default function RecoveryPage() {
  const [activeTopic, setActiveTopic] = useState('assess')
  const [userInput, setUserInput] = useState('')
  const [aiResponse, setAiResponse] = useState('')
  const [loading, setLoading] = useState(false)

  const currentTopic = recoveryTopics.find(t => t.id === activeTopic)!

  const handleAskAI = async () => {
    if (!userInput.trim()) return
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setAiResponse(`${currentTopic.name} is essential for preventing burnout.

Your recovery roadmap:
1. Assessment - Know where you stand
2. Identification - What's draining you?
3. Intervention - Evidence-based strategies
4. Integration - Make it part of your life`)
    setLoading(false)
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <span className="text-5xl">🔋</span>
          <div>
            <h1 className="text-4xl font-display font-bold">Recovery</h1>
            <p className="text-text-secondary text-lg">
              Prevent burnout and manage stress
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <h2 className="text-lg font-semibold mb-4 text-text-muted uppercase tracking-wider">
            Recovery Areas
          </h2>
          <div className="space-y-2">
            {recoveryTopics.map((topic) => (
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
              {currentTopic.description}. Your path to sustainable performance.
            </p>

            <div className="border-t border-surface-secondary pt-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span>🤖</span> Recovery Coach
              </h3>
              <textarea
                placeholder={`Ask about ${currentTopic.name.toLowerCase()}...`}
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="w-full px-4 py-3 bg-background-secondary border border-surface-secondary rounded-lg text-text-primary placeholder-text-muted resize-none min-h-[100px]"
              />
              <div className="flex gap-3 mt-4">
                <Button onClick={handleAskAI} disabled={loading || !userInput.trim()}>
                  {loading ? <><Spinner className="mr-2" />Thinking...</> : 'Get Support →'}
                </Button>
              </div>
              {aiResponse && (
                <div className="mt-6 p-4 bg-accent-primary/5 border border-accent-primary/20 rounded-lg">
                  <p className="text-text-primary">{aiResponse}</p>
                </div>
              )}
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20">
            <h3 className="text-lg font-semibold mb-4">📋 Quick Assessment</h3>
            <p className="text-text-secondary mb-4">
              Take a quick burnout assessment to understand your current state.
            </p>
            <Button>Start Assessment →</Button>
          </Card>
        </div>
      </div>
    </div>
  )
}
