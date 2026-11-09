import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Moon, Sun, Languages, User, Users, LogOut, LayoutDashboard, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { t, toggleLanguage, language } = useLanguage();
  const { user, isAdmin, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { path: '/', label: t('home') },
    { path: '/team', label: t('ourTeam') },
    { path: '/committees', label: t('committees') },
    { path: '/events', label: t('events') },
    { path: '/competitions', label: t('competitions') },
    { path: '/trips', label: t('trips') },
    { path: '/members', label: t('members') },
    { path: '/contact', label: t('contact') },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/70 transition-all duration-300">
      {/* Bottom neon accent gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/35 to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-3">
          
          {/* Brand Logo & Logos Group */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 group shrink-0">
              <div className="relative">
                <img
                  src="/logo.png"
                  alt="Monsters Logo"
                  className="h-9 sm:h-11 w-auto transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_0_10px_rgba(78,240,55,0.4)]"
                />
              </div>

              <div className="flex items-center">
                <span className="text-xl sm:text-2xl font-black text-foreground tracking-tighter group-hover:text-primary transition-colors">
                  MON<span className="text-primary text-glow">STERS</span>
                </span>
              </div>
            </Link>

            {/* University & College Partner Logos Pill (Desktop) */}
            <div className="hidden xl:flex items-center gap-2.5 px-3 py-1 rounded-full bg-secondary/50 border border-border/70 backdrop-blur-sm">
              <img
                src="/logo1.png"
                alt="University Logo"
                className="h-6 w-auto opacity-80 hover:opacity-100 transition-opacity"
                title="Mansoura National University"
              />
              <span className="w-[1px] h-3.5 bg-border/80" />
              <img
                src="/logo2.png"
                alt="College Logo"
                className="h-6 w-auto opacity-80 hover:opacity-100 transition-opacity"
                title="Faculty of Engineering"
              />
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 p-1 rounded-full bg-secondary/40 border border-border/60 backdrop-blur-md shadow-sm">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "px-3.5 py-1.5 rounded-full text-xs xl:text-sm font-semibold transition-all duration-300 relative",
                    active
                      ? "text-primary bg-primary/15 border border-primary/30 shadow-[0_0_12px_hsl(var(--primary)/0.2)] font-bold"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/80 border border-transparent"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right Side Buttons (Theme, Lang, User/Auth) */}
          <div className="hidden md:flex items-center gap-2">
            
            {/* Theme Toggle Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="w-9 h-9 rounded-full bg-secondary/50 hover:bg-secondary border border-border/60 hover:border-primary/40 text-foreground transition-all duration-300 shadow-sm"
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? (
                <Moon className="h-4 w-4 text-foreground transition-transform hover:rotate-12" />
              ) : (
                <Sun className="h-4 w-4 text-foreground transition-transform hover:rotate-45" />
              )}
            </Button>

            {/* Language Toggle Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="h-9 px-3 rounded-full bg-secondary/50 hover:bg-secondary border border-border/60 hover:border-primary/40 text-xs font-bold text-foreground transition-all duration-300 shadow-sm flex items-center gap-1.5"
              aria-label="Toggle Language"
            >
              <Languages className="h-3.5 w-3.5 text-primary" />
              <span>{language === 'en' ? 'العربية' : 'English'}</span>
            </Button>

            {/* User Dropdown or Sign In */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-9 h-9 rounded-full bg-primary/15 border border-primary/30 hover:border-primary/60 text-primary shadow-sm hover:scale-105 transition-all"
                  >
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-card/95 backdrop-blur-xl border-border rounded-2xl shadow-xl p-1.5">
                  <DropdownMenuLabel className="font-bold text-xs text-muted-foreground px-3 py-2">
                    {user.displayName || user.email}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link to="/dashboard">
                    <DropdownMenuItem className="cursor-pointer font-bold text-primary rounded-xl px-3 py-2">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>{t('dashboard')}</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link to="/profile">
                    <DropdownMenuItem className="cursor-pointer rounded-xl px-3 py-2">
                      <User className="mr-2 h-4 w-4" />
                      <span>{t('profile')}</span>
                    </DropdownMenuItem>
                  </Link>
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <Link to="/admin">
                        <DropdownMenuItem className="cursor-pointer rounded-xl px-3 py-2">
                          <Users className="mr-2 h-4 w-4" />
                          <span>{t('adminPanel')}</span>
                        </DropdownMenuItem>
                      </Link>
                    </>
                  )}
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="text-destructive focus:text-destructive cursor-pointer rounded-xl px-3 py-2"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t('signOut')}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button
                  size="sm"
                  className="rounded-full px-5 py-2 h-9 text-xs font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_15px_hsl(var(--primary)/0.3)] hover:shadow-[0_0_20px_hsl(var(--primary)/0.45)] hover:scale-105 transition-all duration-300"
                >
                  {t('signIn')}
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Actions & Menu Toggle */}
          <div className="lg:hidden flex items-center gap-1.5">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="w-8 h-8 rounded-full bg-secondary/50 border border-border/60 text-foreground"
            >
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleLanguage}
              className="w-8 h-8 rounded-full bg-secondary/50 border border-border/60 text-foreground"
            >
              <Languages className="h-4 w-4 text-primary" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="w-9 h-9 rounded-full bg-secondary/70 border border-border/80 text-foreground"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="lg:hidden bg-card/95 backdrop-blur-2xl border-t border-border/80 animate-fade-in shadow-2xl">
          <div className="container mx-auto px-4 py-4 space-y-2">
            
            {/* Nav links */}
            <div className="grid grid-cols-2 gap-2">
              {navLinks.map((link) => {
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 text-center",
                      active
                        ? "text-primary bg-primary/15 border border-primary/30 font-bold"
                        : "text-foreground bg-secondary/40 hover:bg-secondary border border-border/50"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Mobile Auth / Profile */}
            <div className="pt-3 border-t border-border/60 mt-3 space-y-2">
              {user ? (
                <>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/40 border border-border/50">
                    <span className="text-xs font-bold text-muted-foreground truncate">
                      {user.displayName || user.email}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        handleSignOut();
                        setIsOpen(false);
                      }}
                      className="text-destructive text-xs hover:bg-destructive/10 h-7 px-2"
                    >
                      <LogOut className="mr-1.5 h-3.5 w-3.5" />
                      {t('signOut')}
                    </Button>
                  </div>
                  
                  <div className="flex gap-2">
                    <Link
                      to="/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="flex-1 text-center py-2.5 rounded-xl text-xs font-bold text-primary bg-primary/10 border border-primary/20"
                    >
                      {t('dashboard')}
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setIsOpen(false)}
                        className="flex-1 text-center py-2.5 rounded-xl text-xs font-bold text-foreground bg-secondary/80 border border-border/60"
                      >
                        {t('adminPanel')}
                      </Link>
                    )}
                  </div>
                </>
              ) : (
                <Link to="/login" onClick={() => setIsOpen(false)} className="block">
                  <Button className="w-full rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-5 shadow-md">
                    {t('signIn')}
                  </Button>
                </Link>
              )}
            </div>

          </div>
        </div>
      )}
    </nav>
  );
}
