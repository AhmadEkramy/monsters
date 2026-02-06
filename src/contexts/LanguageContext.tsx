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

    // Committees
    committees: 'Committees',
    committeesTitle: 'Our Committees',
    committeesDescription: 'Discover the dedicated teams that drive our organization forward',
    keyResponsibilities: 'Key Responsibilities',

    // HR Committee
    hrCommittee: 'HR Committee',
    hrDescription: 'The HR Committee manages member relations, recruitment, and internal communication to ensure a positive and collaborative environment.',
    hrResp1: 'Member recruitment',
    hrResp2: 'Team building',
    hrResp3: 'Internal communication',
    hrResp4: 'Conflict resolution',

    // PR Committee
    prCommittee: 'PR Committee',
    prDescription: 'The PR Committee represents the organization\'s public image and manages communication with partners and the community.',
    prResp1: 'Public relations',
    prResp2: 'Branding',
    prResp3: 'Partnerships',
    prResp4: 'External communication',

    // Creativity Committee
    creativityCommittee: 'Creativity Committee',
    creativityDescription: 'The Creativity Committee generates innovative ideas and visual concepts that bring the organization\'s vision to life.',
    creativityResp1: 'Idea generation',
    creativityResp2: 'Design concepts',
    creativityResp3: 'Visual identity',
    creativityResp4: 'Innovation',

    // Organization Committee
    organizationCommittee: 'Organization Committee',
    organizationDescription: 'The Organization Committee ensures smooth planning and execution of events and internal processes.',
    organizationResp1: 'Event planning',
    organizationResp2: 'Scheduling',
    organizationResp3: 'Logistics',
    organizationResp4: 'Coordination',

    // Media Committee
    mediaCommittee: 'Media Committee',
    mediaDescription: 'The Media Committee documents and showcases activities through photography, videography, and digital content.',
    mediaResp1: 'Photography',
    mediaResp2: 'Videography',
    mediaResp3: 'Editing',
    mediaResp4: 'Content publishing',

    // Activity Committee
    activityCommittee: 'Activity Committee',
    activityDescription: 'The Activity Committee creates engaging events and experiences that strengthen community engagement.',
    activityResp1: 'Event activities',
    activityResp2: 'Engagement',
    activityResp3: 'Workshops',
    activityResp4: 'Community building',

    // Auth
    signIn: 'Sign In',
    signOut: 'Sign Out',
    password: 'Password',
    login: 'Login',
    dontHaveAccount: "Don't have an account?",
    signUp: 'Sign Up',
    alreadyHaveAccount: 'Already have an account?',
    adminPanel: 'Admin Panel',
    profile: 'Profile',
    myProfile: 'My Profile',
    personalInfo: 'Personal Information',
    saveChanges: 'Save Changes',
    updateSuccess: 'Profile updated successfully!',
    role: 'Role',
    memberSince: 'Member Since',
  },
  ar: {
    // Navigation
    home: 'الصفحة الرئيسية',
    ourTeam: 'فريقنا',
    events: 'الفعاليات',
    competitions: 'المسابقات',
    trips: 'الرحلات',
    contact: 'تواصل معنا',
    committees: 'اللجان',

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

    // Committees
    committeesTitle: 'لجاننا',
    committeesDescription: 'اكتشف الفرق المتفانية التي تدفع منظمتنا إلى الأمام',
    keyResponsibilities: 'المسؤوليات الرئيسية',

    // HR Committee
    hrCommittee: 'لجنة الموارد البشرية',
    hrDescription: 'تدير لجنة الموارد البشرية علاقات الأعضاء والتوظيف والتواصل الداخلي لضمان بيئة إيجابية وتعاونية.',
    hrResp1: 'توظيف الأعضاء',
    hrResp2: 'بناء الفريق',
    hrResp3: 'التواصل الداخلي',
    hrResp4: 'حل النزاعات',

    // PR Committee
    prCommittee: 'لجنة العلاقات العامة',
    prDescription: 'تمثل لجنة العلاقات العامة الصورة العامة للمنظمة وتدير التواصل مع الشركاء والمجتمع.',
    prResp1: 'العلاقات العامة',
    prResp2: 'العلامة التجارية',
    prResp3: 'الشراكات',
    prResp4: 'التواصل الخارجي',

    // Creativity Committee
    creativityCommittee: 'لجنة الإبداع',
    creativityDescription: 'تولد لجنة الإبداع أفكارًا مبتكرة ومفاهيم بصرية تحيي رؤية المنظمة.',
    creativityResp1: 'توليد الأفكار',
    creativityResp2: 'مفاهيم التصميم',
    creativityResp3: 'الهوية البصرية',
    creativityResp4: 'الابتكار',

    // Organization Committee
    organizationCommittee: 'لجنة التنظيم',
    organizationDescription: 'تضمن لجنة التنظيم التخطيط والتنفيذ السلس للفعاليات والعمليات الداخلية.',
    organizationResp1: 'تخطيط الفعاليات',
    organizationResp2: 'الجدولة',
    organizationResp3: 'اللوجستيات',
    organizationResp4: 'التنسيق',

    // Media Committee
    mediaCommittee: 'لجنة الإعلام',
    mediaDescription: 'توثق لجنة الإعلام وتعرض الأنشطة من خلال التصوير الفوتوغرافي والفيديو والمحتوى الرقمي.',
    mediaResp1: 'التصوير الفوتوغرافي',
    mediaResp2: 'التصوير بالفيديو',
    mediaResp3: 'المونتاج',
    mediaResp4: 'نشر المحتوى',

    // Activity Committee
    activityCommittee: 'لجنة الأنشطة',
    activityDescription: 'تنشئ لجنة الأنشطة فعاليات وتجارب جذابة تعزز مشاركة المجتمع.',
    activityResp1: 'أنشطة الفعاليات',
    activityResp2: 'المشاركة',
    activityResp3: 'ورش العمل',
    activityResp4: 'بناء المجتمع',

    // Auth
    signIn: 'تسجيل الدخول',
    signOut: 'تسجيل الخروج',
    password: 'كلمة المرور',
    login: 'دخول',
    dontHaveAccount: 'ليس لديك حساب؟',
    signUp: 'إنشاء حساب',
    alreadyHaveAccount: 'لديك حساب بالفعل؟',
    adminPanel: 'لوحة التحكم',
    profile: 'الملف الشخصي',
    myProfile: 'ملفي الشخصي',
    personalInfo: 'المعلومات الشخصية',
    saveChanges: 'حفظ التغييرات',
    updateSuccess: 'تم تحديث الملف الشخصي بنجاح!',
    role: 'الرتبة',
    memberSince: 'عضو منذ',
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
