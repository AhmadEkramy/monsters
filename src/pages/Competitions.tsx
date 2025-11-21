import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { Trophy, Award, Medal, Star } from 'lucide-react';

export default function Competitions() {
  const { t } = useLanguage();

  const achievements = [
    {
      title: '1st Place - National Hackathon 2024',
      icon: Trophy,
      color: 'text-yellow-500',
      description: 'Won first place in the national university hackathon with our innovative AI-powered solution.',
      date: '2024',
    },
    {
      title: '2nd Place - Robotics Competition',
      icon: Award,
      color: 'text-gray-400',
      description: 'Secured second place in the regional robotics competition.',
      date: '2024',
    },
    {
      title: 'Best Team Award',
      icon: Star,
      color: 'text-primary',
      description: 'Recognized for outstanding teamwork and collaboration.',
      date: '2024',
    },
    {
      title: '3rd Place - Programming Contest',
      icon: Medal,
      color: 'text-orange-600',
      description: 'Achieved third place in the annual programming contest.',
      date: '2023',
    },
  ];

  const competitions = [
    {
      title: 'ACM ICPC Regional',
      image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80',
      description: 'Participated in the prestigious ACM International Collegiate Programming Contest.',
      status: 'Participated',
    },
    {
      title: 'Google HashCode',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80',
      description: 'Competed in Google\'s annual team programming competition.',
      status: 'Top 100',
    },
    {
      title: 'NASA Space Apps Challenge',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80',
      description: 'Developed innovative solutions for space exploration challenges.',
      status: 'Finalist',
    },
    {
      title: 'Microsoft Imagine Cup',
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80',
      description: 'Showcased our project at Microsoft\'s premier student technology competition.',
      status: 'Semi-Finalist',
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-black text-foreground mb-4">
            {t('competitionsTitle')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('competitionsDescription')}
          </p>
        </div>

        {/* Achievements Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 flex items-center">
            <Trophy className="w-8 h-8 text-primary mr-3" />
            {t('achievements')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {achievements.map((achievement, index) => (
              <Card
                key={index}
                className="group p-6 bg-card border-border hover:border-primary/50 transition-all duration-300 hover-glow"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <achievement.icon className={`w-12 h-12 ${achievement.color}`} />
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                      {achievement.title}
                    </h3>
                    <p className="text-muted-foreground">{achievement.description}</p>
                    <Badge variant="outline" className="text-primary border-primary">
                      {achievement.date}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Competitions Section */}
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-8 flex items-center">
            <Star className="w-8 h-8 text-primary mr-3" />
            {t('competitions')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {competitions.map((competition, index) => (
              <Card
                key={index}
                className="group overflow-hidden bg-card border-border hover:border-primary/50 transition-all duration-300 hover-glow"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative overflow-hidden h-48">
                  <img
                    src={competition.image}
                    alt={competition.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-primary text-primary-foreground">
                      {competition.status}
                    </Badge>
                  </div>
                </div>
                <div className="p-6 space-y-3">
                  <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                    {competition.title}
                  </h3>
                  <p className="text-muted-foreground">{competition.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
