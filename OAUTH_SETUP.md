# OAuth Setup Guide

## Required Environment Variables

Add these to your `.env.local` file:

```env
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# GitHub OAuth  
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here
```

## Google OAuth Setup

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Create a new project** or select existing
3. **Enable Google+ API**:
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API" and enable it
4. **Create OAuth credentials**:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:3000` (for development)
     - `https://yourdomain.com` (for production)
5. **Copy Client ID and Secret** to your `.env.local`

## GitHub OAuth Setup

1. **Go to GitHub Settings**: https://github.com/settings/developers
2. **Click "New OAuth App"**
3. **Fill in details**:
   - Application name: `InterviewPrep AI`
   - Homepage URL: `http://localhost:3000` (or your domain)
   - Authorization callback URL: `http://localhost:3000` (or your domain)
4. **Copy Client ID and Secret** to your `.env.local`

## Benefits of OAuth Integration

### ✅ For Users:
- **One-click sign in** with Google/GitHub
- **No password to remember**
- **Faster registration process**
- **Trusted authentication providers**

### ✅ For Google Pay:
- **Automatic Google sign-in** when using Google OAuth
- **Better Google Pay visibility** since user is already authenticated
- **Seamless payment experience**

### ✅ For Your App:
- **Reduced authentication complexity**
- **Better user experience**
- **Higher conversion rates**
- **More secure authentication**

## Testing OAuth

After setting up:

1. **Add environment variables** to `.env.local`
2. **Restart your development server**: `npm run dev`
3. **Visit sign-in page**: You should see Google and GitHub buttons
4. **Test Google sign-in**: This will also help with Google Pay later
5. **Test GitHub sign-in**: Alternative OAuth option

## OAuth + Google Pay Flow

1. **User signs in with Google OAuth** → Already authenticated with Google
2. **User goes to payment** → Google Pay automatically available
3. **Better payment conversion** → Users don't need to set up Google Pay separately

## Next Steps

1. Set up OAuth credentials
2. Add environment variables
3. Test authentication
4. Google Pay should work better for Google OAuth users
