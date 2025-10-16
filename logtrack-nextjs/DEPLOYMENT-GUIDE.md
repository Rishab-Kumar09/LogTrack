# 🚀 Deployment Guide - LogTrack on Netlify

This guide will help you deploy LogTrack to Netlify in 10 minutes!

---

## ✅ Prerequisites

Before deploying, make sure you have:
- [ ] A GitHub account
- [ ] A Netlify account (free) - https://netlify.com
- [ ] A Supabase account (free) - https://supabase.com
- [ ] Your code pushed to GitHub

---

## 📋 Step-by-Step Deployment

### Step 1: Set Up Supabase Database (5 minutes)

1. **Create Supabase Project:**
   - Go to https://supabase.com/dashboard
   - Click "New Project"
   - Choose a name (e.g., "logtrack")
   - Set a database password
   - Wait 2-3 minutes for setup

2. **Run Database Schema:**
   - Click "SQL Editor" in sidebar
   - Click "New Query"
   - Copy the entire contents of `database/schema.sql`
   - Paste and click "Run"
   - You should see success messages

3. **Get API Credentials:**
   - Click "Settings" → "API"
   - Copy **"Project URL"** - save this as `NEXT_PUBLIC_SUPABASE_URL`
   - Scroll down, find **"service_role"** key
   - Click "Reveal" and copy - save this as `SUPABASE_SERVICE_KEY`
   - ⚠️ Keep these safe! Don't commit to GitHub

4. **Verify Database:**
   - Go to "Table Editor"
   - You should see 2 tables: `users` and `analyses`
   - Click `users` table - you should see 2 default users (admin, analyst)

---

### Step 2: Push Code to GitHub (2 minutes)

```bash
# In your project folder:
git init
git add .
git commit -m "feat: LogTrack - Next.js + TypeScript + PostgreSQL"

# Create a new repo on GitHub, then:
git remote add origin https://github.com/YOUR-USERNAME/logtrack.git
git branch -M main
git push -u origin main
```

✅ Your code is now on GitHub!

---

### Step 3: Deploy to Netlify (3 minutes)

1. **Connect Netlify to GitHub:**
   - Go to https://app.netlify.com
   - Click "Add new site" → "Import an existing project"
   - Click "Deploy with GitHub"
   - Authorize Netlify to access your GitHub
   - Select your `logtrack` repository

2. **Configure Build Settings:**
   - **Site name:** Choose a name (e.g., `my-logtrack-app`)
   - **Branch:** `main`
   - **Build command:** Should auto-detect as `npm run build`
   - **Publish directory:** Should auto-detect as `.next`
   - Click "Show advanced" if you need to verify

3. **Add Environment Variables:**
   - Before clicking "Deploy", click "Add environment variables"
   - Add these 2 required variables:

   ```
   NEXT_PUBLIC_SUPABASE_URL = https://your-project.supabase.co
   SUPABASE_SERVICE_KEY = your-service-role-key
   ```

   - Optional: Add `OPENAI_API_KEY` if you want AI parsing for unknown formats

4. **Deploy!**
   - Click "Deploy site"
   - Wait 2-3 minutes for build
   - You'll see "Site is live" with your URL!

---

## 🎉 Your App is Live!

Your LogTrack app is now deployed at:
```
https://YOUR-SITE-NAME.netlify.app
```

---

## 🧪 Test Your Deployment

1. **Go to your Netlify URL**

2. **Login with default credentials:**
   - Username: `admin`
   - Password: `password123`

3. **Upload a test log file:**
   - Use `examples/sample-attacks.log` from your repo
   - Click "Analyze"
   - You should see anomalies detected!

4. **Check the database:**
   - Go to Supabase → Table Editor → `analyses`
   - You should see your analysis saved!

---

## 🔧 Troubleshooting

### Build Failed?

**Check these:**
- ✅ Did you run `npm install` locally first?
- ✅ Are all files committed to GitHub?
- ✅ Is `package.json` in the root directory?
- ✅ Did you add environment variables in Netlify?

**View build logs:**
- Go to Netlify dashboard
- Click "Deploys" tab
- Click the failed deploy
- Scroll through logs to find errors

---

### Can't Login?

**Possible issues:**
1. Database schema not run
   - Go to Supabase SQL Editor
   - Re-run `database/schema.sql`

2. Wrong environment variables
   - Check Netlify → Site settings → Environment variables
   - Verify URLs have no trailing slashes

3. Supabase URL format
   - Should be: `https://xxxxx.supabase.co` (no /rest/v1)

---

### Analysis Fails?

**Check:**
1. Log file format is supported
2. File is not too large (< 10MB)
3. Supabase connection is working
4. Check browser console (F12) for errors

---

## 🔄 Updating Your Deployment

After making code changes:

```bash
git add .
git commit -m "Description of changes"
git push
```

Netlify automatically rebuilds and redeploys! ✨

---

## ⚙️ Advanced Configuration

### Custom Domain:

1. Go to Netlify → Site settings → Domain management
2. Click "Add custom domain"
3. Follow DNS configuration instructions

### Environment Variables:

To update env vars without redeploying:
1. Netlify dashboard → Site settings → Environment variables
2. Edit values
3. Click "Save"
4. Trigger new deploy (no code changes needed)

---

## 📊 Monitoring

### Netlify provides:

- **Deploy history** - See all past deploys
- **Function logs** - See API route calls
- **Analytics** (on paid plans)

### Supabase provides:

- **Database logs** - See all queries
- **API logs** - See all requests
- **Storage metrics** - Monitor DB size

---

## 💰 Cost

### Free Tiers:

**Netlify:**
- ✅ 100GB bandwidth/month
- ✅ 300 build minutes/month
- ✅ Unlimited sites
- ✅ Custom domains

**Supabase:**
- ✅ 500MB database
- ✅ 1GB file storage
- ✅ 50,000 monthly active users
- ✅ 2GB bandwidth

### This means:
🎉 **Your app can run completely FREE!**

---

## 🎥 Video Walkthrough

**When recording your demo video, show:**

1. ✅ Code structure in IDE
2. ✅ Key files explained (parser, analyzer)
3. ✅ Live site working (login, upload, results)
4. ✅ Database in Supabase
5. ✅ Anomaly detection in action
6. ✅ Explanation of one detection rule

**Recommended length:** 5-7 minutes

---

## 📝 Submission Checklist

Before submitting to Tenex.AI:

- [ ] Code pushed to public GitHub repo
- [ ] App deployed and accessible
- [ ] README.md complete with setup instructions
- [ ] Example log files in repo
- [ ] Video walkthrough recorded
- [ ] Shared repo with venkata@tenex.ai
- [ ] Live demo link included

---

## ✅ You're Done!

Congratulations! Your LogTrack application is now:
- ✅ Built with proper stack (Next.js + TypeScript + PostgreSQL)
- ✅ Deployed and accessible online
- ✅ Backed by a real database
- ✅ Ready for demo and submission!

**Next step:** Record your video walkthrough! 🎥

---

## 🆘 Need Help?

If you run into issues:

1. Check build logs in Netlify
2. Check browser console (F12)
3. Check Supabase logs
4. Verify environment variables
5. Re-run database schema

**Common fixes solve 90% of issues!**

---

**Good luck with your submission! 🚀**

