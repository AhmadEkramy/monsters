import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCollection } from '@/hooks/useFirestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useParams, Navigate } from 'react-router-dom';
import { User, Mail, Shield, Calendar, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function UserProfile() {
    const { userId } = useParams();
    const { user: currentUser } = useAuth();
    const { t } = useLanguage();
    const [userProfile, setUserProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!userId) return;
            try {
                const userDoc = await getDoc(doc(db, 'users', userId));
                if (userDoc.exists()) {
                    setUserProfile(userDoc.data());
                }
            } catch (error) {
                console.error("Error fetching user profile:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [userId]);

    if (!currentUser) return <Navigate to="/login" />;
    if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
    if (!userProfile) return <div className="min-h-screen flex items-center justify-center">User not found</div>;

    return (
        <div className="min-h-screen pt-24 pb-12 bg-background relative overflow-hidden">
            <div className="absolute top-1/4 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-primary/5 rounded-full blur-[100px]" />

            <div className="container mx-auto px-4 max-w-2xl relative z-10">
                <Card className="border-border bg-card/50 backdrop-blur-xl animate-fade-in">
                    <CardHeader className="text-center">
                        <div className="relative mx-auto w-32 h-32 mb-4">
                            <div className="w-full h-full rounded-2xl overflow-hidden border-2 border-primary/20">
                                <img
                                    src={userProfile.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userProfile.email}`}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                        <CardTitle className="text-2xl font-black">{userProfile.name}</CardTitle>
                        <CardDescription className="flex items-center justify-center gap-2 mt-1">
                            <Shield className="w-4 h-4 text-primary" />
                            <span className="uppercase tracking-wider font-bold text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                {userProfile.role || 'User'}
                            </span>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6 border-t border-border/50">
                        <div className="grid gap-4">
                            <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/20 border border-border/50">
                                <Mail className="w-5 h-5 text-primary" />
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-muted-foreground">{t('email')}</p>
                                    <p className="font-medium">{userProfile.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/20 border border-border/50">
                                <Calendar className="w-5 h-5 text-primary" />
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-muted-foreground">{t('memberSince')}</p>
                                    <p className="font-medium">
                                        {userProfile.createdAt ? new Date(userProfile.createdAt).toLocaleDateString() : 'Join 2025'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
