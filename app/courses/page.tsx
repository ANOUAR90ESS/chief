import Header from '@/components/header';
import Footer from '@/components/footer';
import { BookOpen, Clock, Users, Star } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function CoursesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-16 bg-gradient-to-br from-primary/5 via-accent/5 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-full text-sm font-semibold mb-6">
                <span>New</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                AI <span className="text-gradient">Courses</span>
              </h1>
              <p className="text-xl text-secondary max-w-2xl mx-auto mb-8">
                Learn to master AI tools and technologies with our curated courses
              </p>
            </div>
          </div>
        </section>

        {/* Coming Soon */}
        <section className="w-full py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-12 h-12 text-primary" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Coming Soon</h2>
              <p className="text-lg text-secondary mb-8">
                We're working hard to bring you the best AI courses. Stay tuned!
              </p>

              {/* Features Preview */}
              <div className="grid md:grid-cols-3 gap-6 mt-12">
                <div className="p-6 bg-background border border-border rounded-xl">
                  <Clock className="w-8 h-8 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Self-Paced</h3>
                  <p className="text-sm text-secondary">Learn at your own speed</p>
                </div>
                <div className="p-6 bg-background border border-border rounded-xl">
                  <Users className="w-8 h-8 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Expert Instructors</h3>
                  <p className="text-sm text-secondary">Learn from the best</p>
                </div>
                <div className="p-6 bg-background border border-border rounded-xl">
                  <Star className="w-8 h-8 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Certificates</h3>
                  <p className="text-sm text-secondary">Earn verified certificates</p>
                </div>
              </div>

              {/* Newsletter */}
              <div className="mt-12 p-8 bg-secondary/5 rounded-xl">
                <h3 className="text-xl font-bold mb-4">Get Notified</h3>
                <p className="text-secondary mb-6">
                  Be the first to know when courses launch
                </p>
                <form className="flex gap-2 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary"
                  />
                  <button className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 font-semibold">
                    Notify Me
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
