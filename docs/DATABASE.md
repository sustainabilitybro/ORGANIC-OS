# Database Schema

Organic OS uses Supabase (PostgreSQL) as its database. This document describes the schema, relationships, and Row Level Security (RLS) policies.

## Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      organic_os                             │
├─────────────────────────────────────────────────────────────┤
│  users                 │  User accounts                      │
│  wellness_entries      │  Daily wellness data                │
│  module_progress       │  Progress per module                │
│  conversations         │  AI coaching conversations          │
│  messages              │  Chat messages                      │
└─────────────────────────────────────────────────────────────┘
```

## Tables

### 1. Users Table

Stores user account information.

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  timezone TEXT DEFAULT 'UTC',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Indexes:**
- `users_email_idx` on `email`

**RLS Policies:**
```sql
-- Users can read their own data
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);
```

---

### 2. Wellness Entries Table

Stores daily wellness tracking data.

```sql
CREATE TABLE wellness_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  sleep_hours DECIMAL(4,2),
  water_intake_ml INTEGER,
  exercise_minutes INTEGER,
  meditation_minutes INTEGER,
  mood_score DECIMAL(3,2),
  energy_level DECIMAL(3,2),
  nutrition_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);
```

**Indexes:**
- `wellness_user_date_idx` on `user_id`, `date`
- `wellness_date_idx` on `date`

**RLS Policies:**
```sql
-- Users can read their own entries
CREATE POLICY "Users can read own wellness" ON wellness_entries
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own entries
CREATE POLICY "Users can insert own wellness" ON wellness_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own entries
CREATE POLICY "Users can update own wellness" ON wellness_entries
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own entries
CREATE POLICY "Users can delete own wellness" ON wellness_entries
  FOR DELETE USING (auth.uid() = user_id);
```

---

### 3. Module Progress Table

Stores progress for each module.

```sql
CREATE TABLE module_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  module_name TEXT NOT NULL,
  progress_percentage DECIMAL(5,2) DEFAULT 0,
  completed_topics TEXT[] DEFAULT '{}',
  current_focus TEXT,
  notes TEXT,
  last_activity TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, module_name)
);
```

**Indexes:**
- `progress_user_module_idx` on `user_id`, `module_name`
- `progress_module_idx` on `module_name`

**RLS Policies:**
```sql
-- Users can read their own progress
CREATE POLICY "Users can read own progress" ON module_progress
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own progress
CREATE POLICY "Users can insert own progress" ON module_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own progress
CREATE POLICY "Users can update own progress" ON module_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own progress
CREATE POLICY "Users can delete own progress" ON module_progress
  FOR DELETE USING (auth.uid() = user_id);
```

---

### 4. Conversations Table

Stores AI coaching conversations.

```sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  module_name TEXT NOT NULL,
  topic TEXT,
  message_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Indexes:**
- `conversations_user_idx` on `user_id`
- `conversations_module_idx` on `module_name`

**RLS Policies:**
```sql
-- Users can read their own conversations
CREATE POLICY "Users can read own conversations" ON conversations
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own conversations
CREATE POLICY "Users can insert own conversations" ON conversations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own conversations
CREATE POLICY "Users can update own conversations" ON conversations
  FOR UPDATE USING (auth.uid() = user_id);
```

---

### 5. Messages Table

Stores individual chat messages.

```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  tokens_used INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Indexes:**
- `messages_conversation_idx` on `conversation_id`
- `messages_created_idx` on `created_at`

**RLS Policies:**
```sql
-- Users can read messages from their conversations
CREATE POLICY "Users can read own messages" ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE id = messages.conversation_id
      AND user_id = auth.uid()
    )
  );

-- Users can insert messages to their conversations
CREATE POLICY "Users can insert own messages" ON messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE id = messages.conversation_id
      AND user_id = auth.uid()
    )
  );
```

---

## Functions

### Updated At Trigger

Automatically updates `updated_at` timestamp.

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wellness_updated_at
  BEFORE UPDATE ON wellness_entries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_progress_updated_at
  BEFORE UPDATE ON module_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Get User Stats

Calculates wellness statistics for a date range.

```sql
CREATE OR REPLACE FUNCTION get_wellness_stats(
  p_user_id UUID,
  p_days INTEGER DEFAULT 30
)
RETURNS TABLE (
  avg_sleep DECIMAL,
  avg_mood DECIMAL,
  avg_energy DECIMAL,
  avg_water INTEGER,
  avg_exercise INTEGER,
  avg_meditation INTEGER,
  entries_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    AVG(we.sleep_hours)::DECIMAL(4,2),
    AVG(we.mood_score)::DECIMAL(4,2),
    AVG(we.energy_level)::DECIMAL(4,2),
    AVG(we.water_intake_ml)::INTEGER,
    AVG(we.exercise_minutes)::INTEGER,
    AVG(we.meditation_minutes)::INTEGER,
    COUNT(*)::BIGINT
  FROM wellness_entries we
  WHERE we.user_id = p_user_id
    AND we.date >= CURRENT_DATE - p_days;
END;
$$ LANGUAGE plpgsql;
```

### Calculate Streak

Calculates consecutive days of wellness tracking.

```sql
CREATE OR REPLACE FUNCTION get_wellness_streak(p_user_id UUID)
RETURNS TABLE (
  streak INTEGER,
  last_entry DATE,
  total_entries BIGINT
) AS $$
DECLARE
  v_current DATE;
  v_streak INTEGER := 0;
  v_last DATE;
  v_count BIGINT;
BEGIN
  SELECT MAX(date), COUNT(*) INTO v_last, v_count
  FROM wellness_entries
  WHERE user_id = p_user_id;

  IF v_count = 0 THEN
    RETURN QUERY SELECT 0, NULL::DATE, 0::BIGINT;
    RETURN;
  END IF;

  v_current := CURRENT_DATE;
  
  -- Check if there's an entry for today or yesterday
  IF NOT EXISTS (
    SELECT 1 FROM wellness_entries
    WHERE user_id = p_user_id AND date = v_current
  ) THEN
    v_current := v_current - 1;
  END IF;

  -- Count consecutive days
  WHILE EXISTS (
    SELECT 1 FROM wellness_entries
    WHERE user_id = p_user_id AND date = v_current
  ) LOOP
    v_streak := v_streak + 1;
    v_current := v_current - 1;
  END LOOP;

  RETURN QUERY SELECT v_streak, v_last, v_count;
END;
$$ LANGUAGE plpgsql;
```

---

## Migrations

### Applying Migrations

```bash
# Using Supabase CLI
supabase db push

# Or via SQL
psql -f apps/supabase/schema.sql
```

### Migration File Location

All migrations are in: `apps/supabase/schema.sql`

---

## Backup and Restore

### Backup

```bash
# Using pg_dump
pg_dump "postgresql://user:password@host:5432/db" > backup.sql

# Using Supabase CLI
supabase db dump > backup.sql
```

### Restore

```bash
psql -d db_name -f backup.sql
```

---

## Performance Considerations

### Partitioning

For large datasets, consider partitioning:

```sql
-- Example: Partition wellness_entries by month
CREATE TABLE wellness_entries (
  LIKE wellness_entries INCLUDING DEFAULTS
) PARTITION BY RANGE (date);

-- Create monthly partitions
CREATE TABLE wellness_entries_2026_01 PARTITION OF wellness_entries
  FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');

CREATE TABLE wellness_entries_2026_02 PARTITION OF wellness_entries
  FOR VALUES FROM ('2026-02-01') TO ('2026-03-01');
```

### Connection Pooling

Use Supabase's connection pool for better performance:

```bash
# Pooled connection
postgresql://user:password@host:6543/db
```

---

## Security Checklist

- [ ] RLS enabled on all tables
- [ ] Service role key never exposed to client
- [ ] Regular backups configured
- [ ] SSL/TLS enabled
- [ ] Audit logging enabled
- [ ] Password policy enforced (Supabase Auth)
- [ ] Email confirmation required
