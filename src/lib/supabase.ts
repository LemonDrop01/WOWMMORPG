import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Realm {
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
  description: string;
  display_order: number;
  updated_at: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  content: string;
  is_published: boolean;
  published_at: string;
  created_at: string;
}

export interface ServerInfo {
  key: string;
  label: string;
  value: string;
  category: string;
  display_order: number;
}

export interface GameAccount {
  id: string;
  user_id: string;
  account_name: string;
  expansion: string;
  created_at: string;
  updated_at: string;
}