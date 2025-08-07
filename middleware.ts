import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get the session cookie
  const sessionCookie = request.cookies.get('session');
  
  // Public routes that don't require authentication
  const publicRoutes = ['/sign-in', '/sign-up', '/payment/success', '/payment/cancel'];
  const isPublicRoute = publicRoutes.includes(pathname);
  
  // API routes and static files
  if (pathname.startsWith('/api') || pathname.startsWith('/_next') || pathname.includes('.')) {
    return NextResponse.next();
  }

  // If user is not authenticated, redirect to sign-in
  if (!sessionCookie && !isPublicRoute) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // If user is authenticated and trying to access auth pages, redirect to home or payment
  if (sessionCookie && isPublicRoute && pathname !== '/payment/success' && pathname !== '/payment/cancel') {
    // We can't easily check payment status here without making a DB call
    // So we'll redirect to home and let the client-side handle payment checks
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
