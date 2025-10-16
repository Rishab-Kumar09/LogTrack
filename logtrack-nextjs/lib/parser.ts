/**
 * LOG PARSER - TypeScript Version
 * 
 * PURPOSE: Read raw log files and convert them into structured data
 * 
 * EASY EXPLANATION:
 * - Raw log = messy text with IPs, dates, URLs mixed together
 * - This parser = translator that organizes everything into neat objects
 * - Output = Array of objects, each representing one log entry
 * 
 * EXAMPLE INPUT:
 * "192.168.1.1 - - [16/Oct/2024:10:23:45 +0000] "GET /api HTTP/1.1" 200 1234"
 * 
 * EXAMPLE OUTPUT:
 * { ip: "192.168.1.1", method: "GET", url: "/api", statusCode: 200, bytes: 1234, date: Date object }
 */

// Type definition for a log entry
export interface LogEntry {
  ip: string;                  // IP address (e.g., "192.168.1.1")
  timestamp: string;            // Original timestamp string
  method: string;               // HTTP method (GET, POST, etc.)
  url: string;                  // URL path (/api, /admin, etc.)
  statusCode: number;           // HTTP status (200, 404, 500, etc.)
  bytes: number;                // Data size in bytes
  date: Date;                   // Parsed Date object
  hour: number;                 // Hour of the day (0-23)
  lineNumber: number;           // Which line in the file
}

/**
 * MAIN PARSING FUNCTION
 * 
 * Takes raw log content and returns array of parsed entries
 * Supports multiple formats (Apache, JSON, W3C, etc.)
 * 
 * @param logContent - The raw log file text
 * @param apiKey - Optional OpenAI API key for unknown formats
 * @returns Promise<LogEntry[]> - Array of parsed log entries
 */
export async function parseLogUniversal(
  logContent: string, 
  apiKey?: string
): Promise<LogEntry[]> {
  if (!logContent || logContent.trim() === '') {
    console.error('Empty log content provided');
    return [];
  }

  console.log('🔍 Starting universal log parsing...');

  // Step 1: Detect what format this log file is using
  const format = detectLogFormat(logContent);
  console.log(`📋 Detected format: ${format}`);

  // Step 2: Use the appropriate parser based on format
  let entries: LogEntry[] = [];

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
 * DETECT LOG FORMAT
 * 
 * Analyzes the first few lines to guess the format
 * 
 * @param logContent - Raw log content
 * @returns string - Format name (apache, json, w3c, etc.)
 */
export function detectLogFormat(logContent: string): string {
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
  const apachePattern = /^\S+\s+\S+\s+\S+\s+\[.*?\]\s+".*?"\s+\d+\s+\d+/;
  if (apachePattern.test(lines[0])) {
    return 'apache';
  }

  // Check for Syslog format
  const syslogPattern = /^[A-Z][a-z]{2}\s+\d{1,2}\s+\d{2}:\d{2}:\d{2}/;
  if (syslogPattern.test(lines[0])) {
    return 'syslog';
  }

  // Check for IIS format
  if (sampleLines.includes('W3SVC') || sampleLines.match(/^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}/)) {
    return 'iis';
  }

  return 'unknown';
}

/**
 * PARSE APACHE/NGINX LOGS
 * 
 * Most common format - works with Apache and Nginx web servers
 * 
 * @param logContent - Raw log content
 * @returns LogEntry[] - Array of parsed entries
 */
export function parseApacheNginx(logContent: string): LogEntry[] {
  const lines = logContent.split('\n');
  const entries: LogEntry[] = [];
  let skippedLines = 0;

  // Regex pattern for Apache/Nginx combined log format
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
    console.log(`✅ Apache/Nginx: ${entries.length}/${totalLines} lines parsed (${Math.round(entries.length / totalLines * 100)}%)`);
  }

  return entries;
}

/**
 * PARSE JSON LOGS
 * 
 * For logs in JSON format (one JSON object per line)
 */
export function parseJsonLogs(logContent: string): LogEntry[] {
  const lines = logContent.split('\n').filter(l => l.trim());
  const entries: LogEntry[] = [];

  lines.forEach((line, index) => {
    try {
      const obj = JSON.parse(line);

      const entry: LogEntry = {
        ip: obj.ip || obj.client_ip || obj.remote_addr || obj.source_ip || 'unknown',
        timestamp: obj.timestamp || obj.time || obj.datetime || obj['@timestamp'] || new Date().toISOString(),
        method: obj.method || obj.http_method || obj.verb || 'GET',
        url: obj.url || obj.path || obj.uri || obj.request || '/',
        statusCode: parseInt(obj.status || obj.status_code || obj.response_code || '200'),
        bytes: parseInt(obj.bytes || obj.size || obj.bytes_sent || '0'),
        date: new Date(),
        hour: 0,
        lineNumber: index + 1
      };

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
 * PARSE W3C FORMAT
 * (Used by Microsoft IIS and others)
 */
export function parseW3C(logContent: string): LogEntry[] {
  const lines = logContent.split('\n');
  const entries: LogEntry[] = [];
  let fields: string[] = [];

  lines.forEach((line, index) => {
    if (line.startsWith('#Fields:')) {
      fields = line.substring(8).trim().split(/\s+/);
      return;
    }

    if (line.startsWith('#') || !line.trim()) return;

    const values = line.split(/\s+/);
    const entry: any = {};

    fields.forEach((field, i) => {
      entry[field] = values[i] || '';
    });

    const logEntry: LogEntry = {
      ip: entry['c-ip'] || entry['s-ip'] || 'unknown',
      timestamp: `${entry.date} ${entry.time}`,
      method: entry['cs-method'] || 'GET',
      url: entry['cs-uri-stem'] || '/',
      statusCode: parseInt(entry['sc-status'] || '200'),
      bytes: parseInt(entry['sc-bytes'] || '0'),
      date: new Date(`${entry.date} ${entry.time}`),
      hour: new Date(`${entry.date} ${entry.time}`).getHours(),
      lineNumber: index + 1
    };

    entries.push(logEntry);
  });

  console.log(`✅ W3C: ${entries.length} entries parsed`);
  return entries;
}

/**
 * PARSE SYSLOG FORMAT
 * (Unix/Linux system logs)
 */
export function parseSyslog(logContent: string): LogEntry[] {
  const lines = logContent.split('\n').filter(l => l.trim());
  const entries: LogEntry[] = [];

  const pattern = /^([A-Z][a-z]{2})\s+(\d{1,2})\s+(\d{2}:\d{2}:\d{2})\s+(\S+)\s+(.+)$/;

  lines.forEach((line, index) => {
    const match = line.match(pattern);
    if (match) {
      const [_, month, day, time, hostname, message] = match;
      const dateStr = `${month} ${day} ${new Date().getFullYear()} ${time}`;
      const date = new Date(dateStr);

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
 * PARSE IIS FORMAT
 * (Windows Internet Information Services)
 */
export function parseIIS(logContent: string): LogEntry[] {
  // Similar to W3C parsing
  return parseW3C(logContent);
}

/**
 * PARSE WITH CHATGPT (for unknown formats)
 * 
 * Uses OpenAI API to intelligently parse unknown log formats
 */
export async function parseWithChatGPT(
  logContent: string,
  apiKey: string
): Promise<LogEntry[]> {
  try {
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

    let jsonStr = content;
    if (content.includes('```')) {
      const match = content.match(/```(?:json)?\n?([\s\S]+?)\n?```/);
      jsonStr = match ? match[1] : content;
    }

    const parsedSample = JSON.parse(jsonStr);

    const entries: LogEntry[] = parsedSample.map((entry: any, index: number) => ({
      ...entry,
      date: new Date(entry.timestamp),
      hour: new Date(entry.timestamp).getHours(),
      lineNumber: index + 1
    }));

    console.log(`✅ ChatGPT: ${entries.length} entries parsed from sample`);
    return entries;

  } catch (error) {
    console.error('❌ ChatGPT parsing failed:', error);
    return parseApacheNginx(logContent);
  }
}

/**
 * PARSE APACHE TIMESTAMP
 * 
 * Converts Apache timestamp format to JavaScript Date object
 * Example: "16/Oct/2024:10:23:45 +0000" → Date object
 */
export function parseApacheTimestamp(timestamp: string): Date {
  const months: { [key: string]: number } = {
    'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
    'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
  };

  try {
    const [datePart, timePart] = timestamp.split(':');
    const [day, monthStr, year] = datePart.split('/');
    const timeComponents = timestamp.match(/(\d{2}):(\d{2}):(\d{2})/);

    if (!timeComponents) throw new Error('Invalid timestamp format');

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

