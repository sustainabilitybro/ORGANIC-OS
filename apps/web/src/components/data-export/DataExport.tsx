'use client'

import { useState, useCallback } from 'react'
import { Download, Upload, FileJson, Shield, CheckCircle, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client';
const supabase = createClient();

// Type definitions for export/import data
interface UserData {
  id: string
  email?: string
  full_name?: string
  avatar_url?: string
  created_at?: string
}

interface WellnessEntry {
  id?: string
  user_id?: string
  date: string
  sleep_hours?: number
  water_intake_ml?: number
  exercise_minutes?: number
  meditation_minutes?: number
  mood_score?: number
  energy_level?: number
  nutrition_notes?: string
  created_at?: string
}

interface ModuleProgress {
  id?: string
  user_id?: string
  module_name: string
  progress_percentage?: number
  completed_topics?: string[]
  current_focus?: string
  notes?: string
  last_activity?: string
}

interface Conversation {
  id?: string
  user_id?: string
  module_name: string
  topic?: string
  message_count?: number
  created_at?: string
}

interface Message {
  id?: string
  conversation_id?: string
  role: 'user' | 'assistant'
  content: string
  tokens_used?: number
  created_at?: string
}

interface ExportData {
  user: UserData
  wellnessEntries: WellnessEntry[]
  moduleProgress: ModuleProgress[]
  conversations: Conversation[]
  messages: Message[]
  exportedAt: string
}

interface Status {
  type: 'success' | 'error' | null
  message: string
}

export default function DataExport() {
  const [exporting, setExporting] = useState(false)
  const [importing, setImporting] = useState(false)
  const [status, setStatus] = useState<Status>({ type: null, message: '' })

  const handleExport = useCallback(async () => {
    setExporting(true)
    setStatus({ type: null, message: 'Preparing data...' })
    
    try {
      // Fetch all user data
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setStatus({ type: 'error', message: 'Not authenticated' })
        setExporting(false)
        return
      }

      // Fetch data in parallel
      const [wellnessRes, progressRes, conversationsRes] = await Promise.all([
        supabase.from('wellness_entries').select('*').eq('user_id', user.id),
        supabase.from('module_progress').select('*').eq('user_id', user.id),
        supabase.from('conversations').select('*').eq('user_id', user.id)
      ])

      const exportData: ExportData = {
        user: {
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name,
          avatar_url: user.user_metadata?.avatar_url,
          created_at: user.created_at
        },
        wellnessEntries: wellnessRes.data || [],
        moduleProgress: progressRes.data || [],
        conversations: conversationsRes.data || [],
        messages: [],
        exportedAt: new Date().toISOString()
      }

      // Create and download JSON file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `organic-os-export-${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)

      setStatus({ 
        type: 'success', 
        message: `Exported ${exportData.wellnessEntries.length} wellness entries, ${exportData.moduleProgress.length} module progress records` 
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setStatus({ type: 'error', message: `Export failed: ${errorMessage}` })
    }
    
    setExporting(false)
  }, [])

  const handleImport = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setImporting(true)
    setStatus({ type: null, message: 'Reading file...' })

    try {
      const text = await file.text()
      const data: ExportData = JSON.parse(text)

      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setStatus({ type: 'error', message: 'Not authenticated' })
        setImporting(false)
        return
      }

      // Import wellness entries
      if (data.wellnessEntries?.length > 0) {
        const entries = data.wellnessEntries.map((entry: WellnessEntry) => ({
          ...entry,
          user_id: user.id
        }))
        await supabase.from('wellness_entries').upsert(entries)
      }

      // Import module progress
      if (data.moduleProgress?.length > 0) {
        const progress = data.moduleProgress.map((progressItem: ModuleProgress) => ({
          ...progressItem,
          user_id: user.id
        }))
        await supabase.from('module_progress').upsert(progress)
      }

      setStatus({ 
        type: 'success', 
        message: `Imported ${data.wellnessEntries?.length || 0} wellness entries, ${data.moduleProgress?.length || 0} module progress records` 
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setStatus({ type: 'error', message: `Import failed: ${errorMessage}` })
    }

    setImporting(false)
  }, [])

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <FileJson className="w-6 h-6 text-green-500" />
        <h2 className="text-xl font-semibold">Data Export / Import</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Export Section */}
        <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Download className="w-5 h-5 text-blue-500" />
            <h3 className="font-medium">Export Your Data</h3>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            Download all your wellness entries, module progress, and conversation history as a JSON file.
          </p>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            aria-label="Export all data"
          >
            {exporting ? 'Exporting...' : 'Export All Data'}
          </button>
        </div>

        {/* Import Section */}
        <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Upload className="w-5 h-5 text-orange-500" />
            <h3 className="font-medium">Import Data</h3>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            Restore from a previous Organic OS export file. This will merge with existing data.
          </p>
          <label className="block w-full px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium text-center cursor-pointer transition-colors">
            {importing ? 'Importing...' : 'Select Export File'}
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
              aria-label="Import data file"
            />
          </label>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg flex items-start gap-3">
        <Shield className="w-5 h-5 text-green-500 mt-0.5" />
        <div className="text-sm">
          <p className="font-medium">Your data stays private</p>
          <p className="text-slate-600 dark:text-slate-400">
            All data is exported/imported directly between your browser and Supabase. 
            No data is sent to any third-party servers.
          </p>
        </div>
      </div>

      {/* Status Message */}
      {status.message && (
        <div 
          className={`mt-4 p-3 rounded-lg flex items-center gap-2 ${
            status.type === 'success' ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 
            status.type === 'error' ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400' : 
            'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
          }`}
          role="alert"
        >
          {status.type === 'success' ? <CheckCircle className="w-5 h-5" /> : 
           status.type === 'error' ? <AlertCircle className="w-5 h-5" /> : null}
          <span>{status.message}</span>
        </div>
      )}
    </div>
  )
}
