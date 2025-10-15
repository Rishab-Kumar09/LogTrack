# 🌐 Real Log Files from the Web

Here are publicly available **real log files** you can download and test with LogTrack:

---

## 🔥 Quick Downloads (Recommended)

### 1. **GitHub - Sample Log Files Collection**
**Link:** https://github.com/thilak99/sample_log_files  
**What's Inside:**
- Apache access logs
- System logs
- Application logs
- Error logs

**How to Download:**
1. Go to the GitHub repo
2. Click "Code" → "Download ZIP"
3. Extract and find `.log` files
4. Upload to LogTrack!

---

### 2. **Sample.net - Business Log Samples**
**Link:** https://www.sample.net/business/log/log/  
**What's Inside:**
- Activity logs
- Error logs
- Security logs
- Server logs

**How to Download:**
1. Visit the website
2. Browse through available samples
3. Click download on any `.log` file
4. Test in LogTrack!

---

### 3. **Webtrends - NCSA Combined Log Sample**
**Link:** https://kb.webtrends.com/information/sample-log-file-ncsa-combined-extended-log-file/  
**What's Inside:**
- Real NCSA Combined format (compatible with LogTrack!)
- Web server access logs
- Production-like data

**How to Use:**
1. Visit the page
2. Copy the log content shown
3. Save as `.log` file on your computer
4. Upload to LogTrack!

---

## 🎓 Educational Datasets

### 4. **Microsoft HDInsight Sample Logs**
**Link:** https://www.microsoft.com/en-us/download/details.aspx?id=37003  
**What's Inside:**
- Large-scale log files
- Real production scenarios
- Good for performance testing

---

## 🔍 Security-Focused Logs

### 5. **SANS Internet Storm Center - Sample Logs**
**Link:** https://isc.sans.edu/tools/  
**What's Inside:**
- Security event logs
- Attack patterns
- Firewall logs

**Note:** Some may need conversion to Apache format

---

## 💡 How to Use These Files:

### Step 1: Download
- Click any link above
- Download the `.log` file to your computer
- Save it somewhere easy to find (like `Downloads/`)

### Step 2: Check Format
LogTrack expects **Apache/Nginx Combined Log Format**:
```
IP - - [timestamp] "METHOD /path HTTP/1.1" STATUS BYTES "-" "User-Agent"
```

If the file format looks different, you might need to:
- Try a different file from the source
- Or stick with our custom test files in `examples/`

### Step 3: Test
1. Go to https://log-track.netlify.app
2. Login (admin/password123)
3. Upload the downloaded file
4. Check results!

---

## 🚨 If Files Don't Work:

Some real-world logs might:
- Have different formats (W3C, IIS, etc.)
- Be too large (>5MB might be slow)
- Have encoding issues

**Solution:** Use our curated test files in `examples/` folder - they're guaranteed to work! ✅

---

## 📦 Alternative: Generate Your Own

If you have access to a web server, you can also:

### Apache Server:
```bash
# Access logs usually in:
/var/log/apache2/access.log
```

### Nginx Server:
```bash
# Access logs usually in:
/var/log/nginx/access.log
```

### Local Development Server:
If you run a local server (XAMPP, WAMP, MAMP), check:
- `C:\xampp\apache\logs\access.log` (Windows)
- `/Applications/XAMPP/logs/access.log` (Mac)

---

## ⚠️ Important Notes:

1. **Privacy:** Never upload logs containing real user data or sensitive information!
2. **Format:** LogTrack is designed for Apache/Nginx combined format
3. **Size:** Keep files under 1-2MB for best performance
4. **Test First:** Always test with our sample files first to ensure the app works

---

## 🎯 Recommended Testing Path:

1. **Start Local:** Use `examples/realistic-normal-day.log` (you know it works!)
2. **Try Public Data:** Download from GitHub sample_log_files repo
3. **Compare Results:** See how real vs synthetic logs differ
4. **Demo Ready:** Use curated examples for presentations

---

## 🔗 Quick Links Summary:

| Source | Type | Link |
|--------|------|------|
| GitHub Sample Logs | General | https://github.com/thilak99/sample_log_files |
| Sample.net | Business Logs | https://www.sample.net/business/log/log/ |
| Webtrends | NCSA Combined | https://kb.webtrends.com/information/sample-log-file-ncsa-combined-extended-log-file/ |
| Microsoft Learn | System Logs | https://learn.microsoft.com/en-us/previous-versions/windows/desktop/indexsrv/sample-log-file |

---

**Happy Testing!** 🚀

If you find any great sources, add them here! 📝

