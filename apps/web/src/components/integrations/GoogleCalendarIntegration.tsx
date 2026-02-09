// Google Calendar Integration
// Calendar sync and wellness reminders

import React, { useState, useCallback, useEffect } from 'react';
import { Card, Button, Input, Badge, Switch } from '../design-system';

// ============ Types ============

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  location?: string;
  reminders?: ReminderConfig[];
}

interface ReminderConfig {
  minutesBefore: number;
  type: 'notification' | 'email';
}

interface WellnessReminder {
  id: string;
  title: string;
  time: string; // HH:MM
  days: string[]; // ['Mon', 'Tue', etc.]
  enabled: boolean;
  type: 'mood' | 'habit' | 'journal' | 'meditation';
}

interface CalendarIntegrationProps {
  onSync?: (events: CalendarEvent[]) => void;
  onReminderCreate?: (reminder: WellnessReminder) => void;
}

// ============ Calendar Component ============

export function GoogleCalendarIntegration({
  onSync,
  onReminderCreate
}: CalendarIntegrationProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [reminders, setReminders] = useState<WellnessReminder[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  
  // Simulated OAuth flow
  const connect = useCallback(async () => {
    setIsSyncing(true);
    // In production, this would open Google OAuth
    await new Promise(r => setTimeout(r, 1500));
    setIsConnected(true);
    setIsSyncing(false);
  }, []);
  
  const disconnect = useCallback(() => {
    setIsConnected(false);
    setEvents([]);
  }, []);
  
  const syncCalendar = useCallback(async () => {
    if (!isConnected) return;
    setIsSyncing(true);
    // In production, this would fetch from Google Calendar API
    await new Promise(r => setTimeout(r, 1000));
    // Mock events
    const mockEvents: CalendarEvent[] = [
      {
        id: '1',
        title: 'Morning Meditation',
        start: new Date(Date.now() + 86400000),
        end: new Date(Date.now() + 86400000 + 900000),
        description: 'Daily mindfulness practice',
      },
      {
        id: '2',
        title: 'Weekly Review',
        start: new Date(Date.now() + 172800000),
        end: new Date(Date.now() + 172800000 + 3600000),
      },
    ];
    setEvents(mockEvents);
    onSync?.(mockEvents);
    setIsSyncing(false);
  }, [isConnected, onSync]);
  
  const addReminder = useCallback((reminder: WellnessReminder) => {
    setReminders(prev => [...prev, reminder]);
    onReminderCreate?.(reminder);
  }, [onReminderCreate]);
  
  const toggleReminder = useCallback((id: string) => {
    setReminders(prev => 
      prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r)
    );
  }, []);
  
  const deleteReminder = useCallback((id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  }, []);
  
  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              'w-12 h-12 rounded-full flex items-center justify-center text-2xl',
              isConnected ? 'bg-green-100' : 'bg-neutral-100'
            )}>
              {isConnected ? '📅' : '🔗'}
            </div>
            <div>
              <h3 className="font-semibold">Google Calendar</h3>
              <p className="text-sm text-neutral-500">
                {isConnected ? 'Connected' : 'Not connected'}
              </p>
            </div>
          </div>
          {isConnected ? (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={syncCalendar}
                loading={isSyncing}
              >
                Sync
              </Button>
              <Button variant="ghost" onClick={disconnect}>
                Disconnect
              </Button>
            </div>
          ) : (
            <Button onClick={connect} loading={isSyncing}>
              Connect
            </Button>
          )}
        </div>
      </Card>
      
      {isConnected && (
        <>
          {/* Upcoming Events */}
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Upcoming Events</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowSettings(!showSettings)}>
                {showSettings ? 'Hide' : 'Settings'}
              </Button>
            </div>
            
            {events.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-neutral-500 mb-4">No wellness events synced</p>
                <Button variant="outline" onClick={syncCalendar} loading={isSyncing}>
                  Import from Calendar
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {events.map(event => (
                  <CalendarEventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </Card>
          
          {/* Wellness Reminders */}
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Wellness Reminders</h3>
            </div>
            
            <ReminderList
              reminders={reminders}
              onToggle={toggleReminder}
              onDelete={deleteReminder}
            />
            
            <AddReminderForm onAdd={addReminder} />
          </Card>
          
          {/* Auto-sync Settings */}
          {showSettings && (
            <Card>
              <h3 className="font-semibold mb-4">Sync Settings</h3>
              <div className="space-y-4">
                <Switch
                  label="Auto-sync calendar"
                  checked={true}
                  onChange={() => {}}
                />
                <Switch
                  label="Add wellness events to calendar"
                  checked={true}
                  onChange={() => {}}
                />
                <Switch
                  label="Sync reminders bidirectionally"
                  checked={false}
                  onChange={() => {}}
                />
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
}

// ============ Supporting Components ============

function CalendarEventCard({ event }: { event: CalendarEvent }) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };
  
  const formatDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    }
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };
  
  return (
    <div className="flex items-start gap-3 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
      <div className="text-center min-w-[3rem]">
        <div className="text-xs text-neutral-500">{formatDate(event.start)}</div>
        <div className="font-semibold">{formatTime(event.start)}</div>
      </div>
      <div className="flex-1">
        <h4 className="font-medium">{event.title}</h4>
        {event.description && (
          <p className="text-sm text-neutral-500">{event.description}</p>
        )}
        {event.location && (
          <p className="text-sm text-neutral-400">📍 {event.location}</p>
        )}
      </div>
      <Badge variant={event.type === 'meditation' ? 'success' : 'default'}>
        {event.type || 'Event'}
      </Badge>
    </div>
  );
}

function ReminderList({
  reminders,
  onToggle,
  onDelete
}: {
  reminders: WellnessReminder[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  if (reminders.length === 0) {
    return (
      <p className="text-center text-neutral-500 py-4">
        No reminders set. Add your first wellness reminder below.
      </p>
    );
  }
  
  return (
    <div className="space-y-2">
      {reminders.map(reminder => (
        <div 
          key={reminder.id}
          className={cn(
            'flex items-center justify-between p-3 rounded-lg',
            reminder.enabled 
              ? 'bg-neutral-50 dark:bg-neutral-800' 
              : 'bg-neutral-100 dark:bg-neutral-700 opacity-60'
          )}
        >
          <div className="flex items-center gap-3">
            <Switch
              checked={reminder.enabled}
              onChange={() => onToggle(reminder.id)}
            />
            <div>
              <p className="font-medium">{reminder.title}</p>
              <p className="text-sm text-neutral-500">
                {reminder.time} • {reminder.days.join(', ')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={reminder.type === 'meditation' ? 'success' : 'default'}>
              {reminder.type}
            </Badge>
            <Button variant="ghost" size="sm" onClick={() => onDelete(reminder.id)}>
              ✕
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

function AddReminderForm({ onAdd }: { onAdd: (reminder: WellnessReminder) => void }) {
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState<Partial<WellnessReminder>>({
    title: '',
    time: '09:00',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    enabled: true,
    type: 'habit',
  });
  
  const dayOptions = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  const toggleDay = (day: string) => {
    setForm(prev => ({
      ...prev,
      days: prev.days?.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...(prev.days || []), day]
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) return;
    
    onAdd({
      id: Date.now().toString(),
      title: form.title!,
      time: form.time!,
      days: form.days as string[],
      enabled: true,
      type: form.type as WellnessReminder['type'],
    });
    
    setForm({
      title: '',
      time: '09:00',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      enabled: true,
      type: 'habit',
    });
    setIsAdding(false);
  };
  
  if (!isAdding) {
    return (
      <Button variant="outline" className="w-full" onClick={() => setIsAdding(true)}>
        + Add Reminder
      </Button>
    );
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
      <Input
        label="Reminder title"
        placeholder="e.g., Morning meditation"
        value={form.title || ''}
        onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
        required
      />
      
      <div>
        <label className="block text-sm font-medium mb-1">Time</label>
        <input
          type="time"
          value={form.time || '09:00'}
          onChange={(e) => setForm(prev => ({ ...prev, time: e.target.value }))}
          className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-neutral-700"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Days</label>
        <div className="flex gap-2">
          {dayOptions.map(day => (
            <button
              key={day}
              type="button"
              onClick={() => toggleDay(day)}
              className={cn(
                'px-3 py-1 rounded-full text-sm border',
                form.days?.includes(day)
                  ? 'bg-primary-500 text-white border-primary-500'
                  : 'border-neutral-300'
              )}
            >
              {day.slice(0, 2)}
            </button>
          ))}
        </div>
      </div>
      
      <Select
        label="Reminder type"
        value={form.type || 'habit'}
        onChange={(e) => setForm(prev => ({ ...prev, type: e.target.value as WellnessReminder['type'] }))}
        options={[
          { value: 'mood', label: '😊 Mood check-in' },
          { value: 'habit', label: '✓ Habit reminder' },
          { value: 'journal', label: '📝 Journaling' },
          { value: 'meditation', label: '🧘 Meditation' },
        ]}
      />
      
      <div className="flex gap-2">
        <Button type="submit">Add</Button>
        <Button type="button" variant="ghost" onClick={() => setIsAdding(false)}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

// ============ Utility ============

function cn(...inputs: (string | undefined | null | false)[]) {
  return inputs.filter(Boolean).join(' ');
}

// ============ Export ============

export type { CalendarEvent, WellnessReminder, CalendarIntegrationProps };
