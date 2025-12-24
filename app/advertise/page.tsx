import Header from '@/components/header';
import Footer from '@/components/footer';
import { Megaphone, Users, TrendingUp, Target } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function AdvertisePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-16 bg-gradient-to-br from-primary/5 via-accent/5 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Advertise on <span className="text-gradient">Vetorre</span>
              </h1>
              <p className="text-xl text-secondary max-w-2xl mx-auto">
                Reach thousands of AI enthusiasts and decision-makers
              </p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="w-full py-12 bg-secondary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-4xl font-bold text-gradient mb-2">1M+</div>
                  <div className="text-secondary">Monthly Visitors</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-gradient mb-2">50K+</div>
                  <div className="text-secondary">Newsletter Subscribers</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-gradient mb-2">180+</div>
                  <div className="text-secondary">AI Categories</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Advertising Options */}
        <section className="w-full py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Advertising Options</h2>

              <div className="grid md:grid-cols-2 gap-6 mb-12">
                <div className="p-8 bg-background border border-border rounded-xl">
                  <Users className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-bold mb-3">Sponsored Listings</h3>
                  <p className="text-secondary mb-4">
                    Feature your AI tool at the top of category pages
                  </p>
                  <ul className="space-y-2 text-sm text-secondary">
                    <li>✓ Premium placement</li>
                    <li>✓ Highlighted badge</li>
                    <li>✓ Increased visibility</li>
                  </ul>
                </div>

                <div className="p-8 bg-background border border-border rounded-xl">
                  <TrendingUp className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-bold mb-3">Newsletter Sponsorship</h3>
                  <p className="text-secondary mb-4">
                    Reach 50K+ subscribers directly in their inbox
                  </p>
                  <ul className="space-y-2 text-sm text-secondary">
                    <li>✓ Dedicated feature</li>
                    <li>✓ High engagement</li>
                    <li>✓ Targeted audience</li>
                  </ul>
                </div>

                <div className="p-8 bg-background border border-border rounded-xl">
                  <Target className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-bold mb-3">Banner Ads</h3>
                  <p className="text-secondary mb-4">
                    Display ads across high-traffic pages
                  </p>
                  <ul className="space-y-2 text-sm text-secondary">
                    <li>✓ Multiple formats</li>
                    <li>✓ Category targeting</li>
                    <li>✓ Performance tracking</li>
                  </ul>
                </div>

                <div className="p-8 bg-background border border-border rounded-xl">
                  <Megaphone className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-bold mb-3">Custom Campaigns</h3>
                  <p className="text-secondary mb-4">
                    Tailored advertising solutions for your needs
                  </p>
                  <ul className="space-y-2 text-sm text-secondary">
                    <li>✓ Flexible options</li>
                    <li>✓ Dedicated support</li>
                    <li>✓ ROI focused</li>
                  </ul>
                </div>
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl p-12 text-center">
                <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
                <p className="text-secondary mb-8 max-w-2xl mx-auto">
                  Contact our advertising team to discuss custom packages and pricing
                </p>
                <a
                  href="mailto:advertise@vetorre.com"
                  className="inline-block px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 font-semibold text-lg"
                >
                  Contact Advertising Team
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
