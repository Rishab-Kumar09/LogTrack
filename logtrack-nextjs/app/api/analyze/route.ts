/**
 * ANALYZE API ENDPOINT
 * 
 * URL: POST /api/analyze
 * Purpose: Parse log file and detect anomalies
 * 
 * EASY EXPLANATION:
 * - Receives log file content from frontend
 * - Parses it using our parser
 * - Analyzes it for anomalies
 * - Saves results to database
 * - Returns results to frontend
 * 
 * THIS IS THE CORE OF THE APP!
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { parseLogUniversal } from '@/lib/parser';
import { analyzeLog } from '@/lib/analyzer';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || ''
);

export async function POST(request: NextRequest) {
  try {
    const { fileContent, fileName, userId, apiKey } = await request.json();

    if (!fileContent || !fileName || !userId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    console.log(`🔍 Analyzing ${fileName}...`);

    // Step 1: Parse the log file
    const entries = await parseLogUniversal(fileContent, apiKey);

    if (entries.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid log entries found. Please check the log format.' },
        { status: 400 }
      );
    }

    console.log(`✅ Parsed ${entries.length} entries`);

    // Step 2: Analyze for anomalies
    const anomalies = analyzeLog(entries);

    console.log(`✅ Found ${anomalies.length} anomalies`);

    // Step 3: Save to database
    const results = {
      entries,
      anomalies
    };

    const { data: analysis, error: dbError } = await supabase
      .from('analyses')
      .insert({
        user_id: userId,
        file_name: fileName,
        file_size: fileContent.length,
        entries_count: entries.length,
        anomalies_count: anomalies.length,
        results: results,
        analyzed_at: new Date().toISOString()
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      // Don't fail the request if DB save fails
    }

    // Step 4: Return results
    return NextResponse.json({
      success: true,
      data: {
        entries,
        anomalies,
        analysisId: analysis?.id || 'local-' + Date.now()
      }
    });

  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { success: false, error: 'Analysis failed: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

