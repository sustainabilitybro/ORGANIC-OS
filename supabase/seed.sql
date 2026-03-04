-- Organic OS Seed Data
-- This file contains initial data for the database

-- ============================================
-- EMOTION TAXONOMY SEED DATA
-- ============================================

INSERT INTO emotion_taxonomy (emotion_name, definition, synonyms, opposite_emotion, questions_to_explore) VALUES
('Joy', 'A feeling of great pleasure or happiness', ARRAY['happiness', 'delight', 'pleasure'], 'Sadness', '{"Why does this bring joy?", "What conditions create joy?", "How long does joy last?"}'),
('Sadness', 'A feeling of sorrow or unhappiness', ARRAY['grief', 'sorrow', 'melancholy'], 'Joy', '{"What triggered this feeling?", "How can you process this emotion?", "What support do you need?"}'),
('Anger', 'A strong feeling of annoyance or displeasure', ARRAY['rage', 'frustration', 'irritation'], 'Calm', '{"What boundary was crossed?", "How can you express this constructively?", "What is the underlying need?"}'),
('Fear', 'An unpleasant emotion caused by threat or danger', ARRAY['anxiety', 'worry', 'panic'], 'Courage', '{"What are you afraid of?", "What is the worst that could happen?", "What can you control?"}'),
('Surprise', 'A feeling caused by something unexpected', ARRAY['astonishment', 'amazement', 'shock'], 'Expectation', '{"What was unexpected?", "Is this positive or negative?", "How do you adapt?"}'),
('Disgust', 'A feeling of revulsion or strong disapproval', ARRAY['repulsion', 'aversion', 'contempt'], 'Attraction', '{"What triggered this?", "Is this reaction helpful?", "What values are at stake?"}'),
('Trust', 'Firm belief in reliability or truth', ARRAY['confidence', 'faith', 'reliability'], 'Distrust', '{"What evidence supports trust?", "What conditions build trust?", "How is trust earned?"}'),
('Anticipation', 'Expectation or realization that something is about to happen', ARRAY['excitement', 'hope', 'expectation'], 'Surprise', '{"What are you looking forward to?", "What might go wrong?", "How can you prepare?"}');

-- ============================================
-- WELLNESS GOALS TEMPLATES
-- ============================================

INSERT INTO wellness_goals (user_id, goal_type, specific_goal, measurable_target, timeframe, progress_percentage) VALUES
-- Note: These are template goals without user_id for demo purposes
(NULL, 'nutrition', 'Increase vegetable intake', 'Eat 5 servings daily', 'monthly', 0),
(NULL, 'movement', 'Daily exercise', '30 minutes of activity', 'weekly', 0),
(NULL, 'sleep', 'Improve sleep quality', '8 hours of sleep', 'weekly', 0),
(NULL, 'stress', 'Practice mindfulness', '10 minutes daily', 'weekly', 0),
(NULL, 'mindfulness', 'Meditation practice', '15 minutes morning meditation', 'weekly', 0);

-- ============================================
-- CORE VALUES TEMPLATES
-- ============================================

INSERT INTO core_values (user_id, value_name, description, importance_score, examples) VALUES
(NULL, 'Integrity', 'Doing the right thing even when no one is watching', 9.5, 'Being honest, keeping promises, ethical behavior'),
(NULL, 'Growth', 'Continual learning and personal development', 9.0, 'Reading, taking courses, seeking feedback'),
(NULL, 'Health', 'Physical and mental wellbeing', 9.0, 'Exercise, nutrition, sleep, stress management'),
(NULL, 'Connection', 'Meaningful relationships with others', 8.5, 'Family, friends, community, deep conversations'),
(NULL, 'Purpose', 'Contributing to something larger than yourself', 8.5, 'Work that matters, volunteering, mentoring'),
(NULL, 'Creativity', 'Expressing ideas and creating new things', 8.0, 'Art, writing, problem-solving, innovation'),
(NULL, 'Sustainability', 'Living in harmony with the environment', 8.0, 'Eco-friendly choices, reducing waste, conscious consumption');

-- ============================================
-- SPEAKING GOALS TEMPLATES
-- ============================================

INSERT INTO speaking_goals (user_id, goal_name, target_event, target_date, progress_percentage, milestones) VALUES
(NULL, 'Improve public speaking confidence', 'Local Toastmasters', NULL, 0, ARRAY['Complete 5 speeches', 'Receive CC designation', 'Lead a meeting']),
(NULL, 'Start a podcast', 'NOTOX Launch', NULL, 0, ARRAY['Define podcast format', 'Record pilot episode', 'Launch first season']);
