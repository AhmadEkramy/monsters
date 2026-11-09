import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';
import { Mail, MapPin, Phone, MessageSquare, Send, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function Contact() {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const whatsappNumber = "201552684664";
    const message = `Name: ${formData.name}%0AMessage: ${formData.message}`;
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

    window.open(whatsappUrl, '_blank');

    toast.success(language === 'ar' ? 'جارٍ التحويل إلى واتساب...' : 'Redirecting to WhatsApp...');
    setFormData({ name: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen pt-28 pb-20 bg-background relative overflow-x-hidden">
      {/* Soft ambient background glow */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[700px] h-[320px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-secondary/80 border border-primary/20 backdrop-blur-md shadow-sm mb-4">
            <MessageSquare className="w-3.5 h-3.5 text-primary" />
            <span>{language === 'ar' ? 'تواصل مع فريقنا' : 'Get In Touch'}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-foreground tracking-tight">
            <span className="bg-gradient-to-r from-foreground via-foreground/90 to-primary bg-clip-text text-transparent">
              {t('contactTitle')}
            </span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mt-3 leading-relaxed">
            {t('contactDescription')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto items-start">
          
          {/* Contact Info Cards (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Location */}
            <div className="p-5 rounded-2xl bg-card/70 backdrop-blur-md border border-border/80 hover:border-primary/50 transition-all duration-300 shadow-md hover:shadow-[0_0_20px_hsl(var(--primary)/0.15)] flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{t('location')}</h3>
                <p className="text-base font-semibold text-foreground">{t('locationText')}</p>
                <p className="text-xs text-muted-foreground">{language === 'ar' ? 'كلية الهندسة' : 'Faculty of Engineering'}</p>
              </div>
            </div>

            {/* Email */}
            <div className="p-5 rounded-2xl bg-card/70 backdrop-blur-md border border-border/80 hover:border-primary/50 transition-all duration-300 shadow-md hover:shadow-[0_0_20px_hsl(var(--primary)/0.15)] flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{t('email')}</h3>
                <a
                  href="mailto:monsters.femnu@gmail.com"
                  className="text-base font-semibold text-foreground hover:text-primary transition-colors block break-all"
                >
                  monsters.femnu@gmail.com
                </a>
              </div>
            </div>

            {/* Phone / WhatsApp */}
            <div className="p-5 rounded-2xl bg-card/70 backdrop-blur-md border border-border/80 hover:border-primary/50 transition-all duration-300 shadow-md hover:shadow-[0_0_20px_hsl(var(--primary)/0.15)] flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  {language === 'ar' ? 'الهاتف وواتساب' : 'Phone & WhatsApp'}
                </h3>
                <a
                  href="https://wa.me/201552684664"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base font-semibold text-foreground hover:text-primary transition-colors block"
                  dir="ltr"
                >
                  +20 15 52684664
                </a>
              </div>
            </div>

          </div>

          {/* Contact Form (7 cols) */}
          <div className="lg:col-span-7">
            <Card className="p-6 sm:p-8 rounded-3xl bg-card/70 backdrop-blur-md border border-border/80 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full pointer-events-none blur-2xl" />

              <div className="mb-6 space-y-1 relative z-10">
                <h2 className="text-2xl font-black text-foreground">
                  {language === 'ar' ? 'أرسل لنا رسالة مباشرة' : 'Send Us a Message'}
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {language === 'ar'
                    ? 'سيتم تحويل رسالتك إلى محادثة واتساب مع الفريق للرد الفوري.'
                    : 'Your message will open directly in WhatsApp for prompt communication.'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                <div>
                  <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-foreground mb-2">
                    {t('name')}
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full rounded-xl bg-secondary/40 border-border/80 focus:border-primary/60 focus:ring-1 focus:ring-primary/60 py-5"
                    placeholder={language === 'ar' ? 'اكتب اسمك هنا...' : 'Enter your name'}
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-bold uppercase tracking-wider text-foreground mb-2">
                    {t('message')}
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full min-h-[140px] rounded-xl bg-secondary/40 border-border/80 focus:border-primary/60 focus:ring-1 focus:ring-primary/60"
                    placeholder={language === 'ar' ? 'كيف يمكننا مساعدتك؟...' : 'Tell us how we can help you...'}
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-6 shadow-[0_0_20px_hsl(var(--primary)/0.3)] hover:shadow-[0_0_30px_hsl(var(--primary)/0.5)] transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{t('send')}</span>
                </Button>
              </form>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}
