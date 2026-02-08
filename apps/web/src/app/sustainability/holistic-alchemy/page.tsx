"""
Holistic Alchemy Page - Organic OS

Sustainability and environmental impact tracking module.
"""

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface SustainabilityData {
  carbon_footprint: {
    monthly_kg: number;
    trend: string;
    previous_month: number;
    target: number;
  };
  energy_efficiency: {
    score: number;
    category: string;
  };
  waste_reduction: {
    weekly_kg: number;
    recycling_rate: number;
  };
  eco_score: {
    current: number;
    grade: string;
  };
}

export default function HolisticAlchemyPage() {
  const [data, setData] = useState<SustainabilityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('impact');

  useEffect(() => {
    fetchSustainabilityData();
  }, []);

  const fetchSustainabilityData = async () => {
    try {
      const response = await fetch('/api/v1/sustainability/impact');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Failed to fetch sustainability data:', error);
      // Use mock data for development
      setData({
        carbon_footprint: { monthly_kg: 245.5, trend: 'decreasing', previous_month: 278.2, target: 200.0 },
        energy_efficiency: { score: 72, category: 'Good' },
        waste_reduction: { weekly_kg: 12.3, recycling_rate: 0.68 },
        eco_score: { current: 78, grade: 'B+' }
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 to-teal-800 flex items-center justify-center">
        <div className="text-white text-xl">Loading sustainability data...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 to-teal-800 flex items-center justify-center">
        <div className="text-white text-xl">Failed to load data</div>
      </div>
    );
  }

  const carbonChange = ((data.carbon_footprint.monthly_kg - data.carbon_footprint.previous_month) / data.carbon_footprint.previous_month * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 to-teal-800">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">🌿 Holistic Alchemy</h1>
              <p className="text-emerald-200">Sustainability & Environmental Impact</p>
            </div>
            <Link href="/sustainability" className="text-white/80 hover:text-white">
              ← Back to Sustainability
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Eco Score Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-white text-lg mb-2">Your Eco Score</h2>
              <div className="flex items-baseline gap-4">
                <span className="text-6xl font-bold text-emerald-400">{data.eco_score.current}</span>
                <span className="text-3xl text-emerald-300">{data.eco_score.grade}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-emerald-300 text-sm mb-1">Carbon Trend</div>
              <div className={`text-2xl font-bold ${data.carbon_footprint.trend === 'decreasing' ? 'text-green-400' : 'text-red-400'}`}>
                {carbonChange}%
              </div>
              <div className="text-white/60 text-sm">vs last month</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          {['impact', 'goals', 'habitats', 'track'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === tab
                  ? 'bg-emerald-500 text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'impact' && (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-white text-lg mb-4">Carbon Footprint</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-white/70 text-sm mb-1">
                    <span>This Month</span>
                    <span>{data.carbon_footprint.monthly_kg} kg CO₂</span>
                  </div>
                  <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-yellow-400 to-red-500"
                      style={{ width: `${Math.min(100, (data.carbon_footprint.monthly_kg / data.carbon_footprint.target) * 100)}%` }}
                    />
                  </div>
                </div>
                <div className="text-white/60 text-sm">
                  Target: {data.carbon_footprint.target} kg CO₂/month
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-white text-lg mb-4">Energy Efficiency</h3>
              <div className="text-center">
                <div className="text-5xl font-bold text-yellow-400 mb-2">{data.energy_efficiency.score}</div>
                <div className="text-emerald-300">{data.energy_efficiency.category}</div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-white text-lg mb-4">Waste Reduction</h3>
              <div className="text-center">
                <div className="text-5xl font-bold text-blue-400 mb-2">{data.waste_reduction.recycling_rate * 100}%</div>
                <div className="text-white/60">Recycling Rate</div>
                <div className="text-white/40 text-sm mt-2">{data.waste_reduction.weekly_kg} kg/week</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'goals' && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h3 className="text-white text-lg mb-6">Your Eco Goals</h3>
            <div className="space-y-4">
              {[
                { title: 'Reduce monthly carbon by 20%', progress: 35, deadline: 'Mar 1, 2026' },
                { title: 'Achieve zero waste week', progress: 80, deadline: 'Feb 15, 2026' },
                { title: 'Convert to 100% renewable energy', progress: 25, deadline: 'Jun 1, 2026' }
              ].map((goal, i) => (
                <div key={i} className="bg-white/5 rounded-lg p-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-white">{goal.title}</span>
                    <span className="text-white/60">{goal.deadline}</span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'habitats' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'Home', icon: '🏠', health: 75 },
              { name: 'Workplace', icon: '💼', health: 62 },
              { name: 'Community', icon: '🌳', health: 48 },
              { name: 'Transport', icon: '🚲', health: 70 }
            ].map((habitat) => (
              <div key={habitat.name} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center">
                <div className="text-4xl mb-4">{habitat.icon}</div>
                <h3 className="text-white font-medium mb-2">{habitat.name}</h3>
                <div className="text-3xl font-bold text-emerald-400">{habitat.health}</div>
                <div className="text-white/60 text-sm">Health Score</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'track' && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h3 className="text-white text-lg mb-6">Track Eco Actions</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                { type: 'transit', icon: '🚲', label: 'Transit' },
                { type: 'energy', icon: '⚡', label: 'Energy' },
                { type: 'food', icon: '🥗', label: 'Food' },
                { type: 'shopping', icon: '🛒', label: 'Shopping' },
                { type: 'waste', icon: '♻️', label: 'Waste' }
              ].map((action) => (
                <button
                  key={action.type}
                  className="bg-white/5 hover:bg-white/20 rounded-lg p-4 transition-all"
                >
                  <div className="text-3xl mb-2">{action.icon}</div>
                  <div className="text-white text-sm">{action.label}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
