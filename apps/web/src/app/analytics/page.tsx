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

interface WellnessEntry {
  mood_score?: number;
  energy_level?: number;
  sleep_hours?: number;
  mood?: number;
  energy?: number;
  sleep?: number;
  date?: string;
}

interface WeeklyDataPoint {
  day: string;
  mood: number;
  energy: number;
  sleep: number;
  wellness: number;
}

function getMoodValue(e: WellnessEntry | WeeklyDataPoint): number {
  if ('mood_score' in e) return (e as WellnessEntry).mood_score || 7;
  if ('mood' in e) return (e as WeeklyDataPoint).mood;
  return 7;
}

function getEnergyValue(e: WellnessEntry | WeeklyDataPoint): number {
  if ('energy_level' in e) return (e as WellnessEntry).energy_level || 6;
  if ('energy' in e) return (e as WeeklyDataPoint).energy;
  return 6;
}

function getSleepValue(e: WellnessEntry | WeeklyDataPoint): number {
  if ('sleep_hours' in e) return (e as WellnessEntry).sleep_hours || 7;
  if ('sleep' in e) return (e as WeeklyDataPoint).sleep;
  return 7;
}

export default function AnalyticsPage() {
  const { user } = useAuth()
  const { wellnessEntries, moduleProgress, loading } = useProgress(user?.id || null)
  const [period, setPeriod] = useState<'week' | 'month'>('week')

  const stats = useMemo(() => {
    const recent: (WellnessEntry | WeeklyDataPoint)[] = wellnessEntries.length > 0 ? wellnessEntries.slice(-7) : MOCK_WEEKLY_DATA
    
    const avgMood = recent.reduce((sum, e) => sum + getMoodValue(e), 0) / recent.length
    const avgEnergy = recent.reduce((sum, e) => sum + getEnergyValue(e), 0) / recent.length
    const avgSleep = recent.reduce((sum, e) => sum + getSleepValue(e), 0) / recent.length
    
    return {
      avgMood: avgMood.toFixed(1),
      avgEnergy: avgEnergy.toFixed(1),
      avgSleep: avgSleep.toFixed(1),
      streak: 5,
      totalEntries: wellnessEntries.length || 47,
    }
  }, [wellnessEntries])
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Track your wellness journey and progress across all modules
          </p>
        </header>
        
        {/* Quick Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Avg. Mood" 
            value={stats.avgMood} 
            suffix="/10"
            trend={+0.5}
            icon={<Brain className="w-6 h-6" />}
            color="blue"
          />
          <StatCard 
            title="Avg. Energy" 
            value={stats.avgEnergy} 
            suffix="/10"
            trend={+0.3}
            icon={<Activity className="w-6 h-6" />}
            color="orange"
          />
          <StatCard 
            title="Avg. Sleep" 
            value={stats.avgSleep} 
            suffix="hrs"
            trend={-0.2}
            icon={<Moon className="w-6 h-6" />}
            color="indigo"
          />
          <StatCard 
            title="Streak" 
            value={stats.streak} 
            suffix="days"
            trend={+1}
            icon={<Award className="w-6 h-6" />}
            color="green"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Weekly Trends Chart */}
          <Card className="lg:col-span-2 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Weekly Trends</h2>
              <div className="flex gap-2">
                <button 
                  onClick={() => setPeriod('week')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    period === 'week' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Week
                </button>
                <button 
                  onClick={() => setPeriod('month')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    period === 'month' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Month
                </button>
              </div>
            </div>
            
            <div className="h-64 flex items-end justify-between gap-2">
              {(wellnessEntries.length > 0 ? wellnessEntries.slice(-7) : MOCK_WEEKLY_DATA).map((entry, index) => {
                const mood = getMoodValue(entry as WellnessEntry | WeeklyDataPoint);
                const energy = getEnergyValue(entry as WellnessEntry | WeeklyDataPoint);
                const sleep = getSleepValue(entry as WellnessEntry | WeeklyDataPoint) * 10;
                
                return (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full flex items-end justify-center gap-1 h-48">
                      <div 
                        className="w-4 bg-blue-500 rounded-t transition-all hover:bg-blue-600" 
                        style={{ height: `${mood * 10}%` }}
                        title={`Mood: ${mood}`}
                      />
                      <div 
                        className="w-4 bg-orange-500 rounded-t transition-all hover:bg-orange-600" 
                        style={{ height: `${energy * 10}%` }}
                        title={`Energy: ${energy}`}
                      />
                      <div 
                        className="w-4 bg-indigo-500 rounded-t transition-all hover:bg-indigo-600" 
                        style={{ height: `${sleep}%` }}
                        title={`Sleep: ${getSleepValue(entry as WellnessEntry | WeeklyDataPoint)}h`}
                      />
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {'day' in entry ? (entry as WeeklyDataPoint).day : `Day ${index + 1}`}
                    </span>
                  </div>
                );
              })}
            </div>
            
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-sm text-slate-600 dark:text-slate-400">Mood</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500" />
                <span className="text-sm text-slate-600 dark:text-slate-400">Energy</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-indigo-500" />
                <span className="text-sm text-slate-600 dark:text-slate-400">Sleep</span>
              </div>
            </div>
          </Card>
          
          {/* Module Progress */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Module Progress</h2>
            <div className="space-y-4">
              {MOCK_MODULE_STATS.map((module) => (
                <div key={module.name}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{module.name}</span>
                    <span className="text-sm text-slate-500 dark:text-slate-400">{module.progress}%</span>
                  </div>
                  <ProgressBar progress={module.progress} color="blue" />
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Insights & Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* AI Insights */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Brain className="w-6 h-6 text-blue-600" />
              AI Insights
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                <p className="text-blue-800 dark:text-blue-200 font-medium mb-1">Your mood has improved 15% this week!</p>
                <p className="text-blue-600 dark:text-blue-300 text-sm">Keep up the great work with your morning routines.</p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800">
                <p className="text-green-800 dark:text-green-200 font-medium mb-1">Wellness Streak: 5 Days</p>
                <p className="text-green-600 dark:text-green-300 text-sm">You&apos;re on fire! Consistency is key to long-term wellness.</p>
              </div>
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-100 dark:border-amber-800">
                <p className="text-amber-800 dark:text-amber-200 font-medium mb-1">Sleep Alert</p>
                <p className="text-amber-600 dark:text-amber-300 text-sm">Your sleep patterns show room for improvement. Try going to bed 30 minutes earlier.</p>
              </div>
            </div>
          </Card>
          
          {/* Recent Achievements */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Award className="w-6 h-6 text-amber-500" />
              Recent Achievements
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg">
                <div className="w-12 h-12 flex items-center justify-center bg-amber-100 dark:bg-amber-900/40 rounded-full text-2xl">
                  🏆
                </div>
                <div>
                  <p className="font-semibold">7-Day Wellness Streak</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Consistent daily check-ins</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg">
                <div className="w-12 h-12 flex items-center justify-center bg-blue-100 dark:bg-blue-900/40 rounded-full text-2xl">
                  🎯
                </div>
                <div>
                  <p className="font-semibold">Identity Module Complete</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Finished all core values exercises</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg">
                <div className="w-12 h-12 flex items-center justify-center bg-green-100 dark:bg-green-900/40 rounded-full text-2xl">
                  📈
                </div>
                <div>
                  <p className="font-semibold">Energy Level Up</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Average energy increased by 20%</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
