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

export default function AtomEconomyPage() {
  const [reaction, setReaction] = useState<Reaction>({
    id: '1',
    name: 'Sample Reaction',
    reactants: [
      { formula: 'C3H6', mass: 42 },
      { formula: 'H2O', mass: 18 },
    ],
    products: [
      { formula: 'C3H6O', mass: 58 },
      { formula: 'H2', mass: 2 },
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

  const atomEconomy = calculateAtomEconomy();

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

  const calculateExampleAE = (rxn: Reaction) => {
    const desiredMass = rxn.products.find(p => p.formula === rxn.desiredProduct)?.mass || 0;
    const totalMass = rxn.products.reduce((sum, p) => sum + p.mass, 0);
    return ((desiredMass / totalMass) * 100).toFixed(1);
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
            ⚗️ Atom Economy Calculator
          </h1>
          <p className="mt-2 text-neutral-600 dark:text-neutral-400">
            Green chemistry metric for measuring reaction efficiency.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Calculator */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">
              Calculate Atom Economy
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
              Atom Economy = (MW of Desired Product ÷ Σ MW of All Products) × 100
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Desired Product Mass (g)
                </label>
                <input
                  type="number"
                  value={customReaction.desiredProductMass}
                  onChange={(e) =>
                    setCustomReaction({ ...customReaction, desiredProductMass: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                  placeholder="58"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Total Mass of All Products (g)
                </label>
                <input
                  type="number"
                  value={customReaction.totalProductMass}
                  onChange={(e) =>
                    setCustomReaction({ ...customReaction, totalProductMass: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                  placeholder="60"
                />
              </div>
            </div>

            <div className="mt-6 p-4 bg-emerald-100 dark:bg-emerald-900 rounded-lg">
              <p className="text-sm text-emerald-800 dark:text-emerald-200">
                Atom Economy
              </p>
              <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                {atomEconomy.toFixed(1)}%
              </p>
            </div>

            <div className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
              {atomEconomy >= 80 && '⭐ Excellent - High efficiency!'}
              {atomEconomy >= 60 && atomEconomy < 80 && '✓ Good - Moderate efficiency'}
              {atomEconomy >= 40 && atomEconomy < 60 && '⚠ Fair - Room for improvement'}
              {atomEconomy > 0 && atomEconomy < 40 && '❌ Poor - Consider alternative routes'}
            </div>
          </Card>

          {/* Example Reactions */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">
              Example Reactions
            </h2>
            <div className="space-y-4">
              {exampleReactions.map((rxn) => (
                <div
                  key={rxn.id}
                  className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-neutral-900 dark:text-white">
                      {rxn.name}
                    </h3>
                    <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                      {calculateExampleAE(rxn)}%
                    </span>
                  </div>
                  <div className="text-sm text-neutral-600 dark:text-neutral-400">
                    <p>Reactants: {rxn.reactants.map((r) => r.formula).join(' + ')}</p>
                    <p>Products: {rxn.products.map((p) => p.formula).join(' + ')}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Learn More */}
          <Card className="p-6 md:col-span-2">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">
              About Atom Economy
            </h2>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-neutral-600 dark:text-neutral-400">
                Atom economy is a fundamental principle of green chemistry that measures the
                efficiency of a chemical reaction in terms of atoms utilized. Higher atom
                economy means less waste is generated.
              </p>
              <ul className="mt-4 space-y-2 text-neutral-600 dark:text-neutral-400">
                <li>• <strong>Addition reactions</strong> typically have 100% atom economy</li>
                <li>• <strong>Substitution reactions</strong> vary widely based on leaving groups</li>
                <li>• <strong>Elimination reactions</strong> produce byproducts, reducing economy</li>
              </ul>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
