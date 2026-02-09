'use client'

import { useState } from 'react'
import { Heart, Zap, Moon, Droplets, Sun, CheckCircle } from 'lucide-react'

interface CheckInData {
  mood: number
  energy: number
  sleep: number
  water: number
  stress: number
}

const MOODS = [
  { emoji: '😢', label: 'Struggling', value: 1 },
  { emoji: '😕', label: 'Low', value: 3 },
  { emoji: '😐', label: 'Okay', value: 5 },
  { emoji: '🙂', label: 'Good', value: 7 },
  { emoji: '😊', label: 'Great', value: 9 },
  { emoji: '🤩', label: 'Amazing', value: 10 },
]

const ENERGY_LEVELS = [
  { emoji: '🔋', label: 'Drained', value: 1 },
  { emoji: '🪫', label: 'Low', value: 3 },
  { emoji: '⚡', label: 'Moderate', value: 5 },
  { emoji: '🔆', label: 'Energetic', value: 7 },
  { emoji: '💥', label: 'Charged', value: 9 },
]

const Slider = ({ 
  label, 
  icon: Icon, 
  value, 
  onChange, 
  min = 1, 
  max = 10,
  color = 'from-purple-500 to-pink-500'
}: {
  label: string
  icon: any
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
  color?: string
}) => (
  <div className="mb-6">
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        <Icon className="w-5 h-5 text-slate-400" />
        <span className="font-medium">{label}</span>
      </div>
      <span className="text-lg font-bold bg-gradient-to-r bg-clip-text text-transparent">{value}</span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange(parseInt(e.target.value))}
      className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
      style={{
        background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${((value - min) / (max - min)) * 100}%, #334155 ${((value - min) / (max - min)) * 100}%, #334155 100%)`
      }}
    />
  </div>
)

export default function QuickCheckIn() {
  const [step, setStep] = useState(0)
  const [data, setData] = useState<CheckInData>({
    mood: 5,
    energy: 5,
    sleep: 7,
    water: 2000,
    stress: 5,
  })
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleSubmit = async () => {
    // Calculate wellness score
    const wellnessScore = Math.round(
      (data.mood + data.energy + (data.sleep / 10 * 10) + (data.water / 2500 * 10) + (10 - data.stress)) / 5 * 10
    )
    setScore(wellnessScore)
    setSubmitted(true)
  }

  const reset = () => {
    setStep(0)
    setData({ mood: 5, energy: 5, sleep: 7, water: 2000, stress: 5 })
    setSubmitted(false)
    setScore(0)
  }

  if (submitted) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl text-center">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center">
          <span className="text-4xl">{score >= 70 ? '🎉' : score >= 50 ? '👍' : '💪'}</span>
        </div>
        
        <h2 className="text-2xl font-bold mb-2">
          {score >= 80 ? 'Wellness Champion!' : 
           score >= 60 ? 'Doing Great!' : 
           score >= 40 ? 'Keep Going!' : 
           'Tomorrow is a New Day'}
        </h2>
        
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Your wellness score: <span className="font-bold text-green-500">{score}/100</span>
        </p>

        <div className="grid grid-cols-2 gap-3 mb-6 text-sm">
          <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
            <p className="text-slate-500">Mood</p>
            <p className="font-bold">{data.mood}/10</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
            <p className="text-slate-500">Energy</p>
            <p className="font-bold">{data.energy}/10</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
            <p className="text-slate-500">Sleep</p>
            <p className="font-bold">{data.sleep}h</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
            <p className="text-slate-500">Stress</p>
            <p className="font-bold">{data.stress}/10</p>
          </div>
        </div>

        <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl mb-6">
          <p className="text-sm font-medium">
            💡 {data.sleep < 6 ? 'Prioritize 7+ hours tonight' :
                data.stress > 7 ? 'Try a 5-minute breathing exercise' :
                data.energy < 5 ? 'A short walk might boost your energy' :
                'Great balance! Keep it up!'}
          </p>
        </div>

        <button
          onClick={reset}
          className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium"
        >
          Check In Tomorrow
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xl">
      {/* Progress */}
      <div className="flex gap-2 mb-6">
        {[0, 1, 2, 3, 4].map(i => (
          <div
            key={i}
            className={`h-2 flex-1 rounded-full transition-colors ${
              i <= step ? 'bg-purple-500' : 'bg-slate-200 dark:bg-slate-700'
            }`}
          />
        ))}
      </div>

      {/* Step Content */}
      {step === 0 && (
        <div>
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="text-2xl">😊</span> How are you feeling?
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {MOODS.map(m => (
              <button
                key={m.value}
                onClick={() => { setData({...data, mood: m.value}); setStep(1) }}
                className={`p-4 rounded-xl text-center transition-all ${
                  data.mood === m.value 
                    ? 'bg-purple-100 dark:bg-purple-900/30 ring-2 ring-purple-500' 
                    : 'bg-slate-50 dark:bg-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="text-3xl block mb-1">{m.emoji}</span>
                <span className="text-xs font-medium">{m.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 1 && (
        <div>
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="text-2xl">⚡</span> Energy Level
          </h3>
          <Slider
            label="Current Energy"
            icon={Zap}
            value={data.energy}
            onChange={(v) => setData({...data, energy: v})}
          />
          <button
            onClick={() => setStep(2)}
            className="w-full py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-medium mt-4"
          >
            Continue
          </button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="text-2xl">🌙</span> Sleep Last Night
          </h3>
          <Slider
            label="Hours of Sleep"
            icon={Moon}
            value={data.sleep}
            onChange={(v) => setData({...data, sleep: v})}
            min={3}
            max={12}
          />
          <button
            onClick={() => setStep(3)}
            className="w-full py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-medium mt-4"
          >
            Continue
          </button>
        </div>
      )}

      {step === 3 && (
        <div>
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="text-2xl">💧</span> Water Today
          </h3>
          <Slider
            label="Milliliters"
            icon={Droplets}
            value={data.water}
            onChange={(v) => setData({...data, water: v})}
            min={0}
            max={4000}
          />
          <button
            onClick={() => setStep(4)}
            className="w-full py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-medium mt-4"
          >
            Continue
          </button>
        </div>
      )}

      {step === 4 && (
        <div>
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="text-2xl">🧘</span> Stress Level
          </h3>
          <Slider
            label="Current Stress (inverse)"
            icon={Sun}
            value={data.stress}
            onChange={(v) => setData({...data, stress: v})}
            color="from-amber-500 to-orange-500"
          />
          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium mt-4"
          >
            Complete Check-In
          </button>
        </div>
      )}
    </div>
  )
}
