"use client";

import { HeroSlider } from "@/components/home/hero-slider";
import { NewsTicker } from "@/components/home/news-ticker";
import { QuickStats } from "@/components/home/quick-stats";
import { Testimonials } from "@/components/home/testimonials";
import { GalleryPreview } from "@/components/home/gallery-preview";
import { DonationCTA } from "@/components/home/donation-cta";
import { UpcomingEvents } from "@/components/home/upcoming-events";
import { LibraryShowcase } from "@/components/home/library-showcase";

// Sample data - यह बाद में database से आएगा
const heroSlides = [
  {
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    title: "एरोग्या पुस्तकालय एवं सेवा संस्था में आपका स्वागत है",
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
    description: "35 लाख रुपए की लागत से आधुनिक पुस्तकालय भवन का निर्माण",
    ctaText: "प्रगति देखें",
    ctaLink: "/projects",
  },
];

const newsItems = [
  {
    id: "1",
    title: "पुस्तकालय भवन निर्माण कार्य जून 2024 तक पूर्ण होने की संभावना",
    link: "/media/news/library-construction-update",
  },
  {
    id: "2",
    title: "मासिक रक्तदान शिविर का आयोजन - रक्तदाताओं से अपील",
    link: "/media/news/monthly-blood-donation-camp",
  },
  {
    id: "3",
    title: "निःशुल्क स्वास्थ्य जांच शिविर का सफल आयोजन - 200+ लाभार्थी",
    link: "/media/news/health-camp-success",
  },
  {
    id: "4",
    title: "महिला सशक्तिकरण कार्यक्रम के तहत कौशल विकास प्रशिक्षण",
    link: "/media/news/women-empowerment-program",
  },
];


export default function Home() {
  return (
    <div itemScope itemType="https://schema.org/NGO">
      {/* Hero Slider */}
      <HeroSlider slides={heroSlides} />

      {/* News Ticker */}
      <NewsTicker news={newsItems} />

      {/* Quick Stats */}
      <QuickStats />

      {/* Organization Introduction */}
      <section className="py-16 bg-white" itemScope itemType="https://schema.org/AboutPage">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6" itemProp="name">
                एरोग्या पुस्तकालय एवं सेवा संस्था का परिचय
              </h1>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed" itemProp="description">
                एरोग्या पुस्तकालय एवं सेवा संस्था एक सार्वजनिक चैरिटेबल ट्रस्ट है जो <time itemProp="foundingDate" dateTime="2020">2020</time> से
                <span itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
                  <span itemProp="addressRegion">राजस्थान</span> के <span itemProp="addressLocality">बाड़मेर</span> जिले
                </span> में समाज सेवा के क्षेत्र में निरंतर कार्यरत है। हमारा
                मुख्य उद्देश्य शिक्षा, स्वास्थ्य, पुस्तकालय सेवा और सामाजिक कल्याण के माध्यम
                से समाज के उत्थान में योगदान देना है।
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                हमारी संस्था में एक समृद्ध पुस्तकालय है जिसमें धार्मिक, शैक्षणिक, साहित्यिक
                और तकनीकी विषयों की <strong>2000 से अधिक पुस्तकें</strong> उपलब्ध हैं। यह पुस्तकालय सभी आयु वर्ग
                के लोगों के लिए <strong>निःशुल्क</strong> उपलब्ध है। वर्तमान में <strong>35 लाख रुपए</strong> की लागत से नया
                आधुनिक पुस्तकालय भवन निर्माणाधीन है।
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="/about"
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300 text-center"
                >
                  विस्तार से पढ़ें
                </a>
                <a
                  href="/register"
                  className="border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300 text-center"
                >
                  सदस्यता लें
                </a>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1497486751825-1233686d5d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                alt="संस्था की तस्वीर"
                className="rounded-lg shadow-lg w-full h-auto"
              />
              <div className="absolute -bottom-6 -right-6 bg-green-600 text-white p-6 rounded-lg shadow-lg">
                <div className="text-2xl font-bold">4+</div>
                <div className="text-sm">वर्षों का अनुभव</div>
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
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              📰 हाल की गतिविधियां
            </h2>
            <p className="text-lg text-gray-600">
              हमारे नवीनतम कार्यक्रम और उपलब्धियां
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
                title: "पुस्तकालय भवन निर्माण कार्य",
                date: "जून 2024",
                description: "35 लाख रुपए की लागत से नया पुस्तकालय भवन निर्माण प्रगति पर",
                link: "/news"
              },
              {
                image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
                title: "मान मिलाप समारोह 2022",
                date: "अगस्त 2022",
                description: "द्वितीय वार्षिकोत्सव पर सामाजिक कार्यकर्ताओं का सम्मान",
                link: "/media"
              },
              {
                image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
                title: "रक्तदान शिविर का आयोजन",
                date: "जुलाई 2022",
                description: "50+ रक्तदाताओं ने रक्तदान कर जीवन दान का पुण्य कार्य किया",
                link: "/events"
              }
            ].map((update, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 group"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={update.image}
                    alt={update.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
                </div>
                <div className="p-6">
                  <div className="text-sm text-green-600 font-semibold mb-2">
                    {update.date}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-green-600 transition-colors duration-300">
                    {update.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {update.description}
                  </p>
                  <a
                    href={update.link}
                    className="text-green-600 hover:text-green-700 font-medium text-sm inline-flex items-center"
                  >
                    विस्तार से पढ़ें
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <a
              href="/news"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-300 inline-flex items-center"
            >
              सभी समाचार देखें
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </section>

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