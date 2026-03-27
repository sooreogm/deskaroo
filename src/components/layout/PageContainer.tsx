
import { ReactNode } from 'react';
import NavBar from '@/components/NavBar';

interface PageContainerProps {
  children: ReactNode;
}

const PageContainer = ({ children }: PageContainerProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <div className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        {children}
      </div>
    </div>
  );
};

export default PageContainer;
