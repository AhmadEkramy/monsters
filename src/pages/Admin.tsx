import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Users,
    Calendar,
    MapPin,
    Plus,
    Trash2,
    Edit3,
    Save,
    X,
    Image as ImageIcon,
    CheckCircle2,
    Star,
    Facebook,
    Instagram,
    Briefcase,
    BarChart3,
    RotateCcw,
    Shield,
    Crown,
    Sparkles,
    SlidersHorizontal,
    ArrowUp,
    ArrowDown
} from 'lucide-react';
import { useCollection } from '@/hooks/useFirestore';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function Admin() {
    const { user, isAdmin, loading: authLoading } = useAuth();
    const [activeTab, setActiveTab] = useState('team');

    if (authLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (!isAdmin) return <Navigate to="/login" />;

    return (
        <div className="min-h-screen pt-24 pb-12 bg-background">
            <div className="container mx-auto px-4">
                <header className="mb-10 animate-fade-in-up">
                    <div className="flex items-center gap-3 mb-2 text-primary font-bold tracking-wider uppercase text-sm">
                        <CheckCircle2 className="w-4 h-4" />
                        Admin Dashboard
                    </div>
                    <h1 className="text-4xl font-black text-foreground">Control Center</h1>
                    <p className="text-muted-foreground mt-2">Manage your team, events, and records from one place.</p>
                </header>

                <Tabs defaultValue="team" value={activeTab} onValueChange={setActiveTab} className="space-y-8 animate-fade-in">
                    <div className="overflow-x-auto pb-2">
                        <TabsList className="bg-card border border-border h-auto p-1 gap-2">
                            <TabsTrigger value="team" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2 px-6">
                                <Users className="w-4 h-4 mr-2" /> Team
                            </TabsTrigger>
                            <TabsTrigger value="events" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2 px-6">
                                <Calendar className="w-4 h-4 mr-2" /> Events
                            </TabsTrigger>
                            <TabsTrigger value="competitions" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2 px-6">
                                <Star className="w-4 h-4 mr-2" /> Competitions
                            </TabsTrigger>
                            <TabsTrigger value="trips" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2 px-6">
                                <MapPin className="w-4 h-4 mr-2" /> Trips
                            </TabsTrigger>
                            <TabsTrigger value="members" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2 px-6">
                                <Users className="w-4 h-4 mr-2" /> Members
                            </TabsTrigger>
                            <TabsTrigger value="carousel" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2 px-6">
                                <ImageIcon className="w-4 h-4 mr-2" /> Carousel
                            </TabsTrigger>
                            <TabsTrigger value="committees" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2 px-6">
                                <Briefcase className="w-4 h-4 mr-2" /> Committees
                            </TabsTrigger>
                            <TabsTrigger value="stats" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2 px-6">
                                <BarChart3 className="w-4 h-4 mr-2" /> Stats
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="team">
                        <TeamManager />
                    </TabsContent>
                    <TabsContent value="events">
                        <EventsManager />
                    </TabsContent>
                    <TabsContent value="competitions">
                        <CompetitionsManager />
                    </TabsContent>
                    <TabsContent value="trips">
                        <TripsManager />
                    </TabsContent>
                    <TabsContent value="members">
                        <MembersManager />
                    </TabsContent>
                    <TabsContent value="carousel">
                        <CarouselManager />
                    </TabsContent>
                    <TabsContent value="committees">
                        <CommitteesManager />
                    </TabsContent>
                    <TabsContent value="stats">
                        <StatsManager />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

// --- Team Manager ---
function TeamManager() {
    const { data: team, add, update, remove } = useCollection('team');
    const { data: dbSections } = useCollection('team_sections');
    const [subView, setSubView] = useState<'members' | 'sections'>('members');
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [savingSections, setSavingSections] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        position: '',
        image: '',
        tier: 'leader',
        season: '2025 - PRESENT',
        order: 1,
        isLeader: true,
        social: { facebook: '', instagram: '', linkedin: '', twitter: '', github: '' }
    });

    const TIERS = [
        {
            id: 'leader',
            name: 'Leader',
            labelAr: 'قائد لجنة',
            section: 'Board Leaders',
            sectionBadge: 'COMMITTEE HEADS',
            icon: Users,
            color: 'text-primary border-primary/50 bg-primary/10',
            badgeClass: 'bg-primary/15 text-primary border-primary/30',
        },
        {
            id: 'president',
            name: 'President',
            labelAr: 'رئيس المجلس',
            section: 'The President',
            sectionBadge: 'EXECUTIVE PRESIDENCY',
            icon: Crown,
            color: 'text-amber-400 border-amber-400/50 bg-amber-400/10',
            badgeClass: 'bg-amber-400/15 text-amber-400 border-amber-400/30',
        },
        {
            id: 'vice',
            name: 'Vice',
            labelAr: 'نائب رئيس',
            section: 'Vice Leadership',
            sectionBadge: 'VICE LEADERSHIP',
            icon: Shield,
            color: 'text-sky-400 border-sky-400/50 bg-sky-400/10',
            badgeClass: 'bg-sky-400/15 text-sky-400 border-sky-400/30',
        },
        {
            id: 'supervisor',
            name: 'Supervisor',
            labelAr: 'مشرف أكاديمي',
            section: 'Academic Supervision',
            sectionBadge: 'ACADEMIC SUPERVISION',
            icon: Sparkles,
            color: 'text-emerald-400 border-emerald-400/50 bg-emerald-400/10',
            badgeClass: 'bg-emerald-400/15 text-emerald-400 border-emerald-400/30',
        },
    ];

    const DEFAULT_SECTIONS = [
        {
            tierId: 'president',
            name: 'President',
            titleAr: 'رئيس مجلس الإدارة',
            titleEn: 'The President',
            badgeAr: 'رئاسة المجلس التنفيذي',
            badgeEn: 'EXECUTIVE PRESIDENCY',
            order: 1,
        },
        {
            tierId: 'leader',
            name: 'Leader',
            titleAr: 'قادة اللجان',
            titleEn: 'Board Leaders',
            badgeAr: 'قادة ومسؤولو اللجان',
            badgeEn: 'COMMITTEE HEADS',
            order: 2,
        },
        {
            tierId: 'vice',
            name: 'Vice',
            titleAr: 'نواب الرئيس',
            titleEn: 'Vice Leadership',
            badgeAr: 'نواب الرئيس والإدارة',
            badgeEn: 'VICE LEADERSHIP',
            order: 3,
        },
        {
            tierId: 'supervisor',
            name: 'Supervisor',
            titleAr: 'الإشراف والتوجيه',
            titleEn: 'Guidance & Mentorship',
            badgeAr: 'الإشراف والتوجيه الأكاديمي',
            badgeEn: 'ACADEMIC SUPERVISION',
            order: 4,
        },
    ];

    const [sectionsForm, setSectionsForm] = useState(DEFAULT_SECTIONS);

    // Sync sectionsForm when dbSections changes
    useEffect(() => {
        if (dbSections && dbSections.length > 0) {
            const merged = DEFAULT_SECTIONS.map(def => {
                const found = dbSections.find((d: any) => (d.tierId || d.id) === def.tierId);
                return found ? { ...def, ...found } : def;
            });
            setSectionsForm(merged.sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0)));
        }
    }, [dbSections]);

    const moveSection = (index: number, direction: 'up' | 'down') => {
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= sectionsForm.length) return;

        const updated = [...sectionsForm];
        const temp = updated[index];
        updated[index] = updated[targetIndex];
        updated[targetIndex] = temp;

        const reordered = updated.map((item, idx) => ({ ...item, order: idx + 1 }));
        setSectionsForm(reordered);
    };

    const updateSectionField = (tierId: string, field: string, value: any) => {
        setSectionsForm(prev => prev.map(s => s.tierId === tierId ? { ...s, [field]: value } : s));
    };

    const handleSaveSections = async () => {
        setSavingSections(true);
        try {
            for (const sec of sectionsForm) {
                await setDoc(doc(db, 'team_sections', sec.tierId), {
                    tierId: sec.tierId,
                    titleAr: sec.titleAr || '',
                    titleEn: sec.titleEn || '',
                    badgeAr: sec.badgeAr || '',
                    badgeEn: sec.badgeEn || '',
                    order: Number(sec.order) || 1,
                }, { merge: true });
            }
            toast.success('تم حفظ ترتيب وأسماء الفقرات بنجاح! ستظهر فوراً في الموقع.');
        } catch (err: any) {
            toast.error(err.message || 'حدث خطأ أثناء حفظ الفقرات');
        } finally {
            setSavingSections(false);
        }
    };

    const handleResetSections = () => {
        setSectionsForm(DEFAULT_SECTIONS);
        toast.info('تمت استعادة الأسماء والترتيب الافتراضي. اضغط على حفظ لتأكيد التغييرات.');
    };

    const detectTier = (member: any): string => {
        if (member.tier) return member.tier;
        const sec = (member.section || '').toLowerCase();
        const pos = (member.position || '').toLowerCase();

        if (sec.includes('supervis') || sec.includes('academic') || pos.includes('supervisor') || pos.includes('prof') || pos.includes('مشرف') || pos.includes('دكتور')) {
            return 'supervisor';
        }
        if ((sec.includes('president') || pos.includes('president') || pos.includes('chairperson') || pos.includes('رئيس')) && !sec.includes('vice') && !pos.includes('vice') && !pos.includes('نائب')) {
            return 'president';
        }
        if (sec.includes('vice') || pos.includes('vice') || pos.includes('نائب') || pos.includes('deputy')) {
            return 'vice';
        }
        return 'leader';
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const tierConfig = TIERS.find(t => t.id === formData.tier) || TIERS[0];
            const dataToSave = {
                name: formData.name.trim(),
                position: formData.position.trim(),
                image: formData.image.trim(),
                tier: formData.tier,
                section: tierConfig.section,
                sectionBadge: tierConfig.sectionBadge,
                season: formData.season || '2025 - PRESENT',
                order: Number(formData.order) || 0,
                isLeader: formData.isLeader,
                social: formData.social || {}
            };

            if (isEditing) {
                await update(isEditing, dataToSave);
                toast.success('تم تحديث بيانات العضو بنجاح');
            } else {
                await add(dataToSave);
                toast.success('تمت إضافة العضو بنجاح');
            }
            resetForm();
        } catch (err: any) {
            toast.error(err.message || 'حدث خطأ أثناء الحفظ');
        }
    };

    const resetForm = () => {
        setIsEditing(null);
        setFormData({
            name: '',
            position: '',
            image: '',
            tier: 'leader',
            season: '2025 - PRESENT',
            order: 1,
            isLeader: true,
            social: { facebook: '', instagram: '', linkedin: '', twitter: '', github: '' }
        });
    };

    const startEditing = (member: any) => {
        setIsEditing(member.id);
        const tier = detectTier(member);
        setFormData({
            name: member.name || '',
            position: member.position || '',
            image: member.image || '',
            tier: tier,
            season: member.season || '2025 - PRESENT',
            order: member.order || 1,
            isLeader: member.isLeader !== undefined ? member.isLeader : true,
            social: {
                facebook: member.social?.facebook || '',
                instagram: member.social?.instagram || '',
                linkedin: member.social?.linkedin || '',
                twitter: member.social?.twitter || '',
                github: member.social?.github || ''
            }
        });
    };

    return (
        <div className="space-y-6">
            {/* Top Sub-Navigation Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-2 rounded-2xl bg-card/60 border border-border">
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setSubView('members')}
                        className={cn(
                            "px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer",
                            subView === 'members'
                                ? "bg-primary text-primary-foreground shadow-[0_0_15px_hsl(var(--primary)/0.35)]"
                                : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                        )}
                    >
                        <Users className="w-4 h-4" />
                        <span>إدارة الأعضاء (Team Members)</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setSubView('sections')}
                        className={cn(
                            "px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer",
                            subView === 'sections'
                                ? "bg-primary text-primary-foreground shadow-[0_0_15px_hsl(var(--primary)/0.35)]"
                                : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                        )}
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                        <span>ترتيب وأسماء الفقرات (Sections & Order)</span>
                    </button>
                </div>

                <div className="text-xs text-muted-foreground px-2">
                    {subView === 'members' ? `${team.length} أعضاء مسجلين` : 'التحكم في الفقرات الـ 4'}
                </div>
            </div>

            {/* VIEW 1: MANAGE SECTIONS & ORDERING */}
            {subView === 'sections' && (
                <div className="space-y-6 animate-fade-in">
                    <Card className="border-border bg-card/70 backdrop-blur-md shadow-xl">
                        <CardHeader className="pb-4 border-b border-border/60">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <CardTitle className="text-xl font-black text-foreground flex items-center gap-2">
                                        <SlidersHorizontal className="w-5 h-5 text-primary" />
                                        <span>التحكم في أسماء وترتيب فقرات الفريق</span>
                                    </CardTitle>
                                    <CardDescription className="text-xs mt-1">
                                        يمكنك تغيير ترتيب ظهور أي فقرة باستخدام أسهم (أعلى ⬆️ / أسفل ⬇️)، وتعديل العناوين والشارات بالعربية والإنجليزية.
                                    </CardDescription>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={handleResetSections}
                                        className="text-xs"
                                    >
                                        <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                                        استعادة الافتراضي
                                    </Button>
                                    <Button
                                        type="button"
                                        size="sm"
                                        onClick={handleSaveSections}
                                        disabled={savingSections}
                                        className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs"
                                    >
                                        <Save className="w-3.5 h-3.5 mr-1.5" />
                                        {savingSections ? 'جاري الحفظ...' : 'حفظ الترتيب والأسماء'}
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            {sectionsForm.map((sec, idx) => {
                                const tierConfig = TIERS.find(t => t.id === sec.tierId) || TIERS[0];
                                const TierIcon = tierConfig.icon;
                                const isFirst = idx === 0;
                                const isLast = idx === sectionsForm.length - 1;

                                return (
                                    <div
                                        key={sec.tierId}
                                        className="p-4 sm:p-5 rounded-2xl bg-secondary/30 border border-border/80 hover:border-primary/40 transition-all space-y-4"
                                    >
                                        {/* Header Row with Order & Move Controls */}
                                        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border/50">
                                            <div className="flex items-center gap-2.5">
                                                <span className="w-7 h-7 rounded-lg bg-primary/20 text-primary font-mono font-black text-sm flex items-center justify-center border border-primary/30">
                                                    #{idx + 1}
                                                </span>
                                                <div className={cn("p-1.5 rounded-lg border", tierConfig.badgeClass)}>
                                                    <TierIcon className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <span className="font-bold text-foreground text-sm block">
                                                        {sec.titleAr || tierConfig.labelAr}
                                                    </span>
                                                    <span className="text-[11px] text-muted-foreground font-mono">
                                                        ({sec.name || tierConfig.name}) • الفقرة رقم {idx + 1} في الظهور
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Reorder Buttons */}
                                            <div className="flex items-center gap-1.5">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    disabled={isFirst}
                                                    onClick={() => moveSection(idx, 'up')}
                                                    className="h-8 px-2.5 text-xs hover:border-primary"
                                                    title="تحريك لأعلى"
                                                >
                                                    <ArrowUp className="w-3.5 h-3.5 mr-1" />
                                                    أعلى
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    disabled={isLast}
                                                    onClick={() => moveSection(idx, 'down')}
                                                    className="h-8 px-2.5 text-xs hover:border-primary"
                                                    title="تحريك لأسفل"
                                                >
                                                    <ArrowDown className="w-3.5 h-3.5 mr-1" />
                                                    أسفل
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Inputs Grid for Arabic & English Titles and Badges */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
                                            <div className="space-y-1">
                                                <Label className="text-[11px] font-bold text-muted-foreground">
                                                    العنوان بالعربية (Title Ar)
                                                </Label>
                                                <Input
                                                    value={sec.titleAr || ''}
                                                    onChange={e => updateSectionField(sec.tierId, 'titleAr', e.target.value)}
                                                    placeholder="مثال: قادة اللجان"
                                                    dir="rtl"
                                                    className="text-xs h-9 bg-background"
                                                />
                                            </div>

                                            <div className="space-y-1">
                                                <Label className="text-[11px] font-bold text-muted-foreground">
                                                    العنوان بالإنجليزية (Title En)
                                                </Label>
                                                <Input
                                                    value={sec.titleEn || ''}
                                                    onChange={e => updateSectionField(sec.tierId, 'titleEn', e.target.value)}
                                                    placeholder="e.g. Board Leaders"
                                                    className="text-xs h-9 bg-background"
                                                />
                                            </div>

                                            <div className="space-y-1">
                                                <Label className="text-[11px] font-bold text-muted-foreground">
                                                    الشارة بالعربية (Badge Ar)
                                                </Label>
                                                <Input
                                                    value={sec.badgeAr || ''}
                                                    onChange={e => updateSectionField(sec.tierId, 'badgeAr', e.target.value)}
                                                    placeholder="مثال: قادة ومسؤولو اللجان"
                                                    dir="rtl"
                                                    className="text-xs h-9 bg-background"
                                                />
                                            </div>

                                            <div className="space-y-1">
                                                <Label className="text-[11px] font-bold text-muted-foreground">
                                                    الشارة بالإنجليزية (Badge En)
                                                </Label>
                                                <Input
                                                    value={sec.badgeEn || ''}
                                                    onChange={e => updateSectionField(sec.tierId, 'badgeEn', e.target.value)}
                                                    placeholder="e.g. COMMITTEE HEADS"
                                                    className="text-xs h-9 bg-background"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            <div className="flex justify-end pt-2">
                                <Button
                                    type="button"
                                    onClick={handleSaveSections}
                                    disabled={savingSections}
                                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 py-5"
                                >
                                    <Save className="w-4 h-4 mr-2" />
                                    {savingSections ? 'جاري الحفظ...' : 'حفظ ترتيب وأسماء الفقرات'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* VIEW 2: MANAGE MEMBERS FORM & LIST */}
            {subView === 'members' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
                    {/* Form Section (5 cols) */}
                    <Card className="lg:col-span-5 border-border bg-card/70 backdrop-blur-md self-start shadow-xl">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-xl font-black text-foreground flex items-center gap-2">
                                <span>{isEditing ? '✏️ تعديل بيانات العضو' : '✨ إضافة عضو جديد للبورد'}</span>
                            </CardTitle>
                            <CardDescription className="text-xs">
                                اختر الفئة (Leader, President, Vice, Supervisor) وأدخل بيانات العضو.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSave} className="space-y-4">
                                
                                {/* 1. Full Name */}
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-bold text-foreground">الاسم بالكامل (Full Name) *</Label>
                                    <Input
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="مثال: Mohamed Elgazar"
                                        required
                                    />
                                </div>

                                {/* 2. Position / Role */}
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-bold text-foreground">المنصب / اللقب (Position / Role) *</Label>
                                    <Input
                                        value={formData.position}
                                        onChange={e => setFormData({ ...formData, position: e.target.value })}
                                        placeholder="مثال: Activities Leader أو President أو PR Vice"
                                        required
                                    />
                                </div>

                                {/* 3. Category / Tier Selection (4 Clear Buttons: Leader, President, Vice, Supervisor) */}
                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-xs font-bold text-foreground">فئة العضو في الفريق *</Label>
                                        <span className="text-[11px] text-primary font-medium">اختر فئة العضو:</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2.5">
                                        {TIERS.map(t => {
                                            const isSelected = formData.tier === t.id;
                                            const Icon = t.icon;
                                            return (
                                                <button
                                                    key={t.id}
                                                    type="button"
                                                    onClick={() => setFormData(prev => ({ ...prev, tier: t.id }))}
                                                    className={cn(
                                                        "p-3.5 rounded-xl border text-right transition-all flex flex-col gap-1 cursor-pointer select-none",
                                                        isSelected
                                                            ? `${t.color} border-2 shadow-[0_0_20px_rgba(78,240,55,0.25)] font-bold scale-[1.01]`
                                                            : "bg-secondary/40 border-border/80 hover:border-primary/50 text-muted-foreground hover:bg-secondary/70"
                                                    )}
                                                >
                                                    <div className="flex items-center justify-between w-full">
                                                        <Icon className="w-4 h-4" />
                                                        {isSelected ? (
                                                            <span className="flex items-center gap-1 text-[11px] font-bold text-primary bg-primary/20 px-1.5 py-0.5 rounded-full">
                                                                <CheckCircle2 className="w-3.5 h-3.5" /> محدد
                                                            </span>
                                                        ) : (
                                                            <span className="w-3 h-3 rounded-full border border-border" />
                                                        )}
                                                    </div>
                                                    <span className="text-sm font-black text-foreground tracking-tight">{t.name}</span>
                                                    <span className="text-[11px] text-muted-foreground">{t.labelAr}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* 4. Image URL with Live Preview */}
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-bold text-foreground">رابط الصورة (Image URL)</Label>
                                    <div className="flex items-center gap-3">
                                        {formData.image ? (
                                            <img
                                                src={formData.image}
                                                alt="Preview"
                                                className="w-12 h-12 rounded-full object-cover border-2 border-primary shrink-0 shadow-md"
                                                onError={(e: any) => { e.target.style.display = 'none'; }}
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-secondary/80 border border-border flex items-center justify-center text-[10px] text-muted-foreground shrink-0 font-medium">
                                                لا صورة
                                            </div>
                                        )}
                                        <Input
                                            value={formData.image}
                                            onChange={e => setFormData({ ...formData, image: e.target.value })}
                                            placeholder="https://... رابط صورة مباشرة"
                                            className="flex-1"
                                        />
                                    </div>
                                </div>

                                {/* 5. Order & Season */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-bold text-foreground">ترتيب الظهور (Order)</Label>
                                        <Input
                                            type="number"
                                            value={formData.order || 0}
                                            onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                                            placeholder="1, 2, 3..."
                                        />
                                        <span className="text-[10px] text-muted-foreground block">الرقم الأصغر يظهر أولاً</span>
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-bold text-foreground">الدفعة / الموسم</Label>
                                        <select
                                            className="w-full bg-background border border-input rounded-md p-2 text-xs font-medium h-9"
                                            value={formData.season}
                                            onChange={e => setFormData({ ...formData, season: e.target.value })}
                                        >
                                            <option value="2025 - PRESENT">المجلس الحالي (2024 - 2025)</option>
                                            <option value="2023 - 2025 #FOUNDERS">المؤسسون (2023 - 2024)</option>
                                        </select>
                                    </div>
                                </div>


                                {/* 7. Social Links (Compact) */}
                                <div className="space-y-2 pt-2 border-t border-border/60">
                                    <Label className="text-xs font-bold text-muted-foreground">روابط التواصل (اختياري)</Label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        <Input
                                            value={formData.social?.linkedin || ''}
                                            onChange={e => setFormData({ ...formData, social: { ...(formData.social || {}), linkedin: e.target.value } })}
                                            placeholder="LinkedIn URL"
                                            className="text-xs h-8"
                                        />
                                        <Input
                                            value={formData.social?.facebook || ''}
                                            onChange={e => setFormData({ ...formData, social: { ...(formData.social || {}), facebook: e.target.value } })}
                                            placeholder="Facebook URL"
                                            className="text-xs h-8"
                                        />
                                        <Input
                                            value={formData.social?.instagram || ''}
                                            onChange={e => setFormData({ ...formData, social: { ...(formData.social || {}), instagram: e.target.value } })}
                                            placeholder="Instagram URL"
                                            className="text-xs h-8"
                                        />
                                        <Input
                                            value={formData.social?.github || ''}
                                            onChange={e => setFormData({ ...formData, social: { ...(formData.social || {}), github: e.target.value } })}
                                            placeholder="GitHub URL"
                                            className="text-xs h-8"
                                        />
                                    </div>
                                </div>

                                {/* Submit Buttons */}
                                <div className="flex gap-2 pt-3">
                                    <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-5">
                                        {isEditing ? <Save className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                                        {isEditing ? 'حفظ التعديلات' : 'إضافة العضو للفريق'}
                                    </Button>
                                    {isEditing && (
                                        <Button type="button" variant="outline" onClick={resetForm} className="py-5">
                                            <X className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Members List Display Grouped by the Tiers in dynamic order (7 cols) */}
                    <div className="lg:col-span-7 space-y-6">
                        {sectionsForm.map((sec, idx) => {
                            const tierConfig = TIERS.find(t => t.id === sec.tierId) || TIERS[0];
                            const TierIcon = tierConfig.icon;
                            const membersInTier = team
                                .filter((m: any) => detectTier(m) === sec.tierId)
                                .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));

                            return (
                                <div key={sec.tierId} className="space-y-3 bg-card/40 p-4 rounded-2xl border border-border/80">
                                    {/* Section Header */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className={cn("p-1.5 rounded-lg border", tierConfig.badgeClass)}>
                                                <TierIcon className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
                                                    <span>{sec.titleAr || tierConfig.labelAr}</span>
                                                    <span className="text-xs text-muted-foreground font-normal">
                                                        ({sec.titleEn || tierConfig.name})
                                                    </span>
                                                </h3>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] text-muted-foreground bg-secondary px-2 py-0.5 rounded-full font-mono">
                                                ترتيب #{idx + 1}
                                            </span>
                                            <span className={cn("text-xs font-bold px-2.5 py-0.5 rounded-full border", tierConfig.badgeClass)}>
                                                {membersInTier.length} أعضاء
                                            </span>
                                        </div>
                                    </div>

                                    {/* Members Cards in this Tier */}
                                    {membersInTier.length === 0 ? (
                                        <p className="text-xs text-muted-foreground/60 py-2 px-1">
                                            لا يوجد أعضاء في هذا القسم حالياً.
                                        </p>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                            {membersInTier.map((member: any) => (
                                                <Card
                                                    key={member.id}
                                                    className={cn(
                                                        "border transition-all shadow-sm group",
                                                        isEditing === member.id
                                                            ? "border-primary bg-primary/10"
                                                            : "border-border/80 hover:border-primary/40 bg-card/70"
                                                    )}
                                                >
                                                    <CardContent className="p-3 flex items-center gap-3">
                                                        <div className="relative shrink-0">
                                                            <img
                                                                src={member.image || 'https://via.placeholder.com/150'}
                                                                alt={member.name}
                                                                className="w-11 h-11 rounded-full object-cover border border-primary/40 shadow-sm"
                                                            />
                                                        </div>

                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-1.5">
                                                                <h4 className="font-bold text-xs sm:text-sm text-foreground truncate">
                                                                    {member.name}
                                                                </h4>
                                                                <span className="text-[10px] text-muted-foreground font-mono bg-secondary px-1.5 py-0.2 rounded shrink-0">
                                                                    #{member.order || 0}
                                                                </span>
                                                            </div>
                                                            <p className="text-xs text-primary font-medium truncate mt-0.5">
                                                                {member.position}
                                                            </p>
                                                            {member.season && (
                                                                <span className="text-[10px] text-muted-foreground block truncate">
                                                                    {member.season}
                                                                </span>
                                                            )}
                                                        </div>

                                                        <div className="flex gap-1 shrink-0">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-7 w-7 hover:text-primary hover:bg-primary/10"
                                                                onClick={() => startEditing(member)}
                                                                title="تعديل العضو"
                                                            >
                                                                <Edit3 className="w-3.5 h-3.5" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-7 w-7 text-destructive hover:bg-destructive/10"
                                                                onClick={() => remove(member.id)}
                                                                title="حذف العضو"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </Button>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {team.length === 0 && (
                            <Card className="p-8 text-center border-dashed text-muted-foreground">
                                لا يوجد أعضاء مضافين في البورد حتى الآن. أضف أول عضو من النموذج.
                            </Card>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

// --- Events Manager ---
function EventsManager() {
    const { data: events, add, update, remove } = useCollection('events');
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [formData, setFormData] = useState<any>({
        title: '', description: '', date: '', location: '', attendees: '', images: [], status: 'upcoming',
        social: { facebook: '', instagram: '' }
    });
    const [imageUrl, setImageUrl] = useState('');

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Migrate old single 'image' field to 'images' array
            const saveData = { ...formData };
            if (saveData.image && (!saveData.images || saveData.images.length === 0)) {
                saveData.images = [saveData.image];
            }
            delete saveData.image;
            if (isEditing) {
                await update(isEditing, saveData);
                toast.success('Event updated');
            } else {
                await add(saveData);
                toast.success('Event added');
            }
            resetForm();
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    const resetForm = () => {
        setIsEditing(null);
        setFormData({
            title: '', description: '', date: '', location: '', attendees: '', images: [], status: 'upcoming',
            social: { facebook: '', instagram: '' }
        });
        setImageUrl('');
    };

    const addImage = () => {
        if (imageUrl.trim()) {
            const currentImages = formData.images || (formData.image ? [formData.image] : []);
            setFormData({ ...formData, images: [...currentImages, imageUrl.trim()], image: undefined });
            setImageUrl('');
        }
    };

    const removeImage = (index: number) => {
        const updated = [...(formData.images || [])];
        updated.splice(index, 1);
        setFormData({ ...formData, images: updated });
    };

    // When editing, migrate old single image to images array
    const startEdit = (event: any) => {
        const editData = { ...event };
        if (editData.image && (!editData.images || editData.images.length === 0)) {
            editData.images = [editData.image];
        }
        if (!editData.images) editData.images = [];
        setIsEditing(event.id);
        setFormData(editData);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-1 border-border bg-card/50 backdrop-blur-sm self-start">
                <CardHeader>
                    <CardTitle>{isEditing ? 'Edit Event' : 'Add New Event'}</CardTitle>
                    <CardDescription>Add an upcoming or past event.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSave} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Title</Label>
                            <Input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                        </div>
                        <div className="space-y-2">
                            <Label>Date</Label>
                            <Input value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} placeholder="e.g. March 15, 2025" required />
                        </div>
                        <div className="space-y-2">
                            <Label>Location</Label>
                            <Input value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} required />
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required />
                        </div>
                        <div className="space-y-2">
                            <Label>Images</Label>
                            <div className="flex gap-2">
                                <Input value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://..." />
                                <Button type="button" variant="outline" onClick={addImage}><ImageIcon className="w-4 h-4" /></Button>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {(formData.images || []).map((img: string, i: number) => (
                                    <div key={i} className="relative w-14 h-14">
                                        <img src={img} className="w-full h-full object-cover rounded border border-border" />
                                        <button type="button" onClick={() => removeImage(i)} className="absolute -top-1 -right-1 bg-destructive text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]"><X /></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Status</Label>
                            <select
                                className="w-full bg-background border border-input rounded-md p-2"
                                value={formData.status}
                                onChange={e => setFormData({ ...formData, status: e.target.value })}
                            >
                                <option value="upcoming">Upcoming</option>
                                <option value="past">Past</option>
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Facebook URL</Label>
                                <Input
                                    value={formData.social?.facebook || ''}
                                    onChange={e => setFormData({ ...formData, social: { ...(formData.social || {}), facebook: e.target.value } })}
                                    placeholder="https://facebook.com/..."
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Instagram URL</Label>
                                <Input
                                    value={formData.social?.instagram || ''}
                                    onChange={e => setFormData({ ...formData, social: { ...(formData.social || {}), instagram: e.target.value } })}
                                    placeholder="https://instagram.com/..."
                                />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button type="submit" className="flex-1 bg-primary">{isEditing ? <Save className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}{isEditing ? 'Update' : 'Add'}</Button>
                            {isEditing && <Button type="button" variant="outline" onClick={resetForm}><X className="w-4 h-4" /></Button>}
                        </div>
                    </form>
                </CardContent>
            </Card>

            <div className="lg:col-span-2 space-y-4">
                {events.map((event: any) => {
                    const imgs = event.images || (event.image ? [event.image] : []);
                    return (
                        <Card key={event.id} className="border-border overflow-hidden">
                            <div className="flex gap-4 p-4">
                                <div className="flex gap-1">
                                    {imgs.slice(0, 2).map((img: string, i: number) => (
                                        <img key={i} src={img} className="w-12 h-12 object-cover rounded border border-border" />
                                    ))}
                                    {imgs.length > 2 && <div className="w-12 h-12 bg-muted rounded flex items-center justify-center text-[10px] font-bold">+{imgs.length - 2}</div>}
                                    {imgs.length === 0 && <div className="w-12 h-12 bg-muted rounded flex items-center justify-center"><ImageIcon className="w-4 h-4 text-muted-foreground" /></div>}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-bold text-lg">{event.title}</h4>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold ${event.status === 'upcoming' ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                                            {event.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
                                    <p className="text-xs mt-2 text-primary">{event.date} • {event.location} • {imgs.length} photo(s)</p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Button variant="ghost" size="icon" onClick={() => startEdit(event)}><Edit3 className="w-4 h-4" /></Button>
                                    <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => remove(event.id)}><Trash2 className="w-4 h-4" /></Button>
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}

// --- Competitions Manager ---
function CompetitionsManager() {
    const { data: comps, add: addComp, update: updateComp, remove: removeComp } = useCollection('competitions');

    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [formData, setFormData] = useState<any>({
        title: '',
        description: '',
        status: '',
        images: [],
        social: { facebook: '', instagram: '' }
    });
    const [imageUrl, setImageUrl] = useState('');

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const saveData = { ...formData };
            if (saveData.image && (!saveData.images || saveData.images.length === 0)) {
                saveData.images = [saveData.image];
            }
            delete saveData.image;
            if (isEditing) {
                await updateComp(isEditing, saveData);
                toast.success('Competition updated');
            } else {
                await addComp(saveData);
                toast.success('Competition added');
            }
            resetForm();
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    const resetForm = () => {
        setIsEditing(null);
        setFormData({
            title: '',
            description: '',
            status: '',
            images: [],
            social: { facebook: '', instagram: '' }
        });
        setImageUrl('');
    };

    const addImage = () => {
        if (imageUrl.trim()) {
            const currentImages = formData.images || (formData.image ? [formData.image] : []);
            setFormData({ ...formData, images: [...currentImages, imageUrl.trim()], image: undefined });
            setImageUrl('');
        }
    };

    const removeImage = (index: number) => {
        const updated = [...(formData.images || [])];
        updated.splice(index, 1);
        setFormData({ ...formData, images: updated });
    };

    const startEdit = (item: any) => {
        const editData = { ...item };
        if (editData.image && (!editData.images || editData.images.length === 0)) {
            editData.images = [editData.image];
        }
        if (!editData.images) editData.images = [];
        setIsEditing(item.id);
        setFormData(editData);
    };

    return (
        <div className="space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-1 border-border bg-card/50 backdrop-blur-sm self-start">
                    <CardHeader>
                        <CardTitle>{isEditing ? 'Edit' : 'Add New'} Competition</CardTitle>
                        <CardDescription>Manage your competition records.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div className="space-y-2">
                                <Label>Title</Label>
                                <Input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                            </div>
                            <div className="space-y-2">
                                <Label>Status</Label>
                                <Input
                                    value={formData.status}
                                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                                    placeholder="Semi-Finalist"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Images</Label>
                                <div className="flex gap-2">
                                    <Input value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://..." />
                                    <Button type="button" variant="outline" onClick={addImage}><ImageIcon className="w-4 h-4" /></Button>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {(formData.images || []).map((img: string, i: number) => (
                                        <div key={i} className="relative w-14 h-14">
                                            <img src={img} className="w-full h-full object-cover rounded border border-border" />
                                            <button type="button" onClick={() => removeImage(i)} className="absolute -top-1 -right-1 bg-destructive text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]"><X /></button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Facebook URL</Label>
                                    <Input
                                        value={formData.social?.facebook || ''}
                                        onChange={e => setFormData({ ...formData, social: { ...(formData.social || {}), facebook: e.target.value } })}
                                        placeholder="https://facebook.com/..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Instagram URL</Label>
                                    <Input
                                        value={formData.social?.instagram || ''}
                                        onChange={e => setFormData({ ...formData, social: { ...(formData.social || {}), instagram: e.target.value } })}
                                        placeholder="https://instagram.com/..."
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button type="submit" className="flex-1 bg-primary">{isEditing ? <Save className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}{isEditing ? 'Update' : 'Add'}</Button>
                                {isEditing && <Button type="button" variant="outline" onClick={resetForm}><X className="w-4 h-4" /></Button>}
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <div className="lg:col-span-2 space-y-8">
                    <div>
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Star className="w-5 h-5 text-primary" /> Competitions</h3>
                        <div className="space-y-3">
                            {comps.map((item: any) => {
                                const imgs = item.images || (item.image ? [item.image] : []);
                                return (
                                    <Card key={item.id} className="border-border">
                                        <div className="p-4 flex items-center gap-4">
                                            <div className="flex gap-1">
                                                {imgs.slice(0, 2).map((img: string, i: number) => (
                                                    <img key={i} src={img} className="w-10 h-10 object-cover rounded border border-border" />
                                                ))}
                                                {imgs.length > 2 && <div className="w-10 h-10 bg-muted rounded flex items-center justify-center text-[10px] font-bold">+{imgs.length - 2}</div>}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold">{item.title}</h4>
                                                <p className="text-sm text-muted-foreground">{item.status} • {item.description}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button variant="ghost" size="icon" onClick={() => startEdit(item)}><Edit3 className="w-4 h-4" /></Button>
                                                <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => removeComp(item.id)}><Trash2 className="w-4 h-4" /></Button>
                                            </div>
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- Trips Manager ---
function TripsManager() {
    const { data: trips, add, update, remove } = useCollection('trips');
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [formData, setFormData] = useState<any>({
        title: '', description: '', date: '', location: '', images: [],
        social: { facebook: '', instagram: '' }
    });
    const [imageUrl, setImageUrl] = useState('');

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await update(isEditing, formData);
                toast.success('Trip updated');
            } else {
                await add(formData);
                toast.success('Trip added');
            }
            resetForm();
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    const addImage = () => {
        if (imageUrl) {
            setFormData({ ...formData, images: [...formData.images, imageUrl] });
            setImageUrl('');
        }
    };

    const removeImage = (index: number) => {
        const newImages = [...formData.images];
        newImages.splice(index, 1);
        setFormData({ ...formData, images: newImages });
    };

    const resetForm = () => {
        setIsEditing(null);
        setFormData({
            title: '', description: '', date: '', location: '', images: [],
            social: { facebook: '', instagram: '' }
        });
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-1 border-border bg-card/50 backdrop-blur-sm self-start">
                <CardHeader>
                    <CardTitle>{isEditing ? 'Edit Trip' : 'Add New Trip'}</CardTitle>
                    <CardDescription>Add photos and details of the trip.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSave} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Title</Label>
                            <Input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                        </div>
                        <div className="space-y-2">
                            <Label>Date</Label>
                            <Input value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} required />
                        </div>
                        <div className="space-y-2">
                            <Label>Location</Label>
                            <Input value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} required />
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required />
                        </div>
                        <div className="space-y-2">
                            <Label>Add Image URL</Label>
                            <div className="flex gap-2">
                                <Input value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://..." />
                                <Button type="button" variant="outline" onClick={addImage}><ImageIcon className="w-4 h-4" /></Button>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {formData.images.map((img: string, i: number) => (
                                    <div key={i} className="relative w-12 h-12">
                                        <img src={img} className="w-full h-full object-cover rounded" />
                                        <button type="button" onClick={() => removeImage(i)} className="absolute -top-1 -right-1 bg-destructive text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]"><X /></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Facebook URL</Label>
                                <Input
                                    value={formData.social?.facebook || ''}
                                    onChange={e => setFormData({ ...formData, social: { ...(formData.social || {}), facebook: e.target.value } })}
                                    placeholder="https://facebook.com/..."
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Instagram URL</Label>
                                <Input
                                    value={formData.social?.instagram || ''}
                                    onChange={e => setFormData({ ...formData, social: { ...(formData.social || {}), instagram: e.target.value } })}
                                    placeholder="https://instagram.com/..."
                                />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button type="submit" className="flex-1 bg-primary">{isEditing ? <Save className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}{isEditing ? 'Update' : 'Add'}</Button>
                            {isEditing && <Button type="button" variant="outline" onClick={resetForm}><X className="w-4 h-4" /></Button>}
                        </div>
                    </form>
                </CardContent>
            </Card>

            <div className="lg:col-span-2 space-y-4">
                {trips.map((trip: any) => (
                    <Card key={trip.id} className="border-border p-4">
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <h4 className="font-bold">{trip.title}</h4>
                                <p className="text-sm text-muted-foreground">{trip.date} • {trip.location}</p>
                                <div className="flex gap-1 mt-2">
                                    {trip.images.slice(0, 3).map((img: string, i: number) => (
                                        <img key={i} src={img} className="w-8 h-8 rounded object-cover border border-border" />
                                    ))}
                                    {trip.images.length > 3 && <div className="w-8 h-8 bg-muted rounded flex items-center justify-center text-[10px]">+{trip.images.length - 3}</div>}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="ghost" size="icon" onClick={() => { setIsEditing(trip.id); setFormData(trip); }}><Edit3 className="w-4 h-4" /></Button>
                                <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => remove(trip.id)}><Trash2 className="w-4 h-4" /></Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}

// --- Carousel Manager ---
function CarouselManager() {
    const { data: slides, add, update, remove } = useCollection('carousel');
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [formData, setFormData] = useState<any>({ image: '', title: '', subtitle: '' });

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await update(isEditing, formData);
                toast.success('Slide updated');
            } else {
                await add(formData);
                toast.success('Slide added');
            }
            resetForm();
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    const resetForm = () => {
        setIsEditing(null);
        setFormData({ image: '', title: '', subtitle: '' });
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-1 border-border bg-card/50 backdrop-blur-sm self-start">
                <CardHeader>
                    <CardTitle>{isEditing ? 'Edit Slide' : 'Add New Slide'}</CardTitle>
                    <CardDescription>Manage homepage carousel slides.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSave} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Image URL</Label>
                            <Input value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} required placeholder="https://..." />
                        </div>
                        <div className="space-y-2">
                            <Label>Title (Optional)</Label>
                            <Input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Subtitle (Optional)</Label>
                            <Input value={formData.subtitle} onChange={e => setFormData({ ...formData, subtitle: e.target.value })} />
                        </div>
                        <div className="flex gap-2">
                            <Button type="submit" className="flex-1 bg-primary">{isEditing ? <Save className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}{isEditing ? 'Update' : 'Add'}</Button>
                            {isEditing && <Button type="button" variant="outline" onClick={resetForm}><X className="w-4 h-4" /></Button>}
                        </div>
                    </form>
                </CardContent>
            </Card>

            <div className="lg:col-span-2 space-y-4">
                {slides.map((slide: any) => (
                    <Card key={slide.id} className="border-border overflow-hidden">
                        <div className="flex gap-4 p-4">
                            <img src={slide.image || 'https://via.placeholder.com/150'} className="w-32 h-20 object-cover rounded-lg" />
                            <div className="flex-1">
                                <h4 className="font-bold">{slide.title || 'No Title'}</h4>
                                <p className="text-sm text-muted-foreground">{slide.subtitle || 'No Subtitle'}</p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Button variant="ghost" size="icon" onClick={() => { setIsEditing(slide.id); setFormData(slide); }}><Edit3 className="w-4 h-4" /></Button>
                                <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => remove(slide.id)}><Trash2 className="w-4 h-4" /></Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}

// --- Members Manager ---
function MembersManager() {
    const { data: members, add, update, remove } = useCollection('members');
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [formData, setFormData] = useState<any>({ name: '', committee: 'hr', image: '' });

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await update(isEditing, formData);
                toast.success('Member updated');
            } else {
                await add(formData);
                toast.success('Member added');
            }
            resetForm();
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    const resetForm = () => {
        setIsEditing(null);
        setFormData({ name: '', committee: 'hr', image: '' });
    };

    const committees = [
        { id: 'hr', label: 'HR' },
        { id: 'pr', label: 'PR' },
        { id: 'creativity', label: 'Creativity' },
        { id: 'organization', label: 'Organization' },
        { id: 'media', label: 'Media' },
        { id: 'activity', label: 'Activity' },
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-1 border-border bg-card/50 backdrop-blur-sm self-start">
                <CardHeader>
                    <CardTitle>{isEditing ? 'Edit Member' : 'Add New Member'}</CardTitle>
                    <CardDescription>Enter regular member details below.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSave} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Name</Label>
                            <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                        </div>
                        <div className="space-y-2">
                            <Label>Committee</Label>
                            <select
                                className="w-full bg-background border border-input rounded-md p-2"
                                value={formData.committee}
                                onChange={e => setFormData({ ...formData, committee: e.target.value })}
                            >
                                {committees.map(c => (
                                    <option key={c.id} value={c.id}>{c.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label>Image URL</Label>
                            <Input value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} placeholder="https://..." />
                        </div>
                        <div className="flex gap-2">
                            <Button type="submit" className="flex-1 bg-primary">{isEditing ? <Save className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}{isEditing ? 'Update' : 'Add'}</Button>
                            {isEditing && <Button type="button" variant="outline" onClick={resetForm}><X className="w-4 h-4" /></Button>}
                        </div>
                    </form>
                </CardContent>
            </Card>

            <div className="lg:col-span-2 space-y-4">
                {members.map((member: any) => (
                    <Card key={member.id} className="border-border hover:border-primary/30 transition-all">
                        <CardContent className="p-4 flex items-center gap-4">
                            <img src={member.image || 'https://via.placeholder.com/150'} alt={member.name} className="w-12 h-12 rounded-full object-cover" />
                            <div className="flex-1">
                                <h4 className="font-bold">{member.name}</h4>
                                <p className="text-sm text-muted-foreground uppercase tracking-widest text-[10px] font-black">{member.committee}</p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="ghost" size="icon" onClick={() => { setIsEditing(member.id); setFormData(member); }}><Edit3 className="w-4 h-4" /></Button>
                                <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => remove(member.id)}><Trash2 className="w-4 h-4" /></Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

// --- Committees Manager ---
function CommitteesManager() {
    const { data: committees, add, update, remove } = useCollection('committees_data');
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [formData, setFormData] = useState<any>({
        title: '', description: '', image: '', responsibilities: [], order: 0
    });
    const [newResp, setNewResp] = useState('');

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await update(isEditing, formData);
                toast.success('Committee updated');
            } else {
                await add(formData);
                toast.success('Committee added');
            }
            resetForm();
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    const resetForm = () => {
        setIsEditing(null);
        setFormData({ title: '', description: '', image: '', responsibilities: [], order: 0 });
        setNewResp('');
    };

    const addResponsibility = () => {
        if (newResp.trim()) {
            setFormData({ ...formData, responsibilities: [...(formData.responsibilities || []), newResp.trim()] });
            setNewResp('');
        }
    };

    const removeResponsibility = (index: number) => {
        const updated = [...formData.responsibilities];
        updated.splice(index, 1);
        setFormData({ ...formData, responsibilities: updated });
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-1 border-border bg-card/50 backdrop-blur-sm self-start">
                <CardHeader>
                    <CardTitle>{isEditing ? 'Edit Committee' : 'Add New Committee'}</CardTitle>
                    <CardDescription>Manage committee details, image, and responsibilities.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSave} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Title</Label>
                            <Input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required placeholder="e.g. HR Committee" />
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required placeholder="Describe what this committee does..." />
                        </div>
                        <div className="space-y-2">
                            <Label>Image URL</Label>
                            <Input value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} placeholder="https://..." />
                            {formData.image && (
                                <img src={formData.image} alt="Preview" className="w-full h-32 object-contain rounded-lg border border-border mt-2 bg-background" />
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label>Display Order</Label>
                            <Input
                                type="number"
                                value={formData.order || 0}
                                onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Responsibilities</Label>
                            <div className="flex gap-2">
                                <Input
                                    value={newResp}
                                    onChange={e => setNewResp(e.target.value)}
                                    placeholder="e.g. Member recruitment"
                                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addResponsibility(); } }}
                                />
                                <Button type="button" variant="outline" onClick={addResponsibility}><Plus className="w-4 h-4" /></Button>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {(formData.responsibilities || []).map((resp: string, i: number) => (
                                    <span key={i} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm border border-primary/20">
                                        {resp}
                                        <button type="button" onClick={() => removeResponsibility(i)} className="ml-1 hover:text-destructive transition-colors"><X className="w-3 h-3" /></button>
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button type="submit" className="flex-1 bg-primary">{isEditing ? <Save className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}{isEditing ? 'Update' : 'Add'}</Button>
                            {isEditing && <Button type="button" variant="outline" onClick={resetForm}><X className="w-4 h-4" /></Button>}
                        </div>
                    </form>
                </CardContent>
            </Card>

            <div className="lg:col-span-2 space-y-4">
                {committees
                    .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
                    .map((committee: any) => (
                    <Card key={committee.id} className="border-border hover:border-primary/30 transition-all">
                        <CardContent className="p-4 flex items-start gap-4">
                            {committee.image && (
                                <img src={committee.image} alt={committee.title} className="w-20 h-20 object-contain rounded-lg bg-background border border-border" />
                            )}
                            <div className="flex-1">
                                <h4 className="font-bold text-lg">{committee.title}</h4>
                                <p className="text-sm text-muted-foreground line-clamp-2">{committee.description}</p>
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {(committee.responsibilities || []).map((r: string, i: number) => (
                                        <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{r}</span>
                                    ))}
                                </div>
                                <p className="text-[10px] text-muted-foreground mt-1">Order: {committee.order || 0}</p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="ghost" size="icon" onClick={() => { setIsEditing(committee.id); setFormData(committee); }}><Edit3 className="w-4 h-4" /></Button>
                                <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => remove(committee.id)}><Trash2 className="w-4 h-4" /></Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

// --- Stats Manager ---
function StatsManager() {
    const { data: stats, add, update, remove } = useCollection('stats');
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        number: '',
        labelAr: '',
        labelEn: '',
        order: 0
    });
    const [seeding, setSeeding] = useState(false);

    const defaultStats = [
        { number: '+500', labelAr: 'عضو متألق', labelEn: 'Active Members', order: 1 },
        { number: '8', labelAr: 'لجان متخصصة', labelEn: 'Committees', order: 2 },
        { number: '+30', labelAr: 'فعالية ورحلة', labelEn: 'Events & Trips', order: 3 },
        { number: '100%', labelAr: 'شغف وطاقة', labelEn: 'Positive Energy', order: 4 },
    ];

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await update(isEditing, formData);
                toast.success('Stat updated successfully');
            } else {
                await add(formData);
                toast.success('Stat added successfully');
            }
            resetForm();
        } catch (err: any) {
            toast.error(err.message || 'Error saving stat');
        }
    };

    const resetForm = () => {
        setIsEditing(null);
        setFormData({ number: '', labelAr: '', labelEn: '', order: 0 });
    };

    const seedDefaults = async () => {
        setSeeding(true);
        try {
            for (const item of defaultStats) {
                await add(item);
            }
            toast.success('Default stats loaded successfully!');
        } catch (err: any) {
            toast.error(err.message || 'Error seeding stats');
        } finally {
            setSeeding(false);
        }
    };

    const sortedStats = [...stats].sort((a: any, b: any) => (a.order || 0) - (b.order || 0));

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card/40 border border-border p-4 rounded-xl">
                <div>
                    <h3 className="text-lg font-bold text-foreground">Home Stats (أرقام وإحصائيات الصفحة الرئيسية)</h3>
                    <p className="text-sm text-muted-foreground">Manage the stat numbers shown prominently on the hero section.</p>
                </div>
                {stats.length === 0 && (
                    <Button 
                        onClick={seedDefaults} 
                        disabled={seeding}
                        className="bg-primary text-primary-foreground font-semibold"
                    >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        {seeding ? 'Loading Defaults...' : 'Load Default Stats (تهيئة الأرقام الافتراضية)'}
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-1 border-border bg-card/50 backdrop-blur-sm self-start">
                    <CardHeader>
                        <CardTitle>{isEditing ? 'Edit Stat' : 'Add New Stat'}</CardTitle>
                        <CardDescription>Enter the number and labels in both Arabic and English.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div className="space-y-2">
                                <Label>Number / Value (الرقم أو القيمة)</Label>
                                <Input
                                    value={formData.number}
                                    onChange={e => setFormData({ ...formData, number: e.target.value })}
                                    required
                                    placeholder="e.g. +500, 8, +30, 100%"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Arabic Label (الوصف بالعربية)</Label>
                                <Input
                                    value={formData.labelAr}
                                    onChange={e => setFormData({ ...formData, labelAr: e.target.value })}
                                    required
                                    placeholder="e.g. عضو متألق"
                                    dir="rtl"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>English Label (الوصف بالإنجليزية)</Label>
                                <Input
                                    value={formData.labelEn}
                                    onChange={e => setFormData({ ...formData, labelEn: e.target.value })}
                                    required
                                    placeholder="e.g. Active Members"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Display Order (الترتيب)</Label>
                                <Input
                                    type="number"
                                    value={formData.order}
                                    onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                                />
                            </div>

                            {/* Live mini preview */}
                            <div className="mt-4 p-3 rounded-lg bg-background border border-border text-center">
                                <p className="text-xs text-muted-foreground mb-1">Preview / معاينة</p>
                                <div className="text-2xl font-black text-primary font-mono">
                                    {formData.number || '0'}
                                </div>
                                <div className="text-xs text-muted-foreground mt-0.5">
                                    {formData.labelAr || 'الوصف بالعربية'} / {formData.labelEn || 'English Label'}
                                </div>
                            </div>

                            <div className="flex gap-2 pt-2">
                                <Button type="submit" className="flex-1 bg-primary">
                                    {isEditing ? <Save className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                                    {isEditing ? 'Update Stat' : 'Add Stat'}
                                </Button>
                                {isEditing && (
                                    <Button type="button" variant="outline" onClick={resetForm}>
                                        <X className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <div className="lg:col-span-2 space-y-4">
                    {sortedStats.length === 0 ? (
                        <div className="text-center py-12 border border-dashed border-border rounded-xl">
                            <BarChart3 className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
                            <h4 className="font-semibold text-foreground">No custom stats configured yet</h4>
                            <p className="text-sm text-muted-foreground max-w-sm mx-auto mt-1 mb-4">
                                Currently the website is showing the default stats (+500, 8, +30, 100%).
                            </p>
                            <Button onClick={seedDefaults} disabled={seeding} variant="outline">
                                <RotateCcw className="w-4 h-4 mr-2" />
                                Click here to load defaults into database
                            </Button>
                        </div>
                    ) : (
                        sortedStats.map((item: any) => (
                            <Card key={item.id} className="border-border hover:border-primary/30 transition-all">
                                <CardContent className="p-4 flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-xl font-black text-primary font-mono">
                                            {item.number}
                                        </div>
                                        <div>
                                            <div className="font-bold text-foreground text-base">
                                                {item.labelAr || '—'}
                                            </div>
                                            <div className="text-sm text-muted-foreground font-medium">
                                                {item.labelEn || '—'}
                                            </div>
                                            <div className="text-[11px] text-muted-foreground/70 mt-0.5">
                                                Order: {item.order || 0}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => {
                                                setIsEditing(item.id);
                                                setFormData({
                                                    number: item.number || '',
                                                    labelAr: item.labelAr || '',
                                                    labelEn: item.labelEn || '',
                                                    order: item.order || 0
                                                });
                                            }}
                                        >
                                            <Edit3 className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-destructive hover:bg-destructive/10"
                                            onClick={() => remove(item.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
