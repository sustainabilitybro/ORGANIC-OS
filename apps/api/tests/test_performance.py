"""
Tests for Additional Integrations and Performance Optimizer
"""

import pytest
from apps.api.performance.optimizer import (
    get_query_stats,
    clear_query_stats,
    track_query,
    PerformanceReport
)


class TestPerformanceTracker:
    """Test performance tracking"""
    
    def setup_method(self):
        clear_query_stats()
    
    def teardown_method(self):
        clear_query_stats()
    
    def test_empty_stats(self):
        """Test empty query stats"""
        stats = get_query_stats()
        assert stats.total_queries == 0
        assert stats.average_time_ms == 0
    
    def test_single_query(self):
        """Test tracking single query"""
        @track_query("test_query")
        async def test_func():
            return "result"
        
        import asyncio
        asyncio.run(test_func())
        
        stats = get_query_stats()
        assert stats.total_queries == 1
        assert stats.average_time_ms > 0
    
    def test_multiple_queries(self):
        """Test tracking multiple queries"""
        @track_query("query1")
        async def func1():
            return "result1"
        
        @track_query("query2")
        async def func2():
            return "result2"
        
        import asyncio
        asyncio.run(func1())
        asyncio.run(func2())
        
        stats = get_query_stats()
        assert stats.total_queries == 2
    
    def test_clear_stats(self):
        """Test clearing statistics"""
        @track_query("test")
        async def func():
            return "result"
        
        import asyncio
        asyncio.run(func())
        
        clear_query_stats()
        
        stats = get_query_stats()
        assert stats.total_queries == 0
    
    def test_slow_query_detection(self):
        """Test slow query detection"""
        @track_query("slow")
        async def slow_func():
            import time
            time.sleep(0.2)  # 200ms
            return "result"
        
        import asyncio
        asyncio.run(slow_func())
        
        stats = get_query_stats()
        assert len(stats.slow_queries) >= 1


class TestAdditionalIntegrations:
    """Test additional integration endpoints"""
    
    @pytest.mark.asyncio
    async def test_quote_endpoint_exists(self):
        """Test quote endpoint returns valid response"""
        from apps.api.routes.additional_integrations import fetch_quote
        
        quote = await fetch_quote()
        assert quote.quote is not None
        assert quote.author is not None
        assert quote.category is not None
    
    @pytest.mark.asyncio
    async def test_fact_endpoint_exists(self):
        """Test fact endpoint returns valid response"""
        from apps.api.routes.additional_integrations import fetch_fact
        
        fact = await fetch_fact()
        assert fact.fact is not None
        assert fact.category is not None
    
    @pytest.mark.asyncio
    async def test_trivia_endpoint_exists(self):
        """Test trivia endpoint returns valid response"""
        from apps.api.routes.additional_integrations import fetch_trivia
        
        trivia = await fetch_trivia()
        assert trivia.question is not None
        assert trivia.answer is not None
    
    @pytest.mark.asyncio
    async def test_batch_endpoint_exists(self):
        """Test batch endpoint returns all data"""
        from apps.api.routes.additional_integrations import get_batch_data
        
        result = await get_batch_data()
        assert "quote" in result
        assert "fact" in result
        assert "trivia" in result
    
    @pytest.mark.asyncio
    async def test_wellness_tip_exists(self):
        """Test wellness tip endpoint"""
        from apps.api.routes.additional_integrations import get_wellness_tip
        
        tip = await get_wellness_tip()
        assert "tip" in tip
        assert "category" in tip


class TestAPIDocumentation:
    """Test API documentation endpoints"""
    
    def test_overview_endpoint(self):
        """Test API overview endpoint"""
        from apps.api.docs.api_documentation import get_api_overview
        import asyncio
        
        overview = asyncio.run(get_api_overview())
        assert overview["name"] == "Organic OS API"
        assert "version" in overview
    
    def test_quickstart_endpoint(self):
        """Test quickstart endpoint"""
        from apps.api.docs.api_documentation import get_quickstart_guide
        import asyncio
        
        guide = asyncio.run(get_quickstart_guide())
        assert "steps" in guide
    
    def test_patterns_endpoint(self):
        """Test patterns endpoint"""
        from apps.api.docs.api_documentation import get_common_patterns
        import asyncio
        
        patterns = asyncio.run(get_common_patterns())
        assert "pagination" in patterns
    
    def test_errors_endpoint(self):
        """Test errors endpoint"""
        from apps.api.docs.api_documentation import get_error_guide
        import asyncio
        
        errors = asyncio.run(get_error_guide())
        assert "status_codes" in errors
    
    def test_rate_limits_endpoint(self):
        """Test rate limits endpoint"""
        from apps.api.docs.api_documentation import get_rate_limits
        import asyncio
        
        limits = asyncio.run(get_rate_limits())
        assert "default" in limits


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
