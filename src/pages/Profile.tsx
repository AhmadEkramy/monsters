import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { updateProfile } from 'firebase/auth';
import { toast } from 'sonner';
import { User, Mail, Shield, Calendar, Save, Loader2, Camera } from 'lucide-react';

export default function Profile() {
    const { user, userData, isAdmin } = useAuth();
    const { t } = useLanguage();
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState(userData?.name || user?.displayName || '');
    const [photoURL, setPhotoURL] = useState(user?.photoURL || '');

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setLoading(true);

        try {
            // Update Firebase Auth Profile
            await updateProfile(user, {
                displayName: name,
                photoURL: photoURL
            });

            // Update Firestore User Doc
            const userDocRef = doc(db, 'users', user.uid);
            await updateDoc(userDocRef, {
                name: name,
                photoURL: photoURL
            });

            toast.success(t('updateSuccess'));
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen pt-24 pb-12 bg-background relative overflow-hidden">
            {/* Glow Effects */}
            <div className="absolute top-1/4 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-primary/5 rounded-full blur-[100px] animate-pulse" />

            <div className="container mx-auto px-4 max-w-4xl relative z-10">
                <header className="mb-10 animate-fade-in-up">
                    <h1 className="text-4xl font-black text-foreground mb-2 flex items-center gap-3">
                        <User className="w-10 h-10 text-primary" />
                        {t('myProfile')}
                    </h1>
                    <p className="text-muted-foreground">{t('personalInfo')}</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Sidebar / Overview */}
                    <Card className="md:col-span-1 border-border bg-card/50 backdrop-blur-xl animate-slide-in-left">
                        <CardHeader className="text-center">
                            <div className="relative mx-auto w-32 h-32 mb-4 group">
                                <div className="w-full h-full rounded-2xl overflow-hidden border-2 border-primary/20 hover:border-primary transition-colors duration-500">
                                    <img
                                        src={photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground shadow-lg border-2 border-background animate-float cursor-pointer hover:scale-110 transition-transform">
                                    <Camera className="w-5 h-5" />
                                </div>
                            </div>
                            <CardTitle className="text-xl font-bold">{userData?.name || user.displayName}</CardTitle>
                            <CardDescription className="flex items-center justify-center gap-2 mt-1">
                                <Shield className="w-4 h-4 text-primary" />
                                <span className="uppercase tracking-wider font-bold text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                    {userData?.role || 'User'}
                                </span>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-4 border-t border-border/50 text-sm">
                            <div className="flex items-center gap-3 text-muted-foreground">
                                <Mail className="w-4 h-4 text-primary" />
                                {user.email}
                            </div>
                            <div className="flex items-center gap-3 text-muted-foreground">
                                <Calendar className="w-4 h-4 text-primary" />
                                <span className="text-[11px] uppercase tracking-tighter">{t('memberSince')}: {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'Join 2025'}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Edit Form */}
                    <Card className="md:col-span-2 border-border bg-card/50 backdrop-blur-xl animate-slide-in-right">
                        <CardHeader>
                            <CardTitle>{t('personalInfo')}</CardTitle>
                            <CardDescription>Update your personal details below.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleUpdate} className="space-y-6">
                                <div className="space-y-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name" className="text-sm font-bold ml-1">{t('name')}</Label>
                                        <div className="relative group">
                                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                            <Input
                                                id="name"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="pl-10 h-11 bg-background/50 border-border/50 focus:border-primary transition-all duration-300"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="photo" className="text-sm font-bold ml-1">Photo URL</Label>
                                        <div className="relative group">
                                            <Camera className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                            <Input
                                                id="photo"
                                                value={photoURL}
                                                onChange={(e) => setPhotoURL(e.target.value)}
                                                placeholder="https://..."
                                                className="pl-10 h-11 bg-background/50 border-border/50 focus:border-primary transition-all duration-300"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label className="text-sm font-bold ml-1">{t('email')}</Label>
                                        <div className="relative opacity-60">
                                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                value={user.email || ''}
                                                disabled
                                                className="pl-10 h-11 bg-muted/20 border-border/50"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full md:w-auto px-8 h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-black tracking-tight flex items-center gap-2 hover-glow"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            <Save className="w-5 h-5" />
                                            {t('saveChanges')}
                                        </>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
