import { useLanguage } from '@/contexts/LanguageContext';
import { useCollection } from '@/hooks/useFirestore';
import { Loader2, Facebook, Twitter, Linkedin, Github } from 'lucide-react';
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
      <div className="relative group z-10 transition-transform duration-300 w-full max-w-[300px] md:max-w-xs">
        <div className={cn(
          "p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] bg-card border-2 border-border hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20",
          "flex flex-col items-center text-center animate-fade-in relative"
        )}>
          {/* Top Connecting Line (Not for roots) */}
          {!isRoot && (
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-primary/30 hidden md:block" />
          )}

          {/* Image */}
          <div className="relative w-24 h-24 md:w-32 md:h-32 mb-4 md:mb-6">
            <div className="absolute inset-0 bg-primary/20 rounded-[1.5rem] md:rounded-[2rem] blur-xl group-hover:blur-2xl transition-all opacity-50" />
            <img
              src={member.image || 'https://via.placeholder.com/150'}
              alt={member.name}
              className="relative w-full h-full object-cover rounded-[1.5rem] md:rounded-[2rem] border-2 border-primary/20 shadow-xl"
            />
          </div>

          <h3 className="font-black text-lg md:text-xl text-foreground mb-1 group-hover:text-primary transition-colors">
            {member.name}
          </h3>
          <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-primary/70 mb-4 md:mb-6">
            {member.position}
          </p>

          {/* Socials */}
          <div className="flex gap-3 justify-center">
            {member.social?.linkedin && (
              <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-all hover:scale-110">
                <Linkedin className="w-4 h-4" />
              </a>
            )}
            {member.social?.github && (
              <a href={member.social.github} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-all hover:scale-110">
                <Github className="w-4 h-4" />
              </a>
            )}
            {member.social?.facebook && (
              <a href={member.social.facebook} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-all hover:scale-110">
                <Facebook className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Children Container */}
      {hasChildren && (
        <div className="relative flex flex-col md:flex-row gap-12 md:gap-8 pt-12 w-full items-center md:items-start justify-center">
          {/* Connection Lines (Desktop Only) */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-12 bg-primary/30 hidden md:block" />

          {member.children.length > 1 && (
            <div className="absolute top-12 left-[15%] right-[15%] h-0.5 bg-primary/30 hidden md:block" />
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
