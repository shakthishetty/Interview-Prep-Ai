// Additional OAuth providers that can be added later
export const additionalOAuthProviders = {
  microsoft: {
    name: 'Microsoft',
    id: 'microsoft',
    icon: '🏢',
    color: 'bg-blue-600 hover:bg-blue-700',
    textColor: 'text-white',
    borderColor: 'border-blue-600',
  },
  apple: {
    name: 'Apple',
    id: 'apple', 
    icon: '🍎',
    color: 'bg-black hover:bg-gray-800',
    textColor: 'text-white',
    borderColor: 'border-black',
  },
  linkedin: {
    name: 'LinkedIn',
    id: 'linkedin',
    icon: '💼', 
    color: 'bg-blue-700 hover:bg-blue-800',
    textColor: 'text-white',
    borderColor: 'border-blue-700',
  }
}

// OAuth configuration tips for production
export const oauthProductionTips = {
  google: {
    setup: "Configure Google OAuth in Google Cloud Console",
    scopes: ["email", "profile"],
    redirectUri: "Your domain + /api/auth/callback/google"
  },
  github: {
    setup: "Configure GitHub OAuth in GitHub Developer Settings", 
    scopes: ["user:email"],
    redirectUri: "Your domain + /api/auth/callback/github"
  }
}
