
import { Hexagon } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
  href?: string;
  tone?: 'light' | 'dark';
}

const Logo = ({ href = '/', tone = 'light' }: LogoProps) => {
  const isDark = tone === 'dark';

  return (
    <Link href={href} className={cn('inline-flex items-center gap-3', isDark ? 'text-white' : 'text-zinc-950')}>
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary shadow-[0_12px_30px_-18px_rgba(245,179,8,0.9)]">
        <Hexagon className="h-5 w-5 fill-black/80 text-black/80" />
      </span>
      <span className="flex flex-col leading-none">
        <span className={cn('text-[0.64rem] uppercase tracking-[0.28em]', isDark ? 'text-white/45' : 'text-zinc-500')}>
          Desk Booking
        </span>
        <span className="mt-1.5 text-lg font-semibold tracking-tight">Deskaroo</span>
      </span>
    </Link>
  );
};

export default Logo;
