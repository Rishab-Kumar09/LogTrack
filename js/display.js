/**
 * display.js - Results Display
 * Renders analysis results: summary stats, timeline, anomaly cards, and event table
 */

// Run display function when page loads
document.addEventListener('DOMContentLoaded', function() {
    displayResults();
});

/**
 * Main display function - renders all results
 */
function displayResults() {
    // Clear old cached results (version check)
    const dataVersion = sessionStorage.getItem('dataVersion');
    if (dataVersion !== '1.0.1') {
        console.log('🔄 Clearing old cached data...');
        sessionStorage.removeItem('results');
        sessionStorage.setItem('dataVersion', '1.0.1');
    }
    
    // Get results from sessionStorage
    const resultsJson = sessionStorage.getItem('results');
    
    if (!resultsJson) {
        alert('❌ No results found! Redirecting to upload page...');
        window.location.href = 'upload.html';
        return;
    }
    
    try {
        const results = JSON.parse(resultsJson);
        const { parsed, anomalies } = results;
        
        // Convert date strings back to Date objects
        parsed.forEach(entry => {
            if (typeof entry.date === 'string') {
                entry.date = new Date(entry.date);
            }
        });
        
        console.log('📊 Displaying results:', {
            entries: parsed.length,
            anomalies: anomalies.length
        });
        
        // Display all sections
        displaySummary(parsed, anomalies);
        displayAnomalies(anomalies);
        displayEventTable(parsed, anomalies);
        
    } catch (error) {
        console.error('Error displaying results:', error);
        alert('❌ Error loading results: ' + error.message);
        window.location.href = 'upload.html';
    }
}

/**
 * Display summary statistics
 * @param {Array} entries - Parsed log entries
 * @param {Array} anomalies - Detected anomalies
 */
function displaySummary(entries, anomalies) {
    // Calculate stats
    const uniqueIps = new Set(entries.map(e => e.ip)).size;
    
    // Get time range
    let timeRange = 'N/A';
    if (entries.length > 0) {
        const sortedEntries = [...entries].sort((a, b) => a.date - b.date);
        const start = sortedEntries[0].date;
        const end = sortedEntries[sortedEntries.length - 1].date;
        timeRange = formatDateRange(start, end);
    }
    
    // Count critical vs warning anomalies
    const criticalCount = anomalies.filter(a => a.severity === 'critical').length;
    const warningCount = anomalies.filter(a => a.severity === 'warning').length;
    
    // Update DOM elements
    document.getElementById('total-events').textContent = entries.length.toLocaleString();
    document.getElementById('unique-ips').textContent = uniqueIps;
    document.getElementById('time-range').textContent = timeRange;
    document.getElementById('anomaly-count').textContent = anomalies.length;
    document.getElementById('critical-count').textContent = criticalCount;
    document.getElementById('warning-count').textContent = warningCount;
}

/**
 * Display anomaly cards
 * @param {Array} anomalies - Detected anomalies
 */
function displayAnomalies(anomalies) {
    const container = document.getElementById('anomaly-container');
    container.innerHTML = ''; // Clear existing content
    
    if (anomalies.length === 0) {
        container.innerHTML = '<div class="no-anomalies">✅ No anomalies detected! This log looks clean.</div>';
        return;
    }
    
    // Create a card for each anomaly
    anomalies.forEach(anomaly => {
        const card = createAnomalyCard(anomaly);
        container.appendChild(card);
    });
}

/**
 * Create individual anomaly card element
 * @param {Object} anomaly - Anomaly object
 * @returns {HTMLElement} Anomaly card element
 */
function createAnomalyCard(anomaly) {
    const card = document.createElement('div');
    card.className = `anomaly-card ${anomaly.severity}`;
    
    // Determine confidence level class
    let confidenceClass = 'low';
    if (anomaly.confidence >= 85) confidenceClass = 'high';
    else if (anomaly.confidence >= 70) confidenceClass = 'medium';
    
    // Build card HTML
    card.innerHTML = `
        <div class="card-header">
            <h3>${getAnomalyIcon(anomaly.type)} ${anomaly.type}</h3>
            <span class="confidence-badge ${confidenceClass}">${anomaly.confidence}% confident</span>
        </div>
        <div class="card-body">
            <p class="explanation">${anomaly.explanation}</p>
            <div class="details">
                ${anomaly.ip ? `<p><strong>IP Address:</strong> ${anomaly.ip}</p>` : ''}
                ${anomaly.count ? `<p><strong>Count:</strong> ${anomaly.count}</p>` : ''}
                ${anomaly.expected ? `<p><strong>Expected:</strong> ~${anomaly.expected}</p>` : ''}
                ${anomaly.url ? `<p><strong>URL:</strong> ${anomaly.url}</p>` : ''}
                ${anomaly.pattern ? `<p><strong>Pattern Match:</strong> ${anomaly.pattern}</p>` : ''}
                ${anomaly.affectedUrls && anomaly.affectedUrls.length > 0 ? 
                    `<p><strong>Affected URLs:</strong> ${anomaly.affectedUrls.join(', ')}</p>` : ''}
                ${anomaly.timeRange ? `<p><strong>Time Range:</strong> ${anomaly.timeRange}</p>` : ''}
                ${anomaly.hour !== undefined ? `<p><strong>Hour:</strong> ${anomaly.hour}:00 - ${anomaly.hour}:59</p>` : ''}
                ${anomaly.mb ? `<p><strong>Data Size:</strong> ${anomaly.mb} MB</p>` : ''}
                ${anomaly.seconds ? `<p><strong>Duration:</strong> ${anomaly.seconds} seconds</p>` : ''}
            </div>
        </div>
    `;
    
    return card;
}

/**
 * Get icon emoji for anomaly type
 * @param {string} type - Anomaly type
 * @returns {string} Icon emoji
 */
function getAnomalyIcon(type) {
    const icons = {
        'High Request Volume': '📈',
        'Multiple Failed Attempts': '🚫',
        'Unusual Time Activity': '🌙',
        'Suspicious URL Access': '🔓',
        'Large Data Transfer': '📦',
        'Rapid Sequential Requests': '⚡'
    };
    return icons[type] || '⚠️';
}

/**
 * Display timeline visualization
 * @param {Array} entries - Parsed log entries
 * @param {Array} anomalies - Detected anomalies
 */
function displayTimeline(entries, anomalies) {
    const timelineContainer = document.getElementById('timeline');
    timelineContainer.innerHTML = '';
    
    if (entries.length === 0) {
        timelineContainer.innerHTML = '<p>No events to display</p>';
        return;
    }
    
    // Sort entries by date
    const sortedEntries = [...entries].sort((a, b) => a.date - b.date);
    const startTime = sortedEntries[0].date;
    const endTime = sortedEntries[sortedEntries.length - 1].date;
    const duration = endTime - startTime;
    
    // Create timeline bar
    const bar = document.createElement('div');
    bar.className = 'timeline-bar';
    
    // Add time labels
    const startLabel = document.createElement('div');
    startLabel.style.position = 'absolute';
    startLabel.style.left = '0';
    startLabel.style.top = '50px';
    startLabel.style.fontSize = '0.8rem';
    startLabel.style.color = 'var(--text-secondary)';
    startLabel.textContent = startTime.toLocaleTimeString();
    
    const endLabel = document.createElement('div');
    endLabel.style.position = 'absolute';
    endLabel.style.right = '0';
    endLabel.style.top = '50px';
    endLabel.style.fontSize = '0.8rem';
    endLabel.style.color = 'var(--text-secondary)';
    endLabel.textContent = endTime.toLocaleTimeString();
    
    // Add event markers (sample every Nth event to avoid clutter)
    const sampleRate = Math.max(1, Math.floor(entries.length / 50));
    sortedEntries.forEach((entry, index) => {
        if (index % sampleRate === 0) {
            const position = duration > 0 ? ((entry.date - startTime) / duration) * 100 : 50;
            const marker = document.createElement('div');
            marker.className = 'timeline-marker';
            marker.style.left = `${position}%`;
            marker.title = `${entry.timestamp} - ${entry.ip} - ${entry.method} ${entry.url}`;
            bar.appendChild(marker);
        }
    });
    
    // Add anomaly markers
    anomalies.forEach(anomaly => {
        // Find a corresponding entry
        let entry;
        if (anomaly.ip) {
            entry = sortedEntries.find(e => e.ip === anomaly.ip);
        } else if (anomaly.hour !== undefined) {
            entry = sortedEntries.find(e => e.hour === anomaly.hour);
        }
        
        if (entry) {
            const position = duration > 0 ? ((entry.date - startTime) / duration) * 100 : 50;
            const marker = document.createElement('div');
            marker.className = `timeline-marker anomaly ${anomaly.severity}`;
            marker.style.left = `${position}%`;
            marker.title = `⚠️ ${anomaly.type} (${anomaly.confidence}% confidence)`;
            bar.appendChild(marker);
        }
    });
    
    timelineContainer.appendChild(bar);
    timelineContainer.appendChild(startLabel);
    timelineContainer.appendChild(endLabel);
}

/**
 * Display detailed event table
 * @param {Array} entries - Parsed log entries
 * @param {Array} anomalies - Detected anomalies
 */
function displayEventTable(entries, anomalies) {
    const tbody = document.getElementById('event-table-body');
    
    if (!tbody) return; // Table might be hidden
    
    tbody.innerHTML = '';
    
    // Get IPs involved in anomalies
    const anomalyIps = new Set(anomalies.map(a => a.ip).filter(ip => ip));
    
    // Sort entries by date
    const sortedEntries = [...entries].sort((a, b) => a.date - b.date);
    
    // Show last 100 entries (or all if less)
    const entriesToShow = sortedEntries.slice(-100);
    
    entriesToShow.forEach(entry => {
        const row = document.createElement('tr');
        
        // Highlight rows involved in anomalies
        if (anomalyIps.has(entry.ip)) {
            row.className = 'anomaly-row';
        }
        
        const statusClass = entry.statusCode >= 400 ? 'error' : 'success';
        
        row.innerHTML = `
            <td>${entry.date.toLocaleTimeString()}</td>
            <td><code>${entry.ip}</code></td>
            <td>${entry.method}</td>
            <td style="max-width: 300px; overflow: hidden; text-overflow: ellipsis;">${entry.url}</td>
            <td><span class="${statusClass}">${entry.statusCode}</span></td>
            <td>${formatBytes(entry.bytes)}</td>
        `;
        
        tbody.appendChild(row);
    });
    
    // Add note if entries were truncated
    if (entries.length > 100) {
        const noteRow = document.createElement('tr');
        noteRow.innerHTML = `
            <td colspan="6" style="text-align: center; color: var(--text-muted);">
                Showing last 100 of ${entries.length} events
            </td>
        `;
        tbody.appendChild(noteRow);
    }
}

/**
 * Format date range for display
 * @param {Date} start - Start date
 * @param {Date} end - End date
 * @returns {string} Formatted date range
 */
function formatDateRange(start, end) {
    const options = {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    
    const startStr = start.toLocaleString('en-US', options);
    const endStr = end.toLocaleString('en-US', options);
    
    return `${startStr} - ${endStr}`;
}

/**
 * Format bytes for display
 * @param {number} bytes - Bytes
 * @returns {string} Formatted bytes
 */
function formatBytes(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1024 / 1024).toFixed(2) + ' MB';
}

