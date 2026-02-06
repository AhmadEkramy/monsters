import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { Calendar, MapPin, Users, Loader2 } from 'lucide-react';
import { useCollection } from '@/hooks/useFirestore';

export default function Events() {
  const { t } = useLanguage();
  const { data: events, loading, error } = useCollection('events');

  if (error) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center text-destructive">
        Error loading events: {error.message}
      </div>
    );
  }

  const upcomingEvents = events.filter((e: any) => e.status === 'upcoming');
  const pastEvents = events.filter((e: any) => e.status === 'past');

  const EventCard = ({ event, index }: { event: any; index: number }) => (
    <Card
      className="group overflow-hidden bg-card border-border hover:border-primary/50 transition-all duration-300 hover-glow"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="relative overflow-hidden h-48">
        <img
          src={event.image || 'https://via.placeholder.com/800x400'}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-4 right-4">
          <Badge className={event.status === 'upcoming' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}>
            {event.status === 'upcoming' ? t('upcomingEvents') : t('pastEvents')}
          </Badge>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
          {event.title}
        </h3>

        <p className="text-muted-foreground">{event.description}</p>

        <div className="space-y-2 text-sm">
          <div className="flex items-center text-muted-foreground">
            <Calendar className="w-4 h-4 mr-2 text-primary" />
            {event.date}
          </div>
          <div className="flex items-center text-muted-foreground">
            <MapPin className="w-4 h-4 mr-2 text-primary" />
            {event.location}
          </div>
          {event.attendees && (
            <div className="flex items-center text-muted-foreground">
              <Users className="w-4 h-4 mr-2 text-primary" />
              {event.attendees} attendees
            </div>
          )}
        </div>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-black text-foreground mb-4">
            {t('eventsTitle')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('eventsDescription')}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
        ) : (
          <>
            {/* Upcoming Events */}
            {upcomingEvents.length > 0 && (
              <div className="mb-16">
                <h2 className="text-3xl font-bold text-foreground mb-8 flex items-center">
                  <span className="text-primary mr-3">●</span>
                  {t('upcomingEvents')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {upcomingEvents.map((event, index) => (
                    <EventCard key={event.id} event={event} index={index} />
                  ))}
                </div>
              </div>
            )}

            {/* Past Events */}
            {pastEvents.length > 0 && (
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-8 flex items-center">
                  <span className="text-muted-foreground mr-3">●</span>
                  {t('pastEvents')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {pastEvents.map((event, index) => (
                    <EventCard key={event.id} event={event} index={index} />
                  ))}
                </div>
              </div>
            )}

            {events.length === 0 && (
              <div className="text-center py-20 text-muted-foreground">
                No events found.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

