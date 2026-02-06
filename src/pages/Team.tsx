import { Card } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Facebook, Github, Linkedin, Twitter, Loader2 } from 'lucide-react';
import { useCollection } from '@/hooks/useFirestore';

export default function Team() {
  const { t } = useLanguage();
  const { data: teamMembers, loading, error } = useCollection('team');

  if (error) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center text-destructive">
        Error loading team: {error.message}
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-black text-foreground mb-4">
            {t('teamTitle')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('teamDescription')}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member: any, index) => (
              <Card
                key={index}
                className="group overflow-hidden bg-card border-border hover:border-primary/50 transition-all duration-300 hover-glow"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={member.image || 'https://via.placeholder.com/300'}
                    alt={member.name}
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                      {member.name}
                    </h3>
                    <p className="text-muted-foreground">{member.position}</p>
                  </div>

                  <div className="flex space-x-3 pt-2">
                    {member.social?.facebook && (
                      <a href={member.social.facebook} className="text-muted-foreground hover:text-primary transition-colors duration-300 hover-glow" target="_blank" rel="noopener noreferrer">
                        <Facebook className="w-5 h-5" />
                      </a>
                    )}
                    {member.social?.twitter && (
                      <a href={member.social.twitter} className="text-muted-foreground hover:text-primary transition-colors duration-300 hover-glow" target="_blank" rel="noopener noreferrer">
                        <Twitter className="w-5 h-5" />
                      </a>
                    )}
                    {member.social?.linkedin && (
                      <a href={member.social.linkedin} className="text-muted-foreground hover:text-primary transition-colors duration-300 hover-glow" target="_blank" rel="noopener noreferrer">
                        <Linkedin className="w-5 h-5" />
                      </a>
                    )}
                    {member.social?.github && (
                      <a href={member.social.github} className="text-muted-foreground hover:text-primary transition-colors duration-300 hover-glow" target="_blank" rel="noopener noreferrer">
                        <Github className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

