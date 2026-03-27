import { Hexagon } from 'lucide-react';

const LandingFooter = () => {
  return (
    <footer className="border-t border-black/10 bg-white/85 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <span className="mr-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-primary">
              <Hexagon className="h-4 w-4 fill-black/80 text-black/80" />
            </span>
            <span className="text-lg font-semibold text-zinc-950">Deskaroo</span>
          </div>
          
          <div className="text-sm text-zinc-500">
            Desk booking, QR check-in, and office admin in one place.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
