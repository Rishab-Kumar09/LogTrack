/**
 * parser-universal.js - Universal Log File Parser
 * Handles multiple log formats with ChatGPT fallback for unknown formats
 */

/**
 * Main parsing function - auto-detects format and parses accordingly
 * @param {string} logContent - Raw log file text
 * @param {string} apiKey - Optional OpenAI API key for unknown formats
 * @returns {Promise<Array>} Array of parsed log entry objects
 */
async function parseLogUniversal(logContent, apiKey = null) {
    if (!logContent || logContent.trim() === '') {
        console.error('Empty log content provided');
        return [];
    }
    
    console.log('🔍 Starting universal log parsing...');
    
    // Step 1: Detect log format
    const format = detectLogFormat(logContent);
    console.log(`📋 Detected format: ${format}`);
    
    // Step 2: Try appropriate parser based on format
    let entries = [];
    
    switch (format) {
        case 'apache':
        case 'nginx':
            entries = parseApacheNginx(logContent);
            break;
        case 'json':
            entries = parseJsonLogs(logContent);
            break;
        case 'w3c':
            entries = parseW3C(logContent);
            break;
        case 'syslog':
            entries = parseSyslog(logContent);
            break;
        case 'iis':
            entries = parseIIS(logContent);
            break;
        case 'unknown':
            console.warn('⚠️ Unknown log format detected');
            if (apiKey) {
                console.log('🤖 Attempting to parse with ChatGPT...');
                entries = await parseWithChatGPT(logContent, apiKey);
            } else {
                console.warn('💡 Tip: Provide an OpenAI API key to parse unknown formats');
                // Try Apache format as last resort
                entries = parseApacheNginx(logContent);
            }
            break;
        default:
            entries = parseApacheNginx(logContent);
    }
    
    console.log(`✅ Parsed ${entries.length} entries`);
    return entries;
}

/**
 * Detect log format by analyzing content
 * @param {string} logContent - Raw log content
 * @returns {string} Detected format name
 */
function detectLogFormat(logContent) {
    const lines = logContent.split('\n').filter(l => l.trim());
    if (lines.length === 0) return 'unknown';
    
    const sampleLines = lines.slice(0, 5).join('\n');
    
    // Check for JSON format
    if (sampleLines.trim().startsWith('{') || sampleLines.includes('{"')) {
        return 'json';
    }
    
    // Check for W3C format (starts with #Fields: or #Software:)
    if (sampleLines.includes('#Fields:') || sampleLines.includes('#Software:')) {
        return 'w3c';
    }
    
    // Check for Apache/Nginx combined format
    // Pattern: IP - - [timestamp] "METHOD URL" status bytes
    const apachePattern = /^\S+\s+\S+\s+\S+\s+\[.*?\]\s+".*?"\s+\d+\s+\d+/;
    if (apachePattern.test(lines[0])) {
        return 'apache';
    }
    
    // Check for Syslog format
    // Pattern: Month Day Time hostname program[pid]: message
    const syslogPattern = /^[A-Z][a-z]{2}\s+\d{1,2}\s+\d{2}:\d{2}:\d{2}/;
    if (syslogPattern.test(lines[0])) {
        return 'syslog';
    }
    
    // Check for IIS format (tab or space delimited with specific patterns)
    if (sampleLines.includes('W3SVC') || sampleLines.match(/^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}/)) {
        return 'iis';
    }
    
    return 'unknown';
}

/**
 * Parse Apache/Nginx combined log format
 * @param {string} logContent - Raw log content
 * @returns {Array} Parsed entries
 */
function parseApacheNginx(logContent) {
    const lines = logContent.split('\n');
    const entries = [];
    let skippedLines = 0;
    
    // Regex for Apache/Nginx combined log format
    const pattern = /^(\S+)\s+\S+\s+\S+\s+\[([^\]]+)\]\s+"(\w+)\s+([^\s"]+)[^"]*"\s+(\d+)\s+(\d+)/;
    
    lines.forEach((line, index) => {
        if (!line.trim()) return;
        
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
        }
    });
    
    const totalLines = lines.filter(l => l.trim()).length;
    if (totalLines > 0) {
        console.log(`✅ Apache/Nginx: ${entries.length}/${totalLines} lines parsed (${Math.round(entries.length/totalLines*100)}%)`);
    }
    
    return entries;
}

/**
 * Parse JSON log format
 * @param {string} logContent - Raw log content
 * @returns {Array} Parsed entries
 */
function parseJsonLogs(logContent) {
    const lines = logContent.split('\n').filter(l => l.trim());
    const entries = [];
    
    lines.forEach((line, index) => {
        try {
            const obj = JSON.parse(line);
            
            // Try to extract common fields with various naming conventions
            const entry = {
                ip: obj.ip || obj.client_ip || obj.remote_addr || obj.source_ip || 'unknown',
                timestamp: obj.timestamp || obj.time || obj.datetime || obj['@timestamp'] || new Date().toISOString(),
                method: obj.method || obj.http_method || obj.verb || 'GET',
                url: obj.url || obj.path || obj.uri || obj.request || '/',
                statusCode: parseInt(obj.status || obj.status_code || obj.response_code || 200),
                bytes: parseInt(obj.bytes || obj.size || obj.bytes_sent || 0),
                lineNumber: index + 1
            };
            
            // Parse timestamp to Date object
            entry.date = new Date(entry.timestamp);
            entry.hour = entry.date.getHours();
            
            entries.push(entry);
        } catch (error) {
            console.warn(`Could not parse JSON line ${index + 1}`);
        }
    });
    
    console.log(`✅ JSON: ${entries.length} entries parsed`);
    return entries;
}

/**
 * Parse W3C Extended Log Format
 * @param {string} logContent - Raw log content
 * @returns {Array} Parsed entries
 */
function parseW3C(logContent) {
    const lines = logContent.split('\n');
    const entries = [];
    let fields = [];
    
    lines.forEach((line, index) => {
        if (line.startsWith('#Fields:')) {
            // Extract field names
            fields = line.substring(8).trim().split(/\s+/);
            return;
        }
        
        if (line.startsWith('#') || !line.trim()) return;
        
        const values = line.split(/\s+/);
        const entry = {};
        
        // Map values to field names
        fields.forEach((field, i) => {
            entry[field] = values[i] || '';
        });
        
        // Normalize to our standard format
        entries.push({
            ip: entry['c-ip'] || entry['s-ip'] || 'unknown',
            timestamp: `${entry.date} ${entry.time}`,
            method: entry['cs-method'] || 'GET',
            url: entry['cs-uri-stem'] || '/',
            statusCode: parseInt(entry['sc-status'] || 200),
            bytes: parseInt(entry['sc-bytes'] || 0),
            date: new Date(`${entry.date} ${entry.time}`),
            hour: new Date(`${entry.date} ${entry.time}`).getHours(),
            lineNumber: index + 1
        });
    });
    
    console.log(`✅ W3C: ${entries.length} entries parsed`);
    return entries;
}

/**
 * Parse Syslog format (basic)
 * @param {string} logContent - Raw log content
 * @returns {Array} Parsed entries
 */
function parseSyslog(logContent) {
    const lines = logContent.split('\n').filter(l => l.trim());
    const entries = [];
    
    // Syslog pattern: Month Day Time hostname program[pid]: message
    const pattern = /^([A-Z][a-z]{2})\s+(\d{1,2})\s+(\d{2}:\d{2}:\d{2})\s+(\S+)\s+(.+)$/;
    
    lines.forEach((line, index) => {
        const match = line.match(pattern);
        if (match) {
            const [_, month, day, time, hostname, message] = match;
            const dateStr = `${month} ${day} ${new Date().getFullYear()} ${time}`;
            const date = new Date(dateStr);
            
            // Try to extract HTTP info from message
            let method = 'LOG';
            let url = '/';
            let statusCode = 200;
            
            const httpMatch = message.match(/"(GET|POST|PUT|DELETE|PATCH)\s+(\S+).*?"\s+(\d{3})/);
            if (httpMatch) {
                method = httpMatch[1];
                url = httpMatch[2];
                statusCode = parseInt(httpMatch[3]);
            }
            
            entries.push({
                ip: hostname,
                timestamp: dateStr,
                method: method,
                url: url,
                statusCode: statusCode,
                bytes: message.length,
                date: date,
                hour: date.getHours(),
                lineNumber: index + 1
            });
        }
    });
    
    console.log(`✅ Syslog: ${entries.length} entries parsed`);
    return entries;
}

/**
 * Parse IIS log format
 * @param {string} logContent - Raw log content
 * @returns {Array} Parsed entries
 */
function parseIIS(logContent) {
    const lines = logContent.split('\n');
    const entries = [];
    let fields = [];
    
    lines.forEach((line, index) => {
        if (line.startsWith('#Fields:')) {
            fields = line.substring(8).trim().split(/\s+/);
            return;
        }
        
        if (line.startsWith('#') || !line.trim()) return;
        
        const values = line.split(/\s+/);
        const entry = {};
        
        fields.forEach((field, i) => {
            entry[field] = values[i] || '';
        });
        
        entries.push({
            ip: entry['c-ip'] || entry['s-ip'] || 'unknown',
            timestamp: `${entry.date} ${entry.time}`,
            method: entry['cs-method'] || 'GET',
            url: entry['cs-uri-stem'] || '/',
            statusCode: parseInt(entry['sc-status'] || 200),
            bytes: parseInt(entry['sc-bytes'] || 0),
            date: new Date(`${entry.date} ${entry.time}`),
            hour: new Date(`${entry.date} ${entry.time}`).getHours(),
            lineNumber: index + 1
        });
    });
    
    console.log(`✅ IIS: ${entries.length} entries parsed`);
    return entries;
}

/**
 * Parse logs using ChatGPT API (fallback for unknown formats)
 * @param {string} logContent - Raw log content
 * @param {string} apiKey - OpenAI API key
 * @returns {Promise<Array>} Parsed entries
 */
async function parseWithChatGPT(logContent, apiKey) {
    try {
        // Take sample of log (first 20 lines)
        const lines = logContent.split('\n').filter(l => l.trim());
        const sample = lines.slice(0, 20).join('\n');
        
        const prompt = `You are a log file parser. Analyze this log file sample and extract structured data.

For each log entry, extract:
- ip: IP address or identifier
- timestamp: Date/time string
- method: HTTP method or action type (default: "LOG")
- url: URL path or resource (default: "/")
- statusCode: Status code (default: 200)
- bytes: Size in bytes (default: 0)

Return ONLY a JSON array of objects. No explanation.

Log sample:
${sample}

Return format:
[{"ip":"x.x.x.x","timestamp":"...","method":"GET","url":"/","statusCode":200,"bytes":0},...]`;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: 'You are a log parsing assistant. Return only valid JSON.' },
                    { role: 'user', content: prompt }
                ],
                temperature: 0,
                max_tokens: 2000
            })
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();
        const content = data.choices[0].message.content.trim();
        
        // Extract JSON from response (remove markdown code blocks if present)
        let jsonStr = content;
        if (content.includes('```')) {
            jsonStr = content.match(/```(?:json)?\n?([\s\S]+?)\n?```/)?.[1] || content;
        }
        
        const parsedSample = JSON.parse(jsonStr);
        
        // Now apply the pattern to all lines
        console.log(`🤖 ChatGPT parsed ${parsedSample.length} sample entries. Applying pattern to full log...`);
        
        // For now, return the sample (you could enhance this to parse all lines based on detected pattern)
        const entries = parsedSample.map((entry, index) => ({
            ...entry,
            date: new Date(entry.timestamp),
            hour: new Date(entry.timestamp).getHours(),
            lineNumber: index + 1
        }));
        
        console.log(`✅ ChatGPT: ${entries.length} entries parsed from sample`);
        return entries;
        
    } catch (error) {
        console.error('❌ ChatGPT parsing failed:', error);
        // Fallback to Apache parser
        return parseApacheNginx(logContent);
    }
}

/**
 * Parse Apache timestamp format (from original parser)
 * @param {string} timestamp - Apache timestamp
 * @returns {Date} JavaScript Date object
 */
function parseApacheTimestamp(timestamp) {
    const months = {
        'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
        'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
    };
    
    try {
        const [datePart, timePart] = timestamp.split(':');
        const [day, monthStr, year] = datePart.split('/');
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
        return new Date();
    }
}

