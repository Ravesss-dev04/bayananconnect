import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const userData = request.cookies.get('user_data')?.value;
  const { pathname } = request.nextUrl;

  // Redirect to login if accessing protected routes without auth
  const protectedRoutes = ['/resident', '/dashboard'];
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );
  // Redirect to login if trying to access protected route without auth
  if (isProtectedRoute && !userData) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirect to dashboard if trying to access login/register while logged in
  const authRoutes = ['/login', '/register'];
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  if (isAuthRoute && userData) {
    return NextResponse.redirect(new URL('/resident', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};