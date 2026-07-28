import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export type Realm = {
  id: string;
  name: string;
  type: string;
  expansion: string;
  host: string;
  port: number;
  online: boolean;
  players_online: number;
  max_players: number;
  uptime: string;
  description: string | null;
  display_order: number;
  updated_at: string;
};

export type NewsArticle = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  category: string;
  author: string;
  image_url: string | null;
  is_published: boolean;
  published_at: string;
  created_at: string;
};

export type ServerInfo = {
  id: string;
  key: string;
  label: string;
  value: string;
  category: string;
  display_order: number;
};

export type GameAccount = {
  id: string;
  user_id: string;
  account_name: string;
  expansion: string;
  created_at: string;
};
