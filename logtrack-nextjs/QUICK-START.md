# ⚡ Quick Start Guide - Get Running in 5 Minutes!

## 🎯 For the Impatient Developer

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# 3. Run development server
npm run dev

# 4. Open browser
# http://localhost:3000

# 5. Login
# Username: admin
# Password: password123
```

---

## 📦 What You Get

After following the quick start, you'll have:

✅ **Login page** at http://localhost:3000  
✅ **Upload page** with drag-drop file upload  
✅ **Results page** with anomaly detection  
✅ **Database** connection (if Supabase configured)  
✅ **7 example log files** in `/examples` folder  

---

## 🔧 Required Setup (One-Time)

### 1. Supabase Database (Free)

1. Go to https://supabase.com
2. Create new project
3. Copy URL and service key to `.env.local`
4. Run SQL schema (in `database/schema.sql`)

**Time:** 3 minutes

### 2. Environment Variables

Create `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-key-here
```

**Time:** 1 minute

---

## 🧪 Test It Works

1. **Start dev server:** `npm run dev`
2. **Open:** http://localhost:3000
3. **Login:** admin / password123
4. **Upload:** Use `examples/sample-attacks.log`
5. **See results:** Should show ~18 anomalies

---

## 📁 Project Structure (What Goes Where)

```
logtrack-nextjs/
├── app/
│   ├── page.tsx              ← Login page
│   ├── upload/page.tsx       ← Upload page
│   ├── results/page.tsx      ← Results page
│   └── api/                  ← Backend API
│       ├── auth/login/       ← Login endpoint
│       └── analyze/          ← Analysis endpoint
├── lib/
│   ├── parser.ts             ← Log parsing logic
│   └── analyzer.ts           ← Anomaly detection
├── database/
│   └── schema.sql            ← Database schema
└── examples/                 ← Test log files
```

---

## 🎯 Common Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Run production build

# Code Quality
npm run lint         # Check for errors

# Database
# Run schema.sql in Supabase SQL Editor
```

---

## 🐛 Quick Fixes

**Can't connect to database?**
- Check `.env.local` has correct Supabase URL
- Make sure you ran `schema.sql` in Supabase

**Can't login?**
- Run `schema.sql` - it creates default users
- Username: `admin`, Password: `password123`

**Parser not working?**
- Check log file format (should be Apache/Nginx)
- Try example files in `/examples` folder

---

## 📚 Next Steps

1. **Read:** `README.md` for full documentation
2. **Deploy:** See `DEPLOYMENT-GUIDE.md`
3. **Customize:** Modify detection rules in `lib/analyzer.ts`

---

**You're all set!** 🚀  
Start analyzing logs in < 5 minutes!

