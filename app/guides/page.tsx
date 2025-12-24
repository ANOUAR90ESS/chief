import Header from '@/components/header';
import Footer from '@/components/footer';
import { BookMarked } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function GuidesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="w-full py-16 bg-gradient-to-br from-primary/5 via-accent/5 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                AI Tool <span className="text-gradient">Guides</span>
              </h1>
              <p className="text-xl text-secondary">
                Step-by-step guides to help you master AI tools
              </p>
            </div>
          </div>
        </section>

        <section className="w-full py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <BookMarked className="w-16 h-16 text-primary mx-auto mb-6" />
              <h2 className="text-2xl font-bold mb-4">Coming Soon</h2>
              <p className="text-secondary">
                Comprehensive guides are on the way. Check back soon!
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
