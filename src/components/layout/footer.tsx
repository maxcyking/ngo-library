"use client";

import React from "react";
import Link from "next/link";
import { Facebook, Twitter, Instagram, Youtube, Phone, Mail, MapPin } from "lucide-react";
import { APP_NAME, CONTACT_INFO, SOCIAL_LINKS, WORK_AREAS } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Organization Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">🕉️</span>
              </div>
              <h3 className="text-xl font-bold">{APP_NAME}</h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              हमारी संस्था शिक्षा, स्वास्थ्य और सामाजिक सेवा के क्षेत्र में निरंतर कार्य कर रही है। 
              हमारा उद्देश्य समाज के कल्याण और विकास में योगदान देना है।
            </p>
            <div className="flex space-x-4">
              <a href={SOCIAL_LINKS.facebook} className="text-gray-400 hover:text-blue-500 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href={SOCIAL_LINKS.twitter} className="text-gray-400 hover:text-blue-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href={SOCIAL_LINKS.instagram} className="text-gray-400 hover:text-pink-500 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href={SOCIAL_LINKS.youtube} className="text-gray-400 hover:text-red-500 transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-green-400">त्वरित लिंक</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors text-sm">
                  संस्था का परिचय
                </Link>
              </li>
              <li>
                <Link href="/library" className="text-gray-300 hover:text-white transition-colors text-sm">
                  साहित्य सूची
                </Link>
              </li>
              <li>
                <Link href="/donations" className="text-gray-300 hover:text-white transition-colors text-sm">
                  दान सूची
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-gray-300 hover:text-white transition-colors text-sm">
                  सदस्यता पंजीकरण
                </Link>
              </li>
              <li>
                <Link href="/media/events" className="text-gray-300 hover:text-white transition-colors text-sm">
                  आगामी कार्यक्रम
                </Link>
              </li>
            </ul>
          </div>

          {/* Work Areas */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-green-400">कार्य क्षेत्र</h4>
            <ul className="space-y-2">
              {WORK_AREAS.map((area, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <span className="text-lg">{area.icon}</span>
                  <span className="text-gray-300 text-sm">{area.title}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-green-400">संपर्क जानकारी</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <p className="text-gray-300 text-sm">{CONTACT_INFO.address}</p>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-green-400 flex-shrink-0" />
                <p className="text-gray-300 text-sm">{CONTACT_INFO.phone}</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-green-400 flex-shrink-0" />
                <p className="text-gray-300 text-sm">{CONTACT_INFO.email}</p>
              </div>
              <div className="mt-4 p-3 bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-300">
                  <strong className="text-green-400">समय:</strong><br />
                  {CONTACT_INFO.timings}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © 2024 {APP_NAME}. सभी अधिकार सुरक्षित।
            </p>
            <div className="flex space-x-6">
              <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                गोपनीयता नीति
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                नियम और शर्तें
              </Link>
              <Link href="/sitemap" className="text-gray-400 hover:text-white text-sm transition-colors">
                साइट मैप
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}