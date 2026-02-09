from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from uuid import uuid4
from datetime import datetime

router = APIRouter()

# In-memory storage (replace with database)
conversations = {}
messages = {}


# Pydantic schemas
class ChatRequest(BaseModel):
    message: str
    module_name: str
    conversation_id: Optional[str] = None
    context: Optional[dict] = None


class ChatResponse(BaseModel):
    response: str
    conversation_id: str
    suggestions: List[str] = []


# AI coaching prompts by module
COACHING_PROMPTS = {
    "identity": [
        "What values guide your decisions?",
        "How do you define your authentic self?",
        "What would your ideal future self say?"
    ],
    "sensory": [
        "What sensory experiences bring you joy?",
        "How aware are you of your senses right now?",
        "What senses do you neglect in daily life?"
    ],
    "emotional": [
        "What emotion is present for you now?",
        "What is this emotion trying to tell you?",
        "How do you typically respond to difficult emotions?"
    ],
    "wellness": [
        "What does wellness mean to you?",
        "What area of your health needs most attention?",
        "What's one small wellness habit you could start today?"
    ],
    "recovery": [
        "How do you recognize burnout in yourself?",
        "What activities restore your energy?",
        "What's your current stress level and why?"
    ],
    "communication": [
        "What communication challenge are you facing?",
        "How can you express yourself more authentically?",
        "What prevents you from speaking up?"
    ],
    "sustainability": [
        "What's one sustainable change you could make?",
        "How does your consumption align with your values?",
        "What environmental issues matter most to you?"
    ],
    "holistic-alchemy": [
        "What transformation are you seeking?",
        "What aspects of yourself are ready to integrate?",
        "What practices support your growth right now?"
    ],
    "atom-economy": [
        "What processes in your life need optimization?",
        "How can you be more efficient with your energy?",
        "What waste do you want to eliminate?"
    ],
    "video": [
        "What would you share if no one judged you?",
        "What message do you want to put out into the world?",
        "How does it feel to be seen and heard?"
    ]
}


async def get_ai_response(module_name: str, message: str, history: List[dict]) -> str:
    """Get AI response placeholder."""
    responses = {
        "identity": "That's a profound question about who you are...",
        "sensory": "Noticing your senses can be a powerful practice...",
        "emotional": "Emotions are messengers. What might this one be telling you?",
        "wellness": "Taking time to focus on wellness is always worthwhile...",
        "recovery": "Recovery isn't just rest—it's active restoration...",
        "communication": "Effective communication starts with self-awareness...",
        "sustainability": "Small changes compound into significant impact...",
        "holistic-alchemy": "The journey of transformation is never linear...",
        "atom-economy": "Efficiency isn't about doing more—it's about doing what matters...",
        "video": "Your voice and perspective matter. What do you want to share?"
    }
    return responses.get(module_name, "I hear you. Tell me more about that...")


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest) -> ChatResponse:
    """Main chat endpoint for AI coaching."""
    conversation_id = request.conversation_id or str(uuid4())
    
    if conversation_id not in conversations:
        conversations[conversation_id] = {
            "id": conversation_id,
            "module_name": request.module_name,
            "message_count": 0,
            "created_at": datetime.now()
        }
        messages[conversation_id] = []
    
    messages[conversation_id].append({
        "role": "user",
        "content": request.message,
        "timestamp": datetime.now()
    })
    
    response = await get_ai_response(
        request.module_name,
        request.message,
        messages[conversation_id]
    )
    
    messages[conversation_id].append({
        "role": "assistant",
        "content": response,
        "timestamp": datetime.now()
    })
    
    conversations[conversation_id]["message_count"] += 2
    suggestions = COACHING_PROMPTS.get(request.module_name, [])[:3]
    
    return ChatResponse(
        response=response,
        conversation_id=conversation_id,
        suggestions=suggestions
    )


@router.get("/prompts/{module_name}")
async def get_module_prompts(module_name: str):
    """Get coaching prompts for a specific module."""
    return {
        "module": module_name,
        "prompts": COACHING_PROMPTS.get(module_name, [
            "What are you working on?",
            "What's on your mind?",
            "How can I help you today?"
        ])
    }
