/**
 * ANOMALY ANALYZER - TypeScript Version
 * 
 * PURPOSE: Detect suspicious patterns in log files
 * 
 * EASY EXPLANATION:
 * - Takes parsed log entries
 * - Checks for 6 types of suspicious behavior
 * - Returns list of anomalies with explanations and confidence scores
 * 
 * THE 6 DETECTION RULES:
 * 1. High Request Volume - One IP making WAY more requests than others
 * 2. Multiple Failed Attempts - Lots of 4xx/5xx errors (brute force attacks)
 * 3. Unusual Time Activity - Activity during off-hours (1-5 AM)
 * 4. Suspicious URL Access - Trying to access /admin, /.env, /config
 * 5. Large Data Transfer - Downloading huge files (>10MB)
 * 6. Rapid Sequential Requests - Too many requests too fast
 */

import { LogEntry } from './parser';

// Type definition for an anomaly
export interface Anomaly {
  type: string;                 // Name of the anomaly type
  ip?: string;                   // IP address involved
  count?: number;                // How many times it happened
  expected?: number;             // What's normal
  url?: string;                  // URL involved
  urls?: string[];               // Multiple URLs
  pattern?: string;              // Pattern matched
  mb?: number;                   // Size in MB
  timeRange?: string;            // Time range
  hour?: number;                 // Hour of day
  seconds?: number;              // Duration in seconds
  explanation: string;           // Plain English explanation
  confidence: number;            // 0-100% confidence
  severity: 'warning' | 'critical'; // How serious
}

/**
 * MAIN ANALYSIS FUNCTION
 * 
 * Takes all log entries and checks them against 6 detection rules
 * Returns array of found anomalies
 * 
 * @param entries - Array of parsed log entries
 * @returns Anomaly[] - Array of detected anomalies
 */
export function analyzeLog(entries: LogEntry[]): Anomaly[] {
  if (!entries || entries.length === 0) {
    console.log('⚠️ No entries to analyze');
    return [];
  }

  console.log(`🔍 Analyzing ${entries.length} log entries...`);

  const anomalies: Anomaly[] = [];

  // Build statistics first (counts, averages, etc.)
  const stats = buildStats(entries);

  // Run all 6 detection rules
  anomalies.push(...detectHighRequestVolume(stats, entries));
  anomalies.push(...detectFailedAttempts(stats, entries));
  anomalies.push(...detectUnusualTiming(stats, entries));
  anomalies.push(...detectSuspiciousUrls(entries));
  anomalies.push(...detectLargeTransfers(entries));
  anomalies.push(...detectRapidRequests(entries));

  console.log(`✅ Found ${anomalies.length} anomalies`);

  // Sort by severity and confidence
  return anomalies.sort((a, b) => {
    if (a.severity !== b.severity) {
      return a.severity === 'critical' ? -1 : 1;
    }
    return b.confidence - a.confidence;
  });
}

/**
 * BUILD STATISTICS
 * 
 * Calculates useful stats from log entries:
 * - How many requests per IP
 * - Average requests per IP
 * - Failed request counts
 * - Time distribution
 * 
 * @param entries - Log entries
 * @returns Object with statistics
 */
function buildStats(entries: LogEntry[]) {
  const ipCounts: { [ip: string]: number } = {};
  const ipFailures: { [ip: string]: number } = {};
  const hourCounts: { [hour: number]: number } = {};

  entries.forEach(entry => {
    // Count total requests per IP
    ipCounts[entry.ip] = (ipCounts[entry.ip] || 0) + 1;

    // Count failures per IP (status 400+)
    if (entry.statusCode >= 400) {
      ipFailures[entry.ip] = (ipFailures[entry.ip] || 0) + 1;
    }

    // Count requests by hour
    hourCounts[entry.hour] = (hourCounts[entry.hour] || 0) + 1;
  });

  // Calculate average requests per IP
  const ipAddresses = Object.keys(ipCounts);
  const totalIps = ipAddresses.length;
  const totalRequests = entries.length;
  const avgRequestsPerIp = totalIps > 0 ? totalRequests / totalIps : 0;

  return {
    ipCounts,
    ipFailures,
    hourCounts,
    totalIps,
    avgRequestsPerIp,
    totalRequests
  };
}

/**
 * RULE 1: HIGH REQUEST VOLUME
 * 
 * WHAT IT DETECTS:
 * - One IP making 5x more requests than average
 * - Could indicate DDoS attack or automated scanning
 * 
 * EXAMPLE:
 * - Average: 50 requests per IP
 * - This IP: 300 requests (6x average) ← FLAGGED!
 * 
 * @param stats - Statistics object
 * @param entries - Log entries
 * @returns Anomaly[] - Found anomalies
 */
function detectHighRequestVolume(stats: any, entries: LogEntry[]): Anomaly[] {
  const anomalies: Anomaly[] = [];
  const threshold = 5; // 5x more than average

  Object.entries(stats.ipCounts).forEach(([ip, count]) => {
    const requestCount = count as number;
    const multiplier = requestCount / stats.avgRequestsPerIp;

    if (multiplier >= threshold) {
      const confidence = Math.min(95, 50 + (multiplier * 10));

      anomalies.push({
        type: 'High Request Volume',
        ip: ip,
        count: requestCount,
        expected: Math.round(stats.avgRequestsPerIp),
        explanation: `IP ${ip} made ${requestCount} requests, which is ${multiplier.toFixed(1)}x higher than average (${Math.round(stats.avgRequestsPerIp)}). This could indicate automated scanning or DDoS activity.`,
        confidence: Math.round(confidence),
        severity: multiplier >= 8 ? 'critical' : 'warning'
      });
    }
  });

  return anomalies;
}

/**
 * RULE 2: MULTIPLE FAILED ATTEMPTS
 * 
 * WHAT IT DETECTS:
 * - 5+ failed requests (4xx/5xx status codes) from one IP
 * - Could indicate brute force attack or unauthorized access attempt
 * 
 * EXAMPLE:
 * - IP tries to login 15 times, all fail (401 errors) ← FLAGGED!
 * 
 * @param stats - Statistics object
 * @param entries - Log entries
 * @returns Anomaly[] - Found anomalies
 */
function detectFailedAttempts(stats: any, entries: LogEntry[]): Anomaly[] {
  const anomalies: Anomaly[] = [];
  const threshold = 5; // 5+ failures

  Object.entries(stats.ipFailures).forEach(([ip, failureCount]) => {
    const count = failureCount as number;

    if (count >= threshold) {
      // Get the URLs that failed
      const failures = entries.filter(e => e.ip === ip && e.statusCode >= 400);
      const urls = [...new Set(failures.map(f => f.url))].slice(0, 3);

      const confidence = Math.min(95, 60 + (count * 5));

      anomalies.push({
        type: 'Multiple Failed Attempts',
        ip: ip,
        count: count,
        urls: urls,
        explanation: `IP ${ip} had ${count} failed requests. This could indicate a brute force attack or unauthorized access attempt.`,
        confidence: Math.round(confidence),
        severity: count >= 10 ? 'critical' : 'warning'
      });
    }
  });

  return anomalies;
}

/**
 * RULE 3: UNUSUAL TIME ACTIVITY
 * 
 * WHAT IT DETECTS:
 * - 50+ requests during off-hours (1 AM - 5 AM)
 * - Normal business activity shouldn't happen at night
 * 
 * EXAMPLE:
 * - 100 requests at 3:00 AM ← FLAGGED!
 * 
 * @param stats - Statistics object
 * @param entries - Log entries
 * @returns Anomaly[] - Found anomalies
 */
function detectUnusualTiming(stats: any, entries: LogEntry[]): Anomaly[] {
  const anomalies: Anomaly[] = [];
  const offHoursStart = 1;  // 1 AM
  const offHoursEnd = 5;    // 5 AM
  const threshold = 50;     // 50+ requests

  // Check each off-hour
  for (let hour = offHoursStart; hour <= offHoursEnd; hour++) {
    const count = stats.hourCounts[hour] || 0;

    if (count >= threshold) {
      // Get IPs active during this hour
      const hourEntries = entries.filter(e => e.hour === hour);
      const ips = [...new Set(hourEntries.map(e => e.ip))];

      const confidence = Math.min(90, 50 + (count / threshold) * 20);

      anomalies.push({
        type: 'Unusual Time Activity',
        hour: hour,
        count: count,
        ip: ips.length === 1 ? ips[0] : undefined,
        explanation: `${count} requests detected during off-hours (${hour}:00 - ${hour}:59). Normal business activity shouldn't occur at this time.`,
        confidence: Math.round(confidence),
        severity: count >= 100 ? 'critical' : 'warning'
      });
    }
  }

  return anomalies;
}

/**
 * RULE 4: SUSPICIOUS URL ACCESS
 * 
 * WHAT IT DETECTS:
 * - Access to admin panels, config files, sensitive paths
 * - Patterns: /admin, /wp-admin, /.env, /config, /phpmyadmin, etc.
 * 
 * EXAMPLE:
 * - Someone trying to access /.env file ← FLAGGED!
 * 
 * @param entries - Log entries
 * @returns Anomaly[] - Found anomalies
 */
function detectSuspiciousUrls(entries: LogEntry[]): Anomaly[] {
  const anomalies: Anomaly[] = [];

  // List of suspicious URL patterns
  const suspiciousPatterns = [
    { pattern: /\/admin/i, name: 'admin panel' },
    { pattern: /\/wp-admin/i, name: 'WordPress admin' },
    { pattern: /\/phpmyadmin/i, name: 'phpMyAdmin' },
    { pattern: /\.env$/i, name: 'environment file' },
    { pattern: /\/config/i, name: 'config file' },
    { pattern: /\/api\/internal/i, name: 'internal API' },
    { pattern: /\/backup/i, name: 'backup file' },
    { pattern: /\/\.git/i, name: 'git repository' },
    { pattern: /\/database/i, name: 'database file' },
  ];

  // Track suspicious access by IP
  const suspiciousAccess: { [ip: string]: { urls: string[], patterns: string[] } } = {};

  entries.forEach(entry => {
    for (const { pattern, name } of suspiciousPatterns) {
      if (pattern.test(entry.url)) {
        if (!suspiciousAccess[entry.ip]) {
          suspiciousAccess[entry.ip] = { urls: [], patterns: [] };
        }
        suspiciousAccess[entry.ip].urls.push(entry.url);
        suspiciousAccess[entry.ip].patterns.push(name);
      }
    }
  });

  // Create anomaly for each IP with suspicious access
  Object.entries(suspiciousAccess).forEach(([ip, data]) => {
    const uniqueUrls = [...new Set(data.urls)];
    const uniquePatterns = [...new Set(data.patterns)];

    const confidence = Math.min(95, 70 + (uniqueUrls.length * 5));

    anomalies.push({
      type: 'Suspicious URL Access',
      ip: ip,
      count: data.urls.length,
      urls: uniqueUrls.slice(0, 5),
      pattern: uniquePatterns.join(', '),
      explanation: `IP ${ip} attempted to access sensitive paths: ${uniquePatterns.join(', ')}. This could indicate reconnaissance or unauthorized access attempts.`,
      confidence: Math.round(confidence),
      severity: uniqueUrls.length >= 3 ? 'critical' : 'warning'
    });
  });

  return anomalies;
}

/**
 * RULE 5: LARGE DATA TRANSFER
 * 
 * WHAT IT DETECTS:
 * - Downloads larger than 10MB
 * - Could indicate data exfiltration (stealing data)
 * 
 * EXAMPLE:
 * - Someone downloads a 50MB database backup ← FLAGGED!
 * 
 * @param entries - Log entries
 * @returns Anomaly[] - Found anomalies
 */
function detectLargeTransfers(entries: LogEntry[]): Anomaly[] {
  const anomalies: Anomaly[] = [];
  const threshold = 10000000; // 10 MB in bytes

  entries.forEach(entry => {
    if (entry.bytes > threshold) {
      const mb = (entry.bytes / 1000000).toFixed(2);
      const confidence = Math.min(95, 60 + (entry.bytes / threshold) * 10);

      anomalies.push({
        type: 'Large Data Transfer',
        ip: entry.ip,
        url: entry.url,
        mb: parseFloat(mb),
        explanation: `IP ${entry.ip} downloaded ${mb} MB from ${entry.url}. Large data transfers could indicate data exfiltration.`,
        confidence: Math.round(confidence),
        severity: entry.bytes > 50000000 ? 'critical' : 'warning'
      });
    }
  });

  return anomalies;
}

/**
 * RULE 6: RAPID SEQUENTIAL REQUESTS
 * 
 * WHAT IT DETECTS:
 * - 10+ requests from same IP in 10 seconds
 * - Could indicate automated attack or bot activity
 * 
 * EXAMPLE:
 * - 25 requests in 8 seconds from one IP ← FLAGGED!
 * 
 * @param entries - Log entries
 * @returns Anomaly[] - Found anomalies
 */
function detectRapidRequests(entries: LogEntry[]): Anomaly[] {
  const anomalies: Anomaly[] = [];
  const threshold = 10; // 10+ requests
  const timeWindow = 10000; // 10 seconds in milliseconds

  // Sort entries by time
  const sorted = [...entries].sort((a, b) => a.date.getTime() - b.date.getTime());

  // Group by IP
  const byIp: { [ip: string]: LogEntry[] } = {};
  sorted.forEach(entry => {
    if (!byIp[entry.ip]) byIp[entry.ip] = [];
    byIp[entry.ip].push(entry);
  });

  // Check each IP for rapid requests
  Object.entries(byIp).forEach(([ip, ipEntries]) => {
    if (ipEntries.length < threshold) return;

    // Use sliding window to find rapid sequences
    for (let i = 0; i < ipEntries.length - threshold + 1; i++) {
      const windowEntries = ipEntries.slice(i, i + threshold);
      const startTime = windowEntries[0].date.getTime();
      const endTime = windowEntries[windowEntries.length - 1].date.getTime();
      const duration = endTime - startTime;

      if (duration <= timeWindow) {
        const count = windowEntries.length;
        const seconds = (duration / 1000).toFixed(1);
        const confidence = Math.min(95, 60 + (count - threshold) * 3);

        anomalies.push({
          type: 'Rapid Sequential Requests',
          ip: ip,
          count: count,
          seconds: parseFloat(seconds),
          timeRange: `${windowEntries[0].date.toLocaleTimeString()} - ${windowEntries[windowEntries.length - 1].date.toLocaleTimeString()}`,
          explanation: `IP ${ip} made ${count} requests in ${seconds} seconds. This rapid activity pattern suggests automated behavior or attack.`,
          confidence: Math.round(confidence),
          severity: count >= 20 ? 'critical' : 'warning'
        });

        // Only report once per IP
        break;
      }
    }
  });

  return anomalies;
}

