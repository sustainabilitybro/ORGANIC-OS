-- Organic OS Database Schema
-- Generated for Organic OS v1.0

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS & AUTH
-- ============================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    bio TEXT,
    timezone TEXT DEFAULT 'UTC',
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- MODULE PROGRESS
-- ============================================

CREATE TABLE module_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    module_name TEXT NOT NULL,  -- identity, sensory, emotional, wellness, recovery, communication
    progress_percentage DECIMAL(5,2) DEFAULT 0,
    last_activity TIMESTAMPTZ DEFAULT NOW(),
    completed_topics TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, module_name)
);

CREATE TABLE user_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    module_name TEXT NOT NULL,
    topic_name TEXT NOT NULL,
    entry_type TEXT NOT NULL,  -- reflection, assessment, exercise, journal
    content JSONB NOT NULL,
    ai_insights JSONB,
    is_favorite BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- IDENTITY MODULE
-- ============================================

CREATE TABLE core_values (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    value_name TEXT NOT NULL,
    description TEXT,
    importance_score DECIMAL(3,2),  -- 1-10
    examples TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE life_purpose (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    draft_number INT DEFAULT 1,
    draft_content TEXT NOT NULL,
    ai_feedback TEXT,
    is_finalized BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- EMOTIONAL MODULE
-- ============================================

CREATE TABLE emotions_journal (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    emotion_name TEXT NOT NULL,
    intensity DECIMAL(3,2),  -- 1-10
    triggers TEXT,
    bodily_sensations TEXT,
    thoughts TEXT,
    behaviors TEXT,
    regulation_strategy_used TEXT,
    ai_suggestions JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE emotion_taxonomy (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_emotion TEXT,
    emotion_name TEXT NOT NULL UNIQUE,
    definition TEXT,
    synonyms TEXT[],
    opposite_emotion TEXT,
    questions_to_explore JSONB
);

-- ============================================
-- SENSORY MODULE
-- ============================================

CREATE TABLE sensory_profile (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    sense_type TEXT NOT NULL,  -- visual, auditory, kinesthetic, olfactory, gustatory
    sensitivity_level DECIMAL(3,2),  -- 1-10
    preferences TEXT,
    triggers TEXT,
    exercises_completed TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, sense_type)
);

-- ============================================
-- WELLNESS MODULE
-- ============================================

CREATE TABLE wellness_tracker (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    sleep_hours DECIMAL(4,2),
    water_intake_ml INT,
    exercise_minutes INT,
    meditation_minutes INT,
    nutrition_notes TEXT,
    mood_score DECIMAL(3,2),
    energy_level DECIMAL(3,2),
    ai_insights TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, date)
);

CREATE TABLE wellness_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    goal_type TEXT NOT NULL,  -- nutrition, movement, sleep, stress, mindfulness
    specific_goal TEXT NOT NULL,
    measurable_target TEXT,
    timeframe TEXT,  -- weekly, monthly, quarterly
    progress_percentage DECIMAL(5,2) DEFAULT 0,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- RECOVERY (BURNOUT) MODULE
-- ============================================

CREATE TABLE burnout_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    assessment_date TIMESTAMPTZ DEFAULT NOW(),
    exhaustion_score DECIMAL(3,2),
    cynicism_score DECIMAL(3,2),
    inefficacy_score DECIMAL(3,2),
    overall_risk_level TEXT,  -- low, moderate, high, severe
    recommendations JSONB,
    ai_analysis TEXT
);

CREATE TABLE stress_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    stress_source TEXT NOT NULL,
    intensity DECIMAL(3,2),  -- 1-10
    duration_minutes INT,
    coping_strategies_used TEXT[],
    effectiveness_rating DECIMAL(3,2),
    aftermath_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- COMMUNICATION MODULE
-- ============================================

CREATE TABLE speaking_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    goal_name TEXT NOT NULL,
    target_event TEXT,
    target_date DATE,
    progress_percentage DECIMAL(5,2) DEFAULT 0,
    milestones TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE speech_practice (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    practice_type TEXT NOT NULL,  -- impromptu, prepared, feedback, video
    topic TEXT,
    duration_seconds INT,
    video_url TEXT,
    ai_feedback TEXT,
    self_rating DECIMAL(3,2),
    improvement_areas TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- AI CONVERSATIONS
-- ============================================

CREATE TABLE ai_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    module_name TEXT NOT NULL,
    topic TEXT,
    message_count INT DEFAULT 0,
    summary TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE ai_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES ai_conversations(id) ON DELETE CASCADE,
    role TEXT NOT NULL,  -- user, assistant
    content TEXT NOT NULL,
    tokens_used INT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_module_progress_user ON module_progress(user_id);
CREATE INDEX idx_user_entries_user_module ON user_entries(user_id, module_name);
CREATE INDEX idx_emotions_journal_user_date ON emotions_journal(user_id, created_at);
CREATE INDEX idx_wellness_tracker_user_date ON wellness_tracker(user_id, date);
CREATE INDEX idx_ai_conversations_user ON ai_conversations(user_id);

-- ============================================
-- RLS POLICIES (Row Level Security)
-- ============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE module_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE core_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE emotions_journal ENABLE ROW LEVEL SECURITY;
ALTER TABLE wellness_tracker ENABLE ROW LEVEL SECURITY;
ALTER TABLE burnout_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;

-- Default: users can only access their own data
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);

-- Apply similar policies to other tables
CREATE POLICY "Users can access own profiles" ON user_profiles FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can access own progress" ON module_progress FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can access own entries" ON user_entries FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can access own values" ON core_values FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can access own emotions" ON emotions_journal FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can access own wellness" ON wellness_tracker FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can access own burnout data" ON burnout_assessments FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can access own conversations" ON ai_conversations FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_progress_updated_at BEFORE UPDATE ON module_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_entries_updated_at BEFORE UPDATE ON user_entries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_wellness_updated_at BEFORE UPDATE ON wellness_tracker
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
