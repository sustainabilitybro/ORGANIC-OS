'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/design-system'

const navItems = [
  { name: 'Overview', href: '/dashboard', icon: '🏠' },
  { name: 'Identity', href: '/dashboard/identity', icon: '👤' },
  { name: 'Sensory', href: '/dashboard/sensory', icon: '👁️' },
  { name: 'Emotional', href: '/dashboard/emotional', icon: '💚' },
  { name: 'Wellness', href: '/dashboard/wellness', icon: '🌿' },
  { name: 'Recovery', href: '/dashboard/recovery', icon: '🔋' },
  { name: 'Communication', href: '/dashboard/communication', icon: '🎤' },
  { name: 'Holistic Alchemy', href: '/holistic-alchemy', icon: '🧪' },
  { name: 'Atom Economy', href: '/atom-economy', icon: '⚛️' },
  { name: 'Analytics', href: '/analytics', icon: '📊' },
  { name: 'Settings', href: '/settings', icon: '⚙️' },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isOverview = pathname === '/dashboard'

  return (
    <div className="min-h-screen bg-background-primary flex">
      {/* Sidebar - hidden on overview */}
      {!isOverview && (
        <aside className="w-64 bg-background-secondary border-r border-surface-secondary flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-surface-secondary">
            <Link href="/" className="text-xl font-display font-bold text-gradient">
              Organic OS
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200',
                    isActive
                      ? 'bg-accent-primary/10 text-accent-primary'
                      : 'text-text-secondary hover:bg-surface-secondary hover:text-text-primary'
                  )}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-surface-secondary">
            <div className="flex items-center gap-3 px-4 py-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-primary to-accent-tertiary flex items-center justify-center text-lg">
                🤖
              </div>
              <div>
                <p className="font-medium text-text-primary">Don Qui</p>
                <p className="text-xs text-text-muted">AI Assistant</p>
              </div>
            </div>
          </div>
        </aside>
      )}

      {/* Main content */}
      <main className={cn('flex-1', !isOverview && 'overflow-auto')}>
        {children}
      </main>
    </div>
  )
}
