import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

// Valid modules that can be accessed
const VALID_TABLES = [
  'users',
  'identity_profiles',
  'sensory_preferences',
  'mood_entries',
  'emotional_patterns',
  'wellness_metrics',
  'activities',
  'recovery_sessions',
  'burnout_metrics',
  'communication_entries',
  'speaking_practice',
  'eco_habits',
  'carbon_footprint',
  'user_progress',
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const tableName = searchParams.get('tableName')
    
    if (!tableName || !VALID_TABLES.includes(tableName)) {
      return NextResponse.json(
        { error: `Invalid table. Valid: ${VALID_TABLES.join(', ')}` },
        { status: 400 }
      )
    }

    const res = await query(`SELECT * FROM ${tableName} ORDER BY created_at DESC LIMIT 100`)
    return NextResponse.json({ data: res.rows })
  } catch (error: any) {
    console.error('API Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { tableName, data } = body
    
    if (!tableName || !VALID_TABLES.includes(tableName)) {
      return NextResponse.json(
        { error: `Invalid table. Valid: ${VALID_TABLES.join(', ')}` },
        { status: 400 }
      )
    }

    const columns = Object.keys(data).join(', ')
    const values = Object.values(data).map((v: any) => 
      typeof v === 'object' ? JSON.stringify(v) : v
    )
    const placeholders = values.map((_, i) => `$${i + 1}`).join(', ')

    const res = await query(
      `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders}) RETURNING *`,
      values
    )
    
    return NextResponse.json({ data: res.rows[0] }, { status: 201 })
  } catch (error: any) {
    console.error('API Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
