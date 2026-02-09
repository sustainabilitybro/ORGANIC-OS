'use client'

import { useState, useMemo } from 'react'
import { 
  TrendingUp, TrendingDown, Activity, Moon, Brain, 
  ArrowUp, ArrowDown, Minus, Award
} from 'lucide-react'
import { Card, StatCard, ProgressBar } from '@/components/ui'
import { useAuth } from '@/hooks/useAuth'
import { useProgress } from '@/hooks/useProgress'

// Mock data for demonstration
const MOCK_WEEKLY_DATA = [
  { day: 'Mon', mood: 7, energy: 6, sleep: 7.5, wellness: 75 },
  { day: 'Tue', mood: 8, energy: 7, sleep: 8, wellness: 82 },
  { day: 'Wed', mood: 6, energy: 5, sleep: 6, wellness: 65 },
  { day: 'Thu', mood: 8, energy: 8, sleep: 8.5, wellness: 88 },
  { day: 'Fri', mood: 7, energy: 6, sleep: 7, wellness: 76 },
  { day: 'Sat', mood: 9, energy: 8, sleep: 9, wellness: 92 },
  { day: 'Sun', mood: 8, energy: 7, sleep: 8, wellness: 85 },
]

const MOCK_MODULE_STATS = [
  { name: 'Identity', progress: 75, trend: 5, sessions: 12 },
  { name: 'Wellness', progress: 100, trend: 0, sessions: 45 },
  { name: 'Emotional', progress: 60, trend: 8, sessions: 8 },
  { name: 'Recovery', progress: 45, trend: -3, sessions: 6 },
  { name: 'Sensory', progress: 30, trend: 10, sessions: 4 },
]

export default function AnalyticsPage() {
  const { user } = useAuth()
  const { wellnessEntries, moduleProgress, loading } = useProgress(user?.id || null)
  const [period, setPeriod] = useState<'week' | 'month'>('week')

  const stats = useMemo(() => {
    const recent = wellnessEntries.length > 0 ? wellnessEntries.slice(-7) : MOCK_WEEKLY_DATA
    
    const avgMood = recent.reduce((sum, e) => sum + (e.mood || e.mood_score || 7), 0) / recent.length
    const avgEnergy = recent.reduce((sum, e) => sum + (e.energy || 6), 0) / recent.length
    const avgSleep = recent.reduce((sum, e) => sum + (e.sleep || e.sleep_hours || 7), 0) / recent.length
    
    return {
      avgMood: avgMood.toFixed(1),
      avgEnergy: avgEnergy.toFixed(1),
      avgSleep: avgSleep.toFixed(1),
      streak: 5,
      totalEntries: wellnessEntries.length || 47,
    }
  }, [wellnessEntries])

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Activity className="w-8 h-8 text-indigo-500" />
              Analytics
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Track your wellness trends and module progress
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPeriod('week')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                period === 'week' ? 'bg-indigo-500 text-white' : 'bg-white dark:bg-slate-800'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setPeriod('month')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                period === 'month' ? 'bg-indigo-500 text-white' : 'bg-white dark:bg-slate-800'
              }`}
            >
              Month
            </button>
          </div>
        </header>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Average Mood"
            value={stats.avgMood}
            icon="😊"
            trend={{ value: 0.3, positive: true }}
            color="from-pink-500 to-rose-500"
          />
          <StatCard
            label="Average Energy"
            value={stats.avgEnergy}
            icon="⚡"
            trend={{ value: 0.5, positive: true }}
            color="from-yellow-500 to-orange-500"
          />
          <StatCard
            label="Sleep Average"
            value={`${stats.avgSleep}h`}
            icon="🌙"
            trend={{ value: 0.2, positive: true }}
            color="from-indigo-500 to-purple-500"
          />
          <StatCard
            label="Wellness Streak"
            value={stats.streak}
            icon="🔥"
            color="from-amber-500 to-orange-600"
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              Mood & Energy Trend
            </h2>
            <TrendChart data={MOCK_WEEKLY_DATA} />
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Moon className="w-5 h-5 text-indigo-500" />
              Sleep Pattern
            </h2>
            <SleepChart data={MOCK_WEEKLY_DATA} />
          </Card>
        </div>

        <Card className="p-6 mb-8">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-500" />
            Module Progress
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MOCK_MODULE_STATS.map((module) => (
              <ModuleProgressCard key={module.name} module={module} />
            ))}
          </div>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          <InsightCard
            icon="🌟"
            title="Strong Week"
            description="Your emotional intelligence improved by 8% this week"
            color="bg-green-50 dark:bg-green-900/20"
          />
          <InsightCard
            icon="⚠️"
            title="Recovery Needed"
            description="Your burnout risk is elevated. Consider taking a rest day."
            color="bg-amber-50 dark:bg-amber-900/20"
          />
          <InsightCard
            icon="🎯"
            title="Keep Going"
            description="You're 75% through Identity. Just 3 more exercises!"
            color="bg-blue-50 dark:bg-blue-900/20"
          />
        </div>
      </div>
    </div>
  )
}

function TrendChart({ data }: { data: typeof MOCK_WEEKLY_DATA }) {
  const max = 10
  return (
    <div className="flex items-end justify-between h-48 pb-4">
      {data.map((day, i) => (
        <div key={i} className="flex flex-col items-center gap-2 flex-1">
          <div className="flex items-end gap-1 h-48">
            <div className="w-3 bg-pink-500 rounded-t" style={{ height: `${(day.mood / max) * 100}%` }} />
            <div className="w-3 bg-yellow-500 rounded-t" style={{ height: `${(day.energy / max) * 100}%` }} />
          </div>
          <span className="text-xs text-slate-500">{day.day}</span>
        </div>
      ))}
    </div>
  )
}

function SleepChart({ data }: { data: typeof MOCK_WEEKLY_DATA }) {
  const max = 10
  return (
    <div className="flex items-end justify-between h-48 pb-4">
      {data.map((day, i) => (
        <div key={i} className="flex flex-col items-center gap-2 flex-1">
          <div className="w-full flex justify-center">
            <div className="w-10 bg-gradient-to-t from-indigo-600 to-purple-500 rounded-t" style={{ height: `${(day.sleep / max) * 100}%` }} />
          </div>
          <span className="text-xs text-slate-500">{day.day}</span>
        </div>
      ))}
    </div>
  )
}

function ModuleProgressCard({ module }: { module: typeof MOCK_MODULE_STATS[0] }) {
  const trendIcon = module.trend > 0 ? <ArrowUp className="w-4 h-4 text-green-500" /> :
                    module.trend < 0 ? <ArrowDown className="w-4 h-4 text-red-500" /> :
                    <Minus className="w-4 h-4 text-slate-400" />
  
  return (
    <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium">{module.name}</h3>
        <span className="flex items-center gap-1 text-sm">{trendIcon}{Math.abs(module.trend)}%</span>
      </div>
      <ProgressBar progress={module.progress} color="from-purple-500 to-pink-500" />
      <p className="text-sm text-slate-500 mt-2">{module.sessions} sessions this week</p>
    </div>
  )
}

function InsightCard({ icon, title, description, color }: { icon: string; title: string; description: string; color: string }) {
  return (
    <Card className={`p-6 ${color}`}>
      <div className="flex items-start gap-4">
        <span className="text-2xl">{icon}</span>
        <div>
          <h3 className="font-semibold mb-1">{title}</h3>
          <p className="text-sm opacity-80">{description}</p>
        </div>
      </div>
    </Card>
  )
}
