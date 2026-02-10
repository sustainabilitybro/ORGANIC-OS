'use client';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
  trend?: { value: number; positive: boolean };
  color?: string;
}

export function StatCard({ label, value, icon, trend, color = 'from-emerald-500 to-teal-500' }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 border border-neutral-200 dark:border-neutral-800">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-neutral-500 dark:text-neutral-400">{label}</span>
        <span className="text-2xl">{icon}</span>
      </div>
      <div className="text-3xl font-bold mb-2">{value}</div>
      {trend && (
        <div className={`text-sm ${trend.positive ? 'text-green-500' : 'text-red-500'}`}>
          {trend.positive ? '↑' : '↓'} {Math.abs(trend.value)}%
        </div>
      )}
    </div>
  );
}
