# 🚀 Vercel Deployment Guide for ProEdge Student

## Quick Fix Summary

The 404 error on Vercel was caused by missing SPA (Single Page Application) routing configuration. This has been fixed by adding `vercel.json`.

## Files Created/Modified

### ✅ Created: `vercel.json`
Configures Vercel to:
- Rewrite all routes to `index.html` (enables client-side routing)
- Add security headers
- Cache static assets for 1 year

### ✅ Created: `.env.production`
Template for production environment variables. **You must update this file before deploying.**

## 📝 Deployment Steps

### Step 1: Update Backend URL

Edit `.env.production` and replace `YOUR_BACKEND_URL` with your actual backend URL:

```env
VITE_API_BASE_URL=https://your-backend-url.com
```

**Examples:**
- Render: `https://proedge-backend.onrender.com`
- Railway: `https://proedge-backend.railway.app`
- Heroku: `https://proedge-backend.herokuapp.com`

> [!IMPORTANT]
> Make sure your backend URL does NOT have a trailing slash.

### Step 2: Deploy to Vercel

#### Option A: Using Vercel CLI

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Navigate to project directory
cd "c:\Users\itsan\Desktop\Proedge New Project\proedge-student"

# Deploy
vercel

# For production deployment
vercel --prod
```

#### Option B: Using Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your Git repository
4. Configure:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
5. Add Environment Variable:
   - **Name:** `VITE_API_BASE_URL`
   - **Value:** Your backend URL (e.g., `https://proedge-backend.onrender.com`)
6. Click "Deploy"

### Step 3: Verify Deployment

After deployment, test these routes:
- ✅ `/` - Should show login/dashboard
- ✅ `/auth/login` - Should show login page
- ✅ `/courses` - Should work (not 404)
- ✅ `/profile` - Should work (not 404)
- ✅ Refresh on any route - Should NOT 404

## 🔧 Troubleshooting

### Issue: Build fails on Vercel

**Solution:** Vercel uses Node 18+ by default, which is compatible with Vite 7. If you see build errors:

1. Check Vercel build logs
2. Ensure all dependencies are in `package.json`
3. Verify `VITE_API_BASE_URL` environment variable is set

### Issue: API calls fail after deployment

**Possible causes:**
1. Backend URL is incorrect in environment variables
2. Backend CORS is not configured for your Vercel domain
3. Backend is not deployed/running

**Solution:** Update your backend's CORS configuration to include your Vercel URL:

```javascript
// In your backend (e.g., Express)
const allowedOrigins = [
  'http://localhost:5176',
  'https://your-vercel-app.vercel.app',
  'https://your-custom-domain.com'
];
```

### Issue: Still getting 404 on routes

**Solution:** 
1. Verify `vercel.json` exists in project root
2. Redeploy the project
3. Clear browser cache and try again

## 📱 Local Testing (Optional)

To test the production build locally:

```bash
# Build the project
npm run build

# Preview the build
npm run preview
```

Then navigate to different routes and refresh to ensure routing works.

## ⚠️ Important Notes

> [!WARNING]
> Your local environment uses Node v16, but Vite 7 requires Node 18+. The build may fail locally but will work on Vercel (which uses Node 18+). If you want to build locally, upgrade Node to v18 or higher.

> [!IMPORTANT]
> Remember to update your backend's CORS configuration to allow requests from your Vercel deployment URL.

## 🎯 Next Steps

1. **Update `.env.production`** with your backend URL
2. **Deploy to Vercel** using CLI or dashboard
3. **Test all routes** after deployment
4. **Update backend CORS** if API calls fail
5. **Set up custom domain** (optional) in Vercel dashboard

---

**Need Help?**
- Check Vercel deployment logs for errors
- Verify environment variables in Vercel dashboard
- Test backend URL directly in browser to ensure it's accessible
