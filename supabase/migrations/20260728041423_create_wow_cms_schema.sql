/*
# World of Warcraft Private Server CMS Schema

## Purpose
Creates the database tables for a WoW private server community website (similar to AzerothCore ACore CMS but standalone). Supports account registration, realm status display, news/announcements, and server info.

## New Tables

### realms
- Stores realm (game server) connection and status information.
- `id` (uuid, primary key)
- `name` (text, the realm name e.g. "Azeroth")
- `type` (text, realm type e.g. "PvE", "PvP", "RP")
- `expansion` (text, expansion name e.g. "WotLK 3.3.5a")
- `host` (text, the realmlist host address)
- `port` (int, the game server port, default 8085)
- `online` (boolean, whether the realm is currently online)
- `players_online` (int, current player count)
- `max_players` (int, player cap)
- `uptime` (text, human-readable uptime string)
- `description` (text, realm description)
- `display_order` (int, ordering for display)
- `updated_at` (timestamp, last status update)

### news
- Stores news articles and announcements.
- `id` (uuid, primary key)
- `title` (text, article title)
- `slug` (text, URL slug, unique)
- `excerpt` (text, short summary)
- `content` (text, full article body in markdown)
- `category` (text, e.g. "Announcement", "Update", "Event", "Maintenance")
- `author` (text, author display name)
- `image_url` (text, optional hero image URL)
- `is_published` (boolean, default true)
- `published_at` (timestamp, publication time)
- `created_at` (timestamp)

### server_info
- Stores general server information key-value pairs (version, discord link, rules, etc.).
- `id` (uuid, primary key)
- `key` (text, unique identifier e.g. "discord_url", "patch_version")
- `label` (text, display label)
- `value` (text, the value)
- `category` (text, grouping e.g. "General", "Connection", "Community")
- `display_order` (int)

### game_accounts
- Stores game accounts linked to registered website users. In a real AzerothCore setup these map to the auth.realmlist/account tables; here we store a registration record so the admin can sync them to the game server.
- `id` (uuid, primary key)
- `user_id` (uuid, references auth.users, the website account owner)
- `account_name` (text, the in-game account username)
- `expansion` (text, which expansion/realm this account is for)
- `created_at` (timestamp)

## Security
- RLS enabled on all tables.
- `realms`, `news`, `server_info` are public-readable (anon + authenticated) since they are displayed to all visitors. Writes are authenticated-only (admin via service role in practice).
- `game_accounts` is owner-scoped: each authenticated user can only see/create their own game accounts.

## Notes
1. This is a public-facing CMS; most content is read-only for visitors.
2. Game accounts are linked to the Supabase auth user so the website can show "your registered game accounts."
3. News content supports markdown for rich formatting.
*/

-- Realms table
CREATE TABLE IF NOT EXISTS realms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL DEFAULT 'PvP',
  expansion text NOT NULL DEFAULT 'WotLK 3.3.5a',
  host text NOT NULL,
  port int NOT NULL DEFAULT 8085,
  online boolean NOT NULL DEFAULT true,
  players_online int NOT NULL DEFAULT 0,
  max_players int NOT NULL DEFAULT 1000,
  uptime text NOT NULL DEFAULT '0d 0h 0m',
  description text,
  display_order int NOT NULL DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE realms ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_realms" ON realms;
CREATE POLICY "anon_select_realms" ON realms FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_realms" ON realms;
CREATE POLICY "auth_insert_realms" ON realms FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_realms" ON realms;
CREATE POLICY "auth_update_realms" ON realms FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_realms" ON realms;
CREATE POLICY "auth_delete_realms" ON realms FOR DELETE
  TO authenticated USING (true);

-- News table
CREATE TABLE IF NOT EXISTS news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text,
  content text,
  category text NOT NULL DEFAULT 'Announcement',
  author text NOT NULL DEFAULT 'Staff Team',
  image_url text,
  is_published boolean NOT NULL DEFAULT true,
  published_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_news" ON news;
CREATE POLICY "anon_select_news" ON news FOR SELECT
  TO anon, authenticated USING (is_published = true);

DROP POLICY IF EXISTS "auth_insert_news" ON news;
CREATE POLICY "auth_insert_news" ON news FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_news" ON news;
CREATE POLICY "auth_update_news" ON news FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_news" ON news;
CREATE POLICY "auth_delete_news" ON news FOR DELETE
  TO authenticated USING (true);

-- Server info table
CREATE TABLE IF NOT EXISTS server_info (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  label text NOT NULL,
  value text NOT NULL,
  category text NOT NULL DEFAULT 'General',
  display_order int NOT NULL DEFAULT 0
);
ALTER TABLE server_info ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_server_info" ON server_info;
CREATE POLICY "anon_select_server_info" ON server_info FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_server_info" ON server_info;
CREATE POLICY "auth_insert_server_info" ON server_info FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_server_info" ON server_info;
CREATE POLICY "auth_update_server_info" ON server_info FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_server_info" ON server_info;
CREATE POLICY "auth_delete_server_info" ON server_info FOR DELETE
  TO authenticated USING (true);

-- Game accounts table
CREATE TABLE IF NOT EXISTS game_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  account_name text NOT NULL,
  expansion text NOT NULL DEFAULT 'WotLK 3.3.5a',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE game_accounts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_game_accounts" ON game_accounts;
CREATE POLICY "select_own_game_accounts" ON game_accounts FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_game_accounts" ON game_accounts;
CREATE POLICY "insert_own_game_accounts" ON game_accounts FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_game_accounts" ON game_accounts;
CREATE POLICY "update_own_game_accounts" ON game_accounts FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_game_accounts" ON game_accounts;
CREATE POLICY "delete_own_game_accounts" ON game_accounts FOR DELETE
  TO authenticated USING (auth.uid() = user_id);