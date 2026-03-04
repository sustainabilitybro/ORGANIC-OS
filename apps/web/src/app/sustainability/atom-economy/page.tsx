'use client';

import { useState } from 'react';
import { Card } from '@/components/design-system';

interface Reaction {
  id: string;
  name: string;
  reactants: { formula: string; mass: number }[];
  products: { formula: string; mass: number }[];
  desiredProduct: string;
}

interface GreenChemistryPrinciple {
  id: string;
  title: string;
  description: string;
  example: string;
}

const greenChemistryPrinciples: GreenChemistryPrinciple[] = [
  {
    id: '1',
    title: 'Atom Economy',
    description: 'Maximize incorporation of all materials into the final product',
    example: 'Addition reactions (AE=100%) vs substitutions (AE<100%)'
  },
  {
    id: '2',
    title: 'E-Factor',
    description: 'Reduce waste - E = kg waste / kg product',
    example: 'Ibuprofen: E=2 (green route) vs E=25 (old route)'
  },
  {
    id: '3',
    title: 'Reaction Mass Efficiency',
    description: 'RME = (Product Mass / Total Reactant Mass) × Yield × AE',
    example: '80% AE × 90% yield = 72% RME'
  },
  {
    id: '4',
    title: 'Process Mass Intensity',
    description: 'PMI = Total Mass / Product Mass. Lower is better.',
    example: 'If PMI=5, need 5kg materials for 1kg product'
  },
  {
    id: '5',
    title: 'Renewable Feedstocks',
    description: 'Use bio-based materials instead of petroleum',
    example: 'Bio-based route >90% vs petroleum <50%'
  },
  {
    id: '6',
    title: 'Safer Solvents',
    description: 'Use water or benign solvents over organic solvents',
    example: 'Water-based processes vs organic solvents'
  }
];

const caseStudies = [
  {
    name: 'Ibuprofen',
    beforeAE: '40%',
    afterAE: '77%',
    description: 'Switched to catalytic route eliminating 7 stoichiometric steps'
  },
  {
    name: 'Sitagliptin',
    beforeSteps: '8 steps',
    afterSteps: '2 steps',
    description: 'Biocatalytic route eliminated protection/deprotection steps'
  },
  {
    name: 'Adiponitrile',
    description: 'Electrochemical synthesis reduced waste by 60%'
  }
];

export default function AtomEconomyPage() {
  const [activeTab, setActiveTab] = useState<'calculator' | 'examples' | 'principles' | 'casestudies'>('calculator');
  const [reaction, setReaction] = useState<Reaction>({
    id: '1',
    name: 'Propylene Oxidation',
    reactants: [
      { formula: 'C3H6', mass: 42 },
      { formula: 'O2', mass: 32 },
    ],
    products: [
      { formula: 'C3H6O', mass: 58 },
      { formula: 'H2O', mass: 18 },
    ],
    desiredProduct: 'C3H6O',
  });

  const [customReaction, setCustomReaction] = useState({
    reactant1: '',
    reactant1Mass: '',
    reactant2: '',
    reactant2Mass: '',
    desiredProductMass: '',
    totalProductMass: '',
  });

  const calculateAtomEconomy = () => {
    const desiredMass = parseFloat(customReaction.desiredProductMass) || 0;
    const totalMass = parseFloat(customReaction.totalProductMass) || 0;
    if (totalMass === 0) return 0;
    return (desiredMass / totalMass) * 100;
  };

  const calculateRME = () => {
    const ae = calculateAtomEconomy();
    const yieldPercent = 90; // Default assumption
    return (ae * yieldPercent) / 100;
  };

  const calculateE_Factor = () => {
    const rme = calculateRME();
    if (rme === 0) return 0;
    return (1 - rme) / rme;
  };

  const atomEconomy = calculateAtomEconomy();
  const rme = calculateRME();
  const eFactor = calculateE_Factor();

  const getRating = (ae: number) => {
    if (ae >= 90) return { label: 'Excellent', color: 'text-green-400' };
    if (ae >= 70) return { label: 'Good', color: 'text-blue-400' };
    if (ae >= 50) return { label: 'Moderate', color: 'text-yellow-400' };
    return { label: 'Needs Improvement', color: 'text-red-400' };
  };

  const exampleReactions: Reaction[] = [
    {
      id: '1',
      name: 'Propylene Oxidation',
      reactants: [
        { formula: 'C3H6', mass: 42 },
        { formula: 'O2', mass: 32 },
      ],
      products: [
        { formula: 'C3H6O', mass: 58 },
        { formula: 'H2O', mass: 18 },
      ],
      desiredProduct: 'C3H6O',
    },
    {
      id: '2',
      name: 'Epoxidation',
      reactants: [
        { formula: 'C2H4', mass: 28 },
        { formula: 'O3', mass: 48 },
      ],
      products: [
        { formula: 'C2H4O', mass: 44 },
        { formula: 'O2', mass: 32 },
      ],
      desiredProduct: 'C2H4O',
    },
    {
      id: '3',
      name: 'Hydrogenation',
      reactants: [
        { formula: 'C2H4', mass: 28 },
        { formula: 'H2', mass: 2 },
      ],
      products: [
        { formula: 'C2H6', mass: 30 },
      ],
      desiredProduct: 'C2H6',
    },
  ];

  const getAtomEconomyForExample = (rxn: Reaction) => {
    const desiredMass = rxn.products.find(p => p.formula === rxn.desiredProduct)?.mass || 0;
    const totalMass = rxn.products.reduce((sum, p) => sum + p.mass, 0);
    return totalMass > 0 ? ((desiredMass / totalMass) * 100).toFixed(1) : '0';
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">⚛️ Atom Economy Calculator</h1>
          <p className="text-neutral-400">
            Green chemistry metric for sustainable chemical processes
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {(['calculator', 'examples', 'principles', 'casestudies'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-emerald-600 text-white'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              }`}
            >
              {tab === 'calculator' && '🧮 Calculator'}
              {tab === 'examples' && '📚 Examples'}
              {tab === 'principles' && '📖 Principles'}
              {tab === 'casestudies' && '🏭 Case Studies'}
            </button>
          ))}
        </div>

        {activeTab === 'calculator' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Custom Calculator */}
            <Card className="bg-neutral-900 border border-neutral-800">
              <h2 className="text-xl font-bold mb-4">Custom Reaction Calculator</h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-neutral-400 mb-1">Reactant 1</label>
                    <input
                      type="text"
                      placeholder="Formula (e.g., C3H6)"
                      className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white"
                      value={customReaction.reactant1}
                      onChange={(e) => setCustomReaction({...customReaction, reactant1: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-neutral-400 mb-1">Mass (g/mol)</label>
                    <input
                      type="number"
                      placeholder="Molecular weight"
                      className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white"
                      value={customReaction.reactant1Mass}
                      onChange={(e) => setCustomReaction({...customReaction, reactant1Mass: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-neutral-400 mb-1">Reactant 2</label>
                    <input
                      type="text"
                      placeholder="Formula (e.g., O2)"
                      className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white"
                      value={customReaction.reactant2}
                      onChange={(e) => setCustomReaction({...customReaction, reactant2: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-neutral-400 mb-1">Mass (g/mol)</label>
                    <input
                      type="number"
                      placeholder="Molecular weight"
                      className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white"
                      value={customReaction.reactant2Mass}
                      onChange={(e) => setCustomReaction({...customReaction, reactant2Mass: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-neutral-400 mb-1">Desired Product Mass</label>
                    <input
                      type="number"
                      placeholder="Mass of desired product"
                      className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white"
                      value={customReaction.desiredProductMass}
                      onChange={(e) => setCustomReaction({...customReaction, desiredProductMass: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-neutral-400 mb-1">Total Product Mass</label>
                    <input
                      type="number"
                      placeholder="Total mass of all products"
                      className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white"
                      value={customReaction.totalProductMass}
                      onChange={(e) => setCustomReaction({...customReaction, totalProductMass: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* Results */}
              <div className="mt-6 p-4 bg-neutral-800 rounded-lg border border-emerald-500/30">
                <h3 className="text-lg font-semibold mb-3">Results</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Atom Economy:</span>
                    <span className={`font-bold ${atomEconomy >= 90 ? 'text-green-400' : atomEconomy >= 70 ? 'text-blue-400' : atomEconomy >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {atomEconomy.toFixed(1)}%
                    </span>
                  </div>
                  {atomEconomy > 0 && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Rating:</span>
                        <span className={getRating(atomEconomy).color}>{getRating(atomEconomy).label}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Est. RME (90% yield):</span>
                        <span className="text-white">{(rme * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">E-Factor:</span>
                        <span className="text-white">{eFactor.toFixed(2)}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </Card>

            {/* Info Panel */}
            <Card className="bg-neutral-900 border border-neutral-800">
              <h2 className="text-xl font-bold mb-4">Understanding Atom Economy</h2>
              
              <div className="space-y-4">
                <div className="p-4 bg-neutral-800 rounded-lg">
                  <h3 className="font-semibold text-emerald-400 mb-2">What is Atom Economy?</h3>
                  <p className="text-neutral-300 text-sm">
                    Atom economy measures the incorporation of all reactants into the final product. 
                    Higher values mean less waste is generated in the reaction.
                  </p>
                </div>

                <div className="p-4 bg-neutral-800 rounded-lg">
                  <h3 className="font-semibold text-emerald-400 mb-2">Formula</h3>
                  <p className="text-neutral-300 text-sm font-mono">
                    AE = (MW of Desired Product / Σ MW of All Products) × 100%
                  </p>
                </div>

                <div className="p-4 bg-neutral-800 rounded-lg">
                  <h3 className="font-semibold text-emerald-400 mb-2">Rating Scale</h3>
                  <ul className="text-sm space-y-1 text-neutral-300">
                    <li><span className="text-green-400">●</span> ≥90%: Excellent - Ideal for green chemistry</li>
                    <li><span className="text-blue-400">●</span> 70-89%: Good - Preferable for sustainable processes</li>
                    <li><span className="text-yellow-400">●</span> 50-69%: Moderate - Room for improvement</li>
                    <li><span className="text-red-400">●</span> &lt;50%: Needs improvement - Consider alternative routes</li>
                  </ul>
                </div>

                <div className="p-4 bg-neutral-800 rounded-lg">
                  <h3 className="font-semibold text-emerald-400 mb-2">Related Metrics</h3>
                  <ul className="text-sm space-y-1 text-neutral-300">
                    <li><strong>E-Factor:</strong> kg waste / kg product (lower is better)</li>
                    <li><strong>RME:</strong> Reaction Mass Efficiency (higher is better)</li>
                    <li><strong>PMI:</strong> Process Mass Intensity (lower is better)</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'examples' && (
          <Card className="bg-neutral-900 border border-neutral-800">
            <h2 className="text-xl font-bold mb-4">Example Reactions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {exampleReactions.map((rxn) => (
                <div key={rxn.id} className="p-4 bg-neutral-800 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-emerald-400">{rxn.name}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      parseFloat(getAtomEconomyForExample(rxn)) >= 90 ? 'bg-green-900 text-green-300' :
                      parseFloat(getAtomEconomyForExample(rxn)) >= 70 ? 'bg-blue-900 text-blue-300' :
                      'bg-yellow-900 text-yellow-300'
                    }`}>
                      {getAtomEconomyForExample(rxn)}% AE
                    </span>
                  </div>
                  <div className="text-sm text-neutral-400 mb-2">
                    <p>Reactants: {rxn.reactants.map(r => `${r.formula} (${r.mass}g)`).join(' + ')}</p>
                    <p>Products: {rxn.products.map(p => `${p.formula} (${p.mass}g)`).join(' + ')}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {activeTab === 'principles' && (
          <Card className="bg-neutral-900 border border-neutral-800">
            <h2 className="text-xl font-bold mb-4">Green Chemistry Principles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {greenChemistryPrinciples.map((principle) => (
                <div key={principle.id} className="p-4 bg-neutral-800 rounded-lg border-l-4 border-emerald-500">
                  <h3 className="font-semibold text-emerald-400 mb-2">{principle.title}</h3>
                  <p className="text-neutral-300 text-sm mb-2">{principle.description}</p>
                  <p className="text-neutral-500 text-xs italic">💡 {principle.example}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {activeTab === 'casestudies' && (
          <Card className="bg-neutral-900 border border-neutral-800">
            <h2 className="text-xl font-bold mb-4">Industrial Case Studies</h2>
            <div className="space-y-4">
              {caseStudies.map((study, idx) => (
                <div key={idx} className="p-4 bg-neutral-800 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-emerald-400">{study.name}</h3>
                    {study.beforeAE && study.afterAE && (
                      <span className="text-green-400 font-bold">
                        {study.beforeAE} → {study.afterAE}
                      </span>
                    )}
                    {study.beforeSteps && study.afterSteps && (
                      <span className="text-green-400 font-bold">
                        {study.beforeSteps} → {study.afterSteps}
                      </span>
                    )}
                  </div>
                  <p className="text-neutral-300 text-sm">{study.description}</p>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
