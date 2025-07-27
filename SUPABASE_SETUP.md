# 🚀 Supabase Setup Instructions

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up/Login with GitHub
4. Click "New Project"
5. Choose your organization
6. Fill in project details:
   - **Name**: `ai-courses-registration`
   - **Database Password**: Generate a strong password
   - **Region**: Choose closest to your users
7. Click "Create new project"
8. Wait 2-3 minutes for setup to complete

## Step 2: Create Database Table

1. In your Supabase dashboard, go to **Table Editor**
2. Click "Create a new table"
3. Table name: `registrations`
4. Add these columns:

```sql
-- Copy and paste this SQL in the SQL Editor instead:
CREATE TABLE registrations (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  experience TEXT NOT NULL,
  interests TEXT[] NOT NULL,
  hear_about TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow all operations (for now)
CREATE POLICY "Allow all operations" ON registrations FOR ALL USING (true);
```

## Step 3: Get API Credentials

1. Go to **Settings** > **API**
2. Copy these values:
   - **Project URL**
   - **anon/public key**
   - **service_role key** (keep this secret!)

## Step 4: Update Environment Variables

### For Local Development (.env.local):
```env
REACT_APP_SUPABASE_URL=your-project-url
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
```

### For Vercel Deployment:
1. Go to your Vercel dashboard
2. Select your project
3. Go to **Settings** > **Environment Variables**
4. Add these variables:

```
SUPABASE_URL=your-project-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
REACT_APP_SUPABASE_URL=your-project-url
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
```

## Step 5: Test the Setup

1. Update your `.env.local` file with real credentials
2. Restart your development server: `npm start`
3. Try registering a new user
4. Check your Supabase dashboard > Table Editor > registrations
5. You should see the new registration!

## Step 6: Deploy to Production

1. Add environment variables to Vercel (Step 4)
2. Deploy: `git push` (if auto-deploy is enabled)
3. Test registration on your live site
4. Check Supabase dashboard for new registrations

## 🎉 Benefits You'll Get

- ✅ **Permanent data storage** - no more data loss
- ✅ **Real-time updates** - see new registrations instantly
- ✅ **Backup & export** - built-in data management
- ✅ **Scalability** - handles thousands of registrations
- ✅ **Security** - built-in authentication & authorization
- ✅ **Dashboard** - view/manage data easily

## 🔧 Troubleshooting

### "Invalid API key" error:
- Check that your environment variables are correct
- Make sure you're using the right keys (anon vs service_role)
- Restart your development server after changing .env.local

### "Table doesn't exist" error:
- Make sure you created the `registrations` table
- Check the table name spelling
- Verify the SQL was executed successfully

### Data not appearing:
- Check browser console for errors
- Verify environment variables in Vercel
- Check Supabase logs in dashboard

## 📞 Need Help?

If you encounter any issues:
1. Check the browser console for error messages
2. Check Supabase dashboard > Logs
3. Verify all environment variables are set correctly
4. Make sure the database table exists with correct columns