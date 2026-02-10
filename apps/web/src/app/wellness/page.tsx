'use client';

import React, { useState } from 'react';

// Evidence Level Badge
const EvidenceBadge: React.FC<{ level: 'STRONG' | 'MODERATE' | 'EMERGING' | 'PRELIMINARY' | 'CAUTION' }> = ({ level }) => {
  const config: Record<string, { bg: string; text: string; border: string; label: string }> = {
    STRONG: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500', label: '🟢 STRONG' },
    MODERATE: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500', label: '🔵 MODERATE' },
    EMERGING: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500', label: '🟣 EMERGING' },
    PRELIMINARY: { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500', label: '🟡 PRELIMINARY' },
    CAUTION: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500', label: '🔴 CAUTION' },
  };
  const c = config[level];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${c.bg} ${c.text} ${c.border}`}>
      {c.label}
    </span>
  );
};

// Remedy Card
const RemedyCard: React.FC<{
  name: string;
  scientific: string;
  evidence: 'STRONG' | 'MODERATE' | 'EMERGING' | 'PRELIMINARY' | 'CAUTION';
  dosage: string;
  mechanism: string;
  benefits: string[];
  cautions?: string[];
}> = ({ name, scientific, evidence, dosage, mechanism, benefits, cautions }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden hover:border-neutral-700 transition-colors">
      <button onClick={() => setExpanded(!expanded)} className="w-full p-4 text-left flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-emerald-400">{name}</h4>
            <EvidenceBadge level={evidence} />
          </div>
          <p className="text-sm text-neutral-400 italic">{scientific}</p>
        </div>
        <svg className={`w-5 h-5 text-neutral-400 transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {expanded && (
        <div className="px-4 pb-4 border-t border-neutral-800 pt-4 space-y-3">
          <div><span className="text-xs font-medium text-neutral-500 uppercase">Dosage</span><p className="text-sm text-neutral-300">{dosage}</p></div>
          <div><span className="text-xs font-medium text-neutral-500 uppercase">Mechanism</span><p className="text-sm text-neutral-300">{mechanism}</p></div>
          <div><span className="text-xs font-medium text-neutral-500 uppercase">Benefits</span>
            <ul className="mt-1 space-y-1">{benefits.map((b, i) => (
              <li key={i} className="text-sm text-neutral-300 flex items-start gap-2"><span className="text-emerald-500 mt-0.5">•</span>{b}</li>
            ))}</ul>
          </div>
          {cautions && cautions.length > 0 && (
            <div><span className="text-xs font-medium text-amber-500 uppercase">Cautions</span>
              <ul className="mt-1 space-y-1">{cautions.map((c, i) => (
                <li key={i} className="text-sm text-amber-400 flex items-start gap-2"><span className="text-amber-500 mt-0.5">!</span>{c}</span></li>
              ))}</ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default function WellnessPage() {
  const sections = [
    { id: 'depression', title: 'Depressive Disorders', icon: '🌿', desc: 'Evidence-based natural support' },
    { id: 'anxiety', title: 'Anxiety Disorders', icon: '🧘', desc: 'GAD, Panic, Social Anxiety' },
    { id: 'bipolar', title: 'Bipolar Disorders', icon: '⚖️', desc: 'Mood stabilization (with psychiatrist)' },
    { id: 'trauma', title: 'Trauma & Stress', icon: '🛡️', desc: 'PTSD, ASD, Adjustment' },
    { id: 'substance', title: 'Substance Use', icon: '🌱', desc: 'Recovery support' },
    { id: 'neuro', title: 'Neurocognitive', icon: '🧠', desc: 'Cognition, Memory' },
    { id: 'sleep', title: 'Sleep Disorders', icon: '😴', desc: 'Insomnia, Nightmares' },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <header className="border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2"><span>🌿</span> Holistic Wellness Module</h1>
              <p className="text-sm text-neutral-400">Evidence-based natural interventions (2025-2026 Clinical Evidence)</p>
            </div>
          </div>
          <nav className="flex flex-wrap gap-2 mt-4">
            {sections.map((s) => (
              <a key={s.id} href={`#${s.id}`} className="text-xs px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 rounded-full transition-colors flex items-center gap-1">
                <span>{s.icon}</span><span>{s.title}</span>
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Evidence Legend */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
          <h3 className="text-sm font-medium text-neutral-500 uppercase mb-3">Evidence Classification</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
            <EvidenceBadge level="STRONG" /><span className="text-xs text-neutral-400 py-1">10+ trials, consistent results</span>
            <EvidenceBadge level="MODERATE" /><span className="text-xs text-neutral-400 py-1">5-10 trials, generally positive</span>
            <EvidenceBadge level="EMERGING" /><span className="text-xs text-neutral-400 py-1">2-4 trials, promising</span>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
          <p className="text-sm text-amber-400"><strong>⚠️ Disclaimer:</strong> Educational only. Consult healthcare providers before starting any regimen, especially with medications.</p>
        </div>

        {/* DEPRESSION */}
        <section id="depression" className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2"><span>🌿</span> Depressive Disorders</h2>
          <div className="grid gap-3">
            <RemedyCard name="St. John's Wort" scientific="Hypericum perforatum" evidence="STRONG" dosage="300-900 mg TID (0.3% hypericin)" mechanism="Serotonin reuptake inhibition, MAO inhibition" benefits={['38+ trials, comparable to SSRIs', '18-33% superiority over placebo', 'Superior tolerability']} cautions={['Contraindicated with SSRIs (serotonin syndrome)', 'Reduces effectiveness of warfarin, OCPs', 'Photosensitivity']} />
            <RemedyCard name="Saffron" scientific="Crocus sativus" evidence="STRONG" dosage="15-30 mg daily" mechanism="Monoamine modulation, anti-inflammatory, MAO inhibition" benefits={['18+ trials, equivalent to fluoxetine', '50-65% response rate', 'Curcumin+Saffron synergistic']} cautions={['Pregnancy contraindicated', 'Market adulteration']} />
            <RemedyCard name="Omega-3" scientific="EPA & DHA" evidence="MODERATE" dosage="2000-4000 mg daily" mechanism="Cell membrane fluidity, neuroinflammation reduction" benefits={['39+ trials', '15-20% superiority over placebo when deficient']} cautions={['Blood thinning potential', 'Quality testing recommended']} />
            <RemedyCard name="Probiotics" scientific="Lactobacillus, Bifidobacterium" evidence="MODERATE" dosage="10-50 billion CFU daily" mechanism="GABA production, SCFA generation, microbiota" benefits={['18+ trials', '20-30% symptom reduction over placebo']} cautions={['Temporary bloating in first 1-2 weeks']} />
            <RemedyCard name="Vitamin D" scientific="Cholecalciferol" evidence="MODERATE" dosage="2000-4000 IU daily" mechanism="Serotonin synthesis, VDR activation" benefits={['14+ trials', '75%+ response in SAD', '20-30% improvement when deficient']} />
            <RemedyCard name="Folic Acid" scientific="Vitamin B9" evidence="MODERATE" dosage="5-15 mg or 1000-2000 mcg methylfolate" mechanism="One-carbon metabolism, neurotransmitter synthesis" benefits={['Synergistic with SSRIs', '30-50% additional improvement']} cautions={['MTHFR variants - use methylfolate']} />
          </div>
        </section>

        {/* ANXIETY */}
        <section id="anxiety" className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2"><span>🧘</span> Anxiety Disorders</h2>
          <div className="grid gap-3">
            <RemedyCard name="Ashwagandha" scientific="Withania somnifera" evidence="STRONG" dosage="300-600 mg BID" mechanism="HPA axis modulation, cortisol reduction" benefits={['Comparable to benzodiazepines', 'Particularly effective with fatigue']} cautions={['Contraindicated in pregnancy', 'Can trigger mania in bipolar']} />
            <RemedyCard name="Lavender" scientific="Lavandula angustifolia" evidence="STRONG" dosage="80-160 mg daily" mechanism="GABA agonist" benefits={['Comparable to lorazepam', 'Safe with pharmaceuticals']} />
            <RemedyCard name="Valerian Root" scientific="Valeriana officinalis" evidence="STRONG" dosage="400-900 mg daily" mechanism="GABA receptor agonist" benefits={['Multiple RCTs', 'Particularly for anxiety with insomnia']} />
            <RemedyCard name="Magnesium" scientific="Elemental Magnesium" evidence="MODERATE" dosage="200-400 mg daily" mechanism="GABA co-factor, stress modulation" benefits={['Multiple trials', 'Particularly effective in panic disorder']} />
            <RemedyCard name="L-Theanine" scientific="Amino acid" evidence="MODERATE" dosage="100-200 mg" mechanism="GABA production, alpha waves" benefits={['Anxiety reduction without drowsiness', 'Rapid onset']} />
            <RemedyCard name="Passionflower" scientific="Passiflora incarnata" evidence="MODERATE" dosage="400-800 mg daily" mechanism="GABA/benzodiazepine receptor" benefits={['Multiple RCTs', 'Anxiety without sedation']} />
            <RemedyCard name="Chamomile" scientific="Matricaria chamomilla" evidence="MODERATE" dosage="1-2 cups tea TID" mechanism="Benzodiazepine-like (apigenin)" benefits={['Multiple RCTs', 'Mild-moderate anxiety']} cautions={['Rare allergic reactions (ragweed)']} />
            <RemedyCard name="Lemon Balm" scientific="Melissa officinalis" evidence="MODERATE" dosage="300-600 mg TID" mechanism="GABA modulation" benefits={['3+ trials', 'Synergistic with valerian', 'Very safe']} />
          </div>
        </section>

        {/* BIPOLAR */}
        <section id="bipolar" className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2"><span>⚖️</span> Bipolar Disorders</h2>
          <p className="text-sm text-amber-400 bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">⚠️ ALWAYS with psychiatrist - natural support is adjunctive</p>
          <div className="grid gap-3">
            <RemedyCard name="Omega-3" scientific="EPA & DHA" evidence="MODERATE" dosage="1000-2000 mg EPA daily" mechanism="Cell membrane, anti-inflammation" benefits={['Multiple RCTs for mood stabilization', 'Pure EPA more effective']} cautions={['Risk of mood destabilization']} />
            <RemedyCard name="Magnesium" scientific="Elemental Magnesium" evidence="EMERGING" dosage="200-400 mg daily" mechanism="GABA support" benefits={['Sleep support, mood adjunct']} />
            <RemedyCard name="Vitamin D" scientific="Cholecalciferol" evidence="EMERGING" dosage="2000-4000 IU daily" mechanism="Neuroprotection" benefits={['Deficiency worsens mood cycling']} />
            <RemedyCard name="NAC" scientific="N-Acetyl-Cysteine" evidence="EMERGING" dosage="1000-2000 mg BID" mechanism="Glutamate regulation" benefits={['Helpful in bipolar depression']} cautions={['May trigger mania']} />
          </div>
        </section>

        {/* TRAUMA */}
        <section id="trauma" className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2"><span>🛡️</span> Trauma & Stress-Related</h2>
          <div className="grid gap-3">
            <RemedyCard name="Magnesium" scientific="Elemental Magnesium" evidence="MODERATE" dosage="200-400 mg daily" mechanism="HPA axis modulation" benefits={['Reduces nightmares, startle response']} />
            <RemedyCard name="Omega-3" scientific="EPA & DHA" evidence="MODERATE" dosage="1000-2000 mg daily" mechanism="Neuroinflammation reduction" benefits={['Reduces intrusive memories']} />
            <RemedyCard name="Valerian" scientific="Valeriana officinalis" evidence="MODERATE" dosage="400-900 mg daily" mechanism="GABA agonist" benefits={['Sleep improvement, nightmare reduction']} />
            <RemedyCard name="Lavender" scientific="Lavandula angustifolia" evidence="MODERATE" dosage="80-160 mg daily" mechanism="GABA agonist" benefits={['Anxiety, hypervigilance reduction']} />
            <RemedyCard name="Ashwagandha" scientific="Withania somnifera" evidence="MODERATE" dosage="300-600 mg BID" mechanism="HPA axis, cortisol" benefits={['Stress adaptation', '6-8 week trial']} />
            <RemedyCard name="Rhodiola" scientific="Rhodiola rosea" evidence="MODERATE" dosage="300-600 mg daily" mechanism="Stress resilience" benefits={['Fatigue, stress resilience']} cautions={['Monitor in bipolar (activation)']} />
            <RemedyCard name="Reishi" scientific="Ganoderma lucidum" evidence="EMERGING" dosage="1000-2000 mg daily" mechanism="Sleep enhancement" benefits={['Nightmare reduction', 'Traditional Asian use']} />
          </div>
        </section>

        {/* SUBSTANCE USE */}
        <section id="substance" className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2"><span>🌱</span> Substance Use Disorders</h2>
          <p className="text-sm text-amber-400 bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">⚠️ Adjunctive support only - not replacement for treatment</p>
          <div className="grid gap-3">
            <RemedyCard name="Thiamine (B1)" scientific="Vitamin B1" evidence="STRONG" dosage="100-200 mg daily" mechanism="Prevents Wernicke&apos;s encephalopathy" benefits={['Critical in AUD', 'Alcohol depletes thiamine']} />
            <RemedyCard name="Magnesium" scientific="Elemental Magnesium" evidence="MODERATE" dosage="400-600 mg ER" mechanism="Glutamate regulation" benefits={['Prevents seizures', 'Reduces tremor']} />
            <RemedyCard name="Milk Thistle" scientific="Silybum marianum" evidence="MODERATE" dosage="200-300 mg TID" mechanism="Hepatocyte protection" benefits={['Liver function recovery']} />
            <RemedyCard name="NAC" scientific="N-Acetyl-Cysteine" evidence="EMERGING" dosage="1200-2400 mg daily" mechanism="Glutamate regulation" benefits={['Craving reduction']} />
            <RemedyCard name="Probiotics" scientific="Multi-strain" evidence="EMERGING" dosage="50+ billion CFU" mechanism="Gut restoration" benefits={['Microbiota inflammation reduction']} />
            <RemedyCard name="GABA" scientific="GABA supplement" evidence="EMERGING" dosage="750-1500 mg daily" mechanism="Anxiety, craving" benefits={['Stress response modulation']} />
          </div>
        </section>

        {/* NEUROCOGNITIVE */}
        <section id="neuro" className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2"><span>🧠</span> Neurocognitive Disorders</h2>
          <div className="grid gap-3">
            <RemedyCard name="Ginkgo Biloba" scientific="Ginkgo biloba" evidence="MODERATE" dosage="120-240 mg daily" mechanism="Vascular function, antioxidant" benefits={['Multiple RCTs', 'Modest cognitive stabilization']} cautions={['May interact with blood thinners']} />
            <RemedyCard name="Curcumin" scientific="Curcuma longa" evidence="MODERATE" dosage="500-1000 mg TID + piperine" mechanism="Anti-amyloid, anti-inflammatory" benefits={['Multiple RCTs', 'Amyloid plaque reduction']} />
            <RemedyCard name="Bacopa Monnieri" scientific="Bacopa monnieri" evidence="MODERATE" dosage="300-450 mg daily" mechanism="Neurotransmitter, memory" benefits={['Multiple RCTs', 'Memory improvement']} />
            <RemedyCard name="Lion's Mane" scientific="Hericium erinaceus" evidence="EMERGING" dosage="1000-3000 mg daily" mechanism="NGF production" benefits={['Cognition improvement']} />
            <RemedyCard name="EGCG" scientific="Camellia sinensis" evidence="MODERATE" dosage="300-400 mg daily" mechanism="Tau/amyloid modulation" benefits={['Multiple trials', 'Neuroprotection']} />
            <RemedyCard name="Resveratrol" scientific="Polygonum cuspidatum" evidence="EMERGING" dosage="150-500 mg daily" mechanism="Sirtuin activation" benefits={['Neuroprotection']} />
            <RemedyCard name="Huperzine A" scientific="Huperzia serrata" evidence="EMERGING" dosage="50-200 mcg daily" mechanism="Acetylcholinesterase inhibition" benefits={['Similar to Aricept', 'Cognitive enhancement']} />
          </div>
        </section>

        {/* SLEEP */}
        <section id="sleep" className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2"><span>😴</span> Sleep Disorders</h2>
          <div className="grid gap-3">
            <RemedyCard name="Valerian Root" scientific="Valeriana officinalis" evidence="STRONG" dosage="400-900 mg before bed" mechanism="GABA receptor agonist" benefits={['30+ trials', '15-20 min sleep onset reduction', 'Safe long-term']} />
            <RemedyCard name="Passionflower" scientific="Passiflora incarnata" evidence="STRONG" dosage="400-800 mg before bed" mechanism="GABA/benzodiazepine" benefits={['Multiple RCTs', 'Sleep quality', 'Synergistic with valerian']} />
            <RemedyCard name="Chamomile" scientific="Matricaria chamomilla" evidence="STRONG" dosage="1-2 cups tea before bed" mechanism="Benzodiazepine-like" benefits={['Multiple RCTs']} cautions={['Rare allergic reactions']} />
            <RemedyCard name="Melatonin" scientific="Endogenous hormone" evidence="MODERATE" dosage="0.5-10 mg at bedtime" mechanism="Circadian rhythm" benefits={['40+ trials', 'Jet lag, shift work']} cautions={['Best for circadian issues']} />
            <RemedyCard name="Magnesium" scientific="Elemental Magnesium" evidence="MODERATE" dosage="200-400 mg at bed" mechanism="GABA synthesis" benefits={['Muscle relaxation', 'Sleep onset']} />
            <RemedyCard name="Reishi" scientific="Ganoderma lucidum" evidence="EMERGING" dosage="1000-2000 mg daily" mechanism="Sleep stage enhancement" benefits={['Dream quality', 'REM sleep']} />
            <RemedyCard name="Hops" scientific="Humulus lupulus" evidence="EMERGING" dosage="500-1000 mg before bed" mechanism="GABA modulation" benefits={['Traditional use', 'Emerging validation']} />
            <RemedyCard name="Skullcap" scientific="Scutellaria lateriflora" evidence="EMERGING" dosage="500-1000 mg before bed" mechanism="Nervous system calming" benefits={['Traditional use']} />
          </div>
        </section>

        {/* Integration Protocols */}
        <section className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">📋 Integration Protocols</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-emerald-400 mb-2">Depression Protocol</h3>
              <ol className="text-sm text-neutral-300 space-y-2 list-decimal list-inside">
                <li>Begin single agent (St. John&apos;s Wort or Saffron)</li>
                <li>Add gut-support: Probiotics + dietary fiber</li>
                <li>Optimize: Vitamin D, Omega-3, Folic Acid</li>
                <li>Monitor: 6-8 week minimum trial</li>
                <li>Collaborate: Medical supervision with pharmaceuticals</li>
              </ol>
            </div>
            <div>
              <h3 className="font-medium text-emerald-400 mb-2">Anxiety Protocol</h3>
              <ol className="text-sm text-neutral-300 space-y-2 list-decimal list-inside">
                <li>Base: Ashwagandha OR Valerian + Chamomile</li>
                <li>If insomnia: Add Passionflower + Magnesium</li>
                <li>If racing thoughts: Add Lemon Balm</li>
                <li>Support: Omega-3, Vitamin D, Probiotics</li>
                <li>Duration: 6-8 week minimum trial</li>
              </ol>
            </div>
          </div>
        </section>

        <footer className="text-center text-sm text-neutral-500 py-8">
          <p>Organic OS Wellness Module • Evidence-based natural interventions</p>
          <p className="mt-1">Last Updated: January 2026 • Sources: 2025-2026 Clinical Trials</p>
        </footer>
      </main>
    </div>
  );
}
