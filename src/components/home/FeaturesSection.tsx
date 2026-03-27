
import { motion } from 'framer-motion';
import { CalendarCheck, Clock, MapPin, Users, Hexagon, CheckCircle2 } from 'lucide-react';

const features = [
  {
    title: 'Easy Booking',
    description: 'Book a desk in seconds with our intuitive interface',
    icon: <CalendarCheck className="h-10 w-10 text-amber-600" />,
  },
  {
    title: 'Real-time Availability',
    description: 'See desk availability in real-time across all office spaces',
    icon: <Clock className="h-10 w-10 text-amber-600" />,
  },
  {
    title: 'Floor Plans',
    description: 'Interactive floor plans help you find the perfect spot',
    icon: <MapPin className="h-10 w-10 text-amber-600" />,
  },
  {
    title: 'Team Coordination',
    description: 'Coordinate desk locations with your team members',
    icon: <Users className="h-10 w-10 text-amber-600" />,
  },
];

const FeaturesSection = () => {
  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  // Item animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="py-24 bg-gradient-to-b from-amber-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <div className="flex justify-center mb-4">
            <motion.div
              initial={{ rotate: 0 }}
              whileInView={{ rotate: 360 }}
              transition={{ duration: 1, ease: "easeInOut" }}
              viewport={{ once: true }}
            >
              <Hexagon className="h-16 w-16 fill-amber-500 text-white" />
            </motion.div>
          </div>
          
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-amber-800">
            A better way to manage workspace
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600">
            Everything you need to optimize your workplace efficiency with HiveHub.
          </p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" 
              }}
              className="relative overflow-hidden p-6 bg-white rounded-2xl shadow-sm border border-amber-100 flex flex-col"
            >
              <div className="absolute top-0 right-0 w-20 h-20 -mt-10 -mr-10 bg-amber-100 rounded-full opacity-50" />
              
              <div className="h-14 w-14 flex items-center justify-center rounded-xl bg-amber-50 mb-5 z-10">
                <div className="text-amber-600">
                  {feature.icon}
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 flex-grow">{feature.description}</p>
              
              <div className="mt-4 flex items-center text-amber-600">
                <CheckCircle2 className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">Available now</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div
          className="mt-16 flex justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="hexagon-grid grid grid-cols-3 gap-3 max-w-xs">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="hexagon-item">
                <div className="hexagon-in1">
                  <div className="hexagon-in2">
                    <div className="hexagon-in3 bg-gradient-to-br from-amber-100 to-amber-200 border-amber-300" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
