"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Lock, Mail, Eye, EyeOff, AlertCircle, Home } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login, user, isAdmin, isActiveUser } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get redirect URL and error from query parameters
  const redirectUrl = searchParams.get('redirect');
  const urlError = searchParams.get('error');

  // Set initial error from URL parameter
  useEffect(() => {
    if (urlError === 'access_denied') {
      setError('पहुंच अस्वीकृत: आपके पास एडमिन अधिकार नहीं हैं या आपका खाता निष्क्रिय है।');
    }
  }, [urlError]);

  // Redirect if already logged in as admin
  React.useEffect(() => {
    if (user && isAdmin && isActiveUser) {
      router.push('/admin/dashboard');
    }
  }, [user, isAdmin, isActiveUser, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Attempting login...');
      await login(email, password);
      console.log('Login successful, redirecting to dashboard...');
      router.push('/admin/dashboard');
    } catch (error) {
      let errorMessage = 'कुछ गलत हुआ है';
      
      if (error instanceof Error) {
        if (error.message.includes('Access denied')) {
          errorMessage = 'पहुंच अस्वीकृत: आपके पास एडमिन अधिकार नहीं हैं या आपका खाता निष्क्रिय है।';
        } else if (error.message.includes('User profile not found')) {
          errorMessage = 'उपयोगकर्ता प्रोफाइल नहीं मिला। कृपया व्यवस्थापक से संपर्क करें।';
        } else if (error.message.includes('user-not-found')) {
          errorMessage = 'यह ईमेल पता पंजीकृत नहीं है।';
        } else if (error.message.includes('wrong-password')) {
          errorMessage = 'गलत पासवर्ड। कृपया पुनः प्रयास करें।';
        } else if (error.message.includes('invalid-email')) {
          errorMessage = 'अमान्य ईमेल पता।';
        } else if (error.message.includes('too-many-requests')) {
          errorMessage = 'बहुत सारे असफल प्रयास। कृपया बाद में पुनः प्रयास करें।';
        } else {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">
            एडमिन लॉगिन
          </CardTitle>
          <p className="text-gray-600">
            एरोज्ञा पुस्तकालय एवं सेवा संस्था
          </p>
          {redirectUrl && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <div className="flex items-center text-blue-700 text-sm">
                <AlertCircle className="w-4 h-4 mr-2" />
                एडमिन एरिया एक्सेस करने के लिए लॉगिन करें
              </div>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm flex items-start">
                <AlertCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ईमेल पता
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@arogyabmr.org"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                पासवर्ड
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="पासवर्ड दर्ज करें"
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? 'लॉगिन हो रहा है...' : 'लॉगिन करें'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-4">
              केवल अधिकृत व्यक्ति ही लॉगिन कर सकते हैं
            </p>
            <button
              type="button"
              onClick={() => router.push('/')}
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 transition-colors"
            >
              <Home className="w-4 h-4 mr-1" />
              मुख्य पेज पर वापस जाएं
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}