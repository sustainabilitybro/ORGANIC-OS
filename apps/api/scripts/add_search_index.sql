-- Add Full Text Search support
-- Enable pg_trgm extension for fuzzy search if needed (optional but good)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Add tsvector columns to tables if they don't exist
ALTER TABLE organisms ADD COLUMN IF NOT EXISTS search_vector tsvector;
ALTER TABLE compounds ADD COLUMN IF NOT EXISTS search_vector tsvector;
ALTER TABLE indications ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_organisms_search ON organisms USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_compounds_search ON compounds USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_indications_search ON indications USING GIN(search_vector);

-- DROP TRIGGERS FIRST to avoid errors from old/bad entries during updates
DROP TRIGGER IF EXISTS tsvectorupdate_organisms ON organisms;
DROP TRIGGER IF EXISTS tsvectorupdate_compounds ON compounds;
DROP TRIGGER IF EXISTS tsvectorupdate_indications ON indications;

-- Create/Update trigger functions with CORRECT column names
CREATE OR REPLACE FUNCTION organisms_search_trigger() RETURNS trigger AS $$
BEGIN
  new.search_vector :=
    setweight(to_tsvector('english', coalesce(new.common_name_en, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(new.description, '')), 'B');
  RETURN new;
END
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION compounds_search_trigger() RETURNS trigger AS $$
BEGIN
  new.search_vector :=
    setweight(to_tsvector('english', coalesce(new.common_name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(new.description, '')), 'B');
  RETURN new;
END
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION indications_search_trigger() RETURNS trigger AS $$
BEGIN
  new.search_vector :=
    setweight(to_tsvector('english', coalesce(new.condition_name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(new.description, '')), 'B');
  RETURN new;
END
$$ LANGUAGE plpgsql;

-- Re-create triggers
CREATE TRIGGER tsvectorupdate_organisms BEFORE INSERT OR UPDATE
    ON organisms FOR EACH ROW EXECUTE PROCEDURE organisms_search_trigger();

CREATE TRIGGER tsvectorupdate_compounds BEFORE INSERT OR UPDATE
    ON compounds FOR EACH ROW EXECUTE PROCEDURE compounds_search_trigger();

CREATE TRIGGER tsvectorupdate_indications BEFORE INSERT OR UPDATE
    ON indications FOR EACH ROW EXECUTE PROCEDURE indications_search_trigger();

-- Finally, update existing data (triggers will fire and populate vectors)
-- Note: We can also just run the UPDATE logic directly to be safe, but touching the rows fires the trigger.
-- To be more efficient and explicit (and avoid relying on trigger firing if we just want to fill column):
UPDATE organisms SET search_vector = 
    setweight(to_tsvector('english', coalesce(common_name_en, '')), 'A') || 
    setweight(to_tsvector('english', coalesce(description, '')), 'B');

UPDATE compounds SET search_vector = 
    setweight(to_tsvector('english', coalesce(common_name, '')), 'A') || 
    setweight(to_tsvector('english', coalesce(description, '')), 'B');

UPDATE indications SET search_vector = 
    setweight(to_tsvector('english', coalesce(condition_name, '')), 'A') || 
    setweight(to_tsvector('english', coalesce(description, '')), 'B');
