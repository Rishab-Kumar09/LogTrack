/**
 * AI SUMMARY API ENDPOINT
 * 
 * URL: POST /api/ai-summary
 * Purpose: Generate AI-powered security analysis using ChatGPT
 * 
 * EASY EXPLANATION:
 * - Receives anomaly summary data
 * - Sends to OpenAI ChatGPT for analysis
 * - Returns human-readable security insights
 * 
 * This demonstrates AI usage in the application!
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { anomalySummary } = await request.json();

    // Check if OpenAI API key is configured
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'OpenAI API key not configured. Add OPENAI_API_KEY to your environment variables.'
      }, { status: 400 });
    }

    // Prepare prompt for ChatGPT
    const prompt = `You are a cybersecurity analyst reviewing log analysis results. Analyze the following security findings and provide a brief, professional summary (3-4 sentences) of the security posture and recommended actions.

Analysis Results:
- Total Log Entries: ${anomalySummary.total_entries}
- Unique IP Addresses: ${anomalySummary.unique_ips}
- Critical Security Issues: ${anomalySummary.critical_issues}
- Warning-Level Issues: ${anomalySummary.warnings}

Detected Anomalies:
${anomalySummary.anomaly_types.map((a: any) => 
  `- ${a.type} (${a.severity.toUpperCase()}, ${a.confidence}% confidence)`
).join('\n')}

Provide a concise security assessment focusing on:
1. Overall threat level
2. Most concerning findings
3. Immediate action items

Keep it under 100 words and professional.`;

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a concise cybersecurity analyst providing actionable insights.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 300
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);
      return NextResponse.json({
        success: false,
        error: 'Failed to generate AI summary. Check your API key and quota.'
      }, { status: 500 });
    }

    const data = await response.json();
    const aiSummary = data.choices[0]?.message?.content || 'No summary generated';

    console.log('✅ AI summary generated successfully');

    return NextResponse.json({
      success: true,
      summary: aiSummary.trim()
    });

  } catch (error) {
    console.error('AI summary error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to generate AI summary'
    }, { status: 500 });
  }
}

