"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Calendar, Search, Eye, Share2 } from "lucide-react";

// Sample news data - यह बाद में database से आएगा
const newsItems = [
  {
    id: "1",
    title: "पुस्तकालय भवन निर्माण कार्य जून 2024 तक पूर्ण होने की संभावना",
    excerpt: "35 लाख रुपए की लागत से बन रहे नए पुस्तकालय भवन का निर्माण कार्य तेजी से प्रगति पर है। यह आधुनिक सुविधाओं से युक्त भवन जल्द ही तैयार हो जाएगा।",
    content: `एरोग्या पुस्तकालय एवं सेवा संस्था के नए भवन का निर्माण कार्य तेजी से आगे बढ़ रहा है। 35 लाख रुपए की लागत से बन रहा यह आधुनिक पुस्तकालय भवन जून 2024 तक पूर्ण होने की संभावना है।

    इस नए भवन में निम्नलिखित सुविधाएं होंगी:
    • 5000+ पुस्तकों की क्षमता वाला मुख्य पुस्तकालय
    • डिजिटल लाइब्रेरी सेक्शन
    • रीडिंग हॉल (100 व्यक्तियों की क्षमता)
    • सेमिनार हॉल
    • कंप्यूटर लैब
    • बच्चों के लिए अलग सेक्शन

    संस्था के अध्यक्ष श्री आत्माराम बोरा ने बताया कि यह भवन न केवल पुस्तकालय सेवा के लिए बल्कि विभिन्न सामाजिक गतिविधियों के लिए भी उपयोग किया जाएगा।`,
    date: "2024-05-15",
    category: "निर्माण अपडेट",
    author: "संस्था संवाददाता",
    image: "/news/library-construction.jpg",
    featured: true,
    views: 245,
    tags: ["पुस्तकालय", "निर्माण", "विकास"]
  },
  {
    id: "2",
    title: "मासिक रक्तदान शिविर में 45 रक्तदाताओं ने किया रक्तदान",
    excerpt: "इस महीने आयोजित रक्तदान शिविर में 45 रक्तदाताओं ने भाग लिया। यह संख्या पिछले महीने से 20% अधिक है।",
    content: `एरोग्या पुस्तकालय एवं सेवा संस्था द्वारा आयोजित मासिक रक्तदान शिविर में 45 रक्तदाताओं ने स्वेच्छा से रक्तदान किया। यह शिविर संस्था परिसर में आयोजित किया गया था।

    शिविर की मुख्य विशेषताएं:
    • कुल 45 यूनिट रक्त संग्रह
    • 12 नए रक्तदाताओं का पंजीकरण
    • निःशुल्क स्वास्थ्य जांच सुविधा
    • रक्तदाताओं को प्रशंसा पत्र वितरण

    संस्था के उपाध्यक्ष श्री बाबूराम शर्मा ने सभी रक्तदाताओं का आभार व्यक्त किया और कहा कि यह जीवन बचाने का महान कार्य है।`,
    date: "2024-05-10",
    category: "स्वास्थ्य सेवा",
    author: "स्वास्थ्य टीम",
    image: "/news/blood-donation-may.jpg",
    featured: false,
    views: 189,
    tags: ["रक्तदान", "स्वास्थ्य", "सेवा"]
  },
  {
    id: "3",
    title: "निःशुल्क स्वास्थ्य जांच शिविर में 150+ लोगों की जांच",
    excerpt: "गांव में आयोजित स्वास्थ्य जांच शिविर में 150 से अधिक लोगों की निःशुल्क स्वास्थ्य जांच की गई।",
    content: `एरोग्या पुस्तकालय एवं सेवा संस्था द्वारा आयोजित निःशुल्क स्वास्थ्य जांच शिविर में 150 से अधिक लोगों की व्यापक स्वास्थ्य जांच की गई।

    शिविर में उपलब्ध सेवाएं:
    • रक्तचाप की जांच
    • मधुमेह की जांच
    • वजन और BMI मापना
    • सामान्य चिकित्सा परामर्श
    • निःशुल्क दवाएं वितरण

    इस शिविर में स्थानीय डॉक्टरों और नर्सों ने अपनी सेवाएं निःशुल्क प्रदान कीं। कई लोगों को प्रारंभिक स्तर पर बीमारियों का पता चला।`,
    date: "2024-05-05",
    category: "स्वास्थ्य सेवा",
    author: "चिकित्सा टीम",
    image: "/news/health-camp-may.jpg",
    featured: false,
    views: 167,
    tags: ["स्वास्थ्य", "जांच", "निःशुल्क"]
  },
  {
    id: "4",
    title: "महिला सशक्तिकरण कार्यक्रम के तहत 30 महिलाओं को प्रशिक्षण",
    excerpt: "महिला सशक्तिकरण कार्यक्रम के अंतर्गत 30 महिलाओं को कौशल विकास का प्रशिक्षण दिया गया।",
    content: `संस्था के महिला सशक्तिकरण कार्यक्रम के तहत 30 महिलाओं को विभिन्न कौशल विकास का प्रशिक्षण प्रदान किया गया।

    प्रशिक्षण के विषय:
    • सिलाई-कढ़ाई
    • हस्तशिल्प निर्माण
    • कंप्यूटर बेसिक्स
    • वित्तीय साक्षरता
    • स्वरोजगार के अवसर

    श्रीमती मीना देवी ने कहा कि यह कार्यक्रम महिलाओं को आत्मनिर्भर बनाने की दिशा में एक महत्वपूर्ण कदम है।`,
    date: "2024-04-28",
    category: "सामाजिक कार्यक्रम",
    author: "महिला सशक्तिकरण टीम",
    image: "/news/women-empowerment.jpg",
    featured: false,
    views: 134,
    tags: ["महिला", "सशक्तिकरण", "प्रशिक्षण"]
  },
  {
    id: "5",
    title: "पुस्तकालय में 200+ नई पुस्तकों का संग्रह जोड़ा गया",
    excerpt: "पुस्तकालय के संग्रह में विभिन्न विषयों की 200 से अधिक नई पुस्तकें जोड़ी गई हैं।",
    content: `एरोग्या पुस्तकालय में हाल ही में 200 से अधिक नई पुस्तकों का संग्रह जोड़ा गया है। इन पुस्तकों में विभिन्न विषयों की जानकारी शामिल है।

    नई पुस्तकों की श्रेणियां:
    • धार्मिक साहित्य - 50 पुस्तकें
    • शैक्षणिक पुस्तकें - 80 पुस्तकें
    • उपन्यास और कहानियां - 40 पुस्तकें
    • बाल साहित्य - 30 पुस्तकें

    यह संग्रह दानदाताओं और भामाशाहों के सहयोग से संभव हुआ है। अब पुस्तकालय में कुल 2200+ पुस्तकें उपलब्ध हैं।`,
    date: "2024-04-20",
    category: "पुस्तकालय अपडेट",
    author: "पुस्तकालय टीम",
    image: "/news/new-books.jpg",
    featured: false,
    views: 98,
    tags: ["पुस्तकालय", "पुस्तकें", "संग्रह"]
  }
];

const categories = ["सभी", "निर्माण अपडेट", "स्वास्थ्य सेवा", "सामाजिक कार्यक्रम", "पुस्तकालय अपडेट"];

export default function NewsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("सभी");
  const [selectedNews, setSelectedNews] = useState<string | null>(null);

  const filteredNews = newsItems.filter(news => {
    const matchesSearch = news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         news.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "सभी" || news.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredNews = newsItems.filter(news => news.featured);
  const regularNews = filteredNews.filter(news => !news.featured);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              📰 समाचार और अपडेट
            </h1>
            <p className="text-xl mb-8">
              संस्था की गतिविधियों और उपलब्धियों की नवीनतम जानकारी
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-8 bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end mb-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  समाचार खोजें
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="समाचार का शीर्षक या विषय..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  श्रेणी
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured News */}
      {featuredNews.length > 0 && (
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-800 mb-8">
                🌟 मुख्य समाचार
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {featuredNews.map((news) => (
                  <Card key={news.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="h-48 bg-gray-200">
                      <img
                        src="/api/placeholder/600/300"
                        alt={news.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="destructive" className="text-xs">
                          मुख्य समाचार
                        </Badge>
                        <span className="text-xs text-gray-500 flex items-center">
                          <Eye className="w-3 h-3 mr-1" />
                          {news.views}
                        </span>
                      </div>
                      <CardTitle className="text-xl font-semibold text-gray-800 line-clamp-2">
                        {news.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {news.excerpt}
                      </p>
                      <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(news.date).toLocaleDateString('hi-IN')}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {news.category}
                        </Badge>
                      </div>
                      <Button 
                        className="w-full"
                        onClick={() => setSelectedNews(news.id)}
                      >
                        पूरा पढ़ें
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Regular News */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-8">
              📄 सभी समाचार
            </h2>
            
            <div className="space-y-6">
              {regularNews.map((news) => (
                <Card key={news.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="md:col-span-1">
                      <img
                        src="/api/placeholder/300/200"
                        alt={news.title}
                        className="w-full h-48 md:h-full object-cover"
                      />
                    </div>
                    <div className="md:col-span-3 p-6">
                      <div className="flex items-center gap-4 mb-3">
                        <Badge variant="secondary" className="text-xs">
                          {news.category}
                        </Badge>
                        <span className="text-sm text-gray-500 flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(news.date).toLocaleDateString('hi-IN')}
                        </span>
                        <span className="text-sm text-gray-500 flex items-center">
                          <Eye className="w-4 h-4 mr-1" />
                          {news.views} views
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-3">
                        {news.title}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {news.excerpt}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          लेखक: {news.author}
                        </span>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedNews(news.id)}
                          >
                            पूरा पढ़ें
                          </Button>
                          <Button variant="outline" size="sm">
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {filteredNews.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📰</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  कोई समाचार नहीं मिला
                </h3>
                <p className="text-gray-600">
                  कृपया अपनी खोज या फिल्टर बदलकर पुनः प्रयास करें
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* News Detail Modal */}
      {selectedNews && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto">
            {(() => {
              const news = newsItems.find(n => n.id === selectedNews);
              if (!news) return null;
              
              return (
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <Badge variant="secondary">{news.category}</Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedNews(null)}
                    >
                      ✕
                    </Button>
                  </div>
                  
                  <img
                    src="/api/placeholder/800/400"
                    alt={news.title}
                    className="w-full h-64 object-cover rounded-lg mb-6"
                  />
                  
                  <h1 className="text-2xl font-bold text-gray-800 mb-4">
                    {news.title}
                  </h1>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(news.date).toLocaleDateString('hi-IN')}
                    </span>
                    <span>लेखक: {news.author}</span>
                    <span className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      {news.views} views
                    </span>
                  </div>
                  
                  <div className="prose max-w-none">
                    {news.content.split('\n').map((paragraph, index) => (
                      <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-6">
                    {news.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}