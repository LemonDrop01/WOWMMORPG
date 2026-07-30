-- Directly set tygoodhue01@gmail.com as admin
-- First, get the user ID from auth.users and insert into public.users

-- This requires knowing the user ID, so we'll use a different approach
-- We'll create a function that can be called manually or we'll do it through the Supabase dashboard

-- Alternative: Create a stored procedure to set admin
CREATE OR REPLACE FUNCTION set_user_as_admin(user_email TEXT)
RETURNS void AS $$
DECLARE
  user_id UUID;
BEGIN
  SELECT id INTO user_id FROM auth.users WHERE email = user_email;
  
  IF user_id IS NOT NULL THEN
    INSERT INTO public.users (id, email, role)
    VALUES (user_id, user_email, 'admin')
    ON CONFLICT (id) DO UPDATE SET 
      role = 'admin',
      updated_at = NOW();
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Call the function to set tygoodhue01@gmail.com as admin
SELECT set_user_as_admin('tygoodhue01@gmail.com');