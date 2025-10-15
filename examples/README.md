# LogTrack Test Log Files

This folder contains various log files to test different scenarios in the LogTrack application.

## 📁 Available Test Files

### 1. **sample-normal.log** ✅
**Purpose:** Clean log file with no anomalies  
**Expected Results:**
- Should show 0 anomalies detected
- Normal traffic patterns
- Good for baseline testing

---

### 2. **sample-attacks.log** 🚨
**Purpose:** Triggers ALL 6 anomaly detection rules  
**Expected Anomalies:**
1. ✅ High Request Volume (192.168.1.50)
2. ✅ Multiple Failed Attempts (192.168.1.50)
3. ✅ Unusual Time Activity (middle of night)
4. ✅ Suspicious URL Access (/admin, /.env, etc.)
5. ✅ Large Data Transfer (>10MB downloads)
6. ✅ Rapid Sequential Requests (10+ in 10 seconds)

**Best for:** Comprehensive testing of all detection rules

---

### 3. **realistic-normal-day.log** 📊
**Purpose:** Simulates a normal business day  
**What's Inside:**
- 30 entries from different IPs
- Various page visits (products, blog, contact, etc.)
- Normal traffic spread over ~45 minutes
- Mix of GET and POST requests
- No anomalies

**Best for:** Testing with clean, realistic data

---

### 4. **sql-injection-attack.log** 💉
**Purpose:** SQL injection attempt  
**What's Inside:**
- IP 192.168.1.50 trying SQL injection
- Multiple malicious URL patterns:
  - `' OR '1'='1`
  - `UNION SELECT`
  - `DROP TABLE`
  - Admin bypass attempts
- Multiple 500 errors (failed attempts)
- Normal traffic mixed in from other IPs

**Expected Anomalies:**
- ✅ Multiple Failed Attempts (IP 192.168.1.50)
- ✅ Suspicious URL Access (admin paths)

**Best for:** Testing suspicious URL and failed attempt detection

---

### 5. **brute-force-attack.log** 🔐
**Purpose:** Brute force login attack  
**What's Inside:**
- IP 192.168.1.75 making rapid login attempts
- 26 failed login attempts in 25 seconds
- Using automated tool (python-requests)
- Late night activity (22:15)
- Finally succeeds on last attempt
- Normal traffic from other IPs

**Expected Anomalies:**
- ✅ Multiple Failed Attempts (26 401 errors)
- ✅ Rapid Sequential Requests (26 in 25 seconds)
- ✅ Unusual Time Activity (late night)
- ✅ High Request Volume (1 IP making many requests)

**Best for:** Testing brute force detection logic

---

### 6. **data-exfiltration.log** 📦
**Purpose:** Data theft scenario  
**What's Inside:**
- IP 192.168.1.88 downloading large amounts of data
- Accessing sensitive endpoints at 3 AM:
  - Database exports
  - User data (CSV, JSON)
  - Full database backup
  - Config files
  - .env file
- Large data transfers (10+ MB)
- Suspicious URL access

**Expected Anomalies:**
- ✅ Large Data Transfer (multiple >10MB downloads)
- ✅ Unusual Time Activity (3 AM access)
- ✅ Suspicious URL Access (/.env, /admin/config)
- ✅ High Request Volume (many requests from one IP)

**Best for:** Testing data exfiltration detection

---

### 7. **mixed-scenario.log** 🌀
**Purpose:** Multiple attack types in one log  
**What's Inside:**
- Normal users browsing (IPs 192.168.1.100-112)
- Attacker IP 192.168.1.200 trying:
  - Admin panel access attempts
  - Sensitive file searches (/.env, config.php)
  - WordPress/phpMyAdmin scanning
  - Brute force login (6 attempts)
  - SQL injection attempts
  - XSS attempts
- Mix of 200, 403, 404, 401, 500 status codes

**Expected Anomalies:**
- ✅ Multiple Failed Attempts (192.168.1.200)
- ✅ Suspicious URL Access (admin, config, .env)

**Best for:** Real-world scenario testing

---

## 🧪 Testing Strategy

### For Quick Testing:
1. Start with `sample-normal.log` (should be clean)
2. Then try `sample-attacks.log` (should trigger all 6 rules)

### For Demo/Presentation:
1. **Clean baseline:** `realistic-normal-day.log`
2. **Show detection:** `brute-force-attack.log`
3. **Complex scenario:** `data-exfiltration.log`

### For Comprehensive Testing:
Test all files to ensure each detection rule works correctly in different contexts.

---

## 📝 Log Format

All logs follow **Apache/Nginx Combined Log Format**:
```
IP - - [timestamp] "METHOD /path HTTP/1.1" STATUS BYTES "-" "User-Agent"
```

Example:
```
192.168.1.50 - - [16/Oct/2024:14:23:12 +0000] "GET /products HTTP/1.1" 200 5432 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
```

---

## 💡 Pro Tips

1. **Clear your session** between tests (logout and login again)
2. **Use hard refresh** (Ctrl+Shift+R) if results look cached
3. **Check console** (F12) for any errors
4. **Compare results** between different files to see how detection varies

---

## 🎯 Expected Anomaly Counts

| File | Expected Anomalies |
|------|-------------------|
| sample-normal.log | 0 |
| sample-attacks.log | ~18 |
| realistic-normal-day.log | 0 |
| sql-injection-attack.log | ~3-5 |
| brute-force-attack.log | ~4-6 |
| data-exfiltration.log | ~4-6 |
| mixed-scenario.log | ~2-4 |

*Note: Exact counts may vary based on thresholds*

---

Happy Testing! 🚀

