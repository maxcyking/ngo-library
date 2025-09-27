"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Search, Download, Users, Clock, ArrowRight, Star } from "lucide-react";
import Link from "next/link";
import { 
  collection, 
  query, 
  orderBy, 
  limit, 
  onSnapshot, 
  where,
  getDocs
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface BookCategory {
  id: string;
  name: string;
  description: string;
  color: string;
  isActive: boolean;
  bookCount: number;
  order: number;
}

interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  availableCopies: number;
  totalCopies: number;
  issuedCopies: number;
  rating?: number;
  description?: string;
  coverImage?: string;
  createdAt: Date | { seconds: number; nanoseconds: number };
}

export function LibraryShowcase() {
  const [bookCategories, setBookCategories] = useState<BookCategory[]>([]);
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
  const [libraryStats, setLibraryStats] = useState({
    totalBooks: 0,
    totalCopies: 0,
    availableCopies: 0,
    activeMembers: 500,
    monthlyIssues: 0,
    rating: 4.9
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLibraryData();
    const cleanup = setupRealTimeListeners();
    return cleanup;
  }, []);

  const setupRealTimeListeners = () => {
    // Real-time listener for categories
    const categoriesQuery = query(
      collection(db, 'book-categories'),
      where('isActive', '==', true),
      orderBy('order', 'asc'),
      limit(6)
    );

    const unsubscribeCategories = onSnapshot(
      categoriesQuery, 
      (snapshot) => {
        const categoriesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as BookCategory[];
        
        setBookCategories(categoriesData);
      },
      (error) => {
        console.error('Error fetching categories:', error);
        // Set fallback sample data when database is not accessible
        setBookCategories([
          { id: 'sample-1', name: "धार्मिक साहित्य", bookCount: 450, color: "orange", description: "धार्मिक ग्रंथ और आध्यात्मिक पुस्तकें", isActive: true, order: 1 },
          { id: 'sample-2', name: "शैक्षणिक पुस्तकें", bookCount: 680, color: "blue", description: "विभिन्न विषयों की शैक्षणिक सामग्री", isActive: true, order: 2 },
          { id: 'sample-3', name: "उपन्यास", bookCount: 320, color: "purple", description: "हिंदी और अन्य भाषाओं के उपन्यास", isActive: true, order: 3 },
          { id: 'sample-4', name: "बाल साहित्य", bookCount: 280, color: "green", description: "बच्चों के लिए रोचक कहानियां", isActive: true, order: 4 }
        ]);
      }
    );

    // Cleanup function
    return () => {
      unsubscribeCategories();
    };
  };

  const fetchLibraryData = async () => {
    try {

      // Fetch featured books
      const booksQuery = query(
        collection(db, 'books'),
        orderBy('createdAt', 'desc'),
        limit(3)
      );
      
      const booksSnapshot = await getDocs(booksQuery);
      const booksData = booksSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Book[];
      
      setFeaturedBooks(booksData);

      // Calculate stats from all books
      const allBooksQuery = query(collection(db, 'books'));
      const allBooksSnapshot = await getDocs(allBooksQuery);
      
      let totalBooks = 0;
      let totalCopies = 0;
      let availableCopies = 0;
      let issuedCopies = 0;

      allBooksSnapshot.docs.forEach(doc => {
        const book = doc.data();
        totalBooks++;
        totalCopies += book.totalCopies || 0;
        availableCopies += book.availableCopies || 0;
        issuedCopies += book.issuedCopies || 0;
      });

      setLibraryStats({
        totalBooks,
        totalCopies,
        availableCopies,
        activeMembers: 500, // This could be fetched from members collection
        monthlyIssues: issuedCopies,
        rating: 4.9
      });

    } catch (error) {
      console.error('Error fetching library data:', error);
      // Don't set fallback data, let the component show empty state
    } finally {
      setLoading(false);
    }
  };

  const getColorClass = (color: string) => {
    switch (color) {
      case 'orange': return 'bg-orange-100 text-orange-800';
      case 'blue': return 'bg-blue-100 text-blue-800';
      case 'purple': return 'bg-purple-100 text-purple-800';
      case 'green': return 'bg-green-100 text-green-800';
      case 'red': return 'bg-red-100 text-red-800';
      case 'yellow': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const displayStats = [
    { icon: <BookOpen className="w-6 h-6" />, count: `${libraryStats.totalBooks}+`, label: "पुस्तकें उपलब्ध" },
    { icon: <Users className="w-6 h-6" />, count: `${libraryStats.activeMembers}+`, label: "सक्रिय सदस्य" },
    { icon: <Download className="w-6 h-6" />, count: `${libraryStats.monthlyIssues}+`, label: "कुल इश्यू" },
    { icon: <Star className="w-6 h-6" />, count: `${libraryStats.rating}/5`, label: "सदस्य रेटिंग" }
  ];

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">पुस्तकालय डेटा लोड हो रहा है...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            📚 हमारा पुस्तकालय
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            2000+ पुस्तकों का विशाल संग्रह - निःशुल्क सदस्यता और आधुनिक सुविधाएं
          </p>
        </div>

        {/* Library Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {displayStats.map((stat, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="text-blue-600 mb-3 flex justify-center">
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold text-gray-800 mb-1">
                  {stat.count}
                </div>
                <div className="text-sm text-gray-600">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Book Categories */}
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              📖 पुस्तक श्रेणियां
            </h3>
            <div className="space-y-4">
              {bookCategories.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">अभी तक कोई श्रेणी नहीं मिली</p>
                  <p className="text-sm text-gray-500">एडमिन पैनल से श्रेणियां जोड़ें</p>
                </div>
              ) : (
                bookCategories.map((category) => {
                  const maxCount = Math.max(...bookCategories.map(c => c.bookCount));
                  const percentage = maxCount > 0 ? (category.bookCount / maxCount) * 100 : 0;
                  
                  return (
                    <Link key={category.id} href={`/library?category=${category.id}`}>
                      <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group">
                        <div className="flex items-center">
                          <Badge className={`${getColorClass(category.color)} mr-3 group-hover:scale-105 transition-transform`}>
                            {category.bookCount}
                          </Badge>
                          <span className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
                            {category.name}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${Math.min(percentage, 100)}%` }}
                            ></div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                        </div>
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
          </div>

          {/* Featured Books */}
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              ⭐ लोकप्रिय पुस्तकें
            </h3>
            <div className="space-y-4">
              {featuredBooks.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">अभी तक कोई पुस्तक नहीं मिली</p>
                  <p className="text-sm text-gray-500">एडमिन पैनल से पुस्तकें जोड़ें</p>
                </div>
              ) : (
                featuredBooks.map((book) => (
                  <Card key={book.id} className="hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-800 line-clamp-1">
                          {book.title}
                        </h4>
                        <Badge
                          variant={book.availableCopies > 0 ? "default" : "destructive"}
                          className="text-xs"
                        >
                          {book.availableCopies > 0 ? "उपलब्ध" : "इश्यू में"}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        लेखक: {book.author}
                      </p>
                      {book.description && (
                        <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                          {book.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {book.rating ? (
                            <>
                              {[...Array(book.rating)].map((_, i) => (
                                <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                              ))}
                              <span className="text-xs text-gray-500 ml-1">({book.rating}/5)</span>
                            </>
                          ) : (
                            <span className="text-xs text-gray-500">
                              {book.availableCopies}/{book.totalCopies} उपलब्ध
                            </span>
                          )}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {book.category}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Library Services */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-12">
          <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">
            🎯 पुस्तकालय सेवाएं
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">निःशुल्क सदस्यता</h4>
              <p className="text-sm text-gray-600">
                कोई शुल्क नहीं, केवल पहचान पत्र की आवश्यकता
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Search className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">डिजिटल कैटलॉग</h4>
              <p className="text-sm text-gray-600">
                ऑनलाइन पुस्तक खोज और उपलब्धता जांच
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Clock className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">लचीला समय</h4>
              <p className="text-sm text-gray-600">
                सुबह 9:00 से शाम 6:00 तक खुला
              </p>
            </div>
          </div>
        </div>

        {/* New Library Building */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">
                🏗️ नया पुस्तकालय भवन आ रहा है!
              </h3>
              <p className="text-green-100 mb-4">
                35 लाख रुपए की लागत से बन रहा आधुनिक पुस्तकालय भवन जून 2024 में तैयार होगा।
              </p>
              <ul className="space-y-2 text-sm text-green-100 mb-6">
                <li>✓ 5000+ पुस्तकों की क्षमता</li>
                <li>✓ डिजिटल लाइब्रेरी सेक्शन</li>
                <li>✓ 100 व्यक्तियों का रीडिंग हॉल</li>
                <li>✓ सेमिनार हॉल और कंप्यूटर लैब</li>
              </ul>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="secondary" size="lg">
                  प्रगति देखें
                </Button>
                <Button variant="outline" size="lg" className="text-white border-white hover:bg-white hover:text-green-600">
                  दान करें
                </Button>
              </div>
            </div>
            <div className="text-center">
              <img
                src="/api/placeholder/400/300"
                alt="नया पुस्तकालय भवन"
                className="rounded-lg shadow-lg w-full h-auto"
              />
              <div className="mt-4 bg-white bg-opacity-20 rounded-lg p-4">
                <div className="text-2xl font-bold">75%</div>
                <div className="text-sm">निर्माण पूर्ण</div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/library">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                पुस्तक सूची देखें
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline">
                लाइब्रेरी कार्ड के लिए आवेदन करें
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}