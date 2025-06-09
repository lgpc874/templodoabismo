# Deployment Instructions - Templo do Abismo

## Vercel Deployment Setup

### 1. GitHub Repository
Ensure your repository is pushed to GitHub with these files:
- `vercel.json` (deployment configuration)
- `.vercelignore` (files to ignore during deployment)
- All client files in the correct structure

### 2. Vercel Dashboard Configuration

**Project Settings:**
- **Framework Preset**: Vite
- **Root Directory**: Leave empty (use root)
- **Build Command**: `vite build`
- **Output Directory**: `dist/public`
- **Install Command**: `npm install`

### 3. Environment Variables (Required)

Add these in Vercel Dashboard → Settings → Environment Variables:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_KEY=your_supabase_anon_key
```

**How to get Supabase credentials:**
1. Go to https://supabase.com/dashboard
2. Select your project
3. Navigate to Settings → API
4. Copy:
   - **Project URL** → use for `VITE_SUPABASE_URL`
   - **anon/public key** → use for `VITE_SUPABASE_KEY`

### 4. Deployment Process

1. **Connect Repository**: Import your GitHub repository in Vercel
2. **Configure Settings**: Set up the build configuration as specified above
3. **Add Environment Variables**: Input your Supabase credentials
4. **Deploy**: Click "Deploy" - Vercel will build and deploy automatically

### 5. Post-Deployment

After successful deployment:
- Your site will be available at `https://your-project.vercel.app`
- The application will use Supabase for authentication and database
- All static assets will be served from Vercel's CDN

### 6. Troubleshooting

**Build Errors:**
- Ensure environment variables are set correctly
- Check that all dependencies are in package.json
- Verify Supabase credentials are valid

**Runtime Errors:**
- Check browser console for client-side errors
- Verify Supabase connection in the browser network tab
- Ensure RLS policies are configured in Supabase

### 7. Custom Domain (Optional)

To add a custom domain:
1. Go to Project Settings → Domains
2. Add your domain
3. Configure DNS records as shown
4. Vercel will automatically provision SSL certificates

## Important Notes

- The application is configured as a static site with client-side routing
- All API calls go directly to Supabase (no backend server needed)
- Authentication is handled entirely by Supabase Auth
- File uploads and storage use Supabase Storage
- Real-time features use Supabase Realtime