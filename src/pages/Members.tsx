import { useLanguage } from '@/contexts/LanguageContext';
import { useCollection } from '@/hooks/useFirestore';
import { Loader2, Users } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface Member {
    id: string;
    name: string;
    committee: string;
    image?: string;
}

export default function Members() {
    const { t } = useLanguage();
    const { data: members, loading } = useCollection<Member>('members');
    const [selectedCommittee, setSelectedCommittee] = useState<string>('all');

    const committees = [
        { id: 'all', label: t('all') || 'All' },
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
        <div className="min-h-screen pt-24 pb-12 bg-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16 animate-fade-in-up">
                    <div className="flex items-center justify-center gap-3 mb-4 text-primary font-bold tracking-wider uppercase text-sm">
                        <Users className="w-5 h-5" />
                        {t('members')}
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-foreground mb-4">
                        {t('membersTitle')}
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        {t('membersDescription')}
                    </p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap justify-center gap-2 mb-12 animate-fade-in">
                    {committees.map((committee) => (
                        <button
                            key={committee.id}
                            onClick={() => setSelectedCommittee(committee.id)}
                            className={cn(
                                "px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 border-2",
                                selectedCommittee === committee.id
                                    ? "bg-primary text-primary-foreground border-primary glow-sm shadow-lg shadow-primary/20 scale-105"
                                    : "bg-card text-foreground border-border hover:border-primary/50 hover:text-primary"
                            )}
                        >
                            {committee.label}
                        </button>
                    ))}
                </div>

                {/* Members Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredMembers.length > 0 ? (
                        filteredMembers.map((member, index) => (
                            <div
                                key={member.id}
                                className="group animate-fade-in-up"
                                style={{ animationDelay: `${index * 0.05}s` }}
                            >
                                <div className="relative overflow-hidden rounded-[2rem] bg-card border-2 border-border p-6 hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20">
                                    <div className="relative w-full aspect-square mb-6">
                                        <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all opacity-0 group-hover:opacity-50" />
                                        <img
                                            src={member.image || 'https://via.placeholder.com/300'}
                                            alt={member.name}
                                            className="relative w-full h-full object-cover rounded-2xl border-2 border-primary/10 shadow-lg group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="text-center">
                                        <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                                            {member.name}
                                        </h3>
                                        <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">
                                            {committees.find(c => c.id === member.committee)?.label || member.committee}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center">
                            <p className="text-muted-foreground text-lg italic">No members found in this committee yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
