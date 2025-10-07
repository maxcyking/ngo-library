"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowLeft, 
  BookOpen, 
  Save,
  Tag,
  Upload,
  X,
  Image as ImageIcon
} from 'lucide-react';
import Link from 'next/link';
import { 
  collection, 
  addDoc, 
  serverTimestamp,
  query,
  where,
  orderBy,
  getDocs,
  updateDoc,
  doc,
  increment
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

interface BookCategory {
  id: string;
  name: string;
  description: string;
  color: string;
  isActive: boolean;
  bookCount: number;
}

export default function AddBookPage() {
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categories, setCategories] = useState<BookCategory[]>([]);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [bookData, setBookData] = useState({
    title: '',
    author: '',
    isbn: '',
    category: '',
    language: 'hindi',
    publisher: '',
    publicationYear: '',
    totalCopies: '1',
    price: '',
    location: '',
    description: '',
    coverImage: ''
  });
  
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const q = query(
        collection(db, 'book-categories'),
        where('isActive', '==', true),
        orderBy('order', 'asc')
      );
      const querySnapshot = await getDocs(q);
      const categoriesData: BookCategory[] = [];
      querySnapshot.forEach((doc) => {
        categoriesData.push({
          id: doc.id,
          ...doc.data()
        } as BookCategory);
      });
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Fallback categories
      setCategories([
        { id: '1', name: 'धार्मिक साहित्य', description: '', color: 'blue', isActive: true, bookCount: 0 },
        { id: '2', name: 'शैक्षणिक पुस्तकें', description: '', color: 'green', isActive: true, bookCount: 0 },
        { id: '3', name: 'उपन्यास', description: '', color: 'purple', isActive: true, bookCount: 0 },
        { id: '4', name: 'बाल साहित्य', description: '', color: 'orange', isActive: true, bookCount: 0 }
      ]);
    } finally {
      setCategoriesLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBookData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = async (file: File): Promise<string> => {
    const fileExtension = file.name.split('.').pop();
    const fileName = `book-cover-${Date.now()}.${fileExtension}`;
    const storageRef = ref(storage, `book-covers/${fileName}`);
    
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        alert('कृपया केवल JPG, PNG, GIF या WebP फॉर्मेट की इमेज अपलोड करें।');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('फाइल का साइज 5MB से कम होना चाहिए।');
        return;
      }
      
      setCoverImageFile(file);
    }
  };

  const removeCoverImageFile = () => {
    setCoverImageFile(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleCoverImageDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (validTypes.includes(file.type) && file.size <= 5 * 1024 * 1024) {
        setCoverImageFile(file);
      } else {
        alert('कृपया केवल JPG, PNG, GIF या WebP फॉर्मेट की इमेज अपलोड करें (अधिकतम 5MB)।');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setUploading(true);

    try {
      let coverImageUrl = bookData.coverImage;

      // Upload cover image if file is selected
      if (coverImageFile) {
        try {
          console.log('Uploading cover image:', coverImageFile.name);
          coverImageUrl = await handleFileUpload(coverImageFile);
          console.log('Cover image uploaded successfully:', coverImageUrl);
        } catch (error) {
          console.error('Error uploading cover image:', error);
          alert(`कवर इमेज अपलोड करने में त्रुटि हुई: ${error instanceof Error ? error.message : 'अज्ञात त्रुटि'}`);
          return;
        }
      }

      const totalCopies = parseInt(bookData.totalCopies) || 1;
      const newBook = {
        title: bookData.title,
        author: bookData.author,
        isbn: bookData.isbn || null,
        category: bookData.category,
        language: bookData.language,
        publisher: bookData.publisher || null,
        publicationYear: bookData.publicationYear ? parseInt(bookData.publicationYear) : null,
        totalCopies: totalCopies,
        availableCopies: totalCopies,
        issuedCopies: 0,
        price: bookData.price ? parseFloat(bookData.price) : null,
        location: bookData.location || null,
        description: bookData.description || null,
        coverImage: coverImageUrl || null,
        addedDate: new Date(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: user?.email || 'unknown',
        updatedBy: user?.email || 'unknown'
      };

      // Add the book
      await addDoc(collection(db, 'books'), newBook);
      
      // Update category book count
      if (bookData.category) {
        const selectedCategory = categories.find(cat => cat.name === bookData.category);
        if (selectedCategory) {
          await updateDoc(doc(db, 'book-categories', selectedCategory.id), {
            bookCount: increment(1),
            updatedAt: serverTimestamp()
          });
        }
      }
      
      alert('पुस्तक सफलतापूर्वक जोड़ी गई!');
      router.push('/admin/books');
    } catch (error) {
      console.error('Error adding book:', error);
      alert('पुस्तक जोड़ने में त्रुटि हुई। कृपया पुनः प्रयास करें।');
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  return (
    <ProtectedRoute adminOnly={true}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center py-4">
              <Link href="/admin/books">
                <Button variant="ghost" size="sm" className="mr-4">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  वापस
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  <BookOpen className="w-6 h-6 mr-2" />
                  नई पुस्तक जोड़ें
                </h1>
                <p className="text-gray-600">
                  पुस्तकालय में नई पुस्तक की जानकारी भरें
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Information */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>पुस्तक की जानकारी</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="title">पुस्तक का नाम *</Label>
                        <Input
                          id="title"
                          name="title"
                          value={bookData.title}
                          onChange={handleInputChange}
                          placeholder="पुस्तक का नाम दर्ज करें"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="author">लेखक का नाम *</Label>
                        <Input
                          id="author"
                          name="author"
                          value={bookData.author}
                          onChange={handleInputChange}
                          placeholder="लेखक का नाम दर्ज करें"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="isbn">ISBN</Label>
                        <Input
                          id="isbn"
                          name="isbn"
                          value={bookData.isbn}
                          onChange={handleInputChange}
                          placeholder="ISBN नंबर (वैकल्पिक)"
                        />
                      </div>
                      <div>
                        <Label htmlFor="category">श्रेणी *</Label>
                        <div className="flex space-x-2">
                          <select
                            id="category"
                            name="category"
                            value={bookData.category}
                            onChange={handleInputChange}
                            className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            aria-label="पुस्तक श्रेणी"
                            required
                            disabled={categoriesLoading}
                          >
                            <option value="">
                              {categoriesLoading ? 'श्रेणियां लोड हो रही हैं...' : 'श्रेणी चुनें'}
                            </option>
                            {categories.map((category) => (
                              <option key={category.id} value={category.name}>
                                {category.name} ({category.bookCount} पुस्तकें)
                              </option>
                            ))}
                          </select>
                          <Link href="/admin/books/categories">
                            <Button type="button" variant="outline" size="sm">
                              <Tag className="w-4 h-4" />
                            </Button>
                          </Link>
                        </div>
                        {categoriesLoading && (
                          <p className="text-xs text-gray-500 mt-1">श्रेणियां डेटाबेस से लोड हो रही हैं...</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="language">भाषा *</Label>
                        <select
                          id="language"
                          name="language"
                          value={bookData.language}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          aria-label="पुस्तक भाषा"
                          required
                        >
                          <option value="hindi">हिन्दी</option>
                          <option value="english">अंग्रेजी</option>
                          <option value="other">अन्य</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="publisher">प्रकाशक</Label>
                        <Input
                          id="publisher"
                          name="publisher"
                          value={bookData.publisher}
                          onChange={handleInputChange}
                          placeholder="प्रकाशक का नाम"
                        />
                      </div>
                      <div>
                        <Label htmlFor="publicationYear">प्रकाशन वर्ष</Label>
                        <Input
                          id="publicationYear"
                          name="publicationYear"
                          type="number"
                          value={bookData.publicationYear}
                          onChange={handleInputChange}
                          placeholder="2023"
                          min="1800"
                          max={new Date().getFullYear()}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">विवरण</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={bookData.description}
                        onChange={handleInputChange}
                        placeholder="पुस्तक के बारे में विस्तृत जानकारी..."
                        rows={4}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Additional Information */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>अतिरिक्त जानकारी</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="totalCopies">प्रतियों की संख्या *</Label>
                      <Input
                        id="totalCopies"
                        name="totalCopies"
                        type="number"
                        value={bookData.totalCopies}
                        onChange={handleInputChange}
                        placeholder="1"
                        min="1"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="price">मूल्य (₹)</Label>
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        step="0.01"
                        value={bookData.price}
                        onChange={handleInputChange}
                        placeholder="100.00"
                        min="0"
                      />
                    </div>

                    <div>
                      <Label htmlFor="location">शेल्फ स्थान</Label>
                      <Input
                        id="location"
                        name="location"
                        value={bookData.location}
                        onChange={handleInputChange}
                        placeholder="A-1, शेल्फ-2"
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">
                        कवर इमेज अपलोड करें
                      </Label>
                      
                      {/* File Upload Area */}
                      <div className="relative mb-3">
                        <input
                          type="file"
                          id="coverImageUpload"
                          accept="image/*"
                          onChange={handleCoverImageChange}
                          className="hidden"
                        />
                        
                        {coverImageFile ? (
                          <div className="p-4 border-2 border-green-300 border-dashed rounded-lg bg-green-50">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <ImageIcon className="w-8 h-8 text-green-600" />
                                <div>
                                  <p className="text-sm font-medium text-green-800">{coverImageFile.name}</p>
                                  <p className="text-xs text-green-600">
                                    {(coverImageFile.size / 1024).toFixed(1)} KB
                                  </p>
                                </div>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={removeCoverImageFile}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <label
                            htmlFor="coverImageUpload"
                            className="flex flex-col items-center justify-center p-6 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                            onDragOver={handleDragOver}
                            onDrop={handleCoverImageDrop}
                          >
                            <Upload className="w-8 h-8 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-600 text-center">
                              <span className="font-medium text-blue-600">क्लिक करें</span> या फाइल को यहाँ ड्रैग करें
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              PNG, JPG, GIF (अधिकतम 5MB)
                            </p>
                          </label>
                        )}
                      </div>

                      {/* Manual URL Input */}
                      <div>
                        <Label htmlFor="coverImageUrl" className="text-xs text-gray-600">
                          या URL से कवर इमेज सेट करें
                        </Label>
                        <Input
                          id="coverImageUrl"
                          name="coverImage"
                          type="url"
                          value={bookData.coverImage}
                          onChange={handleInputChange}
                          placeholder="https://example.com/cover.jpg"
                          className="mt-1"
                        />
                      </div>

                      {/* Preview */}
                      {(coverImageFile || bookData.coverImage) && (
                        <div className="mt-3 p-3 border rounded-lg bg-gray-50">
                          <p className="text-xs text-gray-600 mb-2">प्रीव्यू:</p>
                          <img 
                            src={coverImageFile ? URL.createObjectURL(coverImageFile) : bookData.coverImage} 
                            alt="Book Cover Preview" 
                            className="w-20 h-28 object-cover rounded border shadow-sm"
                          />
                        </div>
                      )}
                    </div>

                    <div className="pt-4">
                      <Button
                        type="submit"
                        disabled={loading || uploading}
                        className="w-full"
                      >
                        {uploading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            अपलोड हो रहा है...
                          </>
                        ) : loading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            जोड़ा जा रहा है...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            पुस्तक जोड़ें
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
