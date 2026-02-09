"""
OpenClaw Integration Routes

API endpoints for Organic OS to communicate with OpenClaw agents.
This enables multi-agent coaching and conversational capabilities.
"""
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List
import os
import json
from datetime import datetime

router = APIRouter(prefix="/api/v1/openclaw", tags=["openclaw"])

# ============ Models ============

class AgentMessage(BaseModel):
    message: str
    agent_id: Optional[str] = "coach"
    module_name: Optional[str] = None
    conversation_id: Optional[str] = None

class AgentResponse(BaseModel):
    response: str
    agent_id: str
    conversation_id: str
    suggestions: Optional[List[str]] = None

class AgentMemory(BaseModel):
    agent_id: str
    user_id: str
    memory_type: str  # "preference", "context", "learning", "goal"
    content: dict
    importance: int = 5  # 1-10

# ============ Agent Registry ============

AGENT_REGISTRY = {
    "coach": {
        "name": "Don Qui",
        "description": "Your personal AI coach for holistic development",
        "specialties": ["motivation", "goal-setting", "accountability"],
        "personality": "encouraging, wise, practical"
    },
    "socratic": {
        "name": "Socratic Guide",
        "description": "Uses questioning to help you discover answers",
        "specialties": ["critical thinking", "self-reflection", "values"],
        "personality": "inquisitive, thought-provoking, patient"
    },
    "wellness": {
        "name": "Wellness Navigator",
        "description": "Expert in health and wellness optimization",
        "specialties": ["sleep", "nutrition", "exercise", "stress"],
        "personality": "supportive, evidence-based, gentle"
    },
    "identity": {
        "name": "Identity Architect",
        "description": "Helps you discover and build your authentic self",
        "specialties": ["values", "purpose", "growth"],
        "personality": "deep, intuitive, empowering"
    }
}

# ============ Routes ============

@router.get("/agents")
async def list_agents() -> dict:
    """List all available OpenClaw agents"""
    return {
        "agents": [
            {
                "id": agent_id,
                "name": info["name"],
                "description": info["description"],
                "specialties": info["specialties"]
            }
            for agent_id, info in AGENT_REGISTRY.items()
        ]
    }

@router.get("/agents/{agent_id}")
async def get_agent(agent_id: str) -> dict:
    """Get details about a specific agent"""
    if agent_id not in AGENT_REGISTRY:
        raise HTTPException(status_code=404, detail="Agent not found")
    
    return {
        "id": agent_id,
        **AGENT_REGISTRY[agent_id]
    }

@router.post("/chat")
async def send_agent_message(message: AgentMessage) -> AgentResponse:
    """
    Send a message to an OpenClaw agent.
    This is the main entry point for agent conversations.
    """
    # Validate agent
    agent_id = message.agent_id or "coach"
    if agent_id not in AGENT_REGISTRY:
        raise HTTPException(status_code=404, detail="Agent not found")
    
    # In production, this would:
    # 1. Look up or create conversation
    # 2. Call OpenClaw API for response
    # 3. Store message and response
    # 4. Return response with suggestions
    
    agent = AGENT_REGISTRY[agent_id]
    conversation_id = message.conversation_id or f"conv_{datetime.now().timestamp()}"
    
    # Mock response for now - in production, call OpenClaw
    response_text = f"[{agent['name']}] "
    
    if "struggle" in message.message.lower() or "hard" in message.message.lower():
        response_text += "I hear that this is challenging. Remember, growth often comes from discomfort. What specific aspect feels most difficult?"
    elif "progress" in message.message.lower() or "improve" in message.message.lower():
        response_text += "That's wonderful progress! Let's celebrate what you've accomplished. What's been the most meaningful change for you?"
    else:
        response_text += f"I'm here to support you on your journey. Tell me more about what you'd like to explore in your {message.module_name or 'personal'} development."
    
    return AgentResponse(
        response=response_text,
        agent_id=agent_id,
        conversation_id=conversation_id,
        suggestions=[
            "Tell me more about what you're experiencing",
            "What's one small step you could take?",
            "Let's look at this from a different angle"
        ]
    )

@router.post("/memory")
async def store_agent_memory(memory: AgentMemory) -> dict:
    """
    Store a memory for an agent about the user.
    This enables persistent context across conversations.
    """
    # In production, store to Supabase or OpenClaw memory system
    # For now, just acknowledge
    
    return {
        "status": "stored",
        "agent_id": memory.agent_id,
        "memory_type": memory.memory_type,
        "importance": memory.importance,
        "timestamp": datetime.now().isoformat()
    }

@router.get("/memory/{user_id}")
async def get_agent_memories(user_id: str) -> dict:
    """
    Retrieve all agent memories for a user.
    """
    # In production, fetch from Supabase/OpenClaw
    return {
        "user_id": user_id,
        "memories": [
            {
                "type": "preference",
                "content": {"communication_style": "direct"},
                "importance": 7
            },
            {
                "type": "goal",
                "content": {"current_focus": "identity_development"},
                "importance": 9
            }
        ]
    }

@router.post("/roundtable")
async def start_roundtable_discussion(
    topic: str,
    agents: List[str],
    user_id: str
) -> dict:
    """
    Start a multi-agent discussion on a topic.
    Each agent provides their perspective.
    """
    valid_agents = [a for a in agents if a in AGENT_REGISTRY]
    if not valid_agents:
        raise HTTPException(status_code=400, detail="No valid agents specified")
    
    # In production, this would orchestrate multiple agent responses
    perspectives = []
    for agent_id in valid_agents:
        agent = AGENT_REGISTRY[agent_id]
        perspectives.append({
            "agent_id": agent_id,
            "agent_name": agent["name"],
            "perspective": f"From a {agent['personality']} perspective on '{topic}': "
                          f"{agent['name']} believes this connects to your journey of {', '.join(agent['specialties'][:2])}."
        })
    
    return {
        "topic": topic,
        "perspectives": perspectives,
        "synthesis": f"Three agents collaborated on this topic. The consensus emphasizes the importance of {valid_agents[0]}'s approach."
    }

@router.get("/health")
async def openclaw_health() -> dict:
    """Check OpenClaw integration health"""
    return {
        "status": "healthy",
        "service": "openclaw-integration",
        "agents_available": len(AGENT_REGISTRY),
        "capabilities": [
            "agent_chat",
            "agent_memory",
            "roundtable_discussion"
        ]
    }
