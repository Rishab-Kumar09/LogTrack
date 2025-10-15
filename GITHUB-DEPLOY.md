# 🚀 Deploy LogTrack to GitHub

Complete guide to push your code to GitHub and deploy with GitHub Pages!

---

## 📋 Prerequisites

- Git installed on your computer ([Download Git](https://git-scm.com/downloads))
- GitHub account (free at [github.com](https://github.com))
- Your repository ready: https://github.com/Rishab-Kumar09/LogTrack

---

## 🎯 Step-by-Step Deployment

### Step 1: Initialize Git (if not already done)

Open terminal/command prompt in your LogTrack folder:

```bash
# Check if git is already initialized
git status

# If not initialized, run:
git init
```

---

### Step 2: Add Your Files

```bash
# Add all files to git
git add .

# Check what will be committed
git status
```

You should see all your files listed (HTML, CSS, JS, examples, etc.)

---

### Step 3: Create Your First Commit

```bash
git commit -m "Initial commit: LogTrack Phase 1 complete - Anomaly detection with 6 rules"
```

---

### Step 4: Connect to GitHub Repository

```bash
# Add your GitHub repo as remote
git remote add origin https://github.com/Rishab-Kumar09/LogTrack.git

# Verify it was added
git remote -v
```

You should see:
```
origin  https://github.com/Rishab-Kumar09/LogTrack.git (fetch)
origin  https://github.com/Rishab-Kumar09/LogTrack.git (push)
```

---

### Step 5: Push to GitHub

```bash
# Set the default branch name to main
git branch -M main

# Push your code to GitHub
git push -u origin main
```

**Enter your GitHub credentials when prompted.**

✅ **Your code is now on GitHub!**

Check: https://github.com/Rishab-Kumar09/LogTrack

---

### Step 6: Enable GitHub Pages

1. **Go to your repository:**
   - Open: https://github.com/Rishab-Kumar09/LogTrack

2. **Navigate to Settings:**
   - Click the "Settings" tab (top right of repo page)

3. **Find Pages section:**
   - Scroll down left sidebar
   - Click "Pages"

4. **Configure Source:**
   - Under "Build and deployment" section:
   - **Source:** Deploy from a branch
   - **Branch:** Select `main`
   - **Folder:** Select `/ (root)`
   - Click "Save"

5. **Wait for deployment:**
   - GitHub will show: "Your site is live at https://rishab-kumar09.github.io/LogTrack/"
   - First deployment takes 1-2 minutes
   - Refresh the page to see the URL

6. **Visit your live site:**
   - Click the link or go to: https://rishab-kumar09.github.io/LogTrack/
   - Test login with `admin` / `password123`

---

## ✅ Verify Deployment

Test these on your live GitHub Pages site:

- [ ] Site loads at https://rishab-kumar09.github.io/LogTrack/
- [ ] Login page displays correctly
- [ ] Can login with demo credentials
- [ ] Upload page loads
- [ ] Can download example files
- [ ] Can upload and analyze `sample-attacks.log`
- [ ] Results display with 6 anomalies
- [ ] All styling works (CSS loaded)
- [ ] All JavaScript works (no console errors)

---

## 🔄 Update Your Deployed Site

Every time you make changes:

```bash
# 1. Make your changes to files

# 2. Add changes
git add .

# 3. Commit with message
git commit -m "Description of what you changed"

# 4. Push to GitHub
git push

# 5. Wait ~1 minute for GitHub Pages to auto-deploy
```

GitHub Pages automatically redeploys on every push to main!

---

## 🌐 Your Live URLs

After deployment, your app will be accessible at:

- **GitHub Repository:** https://github.com/Rishab-Kumar09/LogTrack
- **Live Site:** https://rishab-kumar09.github.io/LogTrack/

Share these links in your submission!

---

## 🎨 Custom Domain (Optional)

Want a custom domain like `logtrack.com`?

1. Buy a domain from Namecheap, GoDaddy, etc.
2. In your repo Settings → Pages → Custom domain
3. Enter your domain
4. Configure DNS records (GitHub provides instructions)
5. SSL certificate auto-generated!

---

## 🐛 Troubleshooting

### Issue: "Permission denied (publickey)"
**Fix:** 
- Use HTTPS instead of SSH for the remote:
  ```bash
  git remote set-url origin https://github.com/Rishab-Kumar09/LogTrack.git
  ```
- Or setup SSH keys: https://docs.github.com/en/authentication/connecting-to-github-with-ssh

### Issue: "Updates were rejected"
**Fix:**
```bash
# Pull latest changes first
git pull origin main --rebase

# Then push
git push
```

### Issue: 404 Page Not Found on GitHub Pages
**Fix:**
- Make sure `index.html` is in the root folder (not in a subfolder)
- Wait 2-3 minutes after enabling Pages
- Check Settings → Pages for any error messages
- Verify the branch is set to `main`

### Issue: CSS/JS Not Loading on GitHub Pages
**Fix:**
- Check browser console for 404 errors
- Verify paths in HTML are relative (e.g., `css/style.css` not `/css/style.css`)
- Make sure files are committed and pushed

### Issue: Can't Login on Deployed Site
**Fix:**
- Check browser console for JavaScript errors
- Verify `js/auth.js` is loaded
- Test in incognito mode (no browser extensions interfering)

---

## 📱 Test on Different Devices

Once deployed, test your site on:
- [ ] Desktop Chrome
- [ ] Desktop Firefox
- [ ] Mobile Safari (iPhone)
- [ ] Mobile Chrome (Android)
- [ ] Tablet

---

## 📊 GitHub Repository Best Practices

### Add a Good README
✅ Already done! Your README.md is comprehensive

### Add Topics/Tags
1. Go to your repo homepage
2. Click the gear icon ⚙️ next to "About"
3. Add topics: `cybersecurity`, `log-analysis`, `javascript`, `anomaly-detection`

### Pin Repository
1. Go to your GitHub profile
2. Click "Customize your pins"
3. Select LogTrack to feature it

### Add Repository Description
1. Click gear icon ⚙️ next to "About"
2. Description: "Cybersecurity log analysis tool with AI-powered anomaly detection"
3. Website: https://rishab-kumar09.github.io/LogTrack/
4. Save

---

## 🎥 For Your Video Walkthrough

Show these in your video:

1. **GitHub Repository:**
   - Show the code on GitHub
   - Point out the clean file structure

2. **Live Site:**
   - Navigate to the GitHub Pages URL
   - Show it working live

3. **Code Walkthrough:**
   - Show `js/analyzer.js` on GitHub
   - Explain one detection rule

4. **Commit History:**
   - Show your commits (proves you built it)

---

## 📧 For Submission

Include in your email to venkata@tenex.ai:

```
Subject: LogTrack - Full-Stack Cybersecurity Application Submission

Dear Tenex.ai Team,

I've completed the Full-Stack Cybersecurity Application assignment.

🔗 GitHub Repository: https://github.com/Rishab-Kumar09/LogTrack
🌐 Live Demo: https://rishab-kumar09.github.io/LogTrack/
🎥 Video Walkthrough: [Your YouTube/Loom link]

Demo Credentials:
- Username: admin / Password: password123

Key Features Implemented:
✅ 6 anomaly detection rules with confidence scores
✅ Interactive timeline visualization
✅ Apache/Nginx log parsing
✅ Responsive dark theme UI
✅ Example log files included

Tech Stack: HTML5, CSS3, Vanilla JavaScript
Deployment: GitHub Pages

Thank you for reviewing my submission!

Best regards,
Rishab Kumar
```

---

## 🎉 You're Done!

Your LogTrack application is now:
- ✅ Pushed to GitHub
- ✅ Deployed on GitHub Pages
- ✅ Accessible to the world
- ✅ Ready for submission

**Next Steps:**
1. ✅ Test the live site thoroughly
2. ✅ Record your video walkthrough
3. ✅ Submit to venkata@tenex.ai

---

**Good luck with your submission! 🚀**

