import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCollection } from '@/hooks/useFirestore';
import { Loader2, Facebook, Twitter, Linkedin, Github, Instagram, Crown, ExternalLink, X, Sparkles, Shield, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TeamMember {
  id: string;
  name: string;
  position: string;
  image?: string;
  tier?: string;
  section?: string;
  sectionBadge?: string;
  isLeader?: boolean;
  season?: string;
  parentId?: string | null;
  order?: number;
  social?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    github?: string;
    instagram?: string;
  };
}

type MemberTier = 'supervisor' | 'president' | 'vice' | 'leader' | 'other';

function getMemberTier(member: TeamMember): MemberTier {
  if (member.tier) {
    return member.tier as MemberTier;
  }
  const sec = (member.section || '').toLowerCase();
  const pos = (member.position || '').toLowerCase();

  // Explicit section overrides
  if (sec.includes('university') || sec.includes('supervis') || sec.includes('guidance') || sec.includes('mentor')) {
    return 'supervisor';
  }
  if (sec.includes('president') && !sec.includes('vice')) return 'president';
  if (sec.includes('vice') || sec.includes('deputy')) return 'vice';
  if (sec.includes('leader') || sec.includes('head') || sec.includes('committee')) return 'leader';

  // Position keyword matching
  if (pos.includes('supervisor') || pos.includes('prof') || pos.includes('dean') || pos.includes('مشرف') || pos.includes('دكتور')) {
    return 'supervisor';
  }
  if ((pos.includes('president') || pos.includes('chairperson') || pos.includes('رئيس')) && !pos.includes('vice') && !pos.includes('نائب')) {
    return 'president';
  }
  if (pos.includes('vice') || pos.includes('deputy') || pos.includes('نائب') || pos.includes('co-')) {
    return 'vice';
  }
  if (pos.includes('leader') || pos.includes('head') || pos.includes('قائد') || pos.includes('مسؤول') || member.isLeader) {
    return 'leader';
  }

  return 'leader';
}

export default function Team() {
  const { t, language } = useLanguage();
  const { data: teamMembers, loading } = useCollection<TeamMember>('team');
  const { data: dbSections } = useCollection('team_sections');
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [activeSeason, setActiveSeason] = useState<string>('2025 - PRESENT');

  // Close modal on Escape key press and manage body scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedMember(null);
      }
    };

    if (selectedMember) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedMember]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  // Predefined season tabs with modern labels and icons
  const seasonTabs = [
    {
      id: 'current',
      seasonKey: '2025 - PRESENT',
      label: language === 'ar' ? 'المجلس الحالي • 2024 - 2025' : 'Current Board • 2024 - 2025',
      icon: Crown,
    },
    {
      id: 'founders',
      seasonKey: '2023 - 2025 #FOUNDERS',
      label: language === 'ar' ? 'المؤسسون • Founders' : 'Founders • 2023 - 2024',
      icon: Sparkles,
    },
  ];

  // Filter members by selected season
  const filteredMembers = teamMembers.filter(m => {
    const mSeason = m.season || '2025 - PRESENT';
    if (activeSeason === '2025 - PRESENT' || activeSeason === 'current') {
      return mSeason === '2025 - PRESENT' || mSeason === 'current' || mSeason.includes('2024') || mSeason.includes('Current');
    }
    if (activeSeason === '2023 - 2025 #FOUNDERS' || activeSeason === 'founders') {
      return mSeason === '2023 - 2025 #FOUNDERS' || mSeason === 'founders' || mSeason.includes('FOUNDERS') || mSeason.includes('Founders');
    }
    return mSeason === activeSeason;
  });

  // Sort members within each tier by order
  const sortByOrder = (a: TeamMember, b: TeamMember) => (a.order || 0) - (b.order || 0);

  // Group members into the 4 main requested فقرات (Tiers)
  const supervisors = filteredMembers.filter(m => getMemberTier(m) === 'supervisor').sort(sortByOrder);
  const presidents = filteredMembers.filter(m => getMemberTier(m) === 'president').sort(sortByOrder);
  const vices = filteredMembers.filter(m => getMemberTier(m) === 'vice').sort(sortByOrder);
  const leaders = filteredMembers.filter(m => getMemberTier(m) === 'leader' || getMemberTier(m) === 'other').sort(sortByOrder);

  // Dynamic or default sections config
  const defaultSections = [
    {
      tierId: 'president',
      titleAr: 'رئيس مجلس الإدارة',
      titleEn: 'The President',
      badgeAr: 'رئاسة المجلس التنفيذي',
      badgeEn: 'EXECUTIVE PRESIDENCY',
      order: 1,
    },
    {
      tierId: 'leader',
      titleAr: 'قادة اللجان',
      titleEn: 'Board Leaders',
      badgeAr: 'قادة ومسؤولو اللجان',
      badgeEn: 'COMMITTEE HEADS',
      order: 2,
    },
    {
      tierId: 'vice',
      titleAr: 'نواب الرئيس',
      titleEn: 'Vice Leadership',
      badgeAr: 'نواب الرئيس والإدارة',
      badgeEn: 'VICE LEADERSHIP',
      order: 3,
    },
    {
      tierId: 'supervisor',
      titleAr: 'الإشراف والتوجيه',
      titleEn: 'Guidance & Mentorship',
      badgeAr: 'الإشراف والتوجيه الأكاديمي',
      badgeEn: 'ACADEMIC SUPERVISION',
      order: 4,
    },
  ];

  const sectionsList = dbSections && dbSections.length > 0
    ? [...dbSections].sort((a: any, b: any) => (Number(a.order) || 0) - (Number(b.order) || 0))
    : defaultSections;

  const ICONS: Record<string, any> = {
    president: Crown,
    leader: Users,
    vice: Shield,
    supervisor: Sparkles,
  };

  const getTierMembers = (tierId: string) => {
    switch (tierId) {
      case 'president': return presidents;
      case 'leader': return leaders;
      case 'vice': return vices;
      case 'supervisor': return supervisors;
      default: return [];
    }
  };

  const tiersConfig = sectionsList.map((sec: any) => {
    const tierId = sec.tierId || sec.id;
    return {
      id: tierId,
      badge: language === 'ar' ? (sec.badgeAr || sec.badge || '') : (sec.badgeEn || sec.badge || ''),
      title: language === 'ar' ? (sec.titleAr || sec.title || '') : (sec.titleEn || sec.title || ''),
      icon: ICONS[tierId] || Users,
      members: getTierMembers(tierId),
      spacing: tierId === 'leader' ? 'gap-6 sm:gap-8 md:gap-12 lg:gap-16' : 'gap-8 sm:gap-12 md:gap-16',
    };
  });

  const activeTiers = tiersConfig.filter(t => t.members.length > 0);

  return (
    <div className="min-h-screen pt-24 sm:pt-28 pb-28 bg-background relative overflow-x-hidden">
      {/* Soft ambient background glow */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-primary/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10 max-w-7xl">
        
        {/* Top Modern Neon-Green Segmented Dock Tabs */}
        <div className="flex justify-center items-center mb-14 sm:mb-20 animate-fade-in">
          <div className="inline-flex p-1.5 rounded-full bg-secondary/50 border border-border/80 backdrop-blur-xl shadow-lg gap-1.5 max-w-full overflow-x-auto">
            {seasonTabs.map((tab) => {
              const isActive = activeSeason === tab.seasonKey;
              const TabIcon = tab.icon;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSeason(tab.seasonKey)}
                  className={cn(
                    "px-4 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-extrabold tracking-wider transition-all duration-300 flex items-center gap-2 shrink-0 cursor-pointer",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-[0_0_20px_hsl(var(--primary)/0.5)] border border-primary scale-[1.02]"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/70 border border-transparent"
                  )}
                >
                  <TabIcon className={cn("w-4 h-4", isActive ? "text-primary-foreground animate-pulse" : "text-muted-foreground")} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Render Each فقرة (Tier Section) */}
        {activeTiers.length > 0 ? (
          <div className="space-y-16 sm:space-y-24">
            {activeTiers.map((tier, index) => {
              const TierIcon = tier.icon;
              const isLast = index === activeTiers.length - 1;

              return (
                <div key={tier.id} className="flex flex-col items-center animate-fade-in-up">
                  
                  {/* Section Title & Badge */}
                  <div className="text-center mb-8 sm:mb-12 max-w-3xl mx-auto px-2">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-bold tracking-widest uppercase bg-primary/10 text-primary border border-primary/30 shadow-[0_0_15px_hsl(var(--primary)/0.2)] mb-3">
                      <TierIcon className="w-3.5 h-3.5 text-primary" />
                      <span>{tier.badge}</span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-foreground tracking-wider uppercase">
                      <span className="bg-gradient-to-r from-foreground via-foreground/90 to-primary bg-clip-text text-transparent">
                        {tier.title}
                      </span>
                    </h2>
                  </div>

                  {/* Members Row / Grid (Spacious, Uniform Sizes) */}
                  <div className="w-full flex flex-wrap justify-center items-center gap-6 sm:gap-8 md:gap-10 lg:gap-12 max-w-6xl mx-auto">
                    {tier.members.map((member) => (
                      <MemberCard
                        key={member.id}
                        member={member}
                        tier={tier.id as MemberTier}
                        onSelectMember={setSelectedMember}
                      />
                    ))}
                  </div>

                  {/* Elegant Section Divider Between Sections */}
                  {!isLast && (
                    <div className="flex items-center justify-center mt-16 sm:mt-24 w-full max-w-sm sm:max-w-md mx-auto px-4">
                      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/20 to-primary/50" />
                      <div className="mx-3 flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                        <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary))]" />
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                      </div>
                      <div className="h-px flex-1 bg-gradient-to-l from-transparent via-primary/20 to-primary/50" />
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 p-8 rounded-3xl bg-card/40 border border-border/80 max-w-md mx-auto">
            <Crown className="w-12 h-12 text-primary/40 mx-auto mb-3" />
            <p className="text-muted-foreground font-medium">
              {language === 'ar' ? 'لا توجد بيانات بورد في هذه الدفعة حتى الآن.' : 'No board members found in this season.'}
            </p>
          </div>
        )}

      </div>

      {/* Profile Detail Modal Popup */}
      {selectedMember && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedMember(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-full max-w-md p-6 sm:p-8 bg-card border border-primary/40 rounded-3xl shadow-2xl text-center overflow-hidden animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ambient Top Glow in Modal */}
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={() => setSelectedMember(null)}
              className="absolute top-4 right-4 rtl:right-auto rtl:left-4 w-9 h-9 rounded-full bg-secondary/80 hover:bg-primary/20 hover:text-primary text-muted-foreground flex items-center justify-center transition-colors border border-border/80 z-20"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative z-10 flex flex-col items-center pt-2">
              
              {/* Large Avatar with Glow Ring */}
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full p-1 border-2 border-primary bg-card/90 shadow-[0_0_25px_hsl(var(--primary)/0.4)] overflow-hidden mb-4">
                <img
                  src={selectedMember.image || 'https://via.placeholder.com/300'}
                  alt={selectedMember.name}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>

              {/* Name & Role */}
              <h3 className="text-xl sm:text-2xl font-black text-foreground uppercase tracking-wider">
                {selectedMember.name}
              </h3>
              
              <div className="mt-1.5 mb-2">
                <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-primary/15 text-primary border border-primary/30">
                  {selectedMember.position}
                </span>
              </div>

              {/* Social Accounts Section */}
              <div className="w-full mt-6 pt-6 border-t border-border/60 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {language === 'ar' ? 'حسابات التواصل' : 'Social Accounts'}
                </h4>

                <div className="flex flex-col gap-2.5 w-full">
                  {selectedMember.social?.linkedin && (
                    <a
                      href={selectedMember.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between px-4 py-3 rounded-xl bg-secondary/60 hover:bg-primary/20 hover:text-primary text-foreground border border-border/70 hover:border-primary/50 transition-all font-semibold text-sm shadow-sm group"
                    >
                      <div className="flex items-center gap-3">
                        <Linkedin className="w-4 h-4 text-primary" />
                        <span>LinkedIn</span>
                      </div>
                      <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                    </a>
                  )}

                  {selectedMember.social?.facebook && (
                    <a
                      href={selectedMember.social.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between px-4 py-3 rounded-xl bg-secondary/60 hover:bg-primary/20 hover:text-primary text-foreground border border-border/70 hover:border-primary/50 transition-all font-semibold text-sm shadow-sm group"
                    >
                      <div className="flex items-center gap-3">
                        <Facebook className="w-4 h-4 text-primary" />
                        <span>Facebook</span>
                      </div>
                      <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                    </a>
                  )}

                  {selectedMember.social?.instagram && (
                    <a
                      href={selectedMember.social.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between px-4 py-3 rounded-xl bg-secondary/60 hover:bg-primary/20 hover:text-primary text-foreground border border-border/70 hover:border-primary/50 transition-all font-semibold text-sm shadow-sm group"
                    >
                      <div className="flex items-center gap-3">
                        <Instagram className="w-4 h-4 text-primary" />
                        <span>Instagram</span>
                      </div>
                      <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                    </a>
                  )}

                  {selectedMember.social?.github && (
                    <a
                      href={selectedMember.social.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between px-4 py-3 rounded-xl bg-secondary/60 hover:bg-primary/20 hover:text-primary text-foreground border border-border/70 hover:border-primary/50 transition-all font-semibold text-sm shadow-sm group"
                    >
                      <div className="flex items-center gap-3">
                        <Github className="w-4 h-4 text-primary" />
                        <span>GitHub</span>
                      </div>
                      <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                    </a>
                  )}

                  {selectedMember.social?.twitter && (
                    <a
                      href={selectedMember.social.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between px-4 py-3 rounded-xl bg-secondary/60 hover:bg-primary/20 hover:text-primary text-foreground border border-border/70 hover:border-primary/50 transition-all font-semibold text-sm shadow-sm group"
                    >
                      <div className="flex items-center gap-3">
                        <Twitter className="w-4 h-4 text-primary" />
                        <span>Twitter / X</span>
                      </div>
                      <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                    </a>
                  )}

                  {(!selectedMember.social || !Object.values(selectedMember.social).some(Boolean)) && (
                    <p className="text-sm text-muted-foreground py-2 italic">
                      {language === 'ar' ? 'لا توجد حسابات تواصل مضافة لهذا العضو.' : 'No social accounts linked for this member.'}
                    </p>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// Modern Spacious Member Card (NO tree lines, NO green stems)
function MemberCard({
  member,
  onSelectMember,
}: {
  member: TeamMember;
  tier?: MemberTier;
  onSelectMember: (m: TeamMember) => void;
}) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectMember(member);
  };

  return (
    <div
      onClick={handleClick}
      className="flex flex-col items-center group cursor-pointer transition-all duration-300 py-1"
      role="button"
      tabIndex={0}
      title="اضغط لعرض الحسابات والتفاصيل"
    >
      {/* Circular Avatar with Glowing Neon Ring - Exact Same Size for all */}
      <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full p-1 border-2 border-primary/70 bg-card/90 shadow-[0_0_20px_hsl(var(--primary)/0.35)] transition-all duration-500 group-hover:scale-105 active:scale-95 group-hover:shadow-[0_0_35px_hsl(var(--primary)/0.6)] group-hover:border-primary shrink-0 aspect-square flex items-center justify-center ring-2 sm:ring-4 ring-primary/20">
        <div className="w-full h-full rounded-full overflow-hidden bg-secondary/50 pointer-events-none aspect-square">
          <img
            src={member.image || 'https://via.placeholder.com/300'}
            alt={member.name}
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </div>

      {/* Uniform Name & Position Card Box Below Avatar */}
      <div className="mt-3 rounded-2xl bg-card/90 backdrop-blur-md border border-border/80 shadow-xl text-center group-hover:border-primary/60 group-hover:shadow-[0_0_25px_hsl(var(--primary)/0.25)] transition-all duration-300 group-hover:-translate-y-0.5 flex flex-col justify-center w-40 sm:w-48 md:w-52 p-3 min-h-[64px] sm:min-h-[70px]">
        <h3 className="font-black uppercase tracking-tight sm:tracking-wider text-foreground group-hover:text-primary transition-colors text-xs sm:text-sm leading-snug break-words whitespace-normal line-clamp-2">
          {member.name}
        </h3>

        <p className="font-bold text-primary uppercase tracking-tight sm:tracking-wider text-[10px] sm:text-xs mt-0.5 leading-tight break-words whitespace-normal line-clamp-2">
          {member.position}
        </p>
      </div>

    </div>
  );
}
