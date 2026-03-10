'use client'

import { useState, useEffect } from 'react'
import { Card, Spinner } from '@/components/design-system'
import { CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react'

interface ServiceStatus {
  status: string
  latency?: number
}

interface SystemStatus {
  timestamp: string
  services: Record<string, ServiceStatus>
  overall: string
}

export default function StatusPage() {
  const [status, setStatus] = useState<SystemStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStatus() {
      try {
        const res = await fetch('/api/system')
        if (!res.ok) throw new Error('Failed to fetch status')
        const data = await res.json()
        setStatus(data)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchStatus()
    const interval = setInterval(fetchStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error || !status) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] p-8">
        <Card className="p-8 max-w-md mx-auto">
          <div className="flex items-center gap-3 text-red-600">
            <XCircle className="w-6 h-6" />
            <h2 className="text-xl font-semibold">Status Unavailable</h2>
          </div>
          <p className="mt-4 text-gray-600">{error || 'Unable to load status'}</p>
        </Card>
      </div>
    )
  }

  const getIcon = (serviceStatus: string) => {
    switch (serviceStatus) {
      case 'operational':
        return <CheckCircle className="w-6 h-6 text-green-500" />
      case 'degraded':
        return <AlertCircle className="w-6 h-6 text-yellow-500" />
      case 'local':
        return <Clock className="w-6 h-6 text-blue-500" />
      default:
        return <XCircle className="w-6 h-6 text-gray-400" />
    }
  }

  const services = [
    { name: 'GitHub API', key: 'github', description: 'Code repositories and API' },
    { name: 'Supabase', key: 'supabase', description: 'Database and authentication' },
    { name: 'Vercel', key: 'vercel', description: 'Hosting and edge functions' }
  ]

  return (
    <div className="min-h-screen bg-[#FAF8F5] p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#3A3226]">System Status</h1>
            <p className="text-gray-600 mt-1">Real-time system health monitor</p>
          </div>
          <div className={`px-4 py-2 rounded-full ${
            status.overall === 'operational' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
          }`}>
            <span className="font-semibold capitalize">{status.overall}</span>
          </div>
        </div>

        <div className="space-y-4">
          {services.map((service) => {
            const serviceStatus = status.services[service.key]
            const serviceState = serviceStatus?.status || 'unknown'
            const latency = serviceStatus?.latency
            return (
              <Card key={service.key} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {getIcon(serviceState)}
                    <div>
                      <h3 className="font-semibold text-lg">{service.name}</h3>
                      <p className="text-sm text-gray-500">{service.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-medium capitalize">{serviceState}</span>
                    {latency && (
                      <p className="text-sm text-gray-500">{latency}ms</p>
                    )}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        <p className="text-center text-gray-500 text-sm mt-8">
          Last updated: {new Date(status.timestamp).toLocaleString()}
        </p>
      </div>
    </div>
  )
}
