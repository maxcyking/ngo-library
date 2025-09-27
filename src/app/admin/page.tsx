"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminIndexPage() {
  const router = useRouter();
  const { user, isAdmin, isActiveUser, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user && isAdmin && isActiveUser) {
        // User is authenticated and is admin, redirect to dashboard
        router.replace('/admin/dashboard');
      } else {
        // User is not authenticated or not admin, redirect to login
        router.replace('/admin/login');
      }
    }
  }, [user, isAdmin, isActiveUser, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">
          {loading ? 'प्रमाणीकरण जांच रहे हैं...' : 'आपको सही पेज पर भेजा जा रहा है...'}
        </p>
      </div>
    </div>
  );
}
