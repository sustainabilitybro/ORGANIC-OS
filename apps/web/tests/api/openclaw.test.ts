/**
 * OpenClaw Agent API Tests
 */
import { describe, it, expect } from 'vitest'

describe('OpenClaw Agent API', () => {
  // Mock agent data
  const agents = [
    { id: 'coach', name: 'Wellness Coach', description: 'Guides wellness journey' },
    { id: 'socratic', name: 'Socratic Guide', description: 'Asks powerful questions' },
    { id: 'wellness', name: 'Wellness Expert', description: 'Health and nutrition advice' },
    { id: 'identity', name: 'Identity Explorer', description: 'Helps discover authentic self' },
  ]

  describe('Agent Registry', () => {
    it('should have all required agents', () => {
      const agentIds = agents.map(a => a.id)
      expect(agentIds).toContain('coach')
      expect(agentIds).toContain('socratic')
      expect(agentIds).toContain('wellness')
      expect(agentIds).toContain('identity')
    })

    it('should have valid agent structure', () => {
      agents.forEach(agent => {
        expect(agent).toHaveProperty('id')
        expect(agent).toHaveProperty('name')
        expect(agent).toHaveProperty('description')
      })
    })
  })

  describe('Message Handling', () => {
    interface Message {
      id: string
      agentId: string
      content: string
      role: 'user' | 'assistant'
      timestamp: number
    }

    const createMessage = (agentId: string, content: string, role: 'user' | 'assistant'): Message => ({
      id: `msg_${Date.now()}`,
      agentId,
      content,
      role,
      timestamp: Date.now()
    })

    it('should create user message', () => {
      const msg = createMessage('coach', 'Hello', 'user')
      expect(msg.role).toBe('user')
      expect(msg.agentId).toBe('coach')
    })

    it('should create assistant message', () => {
      const msg = createMessage('coach', 'Hello! How can I help?', 'assistant')
      expect(msg.role).toBe('assistant')
    })
  })

  describe('Conversation Management', () => {
    interface Conversation {
      id: string
      agentId: string
      messages: { content: string; role: string }[]
      createdAt: number
      updatedAt: number
    }

    const createConversation = (agentId: string): Conversation => ({
      id: `conv_${Date.now()}`,
      agentId,
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    })

    it('should create new conversation', () => {
      const conv = createConversation('coach')
      expect(conv.messages).toHaveLength(0)
      expect(conv.agentId).toBe('coach')
    })

    it('should add message to conversation', () => {
      const conv = createConversation('coach')
      conv.messages.push({ content: 'Hello', role: 'user' })
      conv.updatedAt = Date.now()
      expect(conv.messages).toHaveLength(1)
    })
  })

  describe('Memory System', () => {
    interface Memory {
      id: string
      userId: string
      content: string
      importance: number
      createdAt: number
    }

    const createMemory = (userId: string, content: string, importance: number): Memory => ({
      id: `mem_${Date.now()}`,
      userId,
      content,
      importance: Math.min(10, Math.max(1, importance)),
      createdAt: Date.now()
    })

    it('should create memory with valid importance', () => {
      const mem = createMemory('user1', 'Important info', 8)
      expect(mem.importance).toBe(8)
    })

    it('should clamp importance to 1-10', () => {
      const memHigh = createMemory('user1', 'Info', 15)
      const memLow = createMemory('user1', 'Info', -5)
      expect(memHigh.importance).toBe(10)
      expect(memLow.importance).toBe(1)
    })
  })

  describe('Agent Selection', () => {
    const getRecommendedAgent = (goal: string): string => {
      const recommendations: Record<string, string> = {
        'wellness': 'coach',
        'identity': 'identity',
        'self-discovery': 'identity',
        'health': 'wellness',
        'questions': 'socratic',
        'default': 'coach'
      }
      
      const goalLower = goal.toLowerCase()
      const key = Object.keys(recommendations).find(k => goalLower.includes(k))
      return recommendations[key || 'default']
    }

    it('should recommend coach for wellness goals', () => {
      expect(getRecommendedAgent('I want to improve my wellness')).toBe('coach')
    })

    it('should recommend identity for identity-related goals', () => {
      expect(getRecommendedAgent('I want to explore my identity')).toBe('identity')
    })

    it('should recommend socratic for questions', () => {
      expect(getRecommendedAgent('I have some questions')).toBe('socratic')
    })

    it('should default to coach for unknown goals', () => {
      expect(getRecommendedAgent('Random goal')).toBe('coach')
    })
  })
})
