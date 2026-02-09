'use client'

import { DataExport, PushNotifications } from '@/components/ui'
import { Settings, User, Bell, Shield, Database, BarChart3 } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Settings className="w-8 h-8 text-indigo-500" />
          <h1 className="text-3xl font-bold">Settings</h1>
        </div>

        <div className="space-y-8">
          {/* Account Section */}
          <section className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-6 h-6 text-blue-500" />
              <h2 className="text-xl font-semibold">Account</h2>
            </div>
            <p className="text-slate-600 dark:text-slate-400">
              Manage your account settings and preferences.
            </p>
          </section>

          {/* Notifications Section */}
          <PushNotifications />

          {/* Data Export Section */}
          <DataExport />

          {/* Privacy Section */}
          <section className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-6 h-6 text-green-500" />
              <h2 className="text-xl font-semibold">Privacy & Security</h2>
            </div>
            <p className="text-slate-600 dark:text-slate-400">
              Control your data and privacy settings.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
