'use client';

import { useState } from 'react';

// Evidence Badge Component
function EvidenceBadge({ level }: { level: string }) {
  const badges: Record<string, { bg: string; text: string; label: string }> = {
    STRONG: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', label: '🟢 STRONG' },
    MODERATE: { bg: 'bg-blue-500/20', text: 'text-blue-400', label: '🔵 MODERATE' },
    EMERGING: { bg: 'bg-purple-500/20', text: 'text-purple-400', label: '🟣 EMERGING' },
  };
  const b = badges[level] || badges.EMERGING;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border border-transparent ${b.bg} ${b.text}`}>
      {b.label}
    </span>
  );
}

// Remedy Card Component
function RemedyCard({ name, scientific, evidence, dosage, mechanism, benefits, cautions }: {
  name: string;
  scientific: string;
  evidence: string;
  dosage: string;
  mechanism: string;
  benefits: string[];
  cautions?: string[];
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 text-left flex items-center justify-between hover:bg-neutral-800/50"
      >
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
          <div>
            <span className="text-xs font-medium text-neutral-500 uppercase">Dosage</span>
            <p className="text-sm text-neutral-300">{dosage}</p>
          </div>
          <div>
            <span className="text-xs font-medium text-neutral-500 uppercase">Mechanism</span>
            <p className="text-sm text-neutral-300">{mechanism}</p>
          </div>
          <div>
            <span className="text-xs font-medium text-neutral-500 uppercase">Benefits</span>
            <ul className="mt-1 space-y-1">
              {benefits.map((b, i) => (
                <li key={i} className="text-sm text-neutral-300 flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">•</span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
          {cautions && cautions.length > 0 && (
            <div>
              <span className="text-xs font-medium text-amber-500 uppercase">Cautions</span>
              <ul className="mt-1 space-y-1">
                {cautions.map((c, i) => (
                  <li key={i} className="text-sm text-amber-400 flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">!</span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Main Wellness Page Component
export default function WellnessPage() {
  const sections = [
    { id: 'depression', title: 'Depressive Disorders', icon: '🌿' },
    { id: 'anxiety', title: 'Anxiety Disorders', icon: '🧘' },
    { id: 'bipolar', title: 'Bipolar Disorders', icon: '⚖️' },
    { id: 'trauma', title: 'Trauma & Stress', icon: '🛡️' },
    { id: 'substance', title: 'Substance Use', icon: '🌱' },
    { id: 'neuro', title: 'Neurocognitive', icon: '🧠' },
    { id: 'sleep', title: 'Sleep Disorders', icon: '😴' },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* Header */}
      <header className="border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <span>🌿</span> Holistic Wellness Module
          </h1>
          <p className="text-sm text-neutral-400">Evidence-based natural interventions (2025-2026)</p>
          <nav className="flex flex-wrap gap-2 mt-4">
            {sections.map((s) => (
              <a key={s.id} href={`#${s.id}`} className="text-xs px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 rounded-full">
                <span>{s.icon}</span> <span>{s.title}</span>
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* Evidence Legend */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
          <h3 className="text-sm font-medium text-neutral-500 uppercase mb-3">Evidence Classification</h3>
          <div className="flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-2">
              <EvidenceBadge level="STRONG" />
              <span className="text-neutral-400">10+ trials, consistent results</span>
            </div>
            <div className="flex items-center gap-2">
              <EvidenceBadge level="MODERATE" />
              <span className="text-neutral-400">5-10 trials, generally positive</span>
            </div>
            <div className="flex items-center gap-2">
              <EvidenceBadge level="EMERGING" />
              <span className="text-neutral-400">2-4 trials, promising</span>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
          <p className="text-sm text-amber-400">
            <strong>⚠️ Disclaimer:</strong> Educational only. Consult healthcare providers before starting any regimen.
          </p>
        </div>

        {/* DEPRESSION */}
        <section id="depression" className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2"><span>🌿</span> Depressive Disorders</h2>
          <div className="grid gap-3">
            <RemedyCard name="St. Johns Wort" scientific="Hypericum perforatum" evidence="STRONG" dosage="300-900 mg TID" mechanism="Serotonin reuptake inhibition, MAO inhibition" benefits={['38+ trials, comparable to SSRIs', '18-33% superiority over placebo', 'Superior tolerability']} cautions={['Contraindicated with SSRIs', 'Reduces effectiveness of warfarin, OCPs', 'Photosensitivity']} />
            <RemedyCard name="Saffron" scientific="Crocus sativus" evidence="STRONG" dosage="15-30 mg daily" mechanism="Monoamine modulation, anti-inflammatory" benefits={['18+ trials, equivalent to fluoxetine', '50-65% response rate', 'Curcumin+Saffron synergistic']} cautions={['Pregnancy contraindicated', 'Market adulteration']} />
            <RemedyCard name="Omega-3" scientific="EPA and DHA" evidence="MODERATE" dosage="2000-4000 mg daily" mechanism="Cell membrane, neuroinflammation" benefits={['39+ trials', '15-20% superiority when deficient']} cautions={['Blood thinning potential', 'Quality testing recommended']} />
            <RemedyCard name="Probiotics" scientific="Lactobacillus, Bifidobacterium" evidence="MODERATE" dosage="10-50 billion CFU daily" mechanism="GABA production, SCFA generation" benefits={['18+ trials', '20-30% symptom reduction']} cautions={['Temporary bloating']} />
            <RemedyCard name="Vitamin D" scientific="Cholecalciferol" evidence="MODERATE" dosage="2000-4000 IU daily" mechanism="Serotonin synthesis, VDR activation" benefits={['14+ trials', '75%+ response in SAD', '20-30% improvement when deficient']} />
            <RemedyCard name="Folic Acid" scientific="Vitamin B9" evidence="MODERATE" dosage="5-15 mg or 1000-2000 mcg methylfolate" mechanism="One-carbon metabolism" benefits={['Synergistic with SSRIs', '30-50% additional improvement']} cautions={['MTHFR variants - use methylfolate']} />
          </div>
        </section>

        {/* ANXIETY */}
        <section id="anxiety" className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2"><span>🧘</span> Anxiety Disorders</h2>
          <div className="grid gap-3">
            <RemedyCard name="Ashwagandha" scientific="Withania somnifera" evidence="STRONG" dosage="300-600 mg BID" mechanism="HPA axis modulation, cortisol reduction" benefits={['Comparable to benzodiazepines', 'Effective with fatigue']} cautions={['Contraindicated in pregnancy', 'Can trigger mania in bipolar']} />
            <RemedyCard name="Lavender" scientific="Lavandula angustifolia" evidence="STRONG" dosage="80-160 mg daily" mechanism="GABA agonist" benefits={['Comparable to lorazepam', 'Safe with pharmaceuticals']} />
            <RemedyCard name="Valerian Root" scientific="Valeriana officinalis" evidence="STRONG" dosage="400-900 mg daily" mechanism="GABA receptor agonist" benefits={['Multiple RCTs', 'Anxiety with insomnia']} />
            <RemedyCard name="Magnesium" scientific="Elemental Magnesium" evidence="MODERATE" dosage="200-400 mg daily" mechanism="GABA co-factor, stress modulation" benefits={['Multiple trials', 'Panic disorder']} />
            <RemedyCard name="L-Theanine" scientific="Amino acid" evidence="MODERATE" dosage="100-200 mg" mechanism="GABA production, alpha waves" benefits={['Anxiety without drowsiness', 'Rapid onset']} />
            <RemedyCard name="Passionflower" scientific="Passiflora incarnata" evidence="MODERATE" dosage="400-800 mg daily" mechanism="GABA/benzodiazepine receptor" benefits={['Multiple RCTs', 'Anxiety without sedation']} />
            <RemedyCard name="Chamomile" scientific="Matricaria chamomilla" evidence="MODERATE" dosage="1-2 cups tea TID" mechanism="Benzodiazepine-like" benefits={['Multiple RCTs', 'Mild-moderate anxiety']} cautions={['Rare allergic reactions']} />
            <RemedyCard name="Lemon Balm" scientific="Melissa officinalis" evidence="MODERATE" dosage="300-600 mg TID" mechanism="GABA modulation" benefits={['3+ trials', 'Synergistic with valerian']} />
          </div>
        </section>

        {/* BIPOLAR */}
        <section id="bipolar" className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2"><span>⚖️</span> Bipolar Disorders</h2>
          <p className="text-sm text-amber-400 bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">⚠️ ALWAYS with psychiatrist</p>
          <div className="grid gap-3">
            <RemedyCard name="Omega-3" scientific="EPA and DHA" evidence="MODERATE" dosage="1000-2000 mg EPA daily" mechanism="Cell membrane, anti-inflammation" benefits={['Multiple RCTs', 'Mood stabilization']} cautions={['Risk of mood destabilization']} />
            <RemedyCard name="Magnesium" scientific="Elemental Magnesium" evidence="EMERGING" dosage="200-400 mg daily" mechanism="GABA support" benefits={['Sleep support, mood adjunct']} />
            <RemedyCard name="Vitamin D" scientific="Cholecalciferol" evidence="EMERGING" dosage="2000-4000 IU daily" mechanism="Neuroprotection" benefits={['Deficiency worsens mood cycling']} />
            <RemedyCard name="NAC" scientific="N-Acetyl-Cysteine" evidence="EMERGING" dosage="1000-2000 mg BID" mechanism="Glutamate regulation" benefits={['Helpful in bipolar depression']} cautions={['May trigger mania']} />
          </div>
        </section>

        {/* TRAUMA */}
        <section id="trauma" className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2"><span>🛡️</span> Trauma and Stress</h2>
          <div className="grid gap-3">
            <RemedyCard name="Magnesium" scientific="Elemental Magnesium" evidence="MODERATE" dosage="200-400 mg daily" mechanism="HPA axis modulation" benefits={['Reduces nightmares, startle']} />
            <RemedyCard name="Omega-3" scientific="EPA and DHA" evidence="MODERATE" dosage="1000-2000 mg daily" mechanism="Neuroinflammation reduction" benefits={['Reduces intrusive memories']} />
            <RemedyCard name="Valerian" scientific="Valeriana officinalis" evidence="MODERATE" dosage="400-900 mg daily" mechanism="GABA agonist" benefits={['Sleep improvement, nightmare reduction']} />
            <RemedyCard name="Lavender" scientific="Lavandula angustifolia" evidence="MODERATE" dosage="80-160 mg daily" mechanism="GABA agonist" benefits={['Anxiety, hypervigilance']} />
            <RemedyCard name="Ashwagandha" scientific="Withania somnifera" evidence="MODERATE" dosage="300-600 mg BID" mechanism="HPA axis, cortisol" benefits={['Stress adaptation']} />
            <RemedyCard name="Rhodiola" scientific="Rhodiola rosea" evidence="MODERATE" dosage="300-600 mg daily" mechanism="Stress resilience" benefits={['Fatigue, stress resilience']} cautions={['Monitor in bipolar']} />
            <RemedyCard name="Reishi" scientific="Ganoderma lucidum" evidence="EMERGING" dosage="1000-2000 mg daily" mechanism="Sleep enhancement" benefits={['Nightmare reduction', 'Traditional use']} />
          </div>
        </section>

        {/* SUBSTANCE USE */}
        <section id="substance" className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2"><span>🌱</span> Substance Use</h2>
          <p className="text-sm text-amber-400 bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">⚠️ Adjunctive support only</p>
          <div className="grid gap-3">
            <RemedyCard name="Thiamine B1" scientific="Vitamin B1" evidence="STRONG" dosage="100-200 mg daily" mechanism="Prevents Wernickes encephalopathy" benefits={['Critical in AUD']} />
            <RemedyCard name="Magnesium" scientific="Elemental Magnesium" evidence="MODERATE" dosage="400-600 mg ER" mechanism="Glutamate regulation" benefits={['Prevents seizures', 'Reduces tremor']} />
            <RemedyCard name="Milk Thistle" scientific="Silybum marianum" evidence="MODERATE" dosage="200-300 mg TID" mechanism="Hepatocyte protection" benefits={['Liver function recovery']} />
            <RemedyCard name="NAC" scientific="N-Acetyl-Cysteine" evidence="EMERGING" dosage="1200-2400 mg daily" mechanism="Glutamate regulation" benefits={['Craving reduction']} />
            <RemedyCard name="Probiotics" scientific="Multi-strain" evidence="EMERGING" dosage="50+ billion CFU" mechanism="Gut restoration" benefits={['Microbiota inflammation']} />
            <RemedyCard name="GABA" scientific="GABA supplement" evidence="EMERGING" dosage="750-1500 mg daily" mechanism="Anxiety, craving" benefits={['Stress response modulation']} />
          </div>
        </section>

        {/* NEUROCOGNITIVE */}
        <section id="neuro" className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2"><span>🧠</span> Neurocognitive</h2>
          <div className="grid gap-3">
            <RemedyCard name="Ginkgo Biloba" scientific="Ginkgo biloba" evidence="MODERATE" dosage="120-240 mg daily" mechanism="Vascular function, antioxidant" benefits={['Multiple RCTs', 'Cognitive stabilization']} cautions={['Blood thinner interaction']} />
            <RemedyCard name="Curcumin" scientific="Curcuma longa" evidence="MODERATE" dosage="500-1000 mg TID with piperine" mechanism="Anti-amyloid, anti-inflammatory" benefits={['Multiple RCTs', 'Amyloid reduction']} />
            <RemedyCard name="Bacopa Monnieri" scientific="Bacopa monnieri" evidence="MODERATE" dosage="300-450 mg daily" mechanism="Neurotransmitter, memory" benefits={['Multiple RCTs', 'Memory improvement']} />
            <RemedyCard name="Lions Mane" scientific="Hericium erinaceus" evidence="EMERGING" dosage="1000-3000 mg daily" mechanism="NGF production" benefits={['Cognition improvement']} />
            <RemedyCard name="EGCG" scientific="Camellia sinensis" evidence="MODERATE" dosage="300-400 mg daily" mechanism="Tau/amyloid modulation" benefits={['Multiple trials', 'Neuroprotection']} />
            <RemedyCard name="Resveratrol" scientific="Japanese knotweed" evidence="EMERGING" dosage="150-500 mg daily" mechanism="Sirtuin activation" benefits={['Neuroprotection']} />
            <RemedyCard name="Huperzine A" scientific="Huperzia serrata" evidence="EMERGING" dosage="50-200 mcg daily" mechanism="Acetylcholinesterase inhibition" benefits={['Similar to Aricept']} />
          </div>
        </section>

        {/* SLEEP */}
        <section id="sleep" className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2"><span>😴</span> Sleep Disorders</h2>
          <div className="grid gap-3">
            <RemedyCard name="Valerian Root" scientific="Valeriana officinalis" evidence="STRONG" dosage="400-900 mg before bed" mechanism="GABA receptor agonist" benefits={['30+ trials', '15-20 min faster sleep', 'Safe long-term']} />
            <RemedyCard name="Passionflower" scientific="Passiflora incarnata" evidence="STRONG" dosage="400-800 mg before bed" mechanism="GABA/benzodiazepine" benefits={['Multiple RCTs', 'Sleep quality', 'Synergistic with valerian']} />
            <RemedyCard name="Chamomile" scientific="Matricaria chamomilla" evidence="STRONG" dosage="1-2 cups tea before bed" mechanism="Benzodiazepine-like" benefits={['Multiple RCTs']} cautions={['Rare allergic reactions']} />
            <RemedyCard name="Melatonin" scientific="Endogenous hormone" evidence="MODERATE" dosage="0.5-10 mg at bedtime" mechanism="Circadian rhythm" benefits={['40+ trials', 'Jet lag, shift work']} cautions={['Best for circadian issues']} />
            <RemedyCard name="Magnesium" scientific="Elemental Magnesium" evidence="MODERATE" dosage="200-400 mg at bed" mechanism="GABA synthesis" benefits={['Muscle relaxation', 'Sleep onset']} />
            <RemedyCard name="Reishi" scientific="Ganoderma lucidum" evidence="EMERGING" dosage="1000-2000 mg daily" mechanism="Sleep stage enhancement" benefits={['Dream quality', 'REM sleep']} />
            <RemedyCard name="Hops" scientific="Humulus lupulus" evidence="EMERGING" dosage="500-1000 mg before bed" mechanism="GABA modulation" benefits={['Traditional use']} />
            <RemedyCard name="Skullcap" scientific="Scutellaria lateriflora" evidence="EMERGING" dosage="500-1000 mg before bed" mechanism="Nervous system calming" benefits={['Traditional use']} />
          </div>
        </section>

        {/* Protocols */}
        <section className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">📋 Integration Protocols</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-emerald-400 mb-2">Depression Protocol</h3>
              <ol className="text-sm text-neutral-300 space-y-2 list-decimal list-inside">
                <li>Begin single agent (St Johns Wort or Saffron)</li>
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
