/**
 * API Utility Functions
 * Common helpers for API route handlers
 */

import { NextResponse } from 'next/server'

export interface ApiResponse<T = unknown> {
  data?: T
  error?: string
  message?: string
}

/**
 * Success response helper
 */
export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json({
    success: true,
    data,
    timestamp: new Date().toISOString()
  }, { status })
}

/**
 * Error response helper
 */
export function errorResponse(message: string, status = 400) {
  return NextResponse.json({
    success: false,
    error: message,
    timestamp: new Date().toISOString()
  }, { status })
}

/**
 * Paginated response helper
 */
export function paginatedResponse<T>(
  items: T[],
  page: number,
  limit: number,
  total: number
) {
  return NextResponse.json({
    success: true,
    data: items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total
    },
    timestamp: new Date().toISOString()
  })
}

/**
 * Validate required environment variables
 */
export function validateEnv(required: string[]): string[] {
  const missing: string[] = []
  
  for (const key of required) {
    if (!process.env[key]) {
      missing.push(key)
    }
  }
  
  return missing
}

/**
 * Rate limiting helper (simple in-memory implementation)
 * Note: For production, use Redis or similar
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export function checkRateLimit(
  identifier: string,
  limit = 100,
  windowMs = 60000
): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(identifier)
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + windowMs
    })
    return true
  }
  
  if (record.count >= limit) {
    return false
  }
  
  record.count++
  return true
}
