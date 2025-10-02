import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "हमारे बारे में - एरोज्ञा पुस्तकालय एवं सेवा संस्था | मानवता का मिशन",
  description: "राजस्थान के मरुस्थल में स्थापित एरोज्ञा पुस्तकालय - मानवता की शिक्षा का तीर। 2020 से 3000+ सदस्यों के साथ शिक्षा, स्वास्थ्य और सामाजिक सेवा में कार्यरत। 2 करोड़ का प्रोजेक्ट निर्माणाधीन।",
  keywords: [
    "एरोज्ञा पुस्तकालय बाड़मेर",
    "गुडामालानी NGO राजस्थान",
    "देहदान अमराराम बोस",
    "कालुराम माली एरोज्ञा",
    "मानवता मिशन राजस्थान",
    "ग्रामीण शिक्षा संस्थान",
    "रक्तदान बाड़मेर",
    "निःशुल्क पुस्तकालय गुडामालानी",
    "देहदान जागरूकता राजस्थान"
  ],
  openGraph: {
    title: "एरोज्ञा पुस्तकालय - मानवता की शिक्षा का तीर",
    description: "राजस्थान के मरुस्थल में मानवता के लिए समर्पित संस्थान। 3 लाख+ निःशुल्क साहित्य, 700+ विद्यालयों में संगोष्ठी, 200+ रक्तदाता।",
    images: ['/og-about.jpg'],
  },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-600 via-red-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              🏹 एरोज्ञा मिशन - मानवता की शिक्षा का तीर
            </h1>
            <div className="text-xl md:text-2xl mb-4 opacity-95 font-semibold">
              एरो (तीर/बाण) + ज्ञा (ज्ञान/शिक्षा) = एरोज्ञा
            </div>
            <p className="text-lg md:text-xl mb-8 opacity-90 leading-relaxed max-w-4xl mx-auto">
              जाति, धर्म, वर्ग, क्षेत्र और राजनीति से ऊपर उठकर मानवता के लिए समर्पित<br />
              <strong>राजस्थान के मरुस्थल में ग्रामीण क्षेत्र का प्रथम ऐसा संस्थान</strong>
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <div className="bg-gradient-to-br from-yellow-400 to-orange-500 px-4 py-4 rounded-xl shadow-xl transform hover:scale-105 transition">
                <div className="text-4xl font-black text-white drop-shadow-2xl">3000+</div>
                <div className="text-sm text-white font-bold mt-1">सदस्य</div>
              </div>
              <div className="bg-gradient-to-br from-green-400 to-emerald-600 px-4 py-4 rounded-xl shadow-xl transform hover:scale-105 transition">
                <div className="text-4xl font-black text-white drop-shadow-2xl">₹2 करोड़</div>
                <div className="text-sm text-white font-bold mt-1">प्रोजेक्ट</div>
              </div>
              <div className="bg-gradient-to-br from-blue-400 to-indigo-600 px-4 py-4 rounded-xl shadow-xl transform hover:scale-105 transition">
                <div className="text-4xl font-black text-white drop-shadow-2xl">700+</div>
                <div className="text-sm text-white font-bold mt-1">विद्यालय</div>
              </div>
              <div className="bg-gradient-to-br from-pink-400 to-rose-600 px-4 py-4 rounded-xl shadow-xl transform hover:scale-105 transition">
                <div className="text-4xl font-black text-white drop-shadow-2xl">3 लाख+</div>
                <div className="text-sm text-white font-bold mt-1">निःशुल्क साहित्य</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">हमारा मिशन</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto mb-6"></div>
            </div>
            <div className="bg-gradient-to-r from-orange-50 to-red-50 p-8 rounded-2xl border-2 border-orange-200">
              <p className="text-xl text-gray-800 leading-relaxed text-center italic">
                &ldquo;मानवता की शिक्षा/ज्ञान का तीर, इंसान को जाति, धर्म, वर्ग, क्षेत्र और राजनीति से ऊपर उठाते हुए 
                मानव बनाकर मनुष्य जीवन की सत्यता व वास्तविकता का ज्ञान कराना - यही एरोज्ञा मिशन है।&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Foundation Story */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12 text-center">संस्थापना की कहानी</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="text-4xl mr-3">🏛️</span>
                  स्थापना
                </h3>
                <div className="space-y-3 text-gray-700">
                  <p><strong>संस्थापक:</strong> प्रथम देहदानी श्री अमराराम बोस</p>
                  <p><strong>स्थापना वर्ष:</strong> 7 अगस्त 2020</p>
                  <p><strong>अध्यक्ष:</strong> श्री कालुराम माली</p>
                  <p><strong>कोषाध्यक्ष:</strong> श्री बाबूलाल नामा</p>
                  <p><strong>स्थान:</strong> गुडामालानी उपखण्ड, बाड़मेर जिला, राजस्थान</p>
                  <p><strong>प्रारंभिक सदस्य:</strong> 7 सदस्यों के साथ शुरुआत</p>
                  <p><strong>वर्तमान कार्यकारिणी:</strong> 25 सदस्यीय कमेटी</p>
                </div>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="text-4xl mr-3">🏗️</span>
                  महत्वपूर्ण तिथि
                </h3>
                <div className="space-y-3 text-gray-700">
                  <p><strong>7 अगस्त 2022:</strong> ₹2 करोड़ के प्रोजेक्ट का शिलान्यास</p>
                  <p><strong>स्थान:</strong> मालियों की ढाणी, आरजीटी सर्कल के पास, नगर मेगा हाईवे</p>
                  <p><strong>भूमि दानकर्ता:</strong> श्री निम्बाराम माली</p>
                  <p><strong>निःशुल्क इंजीनियरिंग:</strong> इंजीनियर राज के पटेल, सांचौर</p>
                  <p><strong>पूर्ण कार्य:</strong> ₹60 लाख+ का कार्य संपन्न</p>
                  <p><strong>अपेक्षित उद्घाटन:</strong> सितंबर 2025</p>
                  <p className="text-sm text-gray-600 italic">* निर्माण कार्य निरंतर जारी है</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Major Achievements */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12 text-center">हमारी उपलब्धियां</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <div className="bg-gradient-to-br from-blue-400 to-indigo-600 text-white p-6 rounded-xl shadow-2xl text-center transform hover:scale-110 transition-all duration-300">
                <div className="text-6xl mb-3">📚</div>
                <div className="text-4xl font-black mb-2 drop-shadow-lg">3 लाख+</div>
                <div className="text-sm font-bold">निःशुल्क साहित्य वितरित</div>
              </div>
              
              <div className="bg-gradient-to-br from-green-400 to-emerald-600 text-white p-6 rounded-xl shadow-2xl text-center transform hover:scale-110 transition-all duration-300">
                <div className="text-6xl mb-3">🏫</div>
                <div className="text-4xl font-black mb-2 drop-shadow-lg">700+</div>
                <div className="text-sm font-bold">विद्यालय/कॉलेज में संगोष्ठी</div>
              </div>
              
              <div className="bg-gradient-to-br from-red-400 to-rose-600 text-white p-6 rounded-xl shadow-2xl text-center transform hover:scale-110 transition-all duration-300">
                <div className="text-6xl mb-3">❤️</div>
                <div className="text-4xl font-black mb-2 drop-shadow-lg">200+</div>
                <div className="text-sm font-bold">रक्तदाता वीर</div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-400 to-violet-600 text-white p-6 rounded-xl shadow-2xl text-center transform hover:scale-110 transition-all duration-300">
                <div className="text-6xl mb-3">🏥</div>
                <div className="text-4xl font-black mb-2 drop-shadow-lg">100+</div>
                <div className="text-sm font-bold">देहदान की घोषणा</div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-orange-50 border-2 border-orange-200 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
                  <span className="text-2xl mr-2">🌳</span>
                  पर्यावरण संरक्षण
                </h3>
                <p className="text-gray-700">हजारों पौधों का वृक्षारोपण जन्मदिन, शादी, सालगिरह और शुभ अवसरों पर</p>
              </div>
              
              <div className="bg-pink-50 border-2 border-pink-200 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
                  <span className="text-2xl mr-2">👩</span>
                  महिला सशक्तिकरण
                </h3>
                <p className="text-gray-700">महिला जागरूकता कार्यक्रम और शैक्षणिक प्रशिक्षण सत्र</p>
              </div>
              
              <div className="bg-yellow-50 border-2 border-yellow-200 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
                  <span className="text-2xl mr-2">💰</span>
                  आर्थिक सहयोग
                </h3>
                <p className="text-gray-700">लाइलाज बीमारी और शैक्षणिक संस्थानों में आर्थिक सहायता</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Library Project */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">🏛️ अत्याधुनिक पुस्तकालय प्रोजेक्ट</h2>
            <p className="text-xl mb-8 opacity-90">
              राजस्थान प्रदेश के ग्रामीण क्षेत्र में सबसे बड़ा अत्याधुनिक निःशुल्क सार्वजनिक पुस्तकालय संस्थान
            </p>
               <div className="grid md:grid-cols-3 gap-6 mb-6">
                 <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-6 rounded-2xl shadow-2xl text-center transform hover:scale-105 transition border-4 border-yellow-300">
                   <div className="text-5xl font-black text-white mb-2 drop-shadow-2xl">₹2 करोड़</div>
                   <div className="text-base text-yellow-100 font-bold">कुल प्रोजेक्ट लागत</div>
                 </div>
                 <div className="bg-gradient-to-br from-emerald-500 to-green-700 p-6 rounded-2xl shadow-2xl text-center transform hover:scale-105 transition border-4 border-green-300">
                   <div className="text-5xl font-black text-white mb-2 drop-shadow-2xl">78</div>
                   <div className="text-base text-green-100 font-bold">सीटें उपलब्ध</div>
                 </div>
                 <div className="bg-gradient-to-br from-pink-500 to-rose-700 p-6 rounded-2xl shadow-2xl text-center transform hover:scale-105 transition border-4 border-pink-300">
                   <div className="text-5xl font-black text-white mb-2 drop-shadow-2xl">100%</div>
                   <div className="text-base text-pink-100 font-bold">निःशुल्क सेवा</div>
                 </div>
               </div>
            <div className="bg-white bg-opacity-10 p-6 rounded-xl border-2 border-white border-opacity-20">
              <h3 className="text-xl font-bold mb-4 text-white">सुविधाएं</h3>
              <div className="grid md:grid-cols-2 gap-4 text-left">
                <div className="flex items-start">
                  <span className="text-yellow-300 mr-2 font-bold">✓</span>
                  <span className="text-white font-medium">पुस्तकालय सेवा</span>
                </div>
                <div className="flex items-start">
                  <span className="text-yellow-300 mr-2 font-bold">✓</span>
                  <span className="text-white font-medium">कोचिंग संस्थान</span>
                </div>
                <div className="flex items-start">
                  <span className="text-yellow-300 mr-2 font-bold">✓</span>
                  <span className="text-white font-medium">स्किल डेवलपमेंट सेंटर</span>
                </div>
                <div className="flex items-start">
                  <span className="text-yellow-300 mr-2 font-bold">✓</span>
                  <span className="text-white font-medium">जरूरतमंद विद्यार्थियों और महिलाओं के लिए निःशुल्क</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Composition */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12 text-center">हमारी टीम</h2>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-6 rounded-xl shadow-2xl text-center transform hover:scale-105 transition">
                <div className="text-5xl mb-3">👥</div>
                <div className="text-4xl font-black text-white mb-2 drop-shadow-lg">25</div>
                <div className="text-white font-bold">कार्यकारिणी सदस्य</div>
              </div>
              <div className="bg-gradient-to-br from-green-400 to-green-600 p-6 rounded-xl shadow-2xl text-center transform hover:scale-105 transition">
                <div className="text-5xl mb-3">🛡️</div>
                <div className="text-4xl font-black text-white mb-2 drop-shadow-lg">25</div>
                <div className="text-white font-bold">संरक्षक टीम</div>
              </div>
              <div className="bg-gradient-to-br from-purple-400 to-purple-600 p-6 rounded-xl shadow-2xl text-center transform hover:scale-105 transition">
                <div className="text-5xl mb-3">🌟</div>
                <div className="text-4xl font-black text-white mb-2 drop-shadow-lg">3000+</div>
                <div className="text-white font-bold">सक्रिय सदस्य</div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">टीम में शामिल हैं</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex items-center p-3 bg-blue-100 rounded-lg border-2 border-blue-400">
                  <span className="text-2xl mr-3">👨‍💼</span>
                  <span className="text-blue-900 font-bold">इंजीनियर</span>
                </div>
                <div className="flex items-center p-3 bg-green-100 rounded-lg border-2 border-green-400">
                  <span className="text-2xl mr-3">👨‍⚕️</span>
                  <span className="text-green-900 font-bold">डॉक्टर</span>
                </div>
                <div className="flex items-center p-3 bg-purple-100 rounded-lg border-2 border-purple-400">
                  <span className="text-2xl mr-3">👨‍⚖️</span>
                  <span className="text-purple-900 font-bold">वकील</span>
                </div>
                <div className="flex items-center p-3 bg-red-100 rounded-lg border-2 border-red-400">
                  <span className="text-2xl mr-3">🎖️</span>
                  <span className="text-red-900 font-bold">आईएएस / आईपीएस अधिकारी</span>
                </div>
                <div className="flex items-center p-3 bg-amber-100 rounded-lg border-2 border-amber-400">
                  <span className="text-2xl mr-3">🪖</span>
                  <span className="text-amber-900 font-bold">कर्नल / मेजर / फौज के अधिकारी</span>
                </div>
                <div className="flex items-center p-3 bg-pink-100 rounded-lg border-2 border-pink-400">
                  <span className="text-2xl mr-3">👨‍🏫</span>
                  <span className="text-pink-900 font-bold">प्रोफेसर / शिक्षाविद</span>
                </div>
                <div className="flex items-center p-3 bg-orange-100 rounded-lg border-2 border-orange-400">
                  <span className="text-2xl mr-3">📰</span>
                  <span className="text-orange-900 font-bold">पत्रकार</span>
                </div>
                <div className="flex items-center p-3 bg-indigo-100 rounded-lg border-2 border-indigo-400">
                  <span className="text-2xl mr-3">👮</span>
                  <span className="text-indigo-900 font-bold">पुलिस अधिकारी / कर्मचारी</span>
                </div>
                <div className="flex items-center p-3 bg-teal-100 rounded-lg border-2 border-teal-400">
                  <span className="text-2xl mr-3">🌾</span>
                  <span className="text-teal-900 font-bold">किसान</span>
                </div>
                <div className="flex items-center p-3 bg-cyan-100 rounded-lg border-2 border-cyan-400">
                  <span className="text-2xl mr-3">👷</span>
                  <span className="text-cyan-900 font-bold">मजदूर वर्ग</span>
                </div>
                <div className="flex items-center p-3 bg-lime-100 rounded-lg border-2 border-lime-400">
                  <span className="text-2xl mr-3">🎓</span>
                  <span className="text-lime-900 font-bold">विद्यार्थी / युवा</span>
                </div>
                <div className="flex items-center p-3 bg-rose-100 rounded-lg border-2 border-rose-400">
                  <span className="text-2xl mr-3">👩</span>
                  <span className="text-rose-900 font-bold">नारी शक्ति / महिलाएं</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Geographical Reach */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12 text-center">🌏 हमारी पहुंच</h2>
            
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">भारत में</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {['राजस्थान', 'गुजरात', 'महाराष्ट्र', 'मध्यप्रदेश', 'हरियाणा', 'दिल्ली', 'उत्तरप्रदेश', 'कर्नाटक', 'तमिलनाडु', 'आंध्रप्रदेश', 'असम', 'उत्तराखंड'].map((state) => (
                  <div key={state} className="bg-gradient-to-r from-green-100 to-blue-100 border-2 border-green-400 p-3 rounded-lg text-center font-bold text-green-900 shadow-md hover:shadow-lg transition">
                    {state}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">अंतर्राष्ट्रीय</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {['🇳🇵 नेपाल', '🇦🇺 ऑस्ट्रेलिया', '🇬🇧 इंग्लैंड', '🇯🇵 जापान', '🇺🇸 अमेरिका'].map((country) => (
                  <div key={country} className="bg-gradient-to-r from-orange-100 to-red-100 border-2 border-orange-400 p-3 rounded-lg text-center font-bold text-orange-900 shadow-md hover:shadow-lg transition">
                    {country}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Details */}
      <section className="py-16 bg-gray-800 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">कानूनी मान्यता</h2>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white bg-opacity-10 backdrop-blur-sm p-6 rounded-xl text-center border-2 border-white border-opacity-20">
                <div className="text-3xl mb-3">📜</div>
                <div className="font-semibold text-white text-lg">सोसाइटी एक्ट</div>
                <div className="text-sm text-gray-300 mt-2">राजस्थान सरकार</div>
              </div>
              <div className="bg-white bg-opacity-10 backdrop-blur-sm p-6 rounded-xl text-center border-2 border-white border-opacity-20">
                <div className="text-3xl mb-3">🏛️</div>
                <div className="font-semibold text-white text-lg">पब्लिक चैरिटेबल ट्रस्ट</div>
                <div className="text-sm text-gray-300 mt-2">सरकारी मान्यता प्राप्त</div>
              </div>
              <div className="bg-white bg-opacity-10 backdrop-blur-sm p-6 rounded-xl text-center border-2 border-white border-opacity-20">
                <div className="text-3xl mb-3">🔰</div>
                <div className="font-semibold text-white text-lg">सेक्शन 8 कंपनी</div>
                <div className="text-sm text-gray-300 mt-2">केंद्र सरकार से NGO रजिस्ट्रेशन</div>
              </div>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm p-6 rounded-xl border-2 border-white border-opacity-20">
              <h3 className="text-xl font-bold mb-4 text-white">रजिस्ट्रार कार्यालय</h3>
              <p className="mb-2 text-gray-200"><strong className="text-white">पता:</strong> खसरा नंबर 600/686, मालियों की ढाणी</p>
              <p className="mb-2 text-gray-200"><strong className="text-white">स्थान:</strong> आरजीटी सर्कल के पास, गुडामालानी, बाड़मेर</p>
              <p className="text-gray-200"><strong className="text-white">कार्य क्षेत्र:</strong> संपूर्ण भारत</p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Objectives */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">🎯 मुख्य उद्देश्य</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-teal-500 to-cyan-700 p-5 rounded-xl shadow-xl border-2 border-teal-300">
                <div className="flex items-start">
                  <span className="text-yellow-300 text-3xl mr-3 font-black">✓</span>
                  <span className="text-lg text-white font-bold">नशा, सामाजिक कुरीतियों, अंधविश्वास और पाखंड से मुक्ति</span>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-indigo-700 p-5 rounded-xl shadow-xl border-2 border-blue-300">
                <div className="flex items-start">
                  <span className="text-yellow-300 text-3xl mr-3 font-black">✓</span>
                  <span className="text-lg text-white font-bold">तार्किक और वैज्ञानिक सोच का विकास</span>
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-violet-700 p-5 rounded-xl shadow-xl border-2 border-purple-300">
                <div className="flex items-start">
                  <span className="text-yellow-300 text-3xl mr-3 font-black">✓</span>
                  <span className="text-lg text-white font-bold">शिक्षा के क्षेत्र में योगदान और जागरूकता</span>
                </div>
              </div>
              <div className="bg-gradient-to-br from-pink-500 to-rose-700 p-5 rounded-xl shadow-xl border-2 border-pink-300">
                <div className="flex items-start">
                  <span className="text-yellow-300 text-3xl mr-3 font-black">✓</span>
                  <span className="text-lg text-white font-bold">स्वास्थ्य और चिकित्सा सेवाओं में सहयोग</span>
                </div>
              </div>
              <div className="bg-gradient-to-br from-emerald-500 to-green-700 p-5 rounded-xl shadow-xl border-2 border-emerald-300">
                <div className="flex items-start">
                  <span className="text-yellow-300 text-3xl mr-3 font-black">✓</span>
                  <span className="text-lg text-white font-bold">पर्यावरण संरक्षण और वृक्षारोपण</span>
                </div>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-red-700 p-5 rounded-xl shadow-xl border-2 border-orange-300">
                <div className="flex items-start">
                  <span className="text-yellow-300 text-3xl mr-3 font-black">✓</span>
                  <span className="text-lg text-white font-bold">महिला सशक्तिकरण और युवा विकास</span>
                </div>
              </div>
              <div className="bg-gradient-to-br from-amber-500 to-yellow-700 p-5 rounded-xl shadow-xl border-2 border-amber-300 md:col-span-2">
                <div className="flex items-start justify-center">
                  <span className="text-yellow-300 text-3xl mr-3 font-black">✓</span>
                  <span className="text-lg text-white font-bold">फिजूलखर्ची रोकते हुए मानवीय कार्यों में भागीदारी</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Story */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center">💫 प्रेरणा की कहानी</h2>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 p-8 rounded-2xl">
              <p className="text-xl text-gray-800 leading-relaxed mb-6 italic text-center">
                "एक छोटी सी जन्मदिन/शादी सालगिरह व अन्य शुभ अवसर पर शिक्षा के क्षेत्र में अंशदान की शुरुआत 
                आज लाखों लोगों के लिए प्रेरणा बन गई है।"
              </p>
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">हमारा प्रभाव</h3>
                <p className="text-gray-700 leading-relaxed text-center">
                  इस मिशन की बदौलत आज अनेक सैकड़ों परिवारों और हजारों लोगों के जीवन में शिक्षा व मानवता की रोशनी से जीवन रोशन हो चुका है।
                  यह एक मानवीय मिशन है जो राजनीति, धार्मिक अंधविश्वास, पाखंड, नशा और सामाजिक कुरीतियों से बाहर निकलकर 
                  शिक्षा व मानवीय कार्यों में भागीदारी के साथ आगे बढ़ रहा है।
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Organization Registration & Motivation Section */}
      <section className="py-16 bg-gradient-to-r from-orange-50 to-yellow-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12 text-center">📜 संस्था पंजीकरण एवं प्रेरणा</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Side - Organization Details */}
              <div className="bg-white p-8 rounded-2xl shadow-2xl border-2 border-orange-300">
                <div className="text-center mb-6">
                  <div className="text-5xl mb-4">🏛️</div>
                  <h3 className="text-2xl font-bold text-orange-600 mb-2">एरोज्ञा</h3>
                  <p className="text-xl font-semibold text-gray-700">पुस्तकालय एवं सेवा संस्था</p>
                </div>
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl border-2 border-blue-200">
                    <p className="text-sm font-semibold text-blue-700 mb-1">सोसाइटी रजि. नं.:</p>
                    <p className="text-lg font-black text-blue-900">COOP/2020/BMR/202370</p>
                  </div>
                  <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl border-2 border-green-200">
                    <p className="text-sm font-semibold text-green-700 mb-1">सार्वजनिक चैरिटेबल TRUST रजि. नं.:</p>
                    <p className="text-lg font-black text-green-900">202303092400011</p>
                  </div>
                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-xl border-2 border-purple-200">
                    <p className="text-sm font-semibold text-purple-700 mb-1">CIN NO.:</p>
                    <p className="text-lg font-black text-purple-900">U88900RJ2025NPL106455</p>
                  </div>
                </div>
              </div>

              {/* Right Side - Motivational Messages */}
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-red-500 to-orange-600 p-8 rounded-2xl shadow-2xl text-white text-center">
                  <div className="text-6xl mb-4">✍️</div>
                  <p className="text-2xl md:text-3xl font-black leading-relaxed italic drop-shadow-2xl">
                    "कलम की ताकत<br />दुनिया की सबसे बड़ी ताकत है!"
                  </p>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-teal-600 p-8 rounded-2xl shadow-2xl text-white text-center">
                  <div className="text-6xl mb-4">🍚</div>
                  <p className="text-xl md:text-2xl font-bold leading-relaxed drop-shadow-2xl">
                    "एक रोटी कम खाओ<br />लेकिन बच्चों को<br />जरूर पढ़ाओ!!"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">🤝 इस मानवीय मिशन का हिस्सा बनें</h2>
            <p className="text-xl mb-8 opacity-90">
              मानवता की सेवा के इस महान कार्य में आपका योगदान अमूल्य है। आज ही हमारे साथ जुड़ें और बदलाव का हिस्सा बनें।
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/apply"
                className="bg-white text-orange-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors duration-300 shadow-xl"
              >
                सदस्यता के लिए आवेदन करें
              </a>
              <a
                href="/donations"
                className="border-3 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-orange-600 transition-colors duration-300 shadow-xl"
              >
                दान करें / योगदान दें
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
