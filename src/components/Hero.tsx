import { motion } from 'motion/react';
import { MousePointer2, Star } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=2000"
          alt="Dolores Beauty Salon Interior"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-white max-w-2xl"
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="flex items-center space-x-2 text-brand-gold mb-6 h-[23px]"
          >
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill={i < 4 ? "currentColor" : "none"} />
              ))}
            </div>
            <span className="text-xs uppercase tracking-[0.2em] font-medium">
              4.4 Rated NYC Premier Salon
            </span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif mb-6 leading-[0.9] tracking-tight">
            Experience <span className="text-brand-blush italic">Luxury</span> Hair Care
          </h1>
          
          <p className="text-lg md:text-xl text-gray-200 mb-10 font-light max-w-lg leading-relaxed">
            Professional styling, blowouts, and boutique beauty services delivered with exceptional customer care in the heart of East Village.
          </p>


        </motion.div>

        <div className="hidden lg:block relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="relative z-10"
          >
            <img
              src="https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=800"
              alt="Hair Styling"
              className="w-[450px] aspect-[4/5] object-cover rounded-[50px] shadow-2xl border-2 border-white/20"
            />
            {/* Decors */}
            <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-brand-nude/20 rounded-full blur-3xl -z-10"></div>
            <div className="absolute -top-8 -right-8 w-64 h-64 bg-brand-gold/10 rounded-full blur-3xl -z-10"></div>
          </motion.div>
          
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-4 top-1/4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 shadow-xl"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-brand-blush flex items-center justify-center">
                <MousePointer2 className="text-brand-nude" size={18} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-white opacity-60">Located in</p>
                <p className="text-sm font-medium text-white">Jennifer's Cafe</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center opacity-50"
      >
        <span className="text-[10px] uppercase tracking-[0.4em] text-white rotate-90 mb-8 origin-left">Scroll</span>
        <div className="w-[1px] h-20 bg-gradient-to-b from-white to-transparent"></div>
      </motion.div>
    </section>
  );
}
