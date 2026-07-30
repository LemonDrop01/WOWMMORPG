-- Create game_accounts table to link Supabase users to game accounts
CREATE TABLE IF NOT EXISTS game_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  account_name TEXT NOT NULL,
  expansion TEXT DEFAULT 'WotLK 3.3.5a',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_game_accounts_user_id ON game_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_game_accounts_account_name ON game_accounts(account_name);

-- Disable RLS to avoid recursion issues
ALTER TABLE game_accounts DISABLE ROW LEVEL SECURITY;