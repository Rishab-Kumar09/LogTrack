/**
 * POSTGRESQL DATABASE SCHEMA
 * 
 * This file defines the structure of our database tables.
 * Run this in your Supabase SQL editor to create the tables.
 * 
 * EASY EXPLANATION:
 * - users table: Stores who can log in (username, password, email)
 * - analyses table: Stores every log file analysis (what was uploaded, what was found)
 * 
 * Think of tables like Excel sheets:
 * - Each table is a sheet
 * - Each row is one record
 * - Each column is a field (like name, email, etc.)
 */

-- USERS TABLE
-- Stores user accounts
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL, -- In production, this would be hashed!
  role VARCHAR(20) DEFAULT 'analyst', -- 'admin' or 'analyst'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ANALYSES TABLE
-- Stores all log file analyses
CREATE TABLE IF NOT EXISTS analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_size INTEGER NOT NULL, -- in bytes
  entries_count INTEGER DEFAULT 0, -- how many log entries
  anomalies_count INTEGER DEFAULT 0, -- how many anomalies found
  results JSONB NOT NULL, -- stores the full analysis results
  analyzed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- INDEXES for faster queries
CREATE INDEX IF NOT EXISTS idx_analyses_user_id ON analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_analyses_analyzed_at ON analyses(analyzed_at DESC);

-- ROW LEVEL SECURITY (RLS)
-- This ensures users can only see their own analyses
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only read their own analyses
CREATE POLICY "Users can view own analyses"
  ON analyses FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own analyses
CREATE POLICY "Users can create own analyses"
  ON analyses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- INSERT DEFAULT USERS (for testing)
-- These are the same users from the original app
INSERT INTO users (username, email, password, role) VALUES
  ('admin', 'admin@logtrack.com', 'password123', 'admin'),
  ('analyst', 'analyst@logtrack.com', 'soc2024', 'analyst')
ON CONFLICT (username) DO NOTHING;

-- VERIFICATION
-- Run these to check if tables were created successfully
SELECT 'Users table created' AS status, COUNT(*) AS user_count FROM users;
SELECT 'Analyses table created' AS status, COUNT(*) AS analyses_count FROM analyses;

