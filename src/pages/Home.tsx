import * as React from "react";
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCollection } from '@/hooks/useFirestore';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import {
  Target,
  Users,
  Trophy,
  Compass,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Flame,
  HeartHandshake,
  Layers,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

export default function Home() {
  const { t, language } = useLanguage();
  const isRtl = language === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;
  const ChevronIcon = isRtl ? ChevronLeft : ChevronRight;

  const { data: slides, loading: slidesLoading } = useCollection('carousel');
  const { data: dbStats } = useCollection('stats');
  const plugin = React.useRef(
    Autoplay({ delay: 3500, stopOnInteraction: false })
  );

  const features = [
    {
      icon: Target,
      title: t('ourVision'),
      description: language === 'ar'
        ? 'نهدف إلى تغيير المنظور وإظهار الجانب الممتع والاجتماعي والإبداعي لطلاب الهندسة.'
        : 'To be the leading university team fostering innovation, excellence, and collaboration.',
      link: '/committees',
      tag: language === 'ar' ? 'الرؤية واللجان' : 'Vision & Committees',
    },
    {
      icon: Users,
      title: t('ourTeam'),
      description: language === 'ar'
        ? 'فريق شغوف من الطلاب المتميزين يعملون بتناغم لصنع تجارب استثنائية.'
        : 'A diverse group of talented individuals working together with passion.',
      link: '/team',
      tag: language === 'ar' ? 'مجلس الإدارة' : 'The Board',
    },
    {
      icon: Trophy,
      title: t('events'),
      description: language === 'ar'
        ? 'فعاليات وورش عمل ترفيهية وتعليمية تكسر روتين الدراسة وتزرع الحماس.'
        : 'Exciting activities, competitions, and workshops that energize campus life.',
      link: '/events',
      tag: language === 'ar' ? 'الأنشطة' : 'Activities',
    },
    {
      icon: Compass,
      title: t('trips'),
      description: language === 'ar'
        ? 'رحلات ومغامرات لا تُنسى تجمعنا كعائلة واحدة في أجمل الأماكن.'
        : 'Memorable adventures, road trips, and outings across the most beautiful spots.',
      link: '/trips',
      tag: language === 'ar' ? 'مغامرات' : 'Adventures',
    },
  ];

  const defaultStats = [
    { number: '+500', label: language === 'ar' ? 'عضو متألق' : 'Active Members' },
    { number: '8', label: language === 'ar' ? 'لجان متخصصة' : 'Committees' },
    { number: '+30', label: language === 'ar' ? 'فعالية ورحلة' : 'Events & Trips' },
    { number: '100%', label: language === 'ar' ? 'شغف وطاقة' : 'Positive Energy' },
  ];

  const stats = dbStats && dbStats.length > 0
    ? [...dbStats]
        .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
        .map((item: any) => ({
          number: item.number,
          label: language === 'ar' ? (item.labelAr || item.label || '') : (item.labelEn || item.label || '')
        }))
    : defaultStats;

  const whyChooseUs = [
    {
      icon: Flame,
      title: language === 'ar' ? 'كسر الروتين الهندسي' : 'Breaking The Routine',
      description: language === 'ar'
        ? 'الحياة الهندسية ليست معادلات فقط؛ نحن نُضيف المرح والأنشطة الترفيهية لتعيش تجربة جامعية متكاملة.'
        : 'Engineering life is more than just equations; we bring fun and creativity into your college journey.',
    },
    {
      icon: Layers,
      title: language === 'ar' ? 'تطوير مهارات عملية' : 'Real-World Skills',
      description: language === 'ar'
        ? 'فرص حقيقية لتطوير القيادة، إدارة الفعاليات، العلاقات العامة، والتسويق الرقمي قبل التخرج.'
        : 'Hands-on experience in leadership, event management, PR, and creative design before graduation.',
    },
    {
      icon: HeartHandshake,
      title: language === 'ar' ? 'عائلة ومجتمع مترابط' : 'A True Family',
      description: language === 'ar'
        ? 'أكثر من مجرد فريق؛ نحن شبكة علاقات قوية وصداقات تدوم مدى الحياة تدعمك في دراستك ومستقبلك.'
        : 'More than a student activity; a supportive network of lifelong friends and future engineers.',
    },
  ];

  const carouselSlides = slides || [];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/20 selection:text-primary">
      
      {/* Hero Section */}
      <section className="relative min-h-[92vh] flex flex-col justify-center items-center overflow-hidden pt-28 pb-16">
        {/* Soft, eye-comfortable ambient lighting gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-20 right-10 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-5xl text-center space-y-8 animate-fade-in-up">
          
          {/* Top Badge */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium bg-secondary/80 border border-primary/20 backdrop-blur-md shadow-sm hover:border-primary/40 transition-colors">
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-foreground/90">
                {language === 'ar'
                  ? 'النشاط الترفيهي الأول • كلية الهندسة'
                  : 'The Entertainment Pulse • Faculty of Engineering'}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            </div>
          </div>

          {/* Logo Emblem */}
          <div className="flex justify-center">
            <div className="relative group cursor-pointer">
              <div className="w-36 h-36 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-3xl bg-secondary/50 border border-border/80 flex items-center justify-center p-5 sm:p-6 backdrop-blur-md shadow-xl group-hover:border-primary/50 group-hover:shadow-[0_0_35px_hsl(var(--primary)/0.25)] transition-all duration-500">
                <img
                  src="/logo.png"
                  alt="Monsters Logo"
                  className="w-full h-full object-contain drop-shadow-[0_0_20px_rgba(78,240,55,0.5)] group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="absolute -inset-1.5 bg-gradient-to-r from-primary/25 via-transparent to-primary/25 rounded-3xl blur-lg -z-10 opacity-70 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>

          {/* Headline with Eye-friendly Gradient Typography */}
          <div className="space-y-4 max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.12]">
              <span className="bg-gradient-to-r from-foreground via-foreground/90 to-primary bg-clip-text text-transparent">
                {language === 'ar' ? 'فريق مونسترز' : 'Welcome to Monsters Team'}
              </span>
            </h1>

            <div className="flex items-center justify-center gap-2">
              <span className="h-[1px] w-8 bg-primary/40" />
              <p className="text-base sm:text-xl font-bold text-primary tracking-wide">
                {t('heroSubtitle')}
              </p>
              <span className="h-[1px] w-8 bg-primary/40" />
            </div>
          </div>

          {/* Description */}
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto font-normal">
            {t('heroDescription')}
          </p>

          {/* Dual CTAs (Primary + Secondary) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSds0DCZCBLYHqy16qizGnXHbZPYq1p4NGqNgabFiUwFTZxTow/viewform"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <Button
                size="lg"
                className="w-full sm:w-auto text-base sm:text-lg px-8 py-6 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-[0_0_20px_hsl(var(--primary)/0.3)] hover:shadow-[0_0_30px_hsl(var(--primary)/0.5)] hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2"
              >
                <span>{t('joinNow')}</span>
                <ArrowIcon className="w-5 h-5" />
              </Button>
            </a>

            <Link to="/committees" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto text-base sm:text-lg px-8 py-6 rounded-xl bg-secondary/40 hover:bg-secondary border-border/80 hover:border-primary/40 text-foreground font-semibold backdrop-blur-sm transition-all duration-300"
              >
                {language === 'ar' ? 'استكشف لجاننا' : 'Explore Committees'}
              </Button>
            </Link>
          </div>

          {/* Eye-comfort Stats Strip */}
          <div className="pt-10 max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 rounded-2xl bg-card/40 border border-border/70 backdrop-blur-md shadow-sm">
              {stats.map((item, index) => (
                <div key={index} className="text-center p-2">
                  <div className="text-2xl sm:text-3xl font-black text-primary font-mono tracking-tight">
                    {item.number}
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-muted-foreground mt-1">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Carousel Section (Moments & Memories) */}
      {!slidesLoading && carouselSlides.length > 0 && (
        <section className="relative w-full py-16 bg-card/30 border-y border-border/60">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Section Header */}
            <div className="text-center space-y-2 mb-10 max-w-xl mx-auto">
              <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5 px-3 py-1 text-xs">
                {language === 'ar' ? 'معرض الذكريات' : 'Our Highlights'}
              </Badge>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-foreground">
                {language === 'ar' ? 'لحظات استثنائية من رحلتنا' : 'Moments That Define Us'}
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                {language === 'ar' ? 'لقطات حية من فعالياتنا ومغامراتنا المستمرة' : 'Snapshots from our team trips and exciting events'}
              </p>
            </div>

            <Carousel
              plugins={[plugin.current]}
              opts={{
                loop: true,
                align: "start",
              }}
              className="w-full max-w-5xl mx-auto"
            >
              <CarouselContent>
                {carouselSlides.map((slide, index) => (
                  <CarouselItem key={index}>
                    <div className="p-2">
                      <div className="relative rounded-2xl md:rounded-3xl overflow-hidden border border-border/80 bg-card shadow-xl group">
                        <div className="relative aspect-[16/9] md:aspect-[21/9] w-full">
                          <img
                            src={slide.image}
                            alt={slide.title || 'Monsters Slide'}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          {/* Smooth gradient overlay that makes text comfortable to read */}
                          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                          
                          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 space-y-1.5 backdrop-blur-[2px]">
                            {slide.title && (
                              <h3 className="text-xl md:text-3xl font-extrabold text-foreground drop-shadow-sm">
                                {slide.title}
                              </h3>
                            )}
                            {slide.subtitle && (
                              <p className="text-sm md:text-base text-muted-foreground max-w-xl drop-shadow-sm">
                                {slide.subtitle}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex -left-5 bg-card/80 border-border hover:bg-primary hover:text-primary-foreground shadow-md" />
              <CarouselNext className="hidden md:flex -right-5 bg-card/80 border-border hover:bg-primary hover:text-primary-foreground shadow-md" />
            </Carousel>
          </div>
        </section>
      )}

      {/* Features / Pillars Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-6xl">
          
          {/* Section Header */}
          <div className="text-center space-y-3 mb-16 max-w-2xl mx-auto">
            <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5 px-3 py-1 text-xs">
              {language === 'ar' ? 'ماذا نقدم' : 'What We Offer'}
            </Badge>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight">
              {language === 'ar' ? 'عالم متكامل من الأنشطة' : 'A Complete Experience'}
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              {language === 'ar'
                ? 'نجمع بين الترفيه، وتطوير المهارات، وروح الفريق لنمنحك تجربة جامعية لن تنساها.'
                : 'Combining entertainment, skill-building, and camaraderie for an unforgettable journey.'}
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Link key={index} to={feature.link} className="block group">
                <Card className="h-full p-6 rounded-2xl bg-card/50 backdrop-blur-sm border-border/80 hover:border-primary/50 shadow-sm hover:shadow-[0_0_25px_hsl(var(--primary)/0.15)] transition-all duration-300 flex flex-col justify-between group-hover:-translate-y-1">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                        <feature.icon className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80 px-2 py-0.5 rounded-md bg-secondary/80">
                        {feature.tag}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>

                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  <div className="pt-6 mt-4 border-t border-border/40 flex items-center gap-2 text-xs font-bold text-primary group-hover:gap-3 transition-all">
                    <span>{language === 'ar' ? 'اكتشف المزيد' : 'Explore'}</span>
                    <ChevronIcon className="w-3.5 h-3.5" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* Why Monsters Section (Engineering with a Twist) */}
      <section className="py-20 bg-card/40 border-y border-border/60 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-6xl">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Heading & Vision statement */}
            <div className="lg:col-span-5 space-y-6 text-center lg:text-start">
              <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5 px-3 py-1 text-xs">
                {language === 'ar' ? 'لماذا مونسترز؟' : 'Why Monsters?'}
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground leading-tight">
                {language === 'ar'
                  ? 'الهندسة بروح جديدة وطاقة استثنائية'
                  : 'Engineering with a Twist of Fun'}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {language === 'ar'
                  ? 'هدفنا نثبت إن الدراسة والترفيه يقدروا يمشوا مع بعض في خط واحد، ونخلق ذكريات وعلاقات حقيقية تدوم.'
                  : 'We prove that academic passion and fun go hand in hand, creating genuine connections and lifelong memories.'}
              </p>

              <div className="pt-2">
                <Link to="/team">
                  <Button
                    variant="outline"
                    className="rounded-xl border-border hover:border-primary/50 hover:bg-primary/10 gap-2 font-semibold"
                  >
                    <span>{language === 'ar' ? 'تعرف على قادتنا' : 'Meet Our Leaders'}</span>
                    <ArrowIcon className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Column: 3 Pillars Cards */}
            <div className="lg:col-span-7 space-y-4">
              {whyChooseUs.map((item, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-background/60 border border-border/70 hover:border-primary/40 shadow-sm transition-all duration-300 flex items-start gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base sm:text-lg font-bold text-foreground">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* Join Us Banner Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          
          <div className="relative rounded-3xl p-8 sm:p-12 md:p-16 bg-gradient-to-br from-card via-card to-primary/10 border border-primary/20 shadow-2xl overflow-hidden text-center space-y-8">
            {/* Ambient background blur */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary/15 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-4 max-w-2xl mx-auto relative z-10">
              <Badge variant="outline" className="border-primary/40 text-primary bg-primary/10 px-3 py-1 text-xs">
                {language === 'ar' ? 'انضم للعائلة' : 'Join The Family'}
              </Badge>
              <h2 className="text-3xl sm:text-5xl font-black text-foreground tracking-tight">
                {t('becomeMonster')}
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                {t('joinDescription')}
              </p>
            </div>

            {/* Value checklist */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-foreground/80 font-medium relative z-10">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span>{language === 'ar' ? 'مجتمع طلابي داعم' : 'Supportive Community'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span>{language === 'ar' ? 'تطوير شخصي ومهني' : 'Personal & Career Growth'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span>{language === 'ar' ? 'فعاليات ومغامرات مستمرة' : 'Exciting Events & Trips'}</span>
              </div>
            </div>

            <div className="pt-2 relative z-10">
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSds0DCZCBLYHqy16qizGnXHbZPYq1p4NGqNgabFiUwFTZxTow/viewform"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  className="text-base sm:text-lg px-10 py-6 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-[0_0_20px_hsl(var(--primary)/0.35)] hover:shadow-[0_0_35px_hsl(var(--primary)/0.55)] hover:scale-105 transition-all duration-300"
                >
                  {t('joinButton')}
                </Button>
              </a>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
