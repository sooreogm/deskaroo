
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface NavLink {
  name: string;
  path: string;
  icon: ReactNode;
}

interface DesktopNavLinksProps {
  links: NavLink[];
}

const DesktopNavLinks = ({ links }: DesktopNavLinksProps) => {
  const pathname = usePathname();

  return (
    <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
      {links.map((link) => (
        <Link
          key={link.path}
          href={link.path}
          className={cn(
            "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200",
            pathname === link.path
              ? "border-amber-500 text-foreground"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          )}
        >
          {link.icon}
          <span className="ml-2">{link.name}</span>
        </Link>
      ))}
    </div>
  );
};

export default DesktopNavLinks;
