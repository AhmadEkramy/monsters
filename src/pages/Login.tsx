import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    updateProfile,
    sendPasswordResetEmail
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Mail, Lock, User as UserIcon, Loader2, Eye, EyeOff, KeyRound } from 'lucide-react';

export default function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [resetLoading, setResetLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    const { t, language } = useLanguage();
    const navigate = useNavigate();

    const getAuthErrorMessage = (error: any) => {
        const code = error?.code || '';
        switch (code) {
            case 'auth/invalid-credential':
            case 'auth/wrong-password':
            case 'auth/user-not-found':
                return language === 'ar'
                    ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة، أو أن الحساب غير مسجل بعد. تأكد من البيانات أو اضغط على "إنشاء حساب".'
                    : 'Invalid email or password. Please verify your credentials or create a new account.';
            case 'auth/email-already-in-use':
                return language === 'ar'
                    ? 'هذا البريد الإلكتروني مسجل بالفعل. يرجى تسجيل الدخول بدلاً من إنشاء حساب جديد.'
                    : 'This email is already registered. Please log in instead.';
            case 'auth/weak-password':
                return language === 'ar'
                    ? 'كلمة المرور ضعيفة جداً. يجب أن تتكون من 6 أحرف أو أرقام على الأقل.'
                    : 'Password is too weak. Please use at least 6 characters.';
            case 'auth/invalid-email':
                return language === 'ar'
                    ? 'صيغة البريد الإلكتروني غير صحيحة. يرجى التأكد من كتابته بشكل سليم.'
                    : 'Invalid email format. Please check your email address.';
            case 'auth/too-many-requests':
                return language === 'ar'
                    ? 'تم حظر المحاولات مؤقتاً بسبب كثرة المحاولات الخاطئة. يرجى الانتظار دقيقة والمحاولة مجدداً.'
                    : 'Too many failed login attempts. Please wait a moment and try again.';
            case 'auth/network-request-failed':
                return language === 'ar'
                    ? 'تعذر الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت.'
                    : 'Network error. Please check your internet connection.';
            case 'auth/user-disabled':
                return language === 'ar'
                    ? 'تم تعطيل هذا الحساب. يرجى التواصل مع إدارة الفريق.'
                    : 'This account has been disabled.';
            default:
                return language === 'ar'
                    ? 'حدث خطأ أثناء المصادقة: ' + (error?.message || 'يرجى المحاولة لاحقاً')
                    : (error?.message || 'An error occurred during authentication');
        }
    };

    const handleForgotPassword = async () => {
        const cleanEmail = email.trim();
        if (!cleanEmail) {
            toast.error(
                language === 'ar'
                    ? 'يرجى كتابة البريد الإلكتروني في الحقل أعلاه أولاً لإرسال رابط إعادة التعيين.'
                    : 'Please enter your email in the field above first.'
            );
            return;
        }

        setResetLoading(true);
        try {
            await sendPasswordResetEmail(auth, cleanEmail);
            toast.success(
                language === 'ar'
                    ? 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني! تفقد صندوق الوارد أو البريد العشوائي (Spam).'
                    : 'Password reset link sent to your email! Check your inbox or spam folder.'
            );
        } catch (error: any) {
            toast.error(getAuthErrorMessage(error));
        } finally {
            setResetLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const cleanEmail = email.trim();

        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, cleanEmail, password);
                toast.success(language === 'ar' ? 'تم تسجيل الدخول بنجاح! أهلاً بك' : 'Logged in successfully! Welcome');
            } else {
                const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
                await updateProfile(userCredential.user, { displayName: name.trim() });

                // Create user document in Firestore
                await setDoc(doc(db, 'users', userCredential.user.uid), {
                    name: name.trim(),
                    email: cleanEmail,
                    role: 'user', // Default role
                    createdAt: new Date().toISOString()
                });

                toast.success(language === 'ar' ? 'تم إنشاء الحساب بنجاح! أهلاً بك في مونسترز' : 'Account created successfully! Welcome to Monsters');
            }
            navigate('/');
        } catch (error: any) {
            console.error(error);
            toast.error(getAuthErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 px-4 pt-32 pb-12">
            {/* Background Decorations */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(78,240,55,0.1),transparent_50%)] pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(78,240,55,0.05),transparent_50%)] pointer-events-none" />

            <div className="w-full max-w-md relative z-10 animate-fade-in-up">
                {/* Logo Section */}
                <div className="text-center mb-8 space-y-2">
                    <div className="flex justify-center mb-4">
                        <div className="w-24 h-24 bg-primary/10 rounded-2xl flex items-center justify-center animate-float p-4 shadow-xl shadow-primary/10 border border-primary/20">
                            <img src="/logo.png" alt="Monsters Logo" className="w-full h-auto drop-shadow-glow" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-black text-foreground tracking-tight">
                        MONSTERS <span className="text-primary">TEAM</span>
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        {isLogin ? t('heroSubtitle') : t('joinDescription')}
                    </p>
                </div>

                <Card className="border-border/80 bg-card/60 backdrop-blur-xl shadow-2xl transition-all duration-500">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-black flex items-center gap-2">
                            {isLogin ? t('signIn') : t('signUp')}
                        </CardTitle>
                        <CardDescription className="text-xs">
                            {isLogin
                                ? (language === 'ar' ? 'أدخل بياناتك للدخول إلى حسابك' : 'Enter your credentials to access your account')
                                : (language === 'ar' ? 'قم بإنشاء حساب جديد للانضمام إلينا' : 'Create a new account to join us')
                            }
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                            {!isLogin && (
                                <div className="space-y-1.5">
                                    <Label htmlFor="name" className="text-xs font-bold uppercase">{t('name')}</Label>
                                    <div className="relative">
                                        <UserIcon className="absolute left-3 rtl:left-auto rtl:right-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="name"
                                            placeholder="Ahmed Ekramy"
                                            className="pl-10 rtl:pl-3 rtl:pr-10"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-1.5">
                                <Label htmlFor="email" className="text-xs font-bold uppercase">{t('email')}</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 rtl:left-auto rtl:right-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="user@example.com"
                                        className="pl-10 rtl:pl-3 rtl:pr-10 text-left rtl:text-right"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="password" className="text-xs font-bold uppercase">{t('password')}</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 rtl:left-auto rtl:right-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        className="pl-10 rtl:pl-10 rtl:pr-10 pr-10"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 rtl:right-auto rtl:left-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors p-0.5"
                                        tabIndex={-1}
                                        title={showPassword ? "إخفاء كلمة المرور" : "عرض كلمة المرور"}
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>

                                {isLogin && (
                                    <div className="flex justify-end pt-1">
                                        <button
                                            type="button"
                                            onClick={handleForgotPassword}
                                            disabled={resetLoading}
                                            className="text-xs text-muted-foreground hover:text-primary transition-colors hover:underline inline-flex items-center gap-1 cursor-pointer"
                                        >
                                            <KeyRound className="w-3 h-3" />
                                            <span>
                                                {resetLoading
                                                    ? (language === 'ar' ? 'جارٍ إرسال الرابط...' : 'Sending link...')
                                                    : (language === 'ar' ? 'نسيت كلمة المرور؟' : 'Forgot Password?')}
                                            </span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </CardContent>

                        <CardFooter className="flex flex-col space-y-4 pt-2">
                            <Button
                                type="submit"
                                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-black h-11 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all text-sm uppercase tracking-wider"
                                disabled={loading}
                            >
                                {loading ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    isLogin ? t('login') : t('signUp')
                                )}
                            </Button>

                            <div className="text-center text-sm text-muted-foreground">
                                {isLogin ? t('dontHaveAccount') : t('alreadyHaveAccount')}{' '}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsLogin(!isLogin);
                                        setShowPassword(false);
                                    }}
                                    className="text-primary font-bold hover:underline underline-offset-4 cursor-pointer"
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
