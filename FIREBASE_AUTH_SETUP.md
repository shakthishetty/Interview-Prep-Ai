# Firebase Authentication Setup Guide

## Error: auth/operation-not-allowed

This error occurs when authentication methods are not enabled in Firebase Console.

## Quick Fix Steps:

### 1. Enable Email/Password Authentication
1. Go to https://console.firebase.google.com
2. Select your project
3. Click **"Authentication"** → **"Sign-in method"**
4. Click **"Email/Password"** 
5. Toggle **"Enable"** to ON
6. Click **"Save"**

### 2. Enable Google Authentication (Optional)
1. Click **"Google"** in sign-in methods
2. Toggle **"Enable"** to ON
3. Add your **Project support email** (required field)
4. Click **"Save"**

### 3. Enable GitHub Authentication (Optional)
1. **First, create GitHub OAuth App:**
   - Go to https://github.com/settings/developers
   - Click **"New OAuth App"**
   - Fill in:
     - **Application name:** InterviewPrep AI
     - **Homepage URL:** http://localhost:3000 (or your domain)
     - **Authorization callback URL:** (copy from Firebase Console)
   - Get **Client ID** and **Client Secret**

2. **Then in Firebase Console:**
   - Click **"GitHub"** in sign-in methods  
   - Toggle **"Enable"** to ON
   - Enter **Client ID** and **Client Secret** from GitHub
   - Click **"Save"**

## After Enabling Authentication:

1. **Test Email/Password first** - it should work immediately
2. **Uncomment OAuth buttons** in AuthForm.tsx by changing `{false &&` to `{true &&`
3. **Test Google/GitHub login**

## Current Status:
- ✅ Email/Password: Ready to enable
- ⏳ Google OAuth: Needs Firebase Console setup
- ⏳ GitHub OAuth: Needs GitHub App + Firebase Console setup

## Environment Variables Needed:
```bash
# Already configured in your .env.local:
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
# ... etc
```

Once you enable Email/Password authentication in Firebase Console, the auth/operation-not-allowed error should be resolved!
