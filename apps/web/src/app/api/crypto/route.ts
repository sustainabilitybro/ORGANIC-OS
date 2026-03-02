import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

interface CryptoPrice {
  symbol: string
  name: string
  price: number
  change_24h: number
  market_cap: number
}

export async function GET() {
  try {
    // Using CoinGecko's free API (no API key required for basic usage)
    const res = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana,cardano&order=market_cap_desc&per_page=4&page=1&sparkline=false',
      {
        next: { revalidate: 60 } // Cache for 1 minute
      }
    )
    
    if (!res.ok) {
      // Fallback to mock data if API fails
      return NextResponse.json({
        source: 'fallback',
        prices: [
          { symbol: 'BTC', name: 'Bitcoin', price: 67000, change_24h: 2.5, market_cap: 1300000000000 },
          { symbol: 'ETH', name: 'Ethereum', price: 3500, change_24h: 1.8, market_cap: 420000000000 },
          { symbol: 'SOL', name: 'Solana', price: 180, change_24h: 5.2, market_cap: 80000000000 },
          { symbol: 'ADA', name: 'Cardano', price: 0.65, change_24h: -1.2, market_cap: 23000000000 }
        ] as CryptoPrice[]
      })
    }
    
    const data = await res.json()
    
    const prices: CryptoPrice[] = data.map((coin: any) => ({
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      price: coin.current_price,
      change_24h: coin.price_change_percentage_24h || 0,
      market_cap: coin.market_cap
    }))
    
    return NextResponse.json({
      source: 'coingecko',
      prices,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({
      error: 'Failed to fetch crypto prices'
    }, { status: 500 })
  }
}
