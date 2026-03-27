import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Logo from '@/components/navbar/Logo';
import HeroSection from '@/components/landing/HeroSection';
import LandingFooter from '@/components/landing/LandingFooter';
import { ArrowRight, LogIn } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      <header className="w-full px-6 py-5 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/login" className="text-zinc-700">Sign in</Link>
            </Button>
            <Button asChild className="rounded-full px-5 font-medium text-black">
              <Link href="/signup"><LogIn className="h-4 w-4 mr-2" />Create Account</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-grow flex items-center">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            <HeroSection />
            <div className="ink-panel p-6 sm:p-8">
              <div className="space-y-6">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary/80">
                    Core Workflow
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                    Built around desk booking, QR check-in, and admin control
                  </h2>
                </div>

                <div className="space-y-4">
                  <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5">
                    <p className="font-medium text-white">1. Register and sign in</p>
                    <p className="mt-1 text-sm text-white/65">
                      Employees create an account and access the booking workspace.
                    </p>
                  </div>
                  <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5">
                    <p className="font-medium text-white">2. Book a desk</p>
                    <p className="mt-1 text-sm text-white/65">
                      Pick a room, choose a desk, and reserve it for the date you need.
                    </p>
                  </div>
                  <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5">
                    <p className="font-medium text-white">3. Scan to check in and out</p>
                    <p className="mt-1 text-sm text-white/65">
                      Every desk has a QR code. Scan on arrival to check in, then scan again when leaving.
                    </p>
                  </div>
                  <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5">
                    <p className="font-medium text-white">4. Admin manages the setup</p>
                    <p className="mt-1 text-sm text-white/65">
                      Admins manage users, rooms, desks, and booking activity from one place.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button asChild className="sm:flex-1 rounded-full font-medium text-black">
                    <Link href="/signup">
                      Create Account
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="sm:flex-1 rounded-full border-white/20 bg-white/[0.02] text-white hover:bg-white/[0.08] hover:text-white">
                    <Link href="/login">Sign In</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
};

export default Landing;
