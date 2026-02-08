'use client'

import { useState } from 'react'
import { Card, Button, Spinner } from '@organic-os/ui'

// Atom Economy - Optimizing resource efficiency
interface AtomProcess {
  name: string
  formula: string
  efficiency: number
  category: string
  description: string
  applications: string[]
}

const atomProcesses: AtomProcess[] = [
  {
    name: 'Solvay Process',
    formula: 'NaCl + NH₃ + CO₂ + H₂O → NaHCO₃ + NH₄Cl',
    efficiency: 75,
    category: 'Industrial',
    description: 'Producing sodium carbonate from salt and limestone',
    applications: ['Glass manufacturing', 'Soap production', 'Water treatment']
  },
  {
    name: 'Contact Process',
    formula: 'S + O₂ → SO₂ → SO₃ → H₂SO₄',
    efficiency: 98,
    category: 'Industrial',
    description: 'Sulfuric acid production with catalytic oxidation',
    applications: ['Fertilizers', 'Petroleum refining', 'Chemical synthesis']
  },
  {
    name: 'Haber Process',
    formula: 'N₂ + 3H₂ → 2NH₃',
    efficiency: 15,
    category: 'Industrial',
    description: 'Nitrogen fixation to produce ammonia',
    applications: ['Fertilizers', 'Explosives', 'Refrigeration']
  },
  {
    name: 'Oxidation',
    formula: 'RH + O₂ → RCOOH',
    efficiency: 85,
    category: 'Organic',
    description: 'Adding oxygen to organic compounds',
    applications: ['Alcohol to acid', 'Aldehyde formation', 'Epoxidation']
  },
  {
    name: 'Reduction',
    formula: 'RNO₂ + 3H₂ → RNH₂ + 2H₂O',
    efficiency: 90,
    category: 'Organic',
    description: 'Adding hydrogen to organic compounds',
    applications: ['Nitro to amine', 'Aldehyde to alcohol', 'Desulfurization']
  },
  {
    name: 'Addition',
    formula: 'C=C + XY → CXY',
    efficiency: 100,
    category: 'Organic',
    description: 'Adding atoms across double bonds',
    applications: ['Hydrohalogenation', 'Hydration', 'Halogenation']
  },
  {
    name: 'Substitution',
    formula: 'R-X + Y⁻ → R-Y + X⁻',
    efficiency: 80,
    category: 'Organic',
    description: 'Replacing one group with another',
    applications: ['Nucleophilic substitution', 'Aromatic substitution', 'Esterification']
  },
  {
    name: 'Elimination',
    formula: 'R-CH₂-CH₂-X → C=C + HX',
    efficiency: 70,
    category: 'Organic',
    description: 'Removing small molecules to form double bonds',
    applications: ['Dehydration', 'Dehydrohalogenation', 'Cracking']
  }
]

const sustainabilityMetrics = [
  { name: 'Atom Economy', value: 85, description: 'Percentage of reactant atoms in final product' },
  { name: 'E-Factor', value: 3.2, description: 'kg waste per kg product' },
  { name: 'PMI', value: 4.2, description: 'Process Mass Intensity' },
  { name: 'Carbon Efficiency', value: 78, description: '% carbon used vs carbon in waste' }
]

const greenPrinciples = [
  { principle: 'Prevention', icon: '🛡️', description: 'It is better to prevent waste than to treat or clean up waste after it is formed.' },
  { principle: 'Atom Economy', icon: '⚛️', description: 'Synthetic methods should be designed to maximize the incorporation of all materials used in the process.' },
  { principle: 'Less Hazardous Synthesis', icon: '⚠️', description: 'Synthetic methods should be designed to use and generate substances with little or no toxicity.' },
  { principle: 'Safer Solvents', icon: '💧', description: 'Auxiliary substances should be made unnecessary wherever possible and innocuous when used.' },
  { principle: 'Energy Efficiency', icon: '⚡', description: 'Energy requirements should be recognized and minimized.' },
  { principle: 'Renewable Feedstocks', icon: '🌱', description: 'A raw material or feedstock should be renewable rather than depleting.' },
  { principle: 'Reduce Derivatives', icon: '🔄', description: 'Unnecessary derivatization should be minimized or avoided.' },
  { principle: 'Catalysis', icon: '🧲', description: 'Catalytic reagents are superior to stoichiometric reagents.' }
]

export default function AtomEconomyPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [hoveredProcess, setHoveredProcess] = useState<string | null>(null)

  const categories = ['All', ...new Set(atomProcesses.map(p => p.category))]
  const filteredProcesses = selectedCategory === 'All' 
    ? atomProcesses 
    : atomProcesses.filter(p => p.category === selectedCategory)

  const avgEfficiency = Math.round(
    filteredProcesses.reduce((sum, p) => sum + p.efficiency, 0) / filteredProcesses.length
  )

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-8">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-2">
          <span className="text-5xl">⚛️</span>
          <div>
            <h1 className="text-4xl font-display font-bold">Atom Economy</h1>
            <p className="text-text-secondary text-lg">
              Optimizing chemical processes for sustainability
            </p>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {sustainabilityMetrics.map((metric) => (
          <Card key={metric.name} className="p-4">
            <p className="text-2xl font-bold text-accent-primary">{metric.value}{metric.name === 'E-Factor' || metric.name === 'PMI' ? '' : '%'}</p>
            <p className="text-sm font-medium">{metric.name}</p>
            <p className="text-xs text-text-muted mt-1">{metric.description}</p>
          </Card>
        ))}
      </div>

      {/* Green Chemistry Principles */}
      <div className="mb-12">
        <h2 className="text-lg font-semibold mb-4 text-text-muted uppercase tracking-wider">
          12 Principles of Green Chemistry
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {greenPrinciples.map((principle) => (
            <Card key={principle.principle} className="p-4 hover:border-accent-primary/50 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{principle.icon}</span>
                <span className="font-semibold text-sm">{principle.principle}</span>
              </div>
              <p className="text-xs text-text-secondary">{principle.description}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                selectedCategory === cat
                  ? 'bg-accent-primary text-neutral-900'
                  : 'bg-surface-primary hover:bg-surface-secondary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Process Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {filteredProcesses.map((process) => (
          <Card 
            key={process.name} 
            className="p-6"
            onMouseEnter={() => setHoveredProcess(process.name)}
            onMouseLeave={() => setHoveredProcess(null)}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-lg">{process.name}</h3>
                <span className="text-xs px-2 py-1 bg-surface-secondary rounded-full">
                  {process.category}
                </span>
              </div>
              <div className={`text-2xl font-bold ${
                process.efficiency >= 90 ? 'text-emerald-400' :
                process.efficiency >= 70 ? 'text-amber-400' : 'text-rose-400'
              }`}>
                {process.efficiency}%
              </div>
            </div>
            
            <div className="bg-surface-primary p-3 rounded-lg mb-4 font-mono text-sm">
              {process.formula}
            </div>
            
            <p className="text-text-secondary text-sm mb-4">{process.description}</p>
            
            <div className="flex flex-wrap gap-2">
              {process.applications.map((app) => (
                <span 
                  key={app}
                  className={`text-xs px-2 py-1 rounded transition-all ${
                    hoveredProcess === process.name
                      ? 'bg-accent-primary/20 text-accent-primary'
                      : 'bg-surface-secondary text-text-muted'
                  }`}
                >
                  {app}
                </span>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Efficiency Summary */}
      <Card className="p-6 mb-12">
        <h3 className="font-semibold mb-4">Process Efficiency Analysis</h3>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="h-4 bg-surface-secondary rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all ${
                  avgEfficiency >= 85 ? 'bg-emerald-400' :
                  avgEfficiency >= 70 ? 'bg-amber-400' : 'bg-rose-400'
                }`}
                style={{ width: `${avgEfficiency}%` }}
              />
            </div>
          </div>
          <div className="text-xl font-bold">{avgEfficiency}%</div>
        </div>
        <p className="text-sm text-text-muted mt-2">
          Average atom economy for {selectedCategory === 'All' ? 'all' : selectedCategory} processes
        </p>
      </Card>

      {/* Learning Resources */}
      <div>
        <h3 className="font-semibold mb-4">Continue Learning</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a 
            href="https://pubs.acs.org/doi/10.1021/acs.jchemed.5b00422" 
            target="_blank"
            className="Card p-4 hover:bg-surface-primary transition-colors"
          >
            <h4 className="font-medium mb-2">📖 Atom Economy Tutorial</h4>
            <p className="text-sm text-text-secondary">
              ACS Journal of Chemical Education
            </p>
          </a>
          <a 
            href="https://www.epa.gov/greenchemistry" 
            target="_blank"
            className="Card p-4 hover:bg-surface-primary transition-colors"
          >
            <h4 className="font-medium mb-2">🌿 EPA Green Chemistry</h4>
            <p className="text-sm text-text-secondary">
              EPA's green chemistry program resources
            </p>
          </a>
          <a 
            href="https://www.chemistryworld.com/" 
            target="_blank"
            className="Card p-4 hover:bg-surface-primary transition-colors"
          >
            <h4 className="font-medium mb-2">🔬 Chemistry World</h4>
            <p className="text-sm text-text-secondary">
              Latest sustainable chemistry news
            </p>
          </a>
        </div>
      </div>
    </div>
  )
}
