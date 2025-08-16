# Supabase Setup Guide

## Quick Setup Steps

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign in with GitHub
4. Click "New project"
5. Fill in:
   - Project name: `voice-slides` (or your preference)
   - Database Password: Generate a strong password (save this!)
   - Region: Choose closest to you
6. Click "Create new project" (takes ~2 minutes)

### 2. Run Database Setup
1. In your Supabase dashboard, click **SQL Editor** in the left sidebar
2. Click "New query"
3. Copy and paste the entire contents of `supabase-setup.sql`
4. Click "Run" (or press Ctrl/Cmd + Enter)
5. You should see "Success. No rows returned"

### 3. Configure Authentication

#### Enable Email Authentication
1. Go to **Authentication** → **Providers**
2. Expand **Email** section
3. Ensure "Enable Email provider" is ON
4. Configure:
   - **Enable email confirmations**: OFF (for testing)
   - **Enable email confirmations**: ON (for production)

#### (Optional) Enable GitHub OAuth
1. Still in **Authentication** → **Providers**
2. Expand **GitHub** section
3. Toggle "Enable GitHub provider" ON
4. You'll need:
   - Client ID (from GitHub OAuth app)
   - Client Secret (from GitHub OAuth app)
5. Copy the "Callback URL" shown

##### Create GitHub OAuth App:
1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Click "New OAuth App"
3. Fill in:
   - Application name: "Voice Slides"
   - Homepage URL: `http://localhost:3000` (dev) or your production URL
   - Authorization callback URL: Paste from Supabase
4. Click "Register application"
5. Copy Client ID and Client Secret to Supabase

### 4. Get Your API Keys
1. Go to **Settings** → **API**
2. Copy these values to your `.env.local`:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** → `SUPABASE_SERVICE_ROLE_KEY`

### 5. Configure Email Templates (Optional)
1. Go to **Authentication** → **Email Templates**
2. Customize templates for:
   - Confirm signup
   - Reset password
   - Magic link

### 6. Your `.env.local` Should Look Like:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...your_long_anon_key
SUPABASE_SERVICE_ROLE_KEY=eyJ...your_long_service_role_key

# AI APIs
ANTHROPIC_API_KEY=sk-ant-api03-...
OPENAI_API_KEY=sk-proj-...
```

## Testing Your Setup

### 1. Start the app:
```bash
npm run dev
```

### 2. Test signup:
1. Go to http://localhost:3000/signup
2. Create an account
3. Check Supabase dashboard → **Authentication** → **Users**
4. You should see your new user

### 3. Test login:
1. Go to http://localhost:3000/login
2. Sign in with your credentials
3. You should be redirected to /dashboard

### 4. Test Voice-to-Slide:
1. Make sure you have `OPENAI_API_KEY` and `ANTHROPIC_API_KEY` set
2. Go to Dashboard
3. Record or upload audio
4. Verify slides are generated

## Database Tables Created

- **profiles** - User profile information
- **presentations** - Saved presentations (optional feature)
- **storage.audio** - Audio file storage bucket

## Troubleshooting

### "Invalid API key"
- Check that all three Supabase keys are correctly copied to `.env.local`
- Restart your dev server after updating `.env.local`

### "User already exists"
- Email might already be registered
- Check Authentication → Users in Supabase dashboard

### "Auth session missing"
- Clear browser cookies for localhost:3000
- Try incognito/private browsing mode

### GitHub OAuth not working
- Ensure callback URL exactly matches what's in GitHub OAuth app settings
- Check that Client ID and Secret are correctly entered in Supabase

## Production Deployment

When deploying to Vercel/Netlify:

1. Add all environment variables from `.env.local`
2. Update Supabase:
   - Add your production URL to **Authentication** → **URL Configuration**
   - Update redirect URLs to match production domain
3. Update GitHub OAuth app (if using):
   - Change Homepage URL to production URL
   - Update callback URL

## Optional Features

### Save Presentations to Database
The `presentations` table is ready if you want to add a "Save" feature:

```javascript
// Save presentation
const { data, error } = await supabase
  .from('presentations')
  .insert({
    user_id: user.id,
    title: presentation.title,
    slides: presentation.slides,
    transcript: transcript
  })

// Load user's presentations
const { data, error } = await supabase
  .from('presentations')
  .select('*')
  .order('created_at', { ascending: false })
```

### Store Audio Files
The storage bucket is configured if you want to save audio files:

```javascript
// Upload audio
const { data, error } = await supabase.storage
  .from('audio')
  .upload(`${user.id}/${fileName}`, audioBlob)
```

## Support

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- Check the SQL Editor for query logs if something fails