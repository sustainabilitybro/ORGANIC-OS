import Link from 'next/link'
import { Card, Button } from '@/components/design-system'
import { Home, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-8">
      <Card className="max-w-md p-8 text-center">
        <h1 className="text-6xl font-bold text-[#6B7F3B] mb-4">404</h1>
        <h2 className="text-2xl font-bold text-[#3A3226] mb-2">
          Page Not Found
        </h2>
        <p className="text-gray-600 mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="flex gap-4 justify-center">
          <Link href="/">
            <Button>
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}
