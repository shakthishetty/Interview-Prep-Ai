import { auth } from '@/firebase/client';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { oauthSignIn } from './actions/auth.action';

// Initialize Google provider
const googleProvider = new GoogleAuthProvider();

// Add additional scopes if needed
googleProvider.addScope('profile');
googleProvider.addScope('email');

export const oauthService = {
  // Sign in with Google
  async signInWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Save user to Firestore and create session
      const authResult = await oauthSignIn({
        uid: user.uid,
        name: user.displayName || '',
        email: user.email || '',
        provider: 'google'
      });

      if (!authResult.success) {
        return authResult;
      }
      
      return {
        success: true,
        user: {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          image: user.photoURL,
        }
      };
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      return {
        success: false,
        message: error.message || 'Failed to sign in with Google'
      };
    }
  },

  // Sign out
  async signOut() {
    try {
      await signOut(auth);
      return {
        success: true,
        message: 'Signed out successfully'
      };
    } catch (error: any) {
      console.error('Sign-out error:', error);
      return {
        success: false,
        message: error.message || 'Failed to sign out'
      };
    }
  }
};
