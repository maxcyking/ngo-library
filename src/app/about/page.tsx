import { Metadata } from 'next'
import { CertificatesSection } from '@/components/certificates/certificates-section'

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
      {/* Enhanced Hero Section with Key Points */}
      <section className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {/* Main Title */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-6 shadow-lg">
                <span className="text-4xl">🏹</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
                एरोज्ञा मिशन
              </h1>
              <div className="text-xl md:text-2xl text-gray-600 mb-4 font-semibold">
                एरो (तीर/बाण) + ज्ञा (ज्ञान/शिक्षा) = एरोज्ञा
              </div>
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-4xl mx-auto">
                जाति, धर्म, वर्ग, क्षेत्र और राजनीति से ऊपर उठकर मानवता के लिए समर्पित<br />
                <span className="font-bold text-indigo-600">राजस्थान के मरुस्थल में ग्रामीण क्षेत्र का प्रथम ऐसा संस्थान</span>
              </p>
            </div>

            {/* Four Key Points Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8 mb-16">
              {/* परिचय */}
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border-l-4 border-blue-500">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold mr-4">
                    🏹
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">परिचय</h3>
                </div>
                <div className="space-y-3">
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <p className="text-sm font-semibold text-blue-800 mb-1">एरोज्ञा शब्द की उत्पत्ति:</p>
                    <p className="text-sm text-gray-700">
                      <span className="font-bold text-blue-600">एरो:</span> तीर/बाण<br/>
                      <span className="font-bold text-blue-600">ज्ञा:</span> ज्ञान/शिक्षा
                    </p>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    यह अंग्रेजी व हिन्दी शब्दों को जोड़कर एक यूनिक नाम रखा गया, जो जाति, धर्म, वर्ग, समुदाय से ऊपर उठकर एक शिक्षा जागरूकता का मानवीय कार्य का मंच है।
                  </p>
                </div>
              </div>

              {/* उद्देश्य */}
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border-l-4 border-green-500">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white text-xl font-bold mr-4">
                    🎯
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">उद्देश्य</h3>
                </div>
                <div className="space-y-3">
                  <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                    <p className="text-sm font-semibold text-green-800 mb-1">पंजीकृत संस्था:</p>
                    <p className="text-sm text-gray-700">सरकार द्वारा रजिस्ट्रेशन :- सोसाइटी /सार्वजनिक चैरिटेबल ट्रस्ट /सेक्शन 8 रजिस्ट्रेशन NGO है</p>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    "एरोज्ञा" शिक्षाविदों, विद्वानों, समाज सुधारकों, पर्यावरण प्रेमियों, वैज्ञानिक व दार्शनिक विचारकों की एक पहल है, जिसका कार्यक्षेत्र देश भर में है।
                  </p>
                </div>
              </div>

              {/* मुख्य उद्देश्य */}
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border-l-4 border-orange-500">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white text-xl font-bold mr-4">
                    📚
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">मुख्य उद्देश्य</h3>
                </div>
                <div className="space-y-2">
                  <div className="bg-orange-50 p-2 rounded border border-orange-200 text-xs text-gray-700">
                    ✓ प्रतियोगिता पूर्ण व बदलते परिपेक्ष में युवाओं का मार्गदर्शन
                  </div>
                  <div className="bg-orange-50 p-2 rounded border border-orange-200 text-xs text-gray-700">
                    ✓ मोटिवेशन देना, साहित्य उपलब्ध करवाना
                  </div>
                  <div className="bg-orange-50 p-2 rounded border border-orange-200 text-xs text-gray-700">
                    ✓ गरीब तबके के बच्चों को विद्यालय से जोड़ना
                  </div>
                  <div className="bg-orange-50 p-2 rounded border border-orange-200 text-xs text-gray-700">
                    ✓ वैज्ञानिक व तकनीकी विचार विकसित करना
                  </div>
                  <div className="bg-orange-50 p-2 rounded border border-orange-200 text-xs text-gray-700">
                    ✓ जरूरतमंदों की आर्थिक सहायता करना
                  </div>
                </div>
              </div>

              {/* सामाजिक सुधार */}
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border-l-4 border-purple-500">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold mr-4">
                    🌟
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">सामाजिक सुधार</h3>
                </div>
                <div className="space-y-3">
                  <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                    <p className="text-sm font-semibold text-purple-800 mb-1">मुक्ति दिलाना:</p>
                    <p className="text-xs text-gray-700">सामाजिक, धार्मिक, अंधविश्वास से बाहर निकलकर</p>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    सामाजिक कुरीतियों, मृत्युभोज, आडंबरों व आर्थिक अपव्यय से बचाकर युवाओं को शिक्षित व जागरूक कराना।
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              <div className="bg-white p-6 rounded-xl shadow-md text-center border-t-4 border-blue-500">
                <div className="text-3xl font-bold text-blue-600 mb-2">3000+</div>
                <div className="text-sm text-gray-600 font-medium">सदस्य</div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md text-center border-t-4 border-green-500">
                <div className="text-3xl font-bold text-green-600 mb-2">₹2 करोड़</div>
                <div className="text-sm text-gray-600 font-medium">प्रोजेक्ट</div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md text-center border-t-4 border-orange-500">
                <div className="text-3xl font-bold text-orange-600 mb-2">700+</div>
                <div className="text-sm text-gray-600 font-medium">विद्यालय</div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md text-center border-t-4 border-purple-500">
                <div className="text-3xl font-bold text-purple-600 mb-2">3 लाख+</div>
                <div className="text-sm text-gray-600 font-medium">निःशुल्क साहित्य</div>
              </div>
            </div>

            {/* निष्कर्ष / संदेश */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white text-center">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-3xl mr-4">
                    🤝
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold">निष्कर्ष / संदेश</h3>
                </div>
                <p className="text-lg md:text-xl leading-relaxed opacity-95 mb-6">
                  "एरोज्ञा" समाजोद्धार व पर्यावरण संरक्षण, मानवीय व पुण्य कार्यों में आप सभी की भागीदारी, मार्गदर्शन व सहयोग की अपेक्षा करता है।
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="/apply"
                    className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300"
                  >
                    सदस्य बनें
                  </a>
                  <a
                    href="/contact"
                    className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition-colors duration-300"
                  >
                    संपर्क करें
                  </a>
                </div>
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
                  <p><strong>संस्थापक:</strong> प्रथम देहदानी  अमराराम बोस</p>
                  <p><strong>स्थापना वर्ष:</strong> 7 अगस्त 2020</p>
                  <p><strong>अध्यक्ष:</strong>  कालुराम माली</p>
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
                  <p><strong>भूमि दानकर्ता:</strong>  निम्बाराम माली</p>
                  <p><strong>निःशुल्क इंजीनियरिंग:</strong> इंजीनियर राज के पटेल, सांचौर</p>
                  <p><strong>पूर्ण कार्य:</strong> ₹70 लाख+ का कार्य संपन्न(till Aug 2025) </p>
                  <p><strong>अपेक्षित उद्घाटन:</strong> 2025</p>
                  <p className="text-sm text-gray-600 italic">* निर्माण कार्य निरंतर जारी है</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Library Project */}
      <section className="py-20 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-yellow-300 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-pink-300 rounded-full blur-2xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-6 shadow-2xl">
                <span className="text-4xl">🏛️</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black mb-6 bg-gradient-to-r from-yellow-300 via-pink-300 to-cyan-300 bg-clip-text text-transparent drop-shadow-2xl">
                अत्याधुनिक पुस्तकालय प्रोजेक्ट
              </h2>
              <p className="text-xl md:text-2xl mb-4 opacity-95 font-semibold max-w-4xl mx-auto leading-relaxed">
                राजस्थान प्रदेश के ग्रामीण क्षेत्र में सबसे बड़ा अत्याधुनिक निःशुल्क सार्वजनिक पुस्तकालय संस्थान
              </p>
              <div className="w-32 h-1 bg-gradient-to-r from-yellow-400 to-pink-400 mx-auto rounded-full"></div>
            </div>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-600 rounded-3xl blur-lg opacity-75 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative bg-gradient-to-br from-amber-500 to-orange-600 p-8 rounded-3xl shadow-2xl text-center transform hover:scale-110 transition-all duration-500 border-4 border-yellow-300">
                  <div className="text-6xl md:text-7xl font-black text-white mb-3 drop-shadow-2xl animate-pulse">₹2 करोड़</div>
                  <div className="text-lg text-yellow-100 font-bold">कुल प्रोजेक्ट लागत</div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-300 rounded-full flex items-center justify-center">
                    <span className="text-orange-600 font-black text-sm">💰</span>
                  </div>
                </div>
              </div>

              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-600 rounded-3xl blur-lg opacity-75 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative bg-gradient-to-br from-emerald-500 to-green-700 p-8 rounded-3xl shadow-2xl text-center transform hover:scale-110 transition-all duration-500 border-4 border-green-300">
                  <div className="text-6xl md:text-7xl font-black text-white mb-3 drop-shadow-2xl animate-pulse">78</div>
                  <div className="text-lg text-green-100 font-bold">सीटें उपलब्ध</div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-300 rounded-full flex items-center justify-center">
                    <span className="text-green-700 font-black text-sm">🪑</span>
                  </div>
                </div>
              </div>

              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-rose-600 rounded-3xl blur-lg opacity-75 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative bg-gradient-to-br from-pink-500 to-rose-700 p-8 rounded-3xl shadow-2xl text-center transform hover:scale-110 transition-all duration-500 border-4 border-pink-300">
                  <div className="text-6xl md:text-7xl font-black text-white mb-3 drop-shadow-2xl animate-pulse">100%</div>
                  <div className="text-lg text-pink-100 font-bold">निःशुल्क सेवा</div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-pink-300 rounded-full flex items-center justify-center">
                    <span className="text-pink-700 font-black text-sm">🆓</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Features Section */}
            <div className="bg-white bg-opacity-10 backdrop-blur-lg p-10 rounded-3xl border-2 border-white border-opacity-30 shadow-2xl">
              <div className="text-center mb-10">
                <h3 className="text-3xl md:text-4xl font-bold text-black mb-4 flex items-center justify-center">
                  <span className="text-5xl mr-4 text-black">✨</span>
                  उपलब्ध सुविधाएं
                  <span className="text-5xl ml-4">✨</span>
                </h3>
                <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 mx-auto rounded-full"></div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="group bg-gradient-to-br from-blue-500 to-indigo-600 p-6 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-2 border-blue-300">
                  <div className="text-center">
                    <div className="text-4xl mb-3 group-hover:animate-bounce">📚</div>
                    <div className="text-white font-bold text-lg">पुस्तकालय सेवा</div>
                    <div className="text-blue-100 text-sm mt-2">व्यापक पुस्तक संग्रह</div>
                  </div>
                </div>

                <div className="group bg-gradient-to-br from-purple-500 to-violet-600 p-6 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-2 border-purple-300">
                  <div className="text-center">
                    <div className="text-4xl mb-3 group-hover:animate-bounce">🎓</div>
                    <div className="text-white font-bold text-lg">कोचिंग संस्थान</div>
                    <div className="text-purple-100 text-sm mt-2">प्रतियोगी परीक्षा तैयारी</div>
                  </div>
                </div>

                <div className="group bg-gradient-to-br from-teal-500 to-cyan-600 p-6 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-2 border-teal-300">
                  <div className="text-center">
                    <div className="text-4xl mb-3 group-hover:animate-bounce">🛠️</div>
                    <div className="text-white font-bold text-lg">स्किल डेवलपमेंट</div>
                    <div className="text-teal-100 text-sm mt-2">कौशल विकास केंद्र</div>
                  </div>
                </div>

                <div className="group bg-gradient-to-br from-rose-500 to-pink-600 p-6 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-2 border-rose-300">
                  <div className="text-center">
                    <div className="text-4xl mb-3 group-hover:animate-bounce">👩‍🎓</div>
                    <div className="text-white font-bold text-lg">विशेष सहायता</div>
                    <div className="text-rose-100 text-sm mt-2">जरूरतमंदों के लिए निःशुल्क</div>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="mt-10 bg-gradient-to-r from-indigo-600 to-purple-600 p-8 rounded-2xl border-2 border-indigo-300">
                <div className="text-center">
                  <h4 className="text-2xl font-bold text-white mb-4 flex items-center justify-center">
                    <span className="text-3xl mr-3">🌟</span>
                    विशेष लाभार्थी
                    <span className="text-3xl ml-3">🌟</span>
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white bg-opacity-20 p-4 text-black-300 rounded-xl">
                      <div className="text-yellow-300 text-2xl mb-2">👨‍🎓</div>
                      <div className="text-black font-semibold">जरूरतमंद विद्यार्थी</div>
                      <div className="text-black text-sm">पूर्णतः निःशुल्क शिक्षा</div>
                    </div>
                    <div className="bg-white bg-opacity-20 p-4 text-black-300 rounded-xl">
                      <div className="text-pink-300 text-2xl mb-2">👩‍💼</div>
                      <div className="text-black font-semibold">महिला सशक्तिकरण</div>
                      <div className="text-black text-sm">निःशुल्क कौशल प्रशिक्षण</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Certificates & Awards */}
      <CertificatesSection />

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
