import { cn } from '@/lib/utils';
import { ReactNode } from 'react';
import FloatingAppNav from './FloatingAppNav';

const AppLayout = ({
  children,
  fullBleed = false,
  showFloatingNav = true,
}: {
  children: ReactNode;
  fullBleed?: boolean;
  showFloatingNav?: boolean;
}) => {
  return (
    <div className={cn('min-h-screen bg-background', fullBleed && 'h-screen overflow-hidden')}>
      {showFloatingNav ? <FloatingAppNav /> : null}
      <main
        className={cn(
          'mx-auto min-h-screen',
          fullBleed
            ? 'h-screen max-w-none px-0 pt-0 pb-0'
            : 'max-w-[1680px] px-4 pt-6 pb-32 sm:px-6 sm:pt-8 sm:pb-36 lg:px-10 lg:pt-10'
        )}
      >
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
