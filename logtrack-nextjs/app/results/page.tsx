/**
 * RESULTS PAGE
 * 
 * This is where users see the analysis results
 * 
 * PURPOSE:
 * - Show summary statistics (total events, unique IPs, etc.)
 * - Display anomalies in TWO sections:
 *   1. CRITICAL ISSUES (red) - serious threats
 *   2. WARNINGS (orange) - suspicious but less severe
 * - Show detailed event table
 * 
 * EASY EXPLANATION:
 * - Like a medical test result
 * - Shows what's critical (needs immediate attention)
 * - Shows what's concerning (should monitor)
 * - Shows all the data in a table
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Anomaly } from '@/lib/analyzer';
import { LogEntry } from '@/lib/parser';

interface Results {
  entries: LogEntry[];
  anomalies: Anomaly[];
  analysisId: string;
}

export default function ResultsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [results, setResults] = useState<Results | null>(null);
  const [criticalAnomalies, setCriticalAnomalies] = useState<Anomaly[]>([]);
  const [warningAnomalies, setWarningAnomalies] = useState<Anomaly[]>([]);

  useEffect(() => {
    // Check authentication
    const userData = localStorage.getItem('logtrack-user');
    if (!userData) {
      router.push('/');
      return;
    }
    setUser(JSON.parse(userData));

    // Load results
    const resultsData = sessionStorage.getItem('logtrack-results');
    if (!resultsData) {
      router.push('/upload');
      return;
    }

    const parsedResults: Results = JSON.parse(resultsData);
    
    // Convert date strings back to Date objects
    parsedResults.entries = parsedResults.entries.map(entry => ({
      ...entry,
      date: new Date(entry.date)
    }));

    setResults(parsedResults);

    // Separate anomalies by severity
    const critical = parsedResults.anomalies.filter(a => a.severity === 'critical');
    const warnings = parsedResults.anomalies.filter(a => a.severity === 'warning');
    
    setCriticalAnomalies(critical);
    setWarningAnomalies(warnings);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('logtrack-user');
    sessionStorage.removeItem('logtrack-results');
    router.push('/');
  };

  const handleNewAnalysis = () => {
    sessionStorage.removeItem('logtrack-results');
    router.push('/upload');
  };

  if (!user || !results) return null;

  // Calculate summary stats
  const uniqueIps = new Set(results.entries.map(e => e.ip)).size;
  const sortedEntries = [...results.entries].sort((a, b) => a.date.getTime() - b.date.getTime());
  const timeRange = sortedEntries.length > 0 
    ? `${sortedEntries[0].date.toLocaleString()} - ${sortedEntries[sortedEntries.length - 1].date.toLocaleString()}`
    : 'N/A';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Navigation */}
      <nav className="bg-slate-800/50 backdrop-blur-lg border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl mr-2">🔒</span>
              <span className="text-xl font-bold text-white">LogTrack</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/history')}
                className="text-slate-300 hover:text-white transition-colors"
              >
                📊 History
              </button>
              <button
                onClick={handleNewAnalysis}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
              >
                New Analysis
              </button>
              <span className="text-sm text-slate-300">👤 {user.username}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            📊 Analysis Results
          </h1>
          <p className="text-slate-300">
            {results.anomalies.length === 0 
              ? '✅ No anomalies detected - this log looks clean!'
              : `⚠️ Found ${results.anomalies.length} anomaly(ies) - ${criticalAnomalies.length} critical, ${warningAnomalies.length} warnings`
            }
          </p>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-lg rounded-lg p-4 border border-slate-700">
            <p className="text-sm text-slate-400 mb-1">Total Events</p>
            <p className="text-2xl font-bold text-white">{results.entries.length}</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-lg rounded-lg p-4 border border-slate-700">
            <p className="text-sm text-slate-400 mb-1">Unique IPs</p>
            <p className="text-2xl font-bold text-white">{uniqueIps}</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-lg rounded-lg p-4 border border-slate-700">
            <p className="text-sm text-slate-400 mb-1">Anomalies</p>
            <p className="text-2xl font-bold text-white">{results.anomalies.length}</p>
          </div>
          <div className="bg-red-900/30 backdrop-blur-lg rounded-lg p-4 border border-red-700">
            <p className="text-sm text-red-300 mb-1">Critical Issues</p>
            <p className="text-2xl font-bold text-red-400">{criticalAnomalies.length}</p>
          </div>
          <div className="bg-yellow-900/30 backdrop-blur-lg rounded-lg p-4 border border-yellow-700">
            <p className="text-sm text-yellow-300 mb-1">Warnings</p>
            <p className="text-2xl font-bold text-yellow-400">{warningAnomalies.length}</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-lg rounded-lg p-4 border border-slate-700 md:col-span-3 lg:col-span-1">
            <p className="text-sm text-slate-400 mb-1">Time Range</p>
            <p className="text-xs font-mono text-white">{timeRange}</p>
          </div>
        </div>

        {/* CRITICAL ISSUES SECTION */}
        {criticalAnomalies.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">🚨</span>
              <h2 className="text-2xl font-bold text-red-400">
                Critical Issues ({criticalAnomalies.length})
              </h2>
            </div>
            <div className="space-y-4">
              {criticalAnomalies.map((anomaly, index) => (
                <AnomalyCard key={index} anomaly={anomaly} severity="critical" />
              ))}
            </div>
          </div>
        )}

        {/* WARNINGS SECTION */}
        {warningAnomalies.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">⚠️</span>
              <h2 className="text-2xl font-bold text-yellow-400">
                Warnings ({warningAnomalies.length})
              </h2>
            </div>
            <div className="space-y-4">
              {warningAnomalies.map((anomaly, index) => (
                <AnomalyCard key={index} anomaly={anomaly} severity="warning" />
              ))}
            </div>
          </div>
        )}

        {/* Event Table */}
        <div className="bg-slate-800/50 backdrop-blur-lg rounded-lg border border-slate-700 overflow-hidden">
          <div className="p-4 border-b border-slate-700">
            <h3 className="text-lg font-semibold text-white">Event Details</h3>
            <p className="text-sm text-slate-400">Showing last 100 events</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Time</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">IP Address</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Method</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">URL</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Size</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {sortedEntries.slice(-100).reverse().map((entry, index) => (
                  <tr key={index} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-4 py-3 text-sm text-slate-300 font-mono">
                      {entry.date.toLocaleTimeString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-300 font-mono">
                      {entry.ip}
                    </td>
                    <td className="px-4 py-3 text-sm text-blue-400 font-semibold">
                      {entry.method}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-300 truncate max-w-xs">
                      {entry.url}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        entry.statusCode >= 500 ? 'bg-red-500/20 text-red-300' :
                        entry.statusCode >= 400 ? 'bg-yellow-500/20 text-yellow-300' :
                        entry.statusCode >= 300 ? 'bg-blue-500/20 text-blue-300' :
                        'bg-green-500/20 text-green-300'
                      }`}>
                        {entry.statusCode}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-400">
                      {formatBytes(entry.bytes)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * ANOMALY CARD COMPONENT
 * 
 * Displays individual anomaly with color-coded severity
 */
function AnomalyCard({ anomaly, severity }: { anomaly: Anomaly; severity: 'critical' | 'warning' }) {
  const bgColor = severity === 'critical' 
    ? 'bg-red-900/20 border-red-700' 
    : 'bg-yellow-900/20 border-yellow-700';
  
  const badgeColor = severity === 'critical'
    ? 'bg-red-500/20 text-red-300'
    : 'bg-yellow-500/20 text-yellow-300';

  const confColor = anomaly.confidence >= 85
    ? 'text-red-400'
    : anomaly.confidence >= 70
    ? 'text-yellow-400'
    : 'text-blue-400';

  const icons: { [key: string]: string } = {
    'High Request Volume': '📈',
    'Multiple Failed Attempts': '🚫',
    'Unusual Time Activity': '🌙',
    'Suspicious URL Access': '🔓',
    'Large Data Transfer': '📦',
    'Rapid Sequential Requests': '⚡'
  };

  return (
    <div className={`rounded-lg p-6 border-2 ${bgColor} backdrop-blur-lg`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{icons[anomaly.type] || '⚠️'}</span>
          <h3 className="text-xl font-bold text-white">{anomaly.type}</h3>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${confColor}`}>
          {anomaly.confidence}% confident
        </span>
      </div>

      <p className="text-slate-200 mb-4">{anomaly.explanation}</p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
        {anomaly.ip && (
          <div>
            <span className="text-slate-400">IP Address:</span>
            <span className="ml-2 text-white font-mono">{anomaly.ip}</span>
          </div>
        )}
        {anomaly.count && (
          <div>
            <span className="text-slate-400">Count:</span>
            <span className="ml-2 text-white font-semibold">{anomaly.count}</span>
          </div>
        )}
        {anomaly.expected && (
          <div>
            <span className="text-slate-400">Expected:</span>
            <span className="ml-2 text-white">~{anomaly.expected}</span>
          </div>
        )}
        {anomaly.mb && (
          <div>
            <span className="text-slate-400">Data Size:</span>
            <span className="ml-2 text-white font-semibold">{anomaly.mb} MB</span>
          </div>
        )}
        {anomaly.seconds && (
          <div>
            <span className="text-slate-400">Duration:</span>
            <span className="ml-2 text-white">{anomaly.seconds}s</span>
          </div>
        )}
      </div>

      {anomaly.urls && anomaly.urls.length > 0 && (
        <div className="mt-4 p-3 bg-slate-900/50 rounded border border-slate-600">
          <p className="text-xs text-slate-400 mb-2">Affected URLs:</p>
          <div className="space-y-1">
            {anomaly.urls.map((url, i) => (
              <p key={i} className="text-xs text-slate-300 font-mono truncate">{url}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1024 / 1024).toFixed(2) + ' MB';
}

