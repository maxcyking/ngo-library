# एरोज्ञा पुस्तकालय एवं सेवा संस्था - वेबसाइट

यह **एरोज्ञा पुस्तकालय एवं सेवा संस्था** की आधिकारिक वेबसाइट है। यह एक NGO + Library website है जो Next.js 15, React 19, TypeScript, और Tailwind CSS का उपयोग करके बनाई गई है।

## 🌟 मुख्य विशेषताएं

### पब्लिक फ्रंटएंड
- **होम पेज**: Hero slider, news ticker, quick stats, organization intro
- **संस्था का परिचय**: Team members, vision/mission, achievements
- **साहित्य सूची**: 2000+ books catalog with search and filter
- **दान सूची**: Blood donors, body donors, financial donors (भामाशाह)
- **कार्य क्षेत्र**: Projects, achievements, future plans
- **मीडिया गैलरी**: Photos, news, videos
- **संपर्क**: Contact form, bank details, location map

### यूज़र पैनल (भविष्य में)
- Profile management
- Library card and book borrow history
- Blog/article writing
- Donation history
- Event registration

### एडमिन पैनल (भविष्य में)
- Member management
- Book management
- Content management (news, events, blogs)
- Media gallery management
- Donation list updates
- Form submissions management

## 🛠️ तकनीकी स्टैक

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Custom components with shadcn/ui patterns
- **Animations**: Framer Motion
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Fonts**: Mukta और Hind (Hindi), Inter (English)

## 🚀 शुरुआत करें

### आवश्यकताएं
- Node.js 18+ 
- npm या yarn

### इंस्टॉलेशन

```bash
# Repository clone करें
git clone <repository-url>
cd ngo-library

# Dependencies install करें
npm install

# Development server चलाएं
npm run dev
```

[http://localhost:3000](http://localhost:3000) पर जाकर website देखें।

### Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Production server
npm start

# Linting
npm run lint
```

## 📁 प्रोजेक्ट स्ट्रक्चर

```
src/
├── app/                    # Next.js App Router pages
│   ├── (public)/          # Public routes
│   ├── (auth)/            # Authentication routes (future)
│   ├── (user)/            # User panel routes (future)
│   ├── (admin)/           # Admin panel routes (future)
│   └── api/               # API routes (future)
├── components/
│   ├── ui/                # Reusable UI components
│   ├── layout/            # Layout components (Header, Footer)
│   ├── home/              # Home page specific components
│   └── forms/             # Form components (future)
├── lib/
│   ├── constants.ts       # App constants and data
│   ├── types.ts           # TypeScript type definitions
│   └── utils.ts           # Utility functions
└── styles/                # Global styles
```

## 🎨 डिज़ाइन सिस्टम

### कलर पैलेट
- **Primary**: Dark Green (#1B4332) और Golden (#FFD700)
- **Secondary**: Cream (#FFF8DC) और Brown (#8B4513)
- **Status**: Success, Warning, Error, Info colors

### टाइपोग्राफी
- **Hindi**: Mukta (primary), Hind (secondary)
- **English**: Inter
- Responsive font sizes और proper line heights

### कंपोनेंट्स
- Card-based design
- Consistent spacing (8px grid system)
- Hover effects और smooth animations
- Mobile-first responsive design

## 📊 डेटा मॉडल

### मुख्य एंटिटीज
- **User/Member**: सदस्य जानकारी
- **Book**: पुस्तक कैटलॉग
- **Content**: News, Events, Blogs
- **Donation**: रक्तदान, देहदान, आर्थिक दान
- **Media**: Photos और Videos
- **Registration**: विभिन्न प्रकार के आवेदन

## 🔮 भविष्य की योजनाएं

### Phase 2 - User Authentication
- OTP-based login/registration
- User dashboard
- Library book borrowing system
- Event registration

### Phase 3 - Admin Panel
- Complete admin dashboard
- Content management system
- Member management
- Analytics और reports

### Phase 4 - Advanced Features
- Mobile app
- SMS notifications
- Payment gateway integration
- Advanced search और filters

## 🤝 योगदान

इस प्रोजेक्ट में योगदान देने के लिए:

1. Repository को fork करें
2. Feature branch बनाएं (`git checkout -b feature/AmazingFeature`)
3. Changes commit करें (`git commit -m 'Add some AmazingFeature'`)
4. Branch को push करें (`git push origin feature/AmazingFeature`)
5. Pull Request खोलें

## 📞 संपर्क

**एरोज्ञा पुस्तकालय एवं सेवा संस्था**
- **पता**: खसरा नं. 686/600, मालिया की ढाणी, गुडामलानी 344031, बाड़मेर (राजस्थान)
- **फोन**: +91 99518 00733
- **ईमेल**: arogyapustkalaya@gmail.com
- **वेबसाइट**: www.arogyabmr.org

## 📄 लाइसेंस

यह प्रोजेक्ट MIT License के तहत लाइसेंस प्राप्त है।

---

**Made with ❤️ for समाज सेवा**
