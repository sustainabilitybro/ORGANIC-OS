import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'gradient' | 'glass'
  hover?: boolean
}

export function Card({
  children,
  className,
  variant = 'default',
  hover = false,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border',
        variant === 'default' && 'bg-background-card border-surface-secondary',
        variant === 'gradient' && 'bg-gradient-to-br from-accent-primary/10 to-accent-warm/10 border-accent-primary/20',
        variant === 'glass' && 'bg-white/5 backdrop-blur-xl border-white/10',
        hover && 'transition-all hover:scale-[1.02] hover:shadow-lg',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({
  children,
  className,
  variant = 'primary',
  size = 'md',
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium transition-colors',
        variant === 'primary' && 'bg-accent-primary hover:bg-accent-primary/90 text-white',
        variant === 'secondary' && 'bg-surface-secondary hover:bg-surface-secondary/80 text-text-primary',
        variant === 'ghost' && 'hover:bg-white/5 text-text-secondary hover:text-text-primary',
        size === 'sm' && 'px-3 py-1.5 text-sm',
        size === 'md' && 'px-4 py-2',
        size === 'lg' && 'px-6 py-3 text-lg',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

interface ProgressBarProps {
  value: number
  max?: number
  color?: string
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

export function ProgressBar({
  value,
  max = 100,
  color = 'bg-gradient-to-r from-accent-primary to-accent-tertiary',
  size = 'md',
  showLabel = false,
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100)
  
  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between mb-1 text-sm">
          <span className="text-text-secondary">Progress</span>
          <span className="text-accent-primary font-medium">{Math.round(percentage)}%</span>
        </div>
      )}
      <div
        className={cn(
          'w-full bg-surface-secondary rounded-full overflow-hidden',
          size === 'sm' && 'h-1.5',
          size === 'md' && 'h-2',
          size === 'lg' && 'h-3'
        )}
      >
        <div
          className={cn('h-full rounded-full transition-all duration-500', color)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

interface StatCardProps {
  label: string
  value: string | number
  icon: string
  trend?: { value: number; positive: boolean }
  color?: string
}

export function StatCard({ label, value, icon, trend, color = 'from-accent-primary to-accent-tertiary' }: StatCardProps) {
  return (
    <Card className="relative overflow-hidden">
      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${color} opacity-10 rounded-bl-full`} />
      <div className="relative">
        <span className="text-3xl mb-2 block">{icon}</span>
        <p className="text-3xl font-bold text-gradient mb-1">{value}</p>
        <p className="text-sm text-text-muted">{label}</p>
        {trend && (
          <p className={cn(
            'text-sm mt-2',
            trend.positive ? 'text-emerald-400' : 'text-red-400'
          )}>
            {trend.positive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </p>
        )}
      </div>
    </Card>
  )
}

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
}

export function Badge({ children, variant = 'default' }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variant === 'default' && 'bg-surface-secondary text-text-secondary',
        variant === 'success' && 'bg-emerald-500/20 text-emerald-400',
        variant === 'warning' && 'bg-amber-500/20 text-amber-400',
        variant === 'error' && 'bg-red-500/20 text-red-400',
        variant === 'info' && 'bg-blue-500/20 text-blue-400'
      )}
    >
      {children}
    </span>
  )
}

interface ModuleCardProps {
  name: string
  description: string
  icon: string
  progress: number
  href: string
  gradient: string
  isNew?: boolean
}

export function ModuleCard({ name, description, icon, progress, href, gradient, isNew }: ModuleCardProps) {
  return (
    <Link href={href}>
      <Card hover className="h-full flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-2xl shadow-lg`}>
            {icon}
          </div>
          {isNew && <Badge variant="info">New</Badge>}
        </div>
        
        <h3 className="text-lg font-semibold mb-1">{name}</h3>
        <p className="text-text-secondary text-sm mb-4 flex-1">{description}</p>
        
        {progress > 0 ? (
          <>
            <div className="w-full bg-surface-secondary rounded-full h-2 mb-2">
              <div
                className={`h-2 rounded-full bg-gradient-to-r ${gradient}`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-text-muted">{progress}% complete</p>
          </>
        ) : (
          <Badge variant="default">Not Started</Badge>
        )}
      </Card>
    </Link>
  )
}

interface PromptCardProps {
  prompt: string
  category: string
  onComplete?: () => void
}

export function PromptCard({ prompt, category, onComplete }: PromptCardProps) {
  return (
    <Card variant="gradient" className="bg-gradient-to-br from-accent-primary/10 via-background-card to-accent-warm/10">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-primary to-accent-tertiary flex items-center justify-center text-xl flex-shrink-0">
          ✨
        </div>
        <div className="flex-1">
          <Badge variant="info" className="mb-2">{category}</Badge>
          <p className="text-lg font-medium mb-4">"{prompt}"</p>
          <div className="flex gap-3">
            <Button size="sm" onClick={onComplete}>Reflect →</Button>
            <Button size="sm" variant="ghost">Skip</Button>
          </div>
        </div>
      </div>
    </Card>
  )
}

// Data Export
export { default as DataExport } from '../data-export/DataExport'

// Push Notifications
export { default as PushNotifications } from '../ui/PushNotifications'

// Search
export { default as SearchBar } from '../ui/SearchBar'

// Agent Chat
export { default as AgentChat } from '../ui/AgentChat'
