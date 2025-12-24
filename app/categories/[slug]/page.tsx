import { createClient } from '@/lib/supabase/server';
import Header from '@/components/header';
import Footer from '@/components/footer';
import ToolCard from '@/components/tool-card';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

async function getCategoryTools(slug: string) {
  try {
    const supabase = await createClient();

    const { data: category } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .single();

    if (!category) {
      return null;
    }

    const { data: tools, error } = await supabase
      .from('tools')
      .select(`
        *,
        category:categories(*),
        reviews(rating)
      `)
      .eq('status', 'approved')
      .eq('category_id', category.id)
      .order('created_at', { ascending: false });

    if (error) {
      return { category, tools: [] };
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

    return { category, tools: toolsWithRating };
  } catch (error) {
    return null;
  }
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const data = await getCategoryTools(params.slug);

  if (!data) {
    notFound();
  }

  const { category, tools } = data;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-16 bg-gradient-to-br from-primary/5 via-accent/5 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Breadcrumb */}
              <div className="mb-6 text-sm text-secondary">
                <a href="/" className="hover:text-primary">Home</a>
                {' / '}
                <a href="/tools" className="hover:text-primary">Tools</a>
                {' / '}
                <span className="text-foreground">{category.name}</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {category.name} <span className="text-gradient">Tools</span>
              </h1>

              {category.description && (
                <p className="text-xl text-secondary mb-6">
                  {category.description}
                </p>
              )}

              <div className="flex items-center gap-4 text-secondary">
                <span>{tools.length} tools available</span>
              </div>
            </div>
          </div>
        </section>

        {/* Tools Grid */}
        <section className="w-full py-12">
          <div className="container mx-auto px-4">
            {tools.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-secondary text-lg mb-4">
                  No tools found in this category yet
                </p>
                <a
                  href="/tools"
                  className="text-primary hover:underline"
                >
                  Browse all tools
                </a>
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
