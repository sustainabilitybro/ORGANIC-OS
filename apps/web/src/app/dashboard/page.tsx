'use client'

import Link from 'next/link'
import { Card, Button } from '@organic-os/ui'

const modules = [
  {
    name: 'Identity',
    slug: 'identity',
    description: 'Discover your authentic self',
    icon: '👤',
    progress: 0,
    gradient: 'from-accent-primary to-emerald-700'
  },
  {
    name: 'Sensory',
    slug: 'sensory',
    description: 'Explore your senses',
    icon: '👁️',
    progress: 0,
    gradient: 'from-blue-400 to-blue-700'
  },
  {
    name: 'Emotional',
    slug: 'emotional',
    description: 'Master emotional intelligence',
    icon: '💚',
    progress: 0,
    gradient: 'from-pink-400 to-pink-700'
  },
  {
    name: 'Wellness',
    slug: 'wellness',
    description: 'Holistic health',
    icon: '🌿',
    progress: 0,
    gradient: 'from-green-400 to-green-700'
  },
  {
    name: 'Recovery',
    slug: 'recovery',
    description: 'Prevent burnout',
    icon: '🔋',
    progress: 0,
    gradient: 'from-amber-400 to-amber-700'
  },
  {
    name: 'Communication',
    slug: 'communication',
    description: 'Master expression',
    icon: '🎤',
    progress: 0,
    gradient: 'from-purple-400 to-purple-700'
  }
]

const stats = [
  { label: 'Days Active', value: '1', icon: '📅' },
  { label: 'Modules Started', value: '0', icon: '🚀' },
  { label: 'AI Conversations', value: '0', icon: '💬' },
  { label: 'Insights Gained', value: '0', icon: '💡' },
]

export default function DashboardPage() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-display font-bold mb-2">
          Welcome back, Human 👋
        </h1>
        <p className="text-text-secondary text-lg">
          Your operating system is ready. Where would you like to focus today?
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label} className="text-center">
            <span className="text-3xl mb-2 block">{stat.icon}</span>
            <p className="text-3xl font-bold text-gradient">{stat.value}</p>
            <p className="text-sm text-text-muted">{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* AI Coach Card */}
      <Card className="mb-8 bg-gradient-to-br from-accent-primary/10 to-accent-warm/10 border-accent-primary/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent-primary to-accent-tertiary flex items-center justify-center text-2xl">
              🤖
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-1">Your AI Coach</h3>
              <p className="text-text-secondary">
                Ready to help you grow. Ask me anything about your journey.
              </p>
            </div>
          </div>
          <Button>Start Conversation →</Button>
        </div>
      </Card>

      {/* Modules Grid */}
      <h2 className="text-2xl font-display font-bold mb-4">Your Modules</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => (
          <Link key={module.slug} href={`/dashboard/${module.slug}`}>
            <Card hover className="h-full">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${module.gradient} flex items-center justify-center text-2xl`}>
                  {module.icon}
                </div>
                {module.progress > 0 && (
                  <span className="text-sm text-accent-primary font-medium">
                    {module.progress}%
                  </span>
                )}
              </div>
              <h3 className="text-lg font-semibold mb-1">{module.name}</h3>
              <p className="text-text-secondary text-sm mb-4">{module.description}</p>
              {module.progress > 0 && (
                <div className="w-full bg-surface-secondary rounded-full h-2">
                  <div
                    className={`h-2 rounded-full bg-gradient-to-r ${module.gradient}`}
                    style={{ width: `${module.progress}%` }}
                  />
                </div>
              )}
              {module.progress === 0 && (
                <Button variant="secondary" size="sm" className="w-full mt-auto">
                  Not Started
                </Button>
              )}
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
