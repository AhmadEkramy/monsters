import { Card } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Calendar, MapPin, Camera, Loader2, Facebook, Instagram, Compass } from 'lucide-react';
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

export default function Trips() {
  const { t, language } = useLanguage();
  const { data: trips, loading, error } = useCollection('trips');

  if (error) {
    return (
      <div className="min-h-screen pt-28 flex items-center justify-center text-destructive">
        Error loading trips: {error.message}
      </div>
    );
  }

  const tripsList = trips || [];

  return (
    <div className="min-h-screen pt-28 pb-20 bg-background relative overflow-x-hidden">
      {/* Soft ambient background glow */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[700px] h-[320px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-secondary/80 border border-primary/20 backdrop-blur-md shadow-sm mb-4">
            <Compass className="w-3.5 h-3.5 text-primary" />
            <span>{language === 'ar' ? 'رحلات ومغامرات الفريق' : 'Adventures & Trips'}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-foreground tracking-tight">
            <span className="bg-gradient-to-r from-foreground via-foreground/90 to-primary bg-clip-text text-transparent">
              {t('tripsTitle')}
            </span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mt-3 leading-relaxed">
            {t('tripsDescription')}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
        ) : (
          <div className="space-y-12">
            {tripsList.map((trip: any, index) => (
              <TripCard key={trip.id || index} trip={trip} index={index} language={language} />
            ))}
            
            {tripsList.length === 0 && (
              <div className="text-center py-24 p-8 rounded-3xl bg-card/40 border border-border/80 max-w-md mx-auto">
                <Compass className="w-10 h-10 text-primary/40 mx-auto mb-3" />
                <p className="text-muted-foreground font-medium">
                  {language === 'ar' ? 'لا توجد رحلات مضافة حالياً.' : 'No trips found.'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function TripCard({ trip, index, language }: { trip: any; index: number; language: string }) {
  const plugin = React.useRef(
    Autoplay({ delay: 3500, stopOnInteraction: true })
  );

  const images = trip.images || [];

  return (
    <Card
      className="group overflow-hidden rounded-3xl bg-card/70 backdrop-blur-md border border-border/80 hover:border-primary/50 transition-all duration-500 shadow-xl hover:shadow-[0_0_30px_hsl(var(--primary)/0.18)]"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-4 sm:p-6 lg:p-8">
        
        {/* Images Carousel (7 cols) */}
        <div className="lg:col-span-7">
          <div className="relative rounded-2xl overflow-hidden aspect-[16/10] bg-secondary/30">
            {images.length > 1 ? (
              <Carousel
                plugins={[plugin.current]}
                opts={{
                  loop: true,
                  align: "start",
                }}
                className="w-full h-full"
              >
                <CarouselContent className="h-full">
                  {images.map((image: string, imgIndex: number) => (
                    <CarouselItem key={imgIndex} className="h-full">
                      <div className="relative w-full h-full">
                        <img
                          src={image}
                          alt={`${trip.title} - ${imgIndex + 1}`}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-3 w-8 h-8 bg-background/80 backdrop-blur-md border-border/60 hover:bg-primary hover:text-primary-foreground shadow-md" />
                <CarouselNext className="right-3 w-8 h-8 bg-background/80 backdrop-blur-md border-border/60 hover:bg-primary hover:text-primary-foreground shadow-md" />
                
                {/* Photo Counter */}
                <div className="absolute bottom-3 left-3 bg-background/80 backdrop-blur-md text-foreground text-xs font-semibold px-2.5 py-1 rounded-full border border-border/60 z-10 shadow-sm">
                  {images.length} {language === 'ar' ? 'صور' : 'photos'}
                </div>
              </Carousel>
            ) : images.length === 1 ? (
              <img
                src={images[0]}
                alt={trip.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                <Camera className="w-10 h-10 opacity-40" />
              </div>
            )}
          </div>
        </div>

        {/* Content (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-start gap-4">
              <h3 className="text-2xl sm:text-3xl font-black text-foreground group-hover:text-primary transition-colors">
                {trip.title}
              </h3>
              
              {/* Socials */}
              <div className="flex gap-2 shrink-0">
                {trip.social?.facebook && (
                  <a
                    href={trip.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-secondary/80 hover:bg-primary/20 hover:text-primary text-muted-foreground border border-border/70 hover:border-primary/40 transition-all flex items-center justify-center hover:scale-110"
                    aria-label="Facebook"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                )}
                {trip.social?.instagram && (
                  <a
                    href={trip.social.instagram}
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

            <p className="text-base text-muted-foreground leading-relaxed">
              {trip.description}
            </p>
          </div>

          {/* Metadata Chips */}
          <div className="pt-4 border-t border-border/60 flex flex-wrap gap-2.5 text-xs font-semibold">
            {trip.date && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-secondary/60 border border-border/70 text-foreground">
                <Calendar className="w-3.5 h-3.5 text-primary" />
                <span>{trip.date}</span>
              </div>
            )}
            {trip.location && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-secondary/60 border border-border/70 text-foreground">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                <span>{trip.location}</span>
              </div>
            )}
            {images.length > 0 && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-secondary/60 border border-border/70 text-foreground">
                <Camera className="w-3.5 h-3.5 text-primary" />
                <span>{images.length} {language === 'ar' ? 'لقطة' : 'Photos'}</span>
              </div>
            )}
          </div>
        </div>

      </div>
    </Card>
  );
}
