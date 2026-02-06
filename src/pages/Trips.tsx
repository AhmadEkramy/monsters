import { Card } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Calendar, MapPin, Camera, Loader2 } from 'lucide-react';
import { useCollection } from '@/hooks/useFirestore';

export default function Trips() {
  const { t } = useLanguage();
  const { data: trips, loading, error } = useCollection('trips');

  if (error) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center text-destructive">
        Error loading trips: {error.message}
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-black text-foreground mb-4">
            {t('tripsTitle')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('tripsDescription')}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
        ) : (
          <div className="space-y-12">
            {trips.map((trip: any, index) => (
              <Card
                key={index}
                className="group overflow-hidden bg-card border-border hover:border-primary/50 transition-all duration-300 hover-glow"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Images */}
                  <div className="grid grid-cols-2 gap-2 p-2">
                    {(trip.images || []).map((image: string, imgIndex: number) => (
                      <div
                        key={imgIndex}
                        className="relative overflow-hidden rounded-lg aspect-square"
                      >
                        <img
                          src={image}
                          alt={`${trip.title} - ${imgIndex + 1}`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    ))}
                  </div>

                  {/* Content */}
                  <div className="p-6 lg:p-8 flex flex-col justify-center space-y-6">
                    <div>
                      <h3 className="text-3xl font-bold text-foreground group-hover:text-primary transition-colors duration-300 mb-4">
                        {trip.title}
                      </h3>
                      <p className="text-muted-foreground text-lg leading-relaxed">
                        {trip.description}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center text-muted-foreground">
                        <Calendar className="w-5 h-5 mr-3 text-primary" />
                        <span className="font-medium">{trip.date}</span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <MapPin className="w-5 h-5 mr-3 text-primary" />
                        <span className="font-medium">{trip.location}</span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Camera className="w-5 h-5 mr-3 text-primary" />
                        <span className="font-medium">{(trip.images || []).length} Photos</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
            {trips.length === 0 && (
              <div className="text-center py-20 text-muted-foreground">
                No trips found.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

