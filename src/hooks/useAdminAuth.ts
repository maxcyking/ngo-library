"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface UseAdminAuthOptions {
  redirectTo?: string;
  requireAdmin?: boolean;
}

export const useAdminAuth = (options: UseAdminAuthOptions = {}) => {
  const { 
    user, 
    userProfile, 
    isAdmin, 
    isActiveUser, 
    loading 
  } = useAuth();
  
  const router = useRouter();
  const pathname = usePathname();
  
  const {
    redirectTo = '/admin/login',
    requireAdmin = true
  } = options;

  useEffect(() => {
    if (!loading) {
      // If no user is authenticated
      if (!user) {
        const redirectUrl = encodeURIComponent(pathname);
        router.push(`${redirectTo}?redirect=${redirectUrl}`);
        return;
      }

      // If admin access is required but user doesn't have it
      if (requireAdmin && (!isAdmin || !isActiveUser)) {
        const redirectUrl = encodeURIComponent(pathname);
        router.push(`${redirectTo}?error=access_denied&redirect=${redirectUrl}`);
        return;
      }
    }
  }, [user, isAdmin, isActiveUser, loading, router, pathname, redirectTo, requireAdmin]);

  return {
    user,
    userProfile,
    isAdmin,
    isActiveUser,
    loading,
    isAuthenticated: !!user,
    hasAdminAccess: isAdmin && isActiveUser,
    canAccess: !loading && user && (!requireAdmin || (isAdmin && isActiveUser))
  };
};
