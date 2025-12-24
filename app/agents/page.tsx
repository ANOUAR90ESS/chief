import Header from '@/components/header';
import Footer from '@/components/footer';
import { Bot, Zap, Brain, Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function AgentsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-16 bg-gradient-to-br from-primary/5 via-accent/5 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-full text-sm font-semibold mb-6">
                <Sparkles className="w-4 h-4" />
                <span>New</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                AI <span className="text-gradient">Agents</span>
              </h1>
              <p className="text-xl text-secondary max-w-2xl mx-auto">
                Discover autonomous AI agents that can complete complex tasks
              </p>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="w-full py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-center mb-8">What are AI Agents?</h2>
              <p className="text-center text-secondary mb-12 max-w-2xl mx-auto">
                AI agents are autonomous programs that can perceive their environment, make decisions, and take actions to achieve specific goals.
              </p>

              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <div className="p-6 bg-background border border-border rounded-xl text-center">
                  <Bot className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="font-bold mb-2">Autonomous</h3>
                  <p className="text-sm text-secondary">Work independently to achieve goals</p>
                </div>
                <div className="p-6 bg-background border border-border rounded-xl text-center">
                  <Brain className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="font-bold mb-2">Intelligent</h3>
                  <p className="text-sm text-secondary">Learn and adapt from experience</p>
                </div>
                <div className="p-6 bg-background border border-border rounded-xl text-center">
                  <Zap className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="font-bold mb-2">Action-Oriented</h3>
                  <p className="text-sm text-secondary">Execute complex multi-step tasks</p>
                </div>
              </div>

              {/* Coming Soon */}
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl p-12 text-center">
                <Bot className="w-20 h-20 text-primary mx-auto mb-6" />
                <h2 className="text-3xl font-bold mb-4">AI Agents Directory Coming Soon</h2>
                <p className="text-secondary mb-8 max-w-2xl mx-auto">
                  We're curating the best AI agents across different categories. From personal assistants to research agents, find the perfect AI agent for your needs.
                </p>

                {/* Newsletter */}
                <div className="max-w-md mx-auto">
                  <h3 className="font-semibold mb-4">Get Notified When We Launch</h3>
                  <form className="flex gap-2">
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
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
