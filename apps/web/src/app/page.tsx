import Link from 'next/link'

export default function Home() {
  const modules = [
    {
      name: 'Identity',
      slug: 'identity',
      description: 'Discover and clarify your authentic self',
      icon: '👤',
      color: 'from-accent-primary to-emerald-700'
    },
    {
      name: 'Sensory',
      slug: 'sensory',
      description: 'Explore and optimize your human senses',
      icon: '👁️',
      color: 'from-blue-400 to-blue-700'
    },
    {
      name: 'Emotional',
      slug: 'emotional',
      description: 'Master emotional intelligence',
      icon: '💚',
      color: 'from-pink-400 to-pink-700'
    },
    {
      name: 'Wellness',
      slug: 'wellness',
      description: 'Holistic health and vitality',
      icon: '🌿',
      color: 'from-green-400 to-green-700'
    },
    {
      name: 'Recovery',
      slug: 'recovery',
      description: 'Burnout prevention and stress management',
      icon: '🔋',
      color: 'from-amber-400 to-amber-700'
    },
    {
      name: 'Communication',
      slug: 'communication',
      description: 'Master the art of expression',
      icon: '🎤',
      color: 'from-purple-400 to-purple-700'
    }
  ]

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-background-primary via-background-secondary to-background-tertiary" />
        
        {/* Animated orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-primary/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-warm/10 rounded-full blur-3xl animate-pulse-slow" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-6xl md:text-8xl font-display font-bold mb-6">
            <span className="text-gradient">Organic OS</span>
          </h1>
          <p className="text-xl md:text-2xl text-text-secondary max-w-3xl mx-auto mb-12">
            The Operating System for Being Human.
            <br />
            Identity. Senses. Emotions. Wellness. Recovery. Communication.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard" className="btn-primary text-lg px-8 py-4">
              Enter Your OS →
            </Link>
            <button className="btn-secondary text-lg px-8 py-4">
              Learn More
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <span className="text-text-muted text-sm">↓</span>
        </div>
      </section>

      {/* Modules Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-center mb-4">
            Six Modules.
            <br />
            <span className="text-text-secondary">One Integrated System.</span>
          </h2>
          <p className="text-text-secondary text-center text-lg max-w-2xl mx-auto mb-16">
            Every aspect of human development, interconnected and optimized for your growth.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module) => (
              <Link 
                key={module.slug} 
                href={`/dashboard/${module.slug}`}
                className="card-hover group"
              >
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${module.color} flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {module.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-accent-primary transition-colors">
                  {module.name}
                </h3>
                <p className="text-text-secondary">
                  {module.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* AI Coach Section */}
      <section className="py-24 px-6 bg-background-secondary/50">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-accent-primary font-medium mb-4 block">AI-POWERED</span>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Your Personal AI Coach
          </h2>
          <p className="text-text-secondary text-lg mb-8 max-w-2xl mx-auto">
            Powered by MiniMax. Always learning. Always available. 
            Get personalized guidance across every module of your organic operating system.
          </p>
          <Link href="/dashboard" className="btn-primary text-lg px-8 py-4">
            Meet Your Coach →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-surface-secondary">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-text-muted">
            © 2026 Organic OS. Built by humans, for humans.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="link text-sm">Privacy</Link>
            <Link href="/terms" className="link text-sm">Terms</Link>
            <Link href="/docs" className="link text-sm">Documentation</Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
