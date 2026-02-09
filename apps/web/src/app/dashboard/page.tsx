'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, Button, StatCard, ProgressBar, Badge, ModuleCard, PromptCard } from '@/components/ui'
import { useAuth } from '@/hooks/useAuth'
import { useProgress } from '@/hooks/useProgress'
import { formatRelativeTime } from '@/lib/utils'

// All platform modules with metadata
const allModules = [
  { name: 'Identity', slug: 'identity', description: 'Discover your authentic self', icon: '👤', gradient: 'from-emerald-500 to-teal-600', href: '/dashboard/identity' },
  { name: 'Sensory', slug: 'sensory', description: 'Optimize your senses', icon: '👁️', gradient: 'from-cyan-500 to-blue-600', href: '/dashboard/sensory' },
  { name: 'Emotional', slug: 'emotional', description: 'Master emotional intelligence', icon: '💚', gradient: 'from-green-500 to-emerald-600', href: '/dashboard/emotional' },
  { name: 'Wellness', slug: 'wellness', description: 'Holistic health tracking', icon: '🌿', gradient: 'from-lime-500 to-green-600', href: '/dashboard/wellness' },
  { name: 'Recovery', slug: 'recovery', description: 'Prevent burnout & stress', icon: '🔋', gradient: 'from-amber-500 to-orange-600', href: '/dashboard/recovery' },
  { name: 'Communication', slug: 'communication', description: 'Master expression', icon: '🎤', gradient: 'from-purple-500 to-violet-600', href: '/dashboard/communication' },
  { name: 'Sustainability', slug: 'sustainability', description: 'Eco-living & carbon', icon: '🌱', gradient: 'from-emerald-600 to-green-600', href: '/sustainability' },
  { name: 'Holistic Alchemy', slug: 'holistic-alchemy', description: 'Transform consciousness', icon: '🧪', gradient: 'from-purple-600 to-violet-700', href: '/holistic-alchemy' },
  { name: 'Atom Economy', slug: 'atom-economy', description: 'Process optimization', icon: '⚛️', gradient: 'from-cyan-600 to-blue-700', href: '/atom-economy' },
  { name: 'Video', slug: 'video', description: 'Practice on camera', icon: '📹', gradient: 'from-rose-500 to-pink-600', href: '/video' },
]

// Quick action items
const quickActions = [
  { label: 'Log Wellness', icon: '📊', href: '/dashboard/wellness', color: 'from-green-500 to-emerald-600' },
  { label: 'Daily Check-in', icon: '✨', href: '/dashboard/wellness', color: 'from-amber-500 to-orange-600' },
  { label: 'AI Coaching', icon: '🤖', href: '/dashboard', color: 'from-purple-500 to-violet-600' },
  { label: 'View Insights', icon: '💡', href: '/dashboard', color: 'from-cyan-500 to-blue-600' },
]

// Recent activity mock data
const recentActivity = [
  { type: 'module', message: 'Completed "Values Discovery" in Identity', time: new Date(Date.now() - 1000 * 60 * 30), icon: '🎯' },
  { type: 'wellness', message: 'Logged 7 hours of sleep', time: new Date(Date.now() - 1000 * 60 * 60 * 2), icon: '😴' },
  { type: 'ai', message: 'Had coaching session about stress', time: new Date(Date.now() - 1000 * 60 * 60 * 5), icon: '💬' },
  { type: 'streak', message: '3-day wellness streak achieved!', time: new Date(Date.now() - 1000 * 60 * 60 * 24), icon: '🔥' },
]

export default function DashboardPage() {
  const { user } = useAuth()
  const { progress, loading: progressLoading, updateModuleProgress } = useProgress(user?.id || 'demo-user')
  const [dailyPrompt, setDailyPrompt] = useState<{ prompt: string; category: string } | null>(null)
  const [wellnessStats, setWellnessStats] = useState({
    avgSleep: 0,
    avgMood: 0,
    avgEnergy: 0,
    streak: 0,
  })

  // Load daily prompt
  useEffect(() => {
    const prompts = [
      { prompt: 'What are you grateful for today?', category: 'Gratitude' },
      { prompt: 'What challenge are you working through?', category: 'Growth' },
      { prompt: 'How did you take care of your body today?', category: 'Physical' },
      { prompt: 'What brought you peace?', category: 'Mindfulness' },
      { prompt: 'Who did you connect with today?', category: 'Relationships' },
    ]
    setDailyPrompt(prompts[Math.floor(Math.random() * prompts.length)])
  }, [])

  // Calculate wellness stats (mock for demo)
  useEffect(() => {
    setWellnessStats({
      avgSleep: 7.2,
      avgMood: 7.5,
      avgEnergy: 6.8,
      streak: 3,
    })
  }, [user])

  // Calculate overall stats
  const totalModules = allModules.length
  const startedModules = Object.keys(progress).length
  const completedModules = Object.values(progress).filter(p => (p as any)?.progress_percentage >= 100).length
  const overallProgress = startedModules > 0 
    ? Math.round(Object.values(progress).reduce((acc, p: any) => acc + (p?.progress_percentage || 0), 0) / totalModules)
    : 0

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-display font-bold mb-2">
          Welcome back{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name.split(' ')[0]}` : ''} 👋
        </h1>
        <p className="text-text-secondary text-lg">
          Your operating system is running at {overallProgress}% efficiency. Ready to grow today?
        </p>
      </header>

      {/* Daily Prompt */}
      {dailyPrompt && (
        <div className="mb-8">
          <PromptCard 
            prompt={dailyPrompt.prompt} 
            category={dailyPrompt.category}
          />
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard 
          label="Overall Progress"
          value={`${overallProgress}%`}
          icon="📈"
          trend={{ value: 12, positive: true }}
          color="from-emerald-500 to-teal-600"
        />
        <StatCard 
          label="Wellness Streak"
          value={wellnessStats.streak}
          icon="🔥"
          color="from-amber-500 to-orange-600"
        />
        <StatCard 
          label="Modules Active"
          value={`${startedModules}/${totalModules}`}
          icon="🚀"
          color="from-purple-500 to-violet-600"
        />
        <StatCard 
          label="Avg Energy"
          value={wellnessStats.avgEnergy}
          icon="⚡"
          color="from-cyan-500 to-blue-600"
        />
      </div>

      {/* Quick Actions */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link key={action.label} href={action.href}>
              <Card hover className="text-center py-6">
                <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center text-xl`}>
                  {action.icon}
                </div>
                <p className="font-medium">{action.label}</p>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Modules Grid - 2 columns */}
        <div className="lg:col-span-2">
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Your Modules</h2>
              <Link href="/dashboard/identity" className="text-sm text-accent-primary hover:underline">
                View All →
              </Link>
            </div>
            
            {/* Progress Overview */}
            <Card className="mb-6 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-text-secondary">Total Journey Progress</span>
                <span className="text-sm font-medium text-accent-primary">{overallProgress}%</span>
              </div>
              <ProgressBar 
                value={overallProgress} 
                color="bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-tertiary"
                size="lg"
              />
              <div className="flex justify-between mt-2 text-xs text-text-muted">
                <span>{completedModules} completed</span>
                <span>{totalModules - startedModules} not started</span>
              </div>
            </Card>

            {/* Module Cards Grid */}
            <div className="grid md:grid-cols-2 gap-4">
              {allModules.slice(0, 6).map((module) => {
                const moduleProgress = (progress as any)?.[module.slug]?.progress_percentage || 0
                return (
                  <ModuleCard
                    key={module.slug}
                    {...module}
                    progress={moduleProgress}
                  />
                )
              })}
            </div>
          </section>
        </div>

        {/* Sidebar - 1 column */}
        <div className="space-y-6">
          {/* Wellness Snapshot */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Wellness Snapshot</h2>
            <Card className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">Sleep (7d avg)</span>
                <span className="font-medium">{wellnessStats.avgSleep}h</span>
              </div>
              <ProgressBar value={wellnessStats.avgSleep} max={10} color="bg-gradient-to-r from-blue-500 to-indigo-600" />
              
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">Mood (7d avg)</span>
                <span className="font-medium">{wellnessStats.avgMood}/10</span>
              </div>
              <ProgressBar value={wellnessStats.avgMood * 10} color="bg-gradient-to-r from-amber-500 to-orange-500" />
              
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">Energy (7d avg)</span>
                <span className="font-medium">{wellnessStats.avgEnergy}/10</span>
              </div>
              <ProgressBar value={wellnessStats.avgEnergy * 10} color="bg-gradient-to-r from-emerald-500 to-teal-500" />
            </Card>
          </section>

          {/* Recent Activity */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <Card className="p-4">
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <span className="text-lg">{activity.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">{activity.message}</p>
                      <p className="text-xs text-text-muted">{formatRelativeTime(activity.time)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </section>

          {/* AI Coach Card */}
          <Card variant="gradient" className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-primary to-accent-tertiary flex items-center justify-center text-lg">
                🤖
              </div>
              <div>
                <h3 className="font-semibold">AI Coach</h3>
                <p className="text-xs text-text-muted">Online</p>
              </div>
            </div>
            <p className="text-sm text-text-secondary mb-3">
              I've noticed your sleep patterns improving. Want to explore mindfulness techniques?
            </p>
            <Button size="sm" className="w-full">Continue Chat</Button>
          </Card>
        </div>
      </div>
    </div>
  )
}
