"""
Tests for WebSocket and Batch Operations
"""

import pytest
from apps.api.routes.batch import BatchRequest, BatchItem, process_batch
from apps.api.websocket.manager import ConnectionManager


class TestBatchOperations:
    """Test batch processing"""
    
    def test_empty_batch(self):
        """Test empty batch"""
        request = BatchRequest(items=[])
        assert request.processed == 0
    
    def test_batch_create(self):
        """Test batch create action"""
        items = [
            BatchItem(data={"name": "test1"}, action="create"),
            BatchItem(data={"name": "test2"}, action="create"),
        ]
        import asyncio
        result = asyncio.run(process_batch(items))
        assert result.processed == 2
        assert result.failed == 0
        assert result.success
    
    def test_batch_update(self):
        """Test batch update action"""
        items = [
            BatchItem(id="1", data={"name": "updated"}, action="update"),
            BatchItem(id="2", data={"name": "updated2"}, action="update"),
        ]
        import asyncio
        result = asyncio.run(process_batch(items))
        assert result.processed == 2
        assert len(result.results) == 2
    
    def test_batch_delete(self):
        """Test batch delete action"""
        items = [
            BatchItem(id="1", action="delete"),
            BatchItem(id="2", action="delete"),
        ]
        import asyncio
        result = asyncio.run(process_batch(items))
        assert result.processed == 2
        assert all(r["action"] == "delete" for r in result.results)
    
    def test_batch_mixed(self):
        """Test mixed batch operations"""
        items = [
            BatchItem(data={"name": "new"}, action="create"),
            BatchItem(id="1", data={"name": "updated"}, action="update"),
            BatchItem(id="2", action="delete"),
        ]
        import asyncio
        result = asyncio.run(process_batch(items))
        assert result.processed == 3
        assert len(result.results) == 3
    
    def test_batch_status_endpoint(self):
        """Test batch status endpoint"""
        from apps.api.routes.batch import batch_status
        import asyncio
        
        status = asyncio.run(batch_status())
        assert status["max_batch_size"] == 1000
        assert status["wellness_max"] == 100
        assert status["habits_max"] == 50


class TestWebSocketManager:
    """Test WebSocket connection manager"""
    
    def test_manager_init(self):
        """Test manager initialization"""
        manager = ConnectionManager()
        assert manager.active_connections == {}
    
    def test_disconnect_nonexistent(self):
        """Test disconnecting nonexistent connection"""
        manager = ConnectionManager()
        from fastapi import WebSocket
        
        # Should not raise
        manager.disconnect(WebSocket(), "test")


class TestBatchValidation:
    """Test batch request validation"""
    
    def test_batch_item_defaults(self):
        """Test batch item default values"""
        item = BatchItem(data={"test": "value"})
        assert item.id is None
        assert item.action == "create"
    
    def test_batch_request_defaults(self):
        """Test batch request default values"""
        request = BatchRequest(items=[])
        assert request.return_results is True
    
    def test_batch_item_action_types(self):
        """Test valid batch item actions"""
        for action in ["create", "update", "delete"]:
            item = BatchItem(data={}, action=action)
            assert item.action == action


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
