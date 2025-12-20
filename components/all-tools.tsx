import { createClient } from '@/lib/supabase/server';
import ToolCard from './tool-card';
import Link from 'next/link';

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
      .order('created_at', { ascending: false })
      .limit(6);

    if (error) {
      console.error('Error fetching tools:', error);
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
        rating: averageRating,
        reviewCount: reviews.length,
      };
    });

    return toolsWithRating;
  } catch (error) {
    console.error('Error fetching tools:', error);
    return [];
  }
}

export default async function AllTools() {
  const recentTools = await getAllTools();

  if (recentTools.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-16 bg-secondary/5">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            Just <span className="text-gradient">Launched</span>
          </h2>
          <p className="text-secondary">
            Discover the newest AI tools added to our directory
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentTools.map((tool: any) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/tools">
            <button className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold">
              View All Tools
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
