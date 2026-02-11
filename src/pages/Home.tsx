import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Target, Users, Trophy, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCollection } from '@/hooks/useFirestore';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import * as React from "react";

export default function Home() {
  const { t } = useLanguage();
  const { data: slides, loading: slidesLoading } = useCollection('carousel');
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: false })
  );

  const features = [
    {
      icon: Target,
      title: t('ourVision'),
      description: t('visionText'),
      link: '/committees'
    },
    {
      icon: Users,
      title: t('ourTeam'),
      description: 'A diverse group of talented individuals working together.',
      link: '/team'
    },
    {
      icon: Trophy,
      title: t('achievements'),
      description: 'Proven track record in competitions and events.',
      link: '/events'
    },
  ];

  const carouselSlides = slides;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 pt-32 md:pt-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(78,240,55,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(78,240,55,0.05),transparent_50%)]" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-8 animate-fade-in-up pt-12 md:pt-0">
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-32 h-32 md:w-48 md:h-48 bg-primary/10 rounded-full flex items-center justify-center animate-float p-6 md:p-8">
                  <img
                    src="/logo.png"
                    alt="Monsters Logo"
                    className="w-full h-auto drop-shadow-[0_0_15px_rgba(78,240,55,0.5)]"
                  />
                </div>
                <div className="absolute inset-0 bg-primary/5 rounded-full animate-pulse-glow" />
              </div>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-foreground leading-[1.1]">
                {t('heroTitle').split(' ').map((word, i) => (
                  <span
                    key={i}
                    className={i === t('heroTitle').split(' ').length - 1 ? 'text-primary text-glow-lg' : ''}
                  >
                    {word}{' '}
                  </span>
                ))}
              </h1>
              <p className="text-lg md:text-2xl text-primary font-semibold">
                {t('heroSubtitle')}
              </p>
            </div>

            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4 md:px-0">
              {t('heroDescription')}
            </p>

            <div className="flex justify-center">
              <a href="https://docs.google.com/forms/d/e/1FAIpQLSds0DCZCBLYHqy16qizGnXHbZPYq1p4NGqNgabFiUwFTZxTow/viewform" target="_blank" rel="noopener noreferrer">
                <Button
                  size="lg"
                  className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 text-primary-foreground font-bold neon-border-hover transition-all duration-300"
                >
                  {t('joinNow')}
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Carousel Section */}
      {!slidesLoading && carouselSlides.length > 0 && (
        <section className="relative w-full bg-background overflow-hidden py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
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
                    <div className="p-1">
                      <Card className="overflow-hidden border-none bg-background/50 backdrop-blur-sm group hover-glow">
                        <div className="relative aspect-[21/9] w-full">
                          <img
                            src={slide.image}
                            alt={slide.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                          <div className="absolute bottom-0 left-0 p-8 md:p-12 space-y-2">
                            <h3 className="text-2xl md:text-4xl font-black text-foreground">{slide.title}</h3>
                            <p className="text-lg text-muted-foreground max-w-xl">{slide.subtitle}</p>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex -left-12 hover:bg-primary hover:text-primary-foreground" />
              <CarouselNext className="hidden md:flex -right-12 hover:bg-primary hover:text-primary-foreground" />
            </Carousel>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-20 bg-muted/30 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(78,240,55,0.05),transparent_50%)]" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Link key={index} to={feature.link} className="block transition-transform duration-300 hover:scale-[1.02]">
                <Card
                  className="p-6 bg-card/50 backdrop-blur-sm hover:bg-card/80 border-border hover:border-primary/50 transition-all duration-300 hover-glow group cursor-pointer h-full"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="space-y-4">
                    <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                      <feature.icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Join Us Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-primary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-black text-foreground">
              {t('becomeMonster')}
            </h2>
            <p className="text-xl text-muted-foreground">
              {t('joinDescription')}
            </p>
            <a href="https://docs.google.com/forms/d/e/1FAIpQLSds0DCZCBLYHqy16qizGnXHbZPYq1p4NGqNgabFiUwFTZxTow/viewform" target="_blank" rel="noopener noreferrer">
              <Button
                size="lg"
                className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 text-primary-foreground font-bold neon-border-hover transition-all duration-300"
              >
                {t('joinButton')}
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
