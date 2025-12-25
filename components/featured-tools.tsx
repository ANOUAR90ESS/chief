import { createClient } from '@/lib/supabase/server';
import ToolCard from './tool-card';

async function getFeaturedTools() {
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
      .eq('featured', true)
      .order('created_at', { ascending: false })
      .limit(6);

    if (error) {
      // Return empty array on error - component handles gracefully
      return [];
    }

    // Calculate average rating for each tool
    const toolsWithRating = tools.map(tool => {
      const reviews = tool.reviews || [];
      const averageRating = reviews.length > 0
        ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length
        : 0;

      return {
        ...tool,
        category: tool.category?.name || 'Uncategorized',
        rating: averageRating,
        reviewCount: reviews.length,
      };
    });

    return toolsWithRating;
  } catch (error) {
    // Return empty array on error - component handles gracefully
    return [];
  }
}

export default async function FeaturedTools() {
  const featuredTools = await getFeaturedTools();

  if (featuredTools.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            Featured <span className="text-gradient">AI Tools</span>
          </h2>
          <p className="text-secondary">
            Handpicked and verified by our expert team
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredTools.map((tool: any) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </div>
    </section>
  );
}
