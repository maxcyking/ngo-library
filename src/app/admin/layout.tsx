"use client";

import React, { useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Users, 
  BookOpen, 
  Heart, 
  Calendar, 
  FileText, 
  Settings,
  LogOut,
  BarChart3,
  Menu,
  X,
  Home,
  Palette,
  UserPlus,
  ImageIcon,
  GraduationCap,
  Award
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navigation = [
    { name: 'डैशबोर्ड', href: '/admin/dashboard', icon: Home },
    { name: 'सदस्य प्रबंधन', href: '/admin/members', icon: Users },
    { name: 'पुस्तक प्रबंधन', href: '/admin/books', icon: BookOpen },
    { name: 'प्रवेश प्रबंधन', href: '/admin/admissions', icon: GraduationCap },
    { name: 'प्रमाणपत्र प्रबंधन', href: '/admin/certificates', icon: Award },
    { name: 'UI प्रबंधन', href: '/admin/ui', icon: Palette },
    { name: 'दान प्रबंधन', href: '/admin/donations', icon: Heart },
    { name: 'कार्यक्रम प्रबंधन', href: '/admin/events', icon: Calendar },
    { name: 'समाचार प्रबंधन', href: '/admin/news', icon: FileText },
    { name: 'मीडिया/गैलरी प्रबंधन', href: '/admin/media', icon: ImageIcon },
    { name: 'रिपोर्ट्स', href: '/admin/analytics', icon: BarChart3 },
    { name: 'सेटिंग्स', href: '/admin/settings', icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === '/admin/dashboard') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  // Check if current page is login page
  const isLoginPage = pathname === '/admin/login';

  // If it's login page, don't apply ProtectedRoute
  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <ProtectedRoute adminOnly={true}>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75"></div>
          </div>
        )}

        {/* Sidebar */}
        <div className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">
              एडमिन पैनल
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <nav className="mt-4 px-2">
            <div className="space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                    ${isActive(item.href)
                      ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className={`
                    mr-3 h-5 w-5 flex-shrink-0
                    ${isActive(item.href) ? 'text-blue-700' : 'text-gray-400 group-hover:text-gray-500'}
                  `} />
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>

          {/* User info and logout */}
          <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
            <div className="flex items-center mb-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.email}
                </p>
                <p className="text-xs text-gray-500">
                  एडमिन
                </p>
              </div>
            </div>
            <Button 
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="w-full flex items-center justify-center"
            >
              <LogOut className="w-4 h-4 mr-2" />
              लॉगआउट
            </Button>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile header */}
          <div className="lg:hidden bg-white shadow-sm border-b border-gray-200">
            <div className="flex items-center justify-between h-16 px-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              <h1 className="text-lg font-semibold text-gray-800">
                एडमिन पैनल
              </h1>
              <div className="w-8"></div>
            </div>
          </div>

          {/* Page content */}
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}