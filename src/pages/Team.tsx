import { useLanguage } from '@/contexts/LanguageContext';
import { useCollection } from '@/hooks/useFirestore';
import { Loader2, Facebook, Twitter, Linkedin, Github, Instagram } from 'lucide-react';
import { cn } from '@/lib/utils';

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
    instagram?: string;
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

  // Process levels for responsive grid
  const levels: any[][] = [];
  const traverse = (node: any, level: number) => {
    if (!levels[level]) levels[level] = [];
    levels[level].push(node);
    if (node.children) {
      node.children.forEach((child: any) => traverse(child, level + 1));
    }
  };
  roots.forEach(root => traverse(root, 0));

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

        {/* Responsive Tree Visualization */}
        <div className="flex flex-col items-center gap-16">
          {roots.map(root => (
            <TreeNode key={root.id} member={root} isRoot />
          ))}
        </div>
      </div>
    </div>
  );
}

function TreeNode({ member, isRoot = false }: { member: any; isRoot?: boolean }) {
  const hasChildren = member.children && member.children.length > 0;

  return (
    <div className="flex flex-col items-center relative w-full">
      {/* Member Card */}
      <div className="relative group z-10 transition-transform duration-300 w-[280px] sm:w-[320px]">
        <div className={cn(
          "h-[450px] rounded-[2.5rem] bg-card border-2 border-border hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20",
          "flex flex-col animate-fade-in relative overflow-hidden"
        )}>
          {/* Top Connecting Line (Not for roots) */}
          {!isRoot && (
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-0.5 h-12 bg-primary/50 hidden md:block" />
          )}

          {/* Image - Full Width Top Half */}
          <div className="relative h-[65%] w-full overflow-hidden">
            <div className="absolute inset-0 bg-primary/10 group-hover:bg-primary/5 transition-colors duration-500" />
            <img
              src={member.image || 'https://via.placeholder.com/400'}
              alt={member.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
          </div>

          {/* Content - Bottom Part */}
          <div className="flex-1 p-6 flex flex-col items-center text-center justify-between">
            <div className="space-y-1">
              <h3 className="font-black text-xl md:text-2xl text-foreground group-hover:text-primary transition-colors line-clamp-1">
                {member.name}
              </h3>
              <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-primary/70">
                {member.position}
              </p>
            </div>

            {/* Socials */}
            <div className="flex gap-4 justify-center">
              {member.social?.linkedin && (
                <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-all hover:scale-110">
                  <Linkedin className="w-5 h-5" />
                </a>
              )}
              {member.social?.github && (
                <a href={member.social.github} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-all hover:scale-110">
                  <Github className="w-5 h-5" />
                </a>
              )}
              {member.social?.facebook && (
                <a href={member.social.facebook} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-all hover:scale-110">
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {member.social?.instagram && (
                <a href={member.social.instagram} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-all hover:scale-110">
                  <Instagram className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Children Container */}
      {hasChildren && (
        <div className="relative flex flex-col md:flex-row gap-16 md:gap-12 pt-24 w-full items-center md:items-start justify-center">
          {/* Connection Lines (Desktop Only) */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-12 bg-primary/50 hidden md:block" />

          {member.children.length > 1 && (
            <div className="absolute top-12 left-[10%] right-[10%] h-0.5 bg-primary/50 hidden md:block" />
          )}

          {/* Mobile Vertical Line */}
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-0.5 bg-primary/20 md:hidden z-0" />

          {member.children.map((child: any) => (
            <div key={child.id} className="relative z-10 w-full md:w-auto flex flex-col items-center">
              <TreeNode member={child} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
