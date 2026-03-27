
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CTASection = () => {
  return (
    <section className="bg-amber-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to simplify workspace management?
          </h2>
          <p className="mt-4 text-xl text-amber-100">
            Get started with HiveHub by OJ Solutions today and experience seamless workspace coordination.
          </p>
          <div className="mt-8">
            <Button asChild size="lg" variant="secondary" className="text-amber-800 bg-white hover:bg-amber-50 text-base px-8">
              <Link href="/book">
                Start Booking
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
