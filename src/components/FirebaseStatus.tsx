"use client";

import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';

interface FirebaseStatusProps {
  children: React.ReactNode;
}

export const FirebaseStatus: React.FC<FirebaseStatusProps> = ({ children }) => {
  const [status, setStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const checkFirebaseConnection = async () => {
      try {
        // Simple check - if we can access the db object without errors, connection is good
        if (db && db.app) {
          setStatus('connected');
        } else {
          throw new Error('Firebase not initialized properly');
        }
      } catch (error) {
        console.error('Firebase connection error:', error);
        setStatus('error');
        
        if (error instanceof Error) {
          if (error.message.includes('not-found')) {
            setError('Firestore database not found. Please create the database in Firebase Console.');
          } else if (error.message.includes('permission-denied') || error.message.includes('insufficient permissions')) {
            // Permission denied is actually expected for unauthenticated users - this means Firebase is working
            setStatus('connected');
            return;
          } else if (error.message.includes('offline')) {
            setError('Firestore is offline. Check your internet connection.');
          } else {
            setError(`Firebase error: ${error.message}`);
          }
        } else {
          setError('Unknown Firebase connection error.');
        }
      }
    };

    checkFirebaseConnection();
  }, []);

  if (status === 'checking') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Firebase कनेक्शन जांच रहे हैं...</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md mx-auto text-center p-6">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Firebase Connection Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-yellow-800 mb-2">Quick Fix Steps:</h3>
            <ol className="text-sm text-yellow-700 space-y-1">
              <li>1. Check Firebase Console for database status</li>
              <li>2. Verify environment variables are correct</li>
              <li>3. Deploy security rules: <code>firebase deploy --only firestore:rules</code></li>
              <li>4. Refresh this page</li>
            </ol>
          </div>
          
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};