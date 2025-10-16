/**
 * EXPRESS BACKEND SERVER
 * 
 * This is the backend API server that handles:
 * 1. File uploads from the frontend
 * 2. Log parsing and analysis
 * 3. Database operations (storing results in PostgreSQL)
 * 4. User authentication
 * 
 * EASY EXPLANATION:
 * - Think of this as the "brain" that processes log files
 * - Frontend sends files here, this analyzes them, saves to database
 * - Returns results back to frontend to display
 */

import express, { Request, Response } from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors()); // Allow frontend to talk to backend
app.use(express.json({ limit: '10mb' })); // Parse JSON data up to 10MB
app.use(express.urlencoded({ extended: true }));

// Initialize Supabase (PostgreSQL database client)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || ''
);

/**
 * HEALTH CHECK ENDPOINT
 * 
 * Purpose: Check if the server is running
 * URL: GET /api/health
 * Response: { status: "ok", message: "Server is running" }
 */
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'LogTrack API Server is running' });
});

/**
 * AUTHENTICATION ENDPOINT
 * 
 * Purpose: Verify user login credentials
 * URL: POST /api/auth/login
 * Body: { username: string, password: string }
 * Response: { success: true, user: {...} } or { success: false, error: string }
 * 
 * EASY EXPLANATION:
 * - User enters username and password
 * - We check if they match our database
 * - If yes, create a session
 * - If no, show error
 */
app.post('/api/auth/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, error: 'Username and password required' });
  }

  try {
    // Query database for user
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .eq('password', password) // In production, use hashed passwords!
      .single();

    if (error || !user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user;
    res.json({ success: true, user: userWithoutPassword });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

/**
 * FILE UPLOAD & ANALYSIS ENDPOINT
 * 
 * Purpose: Receive log file, parse it, detect anomalies, save to database
 * URL: POST /api/analyze
 * Body: { 
 *   fileContent: string,    // The log file text
 *   fileName: string,       // Name of the file
 *   userId: string,         // Which user uploaded it
 *   apiKey?: string         // Optional OpenAI key for unknown formats
 * }
 * Response: { 
 *   success: true, 
 *   data: { 
 *     entries: [...],       // Parsed log entries
 *     anomalies: [...],     // Detected anomalies
 *     analysisId: string    // Database ID for this analysis
 *   }
 * }
 * 
 * EASY EXPLANATION:
 * - User uploads a log file
 * - We read it line by line and extract data
 * - We check for suspicious patterns (anomalies)
 * - We save everything to database
 * - We send results back to show user
 */
app.post('/api/analyze', async (req: Request, res: Response) => {
  const { fileContent, fileName, userId, apiKey } = req.body;

  if (!fileContent || !fileName || !userId) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }

  try {
    // TODO: Import and use parser and analyzer functions here
    // For now, return mock data
    const mockData = {
      entries: [],
      anomalies: [],
      analysisId: 'mock-id-' + Date.now()
    };

    // Save to database
    const { data: analysis, error } = await supabase
      .from('analyses')
      .insert({
        user_id: userId,
        file_name: fileName,
        file_size: fileContent.length,
        entries_count: mockData.entries.length,
        anomalies_count: mockData.anomalies.length,
        results: mockData,
        analyzed_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.json({ 
      success: true, 
      data: {
        ...mockData,
        analysisId: analysis.id
      }
    });

  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ success: false, error: 'Analysis failed' });
  }
});

/**
 * GET ANALYSIS HISTORY
 * 
 * Purpose: Get all past analyses for a user
 * URL: GET /api/analyses/:userId
 * Response: { success: true, analyses: [...] }
 * 
 * EASY EXPLANATION:
 * - Shows user all their previous log analyses
 * - Like a history of what they've uploaded before
 */
app.get('/api/analyses/:userId', async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const { data: analyses, error } = await supabase
      .from('analyses')
      .select('*')
      .eq('user_id', userId)
      .order('analyzed_at', { ascending: false });

    if (error) {
      throw error;
    }

    res.json({ success: true, analyses });

  } catch (error) {
    console.error('Fetch analyses error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch analyses' });
  }
});

/**
 * GET SINGLE ANALYSIS
 * 
 * Purpose: Get details of a specific analysis
 * URL: GET /api/analysis/:id
 * Response: { success: true, analysis: {...} }
 */
app.get('/api/analysis/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const { data: analysis, error } = await supabase
      .from('analyses')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    res.json({ success: true, analysis });

  } catch (error) {
    console.error('Fetch analysis error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch analysis' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 LogTrack API Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});

export default app;

