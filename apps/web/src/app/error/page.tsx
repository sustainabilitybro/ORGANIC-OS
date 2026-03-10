'use client'

import { Card, Button } from '@/components/design-system'
import { AlertTriangle, Home, RefreshCw } from 'lucide-react'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-8">
      <Card className="max-w-md p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-red-100 rounded-full">
            <AlertTriangle className="w-12 h-12 text-red-600" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-[#3A3226] mb-2">
          Something went wrong
        </h1>
        
        <p className="text-gray-600 mb-6">
          We encountered an unexpected error. Please try again or return to the homepage.
        </p>
        
        {error.digest && (
          <p className="text-sm text-gray-400 mb-6 font-mono">
            Error ID: {error.digest}
          </p>
        )}
        
        <div className="flex gap-4 justify-center">
          <Button onClick={reset} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try again
          </Button>
          <Button onClick={() => window.location.href = "/" }>
            <Home className="w-4 h-4 mr-2" />
            Go home
          </Button>
        </div>
      </Card>
    </div>
  )
}
