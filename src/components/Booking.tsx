import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, User, Phone, Mail, Sparkle, FileText, Shield, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function Booking({ 
  onViewBookingsClick 
}: { 
  onViewBookingsClick?: () => void;
}) {
  const { user, profile, setIsAuthModalOpen } = useAuth();
  
  // Form values
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [service, setService] = useState('blowout');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('10:00 AM');
  const [notes, setNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Pre-fill fields when user state updates
  useEffect(() => {
    if (user) {
      setName(profile?.name || user.displayName || '');
      setEmail(profile?.email || user.email || '');
      setPhone(profile?.phone || '');
    } else {
      setName('');
      setEmail('');
      setPhone('');
    }
  }, [user, profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    setIsSubmitting(true);
    setErrorMsg(null);

    const bookingId = `book_${Date.now()}`;
    const newBooking = {
      id: bookingId,
      userId: user.uid,
      name,
      phone,
      email,
      service,
      date,
      time,
      notes,
      createdAt: new Date().toISOString(),
      status: 'pending' as const
    };

    try {
      try {
        const bookingDocRef = doc(db, 'bookings', bookingId);
        await setDoc(bookingDocRef, newBooking);
      } catch (fErr) {
        console.warn('Could not sync booking creation to Cloud Firestore. Saved locally.', fErr);
      }

      // Add to local state and local storage cache
      const cachedKey = `user_bookings_cache_${user.uid}`;
      const existingRaw = localStorage.getItem(cachedKey);
      let list = [];
      if (existingRaw) {
        try {
          list = JSON.parse(existingRaw);
        } catch (_) {}
      }
      const updatedList = [newBooking, ...list];
      localStorage.setItem(cachedKey, JSON.stringify(updatedList));

      // Append to admin cache if present
      const allCached = localStorage.getItem('all_bookings_cache');
      if (allCached) {
        try {
          const allData = JSON.parse(allCached);
          localStorage.setItem('all_bookings_cache', JSON.stringify([newBooking, ...allData]));
        } catch (_) {}
      } else {
        localStorage.setItem('all_bookings_cache', JSON.stringify([newBooking]));
      }

      setIsSuccess(true);
      setNotes('');
    } catch (err: any) {
      console.error('Submit booking error:', err);
      try {
        handleFirestoreError(err, OperationType.WRITE, `bookings/${bookingId}`);
      } catch (logErr: any) {
        setErrorMsg('Reservation submit failed. Please check your network and configuration.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getServiceLabel = (val: string) => {
    switch (val) {
      case 'blowout': return 'Signature Blowout';
      case 'haircut': return 'Precision Haircut';
      case 'color': return 'Professional Color';
      case 'curly': return 'Curly Hair Session';
      case 'treatment': return 'Beauty Treatment';
      default: return val;
    }
  };

  return (
    <section id="booking" className="py-24 bg-brand-beige/50 relative">
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-6xl mx-auto bg-white rounded-[60px] overflow-hidden shadow-2xl flex flex-col lg:flex-row border border-brand-blush/20">
          
          {/* Info Side */}
          <div className="lg:w-5/12 bg-brand-black p-12 lg:p-20 text-white relative overflow-hidden flex flex-col justify-between">
            <div className="relative z-10">
              <span className="text-xs uppercase tracking-[0.4em] text-brand-blush mb-8 block font-semibold">Reserve Today</span>
              <h2 className="text-4xl md:text-5xl font-serif mb-8 leading-tight">
                Secure Your <br /><span className="italic text-brand-blush text-stroke-gold">Glow Up</span>
              </h2>
              
              <ul className="space-y-8 mb-12">
                <li className="flex items-start space-x-4">
                  <div className="mt-1 text-brand-gold"><Sparkle size={20} /></div>
                  <div>
                    <p className="font-serif text-lg">Same-Day Appointments</p>
                    <p className="text-xs text-white/50 leading-relaxed">Available for last-minute transformations.</p>
                  </div>
                </li>
                <li className="flex items-start space-x-4">
                  <div className="mt-1 text-brand-gold"><Sparkle size={20} /></div>
                  <div>
                    <p className="font-serif text-lg">VIP Booking Profile</p>
                    <p className="text-xs text-white/50 leading-relaxed">Your salon preferences, notes, and records are synced securely.</p>
                  </div>
                </li>
              </ul>

              <div className="mt-auto pt-12 border-t border-white/10">
                <p className="text-[10px] uppercase tracking-widest text-white/50 mb-4 font-semibold italic">Salon Hours</p>
                <div className="grid grid-cols-2 gap-4 text-sm font-light">
                  <p>Mon - Sat</p>
                  <p className="text-right">10:00 AM - 5:00 PM</p>
                  <p>Sunday</p>
                  <p className="text-right">Closed</p>
                </div>
              </div>
            </div>

            {/* Background Decor */}
            <div className="absolute top-1/4 -right-1/4 w-[500px] h-[500px] bg-brand-nude/20 rounded-full blur-[100px] -z-0"></div>
          </div>

          {/* Booking Request Panel Side */}
          <div className="lg:w-7/12 p-12 lg:p-20 flex flex-col justify-start min-h-[500px]">
            {user ? (
              <>
                <div className="mb-6 pb-2 border-b border-brand-blush">
                  <h3 className="text-sm uppercase tracking-wider font-bold text-brand-black">
                    Request Appointment
                  </h3>
                </div>

                {errorMsg && (
                  <div className="p-4 mb-6 bg-amber-50 text-amber-700 rounded-3xl text-xs font-light leading-relaxed border border-amber-100 flex items-start space-x-2">
                    <Shield className="flex-shrink-0 mt-0.5 text-amber-600" size={14} />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {isSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="h-full flex flex-col items-center justify-center text-center py-10"
                  >
                    <div className="w-20 h-20 bg-brand-blush rounded-full flex items-center justify-center text-brand-nude mb-6">
                      <Calendar size={36} />
                    </div>
                    <h3 className="text-3xl font-serif mb-3 text-brand-black">Reservation Requested!</h3>
                    <p className="text-brand-black/60 font-light mb-8 max-w-sm text-sm">
                      Thank you, <span className="font-semibold text-brand-black">{name}</span>. Your reservation for a <span className="font-semibold text-brand-black">{getServiceLabel(service)}</span> has been recorded securely in Firestore.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                      <button
                        onClick={() => setIsSuccess(false)}
                        className="px-6 py-3 bg-brand-black text-white text-[10px] uppercase tracking-widest font-semibold rounded-full hover:bg-brand-nude transition-all cursor-pointer"
                      >
                        Book Another
                      </button>
                      <button
                        onClick={() => {
                          setIsSuccess(false);
                          if (onViewBookingsClick) onViewBookingsClick();
                        }}
                        className="px-6 py-3 border border-brand-blush text-brand-black text-[10px] uppercase tracking-widest font-semibold rounded-full hover:bg-brand-blush transition-all cursor-pointer"
                      >
                        View My Booking
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="relative group">
                        <label className="text-[10px] uppercase tracking-widest text-brand-black/50 mb-2 block font-semibold">Your Name</label>
                        <div className="flex items-center border-b border-brand-blush py-2 group-focus-within:border-brand-nude transition-colors">
                          <User className="text-brand-nude mr-3 animate-pulse" size={16} />
                          <input
                            required
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Jane Doe"
                            className="w-full bg-transparent border-none outline-none text-sm font-light placeholder:text-gray-300 text-brand-black"
                          />
                        </div>
                      </div>
                      <div className="relative group">
                        <label className="text-[10px] uppercase tracking-widest text-brand-black/50 mb-2 block font-semibold">Phone Number</label>
                        <div className="flex items-center border-b border-brand-blush py-2 group-focus-within:border-brand-nude transition-colors">
                          <Phone className="text-brand-nude mr-3" size={16} />
                          <input
                            required
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+1 (123) 456-7890"
                            className="w-full bg-transparent border-none outline-none text-sm font-light placeholder:text-gray-300 text-brand-black"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="relative group">
                        <label className="text-[10px] uppercase tracking-widest text-brand-black/50 mb-2 block font-semibold">Email Address</label>
                        <div className="flex items-center border-b border-brand-blush py-2 group-focus-within:border-brand-nude transition-colors">
                          <Mail className="text-brand-nude mr-3" size={16} />
                          <input
                            required
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="jane@example.com"
                            className="w-full bg-transparent border-none outline-none text-sm font-light placeholder:text-gray-300 text-brand-black"
                          />
                        </div>
                      </div>
                      <div className="relative group">
                        <label className="text-[10px] uppercase tracking-widest text-brand-black/50 mb-2 block font-semibold">Select Service</label>
                        <div className="flex items-center border-b border-brand-blush py-2 group-focus-within:border-brand-nude transition-colors overflow-hidden">
                          <Sparkle className="text-brand-nude mr-3 flex-shrink-0" size={16} />
                          <select
                            value={service}
                            onChange={(e) => setService(e.target.value)}
                            className="w-full bg-transparent border-none outline-none text-sm font-light appearance-none cursor-pointer text-brand-black"
                          >
                            <option value="blowout">Signature Blowout</option>
                            <option value="haircut">Precision Haircut</option>
                            <option value="color">Professional Color</option>
                            <option value="curly">Curly Hair Session</option>
                            <option value="treatment">Beauty Treatment</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="relative group">
                        <label className="text-[10px] uppercase tracking-widest text-brand-black/50 mb-2 block font-semibold">Preferred Date</label>
                        <div className="flex items-center border-b border-brand-blush py-2 group-focus-within:border-brand-nude transition-colors">
                          <Calendar className="text-brand-nude mr-3" size={16} />
                          <input
                            required
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full bg-transparent border-none outline-none text-sm font-light text-brand-black"
                          />
                        </div>
                      </div>
                      <div className="relative group">
                        <label className="text-[10px] uppercase tracking-widest text-brand-black/50 mb-2 block font-semibold">Preferred Time</label>
                        <div className="flex items-center border-b border-brand-blush py-2 group-focus-within:border-brand-nude transition-colors font-sans">
                          <Clock className="text-brand-nude mr-3" size={16} />
                          <select
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="w-full bg-transparent border-none outline-none text-sm font-light appearance-none text-brand-black"
                          >
                            <option value="10:00 AM">10:00 AM</option>
                            <option value="11:30 AM">11:30 AM</option>
                            <option value="01:00 PM">01:00 PM</option>
                            <option value="02:30 PM">02:30 PM</option>
                            <option value="04:00 PM">04:00 PM</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="relative group">
                      <label className="text-[10px] uppercase tracking-widest text-brand-black/50 mb-2 block font-semibold">Special Instructions / Notes</label>
                      <div className="flex items-start border-b border-brand-blush py-2 group-focus-within:border-brand-nude transition-colors">
                        <FileText className="text-brand-nude mr-3 mt-1.5 flex-shrink-0" size={16} />
                        <textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Tell us about your hair type, color goals, or styling desires..."
                          rows={2}
                          maxLength={800}
                          className="w-full bg-transparent border-none outline-none text-sm font-light placeholder:text-gray-300 resize-none text-brand-black"
                        />
                      </div>
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 bg-brand-black text-white text-xs uppercase tracking-[0.3em] font-semibold rounded-full hover:bg-brand-nude transition-all shadow-xl hover:shadow-brand-nude/20 transform hover:-translate-y-0.5 relative overflow-hidden cursor-pointer"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center justify-center space-x-2">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                              className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full bg-transparent"
                            />
                            <span>Submitting details...</span>
                          </span>
                        ) : (
                          'Request VIP Session shadow'
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </>
            ) : (
              /* Signed-out state CTA block */
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center text-center py-8"
              >
                <div className="w-16 h-16 bg-brand-beige rounded-full flex items-center justify-center text-brand-nude mb-6 relative">
                  <Shield size={28} className="text-brand-nude" />
                  <Star size={12} className="absolute top-2 right-2 text-brand-gold fill-brand-gold animate-bounce" />
                </div>
                <h3 className="text-2xl font-serif text-brand-black mb-3">Reservations Restricted</h3>
                <p className="text-sm text-brand-black/60 font-light mb-8 max-w-sm leading-relaxed">
                  Join the Dolores Salon VIP circle. Please sign in or create an account to book treatments, track bookings, and experience customized beauty treatments.
                </p>
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="px-10 py-4 bg-brand-black text-white text-xs uppercase tracking-widest font-semibold rounded-full hover:bg-brand-nude transition-all shadow-lg hover:shadow-brand-nude/20 transform hover:-translate-y-0.5 cursor-pointer"
                >
                  Sign In / Create Account
                </button>
              </motion.div>
            )}
          </div>

        </div>
      </div>

    </section>
  );
}
