'use client'

import { useState } from 'react'
import { Card, Button, Spinner } from '@/components/design-system'

// Holistic Alchemy - Toxins literacy and systems-first lifestyle
interface ToxinCategory {
  name: string
  sources: string[]
  effects: string[]
  alternatives: string[]
  severity: 'low' | 'medium' | 'high'
}

const toxinCategories: ToxinCategory[] = [
  {
    name: 'Environmental Toxins',
    sources: ['Air pollution', 'Water contamination', 'Soil chemicals', 'Urban environments'],
    effects: ['Respiratory issues', 'Hormonal disruption', 'Cognitive decline', 'Immune suppression'],
    alternatives: ['HEPA filters', 'Water purifiers', 'Organic food', 'Green spaces'],
    severity: 'high'
  },
  {
    name: 'Household Chemicals',
    sources: ['Cleaning products', 'Personal care', 'Plastics', 'Furniture'],
    effects: ['Skin irritation', 'Endocrine disruption', 'Neurological symptoms', 'Cancer risk'],
    alternatives: ['Natural cleaners', 'Glass containers', 'Non-toxic personal care', 'Organic bedding'],
    severity: 'medium'
  },
  {
    name: 'Food Toxins',
    sources: ['Processed foods', 'Pesticides', 'Preservatives', 'Artificial additives'],
    effects: ['Digestive issues', 'Inflammation', 'Metabolic syndrome', 'Nutrient depletion'],
    alternatives: ['Whole foods', 'Organic produce', 'Home cooking', 'Fermented foods'],
    severity: 'high'
  },
  {
    name: 'Digital Toxins',
    sources: ['Blue light', 'Social media', 'News consumption', 'Constant connectivity'],
    effects: ['Sleep disruption', 'Anxiety', 'Attention fragmentation', 'Social isolation'],
    alternatives: ['Blue light filters', 'Digital detox', 'Mindful consumption', 'Nature time'],
    severity: 'medium'
  },
  {
    name: 'Social Toxins',
    sources: ['Toxic relationships', 'Negative environments', 'Gaslighting', 'Chronic stress'],
    effects: ['Mental health issues', 'Cortisol elevation', 'Relationship difficulties', 'Burnout'],
    alternatives: ['Boundaries', 'Supportive communities', 'Therapy', 'Self-care practices'],
    severity: 'high'
  }
]

interface MitigationStrategy {
  category: string
  actions: string[]
  timeline: string
}

const mitigationStrategies: MitigationStrategy[] = [
  {
    category: 'Immediate (1-7 days)',
    actions: [
      'Remove obvious chemical cleaners from home',
      'Switch to glass food containers',
      'Install blue light filters on devices',
      'Establish device-free hours'
    ],
    timeline: '1 week'
  },
  {
    category: 'Short-term (1-4 weeks)',
    actions: [
      'Transition to organic produce',
      'Replace personal care products',
      'Deep clean living spaces',
      'Audit social circle'
    ],
    timeline: '1 month'
  },
  {
    category: 'Long-term (1-3 months)',
    actions: [
      'Full home detoxification',
      'Build supportive community',
      'Establish wellness routines',
      'Continuous monitoring'
    ],
    timeline: '3 months'
  }
]

export default function HolisticAlchemyPage() {
  const [selectedCategory, setSelectedCategory] = useState<ToxinCategory | null>(null)

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-500 bg-red-50 dark:bg-red-900/20'
      case 'medium': return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
      case 'low': return 'text-green-500 bg-green-50 dark:bg-green-900/20'
      default: return 'text-gray-500'
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-4">
            Holistic Alchemy
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            Transform your relationship with toxins through systematic awareness and intentional substitution.
          </p>
        </header>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-neutral-800 dark:text-neutral-200">
            Toxin Categories
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {toxinCategories.map((category) => (
              <Card
                key={category.name}
                className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedCategory(category)}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold">{category.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(category.severity)}`}>
                    {category.severity.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {category.sources.length} sources identified
                </p>
              </Card>
            ))}
          </div>
        </section>

        {selectedCategory && (
          <section className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-200">
                {selectedCategory.name}
              </h2>
              <Button variant="outline" onClick={() => setSelectedCategory(null)}>
                Close
              </Button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="font-semibold mb-4 text-lg">Common Sources</h3>
                <ul className="space-y-2">
                  {selectedCategory.sources.map((source) => (
                    <li key={source} className="flex items-center text-neutral-600 dark:text-neutral-400">
                      <span className="w-2 h-2 bg-red-400 rounded-full mr-3" />
                      {source}
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-4 text-lg">Health Effects</h3>
                <ul className="space-y-2">
                  {selectedCategory.effects.map((effect) => (
                    <li key={effect} className="flex items-center text-neutral-600 dark:text-neutral-400">
                      <span className="w-2 h-2 bg-yellow-400 rounded-full mr-3" />
                      {effect}
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="p-6 md:col-span-2">
                <h3 className="font-semibold mb-4 text-lg">Safer Alternatives</h3>
                <ul className="grid md:grid-cols-2 gap-2">
                  {selectedCategory.alternatives.map((alt) => (
                    <li key={alt} className="flex items-center text-green-600 dark:text-green-400">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-3" />
                      {alt}
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </section>
        )}

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-neutral-800 dark:text-neutral-200">
            Mitigation Strategies
          </h2>
          <div className="space-y-6">
            {mitigationStrategies.map((strategy) => (
              <Card key={strategy.category} className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">{strategy.category}</h3>
                  <span className="text-sm text-neutral-500">{strategy.timeline}</span>
                </div>
                <ul className="space-y-2">
                  {strategy.actions.map((action) => (
                    <li key={action} className="flex items-start text-neutral-600 dark:text-neutral-400">
                      <span className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-sm mr-3 mt-0.5">
                        ✓
                      </span>
                      {action}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <Card className="p-8 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20">
            <h2 className="text-2xl font-semibold mb-4">Ready to Begin?</h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              Start with the immediate actions and progressively implement longer-term strategies for comprehensive detoxification.
            </p>
            <div className="flex gap-4">
              <Button variant="primary">
                Start Assessment
              </Button>
              <Button variant="outline">
                Learn More
              </Button>
            </div>
          </Card>
        </section>
      </div>
    </div>
  )
}
