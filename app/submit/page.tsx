import Header from '@/components/header';
import Footer from '@/components/footer';
import { Upload, CheckCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function SubmitPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-16 bg-gradient-to-br from-primary/5 via-accent/5 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Submit Your <span className="text-gradient">AI Tool</span>
              </h1>
              <p className="text-xl text-secondary max-w-2xl mx-auto">
                Share your AI tool with thousands of users on Vetorre
              </p>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="w-full py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-center mb-8">Why Submit to Vetorre?</h2>
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <div className="p-6 bg-background border border-border rounded-xl text-center">
                  <CheckCircle className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="font-bold mb-2">Instant Visibility</h3>
                  <p className="text-sm text-secondary">Get discovered by thousands of users</p>
                </div>
                <div className="p-6 bg-background border border-border rounded-xl text-center">
                  <CheckCircle className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="font-bold mb-2">Quality Traffic</h3>
                  <p className="text-sm text-secondary">Reach your target audience</p>
                </div>
                <div className="p-6 bg-background border border-border rounded-xl text-center">
                  <CheckCircle className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="font-bold mb-2">SEO Benefits</h3>
                  <p className="text-sm text-secondary">Improve your search rankings</p>
                </div>
              </div>

              {/* Form Coming Soon */}
              <div className="bg-secondary/5 rounded-xl p-12 text-center">
                <Upload className="w-16 h-16 text-primary mx-auto mb-6" />
                <h2 className="text-2xl font-bold mb-4">Submission Form Coming Soon</h2>
                <p className="text-secondary mb-6">
                  We're preparing an easy submission process. For now, please contact us directly.
                </p>
                <a
                  href="mailto:submit@vetorre.com"
                  className="inline-block px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 font-semibold"
                >
                  Email Us: submit@vetorre.com
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
