"use client";

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DebugPage() {
  const { user, userProfile, isAdmin, isActiveUser, loading } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">🔍 Debug Information</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Firebase Auth Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div><strong>Loading:</strong> {loading ? '✅ Yes' : '❌ No'}</div>
                <div><strong>User:</strong> {user ? '✅ Authenticated' : '❌ Not authenticated'}</div>
                <div><strong>User UID:</strong> {user?.uid || 'N/A'}</div>
                <div><strong>User Email:</strong> {user?.email || 'N/A'}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>User Profile Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div><strong>Profile Loaded:</strong> {userProfile ? '✅ Yes' : '❌ No'}</div>
                <div><strong>Is Admin:</strong> {isAdmin ? '✅ Yes' : '❌ No'}</div>
                <div><strong>Is Active:</strong> {isActiveUser ? '✅ Yes' : '❌ No'}</div>
                <div><strong>Role:</strong> {userProfile?.role || 'N/A'}</div>
                <div><strong>Name:</strong> {userProfile?.name || 'N/A'}</div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Raw Data</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <strong>User Object:</strong>
                  <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                    {JSON.stringify(user ? {
                      uid: user.uid,
                      email: user.email,
                      emailVerified: user.emailVerified
                    } : null, null, 2)}
                  </pre>
                </div>
                
                <div>
                  <strong>User Profile Object:</strong>
                  <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                    {JSON.stringify(userProfile, null, 2)}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <a href="/admin/login" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Go to Admin Login
                </a>
                <a href="/admin/dashboard" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                  Try Admin Dashboard
                </a>
                <Link href="/" className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
                  Go to Home
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
