# MongoDB Setup Guide

## Option 1: MongoDB Atlas (Recommended - Free Cloud Database)

### Step 1: Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/atlas
2. Click "Try Free" and create an account
3. Choose "Build a Database"
4. Select "FREE" tier (M0)
5. Choose a cloud provider (AWS/Google Cloud/Azure) and region
6. Click "Create"

### Step 2: Set Up Database Access
1. In the left sidebar, click "Database Access"
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create a username and password (save these!)
5. Select "Read and write to any database"
6. Click "Add User"

### Step 3: Set Up Network Access
1. In the left sidebar, click "Network Access"
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for development)
4. Click "Confirm"

### Step 4: Get Your Connection String
1. Go back to "Database" in the sidebar
2. Click "Connect"
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your actual password
6. Replace `<dbname>` with `talentai`

### Step 5: Update Your .env File
Update your `.env` file with the connection string:

```
MONGODB_URI=mongodb+srv://yourusername:yourpassword@cluster0.xxxxx.mongodb.net/talentai?retryWrites=true&w=majority
```

## Option 2: Install MongoDB Locally

### Windows:
1. Download MongoDB Community Server from: https://www.mongodb.com/try/download/community
2. Run the installer
3. Choose "Complete" installation
4. Install MongoDB Compass (optional but helpful)
5. Start MongoDB service

### macOS:
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb/brew/mongodb-community
```

### Linux (Ubuntu):
```bash
sudo apt update
sudo apt install mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

## After Setup

Once you have MongoDB running (either Atlas or local), run:

```bash
npm run seed
```

This will populate your database with:
- 1 Admin user (admin@talentai.com / admin123)
- 1 Dummy user (user@example.com / user123)
- 1 Recruiter (recruiter@techcorp.com / recruiter123)
- 100,000 Virtual candidates
- 25 Sample jobs
- 1 Active challenge
