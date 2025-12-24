import { createClient } from '@/lib/supabase/server';
import Header from '@/components/header';
import Footer from '@/components/footer';
import ToolCard from '@/components/tool-card';
import { Search } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getAllTools() {
  try {
    const supabase = await createClient();

    const { data: tools, error } = await supabase
      .from('tools')
      .select(`
        *,
        category:categories(*),
        reviews(rating)
      `)
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (error) {
      return [];
    }

    const toolsWithRating = tools.map(tool => {
      const reviews = tool.reviews || [];
      const averageRating = reviews.length > 0
        ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length
        : 0;

      return {
        ...tool,
        rating: averageRating,
        reviewCount: reviews.length,
      };
    });

    return toolsWithRating;
  } catch (error) {
    return [];
  }
}

async function getCategories() {
  try {
    const supabase = await createClient();
    const { data: categories } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    return categories || [];
  } catch (error) {
    return [];
  }
}

export default async function ToolsPage() {
  const [tools, categories] = await Promise.all([
    getAllTools(),
    getCategories()
  ]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-16 bg-gradient-to-br from-primary/5 via-accent/5 to-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Explore <span className="text-gradient">AI Tools</span>
              </h1>
              <p className="text-xl text-secondary max-w-2xl mx-auto">
                Discover {tools.length} AI-powered tools to supercharge your workflow
              </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
                <input
                  type="text"
                  placeholder="Search tools..."
                  className="w-full pl-12 pr-4 py-3 rounded-lg border border-border bg-background focus:border-primary focus:outline-none"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="w-full py-8 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap gap-2">
              <button className="px-4 py-2 rounded-lg bg-primary text-white font-semibold">
                All Tools
              </button>
              {categories.map((category: any) => (
                <button
                  key={category.id}
                  className="px-4 py-2 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors"
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Tools Grid */}
        <section className="w-full py-12">
          <div className="container mx-auto px-4">
            {tools.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-secondary text-lg">No tools found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tools.map((tool: any) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
