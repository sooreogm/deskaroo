import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, CalendarDays, QrCode, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import Logo from '@/components/navbar/Logo';
import { resendEmailVerification } from '@/utils/users';

const highlights = [
  {
    title: 'Reserve in minutes',
    description: 'Choose a room, select a desk, and set your office schedule without friction.',
    icon: CalendarDays,
  },
  {
    title: 'Check in with QR',
    description: 'Scan the code attached to the physical desk when you arrive and when you leave.',
    icon: QrCode,
  },
  {
    title: 'Keep access controlled',
    description: 'Admins stay in charge of desks, rooms, bookings, and office availability.',
    icon: ShieldCheck,
  },
];

const Login = () => {
  const { signIn, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [verificationHint, setVerificationHint] = useState<string | null>(null);
  const [verificationEmail, setVerificationEmail] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [router, user]);

  useEffect(() => {
    const queryEmail = searchParams.get('email');
    const verificationState = searchParams.get('verification');
    const verificationSent = searchParams.get('sent');
    const verified = searchParams.get('verified');

    if (queryEmail) {
      setEmail((current) => current || queryEmail);
      setVerificationEmail(queryEmail);
    }

    if (verified === '1') {
      toast.success('Your email has been verified. You can sign in now.');
      setVerificationHint(null);
      return;
    }

    if (verificationState === 'pending') {
      setVerificationHint(
        verificationSent === '0'
          ? 'Your account was created, but the verification email could not be sent automatically. Request a fresh email below.'
          : 'Check your inbox for a verification email before signing in.'
      );
      return;
    }

    if (verificationState === 'expired') {
      setVerificationHint('That verification link has expired. Request a fresh email below.');
      return;
    }

    if (verificationState === 'invalid') {
      setVerificationHint('That verification link is invalid. Request a fresh email below.');
    }
  }, [searchParams]);

  if (user) return null;

  const handleResendVerification = async () => {
    const normalizedEmail = (verificationEmail ?? email).trim().toLowerCase();

    if (!normalizedEmail) {
      toast.error('Enter your email address first');
      return;
    }

    setResending(true);
    const { error, message } = await resendEmailVerification(normalizedEmail);

    if (error) {
      toast.error(error.message);
    } else {
      setVerificationEmail(normalizedEmail);
      setVerificationHint('A fresh verification email is on the way if this account still needs one.');
      toast.success(message ?? 'Verification email sent.');
    }

    setResending(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email, password);
    if (error) {
      if (/verify your email/i.test(error.message)) {
        const normalizedEmail = email.trim().toLowerCase();
        setVerificationEmail(normalizedEmail);
        setVerificationHint('Verify your email before signing in. You can request a new verification email below.');
      }
      toast.error(error.message);
    } else {
      setVerificationHint(null);
      toast.success('Welcome back!');
      router.push('/dashboard');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-6xl gap-6 lg:grid-cols-[1.08fr,0.92fr]">
        <div className="ink-panel hidden flex-col justify-between p-8 lg:flex lg:p-10">
          <Logo tone="dark" />

          <div className="space-y-6">
            <span className="page-eyebrow">Desk Booking</span>
            <div className="space-y-4">
              <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Walk into the office with your desk already sorted.
              </h1>
              <p className="max-w-lg text-base leading-7 text-white/68">
                Deskaroo keeps the whole desk flow simple: book ahead, scan the QR code on arrival, and scan again when you head out.
              </p>
            </div>

            <div className="grid gap-3">
              {highlights.map((highlight) => (
                <div
                  key={highlight.title}
                  className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5"
                >
                  <div className="flex items-start gap-4">
                    <div className="rounded-2xl bg-primary p-3 text-black">
                      <highlight.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{highlight.title}</p>
                      <p className="mt-1 text-sm leading-6 text-white/60">{highlight.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-white/45">Typical flow</p>
            <p className="mt-3 text-sm leading-6 text-white/68">
              Book your desk before the day starts, scan the desk QR code when you arrive, and scan it again when you leave to check out.
            </p>
          </div>
        </div>

        <div className="shell-panel flex items-center p-4 sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <Logo />
            </div>

            <div className="mb-8">
              <span className="page-eyebrow">Sign In</span>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Welcome back
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Sign in to manage bookings, check in at your desk, and keep your office days organised. New accounts need email verification first.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-foreground">
                    Work Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="h-12 rounded-2xl border-black/10 bg-white/80"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-4">
                    <Label htmlFor="password" className="text-sm font-medium text-foreground">
                      Password
                    </Label>
                    <Link href="/forgot-password" className="text-sm font-medium text-primary hover:text-foreground">
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 rounded-2xl border-black/10 bg-white/80"
                    required
                  />
                </div>
              </div>

              {verificationHint && (
                <div className="rounded-[1.5rem] border border-primary/20 bg-primary/10 p-4">
                  <p className="text-sm font-semibold text-foreground">Email verification needed</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{verificationHint}</p>
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-4 rounded-full border-black/10 bg-white/80"
                    onClick={handleResendVerification}
                    disabled={resending}
                  >
                    {resending ? 'Sending...' : 'Resend verification email'}
                  </Button>
                </div>
              )}

              <Button type="submit" className="h-12 w-full rounded-full text-sm font-semibold" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign in'}
                {!loading && <ArrowRight className="h-4 w-4" />}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{' '}
                <Link href="/signup" className="font-medium text-foreground hover:text-primary">
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
