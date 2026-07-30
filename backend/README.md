# Azeroth Eternal Backend

Node.js backend API for connecting the Azeroth Eternal website to WoW game servers.

## Features

- **Realm Status Sync**: Automatically polls game server for real-time realm status
- **Account Synchronization**: Create game accounts from website registration
- **Password Sync**: Sync website passwords to game server accounts
- **Character Data**: Fetch character information and statistics
- **Database Integration**: Connects to both Supabase and game server MySQL

## Setup

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Configure Environment Variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration:
   ```
   # Server Configuration
   PORT=3001
   NODE_ENV=development

   # Supabase Configuration
   SUPABASE_URL=https://rbhpjvqtxquoqswnpwib.supabase.co
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

   # Game Server Database Configuration
   GAME_DB_HOST=localhost
   GAME_DB_PORT=3306
   GAME_DB_USER=game_db_user
   GAME_DB_PASSWORD=game_db_password
   GAME_DB_NAME=auth

   # Game Server Configuration
   GAME_SERVER_HOST=azeroth.eternal
   GAME_SERVER_PORT=8085
   REALM_UPDATE_INTERVAL=30000
   ```

3. **Start the Server**
   ```bash
   npm start
   ```

   For development with auto-reload:
   ```bash
   npm run dev
   ```

## API Endpoints

### Realms
- `GET /api/realms/status` - Get current realm status
- `POST /api/realms/update` - Force update realm status from game server

### Accounts
- `POST /api/accounts/create` - Create game account
  ```json
  {
    "userId": "supabase_user_id",
    "accountName": "gamename",
    "password": "password123",
    "expansion": "WotLK 3.3.5a"
  }
  ```
- `GET /api/accounts/:userId` - Get user's game accounts
- `DELETE /api/accounts/:userId/:accountName` - Delete game account
- `POST /api/accounts/sync-password` - Sync password to game accounts
  ```json
  {
    "userId": "supabase_user_id",
    "newPassword": "newpassword123"
  }
  ```

### Characters
- `GET /api/characters/:accountName` - Get characters for game account
- `GET /api/characters/:accountName/stats` - Get character statistics

## Database Requirements

### Game Server Database
- **auth** database with `account` and `realmlist` tables
- **characters** database with `characters` table
- MySQL user with SELECT, INSERT, UPDATE, DELETE permissions

### Supabase
- Existing tables: `realms`, `news`, `server_info`, `game_accounts`
- Service role key for backend operations

## Security Notes

- Never commit `.env` file with real credentials
- Use service role key only on backend, never on frontend
- Implement rate limiting for account creation
- Validate all user inputs
- Use HTTPS in production

## Game Server Compatibility

This backend is designed for TrinityCore/AzerothCore based servers. For other cores:
- Modify the password hashing algorithm in `accountSync.js`
- Adjust database queries for different schemas
- Update realm status polling logic

## Troubleshooting

**Database Connection Failed**
- Check MySQL credentials in `.env`
- Ensure MySQL server is running
- Verify database name and permissions

**Realm Status Not Updating**
- Check game server database schema
- Verify `realmlist` table structure
- Check console logs for specific errors

**Account Creation Fails**
- Verify SRP6 hashing matches your server
- Check account table structure
- Ensure unique username constraint

## Development

The backend supports hot-reload during development:
```bash
npm run dev
```

## Production Deployment

1. Set `NODE_ENV=production`
2. Use a process manager (PM2, systemd)
3. Enable HTTPS
4. Set up proper logging
5. Configure firewall rules
6. Use environment-specific configuration