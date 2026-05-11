import { motion, AnimatePresence } from 'motion/react';
import { Phone, MessageCircle, ArrowUp } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function FloatingActions() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <div className="fixed bottom-8 right-8 z-[60] flex flex-col space-y-4">
      <AnimatePresence>
        {isVisible && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-12 h-12 bg-white text-brand-black rounded-full shadow-2xl flex items-center justify-center border border-brand-blush hover:bg-brand-blush transition-colors group"
          >
            <ArrowUp size={20} className="group-hover:-translate-y-1 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>

      <motion.a
        href="tel:+12124609432"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="w-14 h-14 bg-brand-black text-white rounded-full shadow-2xl flex items-center justify-center relative group"
      >
        <Phone size={24} />
        <span className="absolute right-full mr-4 bg-brand-black text-white px-4 py-2 rounded-full text-[10px] uppercase font-bold tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Call Now
        </span>
      </motion.a>

      <motion.a
        href="https://wa.me/12124609432"
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="w-14 h-14 bg-[#25D366] text-white rounded-full shadow-2xl flex items-center justify-center relative group"
      >
        <MessageCircle size={24} />
        <span className="absolute right-full mr-4 bg-[#25D366] text-white px-4 py-2 rounded-full text-[10px] uppercase font-bold tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          WhatsApp
        </span>
      </motion.a>
    </div>
  );
}
