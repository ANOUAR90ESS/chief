import Header from '@/components/header';
import Footer from '@/components/footer';
import { Library, FileText, Video, Headphones } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function ResourcesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-16 bg-gradient-to-br from-primary/5 via-accent/5 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                AI <span className="text-gradient">Resources</span>
              </h1>
              <p className="text-xl text-secondary max-w-2xl mx-auto">
                Everything you need to learn and master AI tools
              </p>
            </div>
          </div>
        </section>

        {/* Resource Categories */}
        <section className="w-full py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-6 mb-12">
                <div className="p-8 bg-background border border-border rounded-xl">
                  <FileText className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-bold mb-3">Guides & Tutorials</h3>
                  <p className="text-secondary mb-4">
                    Step-by-step guides to help you get started with AI tools
                  </p>
                  <a href="/guides" className="text-primary hover:underline font-semibold">
                    View Guides →
                  </a>
                </div>

                <div className="p-8 bg-background border border-border rounded-xl">
                  <Video className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-bold mb-3">Video Tutorials</h3>
                  <p className="text-secondary mb-4">
                    Watch and learn from expert demonstrations
                  </p>
                  <span className="text-secondary text-sm">Coming Soon</span>
                </div>

                <div className="p-8 bg-background border border-border rounded-xl">
                  <Library className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-bold mb-3">AI Courses</h3>
                  <p className="text-secondary mb-4">
                    Comprehensive courses to master AI technologies
                  </p>
                  <a href="/courses" className="text-primary hover:underline font-semibold">
                    View Courses →
                  </a>
                </div>

                <div className="p-8 bg-background border border-border rounded-xl">
                  <Headphones className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-bold mb-3">Podcasts & Webinars</h3>
                  <p className="text-secondary mb-4">
                    Listen to AI experts and industry leaders
                  </p>
                  <span className="text-secondary text-sm">Coming Soon</span>
                </div>
              </div>

              {/* CTA */}
              <div className="bg-secondary/5 rounded-xl p-12 text-center">
                <Library className="w-16 h-16 text-primary mx-auto mb-6" />
                <h2 className="text-2xl font-bold mb-4">More Resources Coming Soon</h2>
                <p className="text-secondary mb-6">
                  We're building a comprehensive resource library. Stay tuned!
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
