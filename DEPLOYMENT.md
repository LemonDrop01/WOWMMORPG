# Deployment Guide for Azeroth Eternal Website

## 📁 Build Location
**Frontend build files are stored in:** `/Users/sherylgoodhue/web/WOWMMORPG/dist/`

## 🚀 Files Needed for Hosting

### 1. **Frontend Files** (Static Web Files)
Upload these to your web server (e.g., Nginx, Apache, or any static hosting):

```
dist/
├── index.html                 # Main HTML file
└── assets/
    ├── index-5ouyIK3I.js      # JavaScript bundle (~373KB)
    └── index-BTwpNrvh.css     # CSS styles (~18KB)
```

**Total size:** ~390KB (compressed: ~105KB)

### 2. **Backend Files** (Node.js Server)
Upload the entire backend folder to your server:

```
backend/
├── package.json              # Dependencies
├── package-lock.json         # Dependency lock file
├── .env                      # Environment variables
├── .env.example             # Example environment file
├── README.md                # Backend documentation
└── src/
    ├── config/
    │   └── database.js      # Database connections
    ├── index.js             # Server entry point
    ├── routes/
    │   ├── accounts.js      # Account sync endpoints
    │   ├── characters.js    # Character data endpoints
    │   └── realms.js        # Realm status endpoints
    └── services/
        ├── accountSync.js   # Account sync logic
        ├── characters.js    # Character data logic
        └── realmStatus.js   # Realm status polling
```

## 🔧 Server Setup

### Frontend Hosting (Static Files)
**Option 1: Nginx**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    root /var/www/azeroth-eternal/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Proxy backend API requests
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Option 2: Apache**
```apache
<VirtualHost *:80>
    ServerName your-domain.com
    DocumentRoot /var/www/azeroth-eternal/dist
    
    <Directory /var/www/azeroth-eternal/dist>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
        
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>
    
    # Proxy backend API requests
    ProxyPass /api/ http://localhost:3001/
    ProxyPassReverse /api/ http://localhost:3001/
</VirtualHost>
```

### Backend Setup (Node.js)
```bash
# Install Node.js if not already installed
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Navigate to backend directory
cd /var/www/azeroth-eternal/backend

# Install dependencies
npm install

# Start backend server
npm start

# Or use PM2 for production
npm install -g pm2
pm2 start src/index.js --name azeroth-backend
pm2 save
pm2 startup
```

## 🔐 Environment Variables (.env)
```env
# Database Configuration
DB_HOST=20.245.100.238
DB_PORT=3306
DB_USER=acore
DB_PASSWORD=GrayConan1$
DB_NAME=acore_auth

# Supabase Configuration
SUPABASE_URL=https://rbhpjvqtxquoqswnpwib.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJiaHBqdnF0eHF1b3Fzd25wd2liIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUyMDczMjMsImV4cCI6MjEwMDc4MzMyM30.vR1GtN0J9x2n4S8H6K7mM9P1qR2sT3U4V5wX6yZ7k8

# Server Configuration
PORT=3001
NODE_ENV=production
REALM_UPDATE_INTERVAL=30000
```

## 🌐 Required Ports
- **Frontend:** Port 80 (HTTP) or 443 (HTTPS)
- **Backend:** Port 3001 (internal)
- **Game Server:** Port 8085 (external)
- **MySQL:** Port 3306 (internal)

## 🔧 Build Process
```bash
# Build frontend for production
cd /Users/sherylgoodhue/web/WOWMMORPG
npm run build

# The build files will be in the dist/ directory
# Upload these to your web server
```

## 📦 Quick Deployment Checklist
- [ ] Build frontend: `npm run build`
- [ ] Upload `dist/` folder to web server
- [ ] Upload `backend/` folder to server
- [ ] Configure web server (Nginx/Apache)
- [ ] Install Node.js dependencies: `npm install`
- [ ] Set up environment variables in `.env`
- [ ] Start backend server: `npm start` or use PM2
- [ ] Configure firewall to allow required ports
- [ ] Test frontend: visit your domain
- [ ] Test backend: check API endpoints
- [ ] Test game server connection
- [ ] Test admin panel functionality

## 🚀 Alternative: Cloud Deployment

### Vercel (Frontend Only)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd /Users/sherylgoodhue/web/WOWMMORPG
vercel
```

### Netlify (Frontend Only)
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

### Railway (Full Stack)
```bash
# Install Railway CLI
npm i -g @railway/cli

# Deploy
railway login
railway init
railway up
```

## 🔄 Update Process
```bash
# 1. Pull latest changes
git pull

# 2. Build new version
npm run build

# 3. Upload new dist/ files to server
# 4. Restart backend if needed
pm2 restart azeroth-backend
```

## 📊 Monitoring
```bash
# Check backend logs
pm2 logs azeroth-backend

# Check backend status
pm2 status

# Monitor backend
pm2 monit
```

## 🔍 Troubleshooting
- **Frontend not loading:** Check web server configuration
- **API errors:** Check backend is running on port 3001
- **Database connection:** Verify MySQL credentials and firewall
- **Supabase errors:** Check API keys and RLS policies
- **Game server sync:** Verify MySQL connection to game server