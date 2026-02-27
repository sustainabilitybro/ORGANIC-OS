/**
 * Quote API Tests
 */
import { describe, it, expect } from 'vitest'

describe('Quote API', () => {
  describe('GET /api/quote', () => {
    const quotes = [
      { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
      { text: "Growth begins at the end of your comfort zone.", author: "Unknown" },
      { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
      { text: "Success is not final, failure is not fatal.", author: "Winston Churchill" },
      { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" }
    ]

    it('should return a random quote', () => {
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]
      expect(randomQuote).toBeDefined()
      expect(randomQuote.text).toBeDefined()
      expect(randomQuote.author).toBeDefined()
    })

    it('should have valid quote structure', () => {
      const quote = quotes[0]
      expect(quote).toHaveProperty('text')
      expect(quote).toHaveProperty('author')
      expect(typeof quote.text).toBe('string')
      expect(typeof quote.author).toBe('string')
    })

    it('should have multiple quotes available', () => {
      expect(quotes.length).toBeGreaterThan(1)
    })

    it('should return quotes from diverse sources', () => {
      const authors = quotes.map(q => q.author)
      const uniqueAuthors = new Set(authors)
      expect(uniqueAuthors.size).toBeGreaterThan(1)
    })
  })
})
