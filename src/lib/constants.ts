// App Constants
export const APP_NAME = "एरोज्ञा पुस्तकालय एवं सेवा संस्था";
export const APP_TAGLINE = "पुस्तकालय एवं सेवा संस्था, भारत";
export const APP_SUBTITLE = "सार्वजनिक चैरिटेबल ट्रस्ट";
export const REGISTRATION_NO = "COOP/2020/BARMER/202370";
export const PAN_NO = "AAKTA0718M";

// Navigation Links
export const PUBLIC_NAVIGATION = [
  { href: "/", label: "मुख्य पृष्ठ" },
  { href: "/about", label: "संस्था का परिचय" },
  { href: "/work-areas", label: "कार्य क्षेत्र" },
  { href: "/library", label: "साहित्य सूची" },
  { href: "/events", label: "कार्यक्रम" },
  { href: "/news", label: "समाचार" },
  { href: "/media", label: "मीडिया" },
  { href: "/contact", label: "संपर्क" },
];

// User Navigation
export const USER_NAVIGATION = [
  { href: "/user/dashboard", label: "डैशबोर्ड" },
  { href: "/user/profile", label: "प्रोफाइल" },
  { href: "/user/library-history", label: "पुस्तक इतिहास" },
  { href: "/user/certificates", label: "प्रमाणपत्र" },
  { href: "/user/team", label: "हमारी टीम" },
  { href: "/user/blog", label: "ब्लॉग" },
  { href: "/user/events", label: "कार्यक्रम" },
];

// Admin Navigation
export const ADMIN_NAVIGATION = [
  { href: "/admin/dashboard", label: "एडमिन डैशबोर्ड" },
  { href: "/admin/members", label: "सदस्य प्रबंधन" },
  { href: "/admin/applications", label: "आवेदन प्रबंधन" },
  { href: "/admin/books", label: "पुस्तक प्रबंधन" },
  { href: "/admin/events", label: "कार्यक्रम प्रबंधन" },
  { href: "/admin/donations", label: "दान प्रबंधन" },
  { href: "/admin/news", label: "समाचार प्रबंधन" },
  { href: "/admin/media", label: "मीडिया/गैलरी प्रबंधन" },
  { href: "/admin/testimonials", label: "प्रशंसापत्र प्रबंधन" },
  { href: "/admin/stats", label: "आंकड़े प्रबंधन" },
  { href: "/admin/work-areas", label: "कार्य क्षेत्र प्रबंधन" },
  { href: "/admin/certificates", label: "प्रमाणपत्र प्रबंधन" },
  { href: "/admin/settings", label: "वेबसाइट सेटिंग्स" },
  { href: "/admin/ui", label: "UI प्रबंधन" },
];

// Colors
export const COLORS = {
  primary: {
    green: "#1B4332",
    greenLight: "#2D5A3D",
    greenDark: "#0F2419",
    gold: "#FFD700",
    goldLight: "#FFED4E",
    goldDark: "#B8860B",
  },
  secondary: {
    cream: "#FFF8DC",
    brown: "#8B4513",
  },
  neutral: {
    white: "#FFFFFF",
    light: "#F8F9FA",
    gray: "#6C757D",
    dark: "#212529",
  },
  status: {
    success: "#28A745",
    warning: "#FFC107",
    error: "#DC3545",
    info: "#17A2B8",
  },
};

// Membership Types
export const MEMBERSHIP_TYPES = {
  basic: "सामान्य सदस्यता",
  premium: "प्रीमियम सदस्यता",
  lifetime: "आजीवन सदस्यता",
};

// Donation Types
export const DONATION_TYPES = {
  blood: "रक्तदान",
  body: "देहदान",
  financial: "आर्थिक दान",
};

// Book Categories
export const BOOK_CATEGORIES = [
  "धार्मिक साहित्य",
  "शैक्षणिक पुस्तकें",
  "उपन्यास",
  "कविता संग्रह",
  "इतिहास",
  "विज्ञान",
  "स्वास्थ्य",
  "बाल साहित्य",
  "पत्रिकाएं",
  "अन्य",
];

// Languages
export const LANGUAGES = {
  hindi: "हिन्दी",
  english: "अंग्रेजी",
  other: "अन्य",
};

// Content Types
export const CONTENT_TYPES = {
  news: "समाचार",
  event: "कार्यक्रम",
  blog: "ब्लॉग",
};

// Work Areas
export const WORK_AREAS = [
  {
    title: "शिक्षा",
    description: "गुणवत्तापूर्ण शिक्षा प्रदान करना",
    icon: "📚",
  },
  {
    title: "स्वास्थ्य",
    description: "स्वास्थ्य सेवाएं और जागरूकता",
    icon: "🏥",
  },
  {
    title: "पर्यावरण",
    description: "पर्यावरण संरक्षण और वृक्षारोपण",
    icon: "🌱",
  },
  {
    title: "चिकित्सा",
    description: "निःशुल्क चिकित्सा सेवाएं",
    icon: "⚕️",
  },
];

// Social Media Links
export const SOCIAL_LINKS = {
  facebook: "#",
  twitter: "#",
  instagram: "#",
  youtube: "#",
  whatsapp: "#",
};

// Contact Information
export const CONTACT_INFO = {
  address: "रजि. ऑफिस - एरोज्ञा पुस्तकालय एवं सेवा संस्था, खसरा नं. 686/600, मालिया की ढाणी, आर जी टी सर्किल, नगर, गुडामलानी 344031, जिला - बाड़मेर (राजस्थान)",
  phone: "+91 9024635808",
  email: "arogyapustkalaya@gmail.com",
  timings: "सुबह 9:00 से शाम 6:00 तक",
  website: "www.arogyabmr.org",
  facebook: "एरोज्ञा www.arogyabmr.org",
};
// Team Members
export const TEAM_MEMBERS = {
  founders: [
    {
      name: "मती मीना देवी धर्मपत्नी  अमराराम बोस",
      position: "मुख्य संरक्षक",
      phone: "+91 9024635808",
      image: "/team/meena-devi.jpg"
    }
  ],
  executives: [
    {
      name: " अमराराम बोस",
      position: "अध्यक्ष",
      phone: "+91 9024635808",
      image: "/team/atmaram-bora.jpg"
    },
    {
      name: " कालुराम माली",
      position: "उपाध्यक्ष",
      phone: "+91 99288 00933",
      image: "/team/baburam-sharma.jpg"
    }
  ],
  patrons: [
    {
      name: "महेश कुमार जी महाराज",
      position: "संरक्षक",
      location: "पाली मारवाड़"
    },
    {
      name: "महेश उपमन्यु जी महाराज",
      position: "संरक्षक", 
      location: "चौहान साब हिम्मतनगर"
    },
    {
      name: "महेश प्रणामी जी महाराज",
      position: "संरक्षक",
      location: "जैतपुर जयपुर"
    },
    {
      name: " डॉ. विजयपाल चन्द्र 'गौरव'",
      position: "संरक्षक",
      location: "बीकानेर, बाड़मेर"
    }
  ]
};

// Bank Details
export const BANK_DETAILS = {
  primary: {
    bankName: "Punjab National Bank, Gudamalani",
    accountName: "एरोज्ञा पुस्तकालय एवं सेवा संस्था",
    savingAccount: "9657001000035037",
    currentAccount: "9657002100003780", 
    ifscCode: "PUNB0965700"
  }
};

// Key Achievements & Statistics
export const ACHIEVEMENTS = {
  establishedYear: "2020",
  totalMembers: "500+",
  booksInLibrary: "2000+",
  bloodDonors: "150+",
  eventsOrganized: "50+",
  studentsHelped: "1000+",
  healthCampsOrganized: "25+",
  treesPlanted: "5000+"
};

// Major Activities
export const MAJOR_ACTIVITIES = [
  {
    title: "शिक्षा सहायता",
    description: "निःशुल्क शिक्षा सामग्री वितरण, छात्रवृत्ति प्रदान",
    icon: "📚"
  },
  {
    title: "स्वास्थ्य सेवा",
    description: "निःशुल्क स्वास्थ्य जांच शिविर, दवा वितरण",
    icon: "🏥"
  },
  {
    title: "रक्तदान शिविर",
    description: "नियमित रक्तदान शिविर का आयोजन",
    icon: "🩸"
  },
  {
    title: "पुस्तकालय सेवा",
    description: "निःशुल्क पुस्तकालय सुविधा",
    icon: "📖"
  },
  {
    title: "महिला सशक्तिकरण",
    description: "महिलाओं के लिए कौशल विकास कार्यक्रम",
    icon: "👩‍💼"
  },
  {
    title: "पर्यावरण संरक्षण",
    description: "वृक्षारोपण और पर्यावरण जागरूकता",
    icon: "🌱"
  }
];

// Recent News & Events
export const RECENT_ACTIVITIES = [
  {
    title: "पुस्तकालय भवन निर्माण कार्य",
    date: "जून 2024",
    description: "35 लाख रुपए की लागत से नया पुस्तकालय भवन निर्माण कार्य प्रगति पर है।",
    image: "/activities/library-construction.jpg"
  },
  {
    title: "मान मिलाप समारोह",
    date: "अगस्त 2022",
    description: "द्वितीय वार्षिकोत्सव पर सामाजिक कार्यकर्ताओं का सम्मान।",
    image: "/activities/maan-milap.jpg"
  },
  {
    title: "रक्तदान शिविर",
    date: "जुलाई 2022", 
    description: "50+ रक्तदाताओं ने रक्तदान कर जीवन दान का पुण्य कार्य किया।",
    image: "/activities/blood-donation.jpg"
  }
];

// Vision & Mission
export const VISION_MISSION = {
  vision: "समाज के सभी वर्गों के लिए शिक्षा, स्वास्थ्य और सामाजिक सेवाओं का निःशुल्क प्रावधान करना।",
  mission: [
    "गुणवत्तापूर्ण शिक्षा का प्रसार",
    "स्वास्थ्य सेवाओं की उपलब्धता",
    "पुस्तकालय सेवाओं का विस्तार", 
    "रक्तदान और देहदान की जागरूकता",
    "महिला सशक्तिकरण",
    "पर्यावरण संरक्षण"
  ],
  objectives: [
    "निःशुल्क पुस्तकालय सेवा प्रदान करना",
    "शिक्षा के क्षेत्र में सहायता प्रदान करना",
    "स्वास्थ्य जागरूकता फैलाना",
    "रक्तदान शिविर का आयोजन",
    "सामाजिक कुरीतियों का उन्मूलन",
    "महिला एवं बाल कल्याण"
  ]
};