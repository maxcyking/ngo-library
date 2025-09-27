import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "हमारे बारे में - एरोग्या पुस्तकालय एवं सेवा संस्था का इतिहास और उद्देश्य",
  description: "एरोग्या पुस्तकालय एवं सेवा संस्था का इतिहास, उद्देश्य, और सेवाएं। 2020 से बाड़मेर राजस्थान में शिक्षा, स्वास्थ्य, और सामाजिक सेवा के क्षेत्र में कार्यरत चैरिटेबल ट्रस्ट।",
  keywords: [
    "एरोग्या पुस्तकालय इतिहास",
    "NGO बाड़मेर राजस्थान",
    "चैरिटेबल ट्रस्ट",
    "सामाजिक सेवा संस्था",
    "पुस्तकालय सेवा",
    "रक्तदान संस्था",
    "स्वास्थ्य सेवा NGO"
  ],
  openGraph: {
    title: "हमारे बारे में - एरोग्या पुस्तकालय एवं सेवा संस्था",
    description: "2020 से बाड़मेर राजस्थान में शिक्षा, स्वास्थ्य, और सामाजिक सेवा के क्षेत्र में कार्यरत चैरिटेबल ट्रस्ट।",
    images: ['/og-about.jpg'],
  },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50" itemScope itemType="https://schema.org/AboutPage">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6" itemProp="name">
              एरोग्या पुस्तकालय एवं सेवा संस्था
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90" itemProp="description">
              2020 से समाज सेवा के क्षेत्र में निरंतर कार्यरत - शिक्षा, स्वास्थ्य और सामाजिक कल्याण के लिए समर्पित
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-lg">
              <span className="bg-white bg-opacity-20 px-4 py-2 rounded-full">📚 2000+ पुस्तकें</span>
              <span className="bg-white bg-opacity-20 px-4 py-2 rounded-full">❤️ 150+ रक्तदाता</span>
              <span className="bg-white bg-opacity-20 px-4 py-2 rounded-full">🏥 निःशुल्क स्वास्थ्य सेवा</span>
              <span className="bg-white bg-opacity-20 px-4 py-2 rounded-full">🌱 पर्यावरण संरक्षण</span>
            </div>
          </div>
        </div>
      </section>

      {/* Organization Details */}
      <section className="py-16 bg-white" itemScope itemType="https://schema.org/NGO">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">संस्था का विस्तृत परिचय</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
              <div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">🎯 हमारा उद्देश्य</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    निःशुल्क पुस्तकालय सेवा प्रदान करना
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    रक्तदान और देहदान के लिए जागरूकता फैलाना
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    निःशुल्क स्वास्थ्य जांच और चिकित्सा सेवा
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    शिक्षा के क्षेत्र में योगदान देना
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    पर्यावरण संरक्षण और वृक्षारोपण
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    महिला सशक्तिकरण कार्यक्रम
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">📊 हमारी उपलब्धियां</h3>
                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">2000+</div>
                    <div className="text-gray-700">पुस्तकों का संग्रह</div>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">150+</div>
                    <div className="text-gray-700">सक्रिय रक्तदाता</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">500+</div>
                    <div className="text-gray-700">स्वास्थ्य जांच लाभार्थी</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">35 लाख</div>
                    <div className="text-gray-700">नया भवन निर्माण बजट</div>
                  </div>
                </div>
              </div>
            </div>

            {/* History Timeline */}
            <div className="mb-12">
              <h3 className="text-2xl font-semibold text-gray-800 mb-8 text-center">📅 हमारा सफर</h3>
              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="bg-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold mr-4 flex-shrink-0">
                    2020
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">संस्था की स्थापना</h4>
                    <p className="text-gray-600">एरोग्या पुस्तकालय एवं सेवा संस्था की स्थापना बाड़मेर राजस्थान में हुई</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold mr-4 flex-shrink-0">
                    2021
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">पुस्तकालय सेवा शुरुआत</h4>
                    <p className="text-gray-600">1000+ पुस्तकों के साथ निःशुल्क पुस्तकालय सेवा की शुरुआत</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-red-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold mr-4 flex-shrink-0">
                    2022
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">रक्तदान शिविर और स्वास्थ्य सेवा</h4>
                    <p className="text-gray-600">नियमित रक्तदान शिविर और निःशुल्क स्वास्थ्य जांच कार्यक्रम शुरू</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-purple-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold mr-4 flex-shrink-0">
                    2023
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">विस्तार और नया भवन</h4>
                    <p className="text-gray-600">पुस्तक संग्रह 2000+ तक पहुंचा, नया भवन निर्माण कार्य शुरू</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-green-700 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold mr-4 flex-shrink-0">
                    2024
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">डिजिटल सेवाएं</h4>
                    <p className="text-gray-600">ऑनलाइन पुस्तक सेवा और डिजिटल प्लेटफॉर्म का विकास</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-gray-50 p-8 rounded-lg" itemScope itemType="https://schema.org/ContactPoint">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">📞 संपर्क जानकारी</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">पता:</h4>
                  <p className="text-gray-600" itemProp="address">
                    एरोग्या पुस्तकालय एवं सेवा संस्था<br />
                    बाड़मेर, राजस्थान, भारत
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">सेवा समय:</h4>
                  <p className="text-gray-600">
                    सोमवार - शनिवार: 9:00 AM - 6:00 PM<br />
                    रविवार: बंद
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">🤝 हमारे साथ जुड़ें</h2>
            <p className="text-xl mb-8 opacity-90">
              समाज सेवा के इस महान कार्य में आपका योगदान अमूल्य है। आज ही हमारे साथ जुड़ें और बदलाव का हिस्सा बनें।
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/apply"
                className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300"
              >
                सदस्यता के लिए आवेदन करें
              </a>
              <a
                href="/contact"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors duration-300"
              >
                संपर्क करें
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}