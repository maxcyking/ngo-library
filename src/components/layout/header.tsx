"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, User, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { APP_NAME, APP_TAGLINE, PUBLIC_NAVIGATION } from "@/lib/constants";

interface HeaderProps {
  userRole?: 'guest' | 'user' | 'admin';
}

export function Header({ userRole = 'guest' }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between py-2 border-b border-gray-200">
          <div className="text-sm text-gray-600">
            📞 +91 98765 43210 | ✉️ info@ganeshseva.org
          </div>
          <div className="flex items-center space-x-4">
            {userRole === 'guest' ? (
              <Link href="/login">
                <Button variant="outline" size="sm" className="text-sm">
                  <LogIn className="w-4 h-4 mr-2" />
                  लॉगिन
                </Button>
              </Link>
            ) : (
              <Link href={userRole === 'admin' ? '/admin/dashboard' : '/user/dashboard'}>
                <Button variant="outline" size="sm" className="text-sm">
                  <User className="w-4 h-4 mr-2" />
                  डैशबोर्ड
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Main Navigation */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-800 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">🕉️</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-green-800">{APP_NAME}</h1>
              <p className="text-xs text-gray-600">{APP_TAGLINE}</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {PUBLIC_NAVIGATION.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-700 hover:text-green-600 font-medium transition-colors duration-200 relative group"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 transition-all duration-200 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              {PUBLIC_NAVIGATION.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-gray-700 hover:text-green-600 font-medium py-2 px-4 rounded-md hover:bg-gray-50 transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}