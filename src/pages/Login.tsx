import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    updateProfile
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Sparkles, Mail, Lock, User as UserIcon, Loader2 } from 'lucide-react';

export default function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    const { t, language } = useLanguage();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
                toast.success(language === 'ar' ? 'تم تسجيل الدخول بنجاح' : 'Logged in successfully');
            } else {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                await updateProfile(userCredential.user, { displayName: name });

                // Create user document in Firestore
                await setDoc(doc(db, 'users', userCredential.user.uid), {
                    name: name,
                    email: email,
                    role: 'user', // Default role
                    createdAt: new Date().toISOString()
                });

                toast.success(language === 'ar' ? 'تم إنشاء الحساب بنجاح' : 'Account created successfully');
            }
            navigate('/');
        } catch (error: any) {
            console.error(error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 px-4">
            {/* Background Decorations */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(78,240,55,0.1),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(78,240,55,0.05),transparent_50%)]" />

            <div className="w-full max-w-md relative z-10 animate-fade-in-up">
                {/* Logo Section */}
                <div className="text-center mb-8 space-y-2">
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center animate-float glow-sm">
                            <Sparkles className="w-8 h-8 text-primary" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-black text-foreground tracking-tight">
                        MONSTERS <span className="text-primary">TEAM</span>
                    </h1>
                    <p className="text-muted-foreground">
                        {isLogin ? t('heroSubtitle') : t('joinDescription')}
                    </p>
                </div>

                <Card className="border-border bg-card/50 backdrop-blur-xl hover-glow transition-all duration-500">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold flex items-center gap-2">
                            {isLogin ? t('signIn') : t('signUp')}
                        </CardTitle>
                        <CardDescription>
                            {isLogin
                                ? (language === 'ar' ? 'أدخل بياناتك للدخول إلى حسابك' : 'Enter your credentials to access your account')
                                : (language === 'ar' ? 'قم بإنشاء حساب جديد للانضمام إلينا' : 'Create a new account to join us')
                            }
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                            {!isLogin && (
                                <div className="space-y-2">
                                    <Label htmlFor="name">{t('name')}</Label>
                                    <div className="relative">
                                        <UserIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="name"
                                            placeholder="John Doe"
                                            className="pl-10"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            )}
                            <div className="space-y-2">
                                <Label htmlFor="email">{t('email')}</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="m@example.com"
                                        className="pl-10"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">{t('password')}</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type="password"
                                        className="pl-10"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col space-y-4">
                            <Button
                                type="submit"
                                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-11"
                                disabled={loading}
                            >
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (isLogin ? t('login') : t('signUp'))}
                            </Button>
                            <div className="text-center text-sm text-muted-foreground">
                                {isLogin ? t('dontHaveAccount') : t('alreadyHaveAccount')}{' '}
                                <button
                                    type="button"
                                    onClick={() => setIsLogin(!isLogin)}
                                    className="text-primary font-bold hover:underline underline-offset-4"
                                >
                                    {isLogin ? t('signUp') : t('signIn')}
                                </button>
                            </div>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    );
}
