# 🔒 LogTrace - Complete Project Guide

**Your one-stop reference for the entire project**

---

## 📑 Table of Contents

### Part 1: Quick Reference
- [TL;DR Overview](#tldr-overview)
- [What Are We Building?](#what-are-we-building)
- [Tech Stack](#tech-stack)
- [File Structure Explained](#file-structure-explained)
- [The 6 Anomaly Rules](#the-6-anomaly-rules)
- [Data Flow](#data-flow)

### Part 2: Development Checklist
- [Phase 1 Checklist (MVP - 5 hours)](#phase-1-checklist-mvp---5-hours)
- [Phase 2 Checklist (Database - 2 hours)](#phase-2-checklist-database---2-hours)
- [Phase 3 Checklist (Polish - 1 hour)](#phase-3-checklist-polish---1-hour)

### Part 3: Detailed Specifications
- [User Stories](#user-stories)
- [Feature Requirements](#feature-requirements)
- [Anomaly Detection Engine (Detailed)](#anomaly-detection-engine-detailed)
- [Database Schema](#database-schema)
- [UI/UX Design](#uiux-design)

### Part 4: Code Examples
- [Parser Code](#parser-code)
- [Analyzer Code](#analyzer-code)
- [Display Code](#display-code)

### Part 5: Submission
- [Testing Plan](#testing-plan)
- [Video Walkthrough Guide](#video-walkthrough-guide)
- [Interview Talking Points](#interview-talking-points)
- [Pre-Submission Checklist](#pre-submission-checklist)

---

# PART 1: QUICK REFERENCE

## TL;DR Overview

**What:** A web app that analyzes log files and automatically detects suspicious activity  
**Who:** Built for SOC (Security) analysts  
**How:** Upload log → Parse it → Detect anomalies → Show results with explanations  
**Time:** 6-8 hours total  
**Approach:** Phase 1 (MVP) → Phase 2 (Add Database) → Phase 3 (Polish)  

---

## What Are We Building?

LogTrace is a log analyzer with:
1. ✅ **Login system** (basic auth)
2. ✅ **File upload** (drag-drop or click)
3. ✅ **Log parser** (extracts IP, time, URL, status)
4. ✅ **Anomaly detector** (finds 6 types of suspicious patterns)
5. ✅ **Results display** (timeline + cards + explanations)
6. ✅ **Confidence scores** (0-100% how sure we are)

---

## Tech Stack

```
Frontend:  HTML + CSS + Vanilla JavaScript (NO frameworks!)
Backend:   Node.js + Express (simple server)
Database:  Phase 1: None | Phase 2: Supabase (free PostgreSQL)
```

**Why vanilla JS?**
- ✅ Simple to explain (no framework magic)
- ✅ Fast to build (no setup needed)
- ✅ Easy for non-coder to understand

**Why Supabase?**
- ✅ Free tier (500MB)
- ✅ It IS PostgreSQL (what they asked for)
- ✅ Built-in auth + storage (saves time)
- ✅ 5-minute setup

---

## File Structure Explained

```
LogTrace/
├── index.html          → Login page
├── upload.html         → Upload log file page
├── results.html        → See analysis results
├── history.html        → (Phase 2) Past uploads
│
├── css/
│   └── style.css       → All styling
│
├── js/
│   ├── auth.js         → Login/logout logic
│   ├── upload.js       → Read file with FileReader API
│   ├── parser.js       → Extract data from log (regex)
│   ├── analyzer.js     → THE BRAIN - detects anomalies
│   ├── display.js      → Show results on page
│   ├── supabase.js     → (Phase 2) Database connection
│   └── storage.js      → (Phase 2) Save/load from DB
│
├── backend/
│   └── server.js       → Express server (serves files)
│
├── examples/
│   ├── sample-normal.log   → Clean log (no issues)
│   └── sample-attacks.log  → Log with anomalies
│
└── supabase/
    └── schema.sql      → (Phase 2) Database tables
```

---

## The 6 Anomaly Rules

Your "AI" will detect these patterns:

| # | Rule Name | What It Catches | Example |
|---|-----------|-----------------|---------|
| 1 | **High Request Volume** | One IP making way more requests than others | IP made 200 requests, average is 40 |
| 2 | **Multiple Failed Attempts** | Repeated failures (brute force) | 15 failed login attempts from one IP |
| 3 | **Unusual Time Activity** | Activity during off-hours | 50 requests at 3:00 AM |
| 4 | **Suspicious URL Access** | Accessing admin/config pages | Tried to access /wp-admin |
| 5 | **Large Data Transfer** | Downloading huge files | 15 MB download (data theft?) |
| 6 | **Rapid Sequential Requests** | Bot-like behavior | 20 requests in 5 seconds |

**Each anomaly includes:**
- 📝 **Explanation** - Why it's suspicious (plain English)
- 🎯 **Confidence Score** - 0-100% (higher = more sure)
- ⚠️ **Severity** - Warning (yellow) or Critical (red)

---

## Data Flow

```
1. User logs in
   └─> auth.js checks username/password

2. User uploads log file
   └─> upload.js uses FileReader to read it

3. File content is parsed
   └─> parser.js extracts: IP, time, URL, status code

4. Anomalies are detected
   └─> analyzer.js counts patterns, finds weird stuff

5. Results are displayed
   └─> display.js creates cards, timeline, stats

6. (Phase 2) Results saved to database
   └─> storage.js saves to Supabase
```

---

# PART 2: DEVELOPMENT CHECKLIST

## Phase 1 Checklist (MVP - 5 hours)

### ✅ Hour 1: Project Setup
- [ ] Create folder structure
  ```bash
  mkdir LogTrace
  cd LogTrace
  mkdir css js backend examples supabase
  ```
- [ ] Initialize project
  ```bash
  npm init -y
  npm install express
  ```
- [ ] Create `backend/server.js` (basic Express server)
- [ ] Create `index.html` (login page skeleton)
- [ ] Create `upload.html` (upload page skeleton)
- [ ] Create `results.html` (results page skeleton)
- [ ] Create `css/style.css` (basic colors and fonts)
- [ ] Test: Run server (`node backend/server.js`), visit pages

**✅ CHECKPOINT:** Can navigate between pages in browser

---

### ✅ Hour 2: Authentication
- [ ] Create `js/auth.js`
- [ ] Add hardcoded users:
  ```javascript
  const users = {
    'admin': 'password123',
    'analyst': 'soc2024'
  };
  ```
- [ ] Implement `login()` function (check credentials)
- [ ] Implement `logout()` function (clear session)
- [ ] Implement `checkAuth()` function (verify logged in)
- [ ] Build login form in `index.html`
- [ ] Add form submit event listener
- [ ] Use `sessionStorage` to track login state
- [ ] Add redirect logic (login success → upload.html)
- [ ] Add logout button to upload.html
- [ ] Style login page (centered card with gradient)

**✅ CHECKPOINT:** Can login with admin/password123, logout redirects to login

---

### ✅ Hour 3: File Upload & Parser
- [ ] Create `js/upload.js`
- [ ] Add file input to `upload.html`
  ```html
  <input type="file" accept=".log,.txt" id="logFile">
  ```
- [ ] Implement FileReader logic:
  ```javascript
  const reader = new FileReader();
  reader.onload = function(e) { /* process */ };
  reader.readAsText(file);
  ```
- [ ] Add loading spinner HTML/CSS
- [ ] Create `js/parser.js`
- [ ] Write regex pattern:
  ```javascript
  /^(\S+) .* \[(.*?)\] "(\w+) (\S+).*" (\d+) (\d+)/
  ```
- [ ] Implement `parseLog()` function
- [ ] Parse timestamp to Date object
- [ ] Extract hour for time-based analysis
- [ ] Create `examples/sample-normal.log` (500 lines, clean)
- [ ] Create `examples/sample-attacks.log` (1000 lines, with anomalies)
- [ ] Test: Upload file, console.log parsed array

**✅ CHECKPOINT:** Can upload and parse log file, see structured data in console

---

### ✅ Hour 4: Anomaly Detection ⭐ (THE IMPORTANT PART!)
- [ ] Create `js/analyzer.js`
- [ ] Implement `analyzeLog(entries)` main function
- [ ] Implement `buildStats(entries)` helper:
  - Count requests per IP
  - Count failed attempts per IP
  - Count requests per hour
- [ ] **Rule 1: High Request Volume**
  - Calculate average requests per IP
  - Flag if IP has 5x more than average
  - Confidence: `Math.min(95, 50 + (count/avg) * 10)`
- [ ] **Rule 2: Multiple Failed Attempts**
  - Count 4xx/5xx status codes per IP
  - Flag if 5+ failures
  - Confidence: `Math.min(95, 60 + count * 5)`
- [ ] **Rule 3: Unusual Time Activity**
  - Check hour of requests
  - Flag if 50+ requests between 1-5 AM
  - Confidence: 70%
- [ ] **Rule 4: Suspicious URL Access**
  - Check URL against blacklist: /admin, /config, /.env, /wp-admin
  - Flag any access
  - Confidence: 85%
- [ ] **Rule 5: Large Data Transfer**
  - Check bytes transferred
  - Flag if > 10,000,000 bytes (10MB)
  - Confidence: 75%
- [ ] **Rule 6: Rapid Sequential Requests**
  - Group requests by IP and time
  - Flag if 10+ requests within 10 seconds
  - Confidence: 80%
- [ ] Add severity logic:
  - Critical: High confidence (>85%) or very extreme
  - Warning: Everything else
- [ ] Test with `sample-attacks.log`
- [ ] Verify all anomaly types detected

**✅ CHECKPOINT:** Analyzer detects all 6 types with explanations and scores

---

### ✅ Hour 5: Results Display
- [ ] Create `js/display.js`
- [ ] Implement `displayResults()` function
- [ ] **Build Summary Stats Section:**
  - Total events count
  - Unique IPs count
  - Time range (first to last event)
  - Anomalies found count
  - Critical vs warning count
- [ ] **Build Anomaly Cards:**
  - Create `createAnomalyCard(anomaly)` function
  - Card structure:
    ```html
    <div class="anomaly-card critical">
      <h3>Type</h3>
      <p class="confidence">92% confident</p>
      <p class="explanation">...</p>
      <p class="details">IP: ..., Count: ...</p>
    </div>
    ```
  - Color code: red border for critical, yellow for warning
- [ ] **Build Timeline:**
  - Create horizontal timeline with time markers
  - Add dots for events
  - Highlight anomaly timestamps with ⚠️
- [ ] **Build Event Table:**
  - Columns: Time | IP | Method | URL | Status
  - Highlight rows involved in anomalies
  - Make sortable (optional)
- [ ] **Style results.html:**
  - Dark security-themed colors
  - Card layout with shadows
  - Responsive grid
- [ ] **Connect the flow:**
  - upload.js → parser.js → analyzer.js → save to sessionStorage → redirect to results.html
  - display.js → load from sessionStorage → render everything
- [ ] Test end-to-end with both sample files
- [ ] Test with empty file (should show error)

**✅ CHECKPOINT:** 🎉 WORKING DEMO! Can login → upload → see results!

---

## 🎊 END OF PHASE 1 - YOU HAVE A COMPLETE FUNCTIONAL DEMO!

**Take a break! Test everything. You can submit this if you run out of time.**

---

## Phase 2 Checklist (Database - 2 hours)

### ✅ Hour 6: Supabase Setup
- [ ] Go to [supabase.com](https://supabase.com)
- [ ] Sign up with GitHub
- [ ] Create new project: "LogTrace"
- [ ] Wait for provisioning (~2 minutes)
- [ ] Go to **SQL Editor** in dashboard
- [ ] Create `uploads` table:
  ```sql
  CREATE TABLE uploads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    filename TEXT NOT NULL,
    file_size INTEGER,
    upload_date TIMESTAMPTZ DEFAULT NOW()
  );
  ```
- [ ] Create `analysis_results` table:
  ```sql
  CREATE TABLE analysis_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    upload_id UUID REFERENCES uploads(id),
    user_id UUID REFERENCES auth.users(id),
    filename TEXT,
    total_events INTEGER,
    unique_ips INTEGER,
    anomaly_count INTEGER,
    critical_count INTEGER,
    warning_count INTEGER,
    anomalies JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );
  ```
- [ ] Add indexes:
  ```sql
  CREATE INDEX idx_analysis_user ON analysis_results(user_id);
  CREATE INDEX idx_analysis_date ON analysis_results(created_at DESC);
  ```
- [ ] Enable Row Level Security (RLS) on both tables
- [ ] Add RLS policies:
  ```sql
  CREATE POLICY "Users view own data"
    ON analysis_results FOR SELECT
    USING (auth.uid() = user_id);
  ```
- [ ] Go to **Storage** → Create bucket: "log-files"
- [ ] Go to **Settings** → **API** → Copy:
  - Project URL
  - Anon key
- [ ] Install Supabase client:
  ```bash
  npm install @supabase/supabase-js
  ```
- [ ] Create `.env` file:
  ```
  SUPABASE_URL=https://xxxxx.supabase.co
  SUPABASE_KEY=eyJxxxx...
  ```
- [ ] Create `js/supabase.js`:
  ```javascript
  import { createClient } from '@supabase/supabase-js';
  export const supabase = createClient(
    'YOUR_URL',
    'YOUR_KEY'
  );
  ```
- [ ] Test connection (console.log a simple query)

**✅ CHECKPOINT:** Supabase connected, can query database

---

### ✅ Hour 7: Database Integration
- [ ] **Update auth.js:**
  - Replace hardcoded users with Supabase Auth
  - Implement `signUp()` function
  - Implement `signIn()` using `supabase.auth.signInWithPassword()`
  - Implement `signOut()`
  - Implement `getUser()` to get current user
- [ ] **Add signup page:**
  - Create signup form or add to login page
  - Email + password fields
- [ ] **Create storage.js:**
  - Implement `saveAnalysisResult(data)`:
    ```javascript
    await supabase
      .from('analysis_results')
      .insert({ user_id, filename, anomalies, ... });
    ```
  - Implement `getHistory()`:
    ```javascript
    await supabase
      .from('analysis_results')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    ```
  - Implement `getAnalysisById(id)`
  - Implement `deleteAnalysis(id)`
- [ ] **Update upload.js:**
  - After analysis, call `saveAnalysisResult()`
  - Optionally upload file to Supabase Storage
- [ ] **Create history.html:**
  - List all past analyses
  - Show: date, filename, anomaly count
  - Click to load full results
  - Add delete button
- [ ] **Create history.js:**
  - Load history on page load
  - Render list of past analyses
  - Handle click → load results
  - Handle delete → remove from DB
- [ ] Test full flow:
  - Sign up new user
  - Login
  - Upload file
  - Check it saved to database (Supabase dashboard)
  - Go to history page
  - Click previous analysis
  - See results load

**✅ CHECKPOINT:** Full persistence! Can view upload history!

---

## Phase 3 Checklist (Polish - 1 hour)

### ✅ Hour 8: Final Touches
- [ ] **Add code comments:**
  - Every function should have a comment explaining what it does
  - Example:
    ```javascript
    // Parses raw log text and extracts structured data
    // Returns: Array of log entry objects
    function parseLog(logContent) { ... }
    ```
- [ ] **Write README.md:**
  - Project title and description
  - Screenshot of results page (take one!)
  - Features list
  - Tech stack explanation
  - Setup instructions:
    - Prerequisites
    - Installation steps
    - How to run
    - Login credentials (for demo)
  - How to use
  - Anomaly detection explained
  - Example log files info
  - Database setup (Phase 2)
  - Video link (add after recording)
  - Future enhancements
- [ ] **Create .gitignore:**
  ```
  node_modules/
  .env
  .DS_Store
  ```
- [ ] **Test everything:**
  - Open in incognito/private window
  - Test Phase 1 flow (login → upload → results)
  - Test Phase 2 flow (signup → upload → history)
  - Test with all 3 example files
  - Test error cases (wrong login, empty file, large file)
- [ ] **Fix any bugs found**
- [ ] **Check responsive design:**
  - Resize browser window
  - Test on tablet size (768px)
  - Mobile is nice-to-have
- [ ] **Record video walkthrough** (see video guide below)
- [ ] **Push to GitHub:**
  ```bash
  git init
  git add .
  git commit -m "Initial commit: LogTrace log analyzer"
  git remote add origin <your-repo-url>
  git push -u origin main
  ```
- [ ] **Share repo with venkata@tenex.ai**
- [ ] **(Optional) Deploy to Vercel:**
  - Connect GitHub repo to Vercel
  - Add environment variables
  - Deploy

**✅ CHECKPOINT:** 🎉 READY TO SUBMIT!

---

# PART 3: DETAILED SPECIFICATIONS

## User Stories

### Phase 1 Stories
1. As Sarah (SOC analyst), I want to **log into the system** so that only authorized users can access it
2. As Sarah, I want to **upload a log file** so that I can analyze it for threats
3. As Sarah, I want the system to **automatically parse the log** so I don't have to read raw text
4. As Sarah, I want to see a **timeline of events** so I understand what happened chronologically
5. As Sarah, I want **suspicious activities flagged** so I can focus on important issues
6. As Sarah, I want **each anomaly explained** so I understand why it's suspicious
7. As Sarah, I want **confidence scores** so I can prioritize which anomalies to investigate first
8. As Sarah, I want **color-coded severity** so I can quickly identify critical issues

### Phase 2 Stories
9. As Sarah, I want to **create my own account** so I can use the tool independently
10. As Sarah, I want my **uploads saved** so I can review them later
11. As Sarah, I want to see **history of analyses** so I can track patterns over time
12. As Mike (manager), I want to **see past analyses** so I can review the team's work

---

## Feature Requirements

### 1. Authentication

#### Phase 1: Simple Auth
- Login form with username and password
- Hardcoded users:
  ```javascript
  { 'admin': 'password123', 'analyst': 'soc2024' }
  ```
- Session stored in `sessionStorage`
- Redirect to upload on success
- Error message on failure
- Logout button clears session

#### Phase 2: Supabase Auth
- Signup with email/password
- Login with Supabase Auth
- Secure password hashing (automatic)
- Session management (automatic)
- Password reset (optional)

---

### 2. File Upload

- File input accepts `.log` and `.txt` files
- Optional: Drag-and-drop zone
- Shows selected filename
- Loading spinner during processing
- File size limit: 10MB (Phase 1)
- Validation for empty files
- FileReader API reads file in browser (Phase 1)
- Upload to Supabase Storage (Phase 2)

---

### 3. Log Parser

**Input:** Raw log text (Apache/Nginx format)

**Example log line:**
```
192.168.1.1 - - [15/Oct/2025:10:23:45 +0000] "GET /api/users HTTP/1.1" 200 1234
```

**Regex Pattern:**
```javascript
/^(\S+) .* \[(.*?)\] "(\w+) (\S+).*" (\d+) (\d+)/
```

**Parsed Object:**
```javascript
{
  ip: "192.168.1.1",
  timestamp: "15/Oct/2025:10:23:45 +0000",
  method: "GET",
  url: "/api/users",
  statusCode: "200",
  bytes: "1234",
  date: Date object,
  hour: 10
}
```

**Error Handling:**
- Skip unparseable lines
- Log skipped lines to console
- Show warning if >10% lines failed

---

## Anomaly Detection Engine (Detailed)

### Core Concept
Rule-based pattern matching that counts and compares to find outliers. NOT machine learning, but effective and explainable.

---

### Rule 1: High Request Volume

**What it detects:** One IP making significantly more requests than others

**Logic:**
```javascript
1. Count requests per IP
2. Calculate average: totalRequests / uniqueIPs
3. For each IP:
   - If count > average * 5:
     → Flag as anomaly
```

**Confidence Calculation:**
```javascript
confidence = Math.min(95, 50 + (ipCount / average) * 10)
```

**Example:**
- Average: 40 requests per IP
- This IP: 250 requests
- Multiplier: 250 / 40 = 6.25x
- Confidence: 50 + (6.25 * 10) = 112 → capped at 95%

**Severity:**
- Warning: 5-10x average
- Critical: >10x average

**Explanation Template:**
```
"IP {ip} made {count} requests, which is {multiplier}x higher than average ({average})"
```

---

### Rule 2: Multiple Failed Attempts

**What it detects:** Repeated 4xx/5xx status codes (brute force)

**Logic:**
```javascript
1. For each IP, count failed requests (status >= 400)
2. If count >= 5:
   → Flag as anomaly
```

**Confidence Calculation:**
```javascript
confidence = Math.min(95, 60 + failCount * 5)
```

**Example:**
- 5 failures: 60 + (5*5) = 85%
- 10 failures: 60 + (10*5) = 110 → capped at 95%

**Severity:**
- Warning: 5-10 failures
- Critical: >10 failures

**Explanation Template:**
```
"IP {ip} had {count} failed requests. This could indicate a brute force attack or unauthorized access attempt."
```

---

### Rule 3: Unusual Time Activity

**What it detects:** High activity during off-hours (1 AM - 5 AM)

**Logic:**
```javascript
1. Extract hour from each timestamp
2. Count requests per hour
3. For hours 1-5 AM:
   - If count > 50:
     → Flag as anomaly
```

**Confidence:** 70% (medium - could be legitimate)

**Severity:** Warning

**Explanation Template:**
```
"{count} requests detected between {hour}:00-{hour}:59, which is outside normal business hours. Could indicate unauthorized access."
```

---

### Rule 4: Suspicious URL Access

**What it detects:** Attempts to access sensitive endpoints

**Blacklist:**
```javascript
['/admin', '/config', '/.env', '/wp-admin', '/phpmyadmin', 
 '/.git', '/backup', '/database']
```

**Logic:**
```javascript
1. For each request:
   - Check if URL contains any blacklist string
   - If yes: Flag immediately
```

**Confidence:** 85%

**Severity:** Critical

**Explanation Template:**
```
"Access attempt to sensitive endpoint: {url}. This could indicate reconnaissance or attack attempt."
```

---

### Rule 5: Large Data Transfer

**What it detects:** Unusually large downloads (data exfiltration)

**Logic:**
```javascript
1. Check bytes field in each request
2. If bytes > 10,000,000 (10MB):
   → Flag as anomaly
```

**Confidence:** 75%

**Severity:** Warning

**Explanation Template:**
```
"Large data transfer detected: {bytes} bytes ({MB} MB) from {ip}. Could indicate data exfiltration."
```

---

### Rule 6: Rapid Sequential Requests

**What it detects:** Bot-like behavior (many requests in seconds)

**Logic:**
```javascript
1. Group requests by IP
2. Sort by timestamp
3. For each IP, check for bursts:
   - Count requests within 10-second windows
   - If count > 10 in any window:
     → Flag as anomaly
```

**Confidence:** 80%

**Severity:** Warning

**Explanation Template:**
```
"IP {ip} made {count} requests in {seconds} seconds. Possible automated attack or bot activity."
```

---

### Anomaly Object Structure

```javascript
{
  type: "Multiple Failed Attempts",
  ip: "192.168.1.1",
  count: 15,
  expected: 0-2,  // optional
  explanation: "IP 192.168.1.1 had 15 failed requests...",
  confidence: 92,
  severity: "critical",  // or "warning"
  timestamp: "2025-10-15T10:23:45Z",
  affectedUrls: ["/admin", "/login"],  // optional
  timeRange: { start: "10:15:23", end: "10:17:45" }  // optional
}
```

---

## Database Schema

### Table: `uploads`

```sql
CREATE TABLE uploads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  file_size INTEGER,
  upload_date TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT uploads_filename_length CHECK (char_length(filename) <= 255)
);

CREATE INDEX idx_uploads_user_id ON uploads(user_id);
CREATE INDEX idx_uploads_date ON uploads(upload_date DESC);
```

---

### Table: `analysis_results`

```sql
CREATE TABLE analysis_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  upload_id UUID REFERENCES uploads(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Summary stats
  filename TEXT NOT NULL,
  total_events INTEGER NOT NULL,
  unique_ips INTEGER NOT NULL,
  time_range_start TIMESTAMPTZ,
  time_range_end TIMESTAMPTZ,
  
  -- Anomaly counts
  anomaly_count INTEGER DEFAULT 0,
  critical_count INTEGER DEFAULT 0,
  warning_count INTEGER DEFAULT 0,
  
  -- Full anomaly data (stored as JSON)
  anomalies JSONB NOT NULL,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT valid_counts CHECK (
    anomaly_count >= 0 AND
    critical_count >= 0 AND
    warning_count >= 0
  )
);

CREATE INDEX idx_analysis_user_id ON analysis_results(user_id);
CREATE INDEX idx_analysis_date ON analysis_results(created_at DESC);
CREATE INDEX idx_analysis_upload_id ON analysis_results(upload_id);
```

---

### Row-Level Security (RLS)

```sql
-- Enable RLS
ALTER TABLE uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_results ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users view own uploads"
  ON uploads FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own uploads"
  ON uploads FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users view own analysis"
  ON analysis_results FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own analysis"
  ON analysis_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

---

## UI/UX Design

### Color Palette

```css
/* Dark security theme */
--primary-blue: #3b82f6;
--primary-dark: #1e293b;
--background: #0f172a;
--surface: #1e293b;

/* Status colors */
--success: #10b981;
--warning: #f59e0b;
--critical: #ef4444;
--info: #3b82f6;

/* Text */
--text-primary: #f1f5f9;
--text-secondary: #94a3b8;
```

### Card Styling

```css
.anomaly-card {
  background: #1e293b;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 16px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.anomaly-card.critical {
  border-left: 4px solid #ef4444;
}

.anomaly-card.warning {
  border-left: 4px solid #f59e0b;
}
```

---

# PART 4: CODE EXAMPLES

## Parser Code

```javascript
// js/parser.js

/**
 * Parses Apache/Nginx log format into structured objects
 * @param {string} logContent - Raw log file text
 * @returns {Array} Array of parsed log entry objects
 */
function parseLog(logContent) {
  const lines = logContent.split('\n');
  const entries = [];
  
  // Regex for Apache/Nginx combined log format
  // Format: IP - - [timestamp] "METHOD URL HTTP/x.x" status bytes
  const pattern = /^(\S+) .* \[(.*?)\] "(\w+) (\S+).*" (\d+) (\d+)/;
  
  for (let line of lines) {
    if (!line.trim()) continue;  // Skip empty lines
    
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
        hour: date.getHours()
      });
    } else {
      console.warn('Could not parse line:', line);
    }
  }
  
  return entries;
}

/**
 * Converts Apache timestamp to JavaScript Date object
 * @param {string} timestamp - "15/Oct/2025:10:23:45 +0000"
 * @returns {Date} JavaScript Date object
 */
function parseApacheTimestamp(timestamp) {
  // Convert format like "15/Oct/2025:10:23:45 +0000" to Date
  const parts = timestamp.split(':');
  const datePart = parts[0].split('/');
  const timePart = parts.slice(1, 4).join(':').split(' ')[0];
  
  const months = {
    'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
    'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
  };
  
  return new Date(
    datePart[2],  // year
    months[datePart[1]],  // month
    datePart[0],  // day
    ...timePart.split(':')  // hour, min, sec
  );
}
```

---

## Analyzer Code

```javascript
// js/analyzer.js

/**
 * Main anomaly detection function
 * @param {Array} entries - Parsed log entries
 * @returns {Array} Array of detected anomalies
 */
function analyzeLog(entries) {
  if (!entries || entries.length === 0) {
    return [];
  }
  
  const anomalies = [];
  
  // Build statistics from entries
  const stats = buildStats(entries);
  
  // Run all detection rules
  anomalies.push(...detectHighRequestVolume(stats, entries));
  anomalies.push(...detectFailedAttempts(stats, entries));
  anomalies.push(...detectUnusualTiming(stats, entries));
  anomalies.push(...detectSuspiciousUrls(entries));
  anomalies.push(...detectLargeTransfers(entries));
  anomalies.push(...detectRapidRequests(entries));
  
  // Sort by confidence (highest first)
  anomalies.sort((a, b) => b.confidence - a.confidence);
  
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
 */
function detectHighRequestVolume(stats, entries) {
  const anomalies = [];
  const avgRequestsPerIp = stats.totalEntries / stats.uniqueIps;
  
  for (let ip in stats.ipCounts) {
    const count = stats.ipCounts[ip];
    const multiplier = count / avgRequestsPerIp;
    
    // Flag if 5x higher than average
    if (multiplier >= 5) {
      const confidence = Math.min(95, 50 + multiplier * 10);
      
      anomalies.push({
        type: 'High Request Volume',
        ip: ip,
        count: count,
        expected: Math.round(avgRequestsPerIp),
        explanation: `IP ${ip} made ${count} requests, which is ${multiplier.toFixed(1)}x higher than average (${Math.round(avgRequestsPerIp)})`,
        confidence: Math.round(confidence),
        severity: multiplier > 10 ? 'critical' : 'warning'
      });
    }
  }
  
  return anomalies;
}

/**
 * RULE 2: Detect multiple failed attempts (brute force)
 */
function detectFailedAttempts(stats, entries) {
  const anomalies = [];
  
  for (let ip in stats.failedByIp) {
    const failures = stats.failedByIp[ip];
    
    if (failures.length >= 5) {
      const confidence = Math.min(95, 60 + failures.length * 5);
      const urls = [...new Set(failures.map(f => f.url))];
      
      anomalies.push({
        type: 'Multiple Failed Attempts',
        ip: ip,
        count: failures.length,
        explanation: `IP ${ip} had ${failures.length} failed requests. This could indicate a brute force attack or unauthorized access attempt.`,
        confidence: Math.round(confidence),
        severity: failures.length > 10 ? 'critical' : 'warning',
        affectedUrls: urls.slice(0, 5)  // First 5 URLs
      });
    }
  }
  
  return anomalies;
}

/**
 * RULE 3: Detect unusual time activity (off-hours)
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
        explanation: `${count} requests detected between ${hour}:00-${hour}:59, which is outside normal business hours. Could indicate unauthorized access.`,
        confidence: 70,
        severity: 'warning'
      });
    }
  }
  
  return anomalies;
}

/**
 * RULE 4: Detect suspicious URL access
 */
function detectSuspiciousUrls(entries) {
  const anomalies = [];
  const blacklist = ['/admin', '/config', '/.env', '/wp-admin', '/phpmyadmin', '/.git', '/backup'];
  const suspiciousAccess = {};
  
  entries.forEach(entry => {
    for (let suspect of blacklist) {
      if (entry.url.includes(suspect)) {
        const key = `${entry.ip}:${suspect}`;
        if (!suspiciousAccess[key]) {
          suspiciousAccess[key] = {
            ip: entry.ip,
            url: entry.url,
            count: 0
          };
        }
        suspiciousAccess[key].count++;
      }
    }
  });
  
  for (let key in suspiciousAccess) {
    const access = suspiciousAccess[key];
    anomalies.push({
      type: 'Suspicious URL Access',
      ip: access.ip,
      url: access.url,
      count: access.count,
      explanation: `IP ${access.ip} attempted to access sensitive endpoint: ${access.url}. This could indicate reconnaissance or attack attempt.`,
      confidence: 85,
      severity: 'critical'
    });
  }
  
  return anomalies;
}

/**
 * RULE 5: Detect large data transfers
 */
function detectLargeTransfers(entries) {
  const anomalies = [];
  const threshold = 10000000;  // 10 MB
  
  entries.forEach(entry => {
    if (entry.bytes > threshold) {
      const mb = (entry.bytes / 1000000).toFixed(2);
      anomalies.push({
        type: 'Large Data Transfer',
        ip: entry.ip,
        url: entry.url,
        bytes: entry.bytes,
        explanation: `Large data transfer detected: ${mb} MB from IP ${entry.ip}. Could indicate data exfiltration.`,
        confidence: 75,
        severity: 'warning'
      });
    }
  });
  
  return anomalies;
}

/**
 * RULE 6: Detect rapid sequential requests (bot behavior)
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
    
    // Check 10-second windows
    for (let i = 0; i < requests.length; i++) {
      let count = 1;
      const startTime = requests[i].date;
      
      for (let j = i + 1; j < requests.length; j++) {
        const timeDiff = (requests[j].date - startTime) / 1000;  // seconds
        if (timeDiff <= 10) {
          count++;
        } else {
          break;
        }
      }
      
      if (count > 10) {
        anomalies.push({
          type: 'Rapid Sequential Requests',
          ip: ip,
          count: count,
          explanation: `IP ${ip} made ${count} requests in 10 seconds. Possible automated attack or bot activity.`,
          confidence: 80,
          severity: 'warning'
        });
        break;  // Only report once per IP
      }
    }
  }
  
  return anomalies;
}
```

---

## Display Code

```javascript
// js/display.js

/**
 * Main display function - renders all results
 */
function displayResults() {
  // Get results from sessionStorage (or passed parameter in Phase 2)
  const resultsJson = sessionStorage.getItem('results');
  if (!resultsJson) {
    alert('No results found!');
    window.location.href = 'upload.html';
    return;
  }
  
  const results = JSON.parse(resultsJson);
  const { parsed, anomalies } = results;
  
  // Display summary stats
  displaySummary(parsed, anomalies);
  
  // Display anomaly cards
  displayAnomalies(anomalies);
  
  // Display timeline
  displayTimeline(parsed, anomalies);
  
  // Display event table (optional)
  // displayEventTable(parsed, anomalies);
}

/**
 * Display summary statistics
 */
function displaySummary(entries, anomalies) {
  const uniqueIps = new Set(entries.map(e => e.ip)).size;
  const timeRange = entries.length > 0 
    ? `${entries[0].timestamp.split(':')[0]} - ${entries[entries.length-1].timestamp.split(':')[0]}`
    : 'N/A';
  
  const criticalCount = anomalies.filter(a => a.severity === 'critical').length;
  const warningCount = anomalies.filter(a => a.severity === 'warning').length;
  
  document.getElementById('total-events').textContent = entries.length.toLocaleString();
  document.getElementById('unique-ips').textContent = uniqueIps;
  document.getElementById('time-range').textContent = timeRange;
  document.getElementById('anomaly-count').textContent = anomalies.length;
  document.getElementById('critical-count').textContent = criticalCount;
  document.getElementById('warning-count').textContent = warningCount;
}

/**
 * Display anomaly cards
 */
function displayAnomalies(anomalies) {
  const container = document.getElementById('anomaly-container');
  container.innerHTML = '';  // Clear existing
  
  if (anomalies.length === 0) {
    container.innerHTML = '<div class="no-anomalies">✅ No anomalies detected! This log looks clean.</div>';
    return;
  }
  
  anomalies.forEach(anomaly => {
    const card = createAnomalyCard(anomaly);
    container.appendChild(card);
  });
}

/**
 * Create individual anomaly card
 */
function createAnomalyCard(anomaly) {
  const card = document.createElement('div');
  card.className = `anomaly-card ${anomaly.severity}`;
  
  // Confidence badge color
  let confidenceClass = 'low';
  if (anomaly.confidence >= 85) confidenceClass = 'high';
  else if (anomaly.confidence >= 70) confidenceClass = 'medium';
  
  card.innerHTML = `
    <div class="card-header">
      <h3>${anomaly.type}</h3>
      <span class="confidence-badge ${confidenceClass}">${anomaly.confidence}% confident</span>
    </div>
    <div class="card-body">
      <p class="explanation">${anomaly.explanation}</p>
      <div class="details">
        ${anomaly.ip ? `<p><strong>IP:</strong> ${anomaly.ip}</p>` : ''}
        ${anomaly.count ? `<p><strong>Count:</strong> ${anomaly.count}</p>` : ''}
        ${anomaly.url ? `<p><strong>URL:</strong> ${anomaly.url}</p>` : ''}
        ${anomaly.affectedUrls ? `<p><strong>URLs:</strong> ${anomaly.affectedUrls.join(', ')}</p>` : ''}
      </div>
    </div>
  `;
  
  return card;
}

/**
 * Display timeline
 */
function displayTimeline(entries, anomalies) {
  const timelineContainer = document.getElementById('timeline');
  timelineContainer.innerHTML = '';
  
  if (entries.length === 0) return;
  
  // Create simple timeline with markers
  const startTime = entries[0].date;
  const endTime = entries[entries.length - 1].date;
  const duration = endTime - startTime;
  
  // Create timeline bar
  const bar = document.createElement('div');
  bar.className = 'timeline-bar';
  
  // Add event markers
  entries.forEach((entry, index) => {
    if (index % 50 === 0) {  // Show every 50th event to avoid clutter
      const position = ((entry.date - startTime) / duration) * 100;
      const marker = document.createElement('div');
      marker.className = 'timeline-marker';
      marker.style.left = `${position}%`;
      marker.title = `${entry.timestamp} - ${entry.ip}`;
      bar.appendChild(marker);
    }
  });
  
  // Add anomaly markers
  anomalies.forEach(anomaly => {
    // Find corresponding entry
    const entry = entries.find(e => e.ip === anomaly.ip);
    if (entry) {
      const position = ((entry.date - startTime) / duration) * 100;
      const marker = document.createElement('div');
      marker.className = `timeline-marker anomaly ${anomaly.severity}`;
      marker.style.left = `${position}%`;
      marker.title = `⚠️ ${anomaly.type}`;
      bar.appendChild(marker);
    }
  });
  
  timelineContainer.appendChild(bar);
}

// Run on page load
window.addEventListener('DOMContentLoaded', displayResults);
```

---

# PART 5: SUBMISSION

## Testing Plan

### Test Cases to Run

#### Authentication Tests
- [ ] Valid login → redirect to upload
- [ ] Invalid login → error message
- [ ] Logout → clear session, redirect to login
- [ ] Access upload page without login → redirect to login

#### Upload & Parse Tests
- [ ] Upload valid log file → parse successfully
- [ ] Upload empty file → show error
- [ ] Upload non-log file → show error
- [ ] Upload 5MB file → works
- [ ] Upload 15MB file → show size error

#### Anomaly Detection Tests
- [ ] Upload `sample-normal.log` → 0 anomalies
- [ ] Upload `sample-attacks.log` → 5-6 anomalies detected
- [ ] Each anomaly has: type, explanation, confidence, severity
- [ ] Critical anomalies have red border
- [ ] Warning anomalies have yellow border

#### Display Tests
- [ ] Summary stats show correct numbers
- [ ] Timeline displays with markers
- [ ] Anomaly cards render properly
- [ ] Confidence scores show as percentages
- [ ] Responsive on tablet (768px width)

#### Phase 2 Database Tests
- [ ] Signup creates account
- [ ] Login with Supabase works
- [ ] Upload saves to database
- [ ] History shows past uploads
- [ ] Click history item loads results
- [ ] RLS policies work (can't see other users' data)

---

## Video Walkthrough Guide

### Recording Setup
- Screen recording software (OBS, Loom, QuickTime)
- Test microphone (clear audio is critical!)
- Close unnecessary windows/tabs
- Have app running and ready
- Have example files ready

### Video Structure (5-10 minutes)

#### 1. Introduction (1 minute)
**Script:**
> "Hi, I'm [your name]. I built LogTrace, a log analysis tool for security analysts. It automatically detects suspicious patterns in log files and explains why they're suspicious. Let me show you how it works and walk through the code."

**Show:** Splash screen or login page

---

#### 2. Code Walkthrough (3-4 minutes)

**Show project structure in editor**

**Script:**
> "The project has a simple structure. Three HTML pages for login, upload, and results. The JavaScript is split by function:
> 
> **auth.js** handles login and logout
> 
> **upload.js** uses the FileReader API to read files in the browser
> 
> **parser.js** extracts structured data using regex
> 
> **analyzer.js** is the brain - it detects anomalies
> 
> Let me show you how one detection rule works..."

**Open analyzer.js, show one rule (Rule 2 is good):**

> "This rule detects multiple failed attempts - a sign of brute force attacks. It counts how many times each IP got a 4xx or 5xx error. If it's 5 or more, that's suspicious. The confidence score increases with more failures - 5 failures gives 85% confidence, 10 failures gives 95%.
>
> The explanation is generated dynamically so analysts understand exactly what was detected."

**Show the anomaly object structure:**

> "Each anomaly has a type, explanation, confidence score, and severity level. This makes it actionable for security teams."

---

#### 3. Live Demo (3-4 minutes)

**Switch to browser:**

> "Now let me show it in action. I'll login with a demo account..."

**Login with admin/password123**

> "Here's the upload page. I'll use a sample log file with suspicious activity..."

**Upload sample-attacks.log**

> "The app reads the file, parses it, and analyzes it - all in the browser, so it's instant."

**Results page loads:**

> "Here are the results. At the top, summary stats - 1247 events from 23 unique IPs, and we found 4 anomalies.
>
> The timeline shows when events happened, with red markers for anomalies.
>
> And here are the anomaly cards. This first one - Multiple Failed Attempts from IP 192.168.1.1. It had 15 failed requests, 92% confidence, marked as critical. The explanation tells the analyst why it's suspicious.
>
> This next one - High Request Volume. One IP made 5x more requests than average. 85% confidence, marked as warning since it's less severe.
>
> Each anomaly is color-coded and sorted by confidence, so analysts know what to investigate first."

**If Phase 2 done, show history:**

> "And here's the history page showing past analyses, so teams can track patterns over time."

---

#### 4. Technical Decisions (1 minute)

**Show code again briefly:**

**Script:**
> "A few key decisions: 
>
> I used vanilla JavaScript instead of React because it's simpler and more explainable. Every piece of logic is visible.
>
> I chose rule-based detection over machine learning because it's explainable, fast, and deterministic. Security teams need to know exactly why something was flagged.
>
> I built it in phases - MVP first, then added Supabase for persistence. This meant I always had a working demo even if time ran short.
>
> Supabase gave me PostgreSQL - which the assignment asked for - plus built-in auth and storage, saving me from building those from scratch."

---

#### 5. Conclusion (30 seconds)

**Script:**
> "This was a fun project that taught me a lot about log analysis and pattern detection. If I had more time, I'd add more log format support, real-time analysis, and maybe integrate ML for unknown patterns.
>
> Thanks for watching! The code is on GitHub and fully documented."

**Show GitHub repo**

---

## Interview Talking Points

### Q: "Walk me through your project"
**A:** 
> "LogTrace is a log analysis tool for security analysts. You upload a log file, and it automatically detects suspicious patterns - like IPs making excessive requests, failed login attempts, or accessing admin pages. Each detection includes an explanation and confidence score so analysts know what to prioritize.
>
> The tech stack is intentionally simple: HTML, CSS, and vanilla JavaScript on the frontend, Node.js backend, and Supabase for the database. I built it in phases - MVP first to prove the concept, then added persistence.
>
> The core value is the anomaly detection engine with 6 rule-based patterns that are explainable and actionable."

---

### Q: "How does the anomaly detection work?"
**A:**
> "It's pattern-based detection using 6 rules. For example, Rule 1 detects if one IP makes 5 times more requests than average. Rule 2 detects multiple failed attempts - potential brute force attacks.
>
> Each rule counts something - like request volume, failure rate, or timing - and compares it to a threshold. If it exceeds the threshold, it's flagged with a confidence score based on how extreme it is.
>
> I chose rule-based over machine learning because it's explainable, deterministic, and fast. Security teams need to understand exactly why something was flagged, and rules provide that transparency."

---

### Q: "Why vanilla JavaScript instead of React?"
**A:**
> "Three reasons: simplicity, speed, and explainability.
>
> For a prototype, vanilla JS let me focus on the core logic - the parser and analyzer - without wrestling with framework setup and state management. Every line of code has a clear purpose, no framework magic.
>
> It also made the project easier to explain to non-developers, which was important since I might need to present it to people less technical.
>
> That said, if this were production-bound, I'd consider Next.js for better code organization and developer experience."

---

### Q: "Why Supabase instead of raw PostgreSQL?"
**A:**
> "Supabase IS PostgreSQL - it's just hosted with extra features. The assignment asked for PostgreSQL, and Supabase gives me that plus built-in authentication, file storage, and an auto-generated API.
>
> For a 6-8 hour prototype, it saved me 2-3 hours I would've spent building auth and upload handling from scratch. But under the hood, it's real PostgreSQL - I can write SQL, use JSONB columns, set up indexes, all the same.
>
> If this moved to production, I could even migrate to self-hosted PostgreSQL without changing the database structure."

---

### Q: "How did you test this?"
**A:**
> "I created test log files with known patterns. `sample-normal.log` has clean traffic - it should detect 0 anomalies. `sample-attacks.log` has deliberate suspicious patterns - high volume from one IP, failed login attempts, off-hours activity.
>
> I tested each detection rule individually, then end-to-end flows: login, upload, parse, analyze, display. Also tested edge cases like empty files, invalid files, and wrong credentials.
>
> For Phase 2, I tested the database with multiple users to verify Row-Level Security policies - making sure users can only see their own data."

---

### Q: "What would you do differently / what's next?"
**A:**
> "Given more time, I'd add:
>
> **More log formats** - Currently it only handles Apache/Nginx. I'd add support for Windows Event Logs, Syslog, AWS CloudTrail.
>
> **Real machine learning** - Use ML for anomaly types we haven't defined rules for. Unsupervised learning to detect truly novel patterns.
>
> **Real-time analysis** - WebSocket connection for live log streaming and alerts.
>
> **Collaborative features** - Let team members annotate findings and share analyses.
>
> **Better visualization** - Interactive charts showing trends over time, IP geolocation on a map.
>
> But for the scope of this assignment - prove the concept and show explainable anomaly detection - I'm happy with what I built."

---

### Q: "What was the hardest part?"
**A:**
> "Honestly, the confidence score calculations. I wanted them to be meaningful - not arbitrary. For each rule, I had to think: what makes this 70% confident vs 90%?
>
> I ended up basing it on how extreme the deviation is. If an IP makes 2x more requests than average, that's suspicious but could be legitimate - 60% confidence. If it's 10x more, that's almost certainly malicious - 95%.
>
> The goal was to make the scores actually useful for prioritization, not just random numbers."

---

### Q: "How long did this take?"
**A:**
> "About 7 hours total. 5 hours for Phase 1 (the MVP), which got me a fully functional demo with all core features. Then 2 hours to add Supabase for persistence and the history page.
>
> The phased approach was key - it meant I always had something working to show, even if I ran out of time before finishing Phase 2."

---

## Pre-Submission Checklist

### Code Quality
- [ ] All functions have comments explaining what they do
- [ ] No console.log statements left in production code
- [ ] No hardcoded URLs or passwords (use .env)
- [ ] Code is properly indented and readable
- [ ] Variable names are descriptive

### Functionality
- [ ] Can login with demo credentials
- [ ] Can upload and analyze log file
- [ ] All 6 anomaly types detect correctly
- [ ] Results display clearly
- [ ] No errors in browser console
- [ ] Works in Chrome
- [ ] Works in Firefox

### Documentation
- [ ] README.md complete with:
  - [ ] Project description
  - [ ] Screenshot of results page
  - [ ] Setup instructions
  - [ ] How to use
  - [ ] Anomaly detection explained
  - [ ] Tech stack reasoning
  - [ ] Video link
- [ ] Example log files included
- [ ] .gitignore file present

### Phase 2 (if done)
- [ ] Supabase connection works
- [ ] Can signup new users
- [ ] Can login with Supabase
- [ ] Uploads save to database
- [ ] History page works
- [ ] RLS policies prevent cross-user access

### Video
- [ ] 5-10 minutes long
- [ ] Clear audio (no background noise)
- [ ] Shows code walkthrough
- [ ] Shows live demo
- [ ] Explains technical decisions
- [ ] Uploaded and link added to README

### Submission
- [ ] Pushed to GitHub
- [ ] Repository is public
- [ ] Shared with venkata@tenex.ai
- [ ] (Optional) Deployed live
- [ ] (Optional) Live demo link in README

---

## 🚀 You're Ready to Build!

You now have:
- ✅ Complete overview of the project
- ✅ Hour-by-hour task breakdown
- ✅ Detailed specifications for every feature
- ✅ Code examples for core functions
- ✅ Testing plan
- ✅ Video guide
- ✅ Interview preparation

**Everything you need is in this ONE document!**

---

## Quick Command Reference

**Start server:**
```bash
node backend/server.js
```

**Install dependencies:**
```bash
npm install express
npm install @supabase/supabase-js
```

**Create log files:**
```bash
# See examples section in PRD or generate online
```

**Push to GitHub:**
```bash
git init
git add .
git commit -m "LogTrace: Log analysis with anomaly detection"
git remote add origin <your-repo-url>
git push -u origin main
```

---

## Login Credentials (Phase 1)
- Username: `admin` / Password: `password123`
- Username: `analyst` / Password: `soc2024`

---

## Supabase Quick Links
- Dashboard: https://supabase.com/dashboard
- Docs: https://supabase.com/docs
- SQL Editor: In project dashboard → SQL Editor
- Storage: In project dashboard → Storage

---

## Emergency Contact
**Submit to:** venkata@tenex.ai  
**Assignment:** Tenex.ai Full-Stack Cybersecurity Application  
**Timeline:** 6-8 hours  
**Required:** Code + README + Example logs + Video  
**Optional:** Live demo link  

---

**Good luck! You got this! 🎉**

*Remember: Make it work, make it right, make it fast - in that order.*

