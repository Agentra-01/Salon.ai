import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Phone, Calendar } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'glass-morphism py-3 shadow-sm' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-center">
        <div className="flex flex-col">
          <a href="#" className="flex flex-col items-center group">
            <span className={`text-2xl md:text-3xl font-serif tracking-widest uppercase transition-colors duration-300 ${isScrolled ? 'text-brand-black' : 'text-brand-black md:text-white'}`}>
              Dolores
            </span>
            <span className={`text-[10px] uppercase tracking-[0.3em] transition-colors duration-300 ${isScrolled ? 'text-brand-nude' : 'text-brand-nude md:text-brand-blush'}`}>
              Beauty Salon
            </span>
          </a>
        </div>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`text-xs uppercase tracking-widest font-medium transition-all duration-300 hover:text-brand-nude relative group ${
                isScrolled ? 'text-brand-black' : 'text-white'
              }`}
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-brand-nude transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
        </div>

        <div className="hidden lg:flex items-center space-x-4">
          <a
            href="tel:+12124609432"
            className={`flex items-center space-x-2 text-xs uppercase tracking-widest transition-colors duration-300 ${
              isScrolled ? 'text-brand-black hover:text-brand-nude' : 'text-white hover:text-brand-blush'
            }`}
          >
            <Phone size={14} />
            <span>Call Now</span>
          </a>
          <button
            onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
            className={`px-6 py-2.5 text-xs uppercase tracking-widest font-medium rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 ${
              isScrolled
                ? 'bg-brand-black text-white hover:bg-brand-nude'
                : 'bg-white text-brand-black hover:bg-brand-blush'
            }`}
          >
            Book Now
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className={isScrolled || isMobileMenuOpen ? 'text-brand-black' : 'text-white'} />
          ) : (
            <Menu className={isScrolled ? 'text-brand-black' : 'text-white'} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 bg-white lg:hidden h-screen overflow-y-auto"
          >
            <div className="h-full flex flex-col p-8 pt-24">
              <div className="flex flex-col space-y-6">
                {navLinks.map((link, idx) => (
                  <motion.a
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-2xl font-serif text-brand-black hover:text-brand-nude transition-colors"
                  >
                    {link.name}
                  </motion.a>
                ))}
              </div>

              <div className="mt-12 pt-12 border-t border-brand-blush flex flex-col space-y-6">
                <a
                  href="tel:+12124609432"
                  className="flex items-center space-x-3 text-brand-black"
                >
                  <Phone className="text-brand-nude" />
                  <span className="text-lg">+1 212-460-9432</span>
                </a>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full bg-brand-black text-white py-4 rounded-full flex items-center justify-center space-x-2 text-sm uppercase tracking-widest"
                >
                  <Calendar size={18} />
                  <span>Book Appointment</span>
                </button>
              </div>
              
              <div className="mt-auto items-center text-center pb-8">
                <p className="text-xs text-gray-400">133 E 4th St #A, New York, NY 10003</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
