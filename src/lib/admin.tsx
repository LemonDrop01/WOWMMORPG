import { createClient } from '@supabase/supabase-js';

// Service role client for admin operations
const adminSupabase = createClient(
  'https://rbhpjvqtxquoqswnpwib.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJiaHBqdnF0eHF1b3Fzd25wd2liIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTIwNzMyMywiZXhwIjoyMTAwNzgzMzIzfQ.B0JdbePdL4wlFwyhMgopH4UnqeRCHXB7H0CoA1KgrG4'
);

// Regular client for user operations
import { supabase } from './supabase';

export interface User {
  id: string;
  email: string;
  role: 'user' | 'admin' | 'super_admin';
  created_at: string;
  updated_at: string;
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log('No user found in auth');
      return null;
    }

    console.log('Found auth user:', user.id, user.email);

    // Use adminSupabase to bypass RLS
    const { data, error } = await adminSupabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching user from users table:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      return null;
    }

    console.log('User from users table:', data);
    return data;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

export async function isAdmin(): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log('isAdmin: No user logged in');
      return false;
    }

    console.log('isAdmin: Checking user:', user.email);

    const { data, error } = await adminSupabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('isAdmin: Error checking admin status:', error);
      console.error('isAdmin: Error details:', JSON.stringify(error, null, 2));
      return false;
    }

    const isAdminUser = data?.role === 'admin' || data?.role === 'super_admin';
    console.log('isAdmin: Admin check result:', isAdminUser, 'role:', data?.role);
    return isAdminUser;
  } catch (error) {
    console.error('isAdmin: Error in isAdmin:', error);
    return false;
  }
}

export async function isSuperAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === 'super_admin';
}

export async function getAllUsers(): Promise<User[]> {
  try {
    const { data, error } = await adminSupabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting users:', error);
    return [];
  }
}

export async function updateUserRole(userId: string, role: 'user' | 'admin' | 'super_admin'): Promise<void> {
  try {
    const { error } = await adminSupabase
      .from('users')
      .update({ role, updated_at: new Date().toISOString() })
      .eq('id', userId);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating user role:', error);
    throw error;
  }
}