"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, Eye, Download, Calendar, X } from "lucide-react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Certificate {
  id: string;
  title: string;
  imageUrl: string;
  createdAt: Date;
}

export function CertificatesSection() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const certificatesRef = collection(db, 'certificates');
      const q = query(certificatesRef, orderBy('createdAt', 'desc'), limit(12));
      
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

  const handleView = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
  };

  const handleDownload = (certificate: Certificate) => {
    const link = document.createElement('a');
    link.href = certificate.imageUrl;
    link.download = `${certificate.title.replace(/\s+/g, '_')}_certificate.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12 text-center flex items-center justify-center">
            <Award className="w-10 h-10 mr-3 text-yellow-600" />
            प्रमाणपत्र और सम्मान
          </h2>
          
          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">प्रमाणपत्र लोड हो रहे हैं...</p>
            </div>
          ) : certificates.length === 0 ? (
            <div className="text-center py-16">
              <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                कोई प्रमाणपत्र उपलब्ध नहीं
              </h3>
              <p className="text-gray-500">
                अभी तक कोई प्रमाणपत्र अपलोड नहीं किया गया है
              </p>
            </div>
          ) : (
            <>
              {/* Certificates Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                {certificates.map((certificate) => (
                  <Card key={certificate.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                    <div className="relative h-48 bg-gray-100 overflow-hidden">
                      <img
                        src={certificate.imageUrl}
                        alt={certificate.title}
                        className="w-full h-full object-contain object-top cursor-pointer hover:scale-110 transition-transform duration-300"
                        onClick={() => handleView(certificate)}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/api/placeholder/400/300";
                        }}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
                        <Button
                          onClick={() => handleView(certificate)}
                          size="sm"
                          className="bg-white text-gray-800 hover:bg-gray-100"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          देखें
                        </Button>
                      </div>
                    </div>
                    
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-semibold text-gray-800 line-clamp-2 leading-tight">
                        {certificate.title}
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {certificate.createdAt.toLocaleDateString('hi-IN')}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleView(certificate)}
                          variant="outline"
                          size="sm"
                          className="flex-1 text-xs"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          देखें
                        </Button>
                        <Button
                          onClick={() => handleDownload(certificate)}
                          size="sm"
                          className="flex-1 bg-green-600 hover:bg-green-700 text-xs"
                        >
                          <Download className="w-3 h-3 mr-1" />
                          डाउनलोड
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* View All Button */}
              <div className="text-center">
                <a href="/user/certificates">
                  <Button className="bg-blue-600 hover:bg-blue-700 px-8 py-3">
                    <Award className="w-5 h-5 mr-2" />
                    सभी प्रमाणपत्र देखें
                  </Button>
                </a>
              </div>
            </>
          )}

          {/* Certificate Modal */}
          {selectedCertificate && (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-5xl max-h-[95vh] overflow-auto relative">
                {/* Close Button */}
                <Button
                  onClick={() => setSelectedCertificate(null)}
                  variant="ghost"
                  size="sm"
                  className="absolute top-4 right-4 z-10 bg-white hover:bg-gray-100 rounded-full p-2"
                >
                  <X className="w-5 h-5" />
                </Button>

                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold text-gray-800 pr-12">
                      {selectedCertificate.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      जोड़ा गया: {selectedCertificate.createdAt.toLocaleDateString('hi-IN')}
                    </p>
                  </div>
                  
                  <div className="mb-6">
                    <img
                      src={selectedCertificate.imageUrl}
                      alt={selectedCertificate.title}
                      className="w-full h-auto max-h-[70vh] object-contain border rounded-lg shadow-lg"
                    />
                  </div>
                  
                  <div className="flex gap-3 justify-center">
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
      </div>
    </section>
  );
}