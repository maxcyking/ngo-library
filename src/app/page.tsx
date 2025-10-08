"use client";

import Image from "next/image";
import { HeroSlider } from "@/components/home/hero-slider";
import { NewsTicker } from "@/components/home/news-ticker";

import { Testimonials } from "@/components/home/testimonials";
import { GalleryPreview } from "@/components/home/gallery-preview";
import { DonationCTA } from "@/components/home/donation-cta";
import { UpcomingEvents } from "@/components/home/upcoming-events";
import { LibraryShowcase } from "@/components/home/library-showcase";
import { LatestNews } from "@/components/home/latest-news";

// Sample data - यह बाद में database से आएगा
const heroSlides = [
  {
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    title: "एरोज्ञा पुस्तकालय एवं सेवा संस्था में आपका स्वागत है",
    description: "2020 से समाज सेवा के क्षेत्र में निरंतर कार्यरत - शिक्षा, स्वास्थ्य और सामाजिक कल्याण के लिए समर्पित",
    ctaText: "हमारे बारे में जानें",
    ctaLink: "/about",
  },
  {
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    title: "निःशुल्क पुस्तकालय सेवा - 2000+ पुस्तकें उपलब्ध",
    description: "धार्मिक, शैक्षणिक, साहित्यिक और तकनीकी पुस्तकों का विशाल संग्रह",
    ctaText: "पुस्तक सूची देखें",
    ctaLink: "/library",
  },
  {
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2089&q=80",
    title: "रक्तदान महादान - जीवन बचाने में सहयोग करें",
    description: "नियमित रक्तदान शिविर का आयोजन - 150+ सक्रिय रक्तदाता",
    ctaText: "रक्तदाता बनें",
    ctaLink: "/donations",
  },
  {
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2022&q=80",
    title: "नया पुस्तकालय भवन निर्माण कार्य प्रगति पर",
    description: "65 लाख रुपए की लागत से आधुनिक पुस्तकालय भवन का निर्माण",
    ctaText: "प्रगति देखें",
    ctaLink: "/projects",
  },
];




export default function Home() {
  return (
    <div itemScope itemType="https://schema.org/NGO">
      {/* Hero Slider */}
      <HeroSlider slides={heroSlides} />

      {/* News Ticker */}
      <NewsTicker />

      {/* Organization Introduction - Four Key Points */}
      <section className="py-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              एरोज्ञा पुस्तकालय एवं सेवा संस्था
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              जाति, धर्म, वर्ग, समुदाय से ऊपर उठकर शिक्षा जागरूकता का मानवीय कार्य
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8">
            {/* परिचय */}
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border-t-4 border-blue-500">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold mr-4">
                  🏹
                </div>
                <h3 className="text-xl font-bold text-gray-800">परिचय</h3>
              </div>
              <div className="space-y-3">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm font-semibold text-blue-800 mb-1">एरोज्ञा शब्द की उत्पत्ति:</p>
                  <p className="text-sm text-gray-700">
                    <span className="font-bold text-blue-600">एरो:</span> तीर/बाण<br />
                    <span className="font-bold text-blue-600">ज्ञा:</span> ज्ञान/शिक्षा
                  </p>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  यह अंग्रेजी व हिन्दी शब्दों को जोड़कर एक यूनिक नाम रखा गया, जो जाति, धर्म, वर्ग, समुदाय से ऊपर उठकर एक शिक्षा जागरूकता का मानवीय कार्य का मंच है।
                </p>
              </div>
            </div>

            {/* उद्देश्य */}
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border-t-4 border-green-500">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white text-xl font-bold mr-4">
                  🎯
                </div>
                <h3 className="text-xl font-bold text-gray-800">उद्देश्य</h3>
              </div>
              <div className="space-y-3">
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm font-semibold text-green-800 mb-1">पंजीकृत संस्था:</p>
                  <p className="text-sm text-gray-700">सरकार द्वारा रजिस्ट्रेशन :- सोसाइटी /सार्वजनिक चैरिटेबल ट्रस्ट /सेक्शन 8 रजिस्ट्रेशन NGO है</p>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  "एरोज्ञा" शिक्षाविदों, विद्वानों, समाज सुधारकों, पर्यावरण प्रेमियों, वैज्ञानिक व दार्शनिक विचारकों की एक पहल है, जिसका कार्यक्षेत्र देश भर में है।
                </p>
              </div>
            </div>

            {/* मुख्य उद्देश्य */}
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border-t-4 border-orange-500">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white text-xl font-bold mr-4">
                  📚
                </div>
                <h3 className="text-xl font-bold text-gray-800">मुख्य उद्देश्य</h3>
              </div>
              <div className="space-y-2">
                <div className="bg-orange-50 p-2 rounded text-xs text-gray-700">
                  ✓ प्रतियोगिता पूर्ण व बदलते परिपेक्ष में युवाओं का मार्गदर्शन
                </div>
                <div className="bg-orange-50 p-2 rounded text-xs text-gray-700">
                  ✓ मोटिवेशन देना, साहित्य उपलब्ध करवाना
                </div>
                <div className="bg-orange-50 p-2 rounded text-xs text-gray-700">
                  ✓ गरीब तबके के बच्चों को विद्यालय से जोड़ना
                </div>
                <div className="bg-orange-50 p-2 rounded text-xs text-gray-700">
                  ✓ वैज्ञानिक व तकनीकी विचार विकसित करना
                </div>
                <div className="bg-orange-50 p-2 rounded text-xs text-gray-700">
                  ✓ जरूरतमंदों की आर्थिक सहायता करना
                </div>
              </div>
            </div>

            {/* सामाजिक सुधार */}
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border-t-4 border-purple-500">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold mr-4">
                  🌟
                </div>
                <h3 className="text-xl font-bold text-gray-800">सामाजिक सुधार</h3>
              </div>
              <div className="space-y-3">
                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="text-sm font-semibold text-purple-800 mb-1">मुक्ति दिलाना:</p>
                  <p className="text-xs text-gray-700">सामाजिक, धार्मिक, अंधविश्वास से बाहर निकलकर</p>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  सामाजिक कुरीतियों, मृत्युभोज, आडंबरों व आर्थिक अपव्यय से बचाकर युवाओं को शिक्षित व जागरूक कराना।
                </p>
              </div>
            </div>
          </div>

          {/* निष्कर्ष / संदेश */}
          <div className="mt-12 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white text-center">
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
                  href="/about"
                  className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300"
                >
                  विस्तार से जानें
                </a>
                <a
                  href="/apply"
                  className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition-colors duration-300"
                >
                  सदस्य बनें
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement Section */}
      <section className="py-16 bg-gradient-to-r from-orange-600 via-red-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center">
            <div className="mb-6">
              <div className="inline-block bg-white bg-opacity-20 backdrop-blur-sm px-6 py-3 rounded-full text-lg font-semibold mb-4">
                एरो (तीर/बाण) + ज्ञा (ज्ञान/शिक्षा) = एरोज्ञा
              </div>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              🏹 मानवता की ओर शिक्षा का तीर
            </h2>
            <p className="text-xl md:text-2xl mb-8 leading-relaxed opacity-95">
              "इंसान को जाति, धर्म, वर्ग, क्षेत्र और राजनीति से ऊपर उठाते हुए मानव बनाकर
              मनुष्य जीवन की सत्यता व वास्तविकता का ज्ञान कराना"
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-4 rounded-xl shadow-xl transform hover:scale-105 transition">
                <div className="text-4xl font-black text-white drop-shadow-2xl">3000+</div>
                <div className="text-sm text-white font-bold mt-1">सदस्य</div>
              </div>
              <div className="bg-gradient-to-br from-pink-400 to-rose-600 p-4 rounded-xl shadow-xl transform hover:scale-105 transition">
                <div className="text-4xl font-black text-white drop-shadow-2xl">3 लाख+</div>
                <div className="text-sm text-white font-bold mt-1">निःशुल्क साहित्य</div>
              </div>
              <div className="bg-gradient-to-br from-blue-400 to-indigo-600 p-4 rounded-xl shadow-xl transform hover:scale-105 transition">
                <div className="text-4xl font-black text-white drop-shadow-2xl">700+</div>
                <div className="text-sm text-white font-bold mt-1">विद्यालय</div>
              </div>
              <div className="bg-gradient-to-br from-green-400 to-emerald-600 p-4 rounded-xl shadow-xl transform hover:scale-105 transition">
                <div className="text-4xl font-black text-white drop-shadow-2xl">12+</div>
                <div className="text-sm text-white font-bold mt-1">राज्यों में सक्रिय</div>
              </div>
            </div>
            <a
              href="/about"
              className="inline-block bg-white text-orange-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors duration-300 shadow-xl"
            >
              हमारी कहानी जानें →
            </a>
          </div>
        </div>
      </section>

      {/* Organization Introduction */}
      <section className="py-16 bg-white" itemScope itemType="https://schema.org/AboutPage">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6" itemProp="name">
                राजस्थान के मरुस्थल में मानवता का प्रकाश
              </h1>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed" itemProp="description">
                मिशन की स्थापना <time itemProp="foundingDate" dateTime="2020">7 अगस्त 2020</time> को संस्थापक <strong>अमराराम बोस </strong> 
                <span itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
                  <span itemProp="addressLocality">बाडमेर जिले</span>
                </span> के प्रथम देहदानी एवं अध्यक्ष <strong>कालुराम माली</strong> के साथ अध्यात्मिक गुरु नेमनाथ जी महाराज प्रागमठ सिणधरी, 
                गुरू रामभारती जी महाराज पायला मठ सिणधरी, गुरु गणेशनाथ जी महाराज शिव मठ सांचौर, बौद्ध भिक्षु डॉ सिद्धार्थ वर्धन "गौरव" 
                सहित एरोज्ञा टीम के साथ मानवीय मिशन की शुरुआत की गई जो आज जाति धर्म वर्ग क्षेत्र राजनीति से उपर उठकर 
                <span itemProp="addressRegion">राजस्थान</span> के मरू प्रदेश सहित पूरे देश में <strong>मानवता की मिसाल बन चुकी है।</strong>
              </p>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 p-6 rounded-xl mb-6">
                <h3 className="font-bold text-gray-800 mb-3 flex items-center">
                  <span className="text-2xl mr-2">🏛️</span>
                  ₹2 करोड़ का प्रोजेक्ट
                </h3>
                <p className="text-gray-700 mb-2">
                  <strong>7 अगस्त 2022</strong> को मालियों की ढाणी, आरजीटी सर्कल के पास 78 सीटों के साथ
                  अत्याधुनिक पुस्तकालय व कोचिंग संस्थान का शिलान्यास हुआ। <strong>₹60 लाख+</strong> का कार्य पूर्ण हो चुका है।
                </p>
                <p className="text-sm text-gray-600">
                  <strong>अपेक्षित उद्घाटन:</strong> सितंबर 2025
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="/about"
                  className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 text-center shadow-lg"
                >
                  संपूर्ण कहानी पढ़ें
                </a>
                <a
                  href="/apply"
                  className="border-2 border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300 text-center"
                >
                  सदस्य बनें
                </a>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/images/home1.jpg"
                alt="एरोज्ञा पुस्तकालय भवन निर्माण"
                width={600}
                height={400}
                className="rounded-lg shadow-lg w-full h-auto"
              />
              <div className="absolute -bottom-6 -right-6 bg-gradient-to-r from-orange-600 to-red-600 text-white p-6 rounded-lg shadow-lg">
                <div className="text-3xl font-bold mb-1">2020</div>
                <div className="text-sm">7 अगस्त - स्थापना दिवस</div>
                <div className="text-xs mt-2 opacity-90">7 सदस्यों से 3000+ सदस्यों तक</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission Section - Zigzag Layout 1 */}
      <section className="py-16 bg-gradient-to-r from-orange-50 to-red-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Mission Statement */}
            <div className="order-2 lg:order-1">
              <div className="bg-gradient-to-br from-orange-100 to-red-100 border-2 border-orange-300 p-8 rounded-2xl shadow-2xl">
                <p className="text-2xl md:text-3xl text-gray-800 leading-relaxed italic font-semibold text-center">
                  "मानवता की शिक्षा/ज्ञान का तीर, इंसान को जाति, धर्म, वर्ग, क्षेत्र और राजनीति से ऊपर उठाते हुए मानव बनाकर मनुष्य जीवन की सत्यता व वास्तविकता का ज्ञान कराना - यही एरोज्ञा मिशन है।"
                </p>
              </div>
            </div>

            {/* Right Side - Title & Visual */}
            <div className="order-1 lg:order-2">
              <div className="text-center lg:text-left mb-6">
                <div className="inline-block bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-2 rounded-full mb-4">
                  <span className="text-sm font-bold">OUR MISSION</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-gray-800 mb-6">
                  हमारा मिशन
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-orange-600 to-red-600 mb-6"></div>
                <p className="text-lg text-gray-700 leading-relaxed">
                  <strong className="text-orange-600">एरो</strong> = तीर/बाण, <strong className="text-orange-600">ज्ञा</strong> = ज्ञान/शिक्षा
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-6 rounded-xl shadow-xl text-center transform hover:scale-105 transition">
                  <div className="text-5xl mb-2">🎯</div>
                  <div className="text-white font-bold text-sm">मानवता का तीर</div>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-700 p-6 rounded-xl shadow-xl text-center transform hover:scale-105 transition">
                  <div className="text-5xl mb-2">📖</div>
                  <div className="text-white font-bold text-sm">शिक्षा का ज्ञान</div>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-700 p-6 rounded-xl shadow-xl text-center transform hover:scale-105 transition">
                  <div className="text-5xl mb-2">🤝</div>
                  <div className="text-white font-bold text-sm">सामाजिक एकता</div>
                </div>
                <div className="bg-gradient-to-br from-pink-500 to-pink-700 p-6 rounded-xl shadow-xl text-center transform hover:scale-105 transition">
                  <div className="text-5xl mb-2">✨</div>
                  <div className="text-white font-bold text-sm">सत्यता का बोध</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Inspiration Story Section - Zigzag Layout 2 */}
      <section className="py-16 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Title & Visual */}
            <div className="order-1">
              <div className="text-center lg:text-left mb-6">
                <div className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full mb-4">
                  <span className="text-sm font-bold">INSPIRATION</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-gray-800 mb-6">
                  💫 प्रेरणा की कहानी
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mb-6"></div>
              </div>
              <div className="relative">
                <img
                  src="images/home2.jpg"
                  alt="प्रेरणा और सामाजिक कार्य"
                  className="rounded-2xl shadow-2xl w-full h-auto"
                />
                <div className="absolute -bottom-6 -right-6 bg-gradient-to-br from-purple-600 to-pink-600 text-white p-6 rounded-xl shadow-2xl">
                  <div className="text-3xl font-black mb-1">हजारों</div>
                  <div className="text-sm font-bold">जीवन बदले</div>
                </div>
              </div>
            </div>

            {/* Right Side - Story Content */}
            <div className="order-2">
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 border-2 border-purple-300 p-8 rounded-2xl shadow-2xl mb-6">
                <p className="text-xl md:text-2xl text-gray-800 leading-relaxed italic font-semibold text-center mb-6">
                  "एक छोटी सी जन्मदिन/शादी सालगिरह व अन्य शुभ अवसर पर शिक्षा के क्षेत्र में अंशदान की शुरुआत आज लाखों लोगों के लिए प्रेरणा बन गई है।"
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-purple-200">
                <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center flex items-center justify-center">
                  <span className="text-3xl mr-2">🌟</span>
                  हमारा प्रभाव
                </h3>
                <p className="text-gray-700 leading-relaxed text-center">
                  इस मिशन की बदौलत आज अनेक सैकड़ों परिवारों और हजारों लोगों के जीवन में शिक्षा व मानवता की रोशनी से जीवन रोशन हो चुका है।
                  यह एक मानवीय मिशन है जो राजनीति, धार्मिक अंधविश्वास, पाखंड, नशा और सामाजिक कुरीतियों से बाहर निकलकर
                  शिक्षा व मानवीय कार्यों में भागीदारी के साथ आगे बढ़ रहा है।
                </p>
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="text-center">
                    <div className="text-3xl font-black text-purple-600">सैकड़ों</div>
                    <div className="text-sm text-gray-600 font-semibold">परिवार</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-black text-pink-600">हजारों</div>
                    <div className="text-sm text-gray-600 font-semibold">लोग</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-black text-indigo-600">लाखों</div>
                    <div className="text-sm text-gray-600 font-semibold">प्रेरित</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Library Showcase */}
      <LibraryShowcase />

      {/* Work Areas */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              हमारे कार्य क्षेत्र
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              हम विभिन्न क्षेत्रों में समाज सेवा का कार्य करते हैं
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: "📚",
                title: "शिक्षा",
                description: "गुणवत्तापूर्ण शिक्षा और पुस्तकालय सेवाएं"
              },
              {
                icon: "🏥",
                title: "स्वास्थ्य",
                description: "निःशुल्क स्वास्थ्य जांच और चिकित्सा सेवाएं"
              },
              {
                icon: "🌱",
                title: "पर्यावरण",
                description: "वृक्षारोपण और पर्यावरण संरक्षण कार्यक्रम"
              },
              {
                icon: "❤️",
                title: "सामाजिक सेवा",
                description: "रक्तदान, देहदान और सामुदायिक सेवाएं"
              }
            ].map((area, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-center"
              >
                <div className="text-4xl mb-4">{area.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {area.title}
                </h3>
                <p className="text-gray-600">
                  {area.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <UpcomingEvents />

      {/* Donation CTA */}
      <DonationCTA />

      {/* Gallery Preview */}
      <GalleryPreview />

      {/* Testimonials */}
      <Testimonials />

      {/* Recent Updates */}
      {/* Latest News Section */}
      <LatestNews />

      {/* Final CTA Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              🤝 हमारे साथ जुड़ें
            </h2>
            <p className="text-xl mb-8 opacity-90">
              समाज सेवा के इस महान कार्य में आपका योगदान अमूल्य है। आज ही हमारे साथ जुड़ें और बदलाव का हिस्सा बनें।
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white bg-opacity-20 p-6 rounded-lg">
                <div className="text-3xl mb-2">👥</div>
                <h3 className="font-semibold mb-2">सदस्य बनें</h3>
                <p className="text-sm opacity-90">निःशुल्क सदस्यता और सभी सुविधाओं का लाभ</p>
              </div>
              <div className="bg-white bg-opacity-20 p-6 rounded-lg">
                <div className="text-3xl mb-2">❤️</div>
                <h3 className="font-semibold mb-2">दान करें</h3>
                <p className="text-sm opacity-90">रक्तदान, देहदान या आर्थिक सहायता</p>
              </div>
              <div className="bg-white bg-opacity-20 p-6 rounded-lg">
                <div className="text-3xl mb-2">🎯</div>
                <h3 className="font-semibold mb-2">स्वयंसेवक बनें</h3>
                <p className="text-sm opacity-90">कार्यक्रमों में सक्रिय भागीदारी</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/register"
                className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300"
              >
                अभी पंजीकरण करें
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
  );
}