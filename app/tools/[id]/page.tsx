import { createClient } from '@/lib/supabase/server';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { notFound } from 'next/navigation';
import { Star, ExternalLink, BadgeCheck, Calendar, TrendingUp } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getTool(id: string) {
  try {
    const supabase = await createClient();

    const { data: tool, error } = await supabase
      .from('tools')
      .select(`
        *,
        category:categories(*),
        reviews(
          id,
          rating,
          comment,
          created_at,
          user:user_profiles(display_name)
        )
      `)
      .eq('id', id)
      .eq('status', 'approved')
      .single();

    if (error || !tool) {
      return null;
    }

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
  } catch (error) {
    return null;
  }
}

export default async function ToolDetailPage({ params }: { params: { id: string } }) {
  const tool = await getTool(params.id);

  if (!tool) {
    notFound();
  }

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
                <span className="text-foreground">{tool.name}</span>
              </div>

              {/* Tool Header */}
              <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Tool Icon */}
                <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <span className="text-4xl font-bold text-gradient">
                    {tool.name.charAt(0)}
                  </span>
                </div>

                {/* Tool Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-4xl font-bold">{tool.name}</h1>
                    {tool.verified && (
                      <BadgeCheck className="w-8 h-8 text-primary" />
                    )}
                    {tool.featured && (
                      <span className="bg-accent text-white text-xs font-semibold px-3 py-1 rounded-full">
                        Featured
                      </span>
                    )}
                  </div>

                  <p className="text-xl text-secondary mb-4">
                    {tool.description}
                  </p>

                  {/* Meta Info */}
                  <div className="flex flex-wrap gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{tool.rating.toFixed(1)}</span>
                      <span className="text-secondary text-sm">
                        ({tool.reviewCount} reviews)
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="px-3 py-1 bg-secondary/10 rounded-full">
                        {tool.category}
                      </span>
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-full font-semibold">
                        {tool.pricing}
                      </span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <a
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold text-lg"
                  >
                    Try {tool.name}
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Details Section */}
        <section className="w-full py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="md:col-span-2 space-y-8">
                {/* About */}
                <div className="bg-background border border-border rounded-xl p-6">
                  <h2 className="text-2xl font-bold mb-4">About {tool.name}</h2>
                  <p className="text-secondary leading-relaxed">
                    {tool.long_description || tool.description}
                  </p>
                </div>

                {/* Features */}
                {tool.features && tool.features.length > 0 && (
                  <div className="bg-background border border-border rounded-xl p-6">
                    <h2 className="text-2xl font-bold mb-4">Key Features</h2>
                    <ul className="space-y-3">
                      {tool.features.map((feature: string, index: number) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            ✓
                          </div>
                          <span className="text-secondary">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Reviews */}
                <div className="bg-background border border-border rounded-xl p-6">
                  <h2 className="text-2xl font-bold mb-6">Reviews</h2>
                  {tool.reviews && tool.reviews.length > 0 ? (
                    <div className="space-y-4">
                      {tool.reviews.map((review: any) => (
                        <div key={review.id} className="border-b border-border pb-4 last:border-0">
                          <div className="flex items-start gap-3 mb-2">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-semibold">{review.rating}</span>
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold">
                                {review.user?.display_name || 'Anonymous'}
                              </p>
                              <p className="text-sm text-secondary">
                                {new Date(review.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          {review.comment && (
                            <p className="text-secondary ml-8">{review.comment}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-secondary text-center py-8">No reviews yet. Be the first to review!</p>
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Stats */}
                <div className="bg-background border border-border rounded-xl p-6">
                  <h3 className="font-bold mb-4">Tool Stats</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-secondary">Views</p>
                        <p className="font-semibold">{(tool.views || 0).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-secondary">Added</p>
                        <p className="font-semibold">
                          {new Date(tool.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Platforms */}
                {tool.platforms && tool.platforms.length > 0 && (
                  <div className="bg-background border border-border rounded-xl p-6">
                    <h3 className="font-bold mb-4">Available On</h3>
                    <div className="flex flex-wrap gap-2">
                      {tool.platforms.map((platform: string) => (
                        <span
                          key={platform}
                          className="px-3 py-1 bg-secondary/10 rounded-full text-sm"
                        >
                          {platform}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {tool.tags && tool.tags.length > 0 && (
                  <div className="bg-background border border-border rounded-xl p-6">
                    <h3 className="font-bold mb-4">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {tool.tags.map((tag: string) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
