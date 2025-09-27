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

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function AddBloodDonorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    bloodGroup: "",
    phone: "",
    location: "",
    lastDonation: "",
    totalDonations: 0,
    isActive: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, "bloodDonors"), {
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      alert("रक्तदाता सफलतापूर्वक जोड़ा गया!");
      router.push("/admin/donations");
    } catch (error) {
      console.error("Error adding blood donor:", error);
      alert("रक्तदाता जोड़ने में त्रुटि हुई!");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "totalDonations" ? parseInt(value) || 0 : value
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
            <h1 className="text-2xl font-bold text-gray-800">नया रक्तदाता जोड़ें</h1>
            <p className="text-gray-600">रक्तदाता की जानकारी भरें</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>रक्तदाता विवरण</CardTitle>
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
                    placeholder="रक्तदाता का नाम"
                  />
                </div>
                <div>
                  <Label htmlFor="bloodGroup">ब्लड ग्रुप *</Label>
                  <select
                    id="bloodGroup"
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">ब्लड ग्रुप चुनें</option>
                    {bloodGroups.map((group) => (
                      <option key={group} value={group}>
                        {group}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">फोन नंबर *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="+91 98765 43210"
                  />
                </div>
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="lastDonation">अंतिम दान की तारीख</Label>
                  <Input
                    id="lastDonation"
                    name="lastDonation"
                    value={formData.lastDonation}
                    onChange={handleChange}
                    placeholder="जैसे: 15 दिसंबर 2023"
                  />
                </div>
                <div>
                  <Label htmlFor="totalDonations">कुल दान की संख्या</Label>
                  <Input
                    id="totalDonations"
                    name="totalDonations"
                    type="number"
                    value={formData.totalDonations}
                    onChange={handleChange}
                    min="0"
                    placeholder="0"
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