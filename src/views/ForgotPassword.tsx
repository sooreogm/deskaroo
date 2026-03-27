import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Building2, ArrowLeft } from 'lucide-react';
import { requestPasswordReset } from '@/utils/users';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await requestPasswordReset(email);
    if (error) {
      toast.error(error.message);
    } else {
      setSent(true);
      toast.success('Password reset prepared. Continue to the reset page in local mode.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">Reset password</CardTitle>
          <CardDescription>
            {sent ? 'Check your email for a reset link' : 'Enter your email to receive a reset link'}
          </CardDescription>
        </CardHeader>
        {!sent ? (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Sending...' : 'Send reset link'}
              </Button>
              <Link href="/login" className="text-sm text-primary hover:underline flex items-center gap-1">
                <ArrowLeft className="h-4 w-4" /> Back to login
              </Link>
            </CardFooter>
          </form>
        ) : (
          <CardFooter>
            <Link href="/login" className="text-sm text-primary hover:underline flex items-center gap-1 mx-auto">
              <ArrowLeft className="h-4 w-4" /> Back to login
            </Link>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default ForgotPassword;
