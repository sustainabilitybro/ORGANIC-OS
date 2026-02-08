'use client'

import { useState } from 'react'
import { Card, Button, Input, Textarea, Spinner } from '@organic-os/ui'

const identityTopics = [
  { id: 'values', name: 'Core Values', icon: '🎯', description: 'What matters most to you?' },
  { id: 'purpose', name: 'Life Purpose', icon: '✨', description: 'Your reason for being' },
  { id: 'strengths', name: 'Strengths', icon: '💪', description: 'What you naturally excel at' },
  { id: 'growth', name: 'Growth Areas', icon: '🌱', description: 'Where you\'re developing' },
  { id: 'boundaries', name: 'Boundaries', icon: '🛡️', description: 'Lines you won\'t cross' },
  { id: 'vision', name: 'Future Vision', icon: '🔮', description: 'Where you\'re heading' },
]

export default function IdentityPage() {
  const [activeTopic, setActiveTopic] = useState('values')
  const [userInput, setUserInput] = useState('')
  const [aiResponse, setAiResponse] = useState('')
  const [loading, setLoading] = useState(false)

  const currentTopic = identityTopics.find(t => t.id === activeTopic)!

  const handleAskAI = async () => {
    if (!userInput.trim()) return
    setLoading(true)
    
    // Simulate AI response (would call API in production)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setAiResponse(`That's a thoughtful question about ${currentTopic.name.toLowerCase()}. Let me help you explore this...

Based on what you've shared, here are some things to consider:
1. What does [${currentTopic.name}] mean to you personally?
2. How does this align with your core values?
3. What's one small step you could take today?

Would you like to dive deeper into any of these areas?`)
    setLoading(false)
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <span className="text-5xl">👤</span>
          <div>
            <h1 className="text-4xl font-display font-bold">Identity</h1>
            <p className="text-text-secondary text-lg">
              Discover and clarify your authentic self
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Topics Sidebar */}
        <div className="lg:col-span-1">
          <h2 className="text-lg font-semibold mb-4 text-text-muted uppercase tracking-wider">
            Explore Topics
          </h2>
          <div className="space-y-2">
            {identityTopics.map((topic) => (
              <button
                key={topic.id}
                onClick={() => setActiveTopic(topic.id)}
                className={`w-full flex items-center gap-3 p-4 rounded-lg transition-all duration-200 ${
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

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Content Card */}
          <Card>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3">
              <span className="text-3xl">{currentTopic.icon}</span>
              {currentTopic.name}
            </h2>
            <p className="text-text-secondary mb-6">
              {currentTopic.description} This module helps you explore and understand 
              this aspect of your identity through guided reflection and AI coaching.
            </p>

            {/* AI Coach Section */}
            <div className="border-t border-surface-secondary pt-6 mt-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span>🤖</span> Ask Your AI Coach
              </h3>
              
              <Textarea
                placeholder={`Ask about ${currentTopic.name.toLowerCase()}... e.g., "How do I discover my core values?"`}
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="mb-4 min-h-[100px]"
              />
              
              <div className="flex gap-3">
                <Button 
                  onClick={handleAskAI}
                  disabled={loading || !userInput.trim()}
                  className="flex-1"
                >
                  {loading ? (
                    <>
                      <Spinner className="mr-2" />
                      Thinking...
                    </>
                  ) : (
                    'Ask AI Coach →'
                  )}
                </Button>
                <Button variant="secondary">
                  Skip for Now
                </Button>
              </div>

              {aiResponse && (
                <div className="mt-6 p-4 bg-accent-primary/5 border border-accent-primary/20 rounded-lg">
                  <p className="text-text-primary">{aiResponse}</p>
                </div>
              )}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card>
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="secondary" className="justify-start gap-2">
                <span>📝</span> Values Assessment
              </Button>
              <Button variant="secondary" className="justify-start gap-2">
                <span>🎯</span> Set Identity Goals
              </Button>
              <Button variant="secondary" className="justify-start gap-2">
                <span>📊</span> View Progress
              </Button>
              <Button variant="secondary" className="justify-start gap-2">
                <span>📤</span> Export Insights
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
