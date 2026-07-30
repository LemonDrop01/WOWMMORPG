-- Set tygoodhue01@gmail.com as admin
-- This script will be run after the admin tables are created

-- First, find the user ID for tygoodhue01@gmail.com
-- This assumes the user is already created in auth.users

-- Insert or update the user as admin
INSERT INTO public.users (id, email, role)
SELECT 
  id,
  email,
  'admin' as role
FROM auth.users 
WHERE email = 'tygoodhue01@gmail.com'
ON CONFLICT (id) DO UPDATE SET 
  role = 'admin',
  updated_at = NOW();