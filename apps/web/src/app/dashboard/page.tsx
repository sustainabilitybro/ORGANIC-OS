'use client'

import { useState, useEffect, useMemo, Suspense } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { Card, Button, StatCard, ProgressBar, Badge, SearchBar } from '@/components/ui'
import { useAuth } from '@/hooks/useAuth'
import { useProgress } from '@/hooks/useProgress'
import { formatRelativeTime, cn } from '@/lib/utils'

// Dynamic imports for code splitting
const ModuleCard = dynamic(() => import('@/components/ui').then(mod => mod.ModuleCard), {
  loading: () => <Card className="h-32 animate-pulse bg-neutral-800" />,
  ssr: false
})

const PromptCard = dynamic(() => import('@/components/ui').then(mod => mod.PromptCard), {
  loading: () => <Card className="h-24 animate-pulse bg-neutral-800" />,
  ssr: false
})

// Constants - defined outside component to avoid recreation
const ALL_MODULES = [
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
] as const

const QUICK_ACTIONS = [
  { label: 'Log Wellness', icon: '📊', href: '/dashboard/wellness', color: 'from-green-500 to-emerald-600' },
  { label: 'Daily Check-in', icon: '✨', href: '/dashboard/wellness', color: 'from-amber-500 to-orange-600' },
  { label: 'AI Coaching', icon: '🤖', href: '/dashboard', color: 'from-purple-500 to-violet-600' },
  { label: 'View Insights', icon: '💡', href: '/dashboard', color: 'from-cyan-500 to-blue-600' },
] as const

// Memoized daily prompts
const DAILY_PROMPTS = [
  { prompt: 'What are you grateful for today?', category: 'Gratitude' },
  { prompt: 'What challenge are you working through?', category: 'Growth' },
  { prompt: 'How did you take care of your body today?', category: 'Physical' },
  { prompt: 'What brought you peace?', category: 'Mindfulness' },
  { prompt: 'Who did you connect with today?', category: 'Relationships' },
] as const

// Loading skeleton components
function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {[1, 2, 3, 4].map(i) => (
        <Card key={i} className="animate-pulse bg-neutral-800">
          <div className="h-16" />
        </Card>
      ))}
    </div>
  )
}

function ModulesSkeleton() {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {[1, 2, 3, 4].map(i => (
        <Card key={i} className="h-32 animate-pulse bg-neutral-800" />
      ))}
    </div>
  )
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth()
  const { 
    moduleProgress, 
    wellnessEntries, 
    loading: progressLoading, 
    error,
    getWellnessStats 
  } = useProgress(user?.id || null)

  const [dailyPrompt, setDailyPrompt] = useState<typeof DAILY_PROMPTS[number] | null>(null)
  const [localStats, setLocalStats] = useState({ avgSleep: 0, avgMood: 0, avgEnergy: 0, streak: 0 })

  // Memoize user name extraction
  const userFirstName = useMemo(() => {
    if (!user?.user_metadata?.full_name) return ''
    return user.user_metadata.full_name.split(' ')[0]
  }, [user])

  // Initialize daily prompt (client-side only)
  useEffect(() => {
    setDailyPrompt(DAILY_PROMPTS[Math.floor(Math.random() * DAILY_PROMPTS.length)])
  }, [])

  // Fetch wellness stats
  useEffect(() => {
    if (!progressLoading) {
      const stats = getWellnessStats()
      setLocalStats({ ...stats, streak: calculateStreak(wellnessEntries) })
    }
  }, [progressLoading, getWellnessStats, wellnessEntries])

  // Memoized progress calculations
  const progressStats = useMemo(() => {
    const totalModules = ALL_MODULES.length
    const progressValues = Object.values(moduleProgress)
    const startedModules = progressValues.length
    const completedModules = progressValues.filter(p => p.progress_percentage >= 100).length
    const totalProgress = progressValues.reduce((sum, p) => sum + (p.progress_percentage || 0), 0)
    const overallProgress = Math.round(totalProgress / totalModules)

    return { totalModules, startedModules, completedModules, overallProgress }
  }, [moduleProgress])

  // Early return for loading states
  if (authLoading) {
    return (
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-8">
          <div className="h-12 bg-neutral-800 rounded w-1/2" />
          <StatsSkeleton />
          <ModulesSkeleton />
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        <Card variant="gradient" className="bg-red-500/10 border-red-500/20 p-6">
          <h2 className="text-xl font-semibold text-red-400 mb-2">Error Loading Dashboard</h2>
          <p className="text-neutral-300">{error}</p>
          <Button 
            variant="secondary" 
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-display font-bold mb-2">
          Welcome back{userFirstName ? `, ${userFirstName}` : ''} 👋
        </h1>
        <p className="text-text-secondary text-lg mb-4">
          Your operating system is running at {progressStats.overallProgress}% efficiency. Ready to grow today?
        </p>
        <SearchBar />
      </header>

      {/* Daily Prompt */}
      {dailyPrompt && (
        <div className="mb-8">
          <Suspense fallback={<Card className="h-24 animate-pulse bg-neutral-800" />}>
            <PromptCard 
              prompt={dailyPrompt.prompt} 
              category={dailyPrompt.category}
            />
          </Suspense>
        </div>
      )}

      {/* Stats Grid */}
      {progressLoading ? (
        <StatsSkeleton />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard 
            label="Overall Progress"
            value={`${progressStats.overallProgress}%`}
            icon="📈"
            trend={{ value: 12, positive: true }}
            color="from-emerald-500 to-teal-600"
          />
          <StatCard 
            label="Wellness Streak"
            value={localStats.streak}
            icon="🔥"
            color="from-amber-500 to-orange-600"
          />
          <StatCard 
            label="Modules Active"
            value={`${progressStats.startedModules}/${progressStats.totalModules}`}
            icon="🚀"
            color="from-purple-500 to-violet-600"
          />
          <StatCard 
            label="Avg Energy"
            value={localStats.avgEnergy}
            icon="⚡"
            color="from-cyan-500 to-blue-600"
          />
        </div>
      )}

      {/* Quick Actions */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {QUICK_ACTIONS.map((action) => (
            <Link key={action.label} href={action.href}>
              <Card hover className="text-center py-6">
                <div className={cn(
                  'w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br flex items-center justify-center text-xl',
                  action.color
                )}>
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
                <span className="text-sm font-medium text-accent-primary">{progressStats.overallProgress}%</span>
              </div>
              <ProgressBar 
                value={progressStats.overallProgress} 
                color="bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-tertiary"
                size="lg"
              />
              <div className="flex justify-between mt-2 text-xs text-text-muted">
                <span>{progressStats.completedModules} completed</span>
                <span>{progressStats.totalModules - progressStats.startedModules} not started</span>
              </div>
            </Card>

            {/* Module Cards Grid */}
            {progressLoading ? (
              <ModulesSkeleton />
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {ALL_MODULES.slice(0, 6).map((module) => {
                  const modProgress = moduleProgress[module.slug]
                  const modPercentage = modProgress?.progress_percentage || 0
                  
                  return (
                    <Suspense key={module.slug} fallback={<div className="h-32 bg-neutral-800 animate-pulse rounded-xl" />}>
                      <ModuleCard
                        name={module.name}
                        description={module.description}
                        icon={module.icon}
                        progress={modPercentage}
                        href={module.href}
                        gradient={module.gradient}
                      />
                    </Suspense>
                  )
                })}
              </div>
            )}
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
                <span className="font-medium">{localStats.avgSleep}h</span>
              </div>
              <ProgressBar value={localStats.avgSleep} max={10} color="bg-gradient-to-r from-blue-500 to-indigo-600" />
              
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">Mood (7d avg)</span>
                <span className="font-medium">{localStats.avgMood}/10</span>
              </div>
              <ProgressBar value={localStats.avgMood * 10} color="bg-gradient-to-r from-amber-500 to-orange-500" />
              
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">Energy (7d avg)</span>
                <span className="font-medium">{localStats.avgEnergy}/10</span>
              </div>
              <ProgressBar value={localStats.avgEnergy * 10} color="bg-gradient-to-r from-emerald-500 to-teal-500" />
            </Card>
          </section>

          {/* Recent Activity */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <Card className="p-4">
              <div className="space-y-4">
                {useMemo(() => [
                  { icon: '🎯', message: 'Completed "Values Discovery" in Identity', time: new Date(Date.now() - 1000 * 60 * 30) },
                  { icon: '😴', message: 'Logged 7 hours of sleep', time: new Date(Date.now() - 1000 * 60 * 60 * 2) },
                  { icon: '💬', message: 'Had coaching session about stress', time: new Date(Date.now() - 1000 * 60 * 60 * 5) },
                  { icon: '🔥', message: `${localStats.streak}-day wellness streak achieved!`, time: new Date(Date.now() - 1000 * 60 * 60 * 24) },
                ], [localStats.streak]).map((activity, index) => (
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

// Helper function - defined outside to avoid recreation
function calculateStreak(entries: WellnessEntry[]): number {
  if (!entries || entries.length === 0) return 0
  
  const dates = [...new Set(entries.map(e => e.date))].sort().reverse()
  const today = new Date().toISOString().split('T')[0]
  let streak = 0
  let currentDate = new Date()
  
  // Check if there's an entry for today or yesterday
  if (!dates.includes(today)) {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    if (!dates.includes(yesterday.toISOString().split('T')[0])) {
      return 0
    }
    currentDate = yesterday
  }
  
  // Count consecutive days
  const dateSet = new Set(dates)
  while (dateSet.has(currentDate.toISOString().split('T')[0])) {
    streak++
    currentDate.setDate(currentDate.getDate() - 1)
  }
  
  return streak
}
