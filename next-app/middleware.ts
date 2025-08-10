import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware({
  // 認証が必要なページ
  publicRoutes: [
    "/",
    "/harvests/all",
    "/harvests/(.*)",
    "/api/harvests(.*)",
    "/sign-in(.*)",
    "/sign-up(.*)",
  ],
  // 認証が必要なページ
  ignoredRoutes: [
    "/api/webhook(.*)",
  ],
});

export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
};
