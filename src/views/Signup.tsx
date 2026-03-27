import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Building2, CalendarRange, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import Logo from '@/components/navbar/Logo';

const signupNotes = [
  {
    title: 'Book the right desk',
    description: 'Choose the room and workspace that fits the day you are planning.',
    icon: Building2,
  },
  {
    title: 'Control your schedule',
    description: 'See active, past, and cancelled bookings from one simple booking view.',
    icon: CalendarRange,
  },
  {
    title: 'Use QR for arrival and exit',
    description: 'Every desk has its own code so check-in and check-out stay tied to the physical space.',
    icon: QrCode,
  },
];

const Signup = () => {
  const { signUp, user } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [router, user]);

  if (user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    const { error } = await signUp(email, password, name);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Account created. Sign in to continue.');
      router.push('/login');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-6xl gap-6 lg:grid-cols-[0.96fr,1.04fr]">
        <div className="shell-panel flex items-center p-4 sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <Logo />
            </div>

            <div className="mb-8">
              <span className="page-eyebrow">Create Account</span>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Start booking desks with less friction
              </h1>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Set up your Deskaroo account and you&apos;ll be ready to reserve desks, manage bookings, and use QR check-in at the office.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-foreground">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="h-12 rounded-2xl border-black/10 bg-white/80"
                    required
                  />
                </div>

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
                  <Label htmlFor="password" className="text-sm font-medium text-foreground">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 rounded-2xl border-black/10 bg-white/80"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                    Confirm Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-12 rounded-2xl border-black/10 bg-white/80"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="h-12 w-full rounded-full text-sm font-semibold" disabled={loading}>
                {loading ? 'Creating account...' : 'Create account'}
                {!loading && <ArrowRight className="h-4 w-4" />}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link href="/login" className="font-medium text-foreground hover:text-primary">
                  Sign in
                </Link>
              </p>
            </form>
          </div>
        </div>

        <div className="ink-panel hidden flex-col justify-between p-8 lg:flex lg:p-10">
          <Logo href="/" tone="dark" />

          <div className="space-y-6">
            <span className="page-eyebrow">Office Flow</span>
            <div className="space-y-4">
              <h2 className="max-w-xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                A cleaner way to manage office desks.
              </h2>
              <p className="max-w-lg text-base leading-7 text-white/68">
                The app stays focused on the essentials: account access, desk booking, QR check-in, QR check-out, and admin control.
              </p>
            </div>

            <div className="grid gap-3">
              {signupNotes.map((note) => (
                <div
                  key={note.title}
                  className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5"
                >
                  <div className="flex items-start gap-4">
                    <div className="rounded-2xl bg-primary p-3 text-black">
                      <note.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{note.title}</p>
                      <p className="mt-1 text-sm leading-6 text-white/60">{note.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-white/45">
                Ready on day one
              </p>
              <p className="mt-3 text-sm leading-6 text-white/68">
                Once your account is created, you can head straight into the booking flow and keep your office attendance tied to the right desk.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
