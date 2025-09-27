"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Upload } from "lucide-react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { uploadFile } from "@/lib/storage-utils";

export default function AddFinancialDonorPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        amount: 0,
        purpose: "",
        date: "",
        isActive: true
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let imageUrl = "";

            if (imageFile) {
                const uploadResult = await uploadFile(imageFile, "financial-donors");
                imageUrl = uploadResult.url;
            }

            await addDoc(collection(db, "financialDonors"), {
                ...formData,
                image: imageUrl,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });

            alert("भामाशाह सफलतापूर्वक जोड़ा गया!");
            router.push("/admin/donations");
        } catch (error) {
            console.error("Error adding financial donor:", error);
            alert("भामाशाह जोड़ने में त्रुटि हुई!");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === "amount" ? parseInt(value) || 0 : value
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
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
                        <h1 className="text-2xl font-bold text-gray-800">नया भामाशाह जोड़ें</h1>
                        <p className="text-gray-600">भामाशाह की जानकारी भरें</p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>भामाशाह विवरण</CardTitle>
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
                                        placeholder="भामाशाह का नाम"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="amount">राशि (₹) *</Label>
                                    <Input
                                        id="amount"
                                        name="amount"
                                        type="number"
                                        value={formData.amount}
                                        onChange={handleChange}
                                        required
                                        min="1"
                                        placeholder="दान की राशि"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="purpose">दान का उद्देश्य *</Label>
                                <Textarea
                                    id="purpose"
                                    name="purpose"
                                    value={formData.purpose}
                                    onChange={handleChange}
                                    required
                                    placeholder="दान किस कार्य के लिए दिया गया है"
                                    rows={3}
                                />
                            </div>

                            <div>
                                <Label htmlFor="date">दान की तारीख *</Label>
                                <Input
                                    id="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    required
                                    placeholder="जैसे: जून 2023"
                                />
                            </div>

                            <div>
                                <Label htmlFor="image">फोटो (वैकल्पिक)</Label>
                                <div className="mt-2">
                                    <input
                                        id="image"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        title="फोटो अपलोड करें"
                                        aria-label="फोटो अपलोड करें"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => document.getElementById('image')?.click()}
                                        className="w-full"
                                    >
                                        <Upload className="w-4 h-4 mr-2" />
                                        {imageFile ? imageFile.name : "फोटो अपलोड करें"}
                                    </Button>
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