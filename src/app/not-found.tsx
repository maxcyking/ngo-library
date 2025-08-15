"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center px-4">
        <div className="text-6xl mb-8">🔍</div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-600 mb-6">
          पृष्ठ नहीं मिला
        </h2>
        <p className="text-gray-500 mb-8">
          क्षमा करें, आपके द्वारा खोजा गया पृष्ठ उपलब्ध नहीं है।
          यह हटा दिया गया हो सकता है या URL गलत हो सकता है।
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button className="flex items-center">
              <Home className="w-4 h-4 mr-2" />
              मुख्य पृष्ठ पर जाएं
            </Button>
          </Link>
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            वापस जाएं
          </Button>
        </div>

        <div className="mt-12 text-sm text-gray-400">
          <p>यदि आपको लगता है कि यह एक त्रुटि है, तो कृपया हमसे संपर्क करें:</p>
          <p className="mt-2">
            📞 +91 99518 00733 |
            ✉️ arogyapustkalaya@gmail.com
          </p>
        </div>
      </div>
    </div>
  );
}