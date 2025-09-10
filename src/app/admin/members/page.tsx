"use client";

import React, { useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Phone, 
  Mail,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

// Sample data - यह बाद में Firebase से आएगा
const sampleMembers = [
  {
    id: '1',
    name: 'राजेश कुमार शर्मा',
    email: 'rajesh@example.com',
    phone: '+91 98765 43210',
    membershipType: 'प्रीमियम',
    joinDate: '15 जनवरी 2023',
    status: 'सक्रिय',
    booksIssued: 3
  },
  {
    id: '2',
    name: 'सुनीता देवी',
    email: 'sunita@example.com',
    phone: '+91 98765 43211',
    membershipType: 'सामान्य',
    joinDate: '20 फरवरी 2023',
    status: 'सक्रिय',
    booksIssued: 1
  },
  {
    id: '3',
    name: 'मोहन लाल जी',
    email: 'mohan@example.com',
    phone: '+91 98765 43212',
    membershipType: 'आजीवन',
    joinDate: '10 मार्च 2023',
    status: 'निष्क्रिय',
    booksIssued: 0
  }
];

export default function MembersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [members] = useState(sampleMembers);

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.phone.includes(searchQuery)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'सक्रिय':
        return 'bg-green-100 text-green-800';
      case 'निष्क्रिय':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getMembershipColor = (type: string) => {
    switch (type) {
      case 'प्रीमियम':
        return 'bg-purple-100 text-purple-800';
      case 'आजीवन':
        return 'bg-gold-100 text-gold-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <ProtectedRoute adminOnly={true}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <Link href="/admin/dashboard">
                  <Button variant="ghost" size="sm" className="mr-4">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    वापस
                  </Button>
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                    <Users className="w-6 h-6 mr-2" />
                    सदस्य प्रबंधन
                  </h1>
                  <p className="text-gray-600">
                    कुल सदस्य: {members.length}
                  </p>
                </div>
              </div>
              <Link href="/admin/members/add">
                <Button className="flex items-center">
                  <Plus className="w-4 h-4 mr-2" />
                  नया सदस्य जोड़ें
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="नाम, ईमेल या फोन नंबर से खोजें..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Members List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((member) => (
              <Card key={member.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-800">
                        {member.name}
                      </CardTitle>
                      <p className="text-sm text-gray-600">
                        सदस्य ID: {member.id}
                      </p>
                    </div>
                    <div className="flex space-x-1">
                      <Button size="sm" variant="ghost">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="w-4 h-4 mr-2" />
                      {member.email}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="w-4 h-4 mr-2" />
                      {member.phone}
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <Badge className={getMembershipColor(member.membershipType)}>
                        {member.membershipType}
                      </Badge>
                      <Badge className={getStatusColor(member.status)}>
                        {member.status}
                      </Badge>
                    </div>

                    <div className="text-sm text-gray-600">
                      <p><strong>सदस्यता:</strong> {member.joinDate}</p>
                      <p><strong>जारी पुस्तकें:</strong> {member.booksIssued}</p>
                    </div>

                    <div className="flex space-x-2 pt-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        विवरण देखें
                      </Button>
                      <Button size="sm" className="flex-1">
                        संपर्क करें
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredMembers.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  कोई सदस्य नहीं मिला
                </h3>
                <p className="text-gray-600 mb-4">
                  आपकी खोज के अनुसार कोई सदस्य नहीं मिला।
                </p>
                <Button onClick={() => setSearchQuery('')}>
                  सभी सदस्य दिखाएं
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}