import { ReactNode } from 'react';
import AppSidebar from './AppSidebar';

const AppLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-[1680px] flex-col lg:flex-row">
      <AppSidebar />
      <main className="flex-1 overflow-auto px-4 pb-8 pt-4 sm:px-6 lg:px-10 lg:py-10">
        {children}
      </main>
      </div>
    </div>
  );
};

export default AppLayout;
