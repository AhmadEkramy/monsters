import { useLanguage } from '@/contexts/LanguageContext';
import { useCollection } from '@/hooks/useFirestore';
import { Loader2, Facebook, Twitter, Linkedin, Github, ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface TeamMember {
  id: string;
  name: string;
  position: string;
  image?: string;
  parentId?: string | null;
  order?: number;
  social?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
}

export default function Team() {
  const { t } = useLanguage();
  const { data: teamMembers, loading } = useCollection<TeamMember>('team');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  // Build tree structure
  const membersMap = new Map<string, TeamMember & { children: any[] }>();
  teamMembers.forEach(m => membersMap.set(m.id, { ...m, children: [] }));

  const roots: any[] = [];
  teamMembers.forEach(m => {
    const member = membersMap.get(m.id)!;
    if (m.parentId && membersMap.has(m.parentId)) {
      membersMap.get(m.parentId)!.children.push(member);
    } else {
      roots.push(member);
    }
  });

  // Sort by order
  const sortNodes = (nodes: any[]) => {
    nodes.sort((a, b) => (a.order || 0) - (b.order || 0));
    nodes.forEach(n => sortNodes(n.children));
  };
  sortNodes(roots);

  return (
    <div className="min-h-screen pt-24 pb-12 bg-background overflow-x-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-black text-foreground mb-4">
            {t('teamTitle')}
          </h1>
          {t('teamDescription') && (
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
              {t('teamDescription')}
            </p>
          )}
        </div>

        {/* Tree Visualization with smooth horizontal scroll on mobile */}
        <div className="relative">
          <div className="flex justify-start md:justify-center overflow-x-auto pb-12 pt-8 cursor-grab active:cursor-grabbing scrollbar-hide snap-x select-none touch-pan-x">
            <div className="flex flex-col items-center gap-16 px-8 min-w-max">
              {roots.map(root => (
                <TreeNode key={root.id} member={root} />
              ))}
            </div>
          </div>

          {/* Mobile Scroll Hint */}
          <div className="md:hidden text-center text-[10px] font-black uppercase tracking-[0.2em] text-primary/40 animate-pulse mt-4">
            ← Scroll left/right to explore the architecture →
          </div>
        </div>
      </div>
    </div>
  );
}

function TreeNode({ member }: { member: any }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = member.children && member.children.length > 0;

  return (
    <div className="flex flex-col items-center relative snap-center">
      {/* Member Card */}
      <div className="relative group z-10 transition-transform duration-300">
        <div className={cn(
          "w-[280px] md:w-80 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] bg-card border-2 border-border hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20",
          "flex flex-col items-center text-center animate-fade-in"
        )}>
          {/* Image */}
          <div className="relative w-28 h-28 md:w-36 md:h-36 mb-4 md:mb-6">
            <div className="absolute inset-0 bg-primary/20 rounded-[1.5rem] md:rounded-[2rem] blur-xl group-hover:blur-2xl transition-all opacity-50" />
            <img
              src={member.image || 'https://via.placeholder.com/150'}
              alt={member.name}
              className="relative w-full h-full object-cover rounded-[1.5rem] md:rounded-[2rem] border-2 border-primary/20 shadow-xl"
            />
          </div>

          <h3 className="font-black text-xl md:text-2xl text-foreground mb-1 group-hover:text-primary transition-colors">
            {member.name}
          </h3>
          <p className="text-xs md:text-sm font-black uppercase tracking-[0.2em] text-primary/70 mb-5 md:mb-6">
            {member.position}
          </p>

          {/* Socials */}
          <div className="flex gap-4 justify-center">
            {member.social?.linkedin && (
              <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-all hover:scale-125">
                <Linkedin className="w-5 h-5" />
              </a>
            )}
            {member.social?.github && (
              <a href={member.social.github} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-all hover:scale-125">
                <Github className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>

        {/* Toggle Button */}
        {hasChildren && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-background border-2 border-primary/50 text-primary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all shadow-lg z-20 scale-90 md:scale-100"
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Connecting Line to Children */}
      {hasChildren && isExpanded && (
        <div className="w-px h-12 bg-primary/30 relative">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] h-px bg-primary/30 shadow-[0_0_8px_rgba(78,240,55,0.2)]" />
        </div>
      )}

      {/* Children Container */}
      {hasChildren && isExpanded && (
        <div className="relative flex gap-8 md:gap-12 pt-12">
          {/* Horizontal connecting line across siblings */}
          {member.children.length > 1 && (
            <div
              className="absolute top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent shadow-[0_0_8px_rgba(78,240,55,0.3)]"
              style={{
                left: `${100 / (member.children.length * 2)}%`,
                right: `${100 / (member.children.length * 2)}%`
              }}
            />
          )}

          {member.children.map((child: any) => (
            <div key={child.id} className="relative flex flex-col items-center">
              {/* Vertical line from horizontal line to child */}
              <div className="absolute top-0 w-px h-12 bg-primary/30 -translate-y-full" />
              <TreeNode member={child} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
