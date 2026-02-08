// Organic OS - Sustainability Module
// Carbon Footprint, Energy & Resource Management

'use client';

import { useState } from 'react';

interface CarbonEntry {
  id: string;
  category: 'transport' | 'energy' | 'food' | 'consumption' | 'waste';
  activity: string;
  amount: number;
  unit: string;
  carbonKg: number;
  date: Date;
}

interface EnergyEntry {
  id: string;
  type: 'electricity' | 'gas' | 'water' | 'renewable';
  amount: number;
  unit: string;
  cost: number;
  carbonKg: number;
  date: Date;
}

const categories = [
  { id: 'transport', icon: '🚗', label: 'Transport', color: 'bg-red-500' },
  { id: 'energy', icon: '⚡', label: 'Energy', color: 'bg-yellow-500' },
  { id: 'food', icon: '🍎', label: 'Food', color: 'bg-green-500' },
  { id: 'consumption', icon: '🛒', label: 'Consumption', color: 'bg-blue-500' },
  { id: 'waste', icon: '🗑️', label: 'Waste', color: 'bg-orange-500' },
];

export default function SustainabilityPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'carbon' | 'energy' | 'goals' | 'insights'>('dashboard');
  const [carbonEntries, setCarbonEntries] = useState<CarbonEntry[]>([
    { id: '1', category: 'transport', activity: 'Car commute', amount: 25, unit: 'km', carbonKg: 5.2, date: new Date() },
    { id: '2', category: 'energy', activity: 'Home electricity', amount: 15, unit: 'kWh', carbonKg: 6.8, date: new Date() },
    { id: '3', category: 'food', activity: 'Meat-based meals', amount: 7, unit: 'meals', carbonKg: 14.0, date: new Date() },
  ]);
  const [energyEntries, setEnergyEntries] = useState<EnergyEntry[]>([
    { id: '1', type: 'electricity', amount: 350, unit: 'kWh', cost: 52.50, carbonKg: 157.5, date: new Date() },
    { id: '2', type: 'renewable', amount: 120, unit: 'kWh', cost: 18.00, carbonKg: 0, date: new Date() },
  ]);
  const [goals, setGoals] = useState([
    { id: '1', name: 'Reduce monthly carbon by 10%', progress: 65, target: '10%', current: '6.5%' },
    { id: '2', name: 'Increase renewable energy to 50%', progress: 40, target: '50%', current: '20%' },
    { id: '3', name: 'Zero waste week challenges', progress: 75, target: '100%', current: '3/4' },
  ]);

  const totalCarbon = carbonEntries.reduce((sum, e) => sum + e.carbonKg, 0);
  const totalEnergyCarbon = energyEntries.reduce((sum, e) => sum + e.carbonKg, 0);
  const total = totalCarbon + totalEnergyCarbon;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* Header */}
      <div className="border-b border-neutral-800 bg-neutral-900ur-sm sticky top/50 backdrop-bl-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🌱</span>
            <div>
              <h1 className="text-2xl font-bold">Sustainability</h1>
              <p className="text-sm text-neutral-400">Carbon footprint & eco-living</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: '📊' },
            { id: 'carbon', label: 'Carbon Tracker', icon: '🌍' },
            { id: 'energy', label: 'Energy', icon: '⚡' },
            { id: 'goals', label: 'Goals', icon: '🎯' },
            { id: 'insights', label: 'Insights', icon: '💡' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-emerald-600 text-white'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                <span className="text-2xl mb-2 block">🌍</span>
                <p className="text-3xl font-bold">{total.toFixed(1)}</p>
                <p className="text-sm text-neutral-400">kg CO₂ Total</p>
              </div>
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                <span className="text-2xl mb-2 block">🎯</span>
                <p className="text-3xl font-bold">{goals.length}</p>
                <p className="text-sm text-neutral-400">Active Goals</p>
              </div>
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                <span className="text-2xl mb-2 block">📉</span>
                <p className="text-3xl font-bold">-12%</p>
                <p className="text-sm text-neutral-400">vs Last Month</p>
              </div>
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                <span className="text-2xl mb-2 block">🌿</span>
                <p className="text-3xl font-bold">B</p>
                <p className="text-sm text-neutral-400">Eco Grade</p>
              </div>
            </div>

            {/* Carbon Breakdown */}
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4">Carbon by Category</h2>
                <div className="space-y-4">
                  {categories.map(cat => {
                    const catTotal = carbonEntries
                      .filter(e => e.category === cat.id)
                      .reduce((sum, e) => sum + e.carbonKg, 0);
                    const percent = totalCarbon > 0 ? (catTotal / totalCarbon) * 100 : 0;
                    return (
                      <div key={cat.id}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="flex items-center gap-2">
                            <span>{cat.icon}</span>
                            <span>{cat.label}</span>
                          </span>
                          <span>{catTotal.toFixed(1)} kg</span>
                        </div>
                        <div className="h-3 bg-neutral-800 rounded-full">
                          <div
                            className={`h-full ${cat.color} rounded-full transition-all`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4">Active Goals</h2>
                <div className="space-y-4">
                  {goals.map(goal => (
                    <div key={goal.id} className="p-4 bg-neutral-800 rounded-lg">
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">{goal.name}</span>
                        <span className="text-sm text-emerald-400">{goal.progress}%</span>
                      </div>
                      <div className="h-2 bg-neutral-700 rounded-full">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all"
                          style={{ width: `${goal.progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-neutral-400 mt-1">
                        {goal.current} / {goal.target}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Carbon Tracker Tab */}
        {activeTab === 'carbon' && (
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4">Add Carbon Entry</h2>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm text-neutral-400 mb-1">Category</label>
                    <select className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2">
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.icon} {cat.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-neutral-400 mb-1">Activity</label>
                    <input type="text" placeholder="e.g., Car commute" className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2" />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm text-neutral-400 mb-1">Amount</label>
                    <input type="number" placeholder="25" className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm text-neutral-400 mb-1">Unit</label>
                    <select className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2">
                      <option value="km">Kilometers</option>
                      <option value="kwh">kWh</option>
                      <option value="meals">Meals</option>
                      <option value="items">Items</option>
                      <option value="liters">Liters</option>
                    </select>
                  </div>
                </div>
                <button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-3 rounded-lg font-medium transition-colors">
                  Calculate & Add
                </button>
              </div>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Recent Entries</h2>
              <div className="space-y-3">
                {carbonEntries.map(entry => (
                  <div key={entry.id} className="p-4 bg-neutral-800 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{categories.find(c => c.id === entry.category)?.icon}</span>
                      <div>
                        <p className="font-medium">{entry.activity}</p>
                        <p className="text-xs text-neutral-400">{entry.date.toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-emerald-400">{entry.carbonKg} kg</p>
                      <p className="text-xs text-neutral-400">{entry.amount} {entry.unit}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Energy Tab */}
        {activeTab === 'energy' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { type: 'electricity', icon: '⚡', label: 'Electricity', total: 350, unit: 'kWh', carbon: 157.5 },
                { type: 'gas', icon: '🔥', label: 'Gas', total: 0, unit: 'm³', carbon: 0 },
                { type: 'renewable', icon: '☀️', label: 'Renewable', total: 120, unit: 'kWh', carbon: 0 },
              ].map(item => (
                <div key={item.type} className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                  <span className="text-3xl mb-3 block">{item.icon}</span>
                  <h3 className="font-semibold mb-1">{item.label}</h3>
                  <p className="text-2xl font-bold">{item.total} <span className="text-sm font-normal">{item.unit}</span></p>
                  <p className="text-sm text-neutral-400 mt-1">{item.carbon} kg CO₂</p>
                </div>
              ))}
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Energy Mix</h2>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex h-4 rounded-full overflow-hidden">
                    <div className="bg-yellow-500" style={{ width: '60%' }} />
                    <div className="bg-emerald-500" style={{ width: '25%' }} />
                    <div className="bg-gray-500" style={{ width: '15%' }} />
                  </div>
                </div>
                <div className="flex gap-4 text-sm">
                  <span className="flex items-center gap-1"><span className="w-3 h-3 bg-yellow-500 rounded-full" /> Grid 60%</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 bg-emerald-500 rounded-full" /> Solar 25%</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 bg-gray-500 rounded-full" /> Other 15%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Goals Tab */}
        {activeTab === 'goals' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Sustainability Goals</h2>
              <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm">
                + Add Goal
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { name: 'Carbon Neutral by 2030', category: 'Long-term', progress: 28 },
                { name: 'Zero waste month', category: 'Monthly', progress: 45 },
                { name: 'Plant-based meals 3x/week', category: 'Weekly', progress: 60 },
                { name: 'Public transport only', category: 'Daily', progress: 85 },
              ].map((goal, i) => (
                <div key={i} className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                  <div className="flex justify-between mb-2">
                    <h3 className="font-medium">{goal.name}</h3>
                    <span className="text-xs text-neutral-400">{goal.category}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-3 bg-neutral-800 rounded-full">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${goal.progress}%` }} />
                    </div>
                    <span className="text-emerald-400 font-medium">{goal.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Insights Tab */}
        {activeTab === 'insights' && (
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">💡 Recommendations</h2>
              <div className="space-y-4">
                {[
                  { icon: '🚗', text: 'Try public transport 2x/week to save 23 kg CO₂', impact: '-23 kg' },
                  { icon: '⚡', text: 'Switch to LED bulbs to reduce energy by 15%', impact: '-12 kg' },
                  { icon: '🍎', text: 'One meat-free day saves ~5 kg CO₂', impact: '-5 kg' },
                  { icon: '♻️', text: 'Recycling aluminum saves 95% energy vs new', impact: '-8 kg' },
                ].map((rec, i) => (
                  <div key={i} className="p-4 bg-neutral-800 rounded-lg flex items-center gap-4">
                    <span className="text-2xl">{rec.icon}</span>
                    <div className="flex-1">
                      <p className="text-sm">{rec.text}</p>
                    </div>
                    <span className="text-emerald-400 font-medium">{rec.impact}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">📚 Eco Learning</h2>
              <div className="space-y-3">
                {[
                  { title: 'Carbon Footprint Basics', duration: '10 min', icon: '📖' },
                  { title: 'Sustainable Living Guide', duration: '20 min', icon: '🌱' },
                  { title: 'Energy Efficiency Tips', duration: '15 min', icon: '⚡' },
                ].map((course, i) => (
                  <div key={i} className="p-4 bg-neutral-800 rounded-lg flex items-center gap-4 cursor-pointer hover:bg-neutral-700">
                    <span className="text-2xl">{course.icon}</span>
                    <div className="flex-1">
                      <p className="font-medium">{course.title}</p>
                      <p className="text-xs text-neutral-400">{course.duration}</p>
                    </div>
                    <span className="text-emerald-400">→</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
