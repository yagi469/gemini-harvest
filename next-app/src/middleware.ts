import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// パブリックルートの定義
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/harvests/all',
  '/harvests/(.*)',
]);

// 管理者専用ルートの定義
const isAdminRoute = createRouteMatcher(['/admin(.*)']);

// ファーマー専用ルートの定義
const isFarmerRoute = createRouteMatcher(['/farmer-dashboard(.*)']);

export default clerkMiddleware(async (auth, req) => {
  console.log('🚀 Middleware: Request received for path:', req.nextUrl.pathname);

  if (isPublicRoute(req)) {
    console.log('✅ Middleware: Public route, proceeding.');
    return NextResponse.next();
  }

  const { userId, sessionClaims } = await auth();

  console.log('👤 Middleware: User ID:', userId);
  console.log('🔑 Middleware: Session Claims:', sessionClaims);

  if (!userId) {
    console.log('❌ Middleware: User not authenticated, redirecting to sign-in.');
    const signInUrl = new URL('/sign-in', req.url);
    signInUrl.searchParams.set('redirect_url', req.url);
    return NextResponse.redirect(signInUrl);
  }

  const userRoles = (sessionClaims?.metadata as { role?: string[] })?.role || [];
  console.log('👥 Middleware: User Roles:', userRoles);

  const hasRole = (role: string) => {
    const result = userRoles.includes(role);
    console.log(`🔍 Middleware: User has role "${role}":`, result);
    return result;
  };

  if (isAdminRoute(req) && !hasRole('admin')) {
    console.log('❌ Middleware: Not admin, redirecting from admin route.');
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (isFarmerRoute(req) && !hasRole('farmer')) {
    console.log('❌ Middleware: Not farmer, redirecting from farmer dashboard.');
    return NextResponse.redirect(new URL('/', req.url));
  }

  console.log('✅ Middleware: Access granted, proceeding.');
  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!.*\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
