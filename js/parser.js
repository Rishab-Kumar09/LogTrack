/**
 * parser.js - Log File Parser
 * Extracts structured data from Apache/Nginx combined log format
 */

/**
 * Parse raw log file content into structured entries
 * @param {string} logContent - Raw log file text
 * @returns {Array} Array of parsed log entry objects
 */
function parseLog(logContent) {
    if (!logContent || logContent.trim() === '') {
        console.error('Empty log content provided');
        return [];
    }
    
    const lines = logContent.split('\n');
    const entries = [];
    let skippedLines = 0;
    
    // Regex pattern for Apache/Nginx combined log format
    // Format: IP - - [timestamp] "METHOD URL HTTP/x.x" status bytes
    // Example: 192.168.1.1 - - [15/Oct/2025:10:23:45 +0000] "GET /api/users HTTP/1.1" 200 1234
    const pattern = /^(\S+)\s+\S+\s+\S+\s+\[([^\]]+)\]\s+"(\w+)\s+([^\s"]+)[^"]*"\s+(\d+)\s+(\d+)/;
    
    lines.forEach((line, index) => {
        // Skip empty lines
        if (!line.trim()) {
            return;
        }
        
        const match = line.match(pattern);
        
        if (match) {
            const timestamp = match[2];
            const date = parseApacheTimestamp(timestamp);
            
            entries.push({
                ip: match[1],
                timestamp: timestamp,
                method: match[3],
                url: match[4],
                statusCode: parseInt(match[5]),
                bytes: parseInt(match[6]),
                date: date,
                hour: date.getHours(),
                lineNumber: index + 1
            });
        } else {
            skippedLines++;
            console.warn(`Could not parse line ${index + 1}:`, line.substring(0, 100));
        }
    });
    
    // Warning if too many lines failed to parse
    const totalLines = lines.filter(l => l.trim()).length;
    if (totalLines > 0 && (skippedLines / totalLines) > 0.1) {
        console.warn(`⚠️ Warning: ${skippedLines} out of ${totalLines} lines (${Math.round(skippedLines/totalLines*100)}%) could not be parsed`);
    }
    
    console.log(`✅ Successfully parsed ${entries.length} log entries (skipped ${skippedLines})`);
    
    return entries;
}

/**
 * Convert Apache timestamp format to JavaScript Date object
 * @param {string} timestamp - Apache timestamp (e.g., "15/Oct/2025:10:23:45 +0000")
 * @returns {Date} JavaScript Date object
 */
function parseApacheTimestamp(timestamp) {
    // Parse format: 15/Oct/2025:10:23:45 +0000
    const months = {
        'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
        'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
    };
    
    try {
        // Split date and time parts
        const [datePart, timePart] = timestamp.split(':');
        const [day, monthStr, year] = datePart.split('/');
        const [hour, minute, second] = timePart.split(':')[0].split(':');
        
        // Get the actual time components
        const timeComponents = timestamp.match(/(\d{2}):(\d{2}):(\d{2})/);
        
        return new Date(
            parseInt(year),
            months[monthStr],
            parseInt(day),
            parseInt(timeComponents[1]),
            parseInt(timeComponents[2]),
            parseInt(timeComponents[3])
        );
    } catch (error) {
        console.error('Error parsing timestamp:', timestamp, error);
        return new Date(); // Return current date as fallback
    }
}

/**
 * Get summary statistics from parsed entries
 * @param {Array} entries - Parsed log entries
 * @returns {Object} Summary statistics
 */
function getLogSummary(entries) {
    if (!entries || entries.length === 0) {
        return {
            totalEvents: 0,
            uniqueIps: 0,
            timeRange: 'N/A',
            methods: {},
            statusCodes: {}
        };
    }
    
    // Calculate unique IPs
    const uniqueIps = new Set(entries.map(e => e.ip)).size;
    
    // Calculate time range
    const timestamps = entries.map(e => e.date).sort((a, b) => a - b);
    const startTime = timestamps[0];
    const endTime = timestamps[timestamps.length - 1];
    const timeRange = `${formatTimestamp(startTime)} - ${formatTimestamp(endTime)}`;
    
    // Count methods
    const methods = {};
    entries.forEach(e => {
        methods[e.method] = (methods[e.method] || 0) + 1;
    });
    
    // Count status codes
    const statusCodes = {};
    entries.forEach(e => {
        const codeCategory = Math.floor(e.statusCode / 100) + 'xx';
        statusCodes[codeCategory] = (statusCodes[codeCategory] || 0) + 1;
    });
    
    return {
        totalEvents: entries.length,
        uniqueIps,
        timeRange,
        methods,
        statusCodes,
        startTime,
        endTime
    };
}

/**
 * Format Date object for display
 * @param {Date} date - Date object
 * @returns {string} Formatted date string
 */
function formatTimestamp(date) {
    const options = {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleString('en-US', options);
}

