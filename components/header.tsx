'use client';

import { useState, useEffect } from 'react';
import { Menu, X, Search, Moon, Sun, ChevronDown, Shield, LogIn } from 'lucide-react';
import { useTheme } from 'next-themes';
import { createClient } from '@/lib/supabase/client';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [isAdmin, setIsAdmin] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    setMounted(true);
    checkAdmin();

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      checkAdmin();
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setIsAdmin(false);
      return;
    }

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    setIsAdmin(profile?.role === 'admin');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <a href="/" className="flex items-center gap-2">
            <div className="text-2xl font-bold text-gradient">Vetorre</div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            <a href="/tools" className="text-sm font-semibold hover:text-primary transition-colors">
              AI Tools
            </a>
            <a href="/courses" className="text-sm font-semibold hover:text-primary transition-colors flex items-center gap-1">
              AI Courses
              <span className="text-xs bg-accent text-white px-1.5 py-0.5 rounded">New</span>
            </a>
            <div className="relative group">
              <button className="text-sm font-semibold hover:text-primary transition-colors flex items-center gap-1">
                AI Insights
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 bg-background border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <a href="/blog" className="block px-4 py-2 text-sm hover:bg-secondary/10 rounded-t-lg">
                  Blog
                </a>
                <a href="/news" className="block px-4 py-2 text-sm hover:bg-secondary/10">
                  News
                </a>
                <a href="/guides" className="block px-4 py-2 text-sm hover:bg-secondary/10 rounded-b-lg">
                  Guides
                </a>
              </div>
            </div>
            <div className="relative group">
              <button className="text-sm font-semibold hover:text-primary transition-colors flex items-center gap-1">
                Submit/Advertise
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 bg-background border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <a href="/submit" className="block px-4 py-2 text-sm hover:bg-secondary/10 rounded-t-lg">
                  Submit Tool
                </a>
                <a href="/advertise" className="block px-4 py-2 text-sm hover:bg-secondary/10 rounded-b-lg">
                  Advertise
                </a>
              </div>
            </div>
            <a href="/resources" className="text-sm font-semibold hover:text-primary transition-colors">
              Resources
            </a>
            <a href="/agents" className="text-sm font-semibold hover:text-primary transition-colors flex items-center gap-1">
              AI Agents
              <span className="text-xs bg-accent text-white px-1.5 py-0.5 rounded">New</span>
            </a>
          </nav>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          {/* Search Button */}
          <button className="hidden md:flex items-center gap-2 px-3 py-1.5 border border-border rounded-lg hover:border-primary transition-colors">
            <Search className="w-4 h-4" />
            <span className="text-sm text-secondary">Search</span>
            <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-xs bg-secondary/10 rounded">
              Ctrl K
            </kbd>
          </button>

          {/* Admin Button (only for logged-in admins) */}
          {isAdmin ? (
            <a
              href="/admin"
              className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors text-sm font-semibold"
            >
              <Shield className="w-4 h-4" />
              Admin
            </a>
          ) : (
            <a
              href="/auth/signin"
              className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-semibold"
            >
              <LogIn className="w-4 h-4" />
              Login
            </a>
          )}

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg hover:bg-secondary/10 transition-colors"
            aria-label="Toggle theme"
          >
            {!mounted ? (
              <Moon className="w-5 h-5" />
            ) : theme === 'dark' ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-secondary/10 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-background">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <a href="/tools" className="text-sm font-semibold hover:text-primary transition-colors">
              AI Tools
            </a>
            <a href="/courses" className="text-sm font-semibold hover:text-primary transition-colors flex items-center gap-1">
              AI Courses
              <span className="text-xs bg-accent text-white px-1.5 py-0.5 rounded">New</span>
            </a>
            <a href="/blog" className="text-sm font-semibold hover:text-primary transition-colors">
              Blog
            </a>
            <a href="/news" className="text-sm font-semibold hover:text-primary transition-colors">
              News
            </a>
            <a href="/guides" className="text-sm font-semibold hover:text-primary transition-colors">
              Guides
            </a>
            <a href="/submit" className="text-sm font-semibold hover:text-primary transition-colors">
              Submit Tool
            </a>
            <a href="/advertise" className="text-sm font-semibold hover:text-primary transition-colors">
              Advertise
            </a>
            <a href="/resources" className="text-sm font-semibold hover:text-primary transition-colors">
              Resources
            </a>
            <a href="/agents" className="text-sm font-semibold hover:text-primary transition-colors flex items-center gap-1">
              AI Agents
              <span className="text-xs bg-accent text-white px-1.5 py-0.5 rounded">New</span>
            </a>
            <button className="md:hidden flex items-center gap-2 px-3 py-2 border border-border rounded-lg hover:border-primary transition-colors">
              <Search className="w-4 h-4" />
              <span className="text-sm">Search</span>
            </button>
            {/* Login/Admin button for mobile */}
            {isAdmin ? (
              <a href="/admin" className="md:hidden flex items-center gap-2 px-3 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors text-sm font-semibold">
                <Shield className="w-4 h-4" />
                Admin Panel
              </a>
            ) : (
              <a href="/auth/signin" className="md:hidden flex items-center gap-2 px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-semibold">
                <LogIn className="w-4 h-4" />
                Login
              </a>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
