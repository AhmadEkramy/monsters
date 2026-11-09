import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCollection } from '@/hooks/useFirestore';
import { Loader2, Layers, CheckCircle2, Sparkles, Users, Zap, ArrowRight, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import hrImage from '@/assets/hr_committee_illustration_1770216759977.png';
import prImage from '@/assets/pr_committee_illustration_1770216787070.png';
import creativityImage from '@/assets/creativity_committee_illustration_1770216801966.png';
import organizationImage from '@/assets/organization_committee_illustration_1770216820841.png';
import mediaImage from '@/assets/media_committee_illustration_1770216840493.png';
import activityImage from '@/assets/activity_committee_illustration_1770216858006.png';

interface Committee {
  id: string;
  title: string;
  description: string;
  responsibilities: string[];
  image: string;
  imagePosition: 'left' | 'right';
  order?: number;
}

function getCommitteeMetadata(title: string, language: 'en' | 'ar') {
  const t = (title || '').toLowerCase();
  if (t.includes('media') || t.includes('ميديا') || t.includes('إعلام')) {
    return {
      category: language === 'ar' ? 'التوثيق والمحتوى الرقمي' : 'Digital Media & Coverage',
      defaultResp: language === 'ar'
        ? ['التصوير الفوتوغرافي', 'صناعة ومونتاج الفيديو', 'إدارة السوشيال ميديا', 'نشر وتغطية الفعاليات']
        : ['Photography & Studio', 'Videography & Reels', 'Video Editing & VFX', 'Social Media Management'],
      stats: language === 'ar' ? 'تغطية مستمرة' : 'Active Coverage'
    };
  }
  if (t.includes('hr') || t.includes('human') || t.includes('بشرية')) {
    return {
      category: language === 'ar' ? 'إدارة وتطوير الكفاءات' : 'People & Culture',
      defaultResp: language === 'ar'
        ? ['إدارة ومتابعة الأعضاء', 'المقابلات الشخصية والتقييم', 'تنظيم ورش تطوير المهارات', 'تعزيز بيئة العمل الإيجابية']
        : ['Member Onboarding', 'Recruitment & Interviews', 'Performance & Evaluation', 'Team Building Sessions'],
      stats: language === 'ar' ? 'بيئة إيجابية' : 'Positive Morale'
    };
  }
  if (t.includes('pr') || t.includes('public') || t.includes('علاقات')) {
    return {
      category: language === 'ar' ? 'العلاقات والشراكات' : 'Public Relations & Outreach',
      defaultResp: language === 'ar'
        ? ['استقطاب الرعاة والشركاء', 'التواصل مع الجهات الرسمية', 'تمثيل الفريق في المحافل', 'بناء وتوسيع شبكة العلاقات']
        : ['Sponsorship Acquisition', 'External Partnerships', 'Official Delegations', 'Brand Representation'],
      stats: language === 'ar' ? 'شراكات قوية' : 'Strategic Outreach'
    };
  }
  if (t.includes('creat') || t.includes('ابتكار') || t.includes('إبداع')) {
    return {
      category: language === 'ar' ? 'الهوية البصرية والتصميم' : 'Creative Design & Visuals',
      defaultResp: language === 'ar'
        ? ['تصميم الهوية البصرية', 'ابتكار الثيمات والأفكار', 'تصميم بوسترات الفعاليات', 'الديكور والإخراج الفني']
        : ['Visual Identity Design', 'Creative Theme Concepts', 'Event Branding Posters', 'Artistic Direction'],
      stats: language === 'ar' ? 'إبداع بصري' : 'Visual Innovation'
    };
  }
  if (t.includes('organ') || t.includes('تنظيم')) {
    return {
      category: language === 'ar' ? 'اللوجستيات وإدارة العمليات' : 'Logistics & Operations',
      defaultResp: language === 'ar'
        ? ['التخطيط الميداني والجدولة', 'إدارة الحشود وتسهيل الحركة', 'تجهيز القاعات والمعدات', 'متابعة العمليات اللوجستية']
        : ['Event Logistics & Setup', 'Crowd Flow & Security', 'Schedule Coordination', 'On-Ground Operations'],
      stats: language === 'ar' ? 'تنظيم دقيق' : 'Seamless Logistics'
    };
  }
  if (t.includes('activ') || t.includes('نشاط') || t.includes('ترفيه')) {
    return {
      category: language === 'ar' ? 'الأنشطة الترفيهية والألعاب' : 'Entertainment & Activities',
      defaultResp: language === 'ar'
        ? ['ابتكار ألعاب ومسابقات مرحة', 'كسر الروتين ودمج الحضور', 'تنظيم الأنشطة الحماسية', 'إشعال الروح التفاعلية']
        : ['Icebreakers & Games', 'Interactive Competitions', 'Energy & Engagement', 'Entertainment Programs'],
      stats: language === 'ar' ? 'طاقة وحماس' : 'High Energy'
    };
  }
  return {
    category: language === 'ar' ? 'لجنة معتمدة' : 'Official Committee',
    defaultResp: language === 'ar'
      ? ['التخطيط والتنفيذ المتقن', 'التعاون المستمر بين الأعضاء', 'المساهمة في نجاح الفعاليات']
      : ['Strategic Planning', 'Collaborative Execution', 'Event Excellence'],
    stats: language === 'ar' ? 'فريق متكامل' : 'Dedicated Crew'
  };
}

export default function Committees() {
  const { t, language } = useLanguage();
  const isRtl = language === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;
  const { data: firestoreCommittees, loading } = useCollection('committees_data');

  // Hardcoded fallback data (used when Firestore has no data)
  const defaultCommittees: Committee[] = [
    {
      id: 'hr',
      title: t('hrCommittee'),
      description: t('hrDescription'),
      responsibilities: [
        t('hrResp1'),
        t('hrResp2'),
        t('hrResp3'),
        t('hrResp4'),
      ],
      image: hrImage,
      imagePosition: 'left',
      order: 0,
    },
    {
      id: 'pr',
      title: t('prCommittee'),
      description: t('prDescription'),
      responsibilities: [
        t('prResp1'),
        t('prResp2'),
        t('prResp3'),
        t('prResp4'),
      ],
      image: prImage,
      imagePosition: 'right',
      order: 1,
    },
    {
      id: 'creativity',
      title: t('creativityCommittee'),
      description: t('creativityDescription'),
      responsibilities: [
        t('creativityResp1'),
        t('creativityResp2'),
        t('creativityResp3'),
        t('creativityResp4'),
      ],
      image: creativityImage,
      imagePosition: 'left',
      order: 2,
    },
    {
      id: 'organization',
      title: t('organizationCommittee'),
      description: t('organizationDescription'),
      responsibilities: [
        t('organizationResp1'),
        t('organizationResp2'),
        t('organizationResp3'),
        t('organizationResp4'),
      ],
      image: organizationImage,
      imagePosition: 'right',
      order: 3,
    },
    {
      id: 'media',
      title: t('mediaCommittee'),
      description: t('mediaDescription'),
      responsibilities: [
        t('mediaResp1'),
        t('mediaResp2'),
        t('mediaResp3'),
        t('mediaResp4'),
      ],
      image: mediaImage,
      imagePosition: 'left',
      order: 4,
    },
    {
      id: 'activity',
      title: t('activityCommittee'),
      description: t('activityDescription'),
      responsibilities: [
        t('activityResp1'),
        t('activityResp2'),
        t('activityResp3'),
        t('activityResp4'),
      ],
      image: activityImage,
      imagePosition: 'right',
      order: 5,
    },
  ];

  // Use Firestore data if available, otherwise fall back to defaults
  const committees: Committee[] = firestoreCommittees.length > 0
    ? (firestoreCommittees as any[])
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map((c, index) => ({
          id: c.id,
          title: c.title,
          description: c.description,
          responsibilities: c.responsibilities || [],
          image: c.image || '',
          imagePosition: (index % 2 === 0 ? 'left' : 'right') as 'left' | 'right',
          order: c.order || index,
        }))
    : defaultCommittees;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20 bg-background relative overflow-x-hidden">
      {/* Soft ambient background glow */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[700px] h-[320px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-14 sm:mb-16 animate-fade-in-up max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-secondary/80 border border-primary/20 backdrop-blur-md shadow-sm mb-4">
            <Layers className="w-3.5 h-3.5 text-primary" />
            <span>{language === 'ar' ? 'الهيكل التنظيمي واللجان' : 'Committees & Structure'}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-foreground tracking-tight">
            <span className="bg-gradient-to-r from-foreground via-foreground/90 to-primary bg-clip-text text-transparent">
              {t('committeesTitle')}
            </span>
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto mt-3 leading-relaxed">
            {t('committeesDescription')}
          </p>
        </div>

        {/* Committees List */}
        <div className="space-y-8 sm:space-y-10">
          {committees.map((committee, index) => {
            const isImageRight = committee.imagePosition === 'right';
            const meta = getCommitteeMetadata(committee.title, language);
            const resps = committee.responsibilities && committee.responsibilities.length > 0
              ? committee.responsibilities
              : meta.defaultResp;

            return (
              <div
                key={committee.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                <div className="relative rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-7 bg-card/70 backdrop-blur-xl border border-border/80 hover:border-primary/50 transition-all duration-300 shadow-lg hover:shadow-[0_0_25px_hsl(var(--primary)/0.12)] group overflow-hidden">
                  
                  {/* Subtle corner aura */}
                  <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-bl-full pointer-events-none group-hover:bg-primary/10 transition-colors blur-xl" />

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center relative z-10">
                    
                    {/* Image Section (4 cols on desktop) */}
                    <div
                      className={`lg:col-span-4 flex justify-center ${
                        isImageRight ? 'lg:order-2' : 'lg:order-1'
                      }`}
                    >
                      <div className="relative w-40 h-40 sm:w-48 sm:h-48 md:w-52 md:h-52 mx-auto">
                        <div className="absolute inset-0 bg-primary/15 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500 opacity-70" />
                        <div className="relative w-full h-full rounded-2xl sm:rounded-3xl bg-secondary/40 border border-border/80 group-hover:border-primary/40 transition-all duration-300 p-3 sm:p-4 flex items-center justify-center overflow-hidden shadow-inner">
                          <img
                            src={committee.image}
                            alt={committee.title}
                            className="w-full h-full object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Content Section (8 cols on desktop) */}
                    <div
                      className={`lg:col-span-8 space-y-4 ${
                        isImageRight ? 'lg:order-1' : 'lg:order-2'
                      }`}
                    >
                      {/* Top Meta Badges Strip */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-black bg-primary/15 text-primary border border-primary/30 font-mono">
                          #{String(index + 1).padStart(2, '0')}
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-secondary/80 text-foreground/90 border border-border/80">
                          <Sparkles className="w-3 h-3 text-primary" />
                          {meta.category}
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-primary/10 text-primary border border-primary/20 ml-auto rtl:ml-0 rtl:mr-auto">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                          {meta.stats}
                        </span>
                      </div>

                      {/* Title & Description */}
                      <div className="space-y-1.5">
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-foreground group-hover:text-primary transition-colors tracking-tight">
                          {committee.title}
                        </h2>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-3">
                          {committee.description}
                        </p>
                      </div>

                      {/* Responsibilities & Tasks Tags */}
                      {resps && resps.length > 0 && (
                        <div className="space-y-2 pt-1">
                          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                            <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                            <span>{language === 'ar' ? 'أبرز مهام ومسؤوليات اللجنة:' : 'Key Responsibilities & Tasks:'}</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5 sm:gap-2">
                            {resps.map((resp: string, idx: number) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-secondary/50 hover:bg-primary/10 text-foreground/90 hover:text-primary border border-border/70 hover:border-primary/40 transition-all text-xs font-medium"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                                {resp}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Card Footer Strip with Details & Link */}
                      <div className="pt-3 border-t border-border/50 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-3">
                          <span className="inline-flex items-center gap-1 text-[11px]">
                            <Users className="w-3.5 h-3.5 text-primary" />
                            <span>{language === 'ar' ? 'فريق عمل متكامل' : 'Monsters Crew'}</span>
                          </span>
                          <span className="inline-flex items-center gap-1 text-[11px]">
                            <Zap className="w-3.5 h-3.5 text-primary" />
                            <span>{language === 'ar' ? 'أنشطة مستمرة' : 'Active Scope'}</span>
                          </span>
                        </div>

                        <Link
                          to="/members"
                          className="inline-flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 font-bold transition-colors group/link"
                        >
                          <span>{language === 'ar' ? 'استعرض أعضاء اللجنة' : 'View Committee Members'}</span>
                          <ArrowIcon className="w-3.5 h-3.5 group-hover/link:translate-x-1 rtl:group-hover/link:-translate-x-1 transition-transform" />
                        </Link>
                      </div>

                    </div>

                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
