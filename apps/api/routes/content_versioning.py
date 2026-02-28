"""
Content Versioning

Track changes to module content:
- Version history
- Change tracking
- Content validation
- Rollback support
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
from datetime import datetime
from enum import Enum
import uuid
import json

router = APIRouter(prefix="/api/v1/content", tags=["Content Versioning"])

# ============ Data Models ============

class ContentType(str, Enum):
    """Types of content"""
    MODULE = "module"
    EXERCISE = "exercise"
    PROMPT = "prompt"
    COPING_STRATEGY = "coping_strategy"
    RECOMMENDATION = "recommendation"

class ChangeType(str, Enum):
    """Types of changes"""
    CREATED = "created"
    UPDATED = "updated"
    DELETED = "deleted"
    DEPRECATED = "deprecated"

class ContentVersion(BaseModel):
    """A specific version of content"""
    content_id: str
    version: int
    content: Dict[str, Any]
    change_type: ChangeType
    author: str
    created_at: datetime
    comment: str = None
    checksum: str

class ContentMetadata(BaseModel):
    """Metadata for content item"""
    content_id: str
    content_type: ContentType
    current_version: int
    total_versions: int
    created_at: datetime
    updated_at: datetime
    status: str  # active, deprecated, archived
    author: str

# ============ Version Store ============

class ContentVersionStore:
    """Store for content versions"""
    
    def __init__(self):
        # content_id -> list of versions (newest first)
        self._versions: Dict[str, List[ContentVersion]] = {}
        # content_id -> metadata
        self._metadata: Dict[str, ContentMetadata] = {}
    
    def add_version(
        self,
        content_id: str,
        content_type: ContentType,
        new_content: Dict[str, Any],
        change_type: ChangeType,
        author: str,
        comment: str = None
    ) -> ContentVersion:
        """Add a new version"""
        metadata = self._metadata.get(content_id)
        
        if metadata:
            version = metadata.current_version + 1
        else:
            version = 1
            # Create metadata for new content
            self._metadata[content_id] = ContentMetadata(
                content_id=content_id,
                content_type=content_type,
                current_version=1,
                total_versions=1,
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow(),
                status="active",
                author=author
            )
        
        # Create checksum
        checksum = self._calculate_checksum(new_content)
        
        content_version = ContentVersion(
            content_id=content_id,
            version=version,
            content=new_content,
            change_type=change_type,
            author=author,
            created_at=datetime.utcnow(),
            comment=comment,
            checksum=checksum
        )
        
        # Store version
        if content_id not in self._versions:
            self._versions[content_id] = []
        self._versions[content_id].insert(0, content_version)
        
        # Update metadata
        self._metadata[content_id] = ContentMetadata(
            content_id=content_id,
            content_type=content_type,
            current_version=version,
            total_versions=version,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
            status="active",
            author=author
        )
        
        return content_version
    
    def get_version(self, content_id: str, version: int) -> ContentVersion:
        """Get specific version"""
        if content_id not in self._versions:
            raise ValueError(f"Content {content_id} not found")
        
        for v in self._versions[content_id]:
            if v.version == version:
                return v
        
        raise ValueError(f"Version {version} not found for content {content_id}")
    
    def get_current(self, content_id: str) -> ContentVersion:
        """Get current version"""
        if content_id not in self._versions:
            raise ValueError(f"Content {content_id} not found")
        
        return self._versions[content_id][0]
    
    def get_history(self, content_id: str, limit: int = 10) -> List[ContentVersion]:
        """Get version history"""
        if content_id not in self._versions:
            return []
        
        return self._versions[content_id][:limit]
    
    def get_all_content(self) -> List[str]:
        """Get all content IDs"""
        return list(self._metadata.keys())
    
    def _calculate_checksum(self, content: Dict[str, Any]) -> str:
        """Calculate checksum for content"""
        import hashlib
        content_str = json.dumps(content, sort_keys=True)
        return hashlib.sha256(content_str.encode()).hexdigest()
    
    def verify_checksum(self, content_id: str, version: int) -> bool:
        """Verify checksum matches content"""
        version_obj = self.get_version(content_id, version)
        expected_checksum = self._calculate_checksum(version_obj.content)
        return version_obj.checksum == expected_checksum
    
    def rollback(self, content_id: str, target_version: int, author: str) -> ContentVersion:
        """Rollback to specific version"""
        current = self.get_current(content_id)
        
        # Get target version
        target = self.get_version(content_id, target_version)
        
        # Create new version with restored content
        restored = self.add_version(
            content_id=content_id,
            content_type=self._metadata[content_id].content_type,
            new_content=target.content,
            change_type=ChangeType.UPDATED,
            author=author,
            comment=f"Rollback to version {target_version}"
        )
        
        return restored


# Global store
content_store = ContentVersionStore()

# ============ Pre-populate with Module Content ============

def initialize_content_store():
    """Initialize store with current content"""
    modules = [
        ("identity", "identity", "Identity Module", "admin"),
        ("emotional", "emotional", "Emotional Module", "admin"),
        ("wellness", "wellness", "Wellness Module", "admin"),
        ("recovery", "recovery", "Recovery Module", "admin"),
        ("communication", "communication", "Communication Module", "admin"),
        ("sensory", "sensory", "Sensory Module", "admin"),
        ("sustainability", "sustainability", "Sustainability Module", "admin"),
        ("holistic_alchemy", "holistic", "Holistic Alchemy Module", "admin"),
        ("atom_economy", "productivity", "Atom Economy Module", "admin"),
        ("video", "video", "Video Module", "admin"),
    ]
    
    for content_id, module_type, name, author in modules:
        content_store.add_version(
            content_id=content_id,
            content_type=ContentType.MODULE,
            new_content={
                "id": content_id,
                "name": name,
                "type": module_type,
                "exercises": [],
                "prompts": []
            },
            change_type=ChangeType.CREATED,
            author=author,
            comment="Initial content"
        )

# Initialize on module load
initialize_content_store()

# ============ Endpoints ============

@router.get("/versions/{content_id}")
async def get_version_history(
    content_id: str,
    limit: int = 10
):
    """Get version history for content"""
    history = content_store.get_history(content_id, limit)
    
    return {
        "content_id": content_id,
        "versions": [
            {
                "version": v.version,
                "change_type": v.change_type.value,
                "author": v.author,
                "created_at": v.created_at.isoformat(),
                "comment": v.comment
            }
            for v in history
        ],
        "total_versions": len(history)
    }


@router.get("/versions/{content_id}/current")
async def get_current_version(content_id: str):
    """Get current version of content"""
    try:
        current = content_store.get_current(content_id)
        return {
            "content_id": content_id,
            "version": current.version,
            "content": current.content,
            "change_type": current.change_type.value,
            "author": current.author,
            "created_at": current.created_at.isoformat(),
            "checksum": current.checksum
        }
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get("/versions/{content_id}/{version}")
async def get_specific_version(content_id: str, version: int):
    """Get specific version of content"""
    try:
        ver = content_store.get_version(content_id, version)
        
        # Verify checksum
        checksum_valid = content_store.verify_checksum(content_id, version)
        
        return {
            "content_id": content_id,
            "version": ver.version,
            "content": ver.content,
            "change_type": ver.change_type.value,
            "author": ver.author,
            "created_at": ver.created_at.isoformat(),
            "checksum": ver.checksum,
            "checksum_valid": checksum_valid
        }
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post("/versions/{content_id}/rollback/{target_version}")
async def rollback_content(
    content_id: str,
    target_version: int,
    author: str = "admin"
):
    """Rollback content to specific version"""
    try:
        restored = content_store.rollback(content_id, target_version, author)
        return {
            "success": True,
            "content_id": content_id,
            "new_version": restored.version,
            "restored_from": target_version,
            "author": author,
            "message": f"Rolled back to version {target_version}"
        }
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post("/versions/{content_id}")
async def create_new_version(
    content_id: str,
    content: Dict[str, Any],
    change_type: ChangeType = ChangeType.UPDATED,
    author: str = "admin",
    comment: str = None
):
    """Create new version of content"""
    try:
        # Get current to determine type
        current = content_store.get_current(content_id)
        content_type = current.content.get("type", ContentType.MODULE)
    except ValueError:
        content_type = ContentType.MODULE
    
    new_version = content_store.add_version(
        content_id=content_id,
        content_type=content_type,
        new_content=content,
        change_type=change_type,
        author=author,
        comment=comment
    )
    
    return {
        "success": True,
        "content_id": content_id,
        "version": new_version.version,
        "change_type": new_version.change_type.value,
        "author": new_version.author,
        "created_at": new_version.created_at.isoformat(),
        "checksum": new_version.checksum
    }


@router.get("/versions/{content_id}/verify/{version}")
async def verify_version(content_id: str, version: int):
    """Verify content integrity"""
    try:
        valid = content_store.verify_checksum(content_id, version)
        ver = content_store.get_version(content_id, version)
        
        return {
            "content_id": content_id,
            "version": version,
            "checksum": ver.checksum,
            "checksum_valid": valid,
            "status": "valid" if valid else "corrupted"
        }
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get("/all")
async def list_all_content():
    """List all tracked content"""
    all_ids = content_store.get_all_content()
    
    return {
        "content_items": [
            {
                "content_id": content_id,
                "current_version": content_store.get_current(content_id).version,
                "metadata": {
                    "type": content_store._metadata[content_id].content_type.value,
                    "updated_at": content_store._metadata[content_id].updated_at.isoformat()
                }
            }
            for content_id in all_ids
        ],
        "total_items": len(all_ids)
    }


@router.get("/stats")
async def get_versioning_stats():
    """Get versioning statistics"""
    all_ids = content_store.get_all_content()
    
    total_versions = sum(
        len(content_store._versions.get(cid, []))
        for cid in all_ids
    )
    
    return {
        "total_content_items": len(all_ids),
        "total_versions": total_versions,
        "average_versions_per_item": round(total_versions / len(all_ids), 2) if all_ids else 0
    }
