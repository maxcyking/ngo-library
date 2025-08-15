"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MAJOR_ACTIVITIES } from "@/lib/constants";

export default function WorkAreasPage() {
  const projects = [
    {
      title: "पुस्तकालय भवन निर्माण",
      description: "35 लाख रुपए की लागत से आधुनिक पुस्तकालय भवन का निर्माण कार्य प्रगति पर है।",
      status: "प्रगति पर",
      progress: 75,
      startDate: "जनवरी 2024",
      expectedCompletion: "जून 2024",
      image: "/projects/library-construction.jpg",
      category: "शिक्षा"
    },
    {
      title: "मासिक स्वास्थ्य शिविर",
      description: "हर महीने निःशुल्क स्वास्थ्य जांच शिविर का आयोजन किया जाता है।",
      status: "चालू",
      beneficiaries: "200+ प्रति माह",
      startDate: "2020",
      image: "/projects/health-camp.jpg",
      category: "स्वास्थ्य"
    },
    {
      title: "रक्तदान जागरूकता अभियान",
      description: "नियमित रक्तदान शिविर और जागरूकता कार्यक्रम का आयोजन।",
      status: "चालू",
      achievement: "150+ सक्रिय रक्तदाता",
      startDate: "2020",
      image: "/projects/blood-donation.jpg",
      category: "स्वास्थ्य"
    },
    {
      title: "महिला सशक्तिकरण कार्यक्रम",
      description: "महिलाओं के लिए कौशल विकास और स्वरोजगार के अवसर प्रदान करना।",
      status: "चालू",
      beneficiaries: "100+ महिलाएं",
      startDate: "2021",
      image: "/projects/women-empowerment.jpg",
      category: "सामाजिक सेवा"
    },
    {
      title: "वृक्षारोपण अभियान",
      description: "पर्यावरण संरक्षण के लिए नियमित वृक्षारोपण कार्यक्रम।",
      status: "चालू",
      achievement: "5000+ पेड़ लगाए गए",
      startDate: "2020",
      image: "/projects/tree-plantation.jpg",
      category: "पर्यावरण"
    },
    {
      title: "शिक्षा सहायता कार्यक्रम",
      description: "गरीब बच्चों को निःशुल्क शिक्षा सामग्री और छात्रवृत्ति प्रदान करना।",
      status: "चालू",
      beneficiaries: "500+ छात्र",
      startDate: "2020",
      image: "/projects/education-support.jpg",
      category: "शिक्षा"
    }
  ];

  const achievements = [
    {
      title: "स्वास्थ्य सेवा",
      stats: [
        { label: "स्वास्थ्य शिविर", value: "25+" },
        { label: "लाभार्थी", value: "5000+" },
        { label: "निःशुल्क दवाएं", value: "₹2 लाख+" }
      ]
    },
    {
      title: "शिक्षा सेवा", 
      stats: [
        { label: "छात्रवृत्ति", value: "100+" },
        { label: "पुस्तकें वितरित", value: "1000+" },
        { label: "शिक्षा सामग्री", value: "₹1 लाख+" }
      ]
    },
    {
      title: "सामाजिक सेवा",
      stats: [
        { label: "रक्तदान यूनिट", value: "500+" },
        { label: "परिवारों की सहायता", value: "200+" },
        { label: "कार्यक्रम आयोजित", value: "50+" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              🌟 हमारे कार्य क्षेत्र
            </h1>
            <p className="text-xl mb-8">
              समाज सेवा के विभिन्न क्षेत्रों में हमारे योगदान और उपलब्धियां
            </p>
          </div>
        </div>
      </section>

      {/* Major Activities */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              मुख्य गतिविधियां
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              हम विभिन्न क्षेत्रों में समाज की सेवा करते हैं
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {MAJOR_ACTIVITIES.map((activity, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-8">
                  <div className="text-4xl mb-4">{activity.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    {activity.title}
                  </h3>
                  <p className="text-gray-600">
                    {activity.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Current Projects */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              चालू परियोजनाएं
            </h2>
            <p className="text-lg text-gray-600">
              वर्तमान में चल रहे कार्यक्रम और परियोजनाएं
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="h-48 bg-gray-200">
                  <img
                    src="/api/placeholder/400/200"
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {project.category}
                    </Badge>
                    <Badge 
                      variant={project.status === "प्रगति पर" ? "warning" : "success"}
                      className="text-xs"
                    >
                      {project.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg font-semibold text-gray-800">
                    {project.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4 text-sm">
                    {project.description}
                  </p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">शुरुआत:</span>
                      <span className="font-medium">{project.startDate}</span>
                    </div>
                    
                    {project.progress && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-500">प्रगति:</span>
                          <span className="font-medium">{project.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                      </>
                    )}
                    
                    {project.beneficiaries && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">लाभार्थी:</span>
                        <span className="font-medium">{project.beneficiaries}</span>
                      </div>
                    )}
                    
                    {project.achievement && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">उपलब्धि:</span>
                        <span className="font-medium">{project.achievement}</span>
                      </div>
                    )}
                    
                    {project.expectedCompletion && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">पूर्णता:</span>
                        <span className="font-medium">{project.expectedCompletion}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              हमारी उपलब्धियां
            </h2>
            <p className="text-lg text-gray-600">
              आंकड़ों में देखें हमारे योगदान को
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {achievements.map((achievement, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-xl text-green-600">
                    {achievement.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {achievement.stats.map((stat, statIndex) => (
                      <div key={statIndex} className="border-b border-gray-100 pb-2 last:border-b-0">
                        <div className="text-2xl font-bold text-gray-800">
                          {stat.value}
                        </div>
                        <div className="text-sm text-gray-600">
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Future Plans */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              भविष्य की योजनाएं
            </h2>
            <p className="text-lg text-gray-600">
              आने वाले समय में हमारे लक्ष्य और योजनाएं
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-xl text-blue-600 flex items-center">
                    🏗️ अल्पकालिक योजनाएं (2024)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span className="text-gray-600">पुस्तकालय भवन निर्माण पूर्ण करना</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span className="text-gray-600">डिजिटल लाइब्रेरी सिस्टम शुरू करना</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span className="text-gray-600">मोबाइल हेल्थ यूनिट शुरू करना</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span className="text-gray-600">कंप्यूटर प्रशिक्षण केंद्र स्थापना</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-xl text-purple-600 flex items-center">
                    🚀 दीर्घकालिक योजनाएं (2025+)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">○</span>
                      <span className="text-gray-600">आवासीय स्कूल की स्थापना</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">○</span>
                      <span className="text-gray-600">सामुदायिक स्वास्थ्य केंद्र</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">○</span>
                      <span className="text-gray-600">कृषि प्रशिक्षण केंद्र</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">○</span>
                      <span className="text-gray-600">महिला सशक्तिकरण केंद्र</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              हमारे साथ जुड़ें
            </h2>
            <p className="text-xl mb-8">
              समाज सेवा के इस महान कार्य में आपका योगदान अमूल्य है
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/register"
                className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300"
              >
                सदस्य बनें
              </a>
              <a
                href="/donations"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors duration-300"
              >
                दान करें
              </a>
              <a
                href="/contact"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-300"
              >
                संपर्क करें
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}