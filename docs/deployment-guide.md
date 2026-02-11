# Deployment Guide - Contextual Vocab Builder

This guide covers deploying the Contextual Vocab Builder to Vercel.

## Prerequisites

1. **Supabase Project**: Set up a Supabase project with the required tables
2. **Gemini API Key**: Get a Gemini 2.5 Flash API key from Google AI Studio
3. **GitHub Repository**: Push code to GitHub
4. **Vercel Account**: Create a free Vercel account

## Environment Variables

Configure these environment variables in Vercel:

### Required Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key
```

### Getting Supabase Credentials

1. Go to [supabase.com](https://supabase.com)
2. Create a new project or select existing
3. Go to Settings > API
4. Copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon/public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Getting Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key → `GEMINI_API_KEY`

## Database Setup

### 1. Run Migrations

Apply the database migrations in order:

```bash
# In Supabase SQL Editor or via CLI:
supabase migration up
```

Or run each migration file manually in the Supabase SQL Editor:

1. `001_profiles.sql`
2. `002_profile_trigger.sql`
3. `003_vocab_cache.sql`
4. `004_cards_collections.sql`
5. `005_srs_progress.sql`

### 2. Configure Google OAuth (Optional)

For Google authentication:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new OAuth 2.0 client ID
3. Add authorized redirect URI: `https://your-domain.vercel.app/auth/callback`
4. Copy Client ID and Client Secret
5. In Supabase:
   - Go to Authentication > Providers
   - Enable Google provider
   - Add Client ID and Secret
   - Set Redirect URL: `https://your-domain.vercel.app/auth/callback`

## Deploy to Vercel

### Option 1: Via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import from GitHub
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
5. Add environment variables
6. Click "Deploy"

### Option 2: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# For production
vercel --prod
```

## Post-Deployment Checklist

- [ ] Verify environment variables are set
- [ ] Test authentication (signup/login)
- [ ] Test vocabulary generation
- [ ] Test card saving to collection
- [ ] Test flashcard review
- [ ] Test SRS scheduling
- [ ] Verify database RLS policies work

## Custom Domain (Optional)

1. In Vercel project settings
2. Go to Domains
3. Add custom domain
4. Update DNS records
5. Update Supabase redirect URLs

## Monitoring

### Vercel Analytics

- Enable Vercel Analytics for performance monitoring
- Check deployment logs for errors

### Supabase Logs

- Monitor database queries in Supabase dashboard
- Check authentication logs

## Troubleshooting

### Build Errors

- Check Next.js version compatibility
- Verify all dependencies are installed
- Check TypeScript compilation

### Runtime Errors

- Verify environment variables are correctly set
- Check Supabase connection
- Verify Gemini API key is valid

### Authentication Issues

- Check Supabase auth configuration
- Verify redirect URLs match
- Check RLS policies

## Updates

To update the deployed application:

```bash
git push origin main
```

Vercel will automatically deploy on push to main branch.

## Local Development

For local development with production data:

```bash
# Copy .env.example to .env.local
cp .env.example .env.local

# Fill in production values
# Then run:
npm run dev
```

## Security Considerations

1. **Never commit API keys** to repository
2. **Enable RLS policies** on all Supabase tables
3. **Use environment variables** for secrets
4. **Rotate API keys** periodically
5. **Monitor usage** to detect anomalies
