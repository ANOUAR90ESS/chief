import Header from '@/components/header';
import Footer from '@/components/footer';
import { createClient } from '@/lib/supabase/server';
import { Calendar, Tag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

async function getNews() {
  try {
    const supabase = await createClient();
    const { data: news, error } = await supabase
      .from('news')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching news:', error);
      return [];
    }

    return news || [];
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
}

export default async function NewsPage() {
  const newsArticles = await getNews();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="w-full py-16 bg-gradient-to-br from-primary/5 via-accent/5 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                AI <span className="text-gradient">News</span>
              </h1>
              <p className="text-xl text-secondary">
                Latest news and updates about AI tools and technology
              </p>
            </div>
          </div>
        </section>

        <section className="w-full py-16">
          <div className="container mx-auto px-4">
            {newsArticles.length === 0 ? (
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-2xl font-bold mb-4">No News Yet</h2>
                <p className="text-secondary">
                  Check back soon for the latest AI news and updates!
                </p>
              </div>
            ) : (
              <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {newsArticles.map((article: any) => {
                  const isBase64Image = article.image_url?.startsWith('data:image/');

                  return (
                  <Link
                    key={article.id}
                    href={`/news/${article.id}`}
                    className="block bg-background border border-border rounded-xl overflow-hidden hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer"
                  >
                    {article.image_url && (
                      <div className="relative w-full h-48 bg-secondary/10">
                        {isBase64Image ? (
                          <img
                            src={article.image_url}
                            alt={article.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Image
                            src={article.image_url}
                            alt={article.title}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                    )}
                    <div className="p-6">
                      {article.category && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {article.category.split(',').map((cat: string, idx: number) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-primary/10 text-primary rounded-full"
                            >
                              <Tag className="w-3 h-3" />
                              {cat.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                      <h3 className="text-xl font-bold mb-2 line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-sm text-secondary mb-4 line-clamp-3">
                        {article.description}
                      </p>
                      <div className="flex items-center justify-between text-xs text-secondary">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(article.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                        {article.source && (
                          <span className="text-primary font-semibold">
                            {article.source}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
