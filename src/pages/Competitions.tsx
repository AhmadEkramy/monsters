import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { Trophy, Award, Medal, Star, Loader2 } from 'lucide-react';
import { useCollection } from '@/hooks/useFirestore';

export default function Competitions() {
  const { t } = useLanguage();
  const { data: achievementsData, loading: achLoading, error: achError } = useCollection('achievements');
  const { data: competitionsData, loading: compLoading, error: compError } = useCollection('competitions');

  if (achError || compError) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center text-destructive">
        Error loading data: {(achError || compError)?.message}
      </div>
    );
  }

  const achievements = achievementsData;
  const competitions = competitionsData;
  const loading = achLoading || compLoading;

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

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
        ) : (
          <>
            {/* Achievements Section */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-foreground mb-8 flex items-center">
                <Trophy className="w-8 h-8 text-primary mr-3" />
                {t('achievements')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {achievements.map((achievement: any, index) => (
                  <Card
                    key={index}
                    className="group p-6 bg-card border-border hover:border-primary/50 transition-all duration-300 hover-glow"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <Trophy className={`w-12 h-12 text-primary`} />
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
                {competitions.map((competition: any, index) => (
                  <Card
                    key={index}
                    className="group overflow-hidden bg-card border-border hover:border-primary/50 transition-all duration-300 hover-glow"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="relative overflow-hidden h-48">
                      <img
                        src={competition.image || 'https://via.placeholder.com/800x400'}
                        alt={competition.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      {competition.status && (
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-primary text-primary-foreground">
                            {competition.status}
                          </Badge>
                        </div>
                      )}
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
          </>
        )}
      </div>
    </div>
  );
}

