# 🚀 Deploy LogTrace to Netlify

Quick guide to deploy your LogTrace application to Netlify!

---

## 🎯 Method 1: Drag & Drop (Easiest!)

This is the **fastest way** to get your site live!

### Steps:

1. **Go to Netlify:**
   - Open https://www.netlify.com/
   - Click "Sign up" (or "Log in" if you have an account)
   - Sign up with GitHub, GitLab, or email

2. **Deploy via drag-and-drop:**
   - Once logged in, you'll see a big area that says **"Want to deploy a new site without connecting to Git? Drag and drop your site folder here"**
   - Open your file explorer/finder
   - Drag the **entire LogTrace folder** onto that area
   - Wait 10-30 seconds...

3. **Your site is LIVE! 🎉**
   - Netlify will give you a URL like: `https://random-name-12345.netlify.app`
   - Click it to test your deployed site!

4. **Optional - Custom Domain:**
   - Click "Domain settings"
   - Click "Edit site name"
   - Change to something like: `logtrace-yourname.netlify.app`

---

## 🎯 Method 2: GitHub + Netlify (Recommended for Version Control)

This method auto-deploys every time you push to GitHub!

### Steps:

1. **Push to GitHub:**
   ```bash
   # Initialize git (if not already done)
   git init
   
   # Add all files
   git add .
   
   # Commit
   git commit -m "Initial commit: LogTrace Phase 1 complete"
   
   # Create repo on GitHub, then:
   git remote add origin https://github.com/YOUR_USERNAME/LogTrace.git
   git branch -M main
   git push -u origin main
   ```

2. **Connect to Netlify:**
   - Go to https://app.netlify.com/
   - Click "Add new site" → "Import an existing project"
   - Click "GitHub" (authorize if needed)
   - Select your LogTrace repository

3. **Configure Build Settings:**
   - **Build command:** Leave empty (it's a static site)
   - **Publish directory:** `.` (just a dot - means root folder)
   - Click "Deploy site"

4. **Wait for deployment:**
   - First deploy takes ~30 seconds
   - Your site is now live at the generated URL!

5. **Auto-deploy is ON:**
   - Every time you push to GitHub, Netlify auto-deploys
   - Make changes → `git push` → Site updates!

---

## 🎯 Method 3: Netlify CLI (For Developers)

Use the command line for deployment!

### Steps:

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify:**
   ```bash
   netlify login
   ```
   - Browser opens, authorize the CLI

3. **Deploy:**
   ```bash
   # Navigate to project folder
   cd LogTrace
   
   # Deploy to production
   netlify deploy --prod
   ```

4. **Follow prompts:**
   - Create new site? Yes
   - Publish directory? `.` (dot)
   - Wait for upload...
   - Site is live!

---

## ✅ After Deployment Checklist

Once deployed, test these things:

- [ ] Can access the site at the Netlify URL
- [ ] Login page loads correctly
- [ ] Can login with `admin` / `password123`
- [ ] Upload page shows correctly
- [ ] Can download example log files
- [ ] Can upload `sample-normal.log` → detects 0 anomalies
- [ ] Can upload `sample-attacks.log` → detects 6 anomalies
- [ ] Results page displays properly
- [ ] Logout works
- [ ] Trying to access upload.html without login redirects to index.html

---

## 🐛 Troubleshooting

### Issue: "Page not found" when refreshing
**Fix:** The `netlify.toml` file handles this. Make sure it's included!

### Issue: CSS/JS not loading
**Fix:** 
- Check browser console for errors
- Make sure paths are relative (no leading `/`)
- Verify `css/` and `js/` folders are included

### Issue: Example files won't download
**Fix:** 
- Make sure `examples/` folder is in the deployed site
- Check Netlify deploy log to confirm files were uploaded

### Issue: Login doesn't work
**Fix:**
- Check browser console for JavaScript errors
- Verify `js/auth.js` is loaded
- Make sure `sessionStorage` is allowed (not in incognito mode with strict settings)

---

## 🎨 Customize Your Site

### Change Site Name:
1. Go to Netlify dashboard
2. Select your site
3. Go to "Site settings" → "Site details"
4. Click "Change site name"
5. Enter: `logtrace-yourname`
6. Your new URL: `https://logtrace-yourname.netlify.app`

### Add Custom Domain:
1. Buy a domain (like `logtrace.com`)
2. In Netlify: "Domain settings" → "Add custom domain"
3. Follow DNS configuration steps
4. SSL certificate auto-generated (free!)

---

## 📱 Share Your Deployment

Once deployed, update these:

1. **README.md:**
   - Replace `[Your Netlify URL here]` with your actual URL
   
2. **For submission:**
   - Add the Netlify URL to your email to venkata@tenex.ai
   - Include in your video walkthrough

3. **Test link:**
   - Open in incognito/private mode
   - Test on mobile device
   - Share with friend to test

---

## 🔄 Update Your Deployed Site

### If using drag-and-drop:
1. Make changes locally
2. Drag the folder to Netlify again
3. It updates the existing site!

### If using GitHub:
1. Make changes locally
2. Commit and push:
   ```bash
   git add .
   git commit -m "Updated X feature"
   git push
   ```
3. Netlify auto-deploys (watch in dashboard)

---

## 📊 View Deployment Logs

1. Go to Netlify dashboard
2. Select your site
3. Click "Deploys"
4. Click on any deploy to see:
   - Deploy log
   - Files uploaded
   - Any errors

---

## 💰 Cost

**Netlify Free Tier includes:**
- ✅ 100 GB bandwidth/month
- ✅ Unlimited sites
- ✅ Auto SSL certificates
- ✅ Continuous deployment
- ✅ More than enough for this project!

---

## 🎉 You're Done!

Your LogTrace application is now live on the internet!

**Next steps:**
1. ✅ Test the deployed site thoroughly
2. ✅ Update README with your Netlify URL
3. ✅ Record video walkthrough showing the live site
4. ✅ Submit to venkata@tenex.ai

---

**Questions?** Check the Netlify docs: https://docs.netlify.com/

**Good luck! 🚀**

