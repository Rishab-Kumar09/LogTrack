# 🌐 Universal Log Parser Guide

LogTrack now supports **multiple log formats** with AI-powered fallback parsing!

---

## 🎯 Supported Formats

### ✅ Built-in Support (No API key needed):

1. **Apache/Nginx Combined Format**
   ```
   192.168.1.1 - - [16/Oct/2024:10:23:45 +0000] "GET /api HTTP/1.1" 200 1234
   ```

2. **JSON Logs**
   ```json
   {"ip":"192.168.1.1","timestamp":"2024-10-16T10:23:45Z","method":"GET","url":"/api","status":200,"bytes":1234}
   ```

3. **W3C Extended Log Format**
   ```
   #Fields: date time c-ip cs-method cs-uri-stem sc-status sc-bytes
   2024-10-16 10:23:45 192.168.1.1 GET /api 200 1234
   ```

4. **Syslog Format**
   ```
   Oct 16 10:23:45 server1 httpd: "GET /api HTTP/1.1" 200
   ```

5. **IIS Logs**
   ```
   #Fields: date time c-ip cs-method cs-uri-stem sc-status sc-bytes
   2024-10-16 10:23:45 192.168.1.1 GET /api 200 1234
   ```

---

## 🤖 AI-Powered Parsing (For Unknown Formats)

When LogTrack encounters an unknown format, it can use **ChatGPT** to intelligently parse it!

### How it works:
1. LogTrack detects the format is unknown
2. If you provide an OpenAI API key, it sends a sample to GPT
3. GPT analyzes and extracts structured data
4. LogTrack applies the pattern to your full log file

### Getting an API Key:

1. Go to https://platform.openai.com/api-keys
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the key (starts with `sk-...`)
5. **Cost:** ~$0.001-0.01 per log file (very cheap!)

### Using the API Key:

1. Upload your log file
2. Click "🤖 Optional: OpenAI API Key" to expand
3. Paste your API key (it's not stored anywhere!)
4. Click "Analyze Log File"
5. Done! ✨

---

## 📊 Format Detection

LogTrack automatically detects your log format by analyzing:
- File structure
- Pattern matching
- Common log signatures

You'll see the detected format under your filename:
```
Format: Apache/Nginx ✅
Format: JSON Logs ✅  
Format: Unknown (will use AI if key provided) ⚠️
```

---

## 🎯 Examples by Format

### Apache/Nginx (Built-in) ✅
**Use our sample files:** `examples/sample-attacks.log`

**Or download from web:**
- Most common format
- Works without API key

---

### JSON Logs (Built-in) ✅

**Example file you can create:**
```json
{"ip":"192.168.1.100","timestamp":"2024-10-16T08:15:23Z","method":"GET","url":"/index.html","status":200,"bytes":2326}
{"ip":"192.168.1.200","timestamp":"2024-10-16T08:15:30Z","method":"POST","url":"/api/login","status":401,"bytes":234}
{"ip":"192.168.1.200","timestamp":"2024-10-16T08:15:31Z","method":"POST","url":"/api/login","status":401,"bytes":234}
```

Save as `test.json` and upload!

---

### Custom/Unknown Formats (Requires API Key) 🤖

**Example - Custom CSV-like format:**
```
IP,Time,Action,Status
192.168.1.1,08:15:23,page_view,ok
192.168.1.2,08:15:30,login_attempt,fail
192.168.1.2,08:15:31,login_attempt,fail
```

Just provide your OpenAI API key and LogTrack will parse it! ✨

---

## 💡 Tips & Tricks

### For Best Results:

1. **Clean data** - Remove headers/footers if possible
2. **Consistent format** - All lines should follow same structure
3. **Sample first** - Test with a small file first (100-500 lines)
4. **Known formats** - Use built-in formats when possible (faster & free!)

### Troubleshooting:

**"No valid log entries found"**
- Check your log format
- Try providing an API key
- Ensure file isn't empty

**"API request failed"**
- Check your API key is valid
- Ensure you have OpenAI credits
- Try a smaller file first

**Format shows "Unknown"**
- This is okay! Just provide an API key
- Or convert to a supported format

---

## 🔒 Privacy & Security

### Your Data:
- ✅ All parsing happens in your browser (for built-in formats)
- ✅ Only a small sample (20 lines) is sent to OpenAI for unknown formats
- ✅ API keys are NOT stored anywhere
- ✅ Results stay in your browser session
- ✅ No data is saved on our servers

### Best Practices:
- 🔒 Don't upload logs with real user data
- 🔒 Use test/anonymized logs for demos
- 🔒 Your API key is only used for that one request

---

## 📖 Technical Details

### Detection Logic:
```javascript
1. Check for JSON structure → JSON Parser
2. Check for W3C headers (#Fields:) → W3C Parser
3. Check for Apache pattern (IP - - [...]) → Apache Parser
4. Check for Syslog pattern (Month Day Time) → Syslog Parser
5. Check for IIS pattern → IIS Parser
6. Else → Unknown (use ChatGPT if API key provided)
```

### Normalization:
All parsers output a standard format:
```javascript
{
  ip: "192.168.1.1",
  timestamp: "2024-10-16T10:23:45Z",
  method: "GET",
  url: "/api",
  statusCode: 200,
  bytes: 1234,
  date: Date object,
  hour: 10
}
```

This allows the anomaly detection to work consistently across all formats!

---

## 🚀 What's Next?

Future enhancements:
- [ ] More built-in formats (Cloudflare, AWS ELB, etc.)
- [ ] Format conversion tools
- [ ] Custom parser rules (no-code)
- [ ] Batch file processing

---

## ❓ FAQ

**Q: Do I need an API key for Apache logs?**
A: No! Apache/Nginx logs work out of the box.

**Q: How much does the OpenAI API cost?**
A: Very little! Usually $0.001-0.01 per log file.

**Q: Can I use this offline?**
A: Yes, for built-in formats (Apache, JSON, etc.). Unknown formats need internet for AI parsing.

**Q: What if I don't have an API key?**
A: Stick to supported formats! We provide examples that work without any API key.

**Q: Is my API key stored?**
A: NO! It's only used for that single request and immediately discarded.

---

Happy Parsing! 🎉

For more help, see:
- `README.md` - Main documentation
- `REAL-LOG-SOURCES.md` - Where to find real log files
- `examples/README.md` - Test file explanations

