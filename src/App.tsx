import { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Testimonials from './components/Testimonials';
import Gallery from './components/Gallery';
import Booking from './components/Booking';
import Contact from './components/Contact';
import Footer from './components/Footer';
import FloatingActions from './components/FloatingActions';
import AdminPortal from './components/AdminPortal';
import MyBookingsPage from './components/MyBookingsPage';
import { useAuth } from './context/AuthContext';
import AuthModal from './components/AuthModal';

export default function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const { user, isAuthModalOpen, setIsAuthModalOpen } = useAuth();
  const isAdmin = user?.email === 'official.agentraai@gmail.com';
  const [showAdminPortal, setShowAdminPortal] = useState(false);
  const [showMyBookings, setShowMyBookings] = useState(false);

  // Turn off Admin Portal if admin signs out, and turn off My Bookings if logged out
  useEffect(() => {
    if (!isAdmin) {
      setShowAdminPortal(false);
    }
    if (!user) {
      setShowMyBookings(false);
    }
  }, [isAdmin, user]);

  const handleMyBookingClick = () => {
    setShowMyBookings(true);
    setShowAdminPortal(false);
  };

  return (
    <div className="relative min-h-screen">
      {/* Scroll Progress Bar */}
      {!showAdminPortal && (
        <motion.div
          className="fixed top-0 left-0 right-0 h-1 bg-brand-nude z-[100] origin-left"
          style={{ scaleX }}
        />
      )}

      <Navbar 
        onAdminToggle={() => setShowAdminPortal(!showAdminPortal)} 
        showAdminPortal={showAdminPortal} 
        onMyBookingClick={handleMyBookingClick}
      />
      
      <main>
        {showAdminPortal && isAdmin ? (
          <AdminPortal onClose={() => setShowAdminPortal(false)} />
        ) : showMyBookings ? (
          <MyBookingsPage onClose={() => setShowMyBookings(false)} />
        ) : (
          <>
            <Hero />
            
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <About />
              <Services />

              <Testimonials />
              <Gallery />
              
              <Booking onViewBookingsClick={handleMyBookingClick} />
              <Contact />
            </motion.div>
          </>
        )}
      </main>

      <Footer />
      <FloatingActions />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}

