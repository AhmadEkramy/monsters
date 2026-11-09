import { Link } from 'react-router-dom';
import { 
  Facebook, 
  Instagram, 
  Github, 
  Linkedin, 
  Music2 as TikTok, 
  MapPin, 
  Code2, 
  Sparkles, 
  ArrowUp, 
  Heart,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export function Footer() {
  const { t, language } = useLanguage();
  const isRtl = language === 'ar';

  const socialLinks = [
    { icon: Facebook, href: 'https://www.facebook.com/share/1C1jzpXb3L/', label: 'Facebook' },
    { icon: Instagram, href: 'https://www.instagram.com/monsters_mnu?igsh=aW5kMDA3eXF6N3hy', label: 'Instagram' },
    { icon: TikTok, href: 'https://www.tiktok.com/@monsters.mnu?_r=1&_t=ZS-93j4s2or7Y4', label: 'TikTok' },
    { icon: Linkedin, href: 'https://www.linkedin.com/in/monsters-femnu-2184563aa?utm_source=share_via&utm_content=profile&utm_medium=member_android', label: 'LinkedIn' },
  ];

  const creatorSocials = [
    { icon: Facebook, href: 'https://www.facebook.com/share/1GTFnmsQji/', label: 'Facebook' },
    { icon: Instagram, href: 'https://www.instagram.com/mustafa_ekramy1?igsh=OWJrbTc2ZjY1NnY4', label: 'Instagram' },
    { icon: Linkedin, href: 'https://www.linkedin.com/in/mustafa-ekramy-47885537a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app', label: 'LinkedIn' },
    { icon: Github, href: 'https://github.com/MustafaEkramy', label: 'GitHub' },
  ];

  const quickLinks = [
    { path: '/', label: t('home') },
    { path: '/team', label: t('ourTeam') },
    { path: '/committees', label: t('committees') },
    { path: '/events', label: t('events') },
    { path: '/competitions', label: t('competitions') },
    { path: '/trips', label: t('trips') },
    { path: '/contact', label: t('contact') },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const ArrowIcon = isRtl ? ChevronLeft : ChevronRight;

  return (
    <footer className="relative mt-24 border-t border-border/80 bg-gradient-to-b from-card/90 via-card to-background text-foreground overflow-hidden">
      {/* Top glowing ambient neon line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-80 shadow-[0_0_15px_hsl(var(--primary))]" />

      {/* Ambient background glow orb */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12">
          
          {/* Brand & Identity (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <img 
                src="/logo.png" 
                alt="Monsters Logo" 
                className="h-12 w-auto drop-shadow-[0_0_12px_rgba(34,197,94,0.35)]" 
              />
              <span className="text-3xl font-black text-primary text-glow tracking-tighter">
                MONSTERS
              </span>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              {language === 'ar' ? 'جامعة المنصورة الأهلية' : 'Mansoura National University'}
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              {language === 'ar'
                ? 'نبض الترفيه في كلية الهندسة بجامعة المنصورة الأهلية. نصنع اللحظات الاستثنائية ونبني الذكريات التي تدوم.'
                : 'The entertainment pulse of the Faculty of Engineering at Mansoura National University. We bring energy, fun, and memorable moments.'}
            </p>

            {/* University & College logos */}
            <div className="flex items-center gap-4 pt-2">
              <img 
                src="/logo1.png" 
                alt="University Logo" 
                className="h-9 w-auto opacity-75 hover:opacity-100 transition-opacity duration-300" 
              />
              <img 
                src="/logo2.png" 
                alt="College Logo" 
                className="h-9 w-auto opacity-75 hover:opacity-100 transition-opacity duration-300" 
              />
            </div>
          </div>

          {/* Quick Links (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-base font-bold text-foreground flex items-center gap-2">
              <span className="w-1.5 h-4 rounded-full bg-primary" />
              {language === 'ar' ? 'روابط سريعة' : 'Quick Links'}
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="group flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-all duration-200"
                  >
                    <ArrowIcon className="h-3.5 w-3.5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Location & Team Socials (3 cols) */}
          <div className="lg:col-span-3 space-y-6">
            {/* Location card */}
            <div className="space-y-2.5">
              <h4 className="text-base font-bold text-foreground flex items-center gap-2">
                <span className="w-1.5 h-4 rounded-full bg-primary" />
                {t('location')}
              </h4>
              <div className="p-3.5 rounded-xl bg-secondary/50 border border-border/70 hover:border-primary/40 transition-colors flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0 mt-0.5">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t('locationText')}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {language === 'ar' ? 'كلية الهندسة' : 'Faculty of Engineering'}
                  </p>
                </div>
              </div>
            </div>

            {/* Social media icons */}
            <div className="space-y-3">
              <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {t('followUs')}
              </h5>
              <div className="flex items-center gap-2.5 flex-wrap">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-secondary/60 hover:bg-primary/20 border border-border/80 hover:border-primary/60 text-muted-foreground hover:text-primary transition-all duration-300 flex items-center justify-center hover:scale-110 hover:shadow-[0_0_15px_hsl(var(--primary)/0.35)]"
                    aria-label={social.label}
                    title={social.label}
                  >
                    <social.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Website Creator Card (3 cols) */}
          <div className="lg:col-span-3">
            <div className="relative rounded-2xl bg-gradient-to-br from-card/90 via-secondary/40 to-background/90 border border-border/80 hover:border-primary/50 p-5 shadow-lg hover:shadow-[0_0_25px_hsl(var(--primary)/0.18)] transition-all duration-300 group">
              {/* Corner ambient glow */}
              <div className="absolute top-0 right-0 rtl:right-auto rtl:left-0 w-24 h-24 bg-primary/10 rounded-bl-full rtl:rounded-bl-none rtl:rounded-br-full pointer-events-none group-hover:bg-primary/20 transition-colors duration-300 blur-xl" />

              {/* Creator Card Header */}
              <div className="flex items-center justify-between mb-3.5 relative z-10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center text-primary shadow-sm">
                    <Code2 className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-bold tracking-wider uppercase text-muted-foreground">
                    {language === 'ar' ? 'مطور الموقع' : 'Website Creator'}
                  </span>
                </div>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
              </div>

              {/* Name & Title */}
              <div className="space-y-1.5 relative z-10">
                <h4 className="text-lg font-black text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
                  <span>Mostafa Ekramy</span>
                  <Sparkles className="h-4 w-4 text-primary shrink-0" />
                </h4>
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-primary/15 text-primary border border-primary/30">
                    COMPUTER ENGINEER
                  </span>
                </div>
              </div>

              {/* Creator Socials */}
              <div className="pt-4 mt-4 border-t border-border/60 relative z-10">
                <div className="flex items-center gap-2">
                  {creatorSocials.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-lg bg-background/80 hover:bg-primary hover:text-primary-foreground border border-border/80 hover:border-primary text-muted-foreground transition-all duration-200 flex items-center justify-center hover:scale-110 shadow-sm"
                      aria-label={`Mostafa Ekramy ${social.label}`}
                      title={social.label}
                    >
                      <social.icon className="h-3.5 w-3.5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border/70 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p className="text-center md:text-start">
            © 2025 <span className="font-semibold text-foreground">Monsters Team</span> - Mansoura National University. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              Built with <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500 inline" /> for Monsters Community
            </span>

            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/80 hover:bg-primary/20 hover:text-primary border border-border/70 hover:border-primary/40 transition-all duration-300 text-foreground font-medium group"
              aria-label="Back to top"
            >
              <span>{language === 'ar' ? 'للأعلى' : 'Back to top'}</span>
              <ArrowUp className="h-3.5 w-3.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
