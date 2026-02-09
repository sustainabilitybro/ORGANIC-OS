'use client'

import { useState, useEffect } from 'react'
import { Bell, BellOff, Check, X, Settings, Smartphone, Mail } from 'lucide-react'

interface NotificationSettings {
  enabled: boolean
  wellnessReminders: boolean
  dailyPrompts: boolean
  moduleUpdates: boolean
  aiCoaching: boolean
  streakAlerts: boolean
}

export default function PushNotifications() {
  const [settings, setSettings] = useState<NotificationSettings>({
    enabled: false,
    wellnessReminders: true,
    dailyPrompts: true,
    moduleUpdates: true,
    aiCoaching: true,
    streakAlerts: true,
  })
  const [loading, setLoading] = useState(false)
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [subscribed, setSubscribed] = useState(false)

  useEffect(() => {
    // Check current permission status
    if ('Notification' in window) {
      setPermission(Notification.permission)
    }
    
    // Load saved settings
    const saved = localStorage.getItem('notificationSettings')
    if (saved) {
      setSettings(JSON.parse(saved))
    }
    
    // Check if already subscribed
    const subscription = localStorage.getItem('pushSubscription')
    setSubscribed(!!subscription)
  }, [])

  const saveSettings = (newSettings: NotificationSettings) => {
    setSettings(newSettings)
    localStorage.setItem('notificationSettings', JSON.stringify(newSettings))
  }

  const requestPermission = async () => {
    setLoading(true)
    try {
      if (!('Notification' in window)) {
        alert('Push notifications are not supported in your browser')
        setLoading(false)
        return
      }

      const perm = await Notification.requestPermission()
      setPermission(perm)
      
      if (perm === 'granted') {
        // In production, this would register with OneSignal/Push API
        const subscription = {
          endpoint: 'https://example.push.service/...' + Date.now(),
          keys: { p256dh: '...', auth: '...' }
        }
        localStorage.setItem('pushSubscription', JSON.stringify(subscription))
        setSubscribed(true)
        saveSettings({ ...settings, enabled: true })
        new Notification('Organic OS', {
          body: 'Push notifications enabled! You\'ll receive helpful reminders.',
          icon: '/icon-192.png'
        })
      }
    } catch (error) {
      console.error('Permission error:', error)
    }
    setLoading(false)
  }

  const disableNotifications = () => {
    setPermission('denied')
    setSubscribed(false)
    localStorage.removeItem('pushSubscription')
    saveSettings({ ...settings, enabled: false })
  }

  const toggleSetting = (key: keyof NotificationSettings) => {
    if (!settings.enabled) return
    saveSettings({ ...settings, [key]: !settings[key] })
  }

  const getPermissionLabel = () => {
    switch (permission) {
      case 'granted': return { text: 'Enabled', color: 'text-green-500' }
      case 'denied': return { text: 'Blocked', color: 'text-red-500' }
      default: return { text: 'Not Set', color: 'text-yellow-500' }
    }
  }

  const permLabel = getPermissionLabel()

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        {settings.enabled ? (
          <Bell className="w-6 h-6 text-green-500" />
        ) : (
          <BellOff className="w-6 h-6 text-slate-400" />
        )}
        <h2 className="text-xl font-semibold">Push Notifications</h2>
        <span className={`text-sm font-medium ${permLabel.color}`}>
          ({permLabel.text})
        </span>
      </div>

      {permission !== 'granted' ? (
        <div className="text-center py-8">
          <Smartphone className="w-16 h-16 mx-auto mb-4 text-slate-300" />
          <h3 className="text-lg font-medium mb-2">Enable Push Notifications</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
            Get reminded to log wellness, stay on track with your modules, 
            and receive AI coaching tips throughout the day.
          </p>
          <button
            onClick={requestPermission}
            disabled={loading || permission === 'denied'}
            className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Requesting...' : permission === 'denied' ? 'Notifications Blocked' : 'Enable Notifications'}
          </button>
          {permission === 'denied' && (
            <p className="mt-4 text-sm text-red-500">
              Please enable notifications in your browser settings.
            </p>
          )}
        </div>
      ) : (
        <>
          {/* Toggle Master Switch */}
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-lg mb-6">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-indigo-500" />
              <span className="font-medium">Master Switch</span>
            </div>
            <button
              onClick={settings.enabled ? disableNotifications : undefined}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                settings.enabled ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  settings.enabled ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Notification Types */}
          <div className="space-y-4">
            <h3 className="font-medium text-slate-500 uppercase text-sm tracking-wider mb-4">
              Notification Types
            </h3>

            <NotificationToggle
              label="Wellness Reminders"
              description="Morning and evening reminders to log your wellness data"
              enabled={settings.wellnessReminders}
              onToggle={() => toggleSetting('wellnessReminders')}
              disabled={!settings.enabled}
              icon="🌿"
            />

            <NotificationToggle
              label="Daily Prompts"
              description="New reflection prompts and gratitude exercises each day"
              enabled={settings.dailyPrompts}
              onToggle={() => toggleSetting('dailyPrompts')}
              disabled={!settings.enabled}
              icon="✨"
            />

            <NotificationToggle
              label="Module Updates"
              description="Progress updates and new content in your active modules"
              enabled={settings.moduleUpdates}
              onToggle={() => toggleSetting('moduleUpdates')}
              disabled={!settings.enabled}
              icon="📚"
            />

            <NotificationToggle
 Coaching"
              description="Personalized coaching tips and conversation              label="AI starters"
              enabled={settings.aiCoaching}
              onToggle={() => toggleSetting('aiCoaching')}
              disabled={!settings.enabled}
              icon="🤖"
            />

            <NotificationToggle
              label="Streak Alerts"
              description="Reminders when your streak is at risk"
              enabled={settings.streakAlerts}
              onToggle={() => toggleSetting('streakAlerts')}
              disabled={!settings.enabled}
              icon="🔥"
            />
          </div>

          {/* Schedule */}
          <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Settings className="w-5 h-5 text-slate-400" />
              <h4 className="font-medium">Notification Schedule</h4>
            </div>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-500">Morning Reminder</p>
                <p className="font-medium">8:00 AM</p>
              </div>
              <div>
                <p className="text-slate-500">Evening Check-in</p>
                <p className="font-medium">8:00 PM</p>
              </div>
            </div>
          </div>

          {/* Subscribed Status */}
          {subscribed && (
            <div className="mt-6 flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
              <Check className="w-4 h-4" />
              <span>Push notifications are active</span>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function NotificationToggle({ 
  label, 
  description, 
  enabled, 
  onToggle, 
  disabled,
  icon 
}: {
  label: string
  description: string
  enabled: boolean
  onToggle: () => void
  disabled: boolean
  icon: string
}) {
  return (
    <div className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
      enabled ? 'bg-white dark:bg-slate-700' : 'bg-slate-50 dark:bg-slate-900 opacity-60'
    }`}>
      <div className="flex items-start gap-3">
        <span className="text-xl">{icon}</span>
        <div>
          <p className="font-medium">{label}</p>
          <p className="text-sm text-slate-500">{description}</p>
        </div>
      </div>
      <button
        onClick={onToggle}
        disabled={disabled}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          enabled ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'
        } disabled:opacity-50`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  )
}
