import { Facebook, Instagram, Github, Linkedin, Music2 as TikTok } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export function Footer() {
  const { t } = useLanguage();

  const socialLinks = [
    { icon: Facebook, href: 'https://www.facebook.com/share/1C1jzpXb3L/', label: 'Facebook' },
    { icon: Instagram, href: 'https://www.instagram.com/monsters_mnu?igsh=aW5kMDA3eXF6N3hy', label: 'Instagram' },
    { icon: TikTok, href: 'https://www.tiktok.com/@monsters.mnu?_r=1&_t=ZS-93j4s2or7Y4', label: 'TikTok' },
  ];

  const creatorSocials = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: 'https://www.instagram.com/mustafa_ekramy1?igsh=OWJrbTc2ZjY1NnY4', label: 'Instagram' },
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Linkedin, href: 'https://www.linkedin.com/in/mustafa-ekramy-47885537a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app', label: 'LinkedIn' },
  ];

  return (
    <footer className="bg-card border-t border-border mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img src="/logo.png" alt="Monsters Logo" className="h-12 w-auto" />
              <h3 className="text-2xl font-black text-primary text-glow tracking-tighter">MONSTERS</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              {t('heroSubtitle')}
            </p>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">{t('location')}</h4>
            <p className="text-sm text-muted-foreground">
              {t('locationText')}
            </p>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">{t('followUs')}</h4>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors duration-300 hover-glow"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Creator */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">Website Creator</h4>
            <div className="space-y-2">
              <p className="font-bold text-primary">Mostafa Ekramy</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Computer Engineer</p>
              <div className="flex space-x-3 pt-2">
                {creatorSocials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors duration-300 hover-glow"
                    aria-label={social.label}
                  >
                    <social.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 Monsters Team - Mansoura National University. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
