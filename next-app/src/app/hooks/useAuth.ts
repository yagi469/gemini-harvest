import { useAuth as useClerkAuth, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function useAuth() {
  const { isSignedIn, isLoaded, userId } = useClerkAuth();
  const { user } = useUser();
  const router = useRouter();

  // 認証が必要なページへのリダイレクト
  const requireAuth = (redirectTo: string = '/') => {
    useEffect(() => {
      if (isLoaded && !isSignedIn) {
        router.push(redirectTo);
      }
    }, [isLoaded, isSignedIn, router, redirectTo]);
  };

  // ログイン済みユーザーのみアクセス可能
  const requireSignedIn = (redirectTo: string = '/') => {
    useEffect(() => {
      if (isLoaded && !isSignedIn) {
        router.push(redirectTo);
      }
    }, [isLoaded, isSignedIn, router, redirectTo]);
  };

  // 未ログインユーザーのみアクセス可能（ログインページなど）
  const requireSignedOut = (redirectTo: string = '/') => {
    useEffect(() => {
      if (isLoaded && isSignedIn) {
        router.push(redirectTo);
      }
    }, [isLoaded, isSignedIn, router, redirectTo]);
  };

  return {
    isSignedIn,
    isLoaded,
    userId,
    user,
    requireAuth,
    requireSignedIn,
    requireSignedOut,
  };
}
