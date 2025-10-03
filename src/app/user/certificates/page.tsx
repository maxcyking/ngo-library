"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Search, Calendar, Award, Eye } from "lucide-react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Certificate {
  id: string;
  title: string;
  imageUrl: string;
  createdAt: Date;
}

export default function UserCertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const certificatesRef = collection(db, 'certificates');
      const q = query(certificatesRef, orderBy('createdAt', 'desc'));
      
      const querySnapshot = await getDocs(q);
      const certificatesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      })) as Certificate[];
      
      setCertificates(certificatesData);
    } catch (error) {
      console.error('Error fetching certificates:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCertificates = certificates.filter(cert => {
    return cert.title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleDownload = (certificate: Certificate) => {
    // Create a temporary link to download the image
    const link = document.createElement('a');
    link.href = certificate.imageUrl;
    link.download = `${certificate.title.replace(/\s+/g, '_')}_certificate.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleView = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">प्रमाणपत्र लोड हो रहे हैं...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 flex items-center justify-center">
              <Award className="w-12 h-12 mr-4" />
              प्रमाणपत्र संग्रह
            </h1>
            <p className="text-xl mb-8">
              संस्था द्वारा प्रदान किए गए सभी प्रमाणपत्र और सम्मान
            </p>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="प्रमाणपत्र खोजें..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Certificates Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {filteredCertificates.length === 0 ? (
            <div className="text-center py-16">
              <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                कोई प्रमाणपत्र नहीं मिला
              </h3>
              <p className="text-gray-500">
                {searchTerm 
                  ? "खोज मापदंड बदलकर पुनः प्रयास करें" 
                  : "अभी तक कोई प्रमाणपत्र अपलोड नहीं किया गया है"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCertificates.map((certificate) => (
                <Card key={certificate.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="relative h-48 bg-gray-200">
                    <img
                      src={certificate.imageUrl}
                      alt={certificate.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/api/placeholder/400/300";
                      }}
                    />

                  </div>
                  
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-800 line-clamp-2">
                      {certificate.title}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          जोड़ा गया:
                        </span>
                        <span className="font-medium">
                          {certificate.createdAt.toLocaleDateString('hi-IN')}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleView(certificate)}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        देखें
                      </Button>
                      <Button
                        onClick={() => handleDownload(certificate)}
                        size="sm"
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        डाउनलोड
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Certificate Modal */}
      {selectedCertificate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  {selectedCertificate.title}
                </h3>
                <Button
                  onClick={() => setSelectedCertificate(null)}
                  variant="outline"
                  size="sm"
                >
                  ✕
                </Button>
              </div>
              
              <div className="mb-4">
                <img
                  src={selectedCertificate.imageUrl}
                  alt={selectedCertificate.title}
                  className="w-full h-auto max-h-96 object-contain border rounded-lg"
                />
              </div>
              
              <div className="text-sm">
                <div>
                  <strong>जोड़ा गया:</strong> {selectedCertificate.createdAt.toLocaleDateString('hi-IN')}
                </div>
              </div>
              
              <div className="flex gap-2 mt-6">
                <Button
                  onClick={() => handleDownload(selectedCertificate)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  डाउनलोड करें
                </Button>
                <Button
                  onClick={() => setSelectedCertificate(null)}
                  variant="outline"
                >
                  बंद करें
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}