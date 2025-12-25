import Header from '@/components/header';
import Footer from '@/components/footer';
import { createClient } from '@/lib/supabase/server';
import { Calendar, Tag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

async function getNewsArticle(id: string) {
  try {
    const supabase = await createClient();
    const { data: article, error } = await supabase
      .from('news')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !article) {
      return null;
    }

    return article;
  } catch (error) {
    console.error('Error fetching news article:', error);
    return null;
  }
}

export default async function NewsDetailPage({ params }: { params: { id: string } }) {
  const article = await getNewsArticle(params.id);

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="w-full py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Back Button */}
              <Link
                href="/news"
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-8 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to News</span>
              </Link>

              {/* Article Header */}
              <article>
                {/* Categories */}
                {article.category && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {article.category.split(',').map((cat: string, idx: number) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 text-xs px-3 py-1 bg-primary/10 text-primary rounded-full font-semibold"
                      >
                        <Tag className="w-3 h-3" />
                        {cat.trim()}
                      </span>
                    ))}
                  </div>
                )}

                {/* Title */}
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  {article.title}
                </h1>

                {/* Metadata */}
                <div className="flex flex-wrap items-center gap-4 mb-8 text-sm text-secondary">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(article.date).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  {article.source && (
                    <span className="text-primary font-semibold">
                      Source: {article.source}
                    </span>
                  )}
                </div>

                {/* Featured Image */}
                {article.image_url && (
                  <div className="relative w-full h-96 mb-8 rounded-xl overflow-hidden bg-secondary/10">
                    <Image
                      src={article.image_url}
                      alt={article.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                {/* Description */}
                <div className="prose prose-lg max-w-none mb-8">
                  <p className="text-xl text-secondary leading-relaxed">
                    {article.description}
                  </p>
                </div>

                {/* Content */}
                {article.content && (
                  <div className="prose prose-lg max-w-none">
                    <div className="text-foreground leading-relaxed whitespace-pre-wrap">
                      {article.content}
                    </div>
                  </div>
                )}
              </article>

              {/* Back to News Button */}
              <div className="mt-12 pt-8 border-t border-border">
                <Link
                  href="/news"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to All News
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
