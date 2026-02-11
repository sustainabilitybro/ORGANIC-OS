'use client';

import { Bell, BellOff, Smartphone, Settings2 } from 'lucide-react';
import { useState, useEffect } from 'react';

interface NotificationSettings {
  enabled: boolean;
  dailyReminder: boolean;
  weeklyReview: boolean;
  goalAchievement: boolean;
  streakMilestone: boolean;
}

export function PushNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [settings, setSettings] = useState<NotificationSettings>({
    enabled: false,
    dailyReminder: true,
    weeklyReview: true,
    goalAchievement: true,
    streakMilestone: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
    const stored = localStorage.getItem('notificationSettings');
    if (stored) {
      setSettings(JSON.parse(stored));
    }
  }, []);

  const requestPermission = async () => {
    setLoading(true);
    try {
      const perm = await Notification.requestPermission();
      setPermission(perm);
      if (perm === 'granted') {
        setSettings(prev => ({ ...prev, enabled: true }));
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleSetting = (key: keyof NotificationSettings) => {
    if (!settings.enabled) return;
    setSettings(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      localStorage.setItem('notificationSettings', JSON.stringify(updated));
      return updated;
    });
  };

  const getPermissionLabel = () => {
    switch (permission) {
      case 'granted': return { text: 'Enabled', color: 'text-green-500' };
      case 'denied': return { text: 'Blocked', color: 'text-red-500' };
      default: return { text: 'Not Set', color: 'text-yellow-500' };
    }
  };

  const permLabel = getPermissionLabel();

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
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Enable push notifications to receive reminders and updates
          </p>
          <button
            onClick={requestPermission}
            disabled={loading}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? 'Enabling...' : 'Enable Notifications'}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <ToggleSetting
            label="Daily Reminder"
            description="Get reminded to log your wellness activities"
            enabled={settings.dailyReminder}
            onToggle={() => toggleSetting('dailyReminder')}
            disabled={!settings.enabled}
          />
          <ToggleSetting
            label="Weekly Review"
            description="Receive your weekly wellness summary"
            enabled={settings.weeklyReview}
            onToggle={() => toggleSetting('weeklyReview')}
            disabled={!settings.enabled}
          />
          <ToggleSetting
            label="Goal Achievement"
            description="Get notified when you complete goals"
            enabled={settings.goalAchievement}
            onToggle={() => toggleSetting('goalAchievement')}
            disabled={!settings.enabled}
          />
          <ToggleSetting
            label="Streak Milestone"
            description="Celebrate your consistency achievements"
            enabled={settings.streakMilestone}
            onToggle={() => toggleSetting('streakMilestone')}
            disabled={!settings.enabled}
          />
        </div>
      )}
    </div>
  );
}

interface ToggleSettingProps {
  label: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

function ToggleSetting({ label, description, enabled, onToggle, disabled }: ToggleSettingProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-700 last:border-0">
      <div className="flex items-center gap-3">
        <Settings2 className="w-5 h-5 text-slate-400" />
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
        } ${disabled ? 'opacity-50' : ''}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}
