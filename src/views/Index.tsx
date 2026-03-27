
import { useEffect } from 'react';
import { toast } from 'sonner';
import NavBar from '@/components/NavBar';
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import CTASection from '@/components/home/CTASection';
import Footer from '@/components/home/Footer';

const Index = () => {
  useEffect(() => {
    // Welcome toast
    toast.success('Welcome to HiveHub', {
      description: 'Your modern workspace management solution',
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NavBar />
      
      <main className="flex-grow">
        <HeroSection />
        <FeaturesSection />
        <CTASection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
