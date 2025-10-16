/**
 * HISTORY PAGE
 * 
 * URL: /history
 * Purpose: Show all past analyses and allow users to view or delete them
 * 
 * EASY EXPLANATION:
 * - Lists all log files the user has analyzed
 * - Shows when they were analyzed and how many anomalies found
 * - Users can click to view full results or delete
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Analysis {
  id: string;
  file_name: string;
  file_size: number;
  entries_count: number;
  anomalies_count: number;
  analyzed_at: string;
  results: any;
}

export default function HistoryPage() {
  const router = useRouter();
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Load user and their analyses
  useEffect(() => {
    const userData = localStorage.getItem('logtrack-user');
    if (!userData) {
      router.push('/');
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);

    // Fetch analyses
    fetchAnalyses(parsedUser.id);
  }, [router]);

  /**
   * Fetch all analyses for this user
   */
  const fetchAnalyses = async (userId: string) => {
    try {
      const response = await fetch(`/api/analyses?userId=${userId}`);
      const data = await response.json();

      if (data.success) {
        setAnalyses(data.analyses);
      }
    } catch (error) {
      console.error('Failed to fetch analyses:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete an analysis
   */
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this analysis?')) {
      return;
    }

    setDeletingId(id);

    try {
      const response = await fetch(`/api/analyses?id=${id}&userId=${user.id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        // Remove from list
        setAnalyses(analyses.filter(a => a.id !== id));
      } else {
        alert('Failed to delete: ' + data.error);
      }
    } catch (error) {
      alert('Failed to delete analysis');
    } finally {
      setDeletingId(null);
    }
  };

  /**
   * View an analysis (go to results page with this data)
   */
  const handleView = (analysis: Analysis) => {
    // Store the analysis results in localStorage
    sessionStorage.setItem('logtrack-results', JSON.stringify({
      entries: analysis.results.entries,
      anomalies: analysis.results.anomalies,
      fileName: analysis.file_name
    }));

    // Navigate to results page
    router.push('/results');
  };

  /**
   * Format file size
   */
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  /**
   * Format date
   */
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-lg border-b border-slate-700 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-white">🔒 LogTrack</h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/upload')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                New Analysis
              </button>
              <span className="text-slate-300">👤 {user?.username}</span>
              <button
                onClick={() => {
                  localStorage.removeItem('logtrack-user');
                  router.push('/');
                }}
                className="text-red-400 hover:text-red-300"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">📊 Analysis History</h2>
          <p className="text-slate-400">
            View and manage your past log analyses
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center text-slate-400 py-12">
            <div className="text-4xl mb-4">⏳</div>
            Loading your analyses...
          </div>
        )}

        {/* Empty State */}
        {!loading && analyses.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-slate-400 text-lg mb-6">No analyses yet</p>
            <button
              onClick={() => router.push('/upload')}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Upload Your First Log File
            </button>
          </div>
        )}

        {/* Analyses List */}
        {!loading && analyses.length > 0 && (
          <div className="grid gap-4">
            {analyses.map((analysis) => (
              <div
                key={analysis.id}
                className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-colors"
              >
                <div className="flex items-start justify-between">
                  {/* Left: File Info */}
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      📄 {analysis.file_name}
                    </h3>
                    <div className="flex gap-6 text-sm text-slate-400">
                      <span>📅 {formatDate(analysis.analyzed_at)}</span>
                      <span>📦 {formatSize(analysis.file_size)}</span>
                      <span>📝 {analysis.entries_count.toLocaleString()} entries</span>
                      <span className={analysis.anomalies_count > 0 ? 'text-orange-400 font-semibold' : ''}>
                        ⚠️ {analysis.anomalies_count} anomalies
                      </span>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleView(analysis)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
                    >
                      👁️ View
                    </button>
                    <button
                      onClick={() => handleDelete(analysis.id)}
                      disabled={deletingId === analysis.id}
                      className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/50 rounded-lg transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {deletingId === analysis.id ? '⏳' : '🗑️'} Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

