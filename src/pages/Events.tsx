import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { Calendar, MapPin, Users } from 'lucide-react';

export default function Events() {
  const { t } = useLanguage();

  const upcomingEvents = [
    {
      title: 'AI Workshop',
      date: 'March 15, 2025',
      location: 'MNU Campus - Hall A',
      attendees: '50+',
      image: 'https://images.unsplash.com/photo-1591453089816-0fbb971b454c?w=800&q=80',
      description: 'Join us for an intensive workshop on Artificial Intelligence and Machine Learning fundamentals.',
      status: 'upcoming',
    },
    {
      title: 'Hackathon 2025',
      date: 'April 20-22, 2025',
      location: 'Innovation Center',
      attendees: '100+',
      image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80',
      description: '48-hour coding challenge with amazing prizes and networking opportunities.',
      status: 'upcoming',
    },
  ];

  const pastEvents = [
    {
      title: 'Tech Talk Series #3',
      date: 'January 10, 2025',
      location: 'MNU Campus',
      attendees: '80',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
      description: 'Guest speakers from leading tech companies shared their experiences and insights.',
      status: 'past',
    },
    {
      title: 'Team Building Day',
      date: 'December 15, 2024',
      location: 'Outdoor Center',
      attendees: '45',
      image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&q=80',
      description: 'A day of fun activities and team bonding exercises.',
      status: 'past',
    },
  ];

  const EventCard = ({ event, index }: { event: any; index: number }) => (
    <Card
      className="group overflow-hidden bg-card border-border hover:border-primary/50 transition-all duration-300 hover-glow"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="relative overflow-hidden h-48">
        <img
          src={event.image}
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
          <div className="flex items-center text-muted-foreground">
            <Users className="w-4 h-4 mr-2 text-primary" />
            {event.attendees} attendees
          </div>
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

        {/* Upcoming Events */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 flex items-center">
            <span className="text-primary mr-3">●</span>
            {t('upcomingEvents')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {upcomingEvents.map((event, index) => (
              <EventCard key={index} event={event} index={index} />
            ))}
          </div>
        </div>

        {/* Past Events */}
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-8 flex items-center">
            <span className="text-muted-foreground mr-3">●</span>
            {t('pastEvents')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {pastEvents.map((event, index) => (
              <EventCard key={index} event={event} index={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
