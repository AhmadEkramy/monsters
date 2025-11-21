import { Card } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Calendar, MapPin, Camera } from 'lucide-react';

export default function Trips() {
  const { t } = useLanguage();

  const trips = [
    {
      title: 'Alexandria Tech Tour',
      date: 'December 2024',
      location: 'Alexandria, Egypt',
      images: [
        'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=800&q=80',
        'https://images.unsplash.com/photo-1547082661-214c5b3f34b3?w=800&q=80',
      ],
      description: 'Visited multiple tech companies and startups in Alexandria, networking with industry professionals and learning about the latest tech trends.',
    },
    {
      title: 'Cairo Innovation Summit',
      date: 'November 2024',
      location: 'Cairo, Egypt',
      images: [
        'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
        'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80',
      ],
      description: 'Attended the annual Cairo Innovation Summit, featuring workshops, keynote speeches, and networking opportunities.',
    },
    {
      title: 'Red Sea Team Retreat',
      date: 'September 2024',
      location: 'Sharm El Sheikh',
      images: [
        'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&q=80',
        'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&q=80',
      ],
      description: 'Team building activities, water sports, and relaxation by the beautiful Red Sea.',
    },
    {
      title: 'Desert Camping Adventure',
      date: 'March 2024',
      location: 'Siwa Oasis',
      images: [
        'https://images.unsplash.com/photo-1513002749550-c59d786b8e6c?w=800&q=80',
        'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&q=80',
      ],
      description: 'An unforgettable camping experience in the desert, stargazing and team bonding around the campfire.',
    },
  ];

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

        {/* Trips Grid */}
        <div className="space-y-12">
          {trips.map((trip, index) => (
            <Card
              key={index}
              className="group overflow-hidden bg-card border-border hover:border-primary/50 transition-all duration-300 hover-glow"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Images */}
                <div className="grid grid-cols-2 gap-2 p-2">
                  {trip.images.map((image, imgIndex) => (
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
                      <span className="font-medium">{trip.images.length} Photos</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
