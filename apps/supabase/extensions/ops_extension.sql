-- ============================================
-- MULTI-AGENT OPS EXTENSION
-- Based on OpenClaw Multi-Agent Framework
-- Run after core schema.sql
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- OPS POLICY TABLE
-- Key-value JSON configuration storage
-- ============================================

CREATE TABLE ops_policy (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL DEFAULT '{}',
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CORE POLICIES
-- ============================================

-- Auto-approve: which step kinds can skip proposal review
INSERT INTO ops_policy (key, value, description) VALUES (
    'auto_approve',
    '{
        "enabled": true,
        "allowed_step_kinds": ["draft_tweet","crawl","analyze","write_content"]
    }'::jsonb,
    'Steps that can be auto-approved without manual review'
) ON CONFLICT (key) DO UPDATE SET value = '{
        "enabled": true,
        "allowed_step_kinds": ["draft_tweet","crawl","analyze","write_content"]
    }'::jsonb, updated_at = NOW();

-- Daily tweet quota
INSERT INTO ops_policy (key, value, description) VALUES (
    'x_daily_quota',
    '{"limit": 8}'::jsonb,
    'Maximum tweets per day'
) ON CONFLICT (key) DO UPDATE SET value = '{"limit": 8}'::jsonb, updated_at = NOW();

-- Content policy
INSERT INTO ops_policy (key, value, description) VALUES (
    'content_policy',
    '{
        "enabled": true,
        "max_drafts_per_day": 8,
        "require_review_threshold": 3
    }'::jsonb,
    'Content creation limits and review requirements'
) ON CONFLICT (key) DO UPDATE SET value = '{
        "enabled": true,
        "max_drafts_per_day": 8,
        "require_review_threshold": 3
    }'::jsonb, updated_at = NOW();

-- Heartbeat configuration
INSERT INTO ops_policy (key, value, description) VALUES (
    'heartbeat_policy',
    '{
        "enabled": true,
        "interval_seconds": 300,
        "budget_ms": 4000,
        "timeout_seconds": 30
    }'::jsonb,
    'Heartbeat system configuration'
) ON CONFLICT (key) DO UPDATE SET value = '{
        "enabled": true,
        "interval_seconds": 300,
        "budget_ms": 4000,
        "timeout_seconds": 30
    }'::jsonb, updated_at = NOW();

-- Memory influence policy
INSERT INTO ops_policy (key, value, description) VALUES (
    'memory_influence_policy',
    '{
        "enabled": true,
        "probability": 0.3,
        "min_confidence_threshold": 0.55,
        "max_memories_per_agent": 200,
        "max_memories_per_conversation": 6
    }'::jsonb,
    'How memories influence agent behavior'
) ON CONFLICT (key) DO UPDATE SET value = '{
        "enabled": true,
        "probability": 0.3,
        "min_confidence_threshold": 0.55,
        "max_memories_per_agent": 200,
        "max_memories_per_conversation": 6
    }'::jsonb, updated_at = NOW();

-- Relationship drift policy
INSERT INTO ops_policy (key, value, description) VALUES (
    'relationship_drift_policy',
    '{
        "enabled": true,
        "max_drift_per_conversation": 0.03,
        "affinity_floor": 0.10,
        "affinity_ceiling": 0.95,
        "max_drift_log_entries": 20
    }'::jsonb,
    'Relationship evolution between agents'
) ON CONFLICT (key) DO UPDATE SET value = '{
        "enabled": true,
        "max_drift_per_conversation": 0.03,
        "affinity_floor": 0.10,
        "affinity_ceiling": 0.95,
        "max_drift_log_entries": 20
    }'::jsonb, updated_at = NOW();

-- Roundtable conversation policy
INSERT INTO ops_policy (key, value, description) VALUES (
    'roundtable_policy',
    '{
        "enabled": true,
        "max_daily_conversations": 5,
        "min_agents": 2,
        "max_agents": 6,
        "min_turns": 2,
        "max_turns": 12,
        "max_message_length": 120
    }'::jsonb,
    'Multi-agent conversation settings'
) ON CONFLICT (key) DO UPDATE SET value = '{
        "enabled": true,
        "max_daily_conversations": 5,
        "min_agents": 2,
        "max_agents": 6,
        "min_turns": 2,
        "max_turns": 12,
        "max_message_length": 120
    }'::jsonb, updated_at = NOW();

-- Initiative policy
INSERT INTO ops_policy (key, value, description) VALUES (
    'initiative_policy',
    '{
        "enabled": false,
        "cooldown_hours": 4,
        "min_memories_required": 5,
        "max_daily_initiatives": 3,
        "auto_approve_prob.5
    }'::jsonb,
    'ability": 0Agent proactive proposal settings'
) ON CONFLICT (key) DO UPDATE SET value = '{
        "enabled": false,
        "cooldown_hours": 4,
        "min_memories_required": 5,
        "max_daily_initiatives": 3,
        "auto_approve_probability": 0.5
    }'::jsonb, updated_at = NOW();

-- ============================================
-- AGENT MEMORY TABLE
-- ============================================

CREATE TABLE ops_agent_memory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('insight', 'pattern', 'strategy', 'preference', 'lesson')),
    content TEXT NOT NULL,
    confidence NUMERIC(3,2) NOT NULL DEFAULT 0.60 CHECK (confidence BETWEEN 0 AND 1),
    tags TEXT[] DEFAULT '{}',
    source_trace_id TEXT,
    superseded_by UUID REFERENCES ops_agent_memory(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_memory_agent_type ON ops_agent_memory(agent_id, type);
CREATE INDEX idx_memory_source ON ops_agent_memory(source_trace_id);
CREATE INDEX idx_memory_created ON ops_agent_memory(created_at DESC);

-- ============================================
-- AGENT RELATIONSHIPS TABLE
-- ============================================

CREATE TABLE ops_agent_relationships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_a TEXT NOT NULL CHECK (agent_a < agent_b),
    agent_b TEXT NOT NULL,
    affinity NUMERIC(3,2) NOT NULL DEFAULT 0.50 CHECK (affinity BETWEEN 0.10 AND 0.95),
    total_interactions INTEGER DEFAULT 0,
    positive_interactions INTEGER DEFAULT 0,
    negative_interactions INTEGER DEFAULT 0,
    drift_log JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(agent_a, agent_b)
);

-- Initialize agent relationships
INSERT INTO ops_agent_relationships (agent_a, agent_b, affinity, description) VALUES
    ('analyst', 'boss', 0.80, 'Most trusted advisor'),
    ('analyst', 'hustler', 0.60, 'Data vs intuition tension'),
    ('analyst', 'wildcard', 0.50, 'Neutral colleagues'),
    ('boss', 'hustler', 0.70, 'Manager-employee dynamics'),
    ('boss', 'wildcard', 0.30, 'Highest tension - rebel vs authority'),
    ('boss', 'writer', 0.60, 'Results vs creativity'),
    ('hustler', 'wildcard', 0.70, 'Similar energy'),
    ('hustler', 'writer', 0.50, 'Action vs craft'),
    ('wildcard', 'writer', 0.50, 'Creative peers'),
    ('analyst', 'writer', 0.50, 'Different approaches'),
    ('hustler', 'analyst', 0.60, 'Balanced relationship'),
    ('boss', 'analyst', 0.80, 'Strategic partnership');

-- ============================================
-- TRIGGER RULES TABLE
-- ============================================

CREATE TABLE ops_trigger_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    trigger_event TEXT NOT NULL,
    conditions JSONB NOT NULL DEFAULT '{}',
    action_config JSONB NOT NULL,
    cooldown_minutes INTEGER DEFAULT 60,
    enabled BOOLEAN DEFAULT TRUE,
    fire_count INTEGER DEFAULT 0,
    last_fired_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reactive triggers
INSERT INTO ops_trigger_rules (name, trigger_event, conditions, action_config, cooldown_minutes) VALUES
    ('Tweet High Engagement', 'tweet_high_engagement', 
     '{"engagement_rate_min": 0.05, "lookback_minutes": 60}'::jsonb,
     '{"target_agent": "growth", "proposal_kind": "analyze"}'::jsonb, 120),
    ('Mission Failed', 'mission_failed',
     '{"severity_min": 0.5}'::jsonb,
     '{"target_agent": "brain", "proposal_kind": "diagnose"}'::jsonb, 60),
    ('Content Published', 'content_published',
     '{}'::jsonb,
     '{"target_agent": "observer", "proposal_kind": "review"}'::jsonb, 30);

-- Proactive triggers (initially disabled)
INSERT INTO ops_trigger_rules (name, trigger_event, conditions, action_config, cooldown_minutes, enabled) VALUES
    ('Proactive Scan Signals', 'proactive_scan_signals',
     '{"interval_hours": 3}'::jsonb,
     '{"target_agent": "growth", "proposal_kind": "research", "skip_probability": 0.10}'::jsonb, 180, FALSE),
    ('Proactive Draft Tweet', 'proactive_draft_tweet',
     '{"interval_hours": 4}'::jsonb,
     '{"target_agent": "social", "proposal_kind": "draft_tweet", "skip_probability": 0.15}'::jsonb, 240, FALSE),
    ('Proactive Research', 'proactive_research',
     '{"interval_hours": 6}'::jsonb,
     '{"target_agent": "brain", "proposal_kind": "research", "skip_probability": 0.12}'::jsonb, 360, FALSE);

-- ============================================
-- REACTION QUEUE TABLE
-- ============================================

CREATE TABLE ops_agent_reactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_agent TEXT NOT NULL,
    target_agent TEXT NOT NULL,
    event_id UUID,
    reaction_type TEXT NOT NULL,
    probability NUMERIC(3,2) NOT NULL DEFAULT 1.00,
    cooldown_minutes INTEGER DEFAULT 60,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processed', 'skipped', 'failed')),
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    processed_at TIMESTAMPTZ
);

-- ============================================
-- ROUNDTABLE QUEUE TABLE
-- ============================================

CREATE TABLE ops_roundtable_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    format TEXT NOT NULL CHECK (format IN ('standup', 'debate', 'watercooler', 'brainstorm', 'war_room')),
    participants TEXT[] NOT NULL,
    topic TEXT,
    schedule_slot TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'succeeded', 'failed')),
    message_count INTEGER DEFAULT 0,
    conversation_history JSONB DEFAULT '[]'::jsonb,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ
);

-- ============================================
-- INITIATIVE QUEUE TABLE
-- ============================================

CREATE TABLE ops_initiative_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id TEXT NOT NULL,
    proposal_title TEXT NOT NULL,
    proposal_steps JSONB NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'executed')),
    rejection_reason TEXT,
    cooldown_until TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    processed_at TIMESTAMPTZ
);

-- ============================================
-- HEARTBEAT LOG TABLE
-- ============================================

CREATE TABLE ops_heartbeat_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    run_number INTEGER NOT NULL,
    duration_ms INTEGER,
    triggers_evaluated INTEGER DEFAULT 0,
    triggers_fired INTEGER DEFAULT 0,
    reactions_processed INTEGER DEFAULT 0,
    conversations_completed INTEGER DEFAULT 0,
    memories_written INTEGER DEFAULT 0,
    stale_recovered INTEGER DEFAULT 0,
    errors JSONB DEFAULT '[]'::jsonb,
    status TEXT NOT NULL CHECK (status IN ('success', 'partial', 'failed')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_heartbeat_created ON ops_heartbeat_log(created_at DESC);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Get policy value
CREATE OR REPLACE FUNCTION get_policy(policy_key TEXT)
RETURNS JSONB AS $$
    SELECT value FROM ops_policy WHERE key = policy_key;
$$ LANGUAGE sql SECURITY DEFINER;

-- Set policy value
CREATE OR REPLACE FUNCTION set_policy(policy_key TEXT, new_value JSONB)
RETURNS void AS $$
    INSERT INTO ops_policy (key, value, updated_at)
    VALUES (policy_key, new_value, NOW())
    ON CONFLICT (key) 
    DO UPDATE SET value = new_value, updated_at = NOW();
$$ LANGUAGE sql SECURITY DEFINER;

-- Add memory with idempotent dedup
CREATE OR REPLACE FUNCTION add_agent_memory(
    p_agent_id TEXT,
    p_type TEXT,
    p_content TEXT,
    p_confidence NUMERIC(3,2),
    p_tags TEXT[] DEFAULT '{}',
    p_source_trace_id TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_id UUID;
BEGIN
    -- Check for duplicate
    IF p_source_trace_id IS NOT NULL THEN
        SELECT id INTO v_id FROM ops_agent_memory 
        WHERE source_trace_id = p_source_trace_id AND agent_id = p_agent_id;
        IF v_id IS NOT NULL THEN
            RETURN v_id;
        END IF;
    END IF;
    
    INSERT INTO ops_agent_memory (agent_id, type, content, confidence, tags, source_trace_id)
    VALUES (p_agent_id, p_type, p_content, p_confidence, p_tags, p_source_trace_id)
    RETURNING id INTO v_id;
    
    RETURN v_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update agent affinity with drift
CREATE OR REPLACE FUNCTION update_agent_affinity(
    p_agent_a TEXT,
    p_agent_b TEXT,
    p_drift NUMERIC(3,2),
    p_reason TEXT,
    p_conversation_id UUID DEFAULT NULL
)
RETURNS void AS $$
DECLARE
    v_current_affinity NUMERIC(3,2);
    v_new_affinity NUMERIC(3,2);
BEGIN
    -- Get current (alphabetical order)
    SELECT affinity INTO v_current_affinity 
    FROM ops_agent_relationships 
    WHERE agent_a = LEAST(p_agent_a, p_agent_b) 
    AND agent_b = GREATEST(p_agent_a, p_agent_b);
    
    -- Clamp drift
    v_new_affinity := GREATEST(0.10, LEAST(0.95, v_current_affinity + p_drift));
    
    UPDATE ops_agent_relationships 
    SET affinity = v_new_affinity,
        total_interactions = total_interactions + 1,
        positive_interactions = positive_interactions + CASE WHEN p_drift > 0 THEN 1 ELSE 0 END,
        negative_interactions = negative_interactions + CASE WHEN p_drift < 0 THEN 1 ELSE 0 END,
        drift_log = drift_log || jsonb_build_object(
            'drift', p_drift,
            'reason', p_reason,
            'conversation_id', p_conversation_id,
            'at', NOW()
        )::jsonb || '[]'::jsonb,  -- Simplified - in production would slice
        updated_at = NOW()
    WHERE agent_a = LEAST(p_agent_a, p_agent_b) 
    AND agent_b = GREATEST(p_agent_a, p_agent_b);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- RLS POLICIES
-- ============================================

ALTER TABLE ops_policy ENABLE ROW LEVEL SECURITY;
ALTER TABLE ops_agent_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE ops_agent_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE ops_trigger_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE ops_agent_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ops_roundtable_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE ops_initiative_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE ops_heartbeat_log ENABLE ROW LEVEL SECURITY;

-- System tables - only service role can modify
CREATE POLICY "System tables are read-only for users" ON ops_policy FOR SELECT USING (true);
CREATE POLICY "System tables are read-only for users" ON ops_agent_memory FOR SELECT USING (true);
CREATE POLICY "System tables are read-only for users" ON ops_agent_relationships FOR SELECT USING (true);
CREATE POLICY "System tables are read-only for users" ON ops_trigger_rules FOR SELECT USING (true);
CREATE POLICY "System tables are read-only for users" ON ops_agent_reactions FOR SELECT USING (true);
CREATE POLICY "System tables are read-only for users" ON ops_roundtable_queue FOR SELECT USING (true);
CREATE POLICY "System tables are read-only for users" ON ops_initiative_queue FOR SELECT USING (true);
CREATE POLICY "System tables are read-only for users" ON ops_heartbeat_log FOR SELECT USING (true);

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON TABLE ops_policy IS 'Key-value JSON configuration for dynamic policy management';
COMMENT ON TABLE ops_agent_memory IS 'Agent memories - insights, patterns, strategies, preferences, lessons';
COMMENT ON TABLE ops_agent_relationships IS 'Agent-to-agent affinity values with drift tracking';
COMMENT ON TABLE ops_trigger_rules IS 'Trigger rules for reactive and proactive event handling';
COMMENT ON TABLE ops_agent_reactions IS 'Queue for agent-to-agent reaction patterns';
COMMENT ON TABLE ops_roundtable_queue IS 'Multi-agent conversation orchestration queue';
COMMENT ON TABLE ops_initiative_queue IS 'Agent-proposed initiatives queue';
COMMENT ON TABLE ops_heartbeat_log IS 'Heartbeat execution history for monitoring';

COMMENT ON FUNCTION get_policy IS 'Retrieve a policy value by key';
COMMENT ON FUNCTION set_policy IS 'Update a policy value (creates if not exists)';
COMMENT ON FUNCTION add_agent_memory IS 'Add memory with idempotent dedup via source_trace_id';
COMMENT ON FUNCTION update_agent_affinity IS 'Update agent affinity with drift tracking';
