"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Calendar,
  Save,
  Star,
  Plus,
  Trash2
} from 'lucide-react';
import Link from 'next/link';
import {
  collection,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

export default function AddEventPage() {
  const [loading, setLoading] = useState(false);
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    longDescription: '',
    date: '', // Changed from eventDate to match home page
    startTime: '', // Changed from eventTime to match home page
    endTime: '',
    location: '',
    category: '',
    eventType: 'other',
    maxParticipants: '',
    registrationDeadline: '',
    contactPerson: '',
    contactPhone: '',
    contactEmail: '',
    targetAudience: '',
    registrationFee: '0',
    featuredImage: '',
    isRegistrationOpen: true,
    isFeatured: false,
    isUrgent: false, // Added for home page cards
    isActive: true // Added for home page filtering
  });

  const [requirements, setRequirements] = useState<string[]>(['']);
  const [benefits, setBenefits] = useState<string[]>(['']); // Added for home page cards
  const [agenda, setAgenda] = useState<string[]>(['']);
  const [organizers, setOrganizers] = useState<string[]>(['']);
  const [sponsors, setSponsors] = useState<string[]>(['']);

  const router = useRouter();
  const { user } = useAuth();

  const eventTypes = {
    'health_camp': 'स्वास्थ्य शिविर',
    'blood_donation': 'रक्तदान शिविर',
    'workshop': 'कार्यशाला',
    'seminar': 'सेमिनार',
    'cultural': 'सांस्कृतिक कार्यक्रम',
    'inauguration': 'उद्घाटन समारोह',
    'educational': 'शैक्षणिक कार्यक्रम',
    'social': 'सामाजिक कार्यक्रम',
    'other': 'अन्य'
  };

  const categories = [
    'स्वास्थ्य सेवा',
    'रक्तदान',
    'शिक्षा',
    'महिला सशक्तिकरण',
    'पर्यावरण संरक्षण',
    'सामाजिक कल्याण',
    'सांस्कृतिक',
    'युवा विकास',
    'बुजुर्ग सेवा',
    'अन्य'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setEventData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setEventData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const addArrayItem = (setArray: React.Dispatch<React.SetStateAction<string[]>>) => {
    setArray(prev => [...prev, '']);
  };

  const removeArrayItem = (index: number, setArray: React.Dispatch<React.SetStateAction<string[]>>) => {
    setArray(prev => prev.filter((_, i) => i !== index));
  };

  const updateArrayItem = (index: number, value: string, setArray: React.Dispatch<React.SetStateAction<string[]>>) => {
    setArray(prev => prev.map((item, i) => i === index ? value : item));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const newEvent = {
        title: eventData.title,
        description: eventData.description,
        longDescription: eventData.longDescription || null,
        date: eventData.date, // Changed to match home page expectation
        startTime: eventData.startTime, // Changed to match home page expectation
        endTime: eventData.endTime || null,
        location: eventData.location,
        category: eventData.category,
        eventType: eventData.eventType,
        maxParticipants: eventData.maxParticipants ? parseInt(eventData.maxParticipants) : 0,
        currentParticipants: 0,
        registrationDeadline: eventData.registrationDeadline || null,
        isRegistrationOpen: eventData.isRegistrationOpen,
        isActive: eventData.isActive,
        isFeatured: eventData.isFeatured,
        isUrgent: eventData.isUrgent, // Added for home page cards
        featuredImage: eventData.featuredImage || null,
        contactPerson: eventData.contactPerson,
        contactPhone: eventData.contactPhone,
        contactEmail: eventData.contactEmail || null,
        requirements: requirements.filter(req => req.trim() !== ''),
        benefits: benefits.filter(benefit => benefit.trim() !== ''), // Added for home page cards
        agenda: agenda.filter(item => item.trim() !== ''),
        targetAudience: eventData.targetAudience || null,
        registrationFee: parseFloat(eventData.registrationFee) || 0,
        organizers: organizers.filter(org => org.trim() !== ''),
        sponsors: sponsors.filter(sponsor => sponsor.trim() !== ''),
        tags: [],
        status: 'published',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: user?.email || 'unknown',
        updatedBy: user?.email || 'unknown'
      };

      await addDoc(collection(db, 'events'), newEvent);

      router.push('/admin/events');
    } catch (error) {
      console.error('Error adding event:', error);
      alert('कार्यक्रम जोड़ने में त्रुटि हुई। कृपया पुनः प्रयास करें।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute adminOnly={true}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center py-4">
              <Link href="/admin/events">
                <Button variant="ghost" size="sm" className="mr-4">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  वापस
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Calendar className="w-6 h-6 mr-2" />
                  नया कार्यक्रम जोड़ें
                </h1>
                <p className="text-gray-600">
                  कार्यक्रम की विस्तृत जानकारी भरें
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Main Information */}
              <div className="lg:col-span-2 space-y-6">

                {/* Basic Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>मुख्य जानकारी</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="title">कार्यक्रम का नाम *</Label>
                      <Input
                        id="title"
                        name="title"
                        value={eventData.title}
                        onChange={handleInputChange}
                        placeholder="कार्यक्रम का नाम दर्ज करें"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">संक्षिप्त विवरण *</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={eventData.description}
                        onChange={handleInputChange}
                        placeholder="कार्यक्रम का संक्षिप्त विवरण..."
                        rows={3}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="longDescription">विस्तृत विवरण</Label>
                      <Textarea
                        id="longDescription"
                        name="longDescription"
                        value={eventData.longDescription}
                        onChange={handleInputChange}
                        placeholder="कार्यक्रम के बारे में विस्तृत जानकारी..."
                        rows={5}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="category">श्रेणी *</Label>
                        <select
                          id="category"
                          name="category"
                          value={eventData.category}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          aria-label="कार्यक्रम श्रेणी"
                          required
                        >
                          <option value="">श्रेणी चुनें</option>
                          {categories.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="eventType">कार्यक्रम का प्रकार *</Label>
                        <select
                          id="eventType"
                          name="eventType"
                          value={eventData.eventType}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          aria-label="कार्यक्रम प्रकार"
                          required
                        >
                          {Object.entries(eventTypes).map(([key, label]) => (
                            <option key={key} value={key}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Date and Time */}
                <Card>
                  <CardHeader>
                    <CardTitle>दिनांक और समय</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="date">कार्यक्रम की तारीख *</Label>
                        <Input
                          id="date"
                          name="date"
                          type="date"
                          value={eventData.date}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="startTime">प्रारंभ समय *</Label>
                        <Input
                          id="startTime"
                          name="startTime"
                          type="time"
                          value={eventData.startTime}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="registrationDeadline">पंजीकरण की अंतिम तारीख</Label>
                        <Input
                          id="registrationDeadline"
                          name="registrationDeadline"
                          type="date"
                          value={eventData.registrationDeadline}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="endTime">समाप्ति समय (वैकल्पिक)</Label>
                        <Input
                          id="endTime"
                          name="endTime"
                          type="time"
                          value={eventData.endTime}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="registrationDeadline">पंजीकरण की अंतिम तारीख</Label>
                      <Input
                        id="registrationDeadline"
                        name="registrationDeadline"
                        type="date"
                        value={eventData.registrationDeadline}
                        onChange={handleInputChange}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Location and Contact */}
                <Card>
                  <CardHeader>
                    <CardTitle>स्थान और संपर्क</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="location">कार्यक्रम स्थल *</Label>
                      <Input
                        id="location"
                        name="location"
                        value={eventData.location}
                        onChange={handleInputChange}
                        placeholder="संस्था परिसर, गुडामलानी"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="contactPerson">संपर्क व्यक्ति *</Label>
                        <Input
                          id="contactPerson"
                          name="contactPerson"
                          value={eventData.contactPerson}
                          onChange={handleInputChange}
                          placeholder=" अमराराम बोस"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="contactPhone">संपर्क फोन *</Label>
                        <Input
                          id="contactPhone"
                          name="contactPhone"
                          value={eventData.contactPhone}
                          onChange={handleInputChange}
                          placeholder="+91 9024635808"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="contactEmail">संपर्क ईमेल</Label>
                      <Input
                        id="contactEmail"
                        name="contactEmail"
                        type="email"
                        value={eventData.contactEmail}
                        onChange={handleInputChange}
                        placeholder="arogyapustkalaya@gmail.com"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Requirements */}
                <Card>
                  <CardHeader>
                    <CardTitle>आवश्यकताएं और एजेंडा</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <Label>आवश्यकताएं</Label>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => addArrayItem(setRequirements)}
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          जोड़ें
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {requirements.map((req, index) => (
                          <div key={index} className="flex space-x-2">
                            <Input
                              value={req}
                              onChange={(e) => updateArrayItem(index, e.target.value, setRequirements)}
                              placeholder="आवश्यकता दर्ज करें..."
                            />
                            {requirements.length > 1 && (
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => removeArrayItem(index, setRequirements)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <Label>कार्यक्रम के लाभ</Label>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => addArrayItem(setBenefits)}
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          जोड़ें
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {benefits.map((benefit, index) => (
                          <div key={index} className="flex space-x-2">
                            <Input
                              value={benefit}
                              onChange={(e) => updateArrayItem(index, e.target.value, setBenefits)}
                              placeholder="लाभ दर्ज करें..."
                            />
                            {benefits.length > 1 && (
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => removeArrayItem(index, setBenefits)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <Label>कार्यक्रम एजेंडा</Label>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => addArrayItem(setAgenda)}
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          जोड़ें
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {agenda.map((item, index) => (
                          <div key={index} className="flex space-x-2">
                            <Input
                              value={item}
                              onChange={(e) => updateArrayItem(index, e.target.value, setAgenda)}
                              placeholder="एजेंडा आइटम दर्ज करें..."
                            />
                            {agenda.length > 1 && (
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => removeArrayItem(index, setAgenda)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar Information */}
              <div className="space-y-6">

                {/* Registration Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle>पंजीकरण सेटिंग्स</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="maxParticipants">अधिकतम प्रतिभागी</Label>
                      <Input
                        id="maxParticipants"
                        name="maxParticipants"
                        type="number"
                        value={eventData.maxParticipants}
                        onChange={handleInputChange}
                        placeholder="100"
                        min="1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="registrationFee">पंजीकरण शुल्क (₹)</Label>
                      <Input
                        id="registrationFee"
                        name="registrationFee"
                        type="number"
                        step="0.01"
                        value={eventData.registrationFee}
                        onChange={handleInputChange}
                        placeholder="0"
                        min="0"
                      />
                    </div>

                    <div>
                      <Label htmlFor="targetAudience">लक्षित दर्शक</Label>
                      <Input
                        id="targetAudience"
                        name="targetAudience"
                        value={eventData.targetAudience}
                        onChange={handleInputChange}
                        placeholder="सभी आयु वर्ग, महिलाएं, युवा, आदि"
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="isRegistrationOpen">पंजीकरण खुला</Label>
                        <input
                          id="isRegistrationOpen"
                          name="isRegistrationOpen"
                          type="checkbox"
                          checked={eventData.isRegistrationOpen}
                          onChange={handleInputChange}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          aria-label="पंजीकरण खुला रखें"
                          title="पंजीकरण खुला रखें"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Label htmlFor="isFeatured">फीचर्ड कार्यक्रम</Label>
                          <Star className="w-4 h-4 text-yellow-500" />
                        </div>
                        <input
                          id="isFeatured"
                          name="isFeatured"
                          type="checkbox"
                          checked={eventData.isFeatured}
                          onChange={handleInputChange}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          aria-label="फीचर्ड कार्यक्रम के रूप में चिह्नित करें"
                          title="फीचर्ड कार्यक्रम के रूप में चिह्नित करें"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Label htmlFor="isUrgent">तत्काल आवश्यकता</Label>
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        </div>
                        <input
                          id="isUrgent"
                          name="isUrgent"
                          type="checkbox"
                          checked={eventData.isUrgent}
                          onChange={handleInputChange}
                          className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                          aria-label="तत्काल आवश्यकता के रूप में चिह्नित करें"
                          title="तत्काल आवश्यकता के रूप में चिह्नित करें"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Media */}
                <Card>
                  <CardHeader>
                    <CardTitle>मीडिया</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="featuredImage">फीचर्ड इमेज URL</Label>
                      <Input
                        id="featuredImage"
                        name="featuredImage"
                        type="url"
                        value={eventData.featuredImage}
                        onChange={handleInputChange}
                        placeholder="https://example.com/event-image.jpg"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Organizers and Sponsors */}
                <Card>
                  <CardHeader>
                    <CardTitle>आयोजक और प्रायोजक</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <Label>आयोजक</Label>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => addArrayItem(setOrganizers)}
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          जोड़ें
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {organizers.map((org, index) => (
                          <div key={index} className="flex space-x-2">
                            <Input
                              value={org}
                              onChange={(e) => updateArrayItem(index, e.target.value, setOrganizers)}
                              placeholder="आयोजक का नाम..."
                            />
                            {organizers.length > 1 && (
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => removeArrayItem(index, setOrganizers)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <Label>प्रायोजक</Label>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => addArrayItem(setSponsors)}
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          जोड़ें
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {sponsors.map((sponsor, index) => (
                          <div key={index} className="flex space-x-2">
                            <Input
                              value={sponsor}
                              onChange={(e) => updateArrayItem(index, e.target.value, setSponsors)}
                              placeholder="प्रायोजक का नाम..."
                            />
                            {sponsors.length > 1 && (
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => removeArrayItem(index, setSponsors)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Submit Button */}
                <Card>
                  <CardContent className="p-6">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full"
                      size="lg"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          कार्यक्रम जोड़ा जा रहा है...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          कार्यक्रम जोड़ें और प्रकाशित करें
                        </>
                      )}
                    </Button>
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
