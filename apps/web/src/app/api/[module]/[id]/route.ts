import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

const VALID_MODULES = [
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

export async function GET(
  request: NextRequest,
  { params }: { params: { module: string; id: string } }
) {
  try {
    const { module, id } = params
    
    if (!module || !VALID_MODULES.includes(module)) {
      return NextResponse.json({ error: 'Invalid module' }, { status: 400 })
    }

    const res = await query(`SELECT * FROM ${module} WHERE id = $1`, [id])
    
    if (res.rows.length === 0) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    
    return NextResponse.json({ data: res.rows[0] })
  } catch (error: any) {
    console.error('API Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { module: string; id: string } }
) {
  try {
    const body = await request.json()
    const { module, id } = params
    const { data } = body
    
    if (!module || !VALID_MODULES.includes(module)) {
      return NextResponse.json({ error: 'Invalid module' }, { status: 400 })
    }

    const columns = Object.keys(data).filter(k => k !== 'id').map((k, i) => `${k} = $${i + 1}`).join(', ')
    const values = Object.values(data).filter((_: any, i: number) => Object.keys(data)[i] !== 'id')

    const res = await query(
      `UPDATE ${module} SET ${columns}, updated_at = NOW() WHERE id = $${
        values.length + 1
      } RETURNING *`,
      [...values, id]
    )
    
    if (res.rows.length === 0) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    
    return NextResponse.json({ data: res.rows[0] })
  } catch (error: any) {
    console.error('API Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { module: string; id: string } }
) {
  try {
    const { module, id } = params
    
    if (!module || !VALID_MODULES.includes(module)) {
      return NextResponse.json({ error: 'Invalid module' }, { status: 400 })
    }

    const res = await query(`DELETE FROM ${module} WHERE id = $1 RETURNING id`, [id])
    
    if (res.rows.length === 0) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('API Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
