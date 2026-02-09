export { PushNotifications } from './PushNotifications';
export { Card } from '@/components/design-system';
export { Progress } from '@/components/design-system';

// Placeholder components
export const StatCard = ({ title, value, icon, color }: any) => (
  <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow">
    <p className="text-sm text-slate-500">{title}</p>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

export const ProgressBar = ({ value, max }: any) => (
  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${Math.min(100, (value / max) * 100)}%` }} />
  </div>
);

export const DataExport = () => (
  <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow">
    <h3 className="font-semibold mb-2">Export Your Data</h3>
    <p className="text-sm text-slate-500">Download all your wellness data as JSON or CSV.</p>
  </div>
);
