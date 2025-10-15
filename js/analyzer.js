/**
 * analyzer.js - Anomaly Detection Engine
 * THE CORE: Detects 6 types of security anomalies using rule-based pattern matching
 */

/**
 * Main anomaly detection function
 * @param {Array} entries - Parsed log entries
 * @returns {Array} Array of detected anomalies with explanations and confidence scores
 */
function analyzeLog(entries) {
    if (!entries || entries.length === 0) {
        console.warn('No entries to analyze');
        return [];
    }
    
    console.log(`🔍 Starting anomaly detection on ${entries.length} entries...`);
    
    const anomalies = [];
    
    // Build statistics from entries
    const stats = buildStats(entries);
    
    // Run all 6 detection rules
    anomalies.push(...detectHighRequestVolume(stats, entries));
    anomalies.push(...detectFailedAttempts(stats, entries));
    anomalies.push(...detectUnusualTiming(stats, entries));
    anomalies.push(...detectSuspiciousUrls(entries));
    anomalies.push(...detectLargeTransfers(entries));
    anomalies.push(...detectRapidRequests(entries));
    
    // Sort by confidence (highest first)
    anomalies.sort((a, b) => b.confidence - a.confidence);
    
    console.log(`✅ Anomaly detection complete: Found ${anomalies.length} anomalies`);
    
    return anomalies;
}

/**
 * Build statistics from log entries
 * @param {Array} entries - Parsed log entries
 * @returns {Object} Statistics object
 */
function buildStats(entries) {
    const ipCounts = {};
    const failedByIp = {};
    const hourCounts = {};
    
    entries.forEach(entry => {
        // Count requests per IP
        ipCounts[entry.ip] = (ipCounts[entry.ip] || 0) + 1;
        
        // Track failed attempts (4xx and 5xx status codes)
        if (entry.statusCode >= 400) {
            if (!failedByIp[entry.ip]) {
                failedByIp[entry.ip] = [];
            }
            failedByIp[entry.ip].push(entry);
        }
        
        // Count requests by hour
        hourCounts[entry.hour] = (hourCounts[entry.hour] || 0) + 1;
    });
    
    return {
        ipCounts,
        failedByIp,
        hourCounts,
        totalEntries: entries.length,
        uniqueIps: Object.keys(ipCounts).length
    };
}

/**
 * RULE 1: Detect high request volume from single IP
 * Flags IPs making 5x more requests than average
 */
function detectHighRequestVolume(stats, entries) {
    const anomalies = [];
    
    if (stats.uniqueIps === 0) return anomalies;
    
    const avgRequestsPerIp = stats.totalEntries / stats.uniqueIps;
    
    for (let ip in stats.ipCounts) {
        const count = stats.ipCounts[ip];
        const multiplier = count / avgRequestsPerIp;
        
        // Flag if 5x higher than average
        if (multiplier >= 5) {
            // Confidence increases with multiplier
            const confidence = Math.min(95, 50 + multiplier * 10);
            
            anomalies.push({
                type: 'High Request Volume',
                ip: ip,
                count: count,
                expected: Math.round(avgRequestsPerIp),
                explanation: `IP ${ip} made ${count} requests, which is ${multiplier.toFixed(1)}x higher than average (${Math.round(avgRequestsPerIp)}). This could indicate automated scanning or DDoS activity.`,
                confidence: Math.round(confidence),
                severity: multiplier > 10 ? 'critical' : 'warning'
            });
            
            console.log(`🚨 Rule 1: High volume from ${ip} (${count} requests, ${multiplier.toFixed(1)}x avg)`);
        }
    }
    
    return anomalies;
}

/**
 * RULE 2: Detect multiple failed attempts (brute force)
 * Flags IPs with 5+ failed requests (4xx/5xx status codes)
 */
function detectFailedAttempts(stats, entries) {
    const anomalies = [];
    
    for (let ip in stats.failedByIp) {
        const failures = stats.failedByIp[ip];
        
        if (failures.length >= 5) {
            // Confidence increases with more failures
            const confidence = Math.min(95, 60 + failures.length * 5);
            
            // Get unique URLs that failed
            const urls = [...new Set(failures.map(f => f.url))];
            
            // Get time range
            const times = failures.map(f => f.date).sort((a, b) => a - b);
            const timeRange = times.length > 0 
                ? `${times[0].toLocaleTimeString()} - ${times[times.length-1].toLocaleTimeString()}`
                : 'Unknown';
            
            anomalies.push({
                type: 'Multiple Failed Attempts',
                ip: ip,
                count: failures.length,
                explanation: `IP ${ip} had ${failures.length} failed requests (4xx/5xx errors). This could indicate a brute force attack or unauthorized access attempt.`,
                confidence: Math.round(confidence),
                severity: failures.length > 10 ? 'critical' : 'warning',
                affectedUrls: urls.slice(0, 5), // Show first 5 URLs
                timeRange: timeRange
            });
            
            console.log(`🚨 Rule 2: Failed attempts from ${ip} (${failures.length} failures)`);
        }
    }
    
    return anomalies;
}

/**
 * RULE 3: Detect unusual time activity (off-hours)
 * Flags high activity during 1 AM - 5 AM
 */
function detectUnusualTiming(stats, entries) {
    const anomalies = [];
    
    // Check each off-hour (1 AM - 5 AM)
    for (let hour = 1; hour <= 5; hour++) {
        const count = stats.hourCounts[hour] || 0;
        
        if (count > 50) {
            anomalies.push({
                type: 'Unusual Time Activity',
                hour: hour,
                count: count,
                explanation: `${count} requests detected between ${hour}:00-${hour}:59, which is outside normal business hours. Could indicate unauthorized access or scheduled automated attacks.`,
                confidence: 70,
                severity: 'warning'
            });
            
            console.log(`🚨 Rule 3: Off-hours activity at ${hour}:00 (${count} requests)`);
        }
    }
    
    return anomalies;
}

/**
 * RULE 4: Detect suspicious URL access
 * Flags attempts to access sensitive endpoints
 */
function detectSuspiciousUrls(entries) {
    const anomalies = [];
    
    // Blacklist of sensitive endpoints
    const blacklist = [
        '/admin',
        '/config',
        '/.env',
        '/wp-admin',
        '/phpmyadmin',
        '/.git',
        '/backup',
        '/database',
        '/.aws',
        '/api/admin'
    ];
    
    const suspiciousAccess = {};
    
    entries.forEach(entry => {
        for (let suspect of blacklist) {
            if (entry.url.toLowerCase().includes(suspect.toLowerCase())) {
                const key = `${entry.ip}:${suspect}`;
                if (!suspiciousAccess[key]) {
                    suspiciousAccess[key] = {
                        ip: entry.ip,
                        pattern: suspect,
                        urls: new Set(),
                        count: 0
                    };
                }
                suspiciousAccess[key].urls.add(entry.url);
                suspiciousAccess[key].count++;
            }
        }
    });
    
    for (let key in suspiciousAccess) {
        const access = suspiciousAccess[key];
        const urlList = Array.from(access.urls);
        
        anomalies.push({
            type: 'Suspicious URL Access',
            ip: access.ip,
            pattern: access.pattern,
            count: access.count,
            explanation: `IP ${access.ip} attempted to access sensitive endpoint matching pattern "${access.pattern}" ${access.count} time(s). This could indicate reconnaissance or an attack attempt.`,
            confidence: 85,
            severity: 'critical',
            affectedUrls: urlList.slice(0, 3) // Show first 3 URLs
        });
        
        console.log(`🚨 Rule 4: Suspicious URL access from ${access.ip} (${access.pattern})`);
    }
    
    return anomalies;
}

/**
 * RULE 5: Detect large data transfers
 * Flags single requests transferring >10MB
 */
function detectLargeTransfers(entries) {
    const anomalies = [];
    const threshold = 10000000; // 10 MB in bytes
    
    entries.forEach(entry => {
        if (entry.bytes > threshold) {
            const mb = (entry.bytes / 1000000).toFixed(2);
            
            anomalies.push({
                type: 'Large Data Transfer',
                ip: entry.ip,
                url: entry.url,
                bytes: entry.bytes,
                mb: mb,
                explanation: `Large data transfer detected: ${mb} MB from IP ${entry.ip} accessing ${entry.url}. Could indicate data exfiltration or unauthorized file downloads.`,
                confidence: 75,
                severity: 'warning',
                timestamp: entry.timestamp
            });
            
            console.log(`🚨 Rule 5: Large transfer from ${entry.ip} (${mb} MB)`);
        }
    });
    
    return anomalies;
}

/**
 * RULE 6: Detect rapid sequential requests (bot behavior)
 * Flags IPs making 10+ requests within 10 seconds
 */
function detectRapidRequests(entries) {
    const anomalies = [];
    const ipGroups = {};
    
    // Group by IP
    entries.forEach(entry => {
        if (!ipGroups[entry.ip]) {
            ipGroups[entry.ip] = [];
        }
        ipGroups[entry.ip].push(entry);
    });
    
    // Check each IP for bursts
    for (let ip in ipGroups) {
        const requests = ipGroups[ip].sort((a, b) => a.date - b.date);
        
        // Check for 10-second windows
        for (let i = 0; i < requests.length; i++) {
            let count = 1;
            const startTime = requests[i].date;
            let endTime = startTime;
            
            for (let j = i + 1; j < requests.length; j++) {
                const timeDiff = (requests[j].date - startTime) / 1000; // seconds
                if (timeDiff <= 10) {
                    count++;
                    endTime = requests[j].date;
                } else {
                    break;
                }
            }
            
            if (count > 10) {
                const seconds = ((endTime - startTime) / 1000).toFixed(1);
                
                anomalies.push({
                    type: 'Rapid Sequential Requests',
                    ip: ip,
                    count: count,
                    seconds: seconds,
                    explanation: `IP ${ip} made ${count} requests in ${seconds} seconds. This rapid-fire pattern indicates possible automated attack, bot activity, or scraping attempt.`,
                    confidence: 80,
                    severity: 'warning',
                    timeRange: `${startTime.toLocaleTimeString()} - ${endTime.toLocaleTimeString()}`
                });
                
                console.log(`🚨 Rule 6: Rapid requests from ${ip} (${count} in ${seconds}s)`);
                break; // Only report once per IP
            }
        }
    }
    
    return anomalies;
}

