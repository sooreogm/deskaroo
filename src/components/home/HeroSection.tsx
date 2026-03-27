
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Hexagon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-amber-50 to-white z-0"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div>
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-sm font-medium mb-4"
              >
                Streamlined Workspace Management
              </motion.div>
              <motion.div
                className="flex items-center mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <div className="mr-3 text-amber-500">
                  <Hexagon className="h-8 w-8 fill-amber-500 text-white" />
                </div>
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900">
                  HiveHub
                </h1>
              </motion.div>
              <motion.h2 
                className="text-2xl sm:text-3xl font-semibold text-amber-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                by OJ Solutions
              </motion.h2>
            </div>
            <motion.p 
              className="text-lg text-gray-600 max-w-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              Simplify your workspace management with HiveHub. 
              Book desks, manage reservations, and coordinate with colleagues effortlessly.
            </motion.p>
            <motion.div 
              className="pt-4 flex space-x-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <Button asChild size="lg" className="text-base px-6 bg-amber-500 hover:bg-amber-600">
                <Link href="/book">
                  Book a Desk
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base border-amber-500 text-amber-700 hover:bg-amber-50">
                <Link href="/mybookings">
                  View My Bookings
                </Link>
              </Button>
            </motion.div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-video glassmorphism rounded-2xl shadow-xl overflow-hidden bg-amber-50/70">
              <div className="absolute inset-0 flex justify-center items-center">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 w-full max-w-md">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                      className="desk aspect-square rounded-xl flex items-center justify-center"
                      style={{
                        backgroundColor: i % 3 === 0 ? '#fff8e1' : i % 3 === 1 ? '#ffecb3' : '#ffe082',
                        border: '2px solid',
                        borderColor: i % 3 === 0 ? '#ffd54f' : i % 3 === 1 ? '#ffca28' : '#ffb300',
                      }}
                    >
                      <div className="flex flex-col items-center">
                        <Hexagon size={16} className="text-amber-600 mb-1" />
                        <span className="text-xs font-medium text-amber-800">Desk {i}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
