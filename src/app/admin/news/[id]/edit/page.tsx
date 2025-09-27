"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Save,
  Eye,
  Upload,
  Image as ImageIcon,
  Video,
  Tag,
  Calendar,
  Globe,
  FileText,
  Star,
  AlertTriangle,
  X,
  Plus,
  Link as LinkIcon,
  RotateCcw
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import dynamic from 'next/dynamic';
import { useDropzone } from 'react-dropzone';
import { NewsArticle } from '@/lib/types';

// Dynamically import TinyMCE to avoid SSR issues
const Editor = dynamic(() => import('@tinymce/tinymce-react').then(mod => mod.Editor), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-md"></div>
});

interface FormData {
  title: string;
  shortDescription: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  category: string;
  tags: string[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
  featuredImage: File | null;
  featuredImageUrl: string;
  featuredImageAlt: string;
  additionalImages: File[];
  existingImages: string[];
  videoUrl: string;
  status: 'draft' | 'published' | 'scheduled' | 'archived';
  publishDate: string;
  scheduledDate: string;
  isFeatured: boolean;
  isBreaking: boolean;
  source: string;
}

export default function EditNewsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const editorRef = useRef<HTMLDivElement>(null);

  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    title: '',
    shortDescription: '',
    content: '',
    metaTitle: '',
    metaDescription: '',
    keywords: [],
    category: 'general',
    tags: [],
    priority: 'medium',
    featuredImage: null,
    featuredImageUrl: '',
    featuredImageAlt: '',
    additionalImages: [],
    existingImages: [],
    videoUrl: '',
    status: 'draft',
    publishDate: new Date().toISOString().split('T')[0],
    scheduledDate: '',
    isFeatured: false,
    isBreaking: false,
    source: ''
  });

  const [keywordInput, setKeywordInput] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  // Sample article data
  const sampleArticle: NewsArticle = {
    id: params.id as string,
    title: 'पुस्तकालय भवन निर्माण कार्य जून 2024 तक पूर्ण होने की संभावना',
    shortDescription: '35 लाख रुपए की लागत से बन रहे नए पुस्तकालय भवन का निर्माण कार्य तेजी से प्रगति पर है।',
    content: `<p>एरोग्या पुस्तकालय एवं सेवा संस्था के नए भवन का निर्माण कार्य तेजी से आगे बढ़ रहा है। 35 लाख रुपए की लागत से बन रहा यह आधुनिक पुस्तकालय भवन जून 2024 तक पूर्ण होने की संभावना है।</p>

<h3>नए भवन की मुख्य विशेषताएं</h3>
<p>इस नए भवन में निम्नलिखित सुविधाएं होंगी:</p>
<ul>
<li>5000+ पुस्तकों की क्षमता वाला मुख्य पुस्तकालय</li>
<li>डिजिटल लाइब्रेरी सेक्शन</li>
<li>रीडिंग हॉल (100 व्यक्तियों की क्षमता)</li>
<li>सेमिनार हॉल</li>
<li>कंप्यूटर लैब</li>
<li>बच्चों के लिए अलग सेक्शन</li>
</ul>`,
    excerpt: 'एरोग्या पुस्तकालय का नया भवन जून 2024 तक तैयार हो जाएगा।',
    metaTitle: 'पुस्तकालय भवन निर्माण कार्य - एरोग्या पुस्तकालय',
    metaDescription: '35 लाख रुपए की लागत से बन रहे नए पुस्तकालय भवन का निर्माण कार्य तेजी से प्रगति पर है।',
    keywords: ['पुस्तकालय', 'निर्माण', 'विकास'],
    slug: 'library-construction-completion-june-2024',
    category: 'library',
    tags: ['पुस्तकालय', 'निर्माण', 'विकास'],
    priority: 'high',
    featuredImage: '/news/library-construction.jpg',
    featuredImageAlt: 'पुस्तकालय भवन निर्माण कार्य की तस्वीर',
    images: ['/news/library-1.jpg', '/news/library-2.jpg'],
    videoUrl: 'https://youtube.com/watch?v=example',
    status: 'published',
    publishDate: new Date('2024-05-15'),
    isFeatured: true,
    isBreaking: false,
    viewCount: 2456,
    shareCount: 67,
    likes: 234,
    readingTime: 4,
    author: 'संस्था संवाददाता',
    authorId: 'author1',
    source: 'एरोग्या पुस्तकालय एवं सेवा संस्था',
    lastEditedBy: 'admin@aerogya.org',
    createdAt: new Date('2024-05-15'),
    updatedAt: new Date('2024-05-15'),
    publishedAt: new Date('2024-05-15')
  };

  const categories = [
    { value: 'general', label: 'सामान्य' },
    { value: 'health', label: 'स्वास्थ्य' },
    { value: 'education', label: 'शिक्षा' },
    { value: 'events', label: 'कार्यक्रम' },
    { value: 'library', label: 'पुस्तकालय' },
    { value: 'donations', label: 'दान' },
    { value: 'achievements', label: 'उपलब्धियां' },
    { value: 'announcements', label: 'घोषणाएं' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'कम', color: 'bg-green-100 text-green-800' },
    { value: 'medium', label: 'मध्यम', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'high', label: 'उच्च', color: 'bg-orange-100 text-orange-800' },
    { value: 'urgent', label: 'तत्काल', color: 'bg-red-100 text-red-800' }
  ];

  useEffect(() => {
    // Simulate loading article data
    setTimeout(() => {
      setArticle(sampleArticle);

      // Populate form with existing data
      setFormData({
        title: sampleArticle.title,
        shortDescription: sampleArticle.shortDescription,
        content: sampleArticle.content,
        metaTitle: sampleArticle.metaTitle || '',
        metaDescription: sampleArticle.metaDescription || '',
        keywords: sampleArticle.keywords,
        category: sampleArticle.category,
        tags: sampleArticle.tags,
        priority: sampleArticle.priority,
        featuredImage: null,
        featuredImageUrl: sampleArticle.featuredImage || '',
        featuredImageAlt: sampleArticle.featuredImageAlt || '',
        additionalImages: [],
        existingImages: sampleArticle.images,
        videoUrl: sampleArticle.videoUrl || '',
        status: sampleArticle.status,
        publishDate: sampleArticle.publishDate.toISOString().split('T')[0],
        scheduledDate: sampleArticle.scheduledDate ? sampleArticle.scheduledDate.toISOString().split('T')[0] : '',
        isFeatured: sampleArticle.isFeatured,
        isBreaking: sampleArticle.isBreaking,
        source: sampleArticle.source || ''
      });

      setLoading(false);
    }, 1000);
  }, [params.id]);

  // Featured image dropzone
  const featuredImageDropzone = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setFormData(prev => ({ ...prev, featuredImage: acceptedFiles[0] }));
        setHasChanges(true);
      }
    }
  });

  // Additional images dropzone
  const additionalImagesDropzone = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    multiple: true,
    onDrop: (acceptedFiles) => {
      setFormData(prev => ({
        ...prev,
        additionalImages: [...prev.additionalImages, ...acceptedFiles]
      }));
      setHasChanges(true);
    }
  });

  const handleInputChange = (field: keyof FormData, value: string | string[] | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);

    // Auto-generate meta title when title changes
    if (field === 'title' && !formData.metaTitle && typeof value === 'string') {
      setFormData(prev => ({ ...prev, metaTitle: value }));
    }
  };

  const addKeyword = () => {
    if (keywordInput.trim() && !formData.keywords.includes(keywordInput.trim())) {
      setFormData(prev => ({
        ...prev,
        keywords: [...prev.keywords, keywordInput.trim()]
      }));
      setKeywordInput('');
      setHasChanges(true);
    }
  };

  const removeKeyword = (keyword: string) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keyword)
    }));
    setHasChanges(true);
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
      setHasChanges(true);
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
    setHasChanges(true);
  };

  const removeAdditionalImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      additionalImages: prev.additionalImages.filter((_, i) => i !== index)
    }));
    setHasChanges(true);
  };

  const removeExistingImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      existingImages: prev.existingImages.filter((_, i) => i !== index)
    }));
    setHasChanges(true);
  };

  const resetForm = () => {
    if (article) {
      setFormData({
        title: article.title,
        shortDescription: article.shortDescription,
        content: article.content,
        metaTitle: article.metaTitle || '',
        metaDescription: article.metaDescription || '',
        keywords: article.keywords,
        category: article.category,
        tags: article.tags,
        priority: article.priority,
        featuredImage: null,
        featuredImageUrl: article.featuredImage || '',
        featuredImageAlt: article.featuredImageAlt || '',
        additionalImages: [],
        existingImages: article.images,
        videoUrl: article.videoUrl || '',
        status: article.status,
        publishDate: article.publishDate.toISOString().split('T')[0],
        scheduledDate: article.scheduledDate ? article.scheduledDate.toISOString().split('T')[0] : '',
        isFeatured: article.isFeatured,
        isBreaking: article.isBreaking,
        source: article.source || ''
      });
      setHasChanges(false);
    }
  };

  const calculateReadingTime = (content: string) => {
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    return Math.ceil(words / 200); // Assuming 200 words per minute
  };

  const handleSubmit = async (status?: string) => {
    setSaving(true);

    try {
      const readingTime = calculateReadingTime(formData.content);
      const updateStatus = status || formData.status;

      const updatedArticle = {
        ...article,
        title: formData.title,
        shortDescription: formData.shortDescription,
        content: formData.content,
        metaTitle: formData.metaTitle || formData.title,
        metaDescription: formData.metaDescription || formData.shortDescription,
        keywords: formData.keywords,
        category: formData.category,
        tags: formData.tags,
        priority: formData.priority,
        featuredImageAlt: formData.featuredImageAlt,
        videoUrl: formData.videoUrl,
        status: updateStatus,
        publishDate: new Date(formData.publishDate),
        scheduledDate: formData.scheduledDate ? new Date(formData.scheduledDate) : undefined,
        isFeatured: formData.isFeatured,
        isBreaking: formData.isBreaking,
        source: formData.source,
        readingTime,
        lastEditedBy: user?.email || 'Unknown',
        updatedAt: new Date(),
      };

      // TODO: Implement Firebase update
      console.log('Updated article data:', updatedArticle);
      console.log('New featured image:', formData.featuredImage);
      console.log('New additional images:', formData.additionalImages);

      // Simulate save
      await new Promise(resolve => setTimeout(resolve, 1000));

      setHasChanges(false);
      alert(`समाचार ${updateStatus === 'published' ? 'प्रकाशित' : 'अपडेट'} किया गया!`);

      if (status === 'published') {
        router.push('/admin/news');
      }

    } catch (error) {
      console.error('Error updating article:', error);
      alert('समाचार अपडेट करने में त्रुटि हुई');
    } finally {
      setSaving(false);
    }
  };

  const validateForm = () => {
    return formData.title.trim() &&
      formData.shortDescription.trim() &&
      formData.content.trim() &&
      formData.category;
  };

  if (loading) {
    return (
      <ProtectedRoute adminOnly={true}>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">समाचार लोड हो रहा है...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!article) {
    return (
      <ProtectedRoute adminOnly={true}>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">समाचार नहीं मिला</h2>
            <p className="text-gray-600 mb-4">यह समाचार उपलब्ध नहीं है या हटा दिया गया है।</p>
            <Link href="/admin/news">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                वापस समाचार सूची में जाएं
              </Button>
            </Link>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (previewMode) {
    return (
      <ProtectedRoute adminOnly={true}>
        <div className="min-h-screen bg-gray-50">
          {/* Preview Header */}
          <div className="bg-white shadow-sm border-b">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center py-4">
                <h1 className="text-xl font-semibold text-gray-900">समाचार पूर्वावलोकन</h1>
                <Button onClick={() => setPreviewMode(false)} variant="outline">
                  <X className="w-4 h-4 mr-2" />
                  पूर्वावलोकन बंद करें
                </Button>
              </div>
            </div>
          </div>

          {/* Preview Content */}
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <article className="bg-white rounded-lg shadow-lg overflow-hidden">
              {(formData.featuredImage || formData.featuredImageUrl) && (
                <div className="h-64 bg-gray-200">
                  <img
                    src={formData.featuredImage ? URL.createObjectURL(formData.featuredImage) : "/api/placeholder/800/400"}
                    alt={formData.featuredImageAlt}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="p-8">
                <div className="flex items-center space-x-2 mb-4">
                  <Badge className="bg-blue-100 text-blue-800">
                    {categories.find(c => c.value === formData.category)?.label}
                  </Badge>
                  <Badge className={priorityOptions.find(p => p.value === formData.priority)?.color}>
                    {priorityOptions.find(p => p.value === formData.priority)?.label}
                  </Badge>
                  {formData.isFeatured && (
                    <Badge className="bg-yellow-100 text-yellow-800">
                      <Star className="w-3 h-3 mr-1" />
                      फीचर्ड
                    </Badge>
                  )}
                  {formData.isBreaking && (
                    <Badge className="bg-red-100 text-red-800">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      ब्रेकिंग न्यूज
                    </Badge>
                  )}
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {formData.title}
                </h1>

                <p className="text-lg text-gray-600 mb-6">
                  {formData.shortDescription}
                </p>

                <div className="prose max-w-none mb-6"
                  dangerouslySetInnerHTML={{ __html: formData.content }}>
                </div>

                {formData.videoUrl && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">संबंधित वीडियो</h3>
                    <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                      <Video className="w-12 h-12 text-gray-400" />
                      <span className="ml-2 text-gray-500">वीडियो: {formData.videoUrl}</span>
                    </div>
                  </div>
                )}

                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </article>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute adminOnly={true}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <Link href={`/admin/news/${article.id}`}>
                  <Button variant="ghost" size="sm" className="mr-4">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    वापस
                  </Button>
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                    <FileText className="w-6 h-6 mr-2" />
                    समाचार संपादित करें
                    {hasChanges && <span className="ml-2 text-orange-600 text-sm">*</span>}
                  </h1>
                  <p className="text-gray-600">
                    समाचार विवरण बदलें और अपडेट करें
                  </p>
                </div>
              </div>
              <div className="flex space-x-3">
                {hasChanges && (
                  <Button
                    variant="outline"
                    onClick={resetForm}
                    className="text-gray-600"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    रीसेट करें
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => setPreviewMode(true)}
                  disabled={!validateForm()}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  पूर्वावलोकन
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleSubmit('draft')}
                  disabled={saving || !validateForm()}
                >
                  <Save className="w-4 h-4 mr-2" />
                  सेव करें
                </Button>
                <Button
                  onClick={() => handleSubmit('published')}
                  disabled={saving || !validateForm()}
                >
                  <Globe className="w-4 h-4 mr-2" />
                  {formData.status === 'published' ? 'अपडेट करें' : 'प्रकाशित करें'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    मुख्य जानकारी
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      समाचार शीर्षक *
                    </label>
                    <Input
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="समाचार का मुख्य शीर्षक..."
                      className="text-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      संक्षिप्त विवरण *
                    </label>
                    <textarea
                      value={formData.shortDescription}
                      onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                      placeholder="समाचार का संक्षिप्त विवरण (150-200 शब्द)..."
                      rows={3}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      {formData.shortDescription.length}/200 अक्षर
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      मुख्य सामग्री *
                    </label>
                    <div className="border border-gray-300 rounded-md">
                      <Editor
                        onInit={(evt, editor) => editorRef.current = editor}
                        value={formData.content}
                        init={{
                          height: 400,
                          menubar: true,
                          plugins: [
                            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                          ],
                          toolbar: 'undo redo | blocks | ' +
                            'bold italic forecolor | alignleft aligncenter ' +
                            'alignright alignjustify | bullist numlist outdent indent | ' +
                            'removeformat | link image media | preview code | help',
                          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                          language: 'hi'
                        }}
                        onEditorChange={(content) => handleInputChange('content', content)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* SEO Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe className="w-5 h-5 mr-2" />
                    SEO और मेटाडेटा
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      मेटा शीर्षक
                    </label>
                    <Input
                      value={formData.metaTitle}
                      onChange={(e) => handleInputChange('metaTitle', e.target.value)}
                      placeholder="SEO के लिए शीर्षक (60 अक्षर तक)..."
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      {formData.metaTitle.length}/60 अक्षर
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      मेटा विवरण
                    </label>
                    <textarea
                      value={formData.metaDescription}
                      onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                      placeholder="SEO के लिए विवरण (160 अक्षर तक)..."
                      rows={2}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      {formData.metaDescription.length}/160 अक्षर
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      खोज शब्द (Keywords)
                    </label>
                    <div className="flex space-x-2 mb-2">
                      <Input
                        value={keywordInput}
                        onChange={(e) => setKeywordInput(e.target.value)}
                        placeholder="नया खोज शब्द जोड़ें..."
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                      />
                      <Button type="button" onClick={addKeyword} size="sm">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.keywords.map((keyword, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center">
                          {keyword}
                          <button
                            onClick={() => removeKeyword(keyword)}
                            className="ml-1 text-red-500 hover:text-red-700"
                            title={`${keyword} हटाएं`}
                            aria-label={`${keyword} हटाएं`}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Media */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ImageIcon className="w-5 h-5 mr-2" />
                    मीडिया और छवियां
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      मुख्य छवि
                    </label>

                    {/* Current Featured Image */}
                    {(formData.featuredImageUrl || formData.featuredImage) && (
                      <div className="mb-4">
                        <img
                          src={formData.featuredImage ? URL.createObjectURL(formData.featuredImage) : "/api/placeholder/400/200"}
                          alt="Current featured"
                          className="max-h-48 mx-auto rounded"
                        />
                        <div className="flex justify-center space-x-2 mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setFormData(prev => ({
                              ...prev,
                              featuredImage: null,
                              featuredImageUrl: ''
                            }))}
                          >
                            हटाएं
                          </Button>
                        </div>
                      </div>
                    )}

                    <div
                      {...featuredImageDropzone.getRootProps()}
                      className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors"
                    >
                      <input {...featuredImageDropzone.getInputProps()} />
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">
                        {formData.featuredImageUrl || formData.featuredImage ?
                          'नई छवि अपलोड करने के लिए क्लिक करें' :
                          'मुख्य छवि अपलोड करने के लिए क्लिक करें'}
                      </p>
                      <p className="text-sm text-gray-500">JPG, PNG, GIF (अधिकतम 5MB)</p>
                    </div>

                    <div className="mt-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        छवि Alt टेक्स्ट
                      </label>
                      <Input
                        value={formData.featuredImageAlt}
                        onChange={(e) => handleInputChange('featuredImageAlt', e.target.value)}
                        placeholder="छवि का वर्णन (SEO के लिए)..."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      अतिरिक्त छवियां
                    </label>

                    {/* Existing Images */}
                    {formData.existingImages.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2">मौजूदा छवियां:</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {formData.existingImages.map((image, index) => (
                            <div key={index} className="relative">
                              <img
                                src="/api/placeholder/200/150"
                                alt={`Existing ${index + 1}`}
                                className="w-full h-20 object-cover rounded"
                              />
                              <button
                                onClick={() => removeExistingImage(index)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                title="छवि हटाएं"
                                aria-label="छवि हटाएं"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div
                      {...additionalImagesDropzone.getRootProps()}
                      className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 transition-colors"
                    >
                      <input {...additionalImagesDropzone.getInputProps()} />
                      <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">अतिरिक्त छवियां जोड़ें</p>
                    </div>

                    {/* New Additional Images */}
                    {formData.additionalImages.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
                        {formData.additionalImages.map((file, index) => (
                          <div key={index} className="relative">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Additional ${index + 1}`}
                              className="w-full h-20 object-cover rounded"
                            />
                            <button
                              onClick={() => removeAdditionalImage(index)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                              title="छवि हटाएं"
                              aria-label="छवि हटाएं"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      वीडियो URL (वैकल्पिक)
                    </label>
                    <div className="flex space-x-2">
                      <LinkIcon className="w-5 h-5 text-gray-400 mt-2" />
                      <Input
                        value={formData.videoUrl}
                        onChange={(e) => handleInputChange('videoUrl', e.target.value)}
                        placeholder="YouTube या Vimeo URL..."
                        type="url"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Publishing Options */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    प्रकाशन विकल्प
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      स्थिति
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      aria-label="समाचार स्थिति"
                    >
                      <option value="draft">प्रारूप</option>
                      <option value="published">प्रकाशित</option>
                      <option value="scheduled">अनुसूचित</option>
                      <option value="archived">संग्रहीत</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      प्रकाशन दिनांक
                    </label>
                    <Input
                      type="date"
                      value={formData.publishDate}
                      onChange={(e) => handleInputChange('publishDate', e.target.value)}
                    />
                  </div>

                  {formData.status === 'scheduled' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        अनुसूचित दिनांक
                      </label>
                      <Input
                        type="datetime-local"
                        value={formData.scheduledDate}
                        onChange={(e) => handleInputChange('scheduledDate', e.target.value)}
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.isFeatured}
                        onChange={(e) => handleInputChange('isFeatured', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">फीचर्ड समाचार</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.isBreaking}
                        onChange={(e) => handleInputChange('isBreaking', e.target.checked)}
                        className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">ब्रेकिंग न्यूज</span>
                    </label>
                  </div>
                </CardContent>
              </Card>

              {/* Categories and Tags */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Tag className="w-5 h-5 mr-2" />
                    श्रेणी और टैग
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      श्रेणी *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      aria-label="समाचार श्रेणी"
                    >
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      प्राथमिकता
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) => handleInputChange('priority', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      aria-label="समाचार प्राथमिकता"
                    >
                      {priorityOptions.map(priority => (
                        <option key={priority.value} value={priority.value}>
                          {priority.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      टैग्स
                    </label>
                    <div className="flex space-x-2 mb-2">
                      <Input
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        placeholder="नया टैग जोड़ें..."
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      />
                      <Button type="button" onClick={addTag} size="sm">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="flex items-center">
                          {tag}
                          <button
                            onClick={() => removeTag(tag)}
                            className="ml-1 text-red-500 hover:text-red-700"
                            title={`${tag} हटाएं`}
                            aria-label={`${tag} हटाएं`}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      स्रोत (वैकल्पिक)
                    </label>
                    <Input
                      value={formData.source}
                      onChange={(e) => handleInputChange('source', e.target.value)}
                      placeholder="समाचार का स्रोत..."
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Form Validation Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">फॉर्म स्थिति</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className={`flex items-center ${formData.title ? 'text-green-600' : 'text-red-600'}`}>
                      <div className={`w-2 h-2 rounded-full mr-2 ${formData.title ? 'bg-green-600' : 'bg-red-600'}`}></div>
                      शीर्षक {formData.title ? '✓' : '(आवश्यक)'}
                    </div>
                    <div className={`flex items-center ${formData.shortDescription ? 'text-green-600' : 'text-red-600'}`}>
                      <div className={`w-2 h-2 rounded-full mr-2 ${formData.shortDescription ? 'bg-green-600' : 'bg-red-600'}`}></div>
                      संक्षिप्त विवरण {formData.shortDescription ? '✓' : '(आवश्यक)'}
                    </div>
                    <div className={`flex items-center ${formData.content ? 'text-green-600' : 'text-red-600'}`}>
                      <div className={`w-2 h-2 rounded-full mr-2 ${formData.content ? 'bg-green-600' : 'bg-red-600'}`}></div>
                      मुख्य सामग्री {formData.content ? '✓' : '(आवश्यक)'}
                    </div>
                    <div className={`flex items-center ${formData.category ? 'text-green-600' : 'text-red-600'}`}>
                      <div className={`w-2 h-2 rounded-full mr-2 ${formData.category ? 'bg-green-600' : 'bg-red-600'}`}></div>
                      श्रेणी {formData.category ? '✓' : '(आवश्यक)'}
                    </div>
                    {hasChanges && (
                      <div className="flex items-center text-orange-600">
                        <div className="w-2 h-2 rounded-full mr-2 bg-orange-600"></div>
                        असेव किए गए बदलाव
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
