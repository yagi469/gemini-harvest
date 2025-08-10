import { useAuth as useClerkAuth, useUser } from '@clerk/nextjs';

export function useAuth() {
  const { isSignedIn, isLoaded, userId } = useClerkAuth();
  const { user } = useUser();

  return {
    isSignedIn,
    isLoaded,
    userId,
    user,
  };
}
