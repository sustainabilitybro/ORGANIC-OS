// Organic OS - Wellness Module Page
// Naturopath Integration for Holistic Health

'use client';

import { useState } from 'react';
import { useWellnessStore, Remedy, evidenceBadges } from './store';

// Icons
const HeartIcon = ({ filled = false }: { filled?: boolean }) => (
  <svg className={`w-5 h-5 ${filled ? 'fill-current text-red-500' : 'stroke-current'}`} viewBox="0 0 24 24" fill="none" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

const InfoIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4M12 8h.01" />
  </svg>
);

export default function WellnessPage() {
  const { remedies, favorites, dailyProtocols, toggleFavorite, addToProtocol, removeFromProtocol } = useWellnessStore();
  const [selectedRemedy, setSelectedRemedy] = useState<Remedy | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRemedies = remedies.filter(r =>
    r.commonName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.scientificName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.benefits.some(b => b.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const selectedRemedyData = remedies.find(r => r.id === selectedRemedy);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* Header */}
      <div className="border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Wellness Module</h1>
              <p className="text-sm text-neutral-400">Evidence-based natural remedies & protocols</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search remedies, benefits..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 w-64"
                />
                <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Remedies Grid */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold">Natural Remedies</h2>
              <span className="text-sm text-neutral-400">{filteredRemedies.length} remedies</span>
            </div>
            
            <div className="grid gap-4">
              {filteredRemedies.map((remedy) => (
                <div
                  key={remedy.id}
                  className={`bg-neutral-900 border rounded-xl p-5 cursor-pointer transition-all hover:border-neutral-700 ${
                    selectedRemedy === remedy.id ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-neutral-800'
                  }`}
                  onClick={() => setSelectedRemedy(remedy.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold">{remedy.commonName}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${evidenceBadges[remedy.evidenceLevel].color} text-white`}>
                          {evidenceBadges[remedy.evidenceLevel].label}
                        </span>
                      </div>
                      <p className="text-sm text-neutral-400 italic mb-2">{remedy.scientificName} • {remedy.family}</p>
                      <p className="text-sm text-neutral-300 line-clamp-2">{remedy.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mt-3">
                        {remedy.benefits.slice(0, 3).map((benefit, idx) => (
                          <span key={idx} className="text-xs bg-neutral-800 text-neutral-300 px-2 py-1 rounded">
                            {benefit}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(remedy.id);
                        }}
                        className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
                      >
                        <HeartIcon filled={favorites.includes(remedy.id)} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          dailyProtocols.includes(remedy.id)
                            ? removeFromProtocol(remedy.id)
                            : addToProtocol(remedy.id);
                        }}
                        className={`p-2 rounded-lg transition-colors ${
                          dailyProtocols.includes(remedy.id)
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'hover:bg-neutral-800'
                        }`}
                      >
                        <CheckIcon />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Daily Protocol */}
          <div className="space-y-4">
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
              <h2 className="text-lg font-semibold mb-4">Today's Protocol</h2>
              {dailyProtocols.length === 0 ? (
                <p className="text-sm text-neutral-400">Select remedies to add to your daily protocol</p>
              ) : (
                <div className="space-y-3">
                  {dailyProtocols.map((id) => {
                    const remedy = remedies.find(r => r.id === id);
                    return remedy ? (
                      <div key={id} className="flex items-center justify-between bg-neutral-800 rounded-lg p-3">
                        <div>
                          <p className="font-medium text-sm">{remedy.commonName}</p>
                          <p className="text-xs text-neutral-400">{remedy.partsUsed[0]}</p>
                        </div>
                        <button
                          onClick={() => removeFromProtocol(id)}
                          className="text-neutral-400 hover:text-red-400"
                        >
                          ×
                        </button>
                      </div>
                    ) : null;
                  })}
                </div>
              )}
            </div>

            {/* Favorites */}
            {favorites.length > 0 && (
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
                <h2 className="text-lg font-semibold mb-4">Favorites</h2>
                <div className="space-y-2">
                  {favorites.map((id) => {
                    const remedy = remedies.find(r => r.id === id);
                    return remedy ? (
                      <div key={id} className="flex items-center gap-2 text-sm">
                        <HeartIcon filled />
                        <span>{remedy.commonName}</span>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            )}

            {/* Remedy Detail Panel */}
            {selectedRemedyData && (
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 sticky top-24">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-lg font-semibold">{selectedRemedyData.commonName}</h2>
                  <button
                    onClick={() => setSelectedRemedy(null)}
                    className="text-neutral-400 hover:text-white"
                  >
                    ×
                  </button>
                </div>
                
                <p className="text-sm text-neutral-400 italic mb-4">{selectedRemedyData.scientificName}</p>
                <p className="text-sm text-neutral-300 mb-4">{selectedRemedyData.description}</p>

                <div className="space-y-4">
                  {/* Traditional Systems */}
                  <div>
                    <h3 className="text-sm font-medium mb-2">Traditional Use</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedRemedyData.traditionalSystems.map((system) => (
                        <span key={system} className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded">
                          {system}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Compounds */}
                  <div>
                    <h3 className="text-sm font-medium mb-2">Active Compounds</h3>
                    <div className="space-y-1">
                      {selectedRemedyData.compounds.map((compound) => (
                        <div key={compound.name} className="flex justify-between text-sm">
                          <span className="text-neutral-300">{compound.name}</span>
                          <span className="text-neutral-400">{compound.concentration}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Benefits */}
                  <div>
                    <h3 className="text-sm font-medium mb-2">Benefits</h3>
                    <ul className="space-y-1">
                      {selectedRemedyData.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-neutral-300">
                          <CheckIcon />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Contraindications */}
                  <div>
                    <h3 className="text-sm font-medium mb-2 flex items-center gap-1">
                      <InfoIcon /> Contraindications
                    </h3>
                    <ul className="space-y-1">
                      {selectedRemedyData.contraindications.map((item, idx) => (
                        <li key={idx} className="text-sm text-amber-400">
                          • {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
