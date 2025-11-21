import { Card } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Facebook, Github, Linkedin, Twitter } from 'lucide-react';

export default function Team() {
  const { t } = useLanguage();

  // Sample team members (you can expand this)
  const teamMembers = [
    {
      name: 'Ahmed Hassan',
      position: 'Team Leader',
      image: 'https://ui-avatars.com/api/?name=Ahmed+Hassan&size=400&background=4ef037&color=1a1a1a&bold=true',
      social: {
        facebook: '#',
        twitter: '#',
        linkedin: '#',
        github: '#',
      },
    },
    {
      name: 'Sara Mohamed',
      position: 'Technical Lead',
      image: 'https://ui-avatars.com/api/?name=Sara+Mohamed&size=400&background=4ef037&color=1a1a1a&bold=true',
      social: {
        facebook: '#',
        linkedin: '#',
      },
    },
    {
      name: 'Omar Khaled',
      position: 'Events Coordinator',
      image: 'https://ui-avatars.com/api/?name=Omar+Khaled&size=400&background=4ef037&color=1a1a1a&bold=true',
      social: {
        twitter: '#',
        github: '#',
      },
    },
    {
      name: 'Fatma Ali',
      position: 'Marketing Lead',
      image: 'https://ui-avatars.com/api/?name=Fatma+Ali&size=400&background=4ef037&color=1a1a1a&bold=true',
      social: {
        facebook: '#',
        linkedin: '#',
      },
    },
    {
      name: 'Youssef Ibrahim',
      position: 'Developer',
      image: 'https://ui-avatars.com/api/?name=Youssef+Ibrahim&size=400&background=4ef037&color=1a1a1a&bold=true',
      social: {
        github: '#',
        linkedin: '#',
      },
    },
    {
      name: 'Nour Ahmed',
      position: 'Designer',
      image: 'https://ui-avatars.com/api/?name=Nour+Ahmed&size=400&background=4ef037&color=1a1a1a&bold=true',
      social: {
        twitter: '#',
        linkedin: '#',
      },
    },
  ];

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

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <Card
              key={index}
              className="group overflow-hidden bg-card border-border hover:border-primary/50 transition-all duration-300 hover-glow"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative overflow-hidden">
                <img
                  src={member.image}
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

                {/* Social Links */}
                <div className="flex space-x-3 pt-2">
                  {member.social.facebook && (
                    <a
                      href={member.social.facebook}
                      className="text-muted-foreground hover:text-primary transition-colors duration-300 hover-glow"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Facebook className="w-5 h-5" />
                    </a>
                  )}
                  {member.social.twitter && (
                    <a
                      href={member.social.twitter}
                      className="text-muted-foreground hover:text-primary transition-colors duration-300 hover-glow"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Twitter className="w-5 h-5" />
                    </a>
                  )}
                  {member.social.linkedin && (
                    <a
                      href={member.social.linkedin}
                      className="text-muted-foreground hover:text-primary transition-colors duration-300 hover-glow"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                  )}
                  {member.social.github && (
                    <a
                      href={member.social.github}
                      className="text-muted-foreground hover:text-primary transition-colors duration-300 hover-glow"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
