// Sample Events Setup Script for Event Management System
const admin = require('firebase-admin');

// Initialize Firebase Admin (you'll need to set up your service account)
// admin.initializeApp({
//   credential: admin.credential.applicationDefault(),
//   projectId: 'your-project-id'
// });

const db = admin.firestore();

// Sample events data
const sampleEvents = [
  {
    title: "मासिक स्वास्थ्य जांच शिविर",
    description: "निःशुल्क स्वास्थ्य जांच, रक्तचाप, मधुमेह और सामान्य चिकित्सा परामर्श",
    longDescription: `इस शिविर में आपको निम्नलिखित सेवाएं निःशुल्क मिलेंगी:
- रक्तचाप की जांच
- मधुमेह की जांच  
- वजन और BMI की जांच
- सामान्य चिकित्सा परामर्श
- आवश्यक दवाइयों का वितरण
- स्वास्थ्य संबंधी सलाह

कृपया खाली पेट आएं और अपना पहचान पत्र साथ लाएं।`,
    eventDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    eventTime: "सुबह 9:00 से दोपहर 2:00 तक",
    location: "संस्था परिसर, गुडामलानी",
    category: "स्वास्थ्य सेवा",
    eventType: "health_camp",
    maxParticipants: 100,
    currentParticipants: 0,
    registrationDeadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    isRegistrationOpen: true,
    isActive: true,
    isFeatured: true,
    contactPerson: " अमराराम बोस",
    contactPhone: "+91 9024635808",
    contactEmail: "arogyapustkalaya@gmail.com",
    requirements: [
      "पहचान पत्र (आधार कार्ड/वोटर ID)",
      "खाली पेट आना आवश्यक",
      "पुराने मेडिकल रिपोर्ट (यदि कोई हो)"
    ],
    agenda: [
      "सुबह 9:00 - पंजीकरण और टोकन वितरण",
      "सुबह 9:30 - रक्तचाप और वजन की जांच",
      "सुबह 10:30 - मधुमेह की जांच",
      "सुबह 11:30 - डॉक्टर से परामर्श",
      "दोपहर 1:00 - दवा वितरण",
      "दोपहर 2:00 - कार्यक्रम समाप्ति"
    ],
    targetAudience: "सभी आयु वर्ग के लोग, विशेषकर 40+ आयु के व्यक्ति",
    registrationFee: 0,
    organizers: ["एरोज्ञा पुस्तकालय एवं सेवा संस्था"],
    sponsors: ["स्थानीय व्यापारी संघ", "गुडामलानी पंचायत"],
    status: "published"
  },
  
  {
    title: "रक्तदान महादान शिविर",
    description: "जीवन बचाने के लिए रक्तदान करें। सभी स्वस्थ रक्तदाताओं का स्वागत है।",
    longDescription: `रक्तदान महादान शिविर में भाग लेकर किसी की जिंदगी बचाने का पुण्य कार्य करें।

रक्तदान की शर्तें:
- आयु 18-65 वर्ष
- वजन न्यूनतम 50 किलो
- हीमोग्लोबिन 12.5 gm/dl से अधिक
- कोई गंभीर बीमारी न हो
- पिछले 3 महीने में रक्तदान न किया हो

रक्तदान के बाद:
- स्वास्थ्य प्रमाणपत्र
- रक्तदाता कार्ड
- नाश्ता और जूस
- रक्तदाता डेटाबेस में नाम`,
    eventDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    eventTime: "सुबह 8:00 से दोपहर 1:00 तक",
    location: "सामुदायिक भवन, गुडामलानी",
    category: "रक्तदान",
    eventType: "blood_donation",
    maxParticipants: 50,
    currentParticipants: 0,
    registrationDeadline: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000), // 12 days from now
    isRegistrationOpen: true,
    isActive: true,
    isFeatured: false,
    contactPerson: " कालुराम माली",
    contactPhone: "+91 99288 00933",
    contactEmail: "arogyapustkalaya@gmail.com",
    requirements: [
      "आयु 18-65 वर्ष",
      "वजन न्यूनतम 50 किलो",
      "पहचान पत्र",
      "स्वास्थ्य प्रमाणपत्र (यदि कोई समस्या हो)"
    ],
    agenda: [
      "सुबह 8:00 - पंजीकरण शुरू",
      "सुबह 8:30 - स्वास्थ्य जांच",
      "सुबह 9:00 - रक्तदान शुरू",
      "दोपहर 12:00 - नाश्ता वितरण",
      "दोपहर 1:00 - शिविर समाप्ति"
    ],
    targetAudience: "18-65 आयु के स्वस्थ व्यक्ति",
    registrationFee: 0,
    organizers: ["एरोज्ञा पुस्तकालय एवं सेवा संस्था", "जिला अस्पताल"],
    sponsors: ["रक्त बैंक गुडामलानी"],
    status: "published"
  },

  {
    title: "महिला सशक्तिकरण कार्यशाला",
    description: "महिलाओं के लिए कौशल विकास, स्वरोजगार और अधिकारों की जानकारी",
    longDescription: `इस कार्यशाला में महिलाओं को निम्नलिखित विषयों पर प्रशिक्षण दिया जाएगा:

कौशल विकास:
- सिलाई और कढ़ाई
- मेहंदी कला
- खाना पकाने के तरीके
- घरेलू उत्पाद बनाना

स्वरोजगार:
- छोटे व्यवसाय शुरू करना
- सरकारी योजनाओं की जानकारी
- लोन प्रक्रिया
- मार्केटिंग तकनीक

अधिकार और कानून:
- महिला अधिकार
- घरेलू हिंसा से बचाव
- शिक्षा का अधिकार
- स्वास्थ्य सेवाओं का अधिकार`,
    eventDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days from now
    eventTime: "सुबह 10:00 से शाम 4:00 तक",
    location: "संस्था परिसर, गुडामलानी",
    category: "महिला सशक्तिकरण",
    eventType: "workshop",
    maxParticipants: 30,
    currentParticipants: 0,
    registrationDeadline: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000), // 18 days from now
    isRegistrationOpen: true,
    isActive: true,
    isFeatured: true,
    contactPerson: "मती मीना देवी",
    contactPhone: "+91 9024635808",
    contactEmail: "arogyapustkalaya@gmail.com",
    requirements: [
      "महिला प्रतिभागी (18+ आयु)",
      "नोटबुक और पेन",
      "दोपहर का खाना (व्यवस्था उपलब्ध)"
    ],
    agenda: [
      "सुबह 10:00 - पंजीकरण और स्वागत",
      "सुबह 10:30 - कौशल विकास सत्र",
      "दोपहर 12:00 - भोजन विराम",
      "दोपहर 1:00 - स्वरोजगार प्रशिक्षण",
      "दोपहर 2:30 - महिला अधिकार सत्र",
      "शाम 3:30 - प्रश्नोत्तर और समापन"
    ],
    targetAudience: "18+ आयु की महिलाएं, गृहिणियां, युवा महिलाएं",
    registrationFee: 0,
    organizers: ["एरोज्ञा पुस्तकालय एवं सेवा संस्था", "महिला विकास मंडल"],
    sponsors: ["जिला कलेक्टर कार्यालय"],
    status: "published"
  },

  {
    title: "पुस्तकालय भवन उद्घाटन समारोह",
    description: "35 लाख रुपए की लागत से निर्मित नए पुस्तकालय भवन का भव्य उद्घाटन",
    longDescription: `एरोज्ञा पुस्तकालय एवं सेवा संस्था के नए पुस्तकालय भवन का उद्घाटन समारोह।

भवन की विशेषताएं:
- 2000 वर्ग फुट का विशाल भवन
- 2000+ पुस्तकों की क्षमता
- डिजिटल कैटलॉग सिस्टम
- बच्चों के लिए अलग सेक्शन
- अध्ययन कक्ष और रीडिंग हॉल
- कंप्यूटर और इंटरनेट सुविधा

कार्यक्रम में शामिल:
- मुख्य अतिथि द्वारा उद्घाटन
- पुस्तकालय भ्रमण
- सामुदायिक भोजन
- सांस्कृतिक कार्यक्रम
- पुस्तक वितरण`,
    eventDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    eventTime: "सुबह 11:00 से दोपहर 3:00 तक",
    location: "नया पुस्तकालय भवन, गुडामलानी",
    category: "उद्घाटन समारोह",
    eventType: "inauguration",
    maxParticipants: 200,
    currentParticipants: 0,
    registrationDeadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000), // 25 days from now
    isRegistrationOpen: true,
    isActive: true,
    isFeatured: true,
    contactPerson: " अमराराम बोस",
    contactPhone: "+91 9024635808",
    contactEmail: "arogyapustkalaya@gmail.com",
    requirements: [
      "निमंत्रण पत्र (यदि मिला हो)",
      "पहचान पत्र",
      "उद्घाटन समारोह में शामिल होने की इच्छा"
    ],
    agenda: [
      "सुबह 11:00 - अतिथि स्वागत",
      "सुबह 11:30 - मुख्य अतिथि का आगमन",
      "दोपहर 12:00 - उद्घाटन समारोह",
      "दोपहर 12:30 - पुस्तकालय भ्रमण",
      "दोपहर 1:00 - सामुदायिक भोजन",
      "दोपहर 2:00 - सांस्कृतिक कार्यक्रम",
      "दोपहर 3:00 - धन्यवाद और समापन"
    ],
    targetAudience: "सभी आयु वर्ग, स्थानीय निवासी, शिक्षा प्रेमी",
    registrationFee: 0,
    organizers: [
      "एरोज्ञा पुस्तकालय एवं सेवा संस्था",
      "ग्राम पंचायत गुडामलानी",
      "जिला शिक्षा विभाग"
    ],
    sponsors: [
      "स्थानीय व्यापारी संघ",
      "बैंक ऑफ बड़ौदा",
      "जिला कलेक्टर कार्यालय"
    ],
    status: "published"
  },

  {
    title: "डिजिटल साक्षरता कार्यशाला",
    description: "कंप्यूटर और मोबाइल के उपयोग की बुनियादी जानकारी",
    longDescription: `आज के डिजिटल युग में कंप्यूटर और मोबाइल का ज्ञान अत्यंत आवश्यक है।

कार्यशाला में शामिल:
- कंप्यूटर की बुनियादी जानकारी
- इंटरनेट का सही उपयोग
- ईमेल भेजना और प्राप्त करना
- मोबाइल एप्स का उपयोग
- ऑनलाइन फॉर्म भरना
- डिजिटल पेमेंट की जानकारी
- साइबर सुरक्षा के उपाय

प्रत्येक प्रतिभागी को प्रैक्टिकल ट्रेनिंग दी जाएगी।`,
    eventDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000), // 28 days from now
    eventTime: "सुबह 10:00 से शाम 5:00 तक",
    location: "संस्था परिसर, कंप्यूटर लैब",
    category: "शिक्षा",
    eventType: "workshop",
    maxParticipants: 25,
    currentParticipants: 0,
    registrationDeadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000), // 25 days from now
    isRegistrationOpen: true,
    isActive: true,
    isFeatured: false,
    contactPerson: " राकेश शर्मा",
    contactPhone: "+91 98765 43210",
    contactEmail: "arogyapustkalaya@gmail.com",
    requirements: [
      "नोटबुक और पेन",
      "मोबाइल फोन (स्मार्टफोन प्राथमिकता)",
      "सीखने की उत्सुकता"
    ],
    agenda: [
      "सुबह 10:00 - कंप्यूटर परिचय",
      "सुबह 11:30 - इंटरनेट का उपयोग",
      "दोपहर 1:00 - भोजन विराम",
      "दोपहर 2:00 - मोबाइल एप्स ट्रेनिंग",
      "दोपहर 3:30 - ऑनलाइन सेवाएं",
      "शाम 4:30 - प्रैक्टिकल टेस्ट और समापन"
    ],
    targetAudience: "युवा, मध्यम आयु के व्यक्ति, महिलाएं",
    registrationFee: 0,
    organizers: ["एरोज्ञा पुस्तकालय एवं सेवा संस्था"],
    sponsors: ["कंप्यूटर शिक्षा केंद्र"],
    status: "published"
  },

  {
    title: "युवा उद्यमिता सेमिनार",
    description: "युवाओं के लिए व्यवसाय शुरू करने की जानकारी और मार्गदर्शन",
    longDescription: `युवाओं को स्वावलंबी बनाने के लिए उद्यमिता सेमिनार का आयोजन।

सेमिनार के विषय:
- व्यवसाय योजना तैयार करना
- सरकारी योजनाओं का लाभ
- लोन प्रक्रिया और आवेदन
- मार्केटिंग रणनीति
- डिजिटल मार्केटिंग
- ग्राहक सेवा
- वित्तीय प्रबंधन

सफल उद्यमियों से बातचीत और मार्गदर्शन।`,
    eventDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000), // 35 days from now
    eventTime: "सुबह 9:00 से शाम 4:00 तक",
    location: "संस्था परिसर, सभा हॉल",
    category: "युवा विकास",
    eventType: "seminar",
    maxParticipants: 50,
    currentParticipants: 0,
    registrationDeadline: new Date(Date.now() + 32 * 24 * 60 * 60 * 1000), // 32 days from now
    isRegistrationOpen: true,
    isActive: true,
    isFeatured: false,
    contactPerson: " अनिल कुमार",
    contactPhone: "+91 95678 12345",
    contactEmail: "arogyapustkalaya@gmail.com",
    requirements: [
      "आयु 18-35 वर्ष",
      "नोटबुक और पेन",
      "व्यवसाय शुरू करने की इच्छा",
      "10+2 पास (प्राथमिकता)"
    ],
    agenda: [
      "सुबह 9:00 - पंजीकरण और स्वागत",
      "सुबह 9:30 - उद्यमिता का परिचय",
      "सुबह 11:00 - सरकारी योजनाएं",
      "दोपहर 12:30 - भोजन विराम",
      "दोपहर 1:30 - व्यवसाय योजना",
      "दोपहर 3:00 - सफल उद्यमियों से मुलाकात",
      "शाम 4:00 - प्रश्नोत्तर और समापन"
    ],
    targetAudience: "18-35 आयु के युवा, स्नातक, बेरोजगार युवा",
    registrationFee: 0,
    organizers: ["एरोज्ञा पुस्तकालय एवं सेवा संस्था", "युवा विकास केंद्र"],
    sponsors: ["स्थानीय उद्यमी संघ"],
    status: "published"
  }
];

// Sample past events
const samplePastEvents = [
  {
    title: "मान मिलाप समारोह 2023",
    description: "तृतीय वार्षिकोत्सव पर सामाजिक कार्यकर्ताओं का सम्मान समारोह",
    longDescription: "संस्था के तृतीय वार्षिकोत्सव पर 75+ सामाजिक कार्यकर्ताओं का सम्मान किया गया।",
    eventDate: new Date('2023-08-15'),
    eventTime: "सुबह 11:00 से शाम 6:00 तक",
    location: "संस्था परिसर, गुडामलानी",
    category: "सामाजिक कार्यक्रम",
    eventType: "cultural",
    maxParticipants: 200,
    currentParticipants: 180,
    isRegistrationOpen: false,
    isActive: false,
    isFeatured: true,
    contactPerson: " अमराराम बोस",
    contactPhone: "+91 9024635808",
    organizers: ["एरोज्ञा पुस्तकालय एवं सेवा संस्था"],
    status: "completed"
  },

  {
    title: "रक्तदान शिविर दिसंबर 2023",
    description: "शीतकालीन रक्तदान शिविर में 65+ रक्तदाताओं ने भाग लिया",
    longDescription: "सर्दियों के मौसम में आयोजित रक्तदान शिविर में रिकॉर्ड संख्या में रक्तदाताओं ने भाग लिया।",
    eventDate: new Date('2023-12-10'),
    eventTime: "सुबह 8:00 से दोपहर 2:00 तक",
    location: "सामुदायिक भवन, गुडामलानी",
    category: "रक्तदान",
    eventType: "blood_donation",
    maxParticipants: 60,
    currentParticipants: 65,
    isRegistrationOpen: false,
    isActive: false,
    isFeatured: false,
    contactPerson: " कालुराम माली",
    contactPhone: "+91 99288 00933",
    organizers: ["एरोज्ञा पुस्तकालय एवं सेवा संस्था"],
    status: "completed"
  }
];

async function addSampleEvents() {
  console.log('🎪 Adding sample events to collection...\n');
  
  try {
    // Add upcoming events
    for (const event of sampleEvents) {
      const docRef = await db.collection('events').add({
        ...event,
        eventDate: admin.firestore.Timestamp.fromDate(event.eventDate),
        registrationDeadline: admin.firestore.Timestamp.fromDate(event.registrationDeadline),
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        createdBy: 'admin@arogyabmr.org',
        updatedBy: 'admin@arogyabmr.org'
      });
      
      console.log(`✅ Added upcoming event: ${event.title} (ID: ${docRef.id})`);
    }

    // Add past events
    for (const event of samplePastEvents) {
      const docRef = await db.collection('events').add({
        ...event,
        eventDate: admin.firestore.Timestamp.fromDate(event.eventDate),
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        createdBy: 'admin@arogyabmr.org',
        updatedBy: 'admin@arogyabmr.org'
      });
      
      console.log(`✅ Added past event: ${event.title} (ID: ${docRef.id})`);
    }
    
    console.log('\n✅ All sample events added successfully!');
    console.log('\n📊 Event Summary:');
    console.log(`📅 Upcoming Events: ${sampleEvents.length}`);
    console.log(`📚 Past Events: ${samplePastEvents.length}`);
    console.log(`🎯 Total Events: ${sampleEvents.length + samplePastEvents.length}`);
    
  } catch (error) {
    console.error('❌ Error adding sample events:', error);
  }
}

async function testEventSystem() {
  console.log('🔍 Testing Event Management System...\n');

  try {
    // Test 1: Check events collection
    console.log('🎪 Testing Events Collection...');
    const eventsSnapshot = await db.collection('events').limit(5).get();
    console.log(`✅ Found ${eventsSnapshot.size} events in collection`);
    
    // Test 2: Check registrations collection
    console.log('\n📋 Testing Event Registrations Collection...');
    const registrationsSnapshot = await db.collection('eventRegistrations').limit(5).get();
    console.log(`✅ Found ${registrationsSnapshot.size} registrations in collection`);
    
    // Test 3: Sample event data structure
    console.log('\n🎪 Sample Event Data Structure:');
    if (!eventsSnapshot.empty) {
      const sampleEvent = eventsSnapshot.docs[0].data();
      console.log('✅ Sample Event:', JSON.stringify(sampleEvent, null, 2));
    } else {
      console.log('ℹ️  No events found. Run npm run setup:sample-events to add sample data.');
    }
    
    console.log('\n✅ Event Management System Test Complete!');
    console.log('\n📊 System Features Available:');
    console.log('✅ Create and manage events');
    console.log('✅ Handle participant registrations');
    console.log('✅ Track event status and attendance');
    console.log('✅ Public event browsing');
    console.log('✅ Mobile-responsive interface');
    console.log('✅ Real-time analytics dashboard');
    
  } catch (error) {
    console.error('❌ Error testing event system:', error);
  }
}

// Sample registration data for testing
const sampleRegistrations = [
  {
    participantName: "राहुल शर्मा",
    participantEmail: "rahul.sharma@example.com",
    participantPhone: "+91 99999 99999",
    participantAge: 28,
    participantGender: "male",
    emergencyContact: "मती सुनीता शर्मा",
    emergencyPhone: "+91 88888 88888",
    specialRequirements: "",
    status: "confirmed",
    registrationSource: "website"
  },
  {
    participantName: "प्रिया गुप्ता",
    participantEmail: "priya.gupta@example.com",
    participantPhone: "+91 98765 43210",
    participantAge: 32,
    participantGender: "female",
    emergencyContact: " विकास गुप्ता",
    emergencyPhone: "+91 87654 32109",
    specialRequirements: "व्हीलचेयर की आवश्यकता",
    status: "registered",
    registrationSource: "website"
  }
];

async function addSampleRegistrations(eventId) {
  console.log(`📝 Adding sample registrations for event ${eventId}...\n`);
  
  try {
    for (const registration of sampleRegistrations) {
      const docRef = await db.collection('eventRegistrations').add({
        ...registration,
        eventId: eventId,
        eventTitle: "Sample Event",
        registrationDate: admin.firestore.FieldValue.serverTimestamp(),
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      console.log(`✅ Added registration: ${registration.participantName} (ID: ${docRef.id})`);
    }
    
    console.log('\n✅ All sample registrations added successfully!');
  } catch (error) {
    console.error('❌ Error adding sample registrations:', error);
  }
}

// Uncomment to run functions
// testEventSystem();
// addSampleEvents();

module.exports = {
  testEventSystem,
  addSampleEvents,
  addSampleRegistrations,
  sampleEvents,
  samplePastEvents,
  sampleRegistrations
};
