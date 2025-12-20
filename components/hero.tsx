'use client';

import { Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({
    toolsCount: 0,
    categoriesCount: 0,
  });
  const supabase = createClient();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const [
      { count: toolsCount },
      { count: categoriesCount },
    ] = await Promise.all([
      supabase.from('tools').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
      supabase.from('categories').select('*', { count: 'exact', head: true }),
    ]);

    setStats({
      toolsCount: toolsCount || 0,
      categoriesCount: categoriesCount || 0,
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    // Handle search functionality
  };

  return (
    <section className="w-full py-16 md:py-24 bg-gradient-to-b from-background to-secondary/5">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Discover the Best{' '}
              <span className="text-gradient">AI Tools</span>
            </h1>
            <p className="text-lg md:text-xl text-secondary max-w-2xl mx-auto">
              Explore 11,283+ AI tools across 180+ categories. Find the perfect AI solution for your needs.
            </p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for AI tools, categories, or features..."
                className="w-full pl-12 pr-4 py-4 text-base border-2 border-border rounded-xl focus:outline-none focus:border-primary transition-colors bg-background"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold"
              >
                Search
              </button>
            </div>
          </form>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-12 pt-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-gradient">
                {stats.toolsCount > 0 ? `${stats.toolsCount.toLocaleString()}+` : '0'}
              </div>
              <div className="text-sm text-secondary mt-1">AI Tools</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-gradient">
                {stats.categoriesCount > 0 ? `${stats.categoriesCount}+` : '0'}
              </div>
              <div className="text-sm text-secondary mt-1">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-gradient">1M+</div>
              <div className="text-sm text-secondary mt-1">Monthly Visitors</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
