'use client'

import { useState } from 'react'
import { Card, Button, Spinner } from '@organic-os/ui'

// ===========================================
// EVIDENCE-BASED INTERVENTIONS DATABASE
// ===========================================
// Evidence levels: STRONG (10+ trials), MODERATE (5-10 trials), EMERGING (2-4 trials)

interface Intervention {
  name: string
  dosage: string
  mechanism: string
  evidence: 'STRONG' | 'MODERATE' | 'EMERGING' | 'CAUTION'
  category: string
  notes?: string
}

interface Condition {
  name: string
  description: string
  interventions: Intervention[]
}

// DEPRESSION INTERVENTIONS
const depressionInterventions: Intervention[] = [
  { name: 'St. John\'s Wort', dosage: '300-900 mg TID', mechanism: 'Serotonin reuptake inhibition, MAO inhibition', evidence: 'STRONG', category: 'Primary' },
  { name: 'Saffron', dosage: '15-30 mg daily', mechanism: 'Monoamine modulation, anti-inflammatory', evidence: 'STRONG', category: 'Primary' },
  { name: 'Omega-3 (EPA/DHA)', dosage: '2000-4000 mg daily', mechanism: 'Membrane fluidity, neurotransmitter modulation', evidence: 'MODERATE', category: 'Adjunctive', notes: 'Higher EPA ratio more effective' },
  { name: 'Probiotics (Psychobiotics)', dosage: '10-50 billion CFU', mechanism: 'GABA production, gut-brain axis', evidence: 'MODERATE', category: 'Adjunctive', notes: 'L. plantarum, B. longum, L. helveticus' },
  { name: 'Vitamin D', dosage: '2000-4000 IU daily', mechanism: 'Serotonin synthesis regulation', evidence: 'MODERATE', category: 'Support', notes: 'Particularly effective in deficient individuals' },
  { name: 'Folic Acid/Methylfolate', dosage: '5-15 mg or 1000-2000 mcg MTHF', mechanism: 'Neurotransmitter synthesis', evidence: 'MODERATE', category: 'Adjunctive', notes: 'Synergistic with SSRIs' },
  { name: 'Zinc', dosage: '15-30 mg daily', mechanism: 'Neuroinflammation reduction', evidence: 'EMERGING', category: 'Support' },
  { name: 'Rhodiola', dosage: '300-600 mg daily', mechanism: 'Stress adaptation, fatigue reduction', evidence: 'EMERGING', category: 'Support', notes: 'Caution: can trigger mania in bipolar' },
]

// ANXIETY INTERVENTIONS
const anxietyInterventions: Intervention[] = [
  { name: 'Ashwagandha', dosage: '300-600 mg BID', mechanism: 'HPA axis modulation, cortisol reduction', evidence: 'STRONG', category: 'Primary', notes: 'Comparable to benzodiazepines in RCTs' },
  { name: 'Lavender (Silexan)', dosage: '80-160 mg daily', mechanism: 'GABA agonism, anxiolytic', evidence: 'STRONG', category: 'Primary' },
  { name: 'Valerian Root', dosage: '400-900 mg daily', mechanism: 'GABA receptor agonist', evidence: 'MODERATE', category: 'Primary', notes: 'Particularly for anxiety with insomnia' },
  { name: 'Chamomile', dosage: '1-2 cups tea TID or 200-400 mg', mechanism: 'Benzodiazepine-like receptor activity', evidence: 'MODERATE', category: 'Primary' },
  { name: 'Magnesium (glycinate)', dosage: '200-400 mg daily', mechanism: 'GABA co-factor, stress response', evidence: 'MODERATE', category: 'Support' },
  { name: 'Lemon Balm', dosage: '300-600 mg TID', mechanism: 'GABA modulation', evidence: 'MODERATE', category: 'Support' },
  { name: 'Passionflower', dosage: '400-800 mg or tea TID', mechanism: 'GABA/benzodiazepine receptor', evidence: 'MODERATE', category: 'Support', notes: 'Anxiety without sedation' },
  { name: 'L-Theanine', dosage: '100-200 mg daily', mechanism: 'GABA production, alpha waves', evidence: 'MODERATE', category: 'Support', notes: 'Rapid onset, no drowsiness' },
]

// SLEEP INTERVENTIONS
const sleepInterventions: Intervention[] = [
  { name: 'Valerian Root', dosage: '400-900 mg before bed', mechanism: 'GABA receptor, sleep stage enhancement', evidence: 'STRONG', category: 'Primary', notes: '30+ trials, reduces sleep onset by 15-20 min' },
  { name: 'Passionflower', dosage: '400-800 mg before bed', mechanism: 'GABA/benzodiazepine receptor', evidence: 'STRONG', category: 'Primary', notes: 'Synergistic with valerian' },
  { name: 'Chamomile', dosage: '1-2 cups tea before bed', mechanism: 'Benzodiazepine-like activity', evidence: 'STRONG', category: 'Primary' },
  { name: 'Magnesium (glycinate)', dosage: '200-400 mg before bed', mechanism: 'GABA synthesis, muscle relaxation', evidence: 'MODERATE', category: 'Support', notes: 'Particularly with muscle tension' },
  { name: 'Melatonin', dosage: '0.5-10 mg at bedtime', mechanism: 'Circadian rhythm synchronization', evidence: 'MODERATE', category: 'Support', notes: 'Best for circadian issues, jet lag' },
  { name: 'Lavender', dosage: '80-160 mg daily', mechanism: 'GABA modulation, anxiolytic', evidence: 'MODERATE', category: 'Support' },
  { name: 'Reishi Mushroom', dosage: '1000-2000 mg daily', mechanism: 'Sleep stage enhancement, dream lucidity', evidence: 'EMERGING', category: 'Emerging' },
  { name: 'Skullcap', dosage: '500-1000 mg before bed', mechanism: 'Nervous system calming', evidence: 'EMERGING', category: 'Emerging' },
]

// OCD INTERVENTIONS
const ocdInterventions: Intervention[] = [
  { name: 'NAC (N-Acetyl-Cysteine)', dosage: '1000-2000 mg BID', mechanism: 'Glutamate regulation, obsessive thought reduction', evidence: 'MODERATE', category: 'Primary', notes: '25-35% symptom reduction in RCTs' },
  { name: 'Omega-3', dosage: '1000-2000 mg EPA+DHA', mechanism: 'Anti-inflammatory, membrane integrity', evidence: 'EMERGING', category: 'Adjunctive' },
  { name: 'Magnesium', dosage: '200-400 mg daily', mechanism: 'Anxiety component support', evidence: 'EMERGING', category: 'Support' },
  { name: 'Probiotics', dosage: '10-50 billion CFU', mechanism: 'GABA production, inflammation reduction', evidence: 'EMERGING', category: 'Support' },
]

// PTSD INTERVENTIONS
const ptsdInterventions: Intervention[] = [
  { name: 'Magnesium (threonate)', dosage: '200-400 mg daily', mechanism: 'HPA axis modulation, hyperarousal reduction', evidence: 'MODERATE', category: 'Primary', notes: 'Reduces nightmares and startle response' },
  { name: 'Valerian Root', dosage: '400-900 mg daily', mechanism: 'GABA agonist, sleep improvement', evidence: 'MODERATE', category: 'Primary' },
  { name: 'Lavender', dosage: '80-160 mg daily', mechanism: 'Anxiety and hypervigilance reduction', evidence: 'MODERATE', category: 'Support' },
  { name: 'Omega-3', dosage: '1000-2000 mg EPA+DHA', mechanism: 'Neuroinflammation, intrusive memories', evidence: 'MODERATE', category: 'Adjunctive' },
  { name: 'Reishi Mushroom', dosage: '1000-2000 mg daily', mechanism: 'Sleep quality, nightmare reduction', evidence: 'EMERGING', category: 'Emerging' },
  { name: 'Probiotics', dosage: '10-50 billion CFU', mechanism: 'Gut dysbiosis restoration', evidence: 'EMERGING', category: 'Support' },
]

// ALZHEIMER'S/DEMENTIA INTERVENTIONS
const cognitiveInterventions: Intervention[] = [
  { name: 'Ginkgo Biloba', dosage: '120-240 mg daily', mechanism: 'Vascular function, antioxidant', evidence: 'MODERATE', category: 'Primary', notes: 'Modest cognitive stabilization' },
  { name: 'Curcumin', dosage: '500-1000 mg TID with piperine', mechanism: 'Anti-amyloid, anti-inflammatory', evidence: 'MODERATE', category: 'Primary', notes: 'Poor bioavailability alone' },
  { name: 'EGCG/Green Tea', dosage: '300-400 mg daily', mechanism: 'Tau protein, amyloid aggregation', evidence: 'MODERATE', category: 'Support' },
  { name: 'Lion\'s Mane', dosage: '1000-3000 mg daily', mechanism: 'NGF production, neuroplasticity', evidence: 'EMERGING', category: 'Emerging' },
  { name: 'Resveratrol', dosage: '150-500 mg daily', mechanism: 'Sirtuin activation, neuroinflammation', evidence: 'EMERGING', category: 'Emerging' },
  { name: 'Huperzine A', dosage: '50-200 mcg daily', mechanism: 'Acetylcholinesterase inhibition', evidence: 'EMERGING', category: 'Emerging', notes: 'Similar to Aricept' },
]

// CONDITIONS DATABASE
const conditions: Condition[] = [
  { name: 'Depression (Major Depressive Disorder)', description: 'Persistent depressed mood, anhedonia, and neurovegetative symptoms lasting 2+ weeks', interventions: depressionInterventions },
  { name: 'Anxiety Disorders (GAD, Panic, Social)', description: 'Excessive worry, panic attacks, or social fear affecting daily functioning', interventions: anxietyInterventions },
  { name: 'Insomnia Disorder', description: 'Difficulty with sleep initiation, maintenance, or early awakening', interventions: sleepInterventions },
  { name: 'Obsessive-Compulsive Disorder', description: 'Intrusive thoughts and repetitive behaviors causing distress', interventions: ocdInterventions },
  { name: 'Post-Traumatic Stress Disorder', description: 'Trauma exposure with intrusive memories, avoidance, and hyperarousal', interventions: ptsdInterventions },
  { name: 'Cognitive Decline (MCI, Alzheimer\'s)', description: 'Objective cognitive decline exceeding normal aging', interventions: cognitiveInterventions },
]

// ALCHEMY STAGES (existing content)
const alchemyStages = [
  { stage: 'Nigredo', name: 'The Blackening', description: 'Breakdown and dissolution of the old self', practices: ['Shadow work', 'Radical honesty', 'Confronting fears'], color: 'neutral-900', icon: '⚫' },
  { stage: 'Albedo', name: 'The Whitening', description: 'Purification and clarification of consciousness', practices: ['Meditation', 'Journaling', 'Energy clearing'], color: 'neutral-100', icon: '⚪' },
  { stage: 'Citrinitas', name: 'The Yellowing', description: 'Dawn of new awareness and understanding', practices: ['Conscious inquiry', 'Pattern recognition', 'Wisdom integration'], color: 'amber-500', icon: '🟡' },
  { stage: 'Rubedo', name: 'The Reddening', description: 'Integration and mastery of the new self', practices: ['Embodied practice', 'Teaching others', 'Creative expression'], color: 'rose-500', icon: '🔴' }
]

const elements = [
  { name: 'Fire', qualities: 'Hot & Dry', purpose: 'Transformation', practices: ['Breathwork', 'Sun gazing', 'Fire ceremonies'] },
  { name: 'Water', qualities: 'Cold & Wet', purpose: 'Flow & Emotion', practices: ['Hydrotherapy', 'Dream work', 'Emotional release'] },
  { name: 'Air', qualities: 'Hot & Wet', purpose: 'Intellect & Communication', practices: ['Visualization', 'Study', 'Speaking truth'] },
  { name: 'Earth', qualities: 'Cold & Dry', purpose: 'Stability & Manifestation', practices: ['Grounding', 'Nature connection', 'Physical work'] },
  { name: 'Ether', qualities: 'Subtle', purpose: 'Connection & Spirit', practices: ['Meditation', 'Sound healing', 'Prayer'] }
]

export default function HolisticAlchemyPage() {
  const [activeTab, setActiveTab] = useState<'stages' | 'evidence' | 'elements'>('stages')
  const [activeStage, setActiveStage] = useState('Nigredo')
  const [showElements, setShowElements] = useState(false)
  const [expandedCondition, setExpandedCondition] = useState<string | null>(null)
  const [expandedIntervention, setExpandedIntervention] = useState<string | null>(null)

  const currentStage = alchemyStages.find(s => s.stage === activeStage)!
  const evidenceLevelColors = {
    STRONG: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    MODERATE: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    EMERGING: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    CAUTION: 'bg-red-500/20 text-red-400 border-red-500/30',
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
              Evidence-based natural interventions for mind, body & spirit
            </p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-8 border-b border-neutral-800">
        <div className="flex gap-4">
          {[
            { id: 'stages', label: 'Transformation Stages', icon: '🌟' },
            { id: 'evidence', label: 'Evidence-Based Protocols', icon: '📚' },
            { id: 'elements', label: 'Five Elements', icon: '🌈' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'stages' | 'evidence' | 'elements')}
              className={`px-6 py-3 rounded-t-lg transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-accent-primary/20 text-accent-primary border-b-2 border-accent-primary'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* STAGES TAB */}
      {activeTab === 'stages' && (
        <>
          {/* Stage Navigation */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 text-text-muted uppercase tracking-wider">
              The Four Stages of Transformation
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
                    <div key={practice} className="flex items-center gap-3 p-3 bg-surface-primary rounded-lg">
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
        </>
      )}

      {/* EVIDENCE-BASED PROTOCOLS TAB */}
      {activeTab === 'evidence' && (
        <div className="space-y-6">
          {/* Evidence Legend */}
          <div className="flex flex-wrap gap-3 mb-6">
            {[
              { level: 'STRONG', label: '10+ clinical trials', color: evidenceLevelColors.STRONG },
              { level: 'MODERATE', label: '5-10 trials', color: evidenceLevelColors.MODERATE },
              { level: 'EMERGING', label: '2-4 promising trials', color: evidenceLevelColors.EMERGING },
              { level: 'CAUTION', label: 'Safety concerns', color: evidenceLevelColors.CAUTION },
            ].map((legend) => (
              <span key={legend.level} className={`px-3 py-1 rounded-full text-xs border ${legend.color}`}>
                {legend.level}: {legend.label}
              </span>
            ))}
          </div>

          {/* Conditions Accordion */}
          <div className="space-y-4">
            {conditions.map((condition) => (
              <Card key={condition.name} className="overflow-hidden">
                <button
                  onClick={() => setExpandedCondition(expandedCondition === condition.name ? null : condition.name)}
                  className="w-full p-6 text-left hover:bg-surface-primary/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold flex items-center gap-2">
                        <span>{expandedCondition === condition.name ? '▼' : '▶'}</span>
                        {condition.name}
                      </h3>
                      <p className="text-text-secondary text-sm mt-1">{condition.description}</p>
                    </div>
                    <span className="text-sm text-text-muted">
                      {condition.interventions.length} interventions
                    </span>
                  </div>
                </button>

                {expandedCondition === condition.name && (
                  <div className="border-t border-neutral-800 p-6 space-y-4">
                    {/* Primary Interventions */}
                    <div>
                      <h4 className="font-semibold text-emerald-400 mb-3">Primary Interventions</h4>
                      <div className="grid gap-3">
                        {condition.interventions.filter(i => i.evidence === 'STRONG' || i.category === 'Primary').slice(0, 3).map((intervention) => (
                          <div key={intervention.name} className="bg-surface-primary rounded-lg p-4">
                            <div className="flex items-start justify-between mb-2">
                              <h5 className="font-medium">{intervention.name}</h5>
                              <span className={`px-2 py-0.5 rounded text-xs border ${evidenceLevelColors[intervention.evidence]}`}>
                                {intervention.evidence}
                              </span>
                            </div>
                            <p className="text-sm text-text-muted mb-2">{intervention.description || intervention.mechanism}</p>
                            <div className="flex flex-wrap gap-2 text-sm">
                              <span className="bg-accent-primary/20 text-accent-primary px-2 py-0.5 rounded">
                                {intervention.dosage}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* All Interventions */}
                    <div>
                      <button
                        onClick={() => setExpandedIntervention(expandedIntervention === condition.name ? null : condition.name)}
                        className="text-sm text-accent-primary hover:underline flex items-center gap-1"
                      >
                        {expandedIntervention === condition.name ? '▼ Hide details' : '▶ Show all interventions'}
                      </button>

                      {expandedIntervention === condition.name && (
                        <div className="mt-4 grid md:grid-cols-2 gap-4">
                          {condition.interventions.map((intervention) => (
                            <div key={intervention.name} className="bg-surface-primary/50 rounded-lg p-4">
                              <div className="flex items-start justify-between mb-2">
                                <h5 className="font-medium">{intervention.name}</h5>
                                <span className={`px-2 py-0.5 rounded text-xs border ${evidenceLevelColors[intervention.evidence]}`}>
                                  {intervention.evidence}
                                </span>
                              </div>
                              <p className="text-sm text-text-muted mb-2">{intervention.mechanism}</p>
                              <div className="flex flex-wrap gap-1">
                                <span className="bg-accent-primary/20 text-accent-primary px-2 py-0.5 rounded text-xs">
                                  {intervention.dosage}
                                </span>
                                <span className="bg-neutral-700 px-2 py-0.5 rounded text-xs text-neutral-300">
                                  {intervention.category}
                                </span>
                                {intervention.notes && (
                                  <span className="text-xs text-amber-400">⚠ {intervention.notes}</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Disclaimer */}
                    <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <p className="text-sm text-red-400">
                        ⚠️ <strong>Important:</strong> This is educational information only. 
                        Always consult a healthcare provider before starting any new supplement regimen, 
                        especially if taking medications or having underlying health conditions.
                      </p>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </>
      )}

      {/* ELEMENTS TAB */}
      {activeTab === 'elements' && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {elements.map((element) => (
            <Card key={element.name} className="p-6 text-center">
              <span className="text-4xl mb-4 block">
                {element.name === 'Fire' && '🔥'}
                {element.name === 'Water' && '💧'}
                {element.name === 'Air' && '💨'}
                {element.name === 'Earth' && '🌍'}
                {element.name === 'Ether' && '✨'}
              </span>
              <h4 className="font-semibold text-lg">{element.name}</h4>
              <p className="text-xs text-text-muted mb-2">{element.qualities}</p>
              <p className="text-sm text-accent-primary mb-4">{element.purpose}</p>
              <div className="text-xs text-text-secondary space-y-2 text-left">
                {element.practices.map(p => (
                  <p key={p}>• {p}</p>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="mt-12 pt-8 border-t border-neutral-800">
        <p className="text-sm text-text-muted text-center">
          🌿 Evidence graded from clinical trials and systematic reviews (2024-2025)
        </p>
      </div>
    </div>
  )
}
