/**
 * UPLOAD PAGE
 * 
 * This is where users upload log files for analysis
 * 
 * PURPOSE:
 * - Show file upload area (drag-drop or click)
 * - Detect log format automatically
 * - Optional: Add OpenAI API key for unknown formats
 * - Send file to backend for parsing and analysis
 * - Redirect to results page when done
 * 
 * EASY EXPLANATION:
 * - Like dropping a document in a scanner
 * - Scanner reads it, finds important stuff, shows you the summary
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { detectLogFormat } from '@/lib/parser';

export default function UploadPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [detectedFormat, setDetectedFormat] = useState<string>('');
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    const userData = localStorage.getItem('logtrack-user');
    if (!userData) {
      router.push('/');
      return;
    }
    setUser(JSON.parse(userData));
  }, [router]);

  /**
   * Handle file selection
   */
  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile);

    // Read first 1KB to detect format
    const reader = new FileReader();
    reader.onload = (e) => {
      const preview = e.target?.result as string;
      if (preview) {
        const format = detectLogFormat(preview);
        setDetectedFormat(format);
      }
    };
    reader.readAsText(selectedFile.slice(0, 1024));
  };

  /**
   * Handle drag and drop
   */
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  /**
   * Handle file analysis
   * 
   * WHAT HAPPENS:
   * 1. Read the entire file
   * 2. Send to backend API (/api/analyze)
   * 3. Backend parses and analyzes it
   * 4. Save results to browser storage
   * 5. Redirect to results page
   */
  const handleAnalyze = async () => {
    if (!file || !user) return;

    setLoading(true);

    try {
      // Read file content
      const reader = new FileReader();
      reader.onload = async (e) => {
        const fileContent = e.target?.result as string;

        // Send to backend for analysis
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileContent,
            fileName: file.name,
            userId: user.id,
            apiKey: apiKey || undefined
          })
        });

        const data = await response.json();

        if (data.success) {
          // Save results to storage
          sessionStorage.setItem('logtrack-results', JSON.stringify(data.data));
          
          // Redirect to results page
          router.push('/results');
        } else {
          alert('❌ Analysis failed: ' + data.error);
        }
        
        setLoading(false);
      };

      reader.onerror = () => {
        alert('❌ Failed to read file');
        setLoading(false);
      };

      reader.readAsText(file);
    } catch (error) {
      console.error('Analysis error:', error);
      alert('❌ Analysis failed. Please try again.');
      setLoading(false);
    }
  };

  /**
   * Logout handler
   */
  const handleLogout = () => {
    localStorage.removeItem('logtrack-user');
    sessionStorage.removeItem('logtrack-results');
    router.push('/');
  };

  const formatNames: { [key: string]: string } = {
    'apache': 'Apache/Nginx',
    'nginx': 'Apache/Nginx',
    'json': 'JSON Logs',
    'w3c': 'W3C Extended',
    'syslog': 'Syslog',
    'iis': 'IIS',
    'unknown': 'Unknown (AI parsing available)'
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Navigation Bar */}
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
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg transition-colors"
              >
                📊 History
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
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Upload Log File</h1>
          <p className="text-slate-300">
            Upload any log format - Apache, Nginx, JSON, W3C, IIS, Syslog, or use AI for unknown formats
          </p>
        </div>

        {/* Upload Card */}
        <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-slate-700">
          {!file ? (
            /* Upload Zone */
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors cursor-pointer ${
                dragActive
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-slate-600 hover:border-slate-500'
              }`}
              onClick={() => document.getElementById('fileInput')?.click()}
            >
              <div className="text-6xl mb-4">📁</div>
              <p className="text-xl text-white mb-2">Drag and drop your log file here</p>
              <p className="text-slate-400 mb-4">or</p>
              <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">
                Choose File
              </button>
              <input
                id="fileInput"
                type="file"
                accept=".log,.txt,.json"
                onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
                className="hidden"
              />
              <p className="text-sm text-slate-500 mt-4">
                Supports: .log, .txt, .json files (max 10MB)
              </p>
            </div>
          ) : (
            /* File Info */
            <div className="space-y-6">
              <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-600">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-slate-400">Selected File:</p>
                    <p className="text-lg font-semibold text-white">{file.name}</p>
                  </div>
                  <button
                    onClick={() => {
                      setFile(null);
                      setDetectedFormat('');
                    }}
                    className="text-slate-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Size:</span>
                    <span className="text-white">
                      {(file.size / 1024).toFixed(2)} KB
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Format:</span>
                    <span className={`font-semibold ${
                      detectedFormat === 'unknown' ? 'text-yellow-400' : 'text-blue-400'
                    }`}>
                      {formatNames[detectedFormat] || detectedFormat}
                    </span>
                  </div>
                </div>
              </div>

              {/* Optional API Key */}
              {detectedFormat === 'unknown' && (
                <details className="bg-slate-900/50 rounded-lg border border-slate-600">
                  <summary className="p-4 cursor-pointer text-slate-300 hover:text-white">
                    🤖 Optional: OpenAI API Key (for unknown formats)
                  </summary>
                  <div className="px-4 pb-4 pt-2">
                    <input
                      type="password"
                      placeholder="sk-..."
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                    />
                    <p className="text-xs text-slate-400 mt-2">
                      Get your API key from{' '}
                      <a
                        href="https://platform.openai.com/api-keys"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline"
                      >
                        OpenAI
                      </a>
                    </p>
                  </div>
                </details>
              )}

              {/* Analyze Button */}
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors text-lg"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <span className="animate-spin mr-2">⏳</span>
                    Analyzing...
                  </span>
                ) : (
                  '🔍 Analyze Log File'
                )}
              </button>
            </div>
          )}
        </div>

        {/* Example Files */}
        <div className="mt-8 bg-slate-800/30 rounded-lg p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-3">📂 Need test files?</h3>
          <p className="text-sm text-slate-300 mb-3">
            Download sample log files to test the analyzer:
          </p>
          <div className="grid gap-2">
            <a
              href="https://raw.githubusercontent.com/Rishab-Kumar09/LogTrack/main/logtrack-nextjs/examples/sample-normal.log"
              download="sample-normal.log"
              className="flex items-center justify-between p-3 bg-slate-900/50 hover:bg-slate-900 rounded-lg border border-slate-600 hover:border-slate-500 transition-colors group"
            >
              <div>
                <span className="text-slate-300 group-hover:text-white font-medium">sample-normal.log</span>
                <span className="text-xs text-slate-500 ml-3">Clean traffic (no anomalies)</span>
              </div>
              <span className="text-blue-400">⬇️</span>
            </a>
            <a
              href="https://raw.githubusercontent.com/Rishab-Kumar09/LogTrack/main/logtrack-nextjs/examples/sample-attacks.log"
              download="sample-attacks.log"
              className="flex items-center justify-between p-3 bg-slate-900/50 hover:bg-slate-900 rounded-lg border border-slate-600 hover:border-slate-500 transition-colors group"
            >
              <div>
                <span className="text-slate-300 group-hover:text-white font-medium">sample-attacks.log</span>
                <span className="text-xs text-slate-500 ml-3">Multiple attack patterns</span>
              </div>
              <span className="text-blue-400">⬇️</span>
            </a>
            <a
              href="https://raw.githubusercontent.com/Rishab-Kumar09/LogTrack/main/logtrack-nextjs/examples/brute-force-attack.log"
              download="brute-force-attack.log"
              className="flex items-center justify-between p-3 bg-slate-900/50 hover:bg-slate-900 rounded-lg border border-slate-600 hover:border-slate-500 transition-colors group"
            >
              <div>
                <span className="text-slate-300 group-hover:text-white font-medium">brute-force-attack.log</span>
                <span className="text-xs text-slate-500 ml-3">Login brute force scenario</span>
              </div>
              <span className="text-blue-400">⬇️</span>
            </a>
            <a
              href="https://raw.githubusercontent.com/Rishab-Kumar09/LogTrack/main/logtrack-nextjs/examples/data-exfiltration.log"
              download="data-exfiltration.log"
              className="flex items-center justify-between p-3 bg-slate-900/50 hover:bg-slate-900 rounded-lg border border-slate-600 hover:border-slate-500 transition-colors group"
            >
              <div>
                <span className="text-slate-300 group-hover:text-white font-medium">data-exfiltration.log</span>
                <span className="text-xs text-slate-500 ml-3">Data theft scenario</span>
              </div>
              <span className="text-blue-400">⬇️</span>
            </a>
            <a
              href="https://raw.githubusercontent.com/Rishab-Kumar09/LogTrack/main/logtrack-nextjs/examples/sql-injection-attack.log"
              download="sql-injection-attack.log"
              className="flex items-center justify-between p-3 bg-slate-900/50 hover:bg-slate-900 rounded-lg border border-slate-600 hover:border-slate-500 transition-colors group"
            >
              <div>
                <span className="text-slate-300 group-hover:text-white font-medium">sql-injection-attack.log</span>
                <span className="text-xs text-slate-500 ml-3">SQL injection attempts</span>
              </div>
              <span className="text-blue-400">⬇️</span>
            </a>
            <a
              href="https://raw.githubusercontent.com/Rishab-Kumar09/LogTrack/main/logtrack-nextjs/examples/mixed-scenario.log"
              download="mixed-scenario.log"
              className="flex items-center justify-between p-3 bg-slate-900/50 hover:bg-slate-900 rounded-lg border border-slate-600 hover:border-slate-500 transition-colors group"
            >
              <div>
                <span className="text-slate-300 group-hover:text-white font-medium">mixed-scenario.log</span>
                <span className="text-xs text-slate-500 ml-3">Combination of attacks</span>
              </div>
              <span className="text-blue-400">⬇️</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

