"""
Additional Free API Integrations
Expands Organic OS data sources with more free APIs
"""

from fastapi import APIRouter, HTTPException
from typing import Optional, List, Dict, Any
from pydantic import BaseModel
import httpx
import asyncio

router = APIRouter(prefix="/api/v1/additional", tags=["additional-integrations"])


# ============ Response Models ============

class QuoteResponse(BaseModel):
    quote: str
    author: str
    category: str

class FactResponse(BaseModel):
    fact: str
    category: str
    source: str

class TriviaResponse(BaseModel):
    question: str
    answer: str
    category: str
    difficulty: str

class NewsResponse(BaseModel):
    title: str
    description: str
    url: str
    source: str
    published_at: str

class LyricsResponse(BaseModel):
    title: str
    artist: str
    lyrics: str
    source: str

class DefinitionResponse(BaseModel):
    word: str
    definition: str
    part_of_speech: str
    example: Optional[str]


# ============ API Clients ============

async def fetch_quote() -> QuoteResponse:
    """Fetch random quote from ZenQuotes"""
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get("https://zenquotes.io/api/random")
            if resp.status_code == 200:
                data = resp.json()[0]
                return QuoteResponse(
                    quote=data.get("q", ""),
                    author=data.get("a", ""),
                    category="inspiration"
                )
    except Exception:
        pass
    
    # Fallback quotes
    quotes = [
        {"q": "The only way to do great work is to love what you do.", "a": "Steve Jobs", "category": "inspiration"},
        {"q": "Growth begins when we start to accept our own weakness.", "a": "Jean Vanier", "category": "growth"},
        {"q": "The present moment is the only time over which we have dominion.", "a": "Thích Nhất Hạnh", "category": "mindfulness"},
    ]
    import random
    q = random.choice(quotes)
    return QuoteResponse(quote=q["q"], author=q["a"], category=q["category"])


async def fetch_fact() -> FactResponse:
    """Fetch random fact from Useless Facts or similar"""
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get("https://uselessfacts.jsph.pl/api/v2facts/random.php?language=en")
            if resp.status_code == 200:
                data = resp.json()
                return FactResponse(
                    fact=data.get("text", ""),
                    category="general",
                    source="uselessfacts"
                )
    except Exception:
        pass
    
    # Fallback facts
    facts = [
        "Honey never spoils. Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old.",
        "Bananas are berries, but strawberries aren't.",
        "A day on Venus is longer than its year.",
        "Octopuses have three hearts.",
        "The shortest war in history lasted 38 minutes.",
    ]
    import random
    return FactResponse(fact=random.choice(facts), category="general", source="fallback")


async def fetch_trivia() -> TriviaResponse:
    """Fetch trivia question from Open Trivia"""
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get("https://opentdb.com/api.php?amount=1&type=boolean")
            if resp.status_code == 200:
                data = resp.json()
                if data.get("results"):
                    q = data["results"][0]
                    return TriviaResponse(
                        question=q.get("question", ""),
                        answer=q.get("correct_answer", ""),
                        category=q.get("category", "General Knowledge"),
                        difficulty=q.get("difficulty", "medium")
                    )
    except Exception:
        pass
    
    # Fallback trivia
    return TriviaResponse(
        question="Is the Earth the third planet from the Sun?",
        answer="True",
        category="General Knowledge",
        difficulty="easy"
    )


async def fetch_definition(word: str) -> Optional[DefinitionResponse]:
    """Fetch word definition from Free Dictionary API"""
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(f"https://api.dictionaryapi.dev/api/v2/entries/en/{word}")
            if resp.status_code == 200:
                data = resp.json()
                if data and isinstance(data, list) and data[0].get("meanings"):
                    meaning = data[0]["meanings"][0]
                    definition = meaning["definitions"][0]
                    return DefinitionResponse(
                        word=data[0].get("word", word),
                        definition=definition.get("definition", ""),
                        part_of_speech=meaning.get("partOfSpeech", ""),
                        example=definition.get("example")
                    )
    except Exception:
        pass
    return None


async def fetch_quote_of_day() -> QuoteResponse:
    """Fetch quote of the day"""
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get("https://zenquotes.io/api/today")
            if resp.status_code == 200:
                data = resp.json()[0]
                return QuoteResponse(
                    quote=data.get("q", ""),
                    author=data.get("a", ""),
                    category="daily"
                )
    except Exception:
        pass
    
    return await fetch_quote()


async def fetch_holiday() -> Optional[Dict[str, str]]:
    """Fetch today's holiday from Nager.Date"""
    from datetime import datetime
    today = datetime.now()
    
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(
                f"https://date.nager.at/api/v3/PublicHolidays/{today.year}/{today.strftime('%m')}"
            )
            if resp.status_code == 200:
                holidays = resp.json()
                for holiday in holidays:
                    if holiday.get("date") == today.strftime("%Y-%m-%d"):
                        return {
                            "name": holiday.get("name", ""),
                            "description": holiday.get("localName", ""),
                            "country": holiday.get("countryCode", ""),
                        }
    except Exception:
        pass
    
    return None


# ============ Routes ============

@router.get("/quote", response_model=QuoteResponse)
async def get_random_quote():
    """Get a random inspiration quote"""
    return await fetch_quote()


@router.get("/quote/daily", response_model=QuoteResponse)
async def get_daily_quote():
    """Get quote of the day"""
    return await fetch_quote_of_day()


@router.get("/fact", response_model=FactResponse)
async def get_random_fact():
    """Get a random interesting fact"""
    return await fetch_fact()


@router.get("/trivia", response_model=TriviaResponse)
async def get_trivia_question():
    """Get a random trivia question"""
    return await fetch_trivia()


@router.get("/definition/{word}", response_model=DefinitionResponse)
async def get_word_definition(word: str):
    """Get definition of a word"""
    result = await fetch_definition(word)
    if result:
        return result
    raise HTTPException(status_code=404, detail=f"Definition not found for '{word}'")


@router.get("/holiday")
async def get_today_holiday():
    """Get today's holiday (if any)"""
    holiday = await fetch_holiday()
    if holiday:
        return holiday
    return {"message": "No holiday today"}


@router.get("/wellness/tip")
async def get_wellness_tip():
    """Get a wellness tip"""
    tips = [
        {"category": "sleep", "tip": "Aim for 7-9 hours of sleep for optimal cognitive function."},
        {"category": "hydration", "tip": "Drink at least 8 glasses of water daily."},
        {"category": "movement", "tip": "Take a 5-minute walk every hour to improve circulation."},
        {"category": "mindfulness", "tip": "Practice 5 minutes of deep breathing today."},
        {"category": "nutrition", "tip": "Include at least one serving of vegetables in each meal."},
        {"category": "social", "tip": "Reach out to a friend or family member today."},
        {"category": "nature", "tip": "Spend 10 minutes outside in natural light."},
        {"category": "gratitude", "tip": "Write down three things you're grateful for."},
    ]
    import random
    tip = random.choice(tips)
    return {
        "category": tip["category"],
        "tip": tip["tip"],
        "source": "Organic OS Wellness"
    }


@router.get("/productivity/technique")
async def get_productivity_technique():
    """Get a productivity technique"""
    techniques = [
        {"name": "Pomodoro", "description": "Work for 25 minutes, rest for 5. Repeat 4 times, then take a longer break."},
        {"name": "Eat the Frog", "description": "Do your most difficult task first thing in the morning."},
        {"name": "Time Blocking", "description": "Divide your day into blocks of time, each dedicated to one task type."},
        {"name": "2-Minute Rule", "description": "If a task takes less than 2 minutes, do it immediately."},
        {"name": "MIT Method", "description": "Focus on 3 Most Important Tasks each day."},
        {"name": "Deep Work", "description": "Dedicate 4-5 hours of uninterrupted focus on a single cognitively demanding task."},
        {"name": "Batch Processing", "description": "Group similar tasks together and do them in one sitting."},
        {"name": "Getting Things Done", "description": "Capture all tasks, clarify actions, organize by context, review daily."},
    ]
    import random
    technique = random.choice(techniques)
    return technique


@router.get("/mindfulness/practice")
async def get_mindfulness_practice():
    """Get a mindfulness practice suggestion"""
    practices = [
        {"name": "Box Breathing", "description": "Inhale 4s, hold 4s, exhale 4s, hold 4s. Repeat 4 times.", "duration": "2-5 min"},
        {"name": "Body Scan", "description": "Slowly bring attention to each part of your body, noticing sensations.", "duration": "10-15 min"},
        {"name": "Loving Kindness", "description": "Repeat: 'May I be happy, may you be happy, may all beings be happy.'", "duration": "5-10 min"},
        {"name": "5-4-3-2-1 Grounding", "description": "Acknowledge 5 things you see, 4 you hear, 3 you feel, 2 you smell, 1 you taste.", "duration": "2-3 min"},
        {"name": "Mindful Walking", "description": "Walk slowly, focusing entirely on the sensation of your feet touching the ground.", "duration": "5-10 min"},
    ]
    import random
    practice = random.choice(practices)
    return practice


@router.get("/batch")
async def get_batch_data():
    """Get all additional data in one request"""
    quote = await fetch_quote()
    fact = await fetch_fact()
    trivia = await fetch_trivia()
    
    return {
        "quote": quote.model_dump(),
        "fact": fact.model_dump(),
        "trivia": trivia.model_dump(),
    }
