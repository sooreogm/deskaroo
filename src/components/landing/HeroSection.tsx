import { motion } from 'framer-motion';

const HeroSection = () => {
  const highlights = [
    'Create an account and reserve a desk for the day you need it.',
    'Scan the QR code on the desk to check in when you arrive.',
    'Scan the same QR code again when you leave to check out.',
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      <span className="page-eyebrow">Office Desk Management</span>
      <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl lg:text-6xl">
        A cleaner way to book desks and manage attendance.
      </h1>
      <p className="max-w-xl text-lg leading-8 text-zinc-600 sm:text-xl">
        Deskaroo focuses on the flow your office actually needs: account access,
        desk booking, QR-based check-in and check-out, and clear admin control.
      </p>
      <div className="grid gap-3 pt-3 sm:grid-cols-3">
        {highlights.map((highlight) => (
          <div key={highlight} className="shell-panel p-4 text-sm leading-6 text-zinc-700">
            <span className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-primary text-xs font-semibold text-black">
              0{highlights.indexOf(highlight) + 1}
            </span>
            <p>{highlight}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default HeroSection;
