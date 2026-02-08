'use client'

import { useState } from 'react'
import { Card, Button, Spinner } from '@organic-os/ui'

const sensoryTopics = [
  { id: 'visual', name: 'Visual', icon: '👁️', description: 'Sight and perception' },
  { id: 'auditory', name: 'Auditory', icon: '👂', description: 'Sound and hearing' },
  { id: 'kinesthetic', name: 'Kinesthetic', icon: '🧘', description: 'Body awareness and movement' },
  { id: 'olfactory', name: 'Olfactory', icon: '👃', description: 'Smell and scent' },
  { id: 'gustatory', name: 'Gustatory', icon: '👅', description: 'Taste and flavor' },
  { id: 'interoception', name: 'Interoception', icon: '❤️', description: 'Internal body signals' },
]

export default function SensoryPage() {
  const [activeTopic, setActiveTopic] = useState('visual')
  const [userInput, setUserInput] = useState('')
  const [aiResponse, setAiResponse] = useState('')
  const [loading, setLoading] = useState(false)

  const currentTopic = sensoryTopics.find(t => t.id === activeTopic)!

  const handleAskAI = async () => {
    if (!userInput.trim()) return
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setAiResponse(`Exploring ${currentTopic.name} perception is a fascinating journey into how your brain interprets sensory input.

Key areas to explore:
1. Sensitivity calibration - are you over- or under-sensitive?
2. Environmental factors that affect perception
3. Practices to enhance or balance this sense`)
    setLoading(false)
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <span className="text-5xl">👁️</span>
          <div>
            <h1 className="text-4xl font-display font-bold">Sensory</h1>
            <p className="text-text-secondary text-lg">
              Explore and optimize your human senses
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <h2 className="text-lg font-semibold mb-4 text-text-muted uppercase tracking-wider">
            Explore Senses
          </h2>
          <div className="space-y-2">
            {sensoryTopics.map((topic) => (
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
              {currentTopic.name} Perception
            </h2>
            <p className="text-text-secondary mb-6">
              {currentTopic.description}. Discover how this sense shapes your experience of the world.
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
                <span>📊</span> Sensitivity Quiz
              </Button>
              <Button variant="secondary" className="justify-start gap-2">
                <span>🎯</span> Perception Exercises
              </Button>
              <Button variant="secondary" className="justify-start gap-2">
                <span>📓</span> Sensory Journal
              </Button>
              <Button variant="secondary" className="justify-start gap-2">
                <span>🎨</span> Sensory Meditation
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
