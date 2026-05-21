import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Phone, Calendar, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ 
  onAdminToggle, 
  showAdminPortal,
  onMyBookingClick
}: { 
  onAdminToggle?: () => void; 
  showAdminPortal?: boolean;
  onMyBookingClick?: () => void;
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, profile, logout, setIsAuthModalOpen } = useAuth();

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
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav
      id="main-navigation-bar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md py-3 shadow-[0_4px_30px_rgba(0,0,0,0.03)] border-b border-brand-nude/15' 
          : 'bg-brand-beige/95 backdrop-blur-md py-4.5 border-b border-brand-nude/10'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-center">
        <div className="flex flex-col">
          <a href="#" className="flex flex-col items-center group">
            <span className="text-2xl md:text-3xl font-serif tracking-widest uppercase text-brand-black transition-colors duration-300 group-hover:text-brand-nude">
              Dolores
            </span>
            <span className="text-[10px] uppercase tracking-[0.3em] text-brand-nude transition-colors duration-300">
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
              className="text-xs uppercase tracking-widest font-medium transition-all duration-300 text-brand-black/80 hover:text-brand-nude relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-brand-nude transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
          {user && (
            <button
              onClick={onMyBookingClick}
              className="text-xs uppercase tracking-widest font-bold transition-all duration-300 text-brand-black hover:text-brand-nude relative group cursor-pointer flex items-center gap-1 whitespace-nowrap flex-shrink-0"
            >
              <span>My Booking</span>
              <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-brand-nude scale-x-0 transition-transform duration-300 origin-left group-hover:scale-x-100"></span>
            </button>
          )}
        </div>

        <div className="hidden lg:flex items-center space-x-5">
          <a
            href="tel:+12124609432"
            className="flex items-center space-x-2 text-xs uppercase tracking-widest text-brand-black hover:text-brand-nude transition-colors duration-300"
          >
            <Phone size={14} className="text-brand-nude animate-pulse" />
            <span className="font-semibold">Call Now</span>
          </a>

          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-xs font-serif italic text-brand-black/70">
                Bonjour, <span className="font-sans not-italic font-semibold tracking-wide text-brand-nude">{profile?.name || user.displayName || 'Client'}</span>
              </span>
              {user.email === 'official.agentraai@gmail.com' && (
                <button
                  onClick={onAdminToggle}
                  className={`px-4.5 py-2.5 text-[10px] uppercase tracking-widest font-semibold rounded-full border transition-all duration-300 cursor-pointer ${
                    showAdminPortal
                      ? 'bg-brand-nude text-white border-brand-nude hover:opacity-90'
                      : 'border-brand-nude text-brand-nude hover:bg-brand-nude hover:text-white'
                  }`}
                >
                  {showAdminPortal ? 'View Website' : 'Admin Portal'}
                </button>
              )}
              <button
                onClick={() => logout()}
                className="px-4.5 py-2.5 text-[10px] uppercase tracking-widest font-bold rounded-full border border-brand-black/30 text-brand-black hover:bg-brand-black hover:text-white transition-all duration-300 cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="px-6 py-2.5 text-[10px] uppercase tracking-widest"
              style={{
                fontFamily: 'inherit',
                fontWeight: 700,
                borderRadius: '9999px',
                border: '1px solid rgba(0, 0, 0, 0.25)',
                color: 'var(--brand-black, #000000)',
                backgroundColor: 'transparent',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--brand-black, #000000)';
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--brand-black, #000000)';
              }}
            >
              Sign In
            </button>
          )}

          <button
            onClick={() => {
              const bookingElement = document.getElementById('booking');
              if (bookingElement) {
                bookingElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
            className="px-6 py-2.5 text-[11px] uppercase tracking-[0.15em] font-bold rounded-full transition-all duration-300 transform bg-brand-black text-white hover:bg-brand-nude shadow-md hover:shadow-lg hover:scale-[1.03] active:scale-95 cursor-pointer"
          >
            Book Now
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden p-2 text-brand-black hover:text-brand-nude transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X />
          ) : (
            <Menu />
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
                {user && (
                  <motion.button
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: navLinks.length * 0.1 }}
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      if (onMyBookingClick) onMyBookingClick();
                    }}
                    className="text-left text-2xl font-serif text-brand-black hover:text-brand-nude transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap"
                  >
                    <span>My Booking</span>
                  </motion.button>
                )}
              </div>

              <div className="mt-12 pt-12 border-t border-brand-blush flex flex-col space-y-6">
                {user ? (
                  <div className="flex flex-col space-y-2">
                    <p className="text-[10px] uppercase tracking-widest text-brand-black/50 font-semibold">Signed in as</p>
                    <p className="font-serif text-xl text-brand-black font-semibold h-7 overflow-hidden truncate">
                      {profile?.name || user.displayName || 'Client'}
                    </p>
                    {user.email === 'official.agentraai@gmail.com' && (
                      <button
                        onClick={() => {
                          if (onAdminToggle) onAdminToggle();
                          setIsMobileMenuOpen(false);
                        }}
                        className="text-left text-xs uppercase tracking-widest font-bold text-brand-nude hover:text-brand-black pt-1 block"
                      >
                        {showAdminPortal ? '← View Salon Website' : '🛡️ Manage Salon Bookings (Admin)'}
                      </button>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="text-left text-xs uppercase tracking-widest font-bold text-red-500 hover:text-red-700 pt-1"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsAuthModalOpen(true);
                    }}
                    className="w-full border border-brand-blush text-brand-black py-4 rounded-full flex items-center justify-center space-x-2 text-sm uppercase tracking-widest font-semibold hover:bg-brand-beige transition-colors cursor-pointer"
                  >
                    <UserIcon size={18} className="text-brand-nude" />
                    <span>Sign In / Sign Up</span>
                  </button>
                )}

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
