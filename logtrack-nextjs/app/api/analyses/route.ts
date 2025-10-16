/**
 * ANALYSES API ENDPOINT
 * 
 * URL: GET /api/analyses?userId=xxx - Get all analyses for a user
 * URL: DELETE /api/analyses?id=xxx - Delete a specific analysis
 * 
 * EASY EXPLANATION:
 * - GET: Returns list of all analyses for the logged-in user
 * - DELETE: Removes a specific analysis from database
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || ''
);

/**
 * GET - Fetch all analyses for a user
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID required' },
        { status: 400 }
      );
    }

    // Fetch all analyses for this user, newest first
    const { data: analyses, error } = await supabase
      .from('analyses')
      .select('*')
      .eq('user_id', userId)
      .order('analyzed_at', { ascending: false });

    if (error) {
      console.error('Fetch analyses error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch analyses' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      analyses: analyses || []
    });

  } catch (error) {
    console.error('Get analyses error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE - Remove a specific analysis
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const userId = searchParams.get('userId');

    if (!id || !userId) {
      return NextResponse.json(
        { success: false, error: 'Analysis ID and User ID required' },
        { status: 400 }
      );
    }

    // Delete the analysis (only if it belongs to this user)
    const { error } = await supabase
      .from('analyses')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      console.error('Delete analysis error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to delete analysis' },
        { status: 500 }
      );
    }

    console.log(`✅ Deleted analysis: ${id}`);

    return NextResponse.json({
      success: true,
      message: 'Analysis deleted successfully'
    });

  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}

