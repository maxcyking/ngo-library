"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save } from "lucide-react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AddBodyDonorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    age: 0,
    location: "",
    registrationDate: "",
    isActive: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, "bodyDonors"), {
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      alert("देहदाता सफलतापूर्वक जोड़ा गया!");
      router.push("/admin/donations");
    } catch (error) {
      console.error("Error adding body donor:", error);
      alert("देहदाता जोड़ने में त्रुटि हुई!");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "age" ? parseInt(value) || 0 : value
    }));
  };

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center mb-6">
          <Link href="/admin/donations">
            <Button variant="outline" size="sm" className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              वापस
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">नया देहदाता जोड़ें</h1>
            <p className="text-gray-600">देहदाता की जानकारी भरें</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>देहदाता विवरण</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">नाम *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="देहदाता का नाम"
                  />
                </div>
                <div>
                  <Label htmlFor="age">आयु *</Label>
                  <Input
                    id="age"
                    name="age"
                    type="number"
                    value={formData.age}
                    onChange={handleChange}
                    required
                    min="1"
                    max="120"
                    placeholder="आयु वर्षों में"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">स्थान *</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    placeholder="शहर/गांव का नाम"
                  />
                </div>
                <div>
                  <Label htmlFor="registrationDate">पंजीकरण दिनांक *</Label>
                  <Input
                    id="registrationDate"
                    name="registrationDate"
                    value={formData.registrationDate}
                    onChange={handleChange}
                    required
                    placeholder="जैसे: जनवरी 2023"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      सेव हो रहा है...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      सेव करें
                    </>
                  )}
                </Button>
                <Link href="/admin/donations">
                  <Button type="button" variant="outline">
                    रद्द करें
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}