"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  adminOnly = false 
}) => {
  const { user, userProfile, isAdmin, isActiveUser, loading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/admin/login');
        return;
      }
      
      if (adminOnly && (!isAdmin || !isActiveUser)) {
        router.push('/admin/login?error=access_denied');
        return;
      }
    }
  }, [user, userProfile, isAdmin, isActiveUser, loading, router, adminOnly]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">प्रमाणीकरण जांच रहे हैं...</p>
        </div>
      </div>
    );
  }

  if (!user || (adminOnly && (!isAdmin || !isActiveUser))) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">पहुंच अस्वीकृत</h2>
          <p className="text-gray-600 mb-4">
            आपके पास इस पृष्ठ तक पहुंचने की अनुमति नहीं है।
          </p>
          <button
            onClick={() => router.push('/admin/login')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            लॉगिन पृष्ठ पर जाएं
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};