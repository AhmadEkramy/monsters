import { useLanguage } from '@/contexts/LanguageContext';
import { useCollection } from '@/hooks/useFirestore';
import { Loader2, Users, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface Member {
  id: string;
  name: string;
  committee: string;
  image?: string;
}

export default function Members() {
  const { t, language } = useLanguage();
  const { data: members, loading } = useCollection<Member>('members');
  const [selectedCommittee, setSelectedCommittee] = useState<string>('all');

  const committees = [
    { id: 'all', label: language === 'ar' ? 'الكل' : 'All' },
    { id: 'hr', label: t('hrCommittee') },
    { id: 'pr', label: t('prCommittee') },
    { id: 'creativity', label: t('creativityCommittee') },
    { id: 'organization', label: t('organizationCommittee') },
    { id: 'media', label: t('mediaCommittee') },
    { id: 'activity', label: t('activityCommittee') },
  ];

  const filteredMembers = selectedCommittee === 'all'
    ? members
    : members.filter(m => m.committee === selectedCommittee);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20 bg-background relative overflow-x-hidden">
      {/* Soft ambient background glow */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[700px] h-[320px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-secondary/80 border border-primary/20 backdrop-blur-md shadow-sm mb-4">
            <Users className="w-3.5 h-3.5 text-primary" />
            <span>{language === 'ar' ? 'أعضاء مونسترز' : 'Team Members'}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-foreground tracking-tight">
            <span className="bg-gradient-to-r from-foreground via-foreground/90 to-primary bg-clip-text text-transparent">
              {t('members') || (language === 'ar' ? 'أعضاء الفريق' : 'Our Members')}
            </span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mt-3 leading-relaxed">
            {language === 'ar'
              ? 'الطلاب المبدعون في مختلف لجان مونسترز الذين يحركون الطاقة والإبداع كل يوم.'
              : 'The creative students driving energy, creativity, and teamwork across all committees.'}
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12 animate-fade-in">
          {committees.map((committee) => {
            const isSelected = selectedCommittee === committee.id;
            return (
              <button
                key={committee.id}
                onClick={() => setSelectedCommittee(committee.id)}
                className={cn(
                  "px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 shadow-sm",
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-[0_0_15px_hsl(var(--primary)/0.35)] scale-105"
                    : "bg-secondary/60 text-muted-foreground hover:text-foreground border border-border/80 hover:border-primary/40"
                )}
              >
                {committee.label}
              </button>
            );
          })}
        </div>

        {/* Members Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMembers.length > 0 ? (
            filteredMembers.map((member, index) => (
              <div
                key={member.id}
                className="group animate-fade-in-up"
                style={{ animationDelay: `${index * 0.04}s` }}
              >
                <div className="relative overflow-hidden rounded-3xl bg-card/70 backdrop-blur-md border border-border/80 p-5 hover:border-primary/50 transition-all duration-500 shadow-lg hover:shadow-[0_0_25px_hsl(var(--primary)/0.18)] flex flex-col items-center group-hover:-translate-y-1">
                  
                  {/* Avatar Container */}
                  <div className="relative w-full aspect-square mb-4 overflow-hidden rounded-2xl bg-secondary/40 border border-border/60">
                    <img
                      src={member.image || 'https://via.placeholder.com/300'}
                      alt={member.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>

                  {/* Info */}
                  <div className="text-center space-y-1.5 w-full">
                    <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors truncate">
                      {member.name}
                    </h3>
                    <div>
                      <span className="inline-block px-3 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-bold uppercase tracking-wider border border-primary/20">
                        {committees.find(c => c.id === member.committee)?.label || member.committee}
                      </span>
                    </div>
                  </div>

                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center p-8 rounded-3xl bg-card/40 border border-border/80 max-w-md mx-auto">
              <Users className="w-10 h-10 text-primary/40 mx-auto mb-3" />
              <p className="text-muted-foreground font-medium">
                {language === 'ar' ? 'لا يوجد أعضاء في هذه اللجنة حتى الآن.' : 'No members found in this committee yet.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
