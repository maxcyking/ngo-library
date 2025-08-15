"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, BookOpen, Filter, Download } from "lucide-react";
import { BOOK_CATEGORIES, LANGUAGES } from "@/lib/constants";

// Sample book data - यह बाद में database से आएगा
const sampleBooks = [
  {
    id: "1",
    title: "श्रीमद्भगवद्गीता",
    author: "महर्षि वेदव्यास",
    category: "धार्मिक साहित्य",
    language: "hindi",
    totalCopies: 5,
    availableCopies: 3,
    isbn: "978-81-7224-000-1",
    description: "भगवान श्रीकृष्ण द्वारा अर्जुन को दिया गया अमर उपदेश",
    coverImage: "/api/placeholder/200/300"
  },
  {
    id: "2", 
    title: "रामायण",
    author: "महर्षि वाल्मीकि",
    category: "धार्मिक साहित्य",
    language: "hindi",
    totalCopies: 4,
    availableCopies: 2,
    isbn: "978-81-7224-001-8",
    description: "भगवान राम के जीवन चरित्र पर आधारित महाकाव्य",
    coverImage: "/api/placeholder/200/300"
  },
  {
    id: "3",
    title: "गणित - कक्षा 10",
    author: "NCERT",
    category: "शैक्षणिक पुस्तकें",
    language: "hindi",
    totalCopies: 10,
    availableCopies: 7,
    isbn: "978-93-5007-000-1",
    description: "कक्षा 10 के लिए गणित की पाठ्यपुस्तक",
    coverImage: "/api/placeholder/200/300"
  },
  {
    id: "4",
    title: "विज्ञान - कक्षा 9",
    author: "NCERT",
    category: "शैक्षणिक पुस्तकें", 
    language: "hindi",
    totalCopies: 8,
    availableCopies: 5,
    isbn: "978-93-5007-001-8",
    description: "कक्षा 9 के लिए विज्ञान की पाठ्यपुस्तक",
    coverImage: "/api/placeholder/200/300"
  },
  {
    id: "5",
    title: "हरी घास के ये दिन",
    author: "फणीश्वरनाथ रेणु",
    category: "उपन्यास",
    language: "hindi",
    totalCopies: 3,
    availableCopies: 1,
    isbn: "978-81-267-0000-1",
    description: "प्रसिद्ध हिंदी उपन्यास",
    coverImage: "/api/placeholder/200/300"
  },
  {
    id: "6",
    title: "कामायनी",
    author: "जयशंकर प्रसाद",
    category: "कविता संग्रह",
    language: "hindi",
    totalCopies: 2,
    availableCopies: 2,
    isbn: "978-81-267-0001-8",
    description: "हिंदी साहित्य का अमर महाकाव्य",
    coverImage: "/api/placeholder/200/300"
  }
];

export default function LibraryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [filteredBooks, setFilteredBooks] = useState(sampleBooks);

  // Filter books based on search and filters
  React.useEffect(() => {
    let filtered = sampleBooks;

    if (searchQuery) {
      filtered = filtered.filter(book => 
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(book => book.category === selectedCategory);
    }

    if (selectedLanguage) {
      filtered = filtered.filter(book => book.language === selectedLanguage);
    }

    setFilteredBooks(filtered);
  }, [searchQuery, selectedCategory, selectedLanguage]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedLanguage("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              📚 पुस्तकालय सूची
            </h1>
            <p className="text-xl mb-8">
              2000+ पुस्तकों का विशाल संग्रह - निःशुल्क उपलब्ध
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-white bg-opacity-20 p-4 rounded-lg">
                <div className="text-2xl font-bold">2000+</div>
                <div className="text-sm">कुल पुस्तकें</div>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-lg">
                <div className="text-2xl font-bold">10+</div>
                <div className="text-sm">विषय श्रेणियां</div>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-lg">
                <div className="text-2xl font-bold">निःशुल्क</div>
                <div className="text-sm">सदस्यता</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              {/* Search */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  पुस्तक खोजें
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="पुस्तक का नाम या लेखक का नाम..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  श्रेणी
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">सभी श्रेणियां</option>
                  {BOOK_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Language Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  भाषा
                </label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">सभी भाषाएं</option>
                  {Object.entries(LANGUAGES).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Filter Actions */}
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-gray-600">
                {filteredBooks.length} पुस्तकें मिलीं
              </div>
              <Button
                variant="outline"
                onClick={clearFilters}
                className="text-sm"
              >
                <Filter className="w-4 h-4 mr-2" />
                फिल्टर साफ़ करें
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Books Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <Card key={book.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="p-4">
                  <div className="aspect-[2/3] bg-gray-200 rounded-lg mb-4 overflow-hidden">
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardTitle className="text-lg font-semibold text-gray-800 line-clamp-2">
                    {book.title}
                  </CardTitle>
                  <p className="text-sm text-gray-600">लेखक: {book.author}</p>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {book.category}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {LANGUAGES[book.language as keyof typeof LANGUAGES]}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {book.description}
                    </p>
                    
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">
                        उपलब्ध: {book.availableCopies}/{book.totalCopies}
                      </span>
                      <Badge 
                        variant={book.availableCopies > 0 ? "success" : "destructive"}
                        className="text-xs"
                      >
                        {book.availableCopies > 0 ? "उपलब्ध" : "अनुपलब्ध"}
                      </Badge>
                    </div>

                    {book.isbn && (
                      <p className="text-xs text-gray-500">
                        ISBN: {book.isbn}
                      </p>
                    )}

                    <Button 
                      className="w-full mt-4" 
                      disabled={book.availableCopies === 0}
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      {book.availableCopies > 0 ? "इश्यू करें" : "अनुपलब्ध"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredBooks.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                कोई पुस्तक नहीं मिली
              </h3>
              <p className="text-gray-600 mb-4">
                कृपया अपनी खोज या फिल्टर बदलकर पुनः प्रयास करें
              </p>
              <Button onClick={clearFilters}>
                सभी पुस्तकें देखें
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Library Information */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              पुस्तकालय की जानकारी
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-blue-600">
                    📖 सदस्यता नियम
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-gray-600">
                    <li>• सदस्यता पूर्णतः निःशुल्क है</li>
                    <li>• पहचान पत्र की फोटोकॉपी आवश्यक</li>
                    <li>• एक समय में अधिकतम 2 पुस्तकें</li>
                    <li>• वापसी की अवधि 15 दिन</li>
                    <li>• देर से वापसी पर ₹2 प्रति दिन जुर्माना</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-green-600">
                    ⏰ समय सारणी
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-gray-600">
                    <div>
                      <strong>सोमवार - शनिवार:</strong><br />
                      सुबह 9:00 से शाम 6:00 तक
                    </div>
                    <div>
                      <strong>रविवार:</strong><br />
                      सुबह 10:00 से शाम 4:00 तक
                    </div>
                    <div className="text-sm text-red-600">
                      * सरकारी छुट्टियों में बंद
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-8">
              <Button size="lg" className="mr-4">
                <Download className="w-4 h-4 mr-2" />
                पुस्तक सूची डाउनलोड करें
              </Button>
              <Button variant="outline" size="lg">
                सदस्यता के लिए आवेदन करें
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}