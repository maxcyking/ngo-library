"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Heart,
  Droplets,
  User,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

declare global {
  interface Window {
    Razorpay: any;
  }
}

type DonationType = "money" | "blood" | "body";

export default function DonatePage() {
  const { settings } = useSettings();
  const [donationType, setDonationType] = useState<DonationType>("money");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [lastDonation, setLastDonation] = useState<{
    name: string;
    amount: string;
    message: string;
    date: string;
  } | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    amount: "",
    message: "",
    // Blood donation specific
    bloodGroup: "",
    age: "",
    lastDonation: "",
    // Body donation specific
    dateOfBirth: "",
    medicalHistory: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleMoneyDonation = async () => {
    if (!formData.name || !formData.phone || !formData.amount) {
      alert("कृपया सभी आवश्यक फील्ड भरें");
      return;
    }

    const amount = parseInt(formData.amount);
    if (amount < 1) {
      alert("कृपया वैध राशि दर्ज करें");
      return;
    }

    setLoading(true);

    try {
      // Load Razorpay script
      const res = await loadRazorpayScript();
      if (!res) {
        alert("Razorpay SDK failed to load. Please check your internet connection.");
        setLoading(false);
        return;
      }

      // Create Razorpay order
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_YOUR_KEY_ID", // Replace with your Razorpay key
        amount: amount * 100, // Amount in paise
        currency: "INR",
        name: settings.siteName || "एरोज्ञा पुस्तकालय",
        description: formData.message || "दान राशि",
        image: settings.logo || "",
        handler: async function (response: any) {
          // Payment successful
          console.log("Payment successful:", response);
          setLoading(true);
          
          try {
            // Save to Firebase
            const docRef = await addDoc(collection(db, "financialDonors"), {
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
              address: formData.address,
              amount: amount,
              purpose: formData.message || "सामान्य दान",
              date: new Date().toLocaleDateString("hi-IN"),
              paymentId: response.razorpay_payment_id,
              paymentSignature: response.razorpay_signature || "",
              orderId: response.razorpay_order_id || "",
              isActive: true,
              createdAt: serverTimestamp(),
            });

            console.log("Donation saved to Firebase:", docRef.id);

            // Store donation details for success page
            setLastDonation({
              name: formData.name,
              amount: amount.toString(),
              message: formData.message || "सामान्य दान",
              date: new Date().toLocaleDateString("hi-IN")
            });

            // Clear form
            setFormData({
              name: "",
              email: "",
              phone: "",
              address: "",
              amount: "",
              message: "",
              bloodGroup: "",
              age: "",
              lastDonation: "",
              dateOfBirth: "",
              medicalHistory: "",
            });

            // Show success page
            setLoading(false);
            setSuccess(true);
            
          } catch (error) {
            console.error("Error saving donation:", error);
            setLoading(false);
            alert("दान सफल रहा लेकिन डेटा सेव करने में त्रुटि हुई। कृपया हमसे संपर्क करें।");
          }
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
            console.log("Payment cancelled by user");
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        notes: {
          address: formData.address,
          message: formData.message,
        },
        theme: {
          color: "#22c55e",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert("भुगतान प्रक्रिया में त्रुटि हुई");
    } finally {
      setLoading(false);
    }
  };

  const handleBloodDonation = async () => {
    if (!formData.name || !formData.phone || !formData.bloodGroup || !formData.age) {
      alert("कृपया सभी आवश्यक फील्ड भरें");
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, "bloodDonors"), {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        location: formData.address,
        bloodGroup: formData.bloodGroup,
        age: parseInt(formData.age),
        lastDonation: formData.lastDonation || "पहली बार",
        totalDonations: 0,
        isActive: true,
        createdAt: serverTimestamp(),
      });

      setSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        amount: "",
        message: "",
        bloodGroup: "",
        age: "",
        lastDonation: "",
        dateOfBirth: "",
        medicalHistory: "",
      });
      alert("रक्तदान पंजीकरण सफल! धन्यवाद।");
    } catch (error) {
      console.error("Error registering blood donor:", error);
      alert("पंजीकरण में त्रुटि हुई। कृपया पुनः प्रयास करें।");
    } finally {
      setLoading(false);
    }
  };

  const handleBodyDonation = async () => {
    if (!formData.name || !formData.phone || !formData.dateOfBirth) {
      alert("कृपया सभी आवश्यक फील्ड भरें");
      return;
    }

    setLoading(true);

    try {
      const age = new Date().getFullYear() - new Date(formData.dateOfBirth).getFullYear();
      
      await addDoc(collection(db, "bodyDonors"), {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        location: formData.address,
        age: age,
        dateOfBirth: formData.dateOfBirth,
        medicalHistory: formData.medicalHistory,
        registrationDate: new Date().toLocaleDateString("hi-IN"),
        isActive: true,
        createdAt: serverTimestamp(),
      });

      setSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        amount: "",
        message: "",
        bloodGroup: "",
        age: "",
        lastDonation: "",
        dateOfBirth: "",
        medicalHistory: "",
      });
      alert("देहदान पंजीकरण सफल! आपका महान कार्य सराहनीय है।");
    } catch (error) {
      console.error("Error registering body donor:", error);
      alert("पंजीकरण में त्रुटि हुई। कृपया पुनः प्रयास करें।");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (donationType === "money") {
      handleMoneyDonation();
    } else if (donationType === "blood") {
      handleBloodDonation();
    } else if (donationType === "body") {
      handleBodyDonation();
    }
  };

  if (success && donationType === "money") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <Card className="text-center shadow-lg">
            <CardContent className="p-8">
              <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 animate-bounce">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                🙏 दान सफल!
              </h2>
              <p className="text-xl text-gray-600 mb-6">
                आपके उदार योगदान के लिए धन्यवाद
              </p>

              {/* Donation Details */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-xl p-6 mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">💰 दान विवरण</h3>
                <div className="space-y-2 text-left">
                  <div className="flex justify-between">
                    <span className="text-gray-600">दानदाता:</span>
                    <span className="font-semibold">{lastDonation?.name || "Anonymous"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">राशि:</span>
                    <span className="font-bold text-green-600 text-xl">₹{lastDonation?.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">दिनांक:</span>
                    <span className="font-semibold">{lastDonation?.date}</span>
                  </div>
                  {lastDonation?.message && lastDonation.message !== "सामान्य दान" && (
                    <div className="pt-2 border-t">
                      <span className="text-gray-600">संदेश:</span>
                      <p className="font-semibold mt-1">{lastDonation.message}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Thank You Message */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-gray-700 leading-relaxed">
                  आपका योगदान समाज सेवा, शिक्षा और स्वास्थ्य के क्षेत्र में उपयोग किया जाएगा। 
                  आपकी उदारता से हम और भी बेहतर सेवाएं प्रदान कर सकेंगे।
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => {
                    setSuccess(false);
                    setLastDonation(null);
                    setFormData({
                      name: "",
                      email: "",
                      phone: "",
                      address: "",
                      amount: "",
                      message: "",
                      bloodGroup: "",
                      age: "",
                      lastDonation: "",
                      dateOfBirth: "",
                      medicalHistory: "",
                    });
                  }}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  और दान करें
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => window.location.href = "/donations"}
                >
                  दान सूची देखें
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => window.location.href = "/"}
                >
                  मुख्य पृष्ठ
                </Button>
              </div>

              {/* Contact Info */}
              <div className="mt-6 pt-6 border-t">
                <p className="text-sm text-gray-600 mb-2">रसीद या किसी सहायता के लिए संपर्क करें:</p>
                <div className="flex flex-col sm:flex-row justify-center gap-4 text-sm">
                  <a href={`tel:${settings.phone}`} className="text-green-600 hover:text-green-700 font-medium">
                    📞 {settings.phone}
                  </a>
                  <a href={`mailto:${settings.email}`} className="text-blue-600 hover:text-blue-700 font-medium">
                    ✉️ {settings.email}
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
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
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              ❤️ दान करें
            </h1>
            <p className="text-xl mb-8">
              आपका छोटा सा योगदान किसी के जीवन में बड़ा बदलाव ला सकता है
            </p>
          </div>
        </div>
      </section>

      {/* Donation Type Selection */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">दान का प्रकार चुनें</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <Card 
                className={`cursor-pointer transition-all duration-300 ${
                  donationType === "money" ? "ring-4 ring-green-500 shadow-lg" : "hover:shadow-md"
                }`}
                onClick={() => setDonationType("money")}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CreditCard className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">आर्थिक सहायता</h3>
                  <p className="text-gray-600 text-sm">भामाशाह बनें</p>
                </CardContent>
              </Card>

              <Card 
                className={`cursor-pointer transition-all duration-300 ${
                  donationType === "blood" ? "ring-4 ring-red-500 shadow-lg" : "hover:shadow-md"
                }`}
                onClick={() => setDonationType("blood")}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Droplets className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">रक्तदान</h3>
                  <p className="text-gray-600 text-sm">जीवनदाता बनें</p>
                </CardContent>
              </Card>

              <Card 
                className={`cursor-pointer transition-all duration-300 ${
                  donationType === "body" ? "ring-4 ring-blue-500 shadow-lg" : "hover:shadow-md"
                }`}
                onClick={() => setDonationType("body")}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">देहदान</h3>
                  <p className="text-gray-600 text-sm">महादान करें</p>
                </CardContent>
              </Card>
            </div>

            {/* Donation Form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">
                  {donationType === "money" && "💰 आर्थिक सहायता फॉर्म"}
                  {donationType === "blood" && "🩸 रक्तदान पंजीकरण फॉर्म"}
                  {donationType === "body" && "🙏 देहदान पंजीकरण फॉर्म"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Common Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">
                        <User className="w-4 h-4 inline mr-1" />
                        नाम *
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="पूरा नाम दर्ज करें"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">
                        <Phone className="w-4 h-4 inline mr-1" />
                        मोबाइल नंबर *
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+91 98765 43210"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">
                        <Mail className="w-4 h-4 inline mr-1" />
                        ईमेल
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="example@email.com"
                      />
                    </div>

                    <div>
                      <Label htmlFor="address">
                        <MapPin className="w-4 h-4 inline mr-1" />
                        पता
                      </Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="शहर, राज्य"
                      />
                    </div>
                  </div>

                  {/* Money Donation Specific Fields */}
                  {donationType === "money" && (
                    <>
                      <div>
                        <Label htmlFor="amount">
                          <CreditCard className="w-4 h-4 inline mr-1" />
                          दान राशि (₹) *
                        </Label>
                        <Input
                          id="amount"
                          name="amount"
                          type="number"
                          value={formData.amount}
                          onChange={handleInputChange}
                          placeholder="राशि दर्ज करें"
                          min="1"
                          required
                        />
                        <div className="flex gap-2 mt-2">
                          {[100, 500, 1000, 5000].map((amt) => (
                            <Button
                              key={amt}
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setFormData(prev => ({ ...prev, amount: amt.toString() }))}
                            >
                              ₹{amt}
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="message">संदेश (वैकल्पिक)</Label>
                        <Textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          placeholder="दान का उद्देश्य या संदेश"
                          rows={3}
                        />
                      </div>
                    </>
                  )}

                  {/* Blood Donation Specific Fields */}
                  {donationType === "blood" && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="bloodGroup">ब्लड ग्रुप *</Label>
                          <select
                            id="bloodGroup"
                            name="bloodGroup"
                            value={formData.bloodGroup}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            required
                          >
                            <option value="">चुनें</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                          </select>
                        </div>

                        <div>
                          <Label htmlFor="age">आयु *</Label>
                          <Input
                            id="age"
                            name="age"
                            type="number"
                            value={formData.age}
                            onChange={handleInputChange}
                            placeholder="आयु दर्ज करें"
                            min="18"
                            max="65"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="lastDonation">अंतिम रक्तदान (वैकल्पिक)</Label>
                        <Input
                          id="lastDonation"
                          name="lastDonation"
                          type="date"
                          value={formData.lastDonation}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <h4 className="font-semibold text-yellow-800 mb-2 flex items-center">
                          <AlertCircle className="w-5 h-5 mr-2" />
                          महत्वपूर्ण जानकारी:
                        </h4>
                        <ul className="text-sm text-yellow-700 space-y-1">
                          <li>• रक्तदान के लिए आयु 18-65 वर्ष होनी चाहिए</li>
                          <li>• वजन कम से कम 45 किलो होना चाहिए</li>
                          <li>• दो रक्तदान के बीच 3 महीने का अंतर आवश्यक है</li>
                          <li>• रक्तदान से पहले स्वस्थ होना जरूरी है</li>
                        </ul>
                      </div>
                    </>
                  )}

                  {/* Body Donation Specific Fields */}
                  {donationType === "body" && (
                    <>
                      <div>
                        <Label htmlFor="dateOfBirth">जन्म तिथि *</Label>
                        <Input
                          id="dateOfBirth"
                          name="dateOfBirth"
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="medicalHistory">चिकित्सा इतिहास (वैकल्पिक)</Label>
                        <Textarea
                          id="medicalHistory"
                          name="medicalHistory"
                          value={formData.medicalHistory}
                          onChange={handleInputChange}
                          placeholder="कोई गंभीर बीमारी या ऑपरेशन की जानकारी"
                          rows={3}
                        />
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                          <AlertCircle className="w-5 h-5 mr-2" />
                          देहदान के बारे में:
                        </h4>
                        <ul className="text-sm text-blue-700 space-y-1">
                          <li>• देहदान चिकित्सा शिक्षा और अनुसंधान के लिए महत्वपूर्ण है</li>
                          <li>• यह पूर्णतः स्वैच्छिक और निःशुल्क है</li>
                          <li>• परिवार की सहमति आवश्यक है</li>
                          <li>• मृत्यु के बाद शरीर को मेडिकल कॉलेज को दान किया जाता है</li>
                        </ul>
                      </div>
                    </>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? (
                      "प्रक्रिया जारी है..."
                    ) : (
                      <>
                        {donationType === "money" && "💳 भुगतान करें"}
                        {donationType === "blood" && "✅ पंजीकरण करें"}
                        {donationType === "body" && "✅ पंजीकरण करें"}
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Bank Details for Money Donation */}
            {donationType === "money" && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>🏦 बैंक विवरण (सीधे बैंक ट्रांसफर के लिए)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p><strong>बैंक:</strong> {settings.bankName || "Punjab National Bank"}</p>
                      <p><strong>खाता नं:</strong> {settings.accountNumber || "9657001000035037"}</p>
                      <p><strong>IFSC:</strong> {settings.ifscCode || "PUNB0965700"}</p>
                    </div>
                    <div>
                      <p><strong>खाता नाम:</strong> एरोज्ञा पुस्तकालय एवं सेवा संस्था</p>
                      <p><strong>UPI ID:</strong> {settings.upiId || "Not Available"}</p>
                      <p><strong>शाखा:</strong> गुडामलानी</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
