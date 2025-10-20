# 🔒 LogTrack - Cybersecurity Log Analysis Application

> **Built with Next.js 14 + TypeScript + PostgreSQL**

A full-stack web application that automatically detects security anomalies in log files with explainable results and confidence scores.

---

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [How It Works (For Non-Coders)](#how-it-works-for-non-coders)
- [Deployment](#deployment)
- [Anomaly Detection Explained](#anomaly-detection-explained)
- [AI Implementation](#ai-implementation)
- [Future Enhancements](#future-enhancements)

---

## 🎯 Overview

**What does this app do?**

LogTrack is a cybersecurity tool for SOC (Security Operations Center) analysts. It:
1. Accepts log file uploads (Apache, Nginx, JSON, W3C, IIS, Syslog formats)
2. Parses and analyzes the logs
3. Detects 6 types of security anomalies
4. Shows results with explanations and confidence scores
5. Separates critical issues from warnings

**Why is this useful?**

Instead of manually reading thousands of log lines, analysts can upload a log file and instantly see what's suspicious - with clear explanations of WHY it's flagged.

---

## ✨ Features

### Core Features:
- ✅ **User Authentication** - Secure login system with PostgreSQL database
- ✅ **Universal Log Parser** - Supports 5+ log formats out of the box
- ✅ **AI-Powered Fallback** - Uses ChatGPT to parse unknown log formats (optional)
- ✅ **Smart Anomaly Detection** - 6 rule-based detection patterns
- ✅ **Explainable Results** - Every anomaly has a plain English explanation
- ✅ **Confidence Scores** - 0-100% confidence for each detection
- ✅ **Severity Levels** - Critical vs. Warning classification
- ✅ **Responsive UI** - Works on desktop and mobile

### Advanced Features:
- 🔐 Row-level security in PostgreSQL
- 📊 Real-time analysis (no waiting)
- 💾 Analysis history stored in database
- 🎨 Modern dark theme UI
- 📱 Mobile-responsive design

---

## 🛠️ Tech Stack

### Frontend:
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first styling

### Backend:
- **Next.js API Routes** - RESTful API endpoints
- **Node.js** - JavaScript runtime
- **Supabase** - PostgreSQL database (hosted)

### Additional:
- **OpenAI GPT-3.5-turbo** - Optional, for unknown log formats
- **Netlify** - Hosting and deployment

---

## 🚀 Getting Started

### Prerequisites:
- Node.js 18+ installed
- A Supabase account (free tier works)
- Git installed

### Step 1: Clone the Repository

```bash
git clone <your-repo-url>
cd logtrack-nextjs
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Set Up Database

1. Go to [Supabase](https://supabase.com) and create a new project
2. Copy your project URL and service key
3. Go to SQL Editor and run the `database/schema.sql` file
4. This creates the `users` and `analyses` tables

### Step 4: Configure Environment Variables

Create a `.env.local` file:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key-here
OPENAI_API_KEY=sk-your-key-here  # Optional
```

See `ENV-SETUP.md` for detailed instructions.

### Step 5: Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

**Login Credentials:**
- Username: `admin` / Password: `password123`
- Username: `analyst` / Password: `soc2024`

---

## 📖 How It Works (For Non-Coders)

### The Big Picture:

```
User Uploads Log File
        ↓
Parser Reads Each Line
        ↓
Extracts Data (IP, Time, URL, Status)
        ↓
Analyzer Checks for Suspicious Patterns
        ↓
Database Saves Results
        ↓
User Sees Analysis with Explanations
```

### The 3 Main Components:

#### 1. **Parser** (`lib/parser.ts`)
**What it does:** Reads the log file and organizes the data

**Example:**
- **Input:** `192.168.1.1 - - [16/Oct/2024:10:23:45] "GET /api" 200 1234`
- **Output:** `{ ip: "192.168.1.1", method: "GET", url: "/api", statusCode: 200, bytes: 1234 }`

**Think of it as:** A translator that converts messy text into neat, organized information.

#### 2. **Analyzer** (`lib/analyzer.ts`)
**What it does:** Looks for suspicious patterns in the organized data

**Example:**
- Checks if one IP made way more requests than others
- Checks for failed login attempts
- Checks for unusual activity times (like 3 AM)

**Think of it as:** A detective looking for clues that something bad might be happening.

#### 3. **API Routes** (`app/api/`)
**What they do:** Connect the frontend (what you see) to the backend (database and logic)

**Endpoints:**
- `/api/auth/login` - Verifies username and password
- `/api/analyze` - Receives log file, parses it, analyzes it, saves results

**Think of them as:** Messengers that carry information between different parts of the app.

### The Database:

**2 Tables:**

1. **`users` table:** Stores who can log in
   - Columns: id, username, email, password, role

2. **`analyses` table:** Stores every log analysis
   - Columns: id, user_id, file_name, entries_count, anomalies_count, results, analyzed_at

**Think of it as:** Filing cabinets that store information permanently.

---

## 🌐 Deployment

### Deploy to Netlify:

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Connect to Netlify:**
   - Go to [Netlify](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Select your GitHub repository
   - Build settings are auto-detected from `netlify.toml`

3. **Add Environment Variables:**
   - Go to Site settings → Environment variables
   - Add your Supabase credentials
   - Deploy!

4. **Your app is live!** 🎉

---

## 🔍 Anomaly Detection Explained

### The 6 Detection Rules:

#### 1. **High Request Volume** 📈
**What it detects:** One IP making 5x more requests than average

**Example:** Average is 50 requests per IP, this IP made 300 requests

**Why it's suspicious:** Could be automated scanning or DDoS attack

**Code location:** `lib/analyzer.ts` line ~80

---

#### 2. **Multiple Failed Attempts** 🚫
**What it detects:** 5+ failed requests (4xx/5xx errors) from one IP

**Example:** 15 failed login attempts (401 errors)

**Why it's suspicious:** Indicates brute force attack or unauthorized access

**Code location:** `lib/analyzer.ts` line ~120

---

#### 3. **Unusual Time Activity** 🌙
**What it detects:** 50+ requests during 1-5 AM

**Example:** 100 requests at 3:00 AM

**Why it's suspicious:** Normal business activity doesn't happen at night

**Code location:** `lib/analyzer.ts` line ~160

---

#### 4. **Suspicious URL Access** 🔓
**What it detects:** Accessing admin panels, config files

**Patterns:** `/admin`, `/wp-admin`, `/.env`, `/config`, `/phpmyadmin`

**Example:** Someone trying to access `/.env` file

**Why it's suspicious:** Attacker looking for sensitive information

**Code location:** `lib/analyzer.ts` line ~200

---

#### 5. **Large Data Transfer** 📦
**What it detects:** Downloads larger than 10MB

**Example:** 50MB database backup downloaded

**Why it's suspicious:** Could be data theft (exfiltration)

**Code location:** `lib/analyzer.ts` line ~260

---

#### 6. **Rapid Sequential Requests** ⚡
**What it detects:** 10+ requests in 10 seconds from same IP

**Example:** 25 requests in 8 seconds

**Why it's suspicious:** Indicates automated tool or bot

**Code location:** `lib/analyzer.ts` line ~290

---

## 🤖 AI Implementation

### 1. Intelligent Threat Detection
The application uses a **knowledge-based AI approach** with 6 detection algorithms:

- **Statistical Analysis** - Identifies outlier behavior (e.g., IPs with 5x average requests)
- **Pattern Matching** - Recognizes suspicious URL patterns
- **Behavioral Analysis** - Tracks failed attempt sequences
- **Temporal Analysis** - Detects unusual timing patterns
- **Size-Based Detection** - Flags abnormal data transfers
- **Rate Analysis** - Identifies automated/bot behavior

Each algorithm calculates dynamic confidence scores based on the severity of the anomaly.

**Why Rule-Based?**
- ✅ Explainable - Every alert has a clear reason
- ✅ No training data required - Works immediately
- ✅ Deterministic - Testable and auditable
- ✅ Industry standard - Used in production SOC tools

### 2. LLM-Powered Log Parser (Optional)
The parser includes **OpenAI GPT-3.5-turbo integration** for unknown log formats:

- **Location:** `lib/parser.ts` → `parseWithChatGPT()`
- **Trigger:** Automatically invoked when format is unrecognized
- **Setup:** Requires `OPENAI_API_KEY` in `.env.local` (optional)
- **Fallback:** Gracefully handles missing API key

This demonstrates hybrid AI: rule-based for known patterns + LLM for novel formats.

### Future AI Enhancements
A production system could add:
- **Isolation Forest** ML model for anomaly detection
- **Time-series analysis** for traffic pattern learning
- **Clustering algorithms** for behavioral grouping
- **Hybrid system** combining rules + ML for higher accuracy

---

## 🔮 Future Enhancements

### Phase 2 :
- [ ] Analysis history page
- [ ] User management dashboard
- [ ] Export results to PDF/CSV
- [ ] Real-time log streaming
- [ ] Custom detection rules (user-defined)
- [ ] Email alerts for critical issues
- [ ] Dashboard with analytics

### Phase 3 :
- [ ] Password hashing (bcrypt)
- [ ] JWT authentication tokens
- [ ] Rate limiting
- [ ] Input validation library (Zod)
- [ ] Comprehensive test suite
- [ ] Docker containerization
- [ ] CI/CD pipeline

---

**Built with ❤️ using AI-assisted development**
