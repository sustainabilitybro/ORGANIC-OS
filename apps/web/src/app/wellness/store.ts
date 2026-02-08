// Organic OS - Wellness Module
// Naturopath Integration for Holistic Health

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Remedy interface matching naturopath seed data
export interface Remedy {
  id: string;
  commonName: string;
  scientificName: string;
  family: string;
  type: 'plant' | 'mushroom' | 'mineral' | 'animal';
  description: string;
  traditionalSystems: string[];
  compounds: Compound[];
  partsUsed: string[];
  benefits: string[];
  contraindications: string[];
  evidenceLevel: 'strong' | 'moderate' | 'preliminary' | 'traditional';
  confidenceScore: number;
}

// Compound within a remedy
export interface Compound {
  name: string;
  concentration: string;
  source: string;
}

// User wellness state
interface WellnessState {
  remedies: Remedy[];
  favorites: string[];
  dailyProtocols: string[];
  addRemedy: (remedy: Remedy) => void;
  toggleFavorite: (id: string) => void;
  addToProtocol: (id: string) => void;
  removeFromProtocol: (id: string) => void;
}

// Sample remedies from naturopath data
const sampleRemedies: Remedy[] = [
  {
    id: 'turmeric',
    commonName: 'Turmeric',
    scientificName: 'Curcuma longa',
    family: 'Zingiberaceae',
    type: 'plant',
    description: 'Powerful anti-inflammatory and antioxidant rhizome used for 4,000+ years in Ayurveda and TCM.',
    traditionalSystems: ['Ayurveda', 'TCM', 'Western Herbalism'],
    compounds: [
      { name: 'Curcumin', concentration: '2-8%', source: 'rhizome' },
      { name: 'Turmerone', concentration: 'variable', source: 'essential oil' },
    ],
    partsUsed: ['rhizome', 'root'],
    benefits: ['Reduces inflammation', 'Antioxidant protection', 'Supports joint health', 'Liver detoxification'],
    contraindications: ['Gallbladder issues', 'Blood thinners', 'Pregnancy (high doses)'],
    evidenceLevel: 'strong',
    confidenceScore: 0.95,
  },
  {
    id: 'ashwagandha',
    commonName: 'Ashwagandha',
    scientificName: 'Withania somnifera',
    family: 'Solanaceae',
    type: 'plant',
    description: 'Premier adaptogen for stress resilience, energy, and cognitive function.',
    traditionalSystems: ['Ayurveda'],
    compounds: [
      { name: 'Withanolide A', concentration: '0.1-0.5%', source: 'root' },
      { name: 'Withaferin A', concentration: '0.2-0.8%', source: 'root' },
    ],
    partsUsed: ['root', 'leaf'],
    benefits: ['Stress adaptation', 'Energy optimization', 'Cognitive support', 'Sleep quality'],
    contraindications: ['Thyroid disorders', 'Autoimmune conditions', 'Surgery'],
    evidenceLevel: 'strong',
    confidenceScore: 0.92,
  },
  {
    id: 'lion-mane',
    commonName: 'Lion\'s Mane',
    scientificName: 'Hericium erinaceus',
    family: 'Hericiaceae',
    type: 'mushroom',
    description: 'Neuroprotective mushroom that supports cognitive function and nerve regeneration.',
    traditionalSystems: ['TCM', 'Japanese Kampo'],
    compounds: [
      { name: 'Hericenones', concentration: 'variable', source: 'fruiting body' },
      { name: 'Erinacines', concentration: 'variable', source: 'mycelium' },
    ],
    partsUsed: ['fruiting body', 'mycelium'],
    benefits: ['Cognitive enhancement', 'Nerve growth factor (NGF)', 'Mood support', 'Memory'],
    contraindications: ['Bleeding disorders', 'Mushroom allergies'],
    evidenceLevel: 'moderate',
    confidenceScore: 0.85,
  },
  {
    id: 'rhodiola',
    commonName: 'Rhodiola Rosea',
    scientificName: 'Rhodiola rosea',
    family: 'Crassulaceae',
    type: 'plant',
    description: 'Arctic adaptogen that enhances mental performance and combats fatigue.',
    traditionalSystems: ['Scandinavian Folk Medicine', 'TCM', 'Russian Traditional Medicine'],
    compounds: [
      { name: 'Rosavins', concentration: '3-6%', source: 'root' },
      { name: 'Salidroside', concentration: '1-2%', source: 'root' },
    ],
    partsUsed: ['root'],
    benefits: ['Mental fatigue', 'Physical endurance', 'Stress resilience', 'Mood stabilization'],
    contraindications: ['Bipolar disorder', 'MAOIs', 'Stimulant medications'],
    evidenceLevel: 'strong',
    confidenceScore: 0.88,
  },
  {
    id: 'reishi',
    commonName: 'Reishi Mushroom',
    scientificName: 'Ganoderma lucidum',
    family: 'Ganodermataceae',
    type: 'mushroom',
    description: 'The "Mushroom of Immortality" — immune modulation and stress adaptation.',
    traditionalSystems: ['TCM', 'Japanese Kampo'],
    compounds: [
      { name: 'Beta-glucans', concentration: 'variable', source: 'fruiting body' },
      { name: 'Triterpenes', concentration: '2-5%', source: 'fruiting body' },
    ],
    partsUsed: ['fruiting body', 'spores'],
    benefits: ['Immune modulation', 'Stress adaptation', 'Sleep quality', 'Longevity support'],
    contraindications: ['Blood thinners', 'Surgery', 'Immunosuppressants'],
    evidenceLevel: 'moderate',
    confidenceScore: 0.82,
  },
];

export const useWellnessStore = create<WellnessState>()(
  persist(
    (set) => ({
      remedies: sampleRemedies,
      favorites: [],
      dailyProtocols: [],
      addRemedy: (remedy) =>
        set((state) => ({
          remedies: [...state.remedies, remedy],
        })),
      toggleFavorite: (id) =>
        set((state) => ({
          favorites: state.favorites.includes(id)
            ? state.favorites.filter((f) => f !== id)
            : [...state.favorites, id],
        })),
      addToProtocol: (id) =>
        set((state) => ({
          dailyProtocols: state.dailyProtocols.includes(id)
            ? state.dailyProtocols
            : [...state.dailyProtocols, id],
        })),
      removeFromProtocol: (id) =>
        set((state) => ({
          dailyProtocols: state.dailyProtocols.filter((p) => p !== id),
        })),
    }),
    {
      name: 'wellness-storage',
    }
  )
);

// Evidence level badges
export const evidenceBadges = {
  strong: { label: 'Strong Evidence', color: 'bg-green-500' },
  moderate: { label: 'Moderate Evidence', color: 'bg-yellow-500' },
  preliminary: { label: 'Preliminary Evidence', color: 'bg-orange-500' },
  traditional: { label: 'Traditional Use', color: 'bg-blue-500' },
};
