'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Send, MessageCircle, X, Sparkles } from 'lucide-react'

// Type definitions
type MessageRole = 'user' | 'assistant' | 'agent'

interface Message {
  id: string
  role: MessageRole
  content: string
  agent_id?: string
  timestamp: string
}

interface Agent {
  id: string
  name: string
  icon: string
  color: string
}

const AGENTS: Agent[] = [
  { id: 'coach', name: 'Don Qui', icon: '🤖', color: 'text-purple-500' },
  { id: 'socratic', name: 'Socratic', icon: '🎭', color: 'text-blue-500' },
  { id: 'wellness', name: 'Wellness', icon: '🌿', color: 'text-green-500' },
  { id: 'identity', name: 'Identity', icon: '👤', color: 'text-pink-500' },
]

const STORAGE_KEY = 'organic-os-agent-chat-history'

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

function createWelcomeMessage(agent: Agent): Message {
  return {
    id: generateId(),
    role: 'assistant',
    content: `Hi! I'm ${agent.name}, your ${agent.id} coach. How can I help you today?`,
    agent_id: agent.id,
    timestamp: new Date().toISOString()
  }
}

export default function AgentChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState<Agent>(AGENTS[0])
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Load chat history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const history: Message[] = JSON.parse(saved)
        setMessages(history)
      } else {
        setMessages([createWelcomeMessage(selectedAgent)])
      }
    } catch {
      setMessages([createWelcomeMessage(selectedAgent)])
    }
  }, [selectedAgent.id])

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Save messages to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
      } catch {
        console.warn('Failed to save chat history')
      }
    }
  }, [messages])

  const handleSend = useCallback(async () => {
    if (!input.trim() || loading) return

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString()
    }

    setLoading(true)
    setMessages((prev) => [...prev, userMessage])
    setInput('')

    try {
      const response = await fetch('/api/v1/openclaw/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,
          agent_id: selectedAgent.id,
          module_name: selectedAgent.id === 'wellness' ? 'wellness' : 
                       selectedAgent.id === 'identity' ? 'identity' : null
        })
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()
      
      const assistantMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: data.response || `I appreciate you sharing that with me. As your ${selectedAgent.name} coach, I'd encourage you to reflect on what this experience teaches you about yourself.`,
        agent_id: data.agent_id || selectedAgent.id,
        timestamp: new Date().toISOString()
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      // Fallback response on error
      const fallbackMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: `I appreciate you sharing that with me. As your ${selectedAgent.name} coach, I'd encourage you to reflect on what this experience teaches you about yourself.`,
        agent_id: selectedAgent.id,
        timestamp: new Date().toISOString()
      }
      setMessages((prev) => [...prev, fallbackMessage])
    }

    setLoading(false)
  }, [input, loading, selectedAgent])

  const handleSwitchAgent = useCallback((agent: Agent) => {
    setSelectedAgent(agent)
    setMessages([createWelcomeMessage(agent)])
  }, [])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }, [handleSend])

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-lg flex items-center justify-center z-50 hover:scale-110 transition-transform"
        aria-label="Open AI Chat"
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </button>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[32rem] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 text-white">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            <h3 className="font-semibold">AI Coach</h3>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-white/20 rounded"
            aria-label="Close chat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Agent Selector */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {AGENTS.map((agent) => (
            <button
              key={agent.id}
              onClick={() => handleSwitchAgent(agent)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
                selectedAgent.id === agent.id 
                  ? 'bg-white/30' 
                  : 'hover:bg-white/20'
              }`}
            >
              <span>{agent.icon}</span>
              <span>{agent.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-900">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                msg.role === 'user'
                  ? 'bg-purple-500 text-white rounded-br-md'
                  : 'bg-white dark:bg-slate-800 shadow-sm rounded-bl-md'
              }`}
            >
              {msg.role !== 'user' && msg.agent_id && (
                <p className={`text-xs font-medium mb-1 ${AGENTS.find(a => a.id === msg.agent_id)?.color}`}>
                  {AGENTS.find(a => a.id === msg.agent_id)?.name}
                </p>
              )}
              <p className="text-sm leading-relaxed">{msg.content}</p>
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-slate-800 rounded-2xl rounded-bl-md px-4 py-2 shadow-sm">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Message ${selectedAgent.name}...`}
            className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            aria-label="Chat message"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="w-10 h-10 bg-purple-500 hover:bg-purple-600 disabled:bg-slate-300 rounded-full flex items-center justify-center transition-colors"
            aria-label="Send message"
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}
