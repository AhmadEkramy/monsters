import { useLanguage } from '@/contexts/LanguageContext';
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
}

export default function Committees() {
    const { t } = useLanguage();

    const committees: Committee[] = [
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
        },
    ];

    return (
        <div className="min-h-screen pt-24 pb-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16 animate-fade-in-up">
                    <h1 className="text-4xl md:text-6xl font-black text-foreground mb-4">
                        {t('committeesTitle')}
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        {t('committeesDescription')}
                    </p>
                </div>

                {/* Committees List */}
                <div className="space-y-24">
                    {committees.map((committee, index) => (
                        <div
                            key={committee.id}
                            className="animate-fade-in-up"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div
                                className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center ${committee.imagePosition === 'right' ? 'lg:flex-row-reverse' : ''
                                    }`}
                            >
                                {/* Image Section */}
                                <div
                                    className={`${committee.imagePosition === 'right' ? 'lg:order-2' : 'lg:order-1'
                                        }`}
                                >
                                    <div className="relative group">
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500" />
                                        <div className="relative bg-gradient-to-br from-background to-card rounded-3xl p-8 border border-border hover:border-primary/50 transition-all duration-500 hover-glow">
                                            <img
                                                src={committee.image}
                                                alt={committee.title}
                                                className="w-full h-auto object-contain transform group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Content Section */}
                                <div
                                    className={`${committee.imagePosition === 'right' ? 'lg:order-1' : 'lg:order-2'
                                        }`}
                                >
                                    <div className="space-y-6">
                                        <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                                            {committee.title}
                                        </h2>
                                        <p className="text-lg text-muted-foreground leading-relaxed">
                                            {committee.description}
                                        </p>

                                        {/* Responsibilities */}
                                        <div className="space-y-3">
                                            <h3 className="text-xl font-semibold text-foreground mb-4">
                                                {t('keyResponsibilities')}
                                            </h3>
                                            <div className="flex flex-wrap gap-3">
                                                {committee.responsibilities.map((resp, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="inline-flex items-center px-6 py-3 rounded-full bg-primary/10 text-primary font-medium text-sm border border-primary/20 hover:bg-primary/20 hover:border-primary/40 transition-all duration-300 hover-glow cursor-default"
                                                    >
                                                        {resp}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Divider (except for last item) */}
                            {index < committees.length - 1 && (
                                <div className="mt-24 border-t border-border/50" />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
