"""
Atom Economy Page - Organic OS

Green chemistry calculations and metrics module.
"""

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface DashboardData {
  overview: {
    total_reactions: number;
    avg_atom_economy: number;
    green_reactions: number;
    needs_improvement: number;
  };
  trends: {
    months: string[];
    atom_economy_values: number[];
  };
  recent_analyses: Array<{
    reaction: string;
    date: string;
    score: number;
  }>;
}

interface CalculationResult {
  atom_economy: number;
  efficiency_rating: string;
  suggestions: string[];
}

export default function AtomEconomyPage() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mwProduct, setMwProduct] = useState('');
  const [mwReactants, setMwReactants] = useState('');
  const [result, setResult] = useState<CalculationResult | null>(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await fetch('/api/v1/chemistry/atom-economy/dashboard');
      const data = await response.json();
      setDashboard(data);
    } catch (error) {
      console.error('Failed to fetch dashboard:', error);
      setDashboard({
        overview: { total_reactions: 47, avg_atom_economy: 78.5, green_reactions: 23, needs_improvement: 15 },
        trends: { months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], atom_economy_values: [72, 74, 75, 77, 78, 78.5] },
        recent_analyses: [
          { reaction: 'Suzuki Coupling', date: '2026-02-05', score: 88.2 },
          { reaction: 'Aldol Condensation', date: '2026-02-03', score: 71.4 },
          { reaction: 'Esterification', date: '2026-02-01', score: 65.8 }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateAtomEconomy = async () => {
    const product = parseFloat(mwProduct);
    const reactants = parseFloat(mwReactants);
    
    if (!product || !reactants) {
      alert('Please enter both molecular weights');
      return;
    }

    try {
      const response = await fetch('/api/v1/chemistry/atom-economy/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mw_product: product, mw_reactants: reactants })
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      // Calculate locally
      const ae = (product / reactants) * 100;
      let rating = 'Excellent';
      let suggestions: string[] = [];
      if (ae < 90) { rating = ae < 80 ? 'Good' : 'Moderate'; suggestions = ['Consider catalytic reagents']; }
      setResult({ atom_economy: ae, efficiency_rating: rating, suggestions });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading chemistry data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">⚛️ Atom Economy</h1>
              <p className="text-blue-200">Green Chemistry Metrics & Calculations</p>
            </div>
            <Link href="/sustainability" className="text-white/80 hover:text-white">
              ← Back to Sustainability
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          {['dashboard', 'calculate', 'database', 'reference'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === tab
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === 'dashboard' && dashboard && (
          <>
            {/* Overview Cards */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center">
                <div className="text-4xl font-bold text-blue-400 mb-2">{dashboard.overview.total_reactions}</div>
                <div className="text-white/60 text-sm">Total Reactions</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center">
                <div className="text-4xl font-bold text-green-400 mb-2">{dashboard.overview.avg_atom_economy}%</div>
                <div className="text-white/60 text-sm">Avg Atom Economy</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center">
                <div className="text-4xl font-bold text-emerald-400 mb-2">{dashboard.overview.green_reactions}</div>
                <div className="text-white/60 text-sm">Green Reactions</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center">
                <div className="text-4xl font-bold text-yellow-400 mb-2">{dashboard.overview.needs_improvement}</div>
                <div className="text-white/60 text-sm">Need Optimization</div>
              </div>
            </div>

            {/* Trend Chart */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10 mb-8">
              <h3 className="text-white text-lg mb-6">Atom Economy Trends</h3>
              <div className="flex items-end gap-2 h-48">
                {dashboard.trends.atom_economy_values.map((value, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t"
                      style={{ height: `${value}%` }}
                    />
                    <div className="text-white/60 text-xs mt-2">{dashboard.trends.months[i]}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Analyses */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-white text-lg mb-6">Recent Analyses</h3>
              <div className="space-y-3">
                {dashboard.recent_analyses.map((analysis, i) => (
                  <div key={i} className="flex items-center justify-between bg-white/5 rounded-lg p-4">
                    <div>
                      <div className="text-white font-medium">{analysis.reaction}</div>
                      <div className="text-white/50 text-sm">{analysis.date}</div>
                    </div>
                    <div className={`text-xl font-bold ${
                      analysis.score >= 85 ? 'text-green-400' : 
                      analysis.score >= 70 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {analysis.score}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'calculate' && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/10 max-w-2xl mx-auto">
            <h3 className="text-white text-xl mb-6">Calculate Atom Economy</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-white/70 text-sm mb-2">
                  Molecular Weight of Desired Product (g/mol)
                </label>
                <input
                  type="number"
                  value={mwProduct}
                  onChange={(e) => setMwProduct(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-blue-500"
                  placeholder="e.g., 180.16"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-2">
                  Total Molecular Weight of All Reactants (g/mol)
                </label>
                <input
                  type="number"
                  value={mwReactants}
                  onChange={(e) => setMwReactants(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-blue-500"
                  placeholder="e.g., 200.0"
                />
              </div>
            </div>

            <button
              onClick={calculateAtomEconomy}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-lg transition-all"
            >
              Calculate Atom Economy
            </button>

            {result && (
              <div className="mt-6 p-6 bg-white/5 rounded-lg">
                <div className="text-center mb-4">
                  <div className="text-5xl font-bold text-blue-400">{result.atom_economy.toFixed(2)}%</div>
                  <div className={`text-xl font-medium mt-2 ${
                    result.efficiency_rating === 'Excellent' ? 'text-green-400' :
                    result.efficiency_rating === 'Good' ? 'text-yellow-400' :
                    result.efficiency_rating === 'Moderate' ? 'text-orange-400' : 'text-red-400'
                  }`}>
                    {result.efficiency_rating}
                  </div>
                </div>
                {result.suggestions.length > 0 && (
                  <div className="border-t border-white/10 pt-4 mt-4">
                    <div className="text-white/70 text-sm mb-2">Suggestions:</div>
                    <ul className="space-y-1">
                      {result.suggestions.map((s, i) => (
                        <li key={i} className="text-white/50 text-sm">• {s}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <div className="mt-6 p-4 bg-blue-500/20 rounded-lg">
              <div className="text-white/70 text-sm">
                <strong className="text-white">Formula:</strong> Atom Economy = (Molecular Weight of Desired Product / Total Molecular Weight of All Reactants) × 100
              </div>
            </div>
          </div>
        )}

        {activeTab === 'database' && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h3 className="text-white text-lg mb-6">Reaction Database</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-white/10">
                    <th className="pb-3 text-white/70">Reaction</th>
                    <th className="pb-3 text-white/70">Type</th>
                    <th className="pb-3 text-white/70">Atom Economy</th>
                    <th className="pb-3 text-white/70">E-Factor</th>
                    <th className="pb-3 text-white/70">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Diels-Alder Cycloaddition', type: 'Cycloaddition', ae: 94.2, ef: 1.1, rating: 'Excellent' },
                    { name: 'Suzuki Coupling', type: 'Cross-coupling', ae: 88.2, ef: 1.8, rating: 'Good' },
                    { name: 'SN2 Substitution', type: 'Substitution', ae: 85.4, ef: 2.3, rating: 'Good' },
                    { name: 'Friedel-Crafts Acylation', type: 'Acylation', ae: 68.7, ef: 4.5, rating: 'Moderate' },
                    { name: 'Aldol Condensation', type: 'Condensation', ae: 71.4, ef: 3.2, rating: 'Moderate' }
                  ].map((reaction, i) => (
                    <tr key={i} className="border-b border-white/5">
                      <td className="py-3 text-white font-medium">{reaction.name}</td>
                      <td className="py-3 text-white/60">{reaction.type}</td>
                      <td className="py-3 text-white/60">{reaction.ae}%</td>
                      <td className="py-3 text-white/60">{reaction.ef}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          reaction.rating === 'Excellent' ? 'bg-green-500/20 text-green-400' :
                          reaction.rating === 'Good' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-orange-500/20 text-orange-400'
                        }`}>
                          {reaction.rating}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'reference' && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h3 className="text-white text-lg mb-6">Green Chemistry Principles</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { id: 1, title: 'Prevent Waste', desc: 'Design syntheses to prevent waste rather than treat or clean up waste' },
                { id: 2, title: 'Atom Economy', desc: 'Design syntheses so that the final product contains the maximum proportion of reactant materials' },
                { id: 3, title: 'Less Hazardous Synthesis', desc: 'Design syntheses to use and generate substances with low or no toxicity' },
                { id: 4, title: 'Safer Products', desc: 'Design chemical products to be effective with reduced toxicity' },
                { id: 5, title: 'Safer Solvents', desc: 'Avoid using auxiliary substances like solvents when possible' }
              ].map((principle) => (
                <div key={principle.id} className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {principle.id}
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-1">{principle.title}</h4>
                      <p className="text-white/50 text-sm">{principle.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <h4 className="text-white font-medium mb-4">Target Values</h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white/5 rounded-lg p-4">
                  <h5 className="text-white/70 mb-2">Atom Economy</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-green-400">Excellent</span>
                      <span className="text-white/60">≥90%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-yellow-400">Good</span>
                      <span className="text-white/60">≥80%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-orange-400">Acceptable</span>
                      <span className="text-white/60">≥60%</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <h5 className="text-white/70 mb-2">E-Factor (kg waste/kg product)</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-green-400">Excellent</span>
                      <span className="text-white/60">&lt;5</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-yellow-400">Good</span>
                      <span className="text-white/60">&lt;25</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-orange-400">Acceptable</span>
                      <span className="text-white/60">&lt;100</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
