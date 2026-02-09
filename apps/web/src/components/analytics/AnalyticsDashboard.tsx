// Analytics Dashboard
// Comprehensive progress visualization

import React, { useState, useMemo } from 'react';
import { Card, Button, Badge, Progress, Select } from '../design-system';

// ============ Types ============

interface MetricData {
  date: string;
  value: number;
}

interface WellnessMetrics {
  mood: MetricData[];
  energy: MetricData[];
  sleep: MetricData[];
  stress: MetricData[];
}

interface HabitMetrics {
  habitId: string;
  habitName: string;
  streak: number;
  completionRate: number;
  totalCompletions: number;
}

interface GoalMetrics {
  goalId: string;
  goalName: string;
  progress: number;
  milestones: number;
  completedMilestones: number;
}

interface AnalyticsDashboardProps {
  wellnessMetrics: WellnessMetrics;
  habitMetrics: HabitMetrics[];
  goalMetrics: GoalMetrics[];
  dateRange?: '7d' | '30d' | '90d';
}

// ============ Chart Components ============

function SimpleLineChart({ 
  data, 
  color = '#22c55e',
  height = 100 
}: { 
  data: MetricData[]; 
  color?: string;
  height?: number;
}) {
  if (!data.length) return <div className="h-24 bg-neutral-100 rounded" />;
  
  const max = Math.max(...data.map(d => d.value));
  const min = Math.min(...data.map(d => d.value));
  const range = max - min || 1;
  
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = height - ((d.value - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <svg className="w-full" viewBox={`0 0 100 ${height}`} preserveAspectRatio="none">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        points={points}
        className="drop-shadow-sm"
      />
      {data.map((d, i) => {
        const x = (i / (data.length - 1)) * 100;
        const y = height - ((d.value - min) / range) * height;
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r="2"
            fill={color}
            className="opacity-0 hover:opacity-100 transition-opacity"
          />
        );
      })}
    </svg>
  );
}

function WeeklyHeatmap({ 
  data, 
  color = '#22c55e' 
}: { 
  data: { day: number; week: number; value: number }[];
  color?: string;
}) {
  const weeks = Math.ceil(data.length / 7);
  
  return (
    <div className="flex gap-1">
      {Array.from({ length: weeks }).map((_, w) => (
        <div key={w} className="flex flex-col gap-1">
          {data.slice(w * 7, (w + 1) * 7).map((d, i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-sm"
              style={{
                backgroundColor: d.value > 0 ? color : 'transparent',
                opacity: d.value > 0 ? 0.2 + (d.value / 5) * 0.8 : 0.1,
              }}
              title={`Day ${d.value}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function StatCard({
  title,
  value,
  change,
  icon,
  color = 'green'
}: {
  title: string;
  value: string | number;
  change?: number;
  icon: string;
  color?: 'green' | 'blue' | 'purple' | 'orange';
}) {
  const colors = {
    green: 'text-green-600 bg-green-50',
    blue: 'text-blue-600 bg-blue-50',
    purple: 'text-purple-600 bg-purple-50',
    orange: 'text-orange-600 bg-orange-50',
  };
  
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-neutral-500 mb-1">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          {change !== undefined && (
            <p className={cn(
              'text-sm mt-1',
              change >= 0 ? 'text-green-600' : 'text-red-600'
            )}>
              {change >= 0 ? '↑' : '↓'} {Math.abs(change)}% from last week
            </p>
          )}
        </div>
        <div className={cn('p-2 rounded-lg', colors[color])}>
          {icon}
        </div>
      </div>
    </Card>
  );
}

function cn(...inputs: (string | undefined | null | false)[]) {
  return inputs.filter(Boolean).join(' ');
}

// ============ Main Component ============

export function AnalyticsDashboard({
  wellnessMetrics,
  habitMetrics,
  goalMetrics,
  dateRange = '30d'
}: AnalyticsDashboardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState(dateRange);
  
  // Calculate averages
  const averages = useMemo(() => {
    const avg = (arr: MetricData[]) => 
      arr.length ? arr.reduce((sum, d) => sum + d.value, 0) / arr.length : 0;
    
    return {
      mood: avg(wellnessMetrics.mood),
      energy: avg(wellnessMetrics.energy),
      sleep: avg(wellnessMetrics.sleep),
      stress: avg(wellnessMetrics.stress),
    };
  }, [wellnessMetrics]);
  
  // Overall wellness score
  const wellnessScore = useMemo(() => {
    // Weighted average: mood 30%, energy 25%, sleep 30%, stress (inverse) 15%
    const stressScore = 5 - averages.stress; // Invert stress
    return Math.round(
      (averages.mood * 0.3 + averages.energy * 0.25 + averages.sleep * 0.3 + stressScore * 0.15) / 4 * 20
    );
  }, [averages]);
  
  // Best habits
  const bestHabits = useMemo(() => 
    [...habitMetrics].sort((a, b) => b.completionRate - a.completionRate).slice(0, 3),
    [habitMetrics]
  );
  
  // Goals progress
  const activeGoals = goalMetrics.filter(g => g.progress < 100);
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-neutral-500">Your growth journey, visualized</p>
        </div>
        <Select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value as typeof dateRange)}
          options={[
            { value: '7d', label: 'Last 7 days' },
            { value: '30d', label: 'Last 30 days' },
            { value: '90d', label: 'Last 90 days' },
          ]}
        />
      </div>
      
      {/* Wellness Score */}
      <Card className="bg-gradient-to-r from-primary-500 to-primary-600 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-primary-100 mb-1">Overall Wellness Score</p>
            <p className="text-5xl font-bold">{wellnessScore}</p>
            <p className="text-primary-100 text-sm mt-2">
              Based on mood, energy, sleep, and stress
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">
              {wellnessScore >= 80 ? '🌟' : wellnessScore >= 60 ? '👍' : '💪'}
            </div>
            <p className="text-primary-100 text-sm">
              {wellnessScore >= 80 ? 'Excellent!' : wellnessScore >= 60 ? 'Doing well' : 'Room to grow'}
            </p>
          </div>
        </div>
      </Card>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Average Mood"
          value={averages.mood.toFixed(1)}
          change={5}
          icon="😊"
          color="green"
        />
        <StatCard
          title="Average Energy"
          value={averages.energy.toFixed(1)}
          change={-2}
          icon="⚡"
          color="blue"
        />
        <StatCard
          title="Sleep Average"
          value={`${averages.sleep.toFixed(1)}h`}
          change={8}
          icon="😴"
          color="purple"
        />
        <StatCard
          title="Stress Level"
          value={averages.stress.toFixed(1)}
          change={-15}
          icon="🧘"
          color="orange"
        />
      </div>
      
      {/* Wellness Trends */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-semibold mb-4">Mood Trend</h3>
          <SimpleLineChart data={wellnessMetrics.mood} color="#22c55e" />
          <div className="flex justify-between mt-2 text-sm text-neutral-500">
            <span>Low: {Math.min(...wellnessMetrics.mood.map(d => d.value), 0)}</span>
            <span>High: {Math.max(...wellnessMetrics.mood.map(d => d.value), 5)}</span>
          </div>
        </Card>
        
        <Card>
          <h3 className="font-semibold mb-4">Energy Trend</h3>
          <SimpleLineChart data={wellnessMetrics.energy} color="#3b82f6" />
          <div className="flex justify-between mt-2 text-sm text-neutral-500">
            <span>Low: {Math.min(...wellnessMetrics.energy.map(d => d.value), 0)}</span>
            <span>High: {Math.max(...wellnessMetrics.energy.map(d => d.value), 5)}</span>
          </div>
        </Card>
      </div>
      
      {/* Habits Progress */}
      <Card>
        <h3 className="font-semibold mb-4">Habit Progress</h3>
        <div className="space-y-4">
          {habitMetrics.map(habit => (
            <div key={habit.habitId}>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">{habit.habitName}</span>
                <span className="text-sm text-neutral-500">
                  {habit.streak} day streak
                </span>
              </div>
              <Progress 
                value={habit.completionRate} 
                variant={habit.completionRate >= 80 ? 'success' : 'default'}
              />
            </div>
          ))}
        </div>
      </Card>
      
      {/* Goals */}
      <Card>
        <h3 className="font-semibold mb-4">Goals</h3>
        {activeGoals.length === 0 ? (
          <p className="text-neutral-500">All goals completed! 🎉</p>
        ) : (
          <div className="space-y-4">
            {activeGoals.map(goal => (
              <div key={goal.goalId}>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">{goal.goalName}</span>
                  <Badge variant={goal.progress >= 50 ? 'success' : 'default'}>
                    {goal.progress}%
                  </Badge>
                </div>
                <Progress value={goal.progress} />
                <p className="text-sm text-neutral-500 mt-1">
                  {goal.completedMilestones} of {goal.milestones} milestones
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>
      
      {/* Insights */}
      <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20">
        <h3 className="font-semibold mb-4">💡 Insights</h3>
        <div className="space-y-3 text-sm">
          {averages.sleep < 7 && (
            <p>🌙 Your sleep average is below 7 hours. Consider an earlier bedtime.</p>
          )}
          {averages.stress > 3 && (
            <p>🧘 Stress levels elevated. Try the breathing exercises module.</p>
          )}
          {habitMetrics.some(h => h.completionRate < 50) && (
            <p>📝 Some habits need attention. Consistency is key!</p>
          )}
          {averages.mood > 4 && (
            <p>😊 Great mood this period! Keep up the positive momentum.</p>
          )}
          {!activeGoals.length && (
            <p>🎉 All goals in progress are 50%+ complete!</p>
          )}
        </div>
      </Card>
    </div>
  );
}

// ============ Export ============

export { SimpleLineChart, WeeklyHeatmap, StatCard };
