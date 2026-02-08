// Wellness Dashboard Page
// Entry point from dashboard navigation

import Link from 'next/link';

export default function WellnessDashboardPage() {
  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">🌿 Wellness Module</h1>
          <p className="text-neutral-400">Evidence-based natural remedies and holistic health protocols</p>
        </div>

        <div className="grid gap-6">
          {/* Quick Actions */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <Link
                href="/wellness"
                className="bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-lg p-4 transition-colors"
              >
                <div className="text-2xl mb-2">🧬</div>
                <h3 className="font-medium">Browse Remedies</h3>
                <p className="text-sm text-neutral-400">Explore evidence-based natural solutions</p>
              </Link>
              <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-4 opacity-50 cursor-not-allowed">
                <div className="text-2xl mb-2">📋</div>
                <h3 className="font-medium">Protocol Builder</h3>
                <p className="text-sm text-neutral-400">Coming soon</p>
              </div>
            </div>
          </div>

          {/* Featured Remedies */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Featured Remedies</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-neutral-800 rounded-lg p-4">
                <div className="text-2xl mb-2">🌿</div>
                <h3 className="font-medium">Turmeric</h3>
                <p className="text-sm text-neutral-400">Anti-inflammatory</p>
              </div>
              <div className="bg-neutral-800 rounded-lg p-4">
                <div className="text-2xl mb-2">🌱</div>
                <h3 className="font-medium">Ashwagandha</h3>
                <p className="text-sm text-neutral-400">Adaptogen</p>
              </div>
              <div className="bg-neutral-800 rounded-lg p-4">
                <div className="text-2xl mb-2">🍄</div>
                <h3 className="font-medium">Lion's Mane</h3>
                <p className="text-sm text-neutral-400">Cognitive support</p>
              </div>
            </div>
          </div>

          {/* Link to full module */}
          <div className="text-center">
            <Link
              href="/wellness"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Open Full Wellness Module →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
