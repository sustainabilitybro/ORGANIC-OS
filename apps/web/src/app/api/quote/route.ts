import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

interface Quote {
  text: string
  author: string
  category: string
}

const quotes: Quote[] = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs", category: "motivation" },
  { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs", category: "innovation" },
  { text: "Stay hungry, stay foolish.", author: "Steve Jobs", category: "motivation" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt", category: "dreams" },
  { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle", category: "resilience" },
  { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins", category: "motivation" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill", category: "resilience" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb", category: "action" },
  { text: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs", category: "motivation" },
  { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", author: "Nelson Mandela", category: "resilience" },
  { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein", category: "opportunity" },
  { text: "What you get by achieving your goals is not as important as what you become by achieving your goals.", author: "Zig Ziglar", category: "growth" },
  { text: "The mind is everything. What you think you become.", author: "Buddha", category: "mindset" },
  { text: "Strive not to be a success, but rather to be of value.", author: "Albert Einstein", category: "values" },
  { text: "The best revenge is massive success.", author: "Frank Sinatra", category: "motivation" },
  { text: "People often say that motivation doesn't last. Well, neither does bathing — that's why we recommend it daily.", author: "Zig Ziglar", category: "motivation" },
  { text: "I have not failed. I've just found 10,000 ways that won't work.", author: "Thomas Edison", category: "innovation" },
  { text: "A person who never made a mistake never tried anything new.", author: "Albert Einstein", category: "innovation" },
  { text: "The only limit to our realization of tomorrow is our doubts of today.", author: "Franklin D. Roosevelt", category: "motivation" },
  { text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt", category: "action" }
]

export async function GET() {
  const randomIndex = Math.floor(Math.random() * quotes.length)
  const quote = quotes[randomIndex]
  
  return NextResponse.json({
    ...quote,
    total: quotes.length,
    timestamp: new Date().toISOString()
  })
}
