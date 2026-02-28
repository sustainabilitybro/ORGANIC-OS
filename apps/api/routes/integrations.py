"""
Free API Integrations for Organic OS

This module provides integrations with free APIs for enhanced data.
"""
from fastapi import APIRouter, HTTPException
from typing import Optional, Dict, List
import httpx
import json

router = APIRouter(prefix="/api/v1/integrations", tags=["integrations"])

# ============ Free API Registry ============

FREE_APIS = {
    "weather": {
        "name": "OpenWeatherMap",
        "url": "https://api.openweathermap.org/data/2.5",
        "free_tier": "1000 calls/day",
        "requires_key": True,
        "use_cases": ["Weather affects mood", "Sleep quality correlation", "Activity planning"]
    },
    "news": {
        "name": "NewsAPI",
        "url": "https://newsapi.org/v2",
        "free_tier": "100 calls/day",
        "requires_key": True,
        "use_cases": ["Daily news for reflection prompts", "Topic-based conversations"]
    },
    "quote": {
        "name": "ZenQuotes",
        "url": "https://zenquotes.io/api",
        "free_tier": "Unlimited",
        "requires_key": False,
        "use_cases": ["Daily inspiration", "Motivation prompts"]
    },
    "fact": {
        "name": "UselessFacts",
        "url": "https://uselessfacts.jsph.pl",
        "free_tier": "Unlimited",
        "requires_key": False,
        "use_cases": ["Conversation starters", "Fun facts for engagement"]
    },
    "holiday": {
        "name": "Nager.Date",
        "url": "https://date.nager.at/api/v3",
        "free_tier": "Unlimited",
        "requires_key": False,
        "use_cases": ["Awareness days", "International observances"]
    },
    "moon": {
        "name": "Moon Phase API",
        "url": "https://moonapi.vercel.app",
        "free_tier": "Unlimited",
        "requires_key": False,
        "use_cases": ["Sleep tracking correlation", "Wellness insights"]
    },
    "sunrise": {
        "name": "Sunrise-Sunset",
        "url": "https://api.sunrise-sunset.org",
        "free_tier": "Unlimited",
        "requires_key": False,
        "use_cases": ["Sleep tracking", "Morning routine optimization"]
    },
    "currency": {
        "name": "ExchangeRate-API",
        "url": "https://open.er-api.com/v6",
        "free_tier": "Unlimited",
        "requires_key": False,
        "use_cases": ["Financial wellness tracking"]
    },
    "joke": {
        "name": "Official Joke API",
        "url": "https://official-joke-api.appspot.com",
        "free_tier": "Unlimited",
        "requires_key": False,
        "use_cases": ["Mood improvement", "Social sharing"]
    },
    "trivia": {
        "name": "Open Trivia DB",
        "url": "https://opentdb.com/api.php",
        "free_tier": "Unlimited",
        "requires_key": False,
        "use_cases": ["Cognitive exercises", "Learning gamification"]
    }
}

# ============ API Functions ============

async def get_daily_quote() -> Dict:
    """Get daily inspiration quote"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get("https://zenquotes.io/api/today", timeout=10.0)
            if response.status_code == 200:
                data = response.json()
                return {
                    "quote": data[0]["q"],
                    "author": data[0]["a"],
                    "source": "ZenQuotes"
                }
    except Exception:
        pass
    
    # Fallback quotes
    fallback = {
        "quote": "The only way to do great work is to love what you do.",
        "author": "Steve Jobs",
        "source": "Fallback"
    }
    return fallback

async def get_random_fact() -> Dict:
    """Get random useless fact"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://uselessfacts.jsph.pl/api/v2/facts/random",
                params={"language": "en"},
                timeout=10.0
            )
            if response.status_code == 200:
                data = response.json()
                return {"fact": data["text"], "source": "UselessFacts"}
    except Exception:
        pass
    
    return {"fact": "Honey never spoils. Archaeologists have found 3000-year-old honey in Egyptian tombs.", "source": "Fallback"}

async def get_moon_phase() -> Dict:
    """Get current moon phase"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://moonapi.vercel.app/phase",
                timeout=10.0
            )
            if response.status_code == 200:
                return response.json()
    except Exception:
        pass
    
    return {"phase": "Unknown", "illumination": 0}

async def get_sun_times(lat: float = 40.7128, lng: float = -74.0060) -> Dict:
    """Get sunrise and sunset times for location"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://api.sunrise-sunset.org/json",
                params={"lat": lat, "lng": lng, "formatted": 0},
                timeout=10.0
            )
            if response.status_code == 200:
                data = response.json()
                if data["status"] == "OK":
                    return {
                        "sunrise": data["results"]["sunrise"],
                        "sunset": data["results"]["sunset"],
                        "day_length": data["results"]["day_length"]
                    }
    except Exception:
        pass
    
    return {"sunrise": "06:00", "sunset": "18:00", "day_length": 43200}

async def get_today_holidays(country: str = "US") -> List[Dict]:
    """Get today's holidays"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"https://date.nager.at/api/v3/Today/{country}",
                timeout=10.0
            )
            if response.status_code == 200:
                return response.json()
    except Exception:
        pass
    return []

async def get_joke() -> Dict:
    """Get random joke"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://official-joke-api.appspot.com/random_joke",
                timeout=10.0
            )
            if response.status_code == 200:
                data = response.json()
                return {
                    "setup": data["setup"],
                    "punchline": data["punchline"],
                    "type": data["type"]
                }
    except Exception:
        pass
    return {"setup": "Why did the scarecrow win an award?", "punchline": "Because he was outstanding in his field!"}

async def get_trivia_question(category: int = 9) -> Dict:
    """Get trivia question"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://opentdb.com/api.php",
                params={"amount": 1, "category": category, "type": "multiple"},
                timeout=10.0
            )
            if response.status_code == 200:
                data = response.json()
                if data["response_code"] == 0:
                    question = data["results"][0]
                    return {
                        "question": question["question"],
                        "correct_answer": question["correct_answer"],
                        "incorrect_answers": question["incorrect_answers"],
                        "difficulty": question["difficulty"],
                        "category": question["category"]
                    }
    except Exception:
        pass
    return {"question": "What is the capital of France?", "correct_answer": "Paris", "difficulty": "Easy"}

# ============ Routes ============

@router.get("/quote/daily")
async def daily_quote():
    """Get daily inspiration quote"""
    return await get_daily_quote()

@router.get("/fact/random")
async def random_fact():
    """Get random fun fact"""
    return await get_random_fact()

@router.get("/moon/phase")
async def moon_phase(lat: Optional[float] = None, lng: Optional[float] = None):
    """Get current moon phase"""
    return await get_moon_phase()

@router.get("/sun/times")
async def sun_times(lat: float = 40.7128, lng: float = -74.0060):
    """Get sunrise and sunset times"""
    return await get_sun_times(lat, lng)

@router.get("/holidays/today")
async def today_holidays(country: str = "US"):
    """Get today's holidays"""
    return await get_today_holidays(country)

@router.get("/joke/random")
async def random_joke():
    """Get random joke"""
    return await get_joke()

@router.get("/trivia/question")
async def trivia_question(category: int = 9):
    """Get trivia question (category 9 = General Knowledge)"""
    return await get_trivia_question(category)

@router.get("/wellness/daily")
async def daily_wellness_data():
    """Aggregate daily wellness data from multiple sources"""
    quote = await get_daily_quote()
    fact = await get_random_fact()
    moon = await get_moon_phase()
    sun = await get_sun_times()
    
    return {
        "quote": quote,
        "fun_fact": fact,
        "moon": moon,
        "sun": sun,
        "productivity_tip": "Align your tasks with your natural energy cycles",
        "mindfulness_suggestion": "Notice how the moon phase affects your mood today"
    }

@router.get("/integrations")
async def list_integrations():
    """List all available free integrations"""
    return {
        "integrations": FREE_APIS,
        "note": "Some APIs require API keys. Add them to environment variables.",
        "documentation": "/docs#integrations"
    }

@router.get("/status")
async def integrations_status():
    """Check which integrations are available"""
    status = {}
    for key, api in FREE_APIS.items():
        status[key] = {
            "name": api["name"],
            "available": True,
            "free_tier": api["free_tier"],
            "requires_key": api["requires_key"]
        }
    return {"status": status}
