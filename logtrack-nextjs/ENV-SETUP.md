# 🔧 Environment Variables Setup

## Required Environment Variables

Create a `.env.local` file in the root directory with these variables:

```bash
# SUPABASE (Required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key-here

# OPENAI (Optional - for unknown log formats + AI summary feature)
OPENAI_API_KEY=sk-your-key-here
```

## Where to Get These:

### Supabase Credentials:
1. Go to https://supabase.com/
2. Create a new project (free tier)
3. Go to Settings → API
4. Copy your "Project URL" → `NEXT_PUBLIC_SUPABASE_URL`
5. Copy your "service_role key" → `SUPABASE_SERVICE_KEY`

### OpenAI API Key (Optional):
1. Go to https://platform.openai.com/api-keys
2. Click "Create new secret key"
3. Copy the key → `OPENAI_API_KEY`

**Used for:**
- Parsing unknown log formats (fallback)
- Generating AI security analysis summaries (ChatGPT-powered insights on results page)

## Database Setup:

After getting Supabase credentials:

1. Go to your Supabase project's SQL Editor
2. Run the schema from `database/schema.sql`
3. This creates the `users` and `analyses` tables
4. Default users are created automatically

## Testing Locally:

```bash
npm install
npm run dev
```

Open http://localhost:3000

Login with:
- Username: `admin` / Password: `password123`
- Username: `analyst` / Password: `soc2024`

