# Deploy Templo do Abismo to Vercel

## Quick Setup

### 1. Commit Files to GitHub
Make sure these files are in your repository:
- `vercel.json`
- `.vercelignore`
- `DEPLOYMENT.md`

### 2. Vercel Dashboard Settings

**Build Configuration:**
- Framework: Vite
- Build Command: `vite build`
- Output Directory: `dist/public`
- Install Command: `npm install`

### 3. Environment Variables (Essential)

Add in Vercel Settings → Environment Variables:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_KEY=your_supabase_anon_key
```

Get these from your Supabase dashboard: Settings → API

### 4. Deploy

1. Import GitHub repository in Vercel
2. Set the configuration above
3. Add environment variables
4. Click Deploy

Your mystical portal will be live at `https://your-project.vercel.app`

## What Works After Deployment

✅ Complete Supabase integration
✅ User authentication and registration  
✅ Database operations and real-time features
✅ File storage and uploads
✅ All mystical portal features
✅ Glass morphism design and animations
✅ Responsive mobile interface

## Troubleshooting

**Build fails:** Check environment variables are set
**Site loads but no data:** Verify Supabase credentials
**Auth not working:** Ensure Supabase Auth is configured

The application runs entirely client-side with direct Supabase connections - no backend server needed.