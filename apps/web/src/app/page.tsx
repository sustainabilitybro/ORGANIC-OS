'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

export const dynamic = 'force-dynamic'

export default function Home() {
  const { user, signOut } = useAuth()

  const modules = [
    {
      name: 'Identity',
      href: '/identity',
      icon: '👤',
      description: 'Discover your authentic self',
      color: 'from-emerald-500 to-teal-600',
    },
    {
      name: 'Sensory',
      href: '/sensory',
      icon: '👁️',
      description: 'Explore and optimize your senses',
      color: 'from-cyan-500 to-blue-600',
    },
    {
      name: 'Emotional',
      href: '/emotional',
      icon: '💚',
      description: 'Master emotional intelligence',
      color: 'from-green-500 to-emerald-600',
    },
    {
      name: 'Wellness',
      href: '/wellness',
      icon: '🌿',
      description: 'Holistic health & natural remedies',
      color: 'from-lime-500 to-green-600',
    },
    {
      name: 'Recovery',
      href: '/recovery',
      icon: '🔋',
      description: 'Burnout prevention & stress management',
      color: 'from-amber-500 to-orange-600',
    },
    {
      name: 'Communication',
      href: '/communication',
      icon: '🎤',
      description: 'Public speaking & expression',
      color: 'from-purple-500 to-violet-600',
    },
    {
      name: 'Sustainability',
      href: '/sustainability',
      icon: '🌱',
      description: 'Carbon footprint & eco-living',
      color: 'from-emerald-600 to-green-600',
    },
    {
      name: 'Holistic Alchemy',
      href: '/holistic-alchemy',
      icon: '🧪',
      description: 'Transform consciousness through alchemical practices',
      color: 'from-purple-600 to-violet-700',
    },
    {
      name: 'Atom Economy',
      href: '/atom-economy',
      icon: '⚛️',
      description: 'Optimizing chemical processes for sustainability',
      color: 'from-cyan-600 to-blue-700',
    },
    {
      name: 'Video',
      href: '/video',
      icon: '📹',
      description: 'Practice & create on camera',
      color: 'from-rose-500 to-pink-600',
    },
  ]

  return (
    <div className="min-h-screen bg-neutral-950">
      {/* User Banner */}
      {user && (
        <div className="bg-emerald-900/20 border-b border-emerald-500/20">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-emerald-400">✓</span>
              <span className="text-emerald-300">Signed in as {user.email}</span>
            </div>
            <button
              onClick={() => signOut()}
              className="text-sm text-neutral-400 hover:text-white transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-neutral-950 to-neutral-950" />
        <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center">
            <h1 className="text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Organic OS
              </span>
            </h1>
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto mb-8">
              The Operating System for Being Human. A unified platform for identity, senses, 
              emotions, wellness, recovery, sustainability, and expression.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href={user ? '/dashboard' : '/auth'}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-lg font-medium transition-colors"
              >
                {user ? 'Go to Dashboard →' : 'Get Started →'}
              </Link>
              <a
                href="#modules"
                className="bg-neutral-800 hover:bg-neutral-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Explore Modules
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-20 border-y border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '🧠',
                title: 'Know Yourself',
                description: 'Identity, values, and purpose discovery through structured introspection.',
              },
              {
                icon: '⚖️',
                title: 'Balance Your Life',
                description: 'Stress management, burnout prevention, and sustainable energy.',
              },
              {
                icon: '🌱',
                title: 'Grow Holistically',
                description: 'Natural remedies, emotional mastery, and expressive communication.',
              },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <span className="text-4xl mb-4 block">{item.icon}</span>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-neutral-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section id="modules" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Platform Modules</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module) => (
              <Link
                key={module.name}
                href={module.href}
                className="group relative overflow-hidden bg-neutral-900 border border-neutral-800 rounded-2xl p-6 hover:border-neutral-700 transition-all hover:scale-[1.02]"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${module.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                <span className="text-4xl mb-4 block">{module.icon}</span>
                <h3 className="text-xl font-semibold mb-2">{module.name}</h3>
                <p className="text-neutral-400 text-sm">{module.description}</p>
                <div className="mt-4 flex items-center text-sm text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  Access Module →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* AI Coach Section */}
      <section className="py-20 bg-neutral-900/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-4xl mb-4 block">🤖</span>
          <h2 className="text-3xl font-bold mb-4">AI Coaching Throughout</h2>
          <p className="text-neutral-400 mb-8">
            Your personal AI coach guides you through every module, providing personalized 
            insights, motivation, and recommendations based on your progress.
          </p>
          <div className="grid md:grid-cols-3 gap-4 text-left">
            {[
              'Personalized feedback on exercises',
              'Adaptive difficulty based on your growth',
              'Integration across all modules',
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-2 text-sm">
                <span className="text-emerald-400">✓</span>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="font-semibold">Organic OS</p>
              <p className="text-sm text-neutral-400">The Operating System for Being Human</p>
            </div>
            <p className="text-sm text-neutral-500">
              Built with Next.js + Supabase + MiniMax
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
