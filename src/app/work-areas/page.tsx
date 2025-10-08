import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "कार्य क्षेत्र - एरोज्ञा पुस्तकालय एवं सेवा संस्था | हमारे कार्य और उपलब्धियां",
  description: "एरोज्ञा संस्था के कार्य क्षेत्र - शिक्षा जागरूकता, प्रतिभा सम्मान, रक्तदान, पर्यावरण संरक्षण। 50,000+ विद्यार्थी सम्मानित, 600+ विद्यालयों में संगोष्ठी, 400+ रक्तदाता।",
  keywords: [
    "एरोज्ञा कार्य क्षेत्र",
    "शिक्षा जागरूकता अभियान",
    "प्रतिभा सम्मान राजस्थान",
    "रक्तदान शिविर बाड़मेर",
    "पर्यावरण संरक्षण",
    "शैक्षिक यात्रा",
    "पुस्तकालय सेवा",
    "सामाजिक कार्य राजस्थान"
  ],
  openGraph: {
    title: "एरोज्ञा संस्था के कार्य क्षेत्र - शिक्षा, स्वास्थ्य, पर्यावरण",
    description: "6-7 वर्षों में 50,000+ विद्यार्थी सम्मानित, 600+ विद्यालयों में संगोष्ठी, 400+ रक्तदाता। देशभर में शिक्षा जागरूकता अभियान।",
    images: ['/og-work-areas.jpg'],
  },
}

export default function WorkAreasPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-6 shadow-lg">
              <span className="text-4xl">🎯</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
              हमारे कार्य क्षेत्र
            </h1>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
              पिछले 6-7 वर्षों के शिक्षा जागरूकता अभियान, मानवीय कार्य की निरन्तरता के साथ 
              एरोज्ञा संस्था 7 अगस्त 2020 को अस्तित्व में आया
            </p>
          </div>
        </div>
      </section>

      {/* Main Work Areas - Zigzag Pattern 1 */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Side - Content */}
              <div className="order-2 lg:order-1">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl border border-blue-200">
                  <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                    <span className="text-4xl mr-3">📚</span>
                    मुख्य कार्य क्षेत्र
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <p className="text-gray-700 leading-relaxed">
                        <span className="font-semibold text-blue-700">शिक्षा संगोष्ठी</span> - विद्यालयों में शैक्षिक जागरूकता कार्यक्रम
                      </p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <p className="text-gray-700 leading-relaxed">
                        <span className="font-semibold text-blue-700">असाध्य बीमारियाँ</span> - गंभीर रोगियों की सहायता
                      </p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <p className="text-gray-700 leading-relaxed">
                        <span className="font-semibold text-blue-700">प्राकृतिक-राष्ट्रीय आपदा</span> - आपदा राहत कार्य
                      </p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <p className="text-gray-700 leading-relaxed">
                        <span className="font-semibold text-blue-700">महामारी सहायता</span> - कोविड और अन्य महामारी में सेवा
                      </p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <p className="text-gray-700 leading-relaxed">
                        <span className="font-semibold text-blue-700">पर्यावरण संरक्षण</span> - वृक्षारोपण और पर्यावरण कार्य
                      </p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <p className="text-gray-700 leading-relaxed">
                        <span className="font-semibold text-blue-700">नशा-मुक्ति अभियान</span> - युवाओं को नशे से मुक्ति
                      </p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <p className="text-gray-700 leading-relaxed">
                        <span className="font-semibold text-blue-700">सामाजिक कुरीतियाँ निवारण</span> - <strong>मृत्युभोज, बालविवाह,</strong>  अंधविश्वास, पाखण्ड, अमानवीय कार्य, अत्याचार निवारण
                      </p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <p className="text-gray-700 leading-relaxed">
                        <span className="font-semibold text-blue-700">विद्यार्थी सहायता</span> - जरूरतमंद विद्यार्थियों व युवाओं को नि:शुल्क साहित्य, आर्थिक सहयोग के साथ प्रोत्साहित करना
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Stats */}
              <div className="order-1 lg:order-2">
                <div className="mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                  <p className="text-gray-700 leading-relaxed text-center">
                    <span className="font-semibold text-blue-700">"सामाजिक कुरीतियों छोड़ - शिक्षा से नाता जोड़ो अभियान"</span> के तहत हजारों विद्यार्थियों, युवाओं, महिलाओं व वरिष्ठजनों के साथ शपथ ग्रहण कर नशावृत्ति और सामाजिक कुरीतियों से मुक्त
                  </p>
                </div>
              </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-xl shadow-md text-center border-t-4 border-blue-500">
                    <div className="text-3xl font-bold text-blue-600 mb-2">2020</div>
                    <div className="text-sm text-gray-600 font-medium">स्थापना वर्ष</div>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-md text-center border-t-4 border-green-500">
                    <div className="text-3xl font-bold text-green-600 mb-2">6-7</div>
                    <div className="text-sm text-gray-600 font-medium">वर्षों का अनुभव</div>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-md text-center border-t-4 border-orange-500">
                    <div className="text-3xl font-bold text-orange-600 mb-2">8+</div>
                    <div className="text-sm text-gray-600 font-medium">कार्य क्षेत्र</div>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-md text-center border-t-4 border-purple-500">
                    <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
                    <div className="text-sm text-gray-600 font-medium">सेवा उपलब्ध</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Talent Recognition - Zigzag Pattern 2 */}
      <section className="py-16 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Side - Stats */}
              <div className="order-1">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-4 flex items-center justify-center">
                    <span className="text-4xl mr-3">🏆</span>
                    प्रतिभा सम्मान
                  </h2>
                  <div className="w-20 h-1 bg-green-500 mx-auto rounded-full"></div>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-lg">
                  <div className="text-center mb-6">
                    <div className="text-5xl font-bold text-green-600 mb-2">50,000+</div>
                    <div className="text-lg text-gray-700 font-semibold">प्रतिभावान विद्यार्थी सम्मानित</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="text-2xl font-bold text-green-700">15+</div>
                      <div className="text-sm text-gray-600">जिले</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="text-2xl font-bold text-green-700">600+</div>
                      <div className="text-sm text-gray-600">विद्यालय</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Districts List */}
              <div className="order-2">
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-green-200">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">कार्य क्षेत्र - जिले</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      'बाड़मेर', 'जैसलमेर', 'जालौर', 'सिरोही', 'उदयपुर', 'राजसमंद',
                      'पाली', 'जोधपुर', 'नागौर', 'बीकानेर', 'चूरू', 'प्रतापगढ़',
                      'कोटा', 'बांसवाड़ा', 'डूंगरपुर'
                    ].map((district, index) => (
                      <div key={index} className="bg-green-50 p-3 rounded-lg text-center border border-green-200">
                        <span className="text-sm font-medium text-green-800">{district}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Activities Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                गतिविधियाँ और उपलब्धियाँ
              </h2>
              <div className="w-24 h-1 bg-blue-500 mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Educational Activities */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-3">
                    📚
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">शिक्षा संगोष्ठी</h3>
                </div>
                <div className="space-y-3">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">600+</div>
                    <div className="text-sm text-gray-600">विद्यालयों में संगोष्ठी</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">8-9</div>
                    <div className="text-sm text-gray-600">वर्षों का कार्य</div>
                  </div>
                </div>
              </div>

              {/* Government Service Recognition */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-3">
                    🏛️
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">नवचयनित सम्मान</h3>
                </div>
                <div className="space-y-3">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">1,250</div>
                    <div className="text-sm text-gray-600">सरकारी कर्मचारी सम्मानित</div>
                  </div>
                  <div className="text-xs text-gray-600 text-center">
                    सरकारी / अर्ध सरकारी / विशेष सेवा
                  </div>
                </div>
              </div>

              {/* Sports Talent */}
              <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-xl border border-orange-200">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-3">
                    🏆
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">खेल प्रतिभा</h3>
                </div>
                <div className="space-y-3">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">400+</div>
                    <div className="text-sm text-gray-600">खेल प्रतिभा सम्मानित</div>
                  </div>
                  <div className="text-xs text-gray-600 text-center">
                    कबड्डी, फुटबॉल, वॉलीबॉल, क्रिकेट, हॉकी, टेनिस, कुश्ती
                  </div>
                </div>
              </div>

              {/* Music & Arts */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-3">
                    🎵
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">संगीत-गायक प्रतिभा</h3>
                </div>
                <div className="space-y-3">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">200+</div>
                    <div className="text-sm text-gray-600">कलाकार सम्मानित</div>
                  </div>
                  <div className="text-xs text-gray-600 text-center">
                    संगीत, गायक कलाकार, योगासन लेखक
                  </div>
                </div>
              </div>

              {/* Blood Donation */}
              <div className="bg-gradient-to-br from-red-50 to-rose-50 p-6 rounded-xl border border-red-200">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-3">
                    ❤️
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">रक्तदान</h3>
                </div>
                <div className="space-y-3">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-600">400+</div>
                    <div className="text-sm text-gray-600">रक्तदाता</div>
                  </div>
                  <div className="text-xs text-gray-600 text-center">
                    आपातकालीन, जन्मदिन, शादी सालगिरह
                  </div>
                </div>
              </div>

              {/* Environment */}
              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 p-6 rounded-xl border border-teal-200">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-3">
                    🌱
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">पर्यावरण संरक्षण</h3>
                </div>
                <div className="space-y-3">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-teal-600">हजारों</div>
                    <div className="text-sm text-gray-600">पौधे लगाए</div>
                  </div>
                  <div className="text-xs text-gray-600 text-center">
                    शादी, जन्मदिन, शुभ अवसरों पर वृक्षारोपण
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Library Services - Zigzag Pattern 3 */}
      <section className="py-16 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Side - Content */}
              <div className="order-2 lg:order-1">
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-indigo-200">
                  <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                    <span className="text-4xl mr-3">📖</span>
                    पुस्तकालय सेवाएं
                  </h2>
                  <div className="space-y-6">
                    <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                      <h3 className="font-bold text-indigo-800 mb-2">रा.उ.मा.वि. मेघवालों का तला (मांगता)</h3>
                      <div className="space-y-2 text-sm text-gray-700">
                        <p><span className="font-semibold">स्थापना:</span> 26 जनवरी 2021</p>
                        <p><span className="font-semibold">साहित्य:</span> ₹20,000 का साहित्य</p>
                        <p><span className="font-semibold">सुविधा:</span> अलमारी सहित पूर्ण व्यवस्था</p>
                      </div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                      <h3 className="font-bold text-purple-800 mb-2">भीमाबाई पुस्तकालय धोरीमना</h3>
                      <div className="space-y-2 text-sm text-gray-700">
                        <p><span className="font-semibold">उद्देश्य:</span> जरूरतमंद युवाओं के लिए प्रतियोगी परीक्षा तैयारी</p>
                        <p><span className="font-semibold">साहित्य:</span> ₹21,000 का साहित्य</p>
                        <p><span className="font-semibold">फर्नीचर:</span> ₹25,000 का आर्थिक सहयोग</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Stats */}
              <div className="order-1 lg:order-2">
                <div className="grid grid-cols-1 gap-6">
                  <div className="bg-white p-6 rounded-xl shadow-md text-center border-t-4 border-indigo-500">
                    <div className="text-4xl font-bold text-indigo-600 mb-2">₹46,000</div>
                    <div className="text-sm text-gray-600 font-medium">कुल निवेश</div>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-md text-center border-t-4 border-purple-500">
                    <div className="text-4xl font-bold text-purple-600 mb-2">2</div>
                    <div className="text-sm text-gray-600 font-medium">पुस्तकालय स्थापित</div>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-md text-center border-t-4 border-pink-500">
                    <div className="text-4xl font-bold text-pink-600 mb-2">100%</div>
                    <div className="text-sm text-gray-600 font-medium">निःशुल्क सेवा</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Educational Tours */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center">
                <span className="text-4xl mr-3">🚌</span>
                जागरूकता शैक्षिक यात्रा
              </h2>
              <div className="w-24 h-1 bg-orange-500 mx-auto rounded-full"></div>
              <p className="text-lg text-gray-600 mt-4 max-w-3xl mx-auto">
                एरोज़ा टीम द्वारा 2020 से देशभर में शिक्षा जागरूकता के तहत व्यापक यात्राएं
              </p>
            </div>

            {/* Major Tours */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4">उत्तर भारत यात्रा</h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <p><span className="font-semibold">स्थान:</span> नई दिल्ली, नोयडा, हरिद्वार, ऋषिकेश</p>
                  <p><span className="font-semibold">उद्देश्य:</span> शिक्षा जागरूकता और प्रतिभा सम्मान</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4">पश्चिम भारत यात्रा</h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <p><span className="font-semibold">स्थान:</span> अहमदाबाद, सूरत, राजकोट, जामनगर, डीसा, पालनपुर, मेहसाणा, भुज, गांधीधाम, माडवी, वापी</p>
                  <p><span className="font-semibold">अवधि:</span> 15 दिवसीय मुंबई यात्रा (फरवरी 2023)</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-xl border border-orange-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4">दक्षिण भारत यात्रा</h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <p><span className="font-semibold">स्थान:</span> चैनई, मदुराई, रामेश्वर, कन्याकुमारी, बैंगलौर, हुबली, हैदराबाद</p>
                  <p><span className="font-semibold">अवधि:</span> 10 जनवरी से 30 जनवरी 2024 (20 दिन)</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4">मध्य भारत यात्रा</h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <p><span className="font-semibold">स्थान:</span> मुंबई, नासिक, पुणे, नीमच, इन्दौर, भोपाल</p>
                  <p><span className="font-semibold">उद्देश्य:</span> शैक्षिक संस्थानों का भ्रमण</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 p-6 rounded-xl border border-teal-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4">राजस्थान यात्रा</h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <p><span className="font-semibold">अवधि:</span> 26 अगस्त से 4 सितंबर 2021 (8 दिन)</p>
                  <p><span className="font-semibold">दूरी:</span> 3000 किलोमीटर</p>
                  <p><span className="font-semibold">जिले:</span> जालोर, पाली, सिरोही, उदयपुर, राजसमंद</p>
                  <p><span className="font-semibold">लाभार्थी:</span> 5000 लोग और युवा</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-6 rounded-xl border border-yellow-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4">स्थानीय यात्राएं</h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <p><span className="font-semibold">व्यय:</span> स्वयं के व्यय से</p>
                  <p><span className="font-semibold">उद्देश्य:</span> ऐतिहासिक स्थल, शैक्षिक एवं तकनीकी संस्थानों का भ्रमण</p>
                  <p><span className="font-semibold">स्थिति:</span> निरंतर जारी</p>
                </div>
              </div>
            </div>

            {/* Local Areas Covered */}
            <div className="bg-gradient-to-br from-slate-50 to-gray-100 p-8 rounded-2xl border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">स्थानीय कार्य क्षेत्र</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {[
                  'बागोड़ा', 'जुंझाणी', 'भीनमाल', 'जालोर', 'सायला', 'जीवाणा', 'सिणधरी', 'बालोतरा',
                  'सणपा', 'डंडाली', 'करणा', 'रावतसर', 'बायतू', 'कवास', 'महाबार', 'रानीगांव',
                  'भुणिया', 'धनाऊ', 'चौहटन', 'तारातरा', 'सेडवा', 'रणासर कला', 'केकड़', 'बामरला',
                  'ओगला', 'लालजी डुंगरी', 'साता', 'फागलिया', 'वेडिया', 'गंगासरा', 'बाखासर', 'भलगांव',
                  'हथला', 'भीयाड़', 'पाटोदी', 'सिवाना', 'समदड़ी', 'मोकलसर', 'कल्याणपुर', 'गिड्डा',
                  'गडरा रोड', 'रामसर', 'मिट्ठाड़ू', 'जसाई', 'लोहारवा', 'भेडाना', 'मोरिसम', 'सांचौर'
                ].map((place, index) => (
                  <div key={index} className="bg-white p-2 rounded text-center border border-gray-300">
                    <span className="text-xs font-medium text-gray-700">{place}</span>
                  </div>
                ))}
              </div>
              <div className="text-center mt-6">
                <p className="text-gray-600 italic">
                  हजारों किमी यात्रा में पूरी टीम का विशेष सहयोग रहा
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Women Awareness Programs - Zigzag Pattern 4 */}
      <section className="py-16 bg-gradient-to-br from-pink-50 to-rose-50">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Side - Stats */}
              <div className="order-1">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-4 flex items-center justify-center">
                    <span className="text-4xl mr-3">👩‍🎓</span>
                    महिला जागरूकता संगोष्ठियाँ
                  </h2>
                  <div className="w-20 h-1 bg-pink-500 mx-auto rounded-full"></div>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-lg">
                  <div className="text-center mb-6">
                    <div className="text-5xl font-bold text-pink-600 mb-2">3,000</div>
                    <div className="text-lg text-gray-700 font-semibold">महिलाएं जागरूक और सम्मानित</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-pink-50 rounded-lg border border-pink-200">
                      <div className="text-2xl font-bold text-pink-700">गांव-गांव</div>
                      <div className="text-sm text-gray-600">पहुंच</div>
                    </div>
                    <div className="text-center p-4 bg-pink-50 rounded-lg border border-pink-200">
                      <div className="text-2xl font-bold text-pink-700">3 विषय</div>
                      <div className="text-sm text-gray-600">जागरूकता</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Content */}
              <div className="order-2">
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-pink-200">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">कार्य क्षेत्र और विषय</h3>
                  <div className="space-y-4">
                    <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
                      <h4 className="font-bold text-pink-800 mb-2">कार्य क्षेत्र:</h4>
                      <p className="text-sm text-gray-700">बाड़मेर, जालोर सहित प्रदेश में आंगनवाड़ी केन्द्र, नन्दघर</p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <p className="text-gray-700 leading-relaxed">
                          <span className="font-semibold text-pink-700">शिक्षा जागरूकता</span> - महिलाओं के लिए शैक्षिक अवसर
                        </p>
                      </div>
                      <div className="flex items-start">
                        <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <p className="text-gray-700 leading-relaxed">
                          <span className="font-semibold text-pink-700">स्वास्थ्य जागरूकता</span> - महिला स्वास्थ्य और पोषण
                        </p>
                      </div>
                      <div className="flex items-start">
                        <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <p className="text-gray-700 leading-relaxed">
                          <span className="font-semibold text-pink-700">पर्यावरण संरक्षण</span> - पर्यावरण के प्रति जागरूकता
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Free Literature Distribution */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center">
                <span className="text-4xl mr-3">📚</span>
                निःशुल्क साहित्य वितरण
              </h2>
              <div className="w-24 h-1 bg-green-500 mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              {/* Main Achievement */}
              <div className="lg:col-span-2 bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl border border-green-200">
                <div className="text-center mb-6">
                  <div className="text-5xl font-bold text-green-600 mb-2">₹3 लाख+</div>
                  <div className="text-lg text-gray-700 font-semibold">निःशुल्क साहित्य वितरित</div>
                </div>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg border border-green-200">
                    <h4 className="font-bold text-green-800 mb-2">कार्य क्षेत्र:</h4>
                    <p className="text-sm text-gray-700">बाड़मेर, जालोर, सिरोही, जोधपुर, नागौर, पाली, जैसलमेर जिलों में</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-green-200">
                    <h4 className="font-bold text-green-800 mb-2">लाभार्थी:</h4>
                    <p className="text-sm text-gray-700">गरीब जरूरतमंद प्रतिभाशाली विद्यार्थी</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-green-200">
                    <h4 className="font-bold text-green-800 mb-2">परिणाम:</h4>
                    <p className="text-sm text-gray-700">10 प्रतिभावान जरूरतमंद विद्यार्थियों का सरकारी सेवा चयन</p>
                  </div>
                </div>
              </div>

              {/* Library Contribution */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-3">
                    📖
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">पुस्तकालय योगदान</h3>
                </div>
                <div className="space-y-3">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">₹1 लाख+</div>
                    <div className="text-sm text-gray-600">साहित्य मूल्य</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">30+</div>
                    <div className="text-sm text-gray-600">भागमाशाह योगदान</div>
                  </div>
                  <div className="text-xs text-gray-600 text-center">
                    प्रतियोगी व अन्य परीक्षाओं का साहित्य
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Awareness Campaigns - Zigzag Pattern 5 */}
      <section className="py-16 bg-gradient-to-br from-yellow-50 to-amber-50">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Side - Content */}
              <div className="order-2 lg:order-1">
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-yellow-200">
                  <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                    <span className="text-4xl mr-3">🇮🇳</span>
                    पढ़ेगा इंडिया तो बढ़ेगा इंडिया
                  </h2>
                  <div className="space-y-6">
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                      <h3 className="font-bold text-yellow-800 mb-2">अभियान उद्देश्य:</h3>
                      <p className="text-sm text-gray-700">शिक्षा दान के प्रति जागरूकता फैलाना</p>
                    </div>
                    <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                      <h3 className="font-bold text-amber-800 mb-2">कार्य क्षेत्र:</h3>
                      <p className="text-sm text-gray-700">बाड़मेर, धोरीमन्ना, गुढ़ामालानी क्षेत्र</p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                      <h3 className="font-bold text-orange-800 mb-2">कार्यान्वयन:</h3>
                      <p className="text-sm text-gray-700">20 सहयोग पात्र शिक्षण संस्थानों व प्रतिष्ठानों पर लगाए गए</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Stats */}
              <div className="order-1 lg:order-2">
                <div className="grid grid-cols-1 gap-6">
                  <div className="bg-white p-6 rounded-xl shadow-md text-center border-t-4 border-yellow-500">
                    <div className="text-4xl font-bold text-yellow-600 mb-2">20</div>
                    <div className="text-sm text-gray-600 font-medium">सहयोग पात्र स्थापित</div>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-md text-center border-t-4 border-amber-500">
                    <div className="text-4xl font-bold text-amber-600 mb-2">3</div>
                    <div className="text-sm text-gray-600 font-medium">मुख्य क्षेत्र</div>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-md text-center border-t-4 border-orange-500">
                    <div className="text-4xl font-bold text-orange-600 mb-2">100%</div>
                    <div className="text-sm text-gray-600 font-medium">शिक्षा जागरूकता</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sign Boards & Infrastructure */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center">
                <span className="text-4xl mr-3">🪧</span>
                साइन बोर्ड और भूमि दान
              </h2>
              <div className="w-24 h-1 bg-indigo-500 mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {/* Sign Boards */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-2xl border border-indigo-200">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-3">
                    🪧
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">साइन बोर्ड स्थापना</h3>
                </div>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-indigo-600 mb-2">15</div>
                    <div className="text-sm text-gray-600 font-medium">साइन बोर्ड स्थापित</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-indigo-200">
                    <h4 className="font-bold text-indigo-800 mb-2">स्थान:</h4>
                    <div className="text-xs text-gray-700 space-y-1">
                      <p>धोरीमन्ना, मांगरता, सिल्लगन, लोहारवा</p>
                      <p>गुढ़ामालानी, नगर, धांधलावास, सिणधरी</p>
                      <p>मेगा हाईवे व नेशनल हाईवे पर मुख्य स्थान</p>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-indigo-200">
                    <h4 className="font-bold text-indigo-800 mb-2">उद्देश्य:</h4>
                    <p className="text-xs text-gray-700">जन-जन तक शिक्षा जागरूकता का संदेश पहुंचाना</p>
                  </div>
                </div>
              </div>

              {/* Land Donation */}
              <div className="bg-gradient-to-br from-green-50 to-teal-50 p-8 rounded-2xl border border-green-200">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-3">
                    🏞️
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">भूमिदान</h3>
                </div>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600 mb-2">₹5 लाख</div>
                    <div className="text-sm text-gray-600 font-medium">भूमि मूल्य</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-green-200">
                    <h4 className="font-bold text-green-800 mb-2">दानकर्ता:</h4>
                    <p className="text-sm text-gray-700">सोलंकी निम्बाराम माली पुत्र भोमाराम जी माली</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-green-200">
                    <h4 className="font-bold text-green-800 mb-2">स्थान:</h4>
                    <p className="text-sm text-gray-700">नगर ग्राम पंचायत, आरजीटी सर्किल, मुख्य सड़क</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-green-200">
                    <h4 className="font-bold text-green-800 mb-2">पंजीकरण:</h4>
                    <p className="text-xs text-gray-700">खसरा नं. 686/600, सितंबर 2021</p>
                    <p className="text-xs text-gray-700">रूपांतरण: 19 फरवरी 2022 (शैक्षणिक प्रयोजनार्थ)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bhamashah & Body Donation - Zigzag Pattern 6 */}
      <section className="py-16 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Side - Bhamashah */}
              <div className="order-1">
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-purple-200">
                  <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                    <span className="text-4xl mr-3">🤝</span>
                    भामाशाह सहयोग
                  </h2>
                  <div className="text-center mb-6">
                    <div className="text-5xl font-bold text-purple-600 mb-2">₹30 लाख+</div>
                    <div className="text-lg text-gray-700 font-semibold">कुल सहयोग राशि</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="text-2xl font-bold text-purple-700">2000+</div>
                      <div className="text-sm text-gray-600">भामाशाह</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="text-2xl font-bold text-purple-700">4 वर्ष</div>
                      <div className="text-sm text-gray-600">सहयोग काल</div>
                    </div>
                  </div>
                  <div className="mt-4 bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <p className="text-sm text-gray-700 text-center">
                      <span className="font-semibold text-purple-800">तन-मन-धन</span> से निरंतर सहयोग
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Side - Body Donation */}
              <div className="order-2">
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-pink-200">
                  <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                    <span className="text-4xl mr-3">🏥</span>
                    मानव शरीर दानदाता
                  </h2>
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {[
                      'स्व. अमरराम बोस धांधलावास',
                      'नरेन्द्र कुमार भारतीय सीलरवा',
                      'शांति देवी धांधलावास',
                      'रावत बौद्ध माधाराम बायटु',
                      'जितेन्द्र कुमार जीत मोकलसर',
                      'अग्रेन्द्र कुमार नांद',
                      'जगदीश हिंगड़',
                      'चन्द्रशेखर भाटीया राज. पुलिस',
                      'गणपत पातालिया अध्यापक',
                      'शारदा हिंगड़ ए.एन.एम. बालोतरा',
                      'शारदा पातालिया',
                      'राणासर कल्ला कनक परिवार',
                      'मोहनलाल नामा लोहारवा',
                      'नरेंद्र कुमार बोस धोरीमन्ना',
                      'अपर्णा देवी बोस धांधलावास',
                      'लीला देवी बोस धांधलावास'
                    ].map((donor, index) => (
                      <div key={index} className="bg-pink-50 p-3 rounded-lg border border-pink-200">
                        <p className="text-sm font-medium text-gray-800">{donor}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-center">
                    <div className="text-2xl font-bold text-pink-600">16</div>
                    <div className="text-sm text-gray-600">देहदान की घोषणा</div>
                    <p className="text-xs text-gray-600 mt-2">मेडिकल क्षेत्र में योगदान</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Building Foundation & Social Reform */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Building Foundation */}
              <div className="bg-gradient-to-br from-orange-50 to-red-50 p-8 rounded-2xl border border-orange-200">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-3">
                    🏗️
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">भवन शिलान्यास</h3>
                </div>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg border border-orange-200">
                    <h4 className="font-bold text-orange-800 mb-2">तिथि:</h4>
                    <p className="text-sm text-gray-700">7 अगस्त 2022 / द्वितीय वार्षिकोत्सव</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-orange-200">
                    <h4 className="font-bold text-orange-800 mb-2">मुख्य अतिथि:</h4>
                    <div className="text-xs text-gray-700 space-y-1">
                      <p>महंत नेमनाथजी महाराज प्रागमठ सिणधरी</p>
                      <p>महंत रामभारती जी महाराज पायंला मठ सिणधरी</p>
                      <p>भन्ते डॉ. सिद्धार्थ वर्धन "गौरव"</p>
                      <p>डॉ. भागीरथ कुलदीप एसीबीईओ सेऊवा</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">₹65 लाख+</div>
                    <div className="text-sm text-gray-600">निर्माण कार्य (जून 2026 तक)</div>
                  </div>
                </div>
              </div>

              {/* Social Reform */}
              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 p-8 rounded-2xl border border-teal-200">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-3">
                    ⚖️
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">समाज उत्थान</h3>
                </div>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg border border-teal-200">
                    <h4 className="font-bold text-teal-800 mb-2">अभियान:</h4>
                    <p className="text-sm text-gray-700">"सामाजिक कुरीतियों को छोड़ शिक्षा से नाता जोड़ो अभियान"</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-teal-200">
                    <h4 className="font-bold text-teal-800 mb-2">कार्य क्षेत्र:</h4>
                    <p className="text-sm text-gray-700">बाड़मेर, जैसलमेर, जालोर, जोधपुर जिले सहित प्रदेश में</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-teal-200">
                    <h4 className="font-bold text-teal-800 mb-2">मुद्दे:</h4>
                    <div className="text-xs text-gray-700 space-y-1">
                      <p>• मृत्युभोज की कुप्रथा</p>
                      <p>• बाल विवाह रोकथाम</p>
                      <p>• दहेज प्रथा उन्मूलन</p>
                      <p>• नशा वृत्ति निवारण</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-teal-600">हजारों</div>
                    <div className="text-sm text-gray-600">लोगों को शपथ दिलाई</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              हमारे साथ जुड़ें
            </h2>
            <p className="text-xl mb-8 opacity-90">
              शिक्षा जागरूकता और सामाजिक सेवा के इस महान कार्य में आपका योगदान अमूल्य है
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/apply"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300"
              >
                सदस्य बनें
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