
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ReactNode, useState } from 'react';

interface NavLink {
  name: string;
  path: string;
  icon: ReactNode;
}

interface MobileMenuProps {
  links: NavLink[];
}

const MobileMenu = ({ links }: MobileMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex items-center sm:hidden">
      <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {isOpen && (
        <div className="sm:hidden absolute top-16 inset-x-0 z-50 bg-white border-b border-amber-100 animate-fade-in">
          <div className="pt-2 pb-3 space-y-1">
            {links.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={cn(
                  "block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200",
                  pathname === link.path
                    ? "border-amber-500 text-amber-700 bg-amber-50"
                    : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                )}
                onClick={() => setIsOpen(false)}
              >
                <div className="flex items-center">
                  {link.icon}
                  <span className="ml-2">{link.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileMenu;
