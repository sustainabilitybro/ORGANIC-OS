'use client';

interface ProgressBarProps {
  progress: number;
  color?: string;
  showLabel?: boolean;
}

export function ProgressBar({ progress, color = 'from-emerald-500 to-teal-500', showLabel = true }: ProgressBarProps) {
  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between text-sm mb-1">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
      )}
      <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
        <div 
          className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-500`}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    </div>
  );
}
