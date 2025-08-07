import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get both types of session cookies
  const sessionCookie = request.cookies.get('session');
  const userSessionCookie = request.cookies.get('user_session');
  const hasValidSession = sessionCookie || userSessionCookie;
  
  // Public routes that don't require authentication
  const publicRoutes = ['/sign-in', '/sign-up', '/payment/success', '/payment/cancel'];
  const isPublicRoute = publicRoutes.includes(pathname);
  
  // API routes and static files - always allow
  if (pathname.startsWith('/api') || pathname.startsWith('/_next') || pathname.includes('.')) {
    return NextResponse.next();
  }

  // If user is not authenticated, redirect to sign-in (except for public routes)
  if (!hasValidSession && !isPublicRoute) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // DON'T redirect authenticated users away from auth pages in middleware
  // Let the auth layout handle this to avoid conflicts
  // Only handle payment pages here
  if (hasValidSession && (pathname === '/payment/success' || pathname === '/payment/cancel')) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
