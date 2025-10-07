"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Search } from 'lucide-react';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  where
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
  isbn?: string;
  publisher?: string;
  publishedYear?: number;
}

export default function LibraryPage() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  
  const [categories, setCategories] = useState<BookCategory[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam || 'all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
    fetchBooks();
  }, []);

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  useEffect(() => {
    filterBooks();
  }, [books, selectedCategory, searchTerm]);

  const fetchCategories = async () => {
    try {
      const categoriesQuery = query(
        collection(db, 'book-categories'),
        where('isActive', '==', true),
        orderBy('order', 'asc')
      );
      
      const unsubscribe = onSnapshot(categoriesQuery, (snapshot) => {
        const categoriesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as BookCategory[];
        
        setCategories(categoriesData);
      });

      return unsubscribe;
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchBooks = async () => {
    try {
      const booksQuery = query(
        collection(db, 'books'),
        orderBy('title', 'asc')
      );
      
      const unsubscribe = onSnapshot(booksQuery, (snapshot) => {
        const booksData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Book[];
        
        setBooks(booksData);
        setLoading(false);
      });

      return unsubscribe;
    } catch (error) {
      console.error('Error fetching books:', error);
      setLoading(false);
    }
  };

  const filterBooks = () => {
    let filtered = books;

    // Filter by category
    if (selectedCategory !== 'all') {
      const selectedCategoryData = categories.find(cat => cat.id === selectedCategory);
      if (selectedCategoryData) {
        filtered = filtered.filter(book => book.category === selectedCategoryData.name);
      }
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(book => 
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredBooks(filtered);
  };

  const getColorClass = (color: string) => {
    switch (color) {
      case 'orange': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'blue': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'purple': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'green': return 'bg-green-100 text-green-800 border-green-200';
      case 'red': return 'bg-red-100 text-red-800 border-red-200';
      case 'yellow': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  return (
    <div className="min-h-screen bg-gray-50" itemScope itemType="https://schema.org/Library">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6" itemProp="name">
              📚 एरोज्ञा पुस्तकालय
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90" itemProp="description">
              2000+ पुस्तकों का निःशुल्क संग्रह - धार्मिक, शैक्षणिक, साहित्यिक और तकनीकी विषयों की पुस्तकें
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-lg">
              <span className="bg-white bg-opacity-20 px-4 py-2 rounded-full">📖 धार्मिक ग्रंथ</span>
              <span className="bg-white bg-opacity-20 px-4 py-2 rounded-full">🎓 शैक्षणिक पुस्तकें</span>
              <span className="bg-white bg-opacity-20 px-4 py-2 rounded-full">✍️ साहित्यिक कृतियां</span>
              <span className="bg-white bg-opacity-20 px-4 py-2 rounded-full">💻 तकनीकी पुस्तकें</span>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="पुस्तक का नाम, लेखक या श्रेणी खोजें..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">सभी श्रेणियां</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name} ({category.bookCount})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Category Pills */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('all')}
              >
                सभी ({books.length})
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className={selectedCategory === category.id ? '' : getColorClass(category.color)}
                >
                  {category.name} ({category.bookCount})
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Books Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800">
                📖 पुस्तक संग्रह
                {selectedCategory !== 'all' && (
                  <span className="text-blue-600 ml-2">
                    - {categories.find(cat => cat.id === selectedCategory)?.name}
                  </span>
                )}
              </h2>
              <div className="text-sm text-gray-600">
                {filteredBooks.length} पुस्तकें मिलीं
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">पुस्तकें लोड हो रही हैं...</p>
              </div>
            ) : filteredBooks.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">कोई पुस्तक नहीं मिली</h3>
                <p className="text-gray-500">
                  {searchTerm ? 'अपनी खोज बदलकर दोबारा कोशिश करें' : 'इस श्रेणी में अभी तक कोई पुस्तक नहीं है'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBooks.map((book) => (
                  <Card key={book.id} className="hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-gray-800 line-clamp-2 flex-1">
                          {book.title}
                        </h3>
                        <Badge
                          variant={book.availableCopies > 0 ? "default" : "destructive"}
                          className="ml-2 text-xs"
                        >
                          {book.availableCopies > 0 ? "उपलब्ध" : "इश्यू में"}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>लेखक:</strong> {book.author}
                      </p>
                      
                      <p className="text-sm text-gray-600 mb-3">
                        <strong>श्रेणी:</strong> {book.category}
                      </p>
                      
                      {book.description && (
                        <p className="text-xs text-gray-500 mb-3 line-clamp-3">
                          {book.description}
                        </p>
                      )}
                      
                      <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
                        <span>कुल प्रतियां: {book.totalCopies}</span>
                        <span>उपलब्ध: {book.availableCopies}</span>
                      </div>
                      
                      {book.isbn && (
                        <p className="text-xs text-gray-400 mb-2">
                          ISBN: {book.isbn}
                        </p>
                      )}
                      
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          className="flex-1"
                          disabled={book.availableCopies === 0}
                        >
                          {book.availableCopies > 0 ? 'बुक करें' : 'प्रतीक्षा सूची'}
                        </Button>
                        <Button size="sm" variant="outline">
                          विवरण
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Library Services */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">🏛️ पुस्तकालय सेवाएं</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              <div className="bg-blue-50 p-6 rounded-lg text-center">
                <div className="text-4xl mb-4">📚</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">निःशुल्क सदस्यता</h3>
                <p className="text-gray-600">
                  सभी आयु वर्ग के लिए पूर्णतः निःशुल्क पुस्तकालय सदस्यता और सेवाएं
                </p>
              </div>
              
              <div className="bg-green-50 p-6 rounded-lg text-center">
                <div className="text-4xl mb-4">🏠</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">घर तक पुस्तक सेवा</h3>
                <p className="text-gray-600">
                  वरिष्ठ नागरिकों और दिव्यांगजनों के लिए घर तक पुस्तक पहुंचाने की सेवा
                </p>
              </div>
              
              <div className="bg-purple-50 p-6 rounded-lg text-center">
                <div className="text-4xl mb-4">💻</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">डिजिटल सेवा</h3>
                <p className="text-gray-600">
                  ऑनलाइन पुस्तक खोज, आरक्षण और नवीनीकरण की सुविधा
                </p>
              </div>
              
              <div className="bg-yellow-50 p-6 rounded-lg text-center">
                <div className="text-4xl mb-4">👥</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">अध्ययन कक्ष</h3>
                <p className="text-gray-600">
                  शांत वातावरण में अध्ययन के लिए विशेष कक्ष और बैठक व्यवस्था
                </p>
              </div>
              
              <div className="bg-red-50 p-6 rounded-lg text-center">
                <div className="text-4xl mb-4">📰</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">समाचार पत्र सेवा</h3>
                <p className="text-gray-600">
                  दैनिक समाचार पत्र, पत्रिकाएं और जर्नल्स की नियमित उपलब्धता
                </p>
              </div>
              
              <div className="bg-indigo-50 p-6 rounded-lg text-center">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">प्रतियोगी परीक्षा सामग्री</h3>
                <p className="text-gray-600">
                  UPSC, RAS, SSC और अन्य प्रतियोगी परीक्षाओं की तैयारी सामग्री
                </p>
              </div>
            </div>

            {/* Book Categories */}
            <div className="mb-12">
              <h3 className="text-2xl font-semibold text-gray-800 mb-8 text-center">📖 पुस्तक श्रेणियां</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="border-l-4 border-orange-500 pl-4">
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">🕉️ धार्मिक ग्रंथ (500+ पुस्तकें)</h4>
                    <ul className="text-gray-600 space-y-1">
                      <li>• गीता, रामायण, महाभारत</li>
                      <li>• पुराण और उपनिषद</li>
                      <li>• संत साहित्य और भजन संग्रह</li>
                      <li>• धार्मिक कथाएं और जीवनी</li>
                    </ul>
                  </div>
                  
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">🎓 शैक्षणिक पुस्तकें (600+ पुस्तकें)</h4>
                    <ul className="text-gray-600 space-y-1">
                      <li>• कक्षा 1-12 की पाठ्यपुस्तकें</li>
                      <li>• प्रतियोगी परीक्षा की तैयारी</li>
                      <li>• व्याकरण और भाषा विज्ञान</li>
                      <li>• गणित और विज्ञान</li>
                    </ul>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="border-l-4 border-green-500 pl-4">
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">✍️ साहित्यिक कृतियां (500+ पुस्तकें)</h4>
                    <ul className="text-gray-600 space-y-1">
                      <li>• हिंदी और राजस्थानी साहित्य</li>
                      <li>• कविता संग्रह और गजल</li>
                      <li>• उपन्यास और कहानी संग्रह</li>
                      <li>• जीवनी और आत्मकथा</li>
                    </ul>
                  </div>
                  
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">💻 तकनीकी पुस्तकें (400+ पुस्तकें)</h4>
                    <ul className="text-gray-600 space-y-1">
                      <li>• कंप्यूटर और इंटरनेट</li>
                      <li>• इंजीनियरिंग और तकनीक</li>
                      <li>• चिकित्सा और स्वास्थ्य</li>
                      <li>• कृषि और पशुपालन</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Library Timings */}
            <div className="bg-gray-50 p-8 rounded-lg mb-12" itemScope itemType="https://schema.org/OpeningHoursSpecification">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">🕒 पुस्तकालय समय</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-4">सामान्य दिन:</h4>
                  <div className="space-y-2 text-gray-600">
                    <div className="flex justify-between">
                      <span>सोमवार - शुक्रवार:</span>
                      <span className="font-medium" itemProp="opens">9:00 AM - 7:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>शनिवार:</span>
                      <span className="font-medium">9:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>रविवार:</span>
                      <span className="font-medium text-red-600">बंद</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-800 mb-4">विशेष सुविधाएं:</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center">
                      <span className="text-green-600 mr-2">✓</span>
                      परीक्षा के दिनों में विस्तारित समय
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-600 mr-2">✓</span>
                      त्योहारों में विशेष व्यवस्था
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-600 mr-2">✓</span>
                      आपातकाल में 24/7 संपर्क सुविधा
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* New Building Construction */}
            <div className="bg-gradient-to-r from-green-100 to-blue-100 p-8 rounded-lg">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">🏗️ नया पुस्तकालय भवन</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">आधुनिक सुविधाओं के साथ:</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center">
                      <span className="text-green-600 mr-2">🏢</span>
                      3 मंजिला आधुनिक भवन
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-600 mr-2">❄️</span>
                      वातानुकूलित अध्ययन कक्ष
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-600 mr-2">💻</span>
                      डिजिटल लाइब्रेरी सेक्शन
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-600 mr-2">🚗</span>
                      पार्किंग की व्यवस्था
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-600 mr-2">♿</span>
                      दिव्यांगजन अनुकूल सुविधाएं
                    </li>
                  </ul>
                </div>
                
                <div className="text-center">
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="text-3xl font-bold text-green-600 mb-2">35 लाख रुपए</div>
                    <div className="text-gray-700 mb-4">कुल निर्माण लागत</div>
                    <div className="text-lg font-semibold text-blue-600">जून 2024 तक पूर्ण होने की संभावना</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">📚 आज ही सदस्य बनें</h2>
            <p className="text-xl mb-8 opacity-90">
              निःशुल्क पुस्तकालय सदस्यता प्राप्त करें और ज्ञान की दुनिया में कदम रखें
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/apply"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300"
              >
                सदस्यता के लिए आवेदन करें
              </a>
              <a
                href="/books"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-300"
              >
                पुस्तक सूची देखें
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}