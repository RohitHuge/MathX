-- Add ref_id column to teams table
ALTER TABLE teams 
ADD COLUMN IF NOT EXISTS ref_id text UNIQUE;
