import Header from '@/components/header';
import Hero from '@/components/hero';
import FeaturedTools from '@/components/featured-tools';
import AllTools from '@/components/all-tools';
import Footer from '@/components/footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <FeaturedTools />
        <AllTools />
      </main>
      <Footer />
    </div>
  );
}
