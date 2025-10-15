# ⚡ Quick Test Guide for LogTrace

Test your app locally before deploying!

---

## 🧪 Local Testing (Before Netlify)

### Option 1: Direct File Open
1. Navigate to your LogTrace folder
2. Double-click `index.html`
3. It opens in your default browser
4. **Note:** File uploads might not work with `file://` protocol

### Option 2: Simple HTTP Server (Recommended)

**Using Python (built-in on Mac/Linux, easy on Windows):**
```bash
# Navigate to LogTrace folder
cd LogTrace

# Python 3 (most common)
python -m http.server 8000

# Python 2 (if Python 3 not available)
python -m SimpleHTTPServer 8000

# Open browser:
http://localhost:8000
```

**Using Node.js:**
```bash
# One-time install
npm install -g http-server

# Run
http-server

# Open browser:
http://localhost:8080
```

**Using VS Code:**
1. Install "Live Server" extension
2. Right-click `index.html`
3. Select "Open with Live Server"

---

## ✅ Test Checklist

### Test 1: Login Page
- [ ] Page loads without errors
- [ ] Dark theme looks good
- [ ] Demo credentials are visible
- [ ] Enter `admin` / `password123`
- [ ] Click "Login"
- [ ] **Expected:** Redirects to upload.html

### Test 2: Upload Page  
- [ ] Upload page shows navbar with username "admin"
- [ ] Logout button visible
- [ ] Upload zone displays
- [ ] Click "Choose File"
- [ ] Select `examples/sample-normal.log`
- [ ] File name and size appear
- [ ] Click "Analyze Log File"
- [ ] Loading spinner appears
- [ ] **Expected:** Redirects to results.html

### Test 3: Results - Normal Log
- [ ] Summary stats show:
  - Total Events: 30
  - Unique IPs: ~6-7
  - Anomalies Found: 0
- [ ] See "✅ No anomalies detected! This log looks clean."
- [ ] Timeline displays
- [ ] Can expand "Detailed Event Log"
- [ ] Logout button works

### Test 4: Upload Attacks Log
- [ ] Click "New Analysis" button
- [ ] Upload `examples/sample-attacks.log`
- [ ] Click "Analyze Log File"
- [ ] **Expected:** Redirects to results

### Test 5: Results - Attack Log
- [ ] Summary stats show:
  - Total Events: ~150-200
  - Anomalies Found: 6
  - Critical Issues: ~2-3
  - Warnings: ~3-4
- [ ] See 6 anomaly cards:
  1. ⚠️ Multiple Failed Attempts (192.168.1.50)
  2. ⚠️ Suspicious URL Access (192.168.1.75)
  3. ⚠️ Rapid Sequential Requests (192.168.1.88)
  4. ⚠️ Large Data Transfer (192.168.1.99)
  5. ⚠️ High Request Volume (192.168.1.111)
  6. ⚠️ Unusual Time Activity (2 AM)
- [ ] Each card has:
  - Type with icon
  - Confidence percentage
  - Explanation text
  - Relevant details
  - Color-coded severity
- [ ] Red cards = critical
- [ ] Yellow cards = warning
- [ ] Timeline shows markers
- [ ] Red/yellow dots on timeline for anomalies

### Test 6: Navigation
- [ ] Click "New Analysis" → goes to upload.html
- [ ] Click "Logout" → goes to index.html
- [ ] Try accessing `upload.html` directly (type in URL bar) without logging in
- [ ] **Expected:** Redirects to login

### Test 7: Edge Cases
- [ ] Try empty file → shows error
- [ ] Try very large file (>10MB) → shows size error
- [ ] Try wrong login credentials → shows error message
- [ ] Test on different browser (Chrome, Firefox, Safari)

### Test 8: Console Check
- [ ] Open browser DevTools (F12)
- [ ] Go to Console tab
- [ ] Upload and analyze a file
- [ ] **Expected:** See logs like:
  - "📄 File read successfully..."
  - "✅ Parsed X entries"
  - "✅ Found X anomalies"
  - No red errors!

### Test 9: Mobile/Responsive
- [ ] Resize browser window to mobile size (375px width)
- [ ] Layout adjusts nicely
- [ ] All buttons clickable
- [ ] Text readable
- [ ] Cards stack vertically

---

## 🐛 Common Issues & Fixes

### Issue: "Cannot read file"
**Fix:** Use HTTP server (option 2 above), not direct file open

### Issue: Nothing happens when clicking Analyze
**Fix:** 
- Check browser console for errors
- Verify all JS files are in `js/` folder
- Check file paths in HTML

### Issue: Logout redirects to wrong page
**Fix:** 
- Check `auth.js` line with `window.location.href = 'index.html'`
- Make sure index.html is in root folder

### Issue: Results page blank
**Fix:**
- Check if results are in sessionStorage (DevTools → Application → Session Storage)
- Verify `display.js` is loaded
- Check console for errors

### Issue: CSS not loading
**Fix:**
- Verify `css/style.css` exists
- Check `<link>` tag in HTML files
- Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)

---

## 📊 Expected Console Output

When analyzing `sample-attacks.log`, you should see:

```
📄 File read successfully, starting analysis...
✅ Successfully parsed 150 log entries (skipped 0)
🔍 Starting anomaly detection on 150 entries...
🚨 Rule 1: High volume from 192.168.1.111 (40 requests, 8.0x avg)
🚨 Rule 2: Failed attempts from 192.168.1.50 (15 failures)
🚨 Rule 3: Off-hours activity at 2:00 (60 requests)
🚨 Rule 4: Suspicious URL access from 192.168.1.75 (/admin)
🚨 Rule 5: Large transfer from 192.168.1.99 (15.00 MB)
🚨 Rule 6: Rapid requests from 192.168.1.88 (11 in 9.0s)
✅ Anomaly detection complete: Found 6 anomalies
✅ Found 6 anomalies
✅ Analysis complete, redirecting to results...
📊 Displaying results: {entries: 150, anomalies: 6}
```

---

## ✅ All Tests Passed?

If all tests pass, you're ready to deploy to Netlify! 🚀

**Next steps:**
1. Read `DEPLOY.md` for deployment instructions
2. Deploy to Netlify
3. Test the deployed version (same checklist)
4. Update README.md with your Netlify URL
5. Record video walkthrough
6. Submit!

---

**Happy Testing! 🎉**

