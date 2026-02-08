import OpenAI from 'openai'

// Configure MiniMax as OpenAI-compatible API
const minimax = new OpenAI({
  apiKey: process.env.MINIMAX_API_KEY || process.env.OPENAI_API_KEY,
  baseURL: process.env.MINIMAX_BASE_URL || 'https://api.minimax.io/v1',
})

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface CoachingRequest {
  module: string
  context: string
  userMessage: string
  history?: ChatMessage[]
}

export async function getAIResponse(request: CoachingRequest): Promise<string> {
  const systemPrompt = `You are an AI coach for Organic OS, a personal development platform.
  
Module: ${request.module}
Context: ${request.context}

Your role is to:
- Provide thoughtful, personalized guidance
- Ask clarifying questions when needed
- Offer practical, actionable advice
- Be encouraging but honest
- Help users discover their own answers

Keep responses concise but meaningful. 2-4 sentences usually, more if the topic warrants depth.`

  const messages: ChatMessage[] = [
    { role: 'system', content: systemPrompt },
    ...(request.history || []),
    { role: 'user', content: request.userMessage }
  ]

  const response = await minimax.chat.completions.create({
    model: 'MiniMax-M2.1', // or whatever MiniMax model is available
    messages: messages as any,
    temperature: 0.7,
    max_tokens: 500,
  })

  return response.choices[0]?.message?.content || 'I need a moment to think about that. Can you ask again?'
}

export async function getCompletion(prompt: string): Promise<string> {
  const response = await minimax.completions.create({
    model: 'MiniMax-M2.1',
    prompt,
    temperature: 0.7,
    max_tokens: 500,
  })

  return response.choices[0]?.text || ''
}
