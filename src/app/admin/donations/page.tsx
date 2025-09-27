"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Edit, Trash2, Phone, User, Droplets, Heart } from "lucide-react";
import { collection, getDocs, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";

interface BloodDonor {
  id: string;
  name: string;
  bloodGroup: string;
  phone: string;
  location: string;
  lastDonation: string;
  totalDonations: number;
  isActive: boolean;
}

interface BodyDonor {
  id: string;
  name: string;
  age: number;
  location: string;
  registrationDate: string;
  isActive: boolean;
}

interface FinancialDonor {
  id: string;
  name: string;
  amount: number;
  purpose: string;
  date: string;
  image?: string;
  isActive: boolean;
}

export default function AdminDonationsPage() {
  const [bloodDonors, setBloodDonors] = useState<BloodDonor[]>([]);
  const [bodyDonors, setBodyDonors] = useState<BodyDonor[]>([]);
  const [financialDonors, setFinancialDonors] = useState<FinancialDonor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchAllDonors();
  }, []);

  const fetchAllDonors = async () => {
    try {
      setLoading(true);
      
      // Fetch blood donors
      const bloodQuery = query(collection(db, "bloodDonors"), orderBy("name"));
      const bloodSnapshot = await getDocs(bloodQuery);
      const bloodData = bloodSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as BloodDonor[];
      setBloodDonors(bloodData);

      // Fetch body donors
      const bodyQuery = query(collection(db, "bodyDonors"), orderBy("name"));
      const bodySnapshot = await getDocs(bodyQuery);
      const bodyData = bodySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as BodyDonor[];
      setBodyDonors(bodyData);

      // Fetch financial donors
      const financialQuery = query(collection(db, "financialDonors"), orderBy("date", "desc"));
      const financialSnapshot = await getDocs(financialQuery);
      const financialData = financialSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FinancialDonor[];
      setFinancialDonors(financialData);

    } catch (error) {
      console.error("Error fetching donors:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBloodDonor = async (id: string) => {
    if (confirm("क्या आप वाकई इस रक्तदाता को हटाना चाहते हैं?")) {
      try {
        await deleteDoc(doc(db, "bloodDonors", id));
        setBloodDonors(bloodDonors.filter(donor => donor.id !== id));
      } catch (error) {
        console.error("Error deleting blood donor:", error);
      }
    }
  };

  const handleDeleteBodyDonor = async (id: string) => {
    if (confirm("क्या आप वाकई इस देहदाता को हटाना चाहते हैं?")) {
      try {
        await deleteDoc(doc(db, "bodyDonors", id));
        setBodyDonors(bodyDonors.filter(donor => donor.id !== id));
      } catch (error) {
        console.error("Error deleting body donor:", error);
      }
    }
  };

  const handleDeleteFinancialDonor = async (id: string) => {
    if (confirm("क्या आप वाकई इस भामाशाह को हटाना चाहते हैं?")) {
      try {
        await deleteDoc(doc(db, "financialDonors", id));
        setFinancialDonors(financialDonors.filter(donor => donor.id !== id));
      } catch (error) {
        console.error("Error deleting financial donor:", error);
      }
    }
  };

  const filteredBloodDonors = bloodDonors.filter(donor =>
    donor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    donor.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    donor.bloodGroup.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredBodyDonors = bodyDonors.filter(donor =>
    donor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    donor.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFinancialDonors = financialDonors.filter(donor =>
    donor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    donor.purpose.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>डेटा लोड हो रहा है...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">दान प्रबंधन</h1>
          <p className="text-gray-600">रक्तदान, देहदान और आर्थिक दान का प्रबंधन करें</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Droplets className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">रक्तदाता</p>
                <p className="text-2xl font-bold text-gray-900">{bloodDonors.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">देहदाता</p>
                <p className="text-2xl font-bold text-gray-900">{bodyDonors.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <User className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">भामाशाह</p>
                <p className="text-2xl font-bold text-gray-900">{financialDonors.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="खोजें..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs defaultValue="blood" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="blood" className="flex items-center">
            <Droplets className="w-4 h-4 mr-2" />
            रक्तदाता
          </TabsTrigger>
          <TabsTrigger value="body" className="flex items-center">
            <Heart className="w-4 h-4 mr-2" />
            देहदाता
          </TabsTrigger>
          <TabsTrigger value="financial" className="flex items-center">
            <User className="w-4 h-4 mr-2" />
            भामाशाह
          </TabsTrigger>
        </TabsList>

        <TabsContent value="blood" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">रक्तदाता सूची</h2>
            <Link href="/admin/donations/blood/add">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                नया रक्तदाता जोड़ें
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBloodDonors.map((donor) => (
              <Card key={donor.id}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{donor.name}</CardTitle>
                      <p className="text-sm text-gray-600">{donor.location}</p>
                    </div>
                    <Badge variant="destructive">{donor.bloodGroup}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2" />
                      {donor.phone}
                    </div>
                    <p><strong>अंतिम दान:</strong> {donor.lastDonation}</p>
                    <p><strong>कुल दान:</strong> {donor.totalDonations} बार</p>
                    <div className="flex gap-2 mt-4">
                      <Link href={`/admin/donations/blood/${donor.id}/edit`}>
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleDeleteBloodDonor(donor.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="body" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">देहदाता सूची</h2>
            <Link href="/admin/donations/body/add">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                नया देहदाता जोड़ें
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBodyDonors.map((donor) => (
              <Card key={donor.id}>
                <CardContent className="p-6">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">{donor.name}</h3>
                    <p className="text-gray-600 mb-1">आयु: {donor.age} वर्ष</p>
                    <p className="text-gray-600 mb-1">स्थान: {donor.location}</p>
                    <p className="text-sm text-gray-500 mb-4">पंजीकरण: {donor.registrationDate}</p>
                    <div className="flex gap-2 justify-center">
                      <Link href={`/admin/donations/body/${donor.id}/edit`}>
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleDeleteBodyDonor(donor.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">भामाशाह सूची</h2>
            <Link href="/admin/donations/financial/add">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                नया भामाशाह जोड़ें
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFinancialDonors.map((donor) => (
              <Card key={donor.id}>
                <CardContent className="p-6">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">{donor.name}</h3>
                    <Badge variant="secondary" className="mb-2">
                      ₹{donor.amount.toLocaleString()}
                    </Badge>
                    <p className="text-sm text-gray-600 mb-1">{donor.purpose}</p>
                    <p className="text-xs text-gray-500 mb-4">दान दिनांक: {donor.date}</p>
                    <div className="flex gap-2 justify-center">
                      <Link href={`/admin/donations/financial/${donor.id}/edit`}>
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleDeleteFinancialDonor(donor.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}