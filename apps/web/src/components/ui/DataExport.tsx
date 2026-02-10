'use client';

import { useState } from 'react';
import { Card } from '@/components/design-system';

export function DataExport() {
  const [exporting, setExporting] = useState(false);

  const handleExport = async (type: string) => {
    setExporting(true);
    // Simulate export
    await new Promise(resolve => setTimeout(resolve, 1500));
    alert(`Export ${type} - Feature ready when Supabase is configured`);
    setExporting(false);
  };

  return (
    <section className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        <h2 className="text-xl font-semibold">Data Export</h2>
      </div>
      <p className="text-slate-600 dark:text-slate-400 mb-4">
        Export your wellness data in various formats for personal records or analysis.
      </p>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => handleExport('JSON')}
          disabled={exporting}
          className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors disabled:opacity-50"
        >
          {exporting ? 'Exporting...' : 'Export as JSON'}
        </button>
        <button
          onClick={() => handleExport('CSV')}
          disabled={exporting}
          className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50"
        >
          Export as CSV
        </button>
        <button
          onClick={() => handleExport('PDF')}
          disabled={exporting}
          className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50"
        >
          Export as PDF
        </button>
      </div>
    </section>
  );
}
