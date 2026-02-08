'use client'

import { useState } from 'react'
import { Card, Button, Spinner } from '@organic-os/ui'

const communicationTopics = [
  { id: 'frameworks', name: 'Frameworks', icon: '🏗️', description: 'Proven speaking structures' },
  { id: 'writing', name: 'Speech Writing', icon: '✍️', description: 'Craft compelling speeches' },
  { id: 'delivery', name: 'Delivery', icon: '🎭', description: 'Voice, body, presence' },
  { id: 'video', name: 'Video Practice', icon: '🎥', description: 'Record and improve' },
  { id: 'feedback', name: 'AI Feedback', icon: '🤖', description: 'Get AI-powered critiques' },
  { id: 'progress', name: 'Track Progress', icon: '📈', description: 'Monitor your growth' },
]

export default function CommunicationPage() {
  const [activeTopic, setActiveTopic] = useState('frameworks')
  const [userInput, setUserInput] = useState('')
  const [aiResponse, setAiResponse] = useState('')
  const [loading, setLoading] = useState(false)

  const currentTopic = communicationTopics.find(t => t.id === activeTopic)!

  const handleAskAI = async () => {
    if (!userInput.trim()) return
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setAiResponse(`${currentTopic.name} is a core speaking skill.

The ${currentTopic.name.toLowerCase()} methodology:
1. Learn the framework
2. Practice with exercises
3. Record your progress
4. Get AI feedback
5. Iterate and improve`)
    setLoading(false)
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <span className="text-5xl">🎤</span>
          <div>
            <h1 className="text-4xl font-display font-bold">Communication</h1>
            <p className="text-text-secondary text-lg">
              Master the art of expression
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
            {communicationTopics.map((topic) => (
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
              {currentTopic.description}. Develop your communication prowess.
            </p>

            <div className="border-t border-surface-secondary pt-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span>🤖</span> Speaking Coach
              </h3>
              <textarea
                placeholder={`Ask about ${currentTopic.name.toLowerCase()}...`}
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="w-full px-4 py-3 bg-background-secondary border border-surface-secondary rounded-lg text-text-primary placeholder-text-muted resize-none min-h-[100mbottom-4">
                <Button onClick={handleAskAI} disabled={loading || !userInput.trim()}>
                  {loading ? <><Spinner className="mr-2" />Thinking...</> : 'Get Coaching →'}
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
            <h3 className="text-lg font-semibold mb-4">🎥 Practice Tools</h3>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="secondary" className="justify-start gap-2">
                <span>📹</span> Record Video
              </Button>
              <Button variant="secondary" className="justify-start gap-2">
                <span>🎯</span> Impromptu Mode
              </Button>
              <Button variant="secondary" className="justify-start gap-2">
                <span>📊</span> AI Analysis
              </Button>
              <Button variant="secondary" className="justify-start gap-2">
                <span>🏆</span> Challenges
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
