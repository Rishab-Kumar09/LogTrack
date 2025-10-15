# 🔒 LogTrack - Cybersecurity Log Analysis Application

A web-based log analysis tool that automatically detects security anomalies in log files with explainable results and confidence scores.

![LogTrack Banner](https://via.placeholder.com/800x200/1e293b/3b82f6?text=LogTrack+-+Security+Log+Analyzer)

## 🎯 Features

- **🔐 Simple Authentication** - Secure login system
- **📤 File Upload** - Drag-and-drop or click to upload `.log` or `.txt` files
- **🧠 AI-Powered Anomaly Detection** - 6 rule-based detection patterns
- **📊 Visual Timeline** - See events and anomalies chronologically
- **🎯 Confidence Scores** - Know how certain each detection is (0-100%)
- **💡 Clear Explanations** - Understand exactly why something was flagged
- **⚠️ Severity Levels** - Color-coded warnings vs critical issues

---

## 🚀 Live Demo

🌐 **Deployed on GitHub Pages:** [https://rishab-kumar09.github.io/LogTrack/](https://rishab-kumar09.github.io/LogTrack/)

**Demo Credentials:**
- Username: `admin` / Password: `password123`
- Username: `analyst` / Password: `soc2024`

---

## 🛠️ Tech Stack

- **Frontend:** HTML5 + CSS3 + Vanilla JavaScript
- **Design:** Dark security theme with responsive layout
- **Deployment:** Netlify (static hosting)
- **Log Format:** Apache/Nginx Combined Log Format

**Why Vanilla JS?**
- ✅ Simple and explainable (no framework complexity)
- ✅ Fast to build and deploy
- ✅ Works in any browser
- ✅ Easy for non-developers to understand

---

## 📥 Local Setup

### Prerequisites
- Any modern web browser (Chrome, Firefox, Safari, Edge)
- No build tools or npm needed!

### Quick Start

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Rishab-Kumar09/LogTrack.git
   cd LogTrack
   ```

2. **Open in browser:**
   - Simply open `index.html` in your browser
   - Or use a simple HTTP server:
     ```bash
     # Python 3
     python -m http.server 8000
     
     # Python 2
     python -m SimpleHTTPServer 8000
     
     # Node.js (if you have http-server installed)
     npx http-server
     ```

3. **Login:**
   - Use demo credentials: `admin` / `password123`

4. **Upload a log file:**
   - Try the example files in `/examples` folder
   - Or upload your own Apache/Nginx log files

---

## 🌐 Deploy to GitHub Pages

### Quick Deploy (Recommended)

1. **Push code to GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit: LogTrack Phase 1"
   git push origin main
   ```

2. **Enable GitHub Pages:**
   - Go to your repo: https://github.com/Rishab-Kumar09/LogTrack
   - Click "Settings" → "Pages" (left sidebar)
   - Under "Source": Select `main` branch and `/ (root)` folder
   - Click "Save"
   - Wait 1-2 minutes for deployment
   - Your site will be live at: https://rishab-kumar09.github.io/LogTrack/

That's it! GitHub Pages auto-deploys on every push to main.

### Alternative: Deploy to Netlify
If you prefer Netlify:
1. Go to [Netlify](https://www.netlify.com/)
2. Drag your folder or connect GitHub repo
3. Deploy (see `DEPLOY.md` for details)

---

## 🧠 How Anomaly Detection Works

LogTrace uses **6 rule-based detection patterns** (not machine learning):

### Rule 1: High Request Volume
**Detects:** One IP making 5x more requests than average

**Example:** 
- Average: 40 requests per IP
- This IP: 250 requests
- **Result:** Flagged with 87% confidence

---

### Rule 2: Multiple Failed Attempts
**Detects:** 5+ failed requests (4xx/5xx errors) from one IP

**Example:**
- IP 192.168.1.50 had 15 failed login attempts
- **Result:** Critical severity, 95% confidence

---

### Rule 3: Unusual Time Activity
**Detects:** 50+ requests during off-hours (1 AM - 5 AM)

**Example:**
- 80 requests at 2 AM
- **Result:** Warning severity, 70% confidence

---

### Rule 4: Suspicious URL Access
**Detects:** Attempts to access `/admin`, `/config`, `/.env`, etc.

**Example:**
- IP tried to access `/wp-admin` and `/.env`
- **Result:** Critical severity, 85% confidence

---

### Rule 5: Large Data Transfer
**Detects:** Single request transferring >10MB

**Example:**
- IP downloaded 15 MB file
- **Result:** Warning severity, 75% confidence

---

### Rule 6: Rapid Sequential Requests
**Detects:** 10+ requests within 10 seconds (bot behavior)

**Example:**
- IP made 20 requests in 5 seconds
- **Result:** Warning severity, 80% confidence

---

## 📂 Project Structure

```
LogTrack/
├── index.html              # Login page
├── upload.html             # File upload page
├── results.html            # Analysis results page
│
├── css/
│   └── style.css           # Dark security theme styling
│
├── js/
│   ├── auth.js             # Authentication logic
│   ├── upload.js           # File reading (FileReader API)
│   ├── parser.js           # Log parsing with regex
│   ├── analyzer.js         # THE CORE - 6 anomaly detection rules
│   └── display.js          # Results rendering
│
├── examples/
│   ├── sample-normal.log   # Clean log (no anomalies)
│   └── sample-attacks.log  # Log with attacks (triggers all 6 rules)
│
├── .cursorrules            # AI assistant context
├── PROJECT-GUIDE.md        # Complete project documentation
└── README.md               # This file
```

---

## 🧪 Test Files

### `sample-normal.log`
- 30 entries
- Clean traffic
- **Expected:** 0 anomalies detected

### `sample-attacks.log`
- 200+ entries
- Contains deliberate attack patterns
- **Expected:** 6 anomalies detected:
  - High request volume from 192.168.1.111
  - Failed login attempts from 192.168.1.50
  - Off-hours activity at 2 AM
  - Suspicious URL access from 192.168.1.75
  - Large data transfer from 192.168.1.99
  - Rapid requests from 192.168.1.88

---

## 💡 Usage Guide

### Step 1: Login
1. Open the app
2. Enter demo credentials:
   - Username: `admin`
   - Password: `password123`
3. Click "Login"

### Step 2: Upload Log File
1. Drag and drop a `.log` file, or click "Choose File"
2. Supported formats: Apache/Nginx Combined Log Format
3. Max size: 10 MB
4. Click "Analyze Log File"

### Step 3: View Results
- **Summary Stats:** Total events, unique IPs, time range
- **Timeline:** Visual representation with anomaly markers
- **Anomaly Cards:** Detailed cards for each detection
  - Type and icon
  - Confidence percentage
  - Plain English explanation
  - Relevant details (IP, URLs, counts)
  - Severity (color-coded)

### Step 4: Interpret Results
- **Red border = Critical** - Investigate immediately
- **Yellow border = Warning** - Review when possible
- **High confidence (85%+)** - Very likely an issue
- **Medium confidence (70-84%)** - Worth investigating
- **Low confidence (<70%)** - Could be legitimate

---

## 🎥 Video Walkthrough

[Link to video walkthrough - Required for submission]

---

## 🔮 Future Enhancements

### Phase 2 (Planned):
- **Supabase Integration** - User signup, persistent storage
- **Upload History** - View past analyses
- **Multi-user Support** - Separate data per user

### Phase 3 (Ideas):
- **Multiple Log Formats** - Windows Event Logs, Syslog, AWS CloudTrail
- **Export Results** - PDF/CSV export
- **Real-time Analysis** - WebSocket streaming
- **Machine Learning** - Add ML for unknown patterns
- **Collaborative Features** - Annotate findings, share with team
- **IP Geolocation** - Show attack origins on map

---

## 🧑‍💻 Development

### Architecture
This is a **fully client-side application** (perfect for Netlify):
- All processing happens in the browser
- FileReader API reads files locally
- No backend server needed for Phase 1
- SessionStorage for temporary data

### Code Philosophy
- **Simplicity First:** Vanilla JS, no build tools
- **Explainable Logic:** Every function has clear comments
- **Rule-Based Detection:** Transparent, deterministic
- **Responsive Design:** Works on desktop and tablet

### Adding New Detection Rules
1. Open `js/analyzer.js`
2. Add a new function following the existing pattern:
   ```javascript
   function detectYourNewRule(entries) {
       const anomalies = [];
       // Your detection logic here
       return anomalies;
   }
   ```
3. Call it in `analyzeLog()` function
4. Test with custom log file

---

## 📊 Log Format

LogTrace expects Apache/Nginx Combined Log Format:

```
IP - - [timestamp] "METHOD URL HTTP/x.x" status bytes
```

**Example:**
```
192.168.1.1 - - [15/Oct/2025:10:23:45 +0000] "GET /api/users HTTP/1.1" 200 1234
```

**Extracted Fields:**
- `192.168.1.1` - IP address
- `15/Oct/2025:10:23:45 +0000` - Timestamp
- `GET` - HTTP method
- `/api/users` - URL path
- `200` - Status code
- `1234` - Bytes transferred

---

## ❓ FAQ

**Q: Does this work offline?**  
A: Yes! Once loaded, it works completely offline. The file is read locally in your browser.

**Q: Is my log data sent to a server?**  
A: No. In Phase 1, all processing happens in your browser. Your data never leaves your computer.

**Q: What browsers are supported?**  
A: All modern browsers: Chrome, Firefox, Safari, Edge. Requires FileReader API support (all browsers since 2012).

**Q: Can I use this for production security monitoring?**  
A: This is a prototype/demo. For production, you'd want server-side processing, proper databases, and real-time monitoring.

**Q: Why not machine learning?**  
A: Rule-based detection is explainable, deterministic, and fast. You know exactly why something was flagged. ML can be added later for unknown patterns.

**Q: Can I upload multiple files at once?**  
A: Currently one file at a time. Phase 2 will support batch processing.

---

## 🤝 Contributing

This is an assignment project for Tenex.ai, but suggestions are welcome!

---

## 📜 License

This project is created as part of a technical assessment for Tenex.ai.

---

## 👤 Author

**Rishab Kumar**  
GitHub: [@Rishab-Kumar09](https://github.com/Rishab-Kumar09)  
Assignment for: Tenex.ai Full-Stack Cybersecurity Application  
Date: October 2025  

---

## 🙏 Acknowledgments

- Apache/Nginx log format documentation
- MDN Web Docs for FileReader API
- Netlify for easy static hosting

---

**Built with planning, coded with care, deployed with confidence!** 🚀

