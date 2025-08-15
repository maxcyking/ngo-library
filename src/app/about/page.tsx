"use client";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  APP_NAME, 
  APP_TAGLINE, 
  REGISTRATION_NO, 
  PAN_NO, 
  TEAM_MEMBERS, 
  VISION_MISSION, 
  ACHIEVEMENTS,
  CONTACT_INFO 
} from "@/lib/constants";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {APP_NAME}
            </h1>
            <p className="text-xl mb-4">{APP_TAGLINE}</p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Badge variant="secondary" className="text-sm px-4 py-2">
                स्थापना: 2020
              </Badge>
              <Badge variant="secondary" className="text-sm px-4 py-2">
                रजि. नं.: {REGISTRATION_NO}
              </Badge>
              <Badge variant="secondary" className="text-sm px-4 py-2">
                PAN: {PAN_NO}
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Organization History */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                📜 संस्था का इतिहास
              </h2>
              <p className="text-lg text-gray-600">
                हमारी स्थापना से लेकर आज तक का सफर
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h3 className="text-2xl font-bold text-green-600 mb-4">स्थापना की कहानी</h3>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  एरोग्या पुस्तकालय एवं सेवा संस्था की स्थापना 2020 में श्रीमती मीना देवी और 
                  श्री आत्माराम बोरा के नेतृत्व में हुई। इस संस्था की शुरुआत का मुख्य उद्देश्य 
                  राजस्थान के बाड़मेर जिले के ग्रामीण क्षेत्रों में शिक्षा, स्वास्थ्य और 
                  सामाजिक सेवाओं को पहुंचाना था।
                </p>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  प्रारंभ में एक छोटे से कमरे से शुरू हुई यह संस्था आज 2000+ पुस्तकों के 
                  संग्रह के साथ एक पूर्ण पुस्तकालय और सेवा केंद्र बन गई है। वर्तमान में 
                  35 लाख रुपए की लागत से नया आधुनिक भवन निर्माणाधीन है।
                </p>
              </div>
              <div>
                <Image
                  src="https://images.unsplash.com/photo-1497486751825-1233686d5d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
                  alt="संस्था की स्थापना"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-lg w-full h-auto"
                />
              </div>
            </div>

            {/* Timeline */}
            <div className="mb-16">
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">
                🕐 महत्वपूर्ण मील के पत्थर
              </h3>
              <div className="space-y-8">
                {[
                  {
                    year: "2020",
                    title: "संस्था की स्थापना",
                    description: "एरोग्या पुस्तकालय एवं सेवा संस्था का पंजीकरण और प्रारंभिक कार्य शुरुआत"
                  },
                  {
                    year: "2021", 
                    title: "पुस्तकालय सेवा शुरुआत",
                    description: "500+ पुस्तकों के साथ निःशुल्क पुस्तकालय सेवा की शुरुआत"
                  },
                  {
                    year: "2022",
                    title: "स्वास्थ्य सेवा विस्तार",
                    description: "नियमित स्वास्थ्य शिविर और रक्तदान कार्यक्रम की शुरुआत"
                  },
                  {
                    year: "2023",
                    title: "सामुदायिक विकास",
                    description: "महिला सशक्तिकरण और शिक्षा सहायता कार्यक्रम का विस्तार"
                  },
                  {
                    year: "2024",
                    title: "नया भवन निर्माण",
                    description: "35 लाख रुपए की लागत से आधुनिक पुस्तकालय भवन निर्माण कार्य प्रारंभ"
                  }
                ].map((milestone, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-bold">{milestone.year}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-800 mb-2">
                        {milestone.title}
                      </h4>
                      <p className="text-gray-600">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Organization Introduction */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                संस्था का परिचय
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                एरोग्या पुस्तकालय एवं सेवा संस्था एक सार्वजनिक चैरिटेबल ट्रस्ट है जो 2020 में 
                स्थापित हुई। यह संस्था राजस्थान के बाड़मेर जिले के गुडामलानी क्षेत्र में स्थित है 
                और समाज सेवा के विभिन्न क्षेत्रों में सक्रिय रूप से कार्य कर रही है।
              </p>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                हमारी संस्था का मुख्य उद्देश्य शिक्षा, स्वास्थ्य, पुस्तकालय सेवा और सामाजिक 
                कल्याण के माध्यम से समाज के सभी वर्गों की सेवा करना है। हम विशेष रूप से ग्रामीण 
                क्षेत्रों में रहने वाले लोगों की शिक्षा और स्वास्थ्य की आवश्यकताओं पर ध्यान देते हैं।
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{ACHIEVEMENTS.totalMembers}</div>
                  <div className="text-sm text-gray-600">सक्रिय सदस्य</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{ACHIEVEMENTS.booksInLibrary}</div>
                  <div className="text-sm text-gray-600">पुस्तकें</div>
                </div>
              </div>
            </div>
            <div>
              <Image
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
                alt="संस्था भवन"
                width={600}
                height={400}
                className="rounded-lg shadow-lg w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              हमारा विजन और मिशन
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-2xl text-green-600 flex items-center">
                  🎯 हमारा विजन
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {VISION_MISSION.vision}
                </p>
              </CardContent>
            </Card>

            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-2xl text-blue-600 flex items-center">
                  🚀 हमारे मिशन
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {VISION_MISSION.mission.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Objectives */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              हमारे उद्देश्य
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {VISION_MISSION.objectives.map((objective, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="text-3xl mb-4">📋</div>
                  <p className="text-gray-700 font-medium">{objective}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              हमारी टीम
            </h2>
            <p className="text-lg text-gray-600">
              समर्पित व्यक्तित्व जो समाज सेवा के लिए प्रतिबद्ध हैं
            </p>
          </div>

          {/* Founders */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-center mb-8 text-green-600">संस्थापक</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {TEAM_MEMBERS.founders.map((member, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <span className="text-2xl">👤</span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">{member.name}</h4>
                    <p className="text-green-600 font-medium mb-2">{member.position}</p>
                    <p className="text-sm text-gray-600">{member.phone}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Executives */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-center mb-8 text-blue-600">कार्यकारिणी</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {TEAM_MEMBERS.executives.map((member, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <span className="text-2xl">👤</span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">{member.name}</h4>
                    <p className="text-blue-600 font-medium mb-2">{member.position}</p>
                    <p className="text-sm text-gray-600">{member.phone}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Patrons */}
          <div>
            <h3 className="text-2xl font-bold text-center mb-8 text-purple-600">संरक्षक गण</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {TEAM_MEMBERS.patrons.map((member, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-3 flex items-center justify-center">
                      <span className="text-xl">🙏</span>
                    </div>
                    <h4 className="text-sm font-semibold text-gray-800 mb-1">{member.name}</h4>
                    <p className="text-purple-600 font-medium text-xs mb-1">{member.position}</p>
                    <p className="text-xs text-gray-600">{member.location}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              संपर्क जानकारी
            </h2>
          </div>

          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-green-600">पंजीकृत कार्यालय</h3>
                  <div className="space-y-3">
                    <p className="text-gray-600 leading-relaxed">
                      <strong>पता:</strong> {CONTACT_INFO.address}
                    </p>
                    <p className="text-gray-600">
                      <strong>फोन:</strong> {CONTACT_INFO.phone}
                    </p>
                    <p className="text-gray-600">
                      <strong>ईमेल:</strong> {CONTACT_INFO.email}
                    </p>
                    <p className="text-gray-600">
                      <strong>वेबसाइट:</strong> {CONTACT_INFO.website}
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-blue-600">कार्य समय</h3>
                  <p className="text-gray-600 mb-4">{CONTACT_INFO.timings}</p>
                  
                  <h3 className="text-xl font-semibold mb-4 text-purple-600">सोशल मीडिया</h3>
                  <p className="text-gray-600">
                    <strong>Facebook:</strong> {CONTACT_INFO.facebook}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}