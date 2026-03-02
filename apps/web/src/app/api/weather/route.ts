import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

interface WeatherData {
  temperature: number
  condition: string
  humidity: number
  wind_speed: number
  location: string
}

export async function GET(request: NextRequest) {
  const city = request.nextUrl.searchParams.get('city') || 'Berlin'
  
  // Using Open-Meteo API (free, no API key required)
  try {
    // First get coordinates for the city
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`
    )
    
    if (!geoRes.ok) {
      throw new Error('Failed to get coordinates')
    }
    
    const geoData = await geoRes.json()
    
    if (!geoData.results || geoData.results.length === 0) {
      return NextResponse.json({ error: 'City not found' }, { status: 404 })
    }
    
    const { latitude, longitude, name, country } = geoData.results[0]
    
    // Get weather data
    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`
    )
    
    if (!weatherRes.ok) {
      throw new Error('Failed to get weather')
    }
    
    const weatherData = await weatherRes.json()
    
    const conditionCodes: Record<number, string> = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Foggy',
      48: 'Depositing rime fog',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      80: 'Rain showers',
      95: 'Thunderstorm'
    }
    
    const weather: WeatherData = {
      temperature: Math.round(weatherData.current.temperature_2m),
      condition: conditionCodes[weatherData.current.weather_code] || 'Unknown',
      humidity: weatherData.current.relative_humidity_2m,
      wind_speed: Math.round(weatherData.current.wind_speed_10m),
      location: `${name}, ${country}`
    }
    
    return NextResponse.json({
      ...weather,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({
      temperature: 22,
      condition: 'Partly cloudy',
      humidity: 65,
      wind_speed: 12,
      location: city,
      timestamp: new Date().toISOString(),
      source: 'fallback'
    })
  }
}
