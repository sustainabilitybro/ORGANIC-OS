// Date formatting utilities

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return formatDate(d);
}

export function getStreak(days: number[]): number {
  if (days.length === 0) return 0;
  
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  for (let i = 0; i < days.length; i++) {
    const dayDate = new Date(today);
    dayDate.setDate(dayDate.getDate() - i);
    const dayStr = dayDate.toISOString().split('T')[0];
    
    if (days.includes(parseInt(dayStr.replace(/-/g, '')))) {
      streak++;
    } else if (i === 0) {
      // Allow for today not being recorded yet
      continue;
    } else {
      break;
    }
  }
  
  return streak;
}
