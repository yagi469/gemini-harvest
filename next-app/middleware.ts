import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtected = createRouteMatcher([
  '/',
  '/harvests/all',
  '/harvests/(.*)',
  '/api/harvests(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)',
  // 必要に応じて他の保護したいパターンを追加
]);

export default clerkMiddleware((auth, req) => {
  if (isProtected(req)) {
    auth.protect?.(); // または auth().protect(), Clerkバージョンに応じて
  }
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
