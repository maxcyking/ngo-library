import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "निःशुल्क पुस्तकालय सेवा - 2000+ पुस्तकों का संग्रह | एरोग्या पुस्तकालय बाड़मेर",
  description: "एरोग्या पुस्तकालय में 2000+ धार्मिक, शैक्षणिक, साहित्यिक और तकनीकी पुस्तकों का निःशुल्क संग्रह। बाड़मेर राजस्थान में सभी आयु वर्ग के लिए उपलब्ध। नया आधुनिक भवन निर्माणाधीन।",
  keywords: [
    "निःशुल्क पुस्तकालय बाड़मेर",
    "राजस्थान पुस्तकालय",
    "धार्मिक पुस्तकें",
    "शैक्षणिक पुस्तकें",
    "साहित्यिक पुस्तकें",
    "तकनीकी पुस्तकें",
    "Free Library Barmer",
    "Rajasthan Library",
    "एरोग्या लाइब्रेरी",
    "पुस्तक सेवा"
  ],
  openGraph: {
    title: "निःशुल्क पुस्तकालय सेवा - एरोग्या पुस्तकालय बाड़मेर",
    description: "2000+ धार्मिक, शैक्षणिक, साहित्यिक और तकनीकी पुस्तकों का निःशुल्क संग्रह। सभी आयु वर्ग के लिए उपलब्ध।",
    images: ['/og-library.jpg'],
  },
}

export default function LibraryPage() {
  return (
    <div className="min-h-screen bg-gray-50" itemScope itemType="https://schema.org/Library">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6" itemProp="name">
              📚 एरोग्या पुस्तकालय
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90" itemProp="description">
              2000+ पुस्तकों का निःशुल्क संग्रह - धार्मिक, शैक्षणिक, साहित्यिक और तकनीकी विषयों की पुस्तकें
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-lg">
              <span className="bg-white bg-opacity-20 px-4 py-2 rounded-full">📖 धार्मिक ग्रंथ</span>
              <span className="bg-white bg-opacity-20 px-4 py-2 rounded-full">🎓 शैक्षणिक पुस्तकें</span>
              <span className="bg-white bg-opacity-20 px-4 py-2 rounded-full">✍️ साहित्यिक कृतियां</span>
              <span className="bg-white bg-opacity-20 px-4 py-2 rounded-full">💻 तकनीकी पुस्तकें</span>
            </div>
          </div>
        </div>
      </section>

      {/* Library Services */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">🏛️ पुस्तकालय सेवाएं</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              <div className="bg-blue-50 p-6 rounded-lg text-center">
                <div className="text-4xl mb-4">📚</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">निःशुल्क सदस्यता</h3>
                <p className="text-gray-600">
                  सभी आयु वर्ग के लिए पूर्णतः निःशुल्क पुस्तकालय सदस्यता और सेवाएं
                </p>
              </div>
              
              <div className="bg-green-50 p-6 rounded-lg text-center">
                <div className="text-4xl mb-4">🏠</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">घर तक पुस्तक सेवा</h3>
                <p className="text-gray-600">
                  वरिष्ठ नागरिकों और दिव्यांगजनों के लिए घर तक पुस्तक पहुंचाने की सेवा
                </p>
              </div>
              
              <div className="bg-purple-50 p-6 rounded-lg text-center">
                <div className="text-4xl mb-4">💻</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">डिजिटल सेवा</h3>
                <p className="text-gray-600">
                  ऑनलाइन पुस्तक खोज, आरक्षण और नवीनीकरण की सुविधा
                </p>
              </div>
              
              <div className="bg-yellow-50 p-6 rounded-lg text-center">
                <div className="text-4xl mb-4">👥</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">अध्ययन कक्ष</h3>
                <p className="text-gray-600">
                  शांत वातावरण में अध्ययन के लिए विशेष कक्ष और बैठक व्यवस्था
                </p>
              </div>
              
              <div className="bg-red-50 p-6 rounded-lg text-center">
                <div className="text-4xl mb-4">📰</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">समाचार पत्र सेवा</h3>
                <p className="text-gray-600">
                  दैनिक समाचार पत्र, पत्रिकाएं और जर्नल्स की नियमित उपलब्धता
                </p>
              </div>
              
              <div className="bg-indigo-50 p-6 rounded-lg text-center">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">प्रतियोगी परीक्षा सामग्री</h3>
                <p className="text-gray-600">
                  UPSC, RAS, SSC और अन्य प्रतियोगी परीक्षाओं की तैयारी सामग्री
                </p>
              </div>
            </div>

            {/* Book Categories */}
            <div className="mb-12">
              <h3 className="text-2xl font-semibold text-gray-800 mb-8 text-center">📖 पुस्तक श्रेणियां</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="border-l-4 border-orange-500 pl-4">
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">🕉️ धार्मिक ग्रंथ (500+ पुस्तकें)</h4>
                    <ul className="text-gray-600 space-y-1">
                      <li>• गीता, रामायण, महाभारत</li>
                      <li>• पुराण और उपनिषद</li>
                      <li>• संत साहित्य और भजन संग्रह</li>
                      <li>• धार्मिक कथाएं और जीवनी</li>
                    </ul>
                  </div>
                  
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">🎓 शैक्षणिक पुस्तकें (600+ पुस्तकें)</h4>
                    <ul className="text-gray-600 space-y-1">
                      <li>• कक्षा 1-12 की पाठ्यपुस्तकें</li>
                      <li>• प्रतियोगी परीक्षा की तैयारी</li>
                      <li>• व्याकरण और भाषा विज्ञान</li>
                      <li>• गणित और विज्ञान</li>
                    </ul>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="border-l-4 border-green-500 pl-4">
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">✍️ साहित्यिक कृतियां (500+ पुस्तकें)</h4>
                    <ul className="text-gray-600 space-y-1">
                      <li>• हिंदी और राजस्थानी साहित्य</li>
                      <li>• कविता संग्रह और गजल</li>
                      <li>• उपन्यास और कहानी संग्रह</li>
                      <li>• जीवनी और आत्मकथा</li>
                    </ul>
                  </div>
                  
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">💻 तकनीकी पुस्तकें (400+ पुस्तकें)</h4>
                    <ul className="text-gray-600 space-y-1">
                      <li>• कंप्यूटर और इंटरनेट</li>
                      <li>• इंजीनियरिंग और तकनीक</li>
                      <li>• चिकित्सा और स्वास्थ्य</li>
                      <li>• कृषि और पशुपालन</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Library Timings */}
            <div className="bg-gray-50 p-8 rounded-lg mb-12" itemScope itemType="https://schema.org/OpeningHoursSpecification">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">🕒 पुस्तकालय समय</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-4">सामान्य दिन:</h4>
                  <div className="space-y-2 text-gray-600">
                    <div className="flex justify-between">
                      <span>सोमवार - शुक्रवार:</span>
                      <span className="font-medium" itemProp="opens">9:00 AM - 7:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>शनिवार:</span>
                      <span className="font-medium">9:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>रविवार:</span>
                      <span className="font-medium text-red-600">बंद</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-800 mb-4">विशेष सुविधाएं:</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center">
                      <span className="text-green-600 mr-2">✓</span>
                      परीक्षा के दिनों में विस्तारित समय
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-600 mr-2">✓</span>
                      त्योहारों में विशेष व्यवस्था
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-600 mr-2">✓</span>
                      आपातकाल में 24/7 संपर्क सुविधा
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* New Building Construction */}
            <div className="bg-gradient-to-r from-green-100 to-blue-100 p-8 rounded-lg">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">🏗️ नया पुस्तकालय भवन</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">आधुनिक सुविधाओं के साथ:</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center">
                      <span className="text-green-600 mr-2">🏢</span>
                      3 मंजिला आधुनिक भवन
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-600 mr-2">❄️</span>
                      वातानुकूलित अध्ययन कक्ष
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-600 mr-2">💻</span>
                      डिजिटल लाइब्रेरी सेक्शन
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-600 mr-2">🚗</span>
                      पार्किंग की व्यवस्था
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-600 mr-2">♿</span>
                      दिव्यांगजन अनुकूल सुविधाएं
                    </li>
                  </ul>
                </div>
                
                <div className="text-center">
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="text-3xl font-bold text-green-600 mb-2">35 लाख रुपए</div>
                    <div className="text-gray-700 mb-4">कुल निर्माण लागत</div>
                    <div className="text-lg font-semibold text-blue-600">जून 2024 तक पूर्ण होने की संभावना</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">📚 आज ही सदस्य बनें</h2>
            <p className="text-xl mb-8 opacity-90">
              निःशुल्क पुस्तकालय सदस्यता प्राप्त करें और ज्ञान की दुनिया में कदम रखें
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/apply"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300"
              >
                सदस्यता के लिए आवेदन करें
              </a>
              <a
                href="/books"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-300"
              >
                पुस्तक सूची देखें
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}