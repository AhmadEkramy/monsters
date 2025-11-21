import { Facebook, Instagram, Twitter, Youtube, Mail } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export function Footer() {
  const { t } = useLanguage();

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Youtube, href: '#', label: 'YouTube' },
    { icon: Mail, href: 'mailto:monsters@mnu.edu.eg', label: 'Email' },
  ];

  return (
    <footer className="bg-card border-t border-border mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-black text-primary text-glow">MONSTERS</h3>
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
