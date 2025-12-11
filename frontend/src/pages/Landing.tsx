import { HeroSection } from '@/components/landing/HeroSection';
import { FeatureSections } from '@/components/landing/FeatureSections';
import { Footer } from '@/components/landing/Footer';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { Shield } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">AegisPay</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="pt-16">
        <HeroSection />
        <FeatureSections />
      </main>

      <Footer />
    </div>
  );
}
