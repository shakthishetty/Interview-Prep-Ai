"use server";

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";

const ONE_WEEK = 60 * 60 * 24 * 7; // 1 week in seconds

export async function signUp(params:SignUpParams) {
      const {uid,name,email} = params;
      try{
            const userRecord = await db.collection('users').doc(uid).get();
            if(userRecord.exists) {
                return {
                    success: false,
                    message: "User already exists. Please sign in instead."
                }
            }
             await db.collection('users').doc(uid).set({
                name,
                email,
                hasPaid: false,
                stripeCustomerId: null,
                paymentDate: null,
            });
            return {
                success: true,
                message: "User created successfully."
            }
      }catch(e:any){
          console.log("Error signing in:", e);
          if(e.code === 'auth/email-already-in-use') {
              return {
                  success: false,
                  message: "Email already in use. Please sign in instead."
            }
        } else {
            return {

                success: false,
                message: "Error signing in. Please try again later."
            }
      }
}
}

export async function setSessionCookie(idToken: string) {
    const cookieStore = await cookies();
     const sessionCookie = await auth.createSessionCookie(idToken,{
        expiresIn: ONE_WEEK * 1000
    });
    cookieStore.set('session', sessionCookie, {
        maxAge: ONE_WEEK,
        httpOnly: true,
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
    });
}

export async function signIn(params: SignInParams) {
    const {email, idToken} = params;
    try {
        const userRecord = await auth.getUserByEmail(email);
        if(!userRecord) {
            return {
                success: false,
                message: "User not found. Please sign up."
            }
        }
        
        await setSessionCookie(idToken);
        return {
            success: true,
            message: "User signed in successfully."
        }
       
    } catch (e:any) {
        console.log("Error signing in:", e);
        return {
            success: false,
            message: "Error signing in. Please try again later."
        }
    }

}

export async function getCurrentUser(): Promise<User | null> {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;

    if (!sessionCookie) {
        return null;
    }
    try{
        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
        const userRecord = await db.collection('users').doc(decodedClaims.uid).get();
        if (!userRecord.exists) {
            return null;
        }
        return {
            ...userRecord.data(),
            id: userRecord.id,
        } as User;
    }catch (e:any) {
        console.log("Error getting current user:", e);
        return null;
    }
}

export async function isAuthenticated(){
    const user = await getCurrentUser();
    return !!user;
}

export async function checkUserPaymentStatus(): Promise<{ needsPayment: boolean; user: User | null }> {
    const user = await getCurrentUser();
    
    if (!user) {
        return { needsPayment: false, user: null };
    }
    
    // If user hasn't paid, they need to make payment
    const needsPayment = !user.hasPaid;
    
    return { needsPayment, user };
}

