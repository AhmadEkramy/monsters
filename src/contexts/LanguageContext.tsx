import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navigation
    home: 'Home',
    ourTeam: 'Our Team',
    events: 'Events',
    competitions: 'Competitions',
    trips: 'Trips',
    contact: 'Contact',
    
    // Hero Section
    heroTitle: 'Welcome to Monsters Team',
    heroSubtitle: 'Mansoura National University',
    heroDescription: 'We are a dynamic team of innovators, creators, and problem-solvers dedicated to excellence in technology, competition, and community. Join us in our journey to achieve greatness and make a lasting impact.',
    joinNow: 'Join Monsters Now',
    
    // About
    aboutUs: 'About Us',
    ourVision: 'Our Vision',
    visionText: 'To be the leading university team fostering innovation, excellence, and collaboration.',
    
    // Join Us
    becomeMonster: 'Become a Monster!',
    joinDescription: 'Ready to join an amazing team? Be part of something extraordinary.',
    joinButton: 'Apply Now',
    
    // Team
    teamTitle: 'Meet Our Team',
    teamDescription: 'The talented individuals behind Monsters',
    
    // Events
    eventsTitle: 'Our Events',
    eventsDescription: 'Exciting activities and workshops we organize',
    upcomingEvents: 'Upcoming Events',
    pastEvents: 'Past Events',
    
    // Competitions
    competitionsTitle: 'Competitions & Achievements',
    competitionsDescription: 'Our journey in various competitions',
    achievements: 'Achievements',
    
    // Trips
    tripsTitle: 'Team Trips',
    tripsDescription: 'Memorable adventures and outings',
    
    // Contact
    contactTitle: 'Get In Touch',
    contactDescription: 'Have questions? We\'d love to hear from you',
    name: 'Name',
    email: 'Email',
    message: 'Message',
    send: 'Send Message',
    location: 'Location',
    locationText: 'Mansoura National University',
    followUs: 'Follow Us',
  },
  ar: {
    // Navigation
    home: 'الصفحة الرئيسية',
    ourTeam: 'فريقنا',
    events: 'الفعاليات',
    competitions: 'المسابقات',
    trips: 'الرحلات',
    contact: 'تواصل معنا',
    
    // Hero Section
    heroTitle: 'مرحباً بكم في فريق مونسترز',
    heroSubtitle: 'جامعة المنصورة الأهلية',
    heroDescription: 'نحن فريق ديناميكي من المبتكرين والمبدعين وحلالي المشكلات المكرسين للتميز في التكنولوجيا والمنافسة والمجتمع. انضم إلينا في رحلتنا لتحقيق العظمة وإحداث تأثير دائم.',
    joinNow: 'انضم الآن',
    
    // About
    aboutUs: 'من نحن',
    ourVision: 'رؤيتنا',
    visionText: 'أن نكون الفريق الجامعي الرائد في تعزيز الابتكار والتميز والتعاون.',
    
    // Join Us
    becomeMonster: 'كن واحداً من مونسترز!',
    joinDescription: 'مستعد للانضمام إلى فريق رائع؟ كن جزءاً من شيء استثنائي.',
    joinButton: 'قدم الآن',
    
    // Team
    teamTitle: 'تعرف على فريقنا',
    teamDescription: 'الأفراد الموهوبون وراء مونسترز',
    
    // Events
    eventsTitle: 'فعالياتنا',
    eventsDescription: 'الأنشطة وورش العمل المثيرة التي ننظمها',
    upcomingEvents: 'الفعاليات القادمة',
    pastEvents: 'الفعاليات السابقة',
    
    // Competitions
    competitionsTitle: 'المسابقات والإنجازات',
    competitionsDescription: 'رحلتنا في مختلف المسابقات',
    achievements: 'الإنجازات',
    
    // Trips
    tripsTitle: 'رحلات الفريق',
    tripsDescription: 'مغامرات ونزهات لا تُنسى',
    
    // Contact
    contactTitle: 'تواصل معنا',
    contactDescription: 'هل لديك أسئلة؟ نحب أن نسمع منك',
    name: 'الاسم',
    email: 'البريد الإلكتروني',
    message: 'الرسالة',
    send: 'إرسال',
    location: 'الموقع',
    locationText: 'جامعة المنصورة الأهلية',
    followUs: 'تابعنا',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const stored = localStorage.getItem('language');
    return (stored as Language) || 'en';
  });

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'ar' : 'en';
    setLanguage(newLang);
    localStorage.setItem('language', newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
