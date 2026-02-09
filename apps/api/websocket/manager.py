"""
WebSocket Support for Real-Time Features
"""

from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import Dict, Set
import json
from datetime import datetime

router = APIRouter(prefix="/api/v1/ws", tags=["websocket"])


class ConnectionManager:
    """Manages WebSocket connections"""
    
    def __init__(self):
        self.active_connections: Dict[str, Set[WebSocket]] = {}
    
    async def connect(self, websocket: WebSocket, channel: str):
        await websocket.accept()
        if channel not in self.active_connections:
            self.active_connections[channel] = set()
        self.active_connections[channel].add(websocket)
    
    def disconnect(self, websocket: WebSocket, channel: str):
        if channel in self.active_connections:
            self.active_connections[channel].discard(websocket)
    
    async def broadcast(self, channel: str, message: dict):
        if channel in self.active_connections:
            for connection in list(self.active_connections[channel]):
                try:
                    await connection.send_json(message)
                except:
                    self.active_connections[channel].discard(connection)
    
    async def send_personal(self, websocket: WebSocket, message: dict):
        try:
            await websocket.send_json(message)
        except:
            self.disconnect(websocket, "personal")


manager = ConnectionManager()


@router.websocket("/notifications")
async def websocket_notifications(websocket: WebSocket):
    await manager.connect(websocket, "notifications")
    try:
        while True:
            data = await websocket.receive_text()
            await manager.send_personal(websocket, {
                "type": "echo",
                "timestamp": datetime.now().isoformat()
            })
    except WebSocketDisconnect:
        manager.disconnect(websocket, "notifications")


@router.websocket("/progress/{user_id}")
async def websocket_progress(websocket: WebSocket, user_id: str):
    await manager.connect(websocket, f"progress:{user_id}")
    try:
        while True:
            await websocket.receive_text()
            await manager.send_personal(websocket, {
                "type": "progress_update",
                "user_id": user_id,
                "timestamp": datetime.now().isoformat()
            })
    except WebSocketDisconnect:
        manager.disconnect(websocket, f"progress:{user_id}")


@router.post("/broadcast/{channel}")
async def broadcast_message(channel: str, message: dict):
    await manager.broadcast(channel, {
        "type": "broadcast",
        "channel": channel,
        "message": message,
        "timestamp": datetime.now().isoformat()
    })
    return {"status": "broadcast_sent", "channel": channel}


@router.get("/stats")
async def websocket_stats():
    total = sum(len(conns) for conns in manager.active_connections.values())
    return {
        "active_channels": len(manager.active_connections),
        "total_connections": total,
        "channels": [
            {"name": name, "count": len(conns)}
            for name, conns in manager.active_connections.items()
        ]
    }
