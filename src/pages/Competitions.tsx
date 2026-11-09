import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { Trophy, Star, Loader2, Facebook, Instagram, Award } from 'lucide-react';
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

export default function Competitions() {
  const { t, language } = useLanguage();
  const { data: competitionsData, loading: compLoading, error: compError } = useCollection('competitions');

  if (compError) {
    return (
      <div className="min-h-screen pt-28 flex items-center justify-center text-destructive">
        Error loading data: {compError?.message}
      </div>
    );
  }

  const competitions = competitionsData || [];

  return (
    <div className="min-h-screen pt-28 pb-20 bg-background relative overflow-x-hidden">
      {/* Soft ambient background glow */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[700px] h-[320px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-secondary/80 border border-primary/20 backdrop-blur-md shadow-sm mb-4">
            <Trophy className="w-3.5 h-3.5 text-primary" />
            <span>{language === 'ar' ? 'المسابقات والجوائز' : 'Competitions & Awards'}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-foreground tracking-tight">
            <span className="bg-gradient-to-r from-foreground via-foreground/90 to-primary bg-clip-text text-transparent">
              {t('competitionsTitle')}
            </span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mt-3 leading-relaxed">
            {t('competitionsDescription')}
          </p>
        </div>

        {compLoading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {competitions.map((competition: any, index) => (
                <CompetitionCard key={competition.id || index} competition={competition} index={index} language={language} />
              ))}
            </div>

            {competitions.length === 0 && (
              <div className="text-center py-24 p-8 rounded-3xl bg-card/40 border border-border/80 max-w-md mx-auto">
                <Trophy className="w-10 h-10 text-primary/40 mx-auto mb-3" />
                <p className="text-muted-foreground font-medium">
                  {language === 'ar' ? 'لا توجد مسابقات مضافة حالياً.' : 'No competitions found.'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function CompetitionCard({ competition, index, language }: { competition: any; index: number; language: string }) {
  const plugin = React.useRef(
    Autoplay({ delay: 3500, stopOnInteraction: true })
  );

  const images: string[] = competition.images && competition.images.length > 0
    ? competition.images
    : competition.image
      ? [competition.image]
      : [];

  return (
    <Card
      className="group overflow-hidden rounded-3xl bg-card/70 backdrop-blur-md border border-border/80 hover:border-primary/50 transition-all duration-500 shadow-xl hover:shadow-[0_0_30px_hsl(var(--primary)/0.18)] flex flex-col justify-between group-hover:-translate-y-1"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div>
        {/* Media Container */}
        <div className="relative overflow-hidden aspect-[16/10] w-full bg-secondary/30">
          {images.length > 1 ? (
            <Carousel
              plugins={[plugin.current]}
              opts={{ loop: true, align: "start" }}
              className="w-full h-full"
            >
              <CarouselContent className="h-full">
                {images.map((img: string, imgIndex: number) => (
                  <CarouselItem key={imgIndex} className="h-full">
                    <img
                      src={img}
                      alt={`${competition.title} - ${imgIndex + 1}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2.5 w-8 h-8 bg-background/80 backdrop-blur-md border-border/60 hover:bg-primary hover:text-primary-foreground shadow-md" />
              <CarouselNext className="right-2.5 w-8 h-8 bg-background/80 backdrop-blur-md border-border/60 hover:bg-primary hover:text-primary-foreground shadow-md" />
              {/* Photo counter badge */}
              <div className="absolute bottom-3 left-3 bg-background/80 backdrop-blur-md text-foreground text-xs font-semibold px-2.5 py-1 rounded-full border border-border/60 z-10 shadow-sm">
                {images.length} {language === 'ar' ? 'صور' : 'photos'}
              </div>
            </Carousel>
          ) : images.length === 1 ? (
            <img
              src={images[0]}
              alt={competition.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm font-medium">
              {language === 'ar' ? 'لا توجد صورة' : 'No image available'}
            </div>
          )}

          {/* Status / Prize Badge */}
          {competition.status && (
            <div className="absolute top-3 right-3 z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary text-primary-foreground shadow-md shadow-[0_0_15px_hsl(var(--primary)/0.4)] backdrop-blur-md">
                <Award className="w-3.5 h-3.5" />
                <span>{competition.status}</span>
              </span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-start gap-4">
            <h3 className="text-xl sm:text-2xl font-black text-foreground group-hover:text-primary transition-colors">
              {competition.title}
            </h3>

            {/* Social Links */}
            <div className="flex gap-2 shrink-0">
              {competition.social?.facebook && (
                <a
                  href={competition.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-secondary/80 hover:bg-primary/20 hover:text-primary text-muted-foreground border border-border/70 hover:border-primary/40 transition-all flex items-center justify-center hover:scale-110"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {competition.social?.instagram && (
                <a
                  href={competition.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-secondary/80 hover:bg-primary/20 hover:text-primary text-muted-foreground border border-border/70 hover:border-primary/40 transition-all flex items-center justify-center hover:scale-110"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            {competition.description}
          </p>
        </div>
      </div>
    </Card>
  );
}
