'use client'

import { useState } from 'react'
import { Card, Button, Spinner } from '@organic-os/ui'

// Holistic Alchemy - The art of transforming consciousness
const alchemyStages = [
  {
    stage: 'Nigredo',
    name: 'The Blackening',
    description: 'Breakdown and dissolution of the old self',
    practices: ['Shadow work', 'Radical honesty', 'Confronting fears'],
    color: 'neutral-900',
    icon: '⚫'
  },
  {
    stage: 'Albedo',
    name: 'The Whitening',
    description: 'Purification and clarification of consciousness',
    practices: ['Meditation', 'Journaling', 'Energy clearing'],
    color: 'neutral-100',
    icon: '⚪'
  },
  {
    stage: 'Citrinitas',
    name: 'The Yellowing',
    description: 'Dawn of new awareness and understanding',
    practices: ['Conscious inquiry', 'Pattern recognition', 'Wisdom integration'],
    color: 'amber-500',
    icon: '🟡'
  },
  {
    stage: 'Rubedo',
    name: 'The Reddening',
    description: 'Integration and mastery of the new self',
    practices: ['Embodied practice', 'Teaching others', 'Creative expression'],
    color: 'rose-500',
    icon: '🔴'
  }
]

const elements = [
  { name: 'Fire', qualities: 'Hot & Dry', purpose: 'Transformation', practices: ['Breathwork', 'Sun gazing', 'Fire ceremonies'] },
  { name: 'Water', qualities: 'Cold & Wet', purpose: 'Flow & Emotion', practices: ['Hydrotherapy', 'Dream work', 'Emotional release'] },
  { name: 'Air', qualities: 'Hot & Wet', purpose: 'Intellect & Communication', practices: ['Visualization', 'Study', 'Speaking truth'] },
  { name: 'Earth', qualities: 'Cold & Dry', purpose: 'Stability & Manifestation', practices: ['Grounding', 'Nature connection', 'Physical work'] },
  { name: 'Ether', qualities: 'Subtle', purpose: 'Connection & Spirit', practices: ['Meditation', 'Sound healing', 'Prayer'] }
]

const constitutionTypes = [
  { type: 'Vata', elements: ['Air', 'Ether'], traits: ['Creative', 'Energetic', 'Quick'], imbalance: ['Anxious', 'Scattered', 'Dry'] },
  { type: 'Pitta', elements: ['Fire', 'Water'], traits: ['Focused', 'Ambitious', 'Sharp'], imbalance: ['Irritable', 'Inflammatory', 'Hot'] },
  { type: 'Kapha', elements: ['Earth', 'Water'], traits: ['Steady', 'Nurturing', 'Strong'], imbalance: ['Lethargic', 'Attached', 'Heavy'] }
]

export default function HolisticAlchemyPage() {
  const [activeStage, setActiveStage] = useState('Nigredo')
  const [showElements, setShowElements] = useState(false)
  const [constitutionResult, setConstitutionResult] = useState<string | null>(null)

  const currentStage = alchemyStages.find(s => s.stage === activeStage)!

  const handleConstitutionTest = () => {
    // Simplified test - in real app would have more questions
    const types = ['Vata', 'Pitta', 'Kapha']
    setConstitutionResult(types[Math.floor(Math.random() * types.length)])
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-8">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-2">
          <span className="text-5xl">🧪</span>
          <div>
            <h1 className="text-4xl font-display font-bold">Holistic Alchemy</h1>
            <p className="text-text-secondary text-lg">
              The art and science of transforming consciousness
            </p>
          </div>
        </div>
      </div>

      {/* Stage Navigation */}
      <div className="mb-12">
        <h2 className="text-lg font-semibold mb-4 text-text-muted uppercase tracking-wider">
          The Four Stages
        </h2>
        <div className="grid grid-cols-4 gap-4">
          {alchemyStages.map((stage) => (
            <button
              key={stage.stage}
              onClick={() => setActiveStage(stage.stage)}
              className={`p-4 rounded-lg transition-all text-left ${
                activeStage === stage.stage
                  ? 'bg-accent-primary/20 border-2 border-accent-primary'
                  : 'bg-surface-primary border border-surface-secondary hover:border-accent-primary/30'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{stage.icon}</span>
                <span className="font-semibold">{stage.stage}</span>
              </div>
              <p className="text-sm text-text-muted">{stage.name}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Active Stage Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-4xl">{currentStage.icon}</span>
              <div>
                <h3 className="text-2xl font-semibold">{currentStage.name}</h3>
                <p className="text-text-secondary">{currentStage.description}</p>
              </div>
            </div>
            
            <h4 className="font-semibold mb-3">Recommended Practices:</h4>
            <div className="space-y-2">
              {currentStage.practices.map((practice) => (
                <div
                  key={practice}
                  className="flex items-center gap-3 p-3 bg-surface-primary rounded-lg"
                >
                  <span className="text-accent-primary">✦</span>
                  <span>{practice}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div>
          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <span>🌟</span> Alchemical Wisdom
            </h3>
            <p className="text-text-secondary text-sm mb-4">
              The Great Work is not about escaping the material world, 
              but transforming it through conscious evolution.
            </p>
            <p className="text-text-secondary text-sm">
              Each stage requires patience, dedication, and willingness 
              to face the shadow aspects of ourselves.
            </p>
          </Card>
        </div>
      </div>

      {/* Elements Section */}
      <div className="mb-12">
        <Button 
          onClick={() => setShowElements(!showElements)}
          variant="secondary"
          className="mb-4"
        >
          {showElements ? 'Hide Elements' : 'Show Five Elements'}
        </Button>
        
        {showElements && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {elements.map((element) => (
              <Card key={element.name} className="p-4 text-center">
                <span className="text-3xl mb-2 block">
                  {element.name === 'Fire' && '🔥'}
                  {element.name === 'Water' && '💧'}
                  {element.name === 'Air' && '💨'}
                  {element.name === 'Earth' && '🌍'}
                  {element.name === 'Ether' && '✨'}
                </span>
                <h4 className="font-semibold">{element.name}</h4>
                <p className="text-xs text-text-muted mb-2">{element.qualities}</p>
                <p className="text-xs text-accent-primary mb-2">{element.purpose}</p>
                <div className="text-xs text-text-secondary space-y-1">
                  {element.practices.map(p => (
                    <p key={p}>• {p}</p>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Constitution Test */}
      <div className="mb-12">
        <Card className="p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <span>🔮</span> Constitutional Analysis
          </h3>
          <p className="text-text-secondary mb-4">
            Discover your primary elemental constitution to better understand 
            your natural tendencies and how to maintain balance.
          </p>
          
          <Button onClick={handleConstitutionTest} disabled={!!constitutionResult}>
            {constitutionResult ? `Your Type: ${constitutionResult}` : 'Take the Test'}
          </Button>
          
          {constitutionResult && (
            <div className="mt-4 p-4 bg-accent-primary/10 border border-accent-primary/20 rounded-lg">
              <p className="font-semibold mb-2">{constitutionResult} Constitution</p>
              {constitutionResult === 'Vata' && (
                <p className="text-sm text-text-secondary">
                  Air and Ether dominant. Focus on grounding, warmth, and routine practices.
                </p>
              )}
              {constitutionResult === 'Pitta' && (
                <p className="text-sm text-text-secondary">
                  Fire and Water dominant. Focus on cooling, moderation, and surrender practices.
                </p>
              )}
              {constitutionResult === 'Kapha' && (
                <p className="text-sm text-text-secondary">
                  Earth and Water dominant. Focus on stimulation, movement, and lightness practices.
                </p>
              )}
            </div>
          )}
        </Card>
      </div>

      {/* Resources */}
      <div>
        <h3 className="font-semibold mb-4">Recommended Resources</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <h4 className="font-medium mb-2">📚 The Alchemist</h4>
            <p className="text-sm text-text-secondary">
              Paulo Coelho - A parable about following your dreams
            </p>
          </Card>
          <Card className="p-4">
            <h4 className="font-medium mb-2">🧘 Inner Engineering</h4>
            <p className="text-sm text-text-secondary">
              Sadhguru - Practices for inner transformation
            </p>
          </Card>
          <Card className="p-4">
            <h4 className="font-medium mb-2">🔥 Fire Within</h4>
            <p className="text-sm text-text-secondary">
              Leonard Cohen - On meditation and devotion
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}
