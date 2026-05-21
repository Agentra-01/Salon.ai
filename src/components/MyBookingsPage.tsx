import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, ArrowLeft, RefreshCw, XCircle, FileText, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, doc, setDoc, query, where, getDocs } from 'firebase/firestore';

interface AppointmentBooking {
  firestoreId: string;
  id: string;
  userId: string;
  name: string;
  phone: string;
  email: string;
  service: string;
  date: string;
  time: string;
  notes: string;
  createdAt: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export default function MyBookingsPage({ onClose }: { onClose: () => void }) {
  const { user, profile } = useAuth();
  const [userBookings, setUserBookings] = useState<AppointmentBooking[]>([]);
  const [fetching, setFetching] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchUserBookings = async (silent = false) => {
    if (!user) return;
    if (!silent) setFetching(true);
    setErrorMsg(null);
    try {
      const q = query(
        collection(db, 'bookings'),
        where('userId', '==', user.uid)
      );
      const querySnapshot = await getDocs(q);
      const bookingsData: AppointmentBooking[] = [];
      querySnapshot.forEach((docSnap) => {
        bookingsData.push({ ...docSnap.data() as AppointmentBooking, firestoreId: docSnap.id });
      });
      bookingsData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setUserBookings(bookingsData);
      localStorage.setItem(`user_bookings_cache_${user.uid}`, JSON.stringify(bookingsData));
    } catch (err: any) {
      console.warn('MyBookings page fetch error. Falling back to local offline cache:', err);
      const cached = localStorage.getItem(`user_bookings_cache_${user.uid}`);
      if (cached) {
        setUserBookings(JSON.parse(cached));
        setErrorMsg('Operating offline. Displaying cached reservations from this device.');
      } else {
        try {
          handleFirestoreError(err, OperationType.LIST, 'bookings');
        } catch (logErr) {
          setErrorMsg('Unable to retrieve bookings. Please check your network connection.');
        }
      }
    } finally {
      if (!silent) setFetching(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserBookings();
    }
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [user]);

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Are you certain you want to request cancellation for this salon treatment?')) return;
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const bookingDocRef = doc(db, 'bookings', bookingId);
      const existingBooking = userBookings.find(b => b.id === bookingId);
      if (!existingBooking) return;

      const updatedBooking = {
        ...existingBooking,
        status: 'cancelled' as const
      };

      try {
        await setDoc(bookingDocRef, updatedBooking);
      } catch (fErr) {
        console.warn('Could not sync cancellation online. Saved and queued locally.', fErr);
      }

      setSuccessMsg('Reservation cancelled successfully.');
      const updatedList = userBookings.map(b => b.id === bookingId ? updatedBooking : b);
      setUserBookings(updatedList);
      localStorage.setItem(`user_bookings_cache_${user.uid}`, JSON.stringify(updatedList));

      // Sync into general cache
      const allCached = localStorage.getItem('all_bookings_cache');
      if (allCached) {
        const allData: AppointmentBooking[] = JSON.parse(allCached);
        const updatedAll = allData.map(b => b.id === bookingId ? updatedBooking : b);
        localStorage.setItem('all_bookings_cache', JSON.stringify(updatedAll));
      }
    } catch (err: any) {
      console.error('Cancel booking error on MyBookings screen:', err);
      try {
        handleFirestoreError(err, OperationType.UPDATE, `bookings/${bookingId}`);
      } catch (logErr) {
        setErrorMsg('Unauthorized context error. Unable to cancel appointment at this time.');
      }
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

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'confirmed':
        return {
          icon: <CheckCircle2 className="text-emerald-500" size={14} />,
          badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-100',
          label: 'Confirmed'
        };
      case 'cancelled':
        return {
          icon: <XCircle className="text-gray-400" size={14} />,
          badgeClass: 'bg-gray-50 text-gray-500 border-gray-100',
          label: 'Cancelled'
        };
      default:
        return {
          icon: <Clock className="text-amber-500 animate-pulse" size={14} />,
          badgeClass: 'bg-amber-50 text-amber-700 border-amber-100',
          label: 'Pending Review'
        };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-brand-beige pt-32 pb-24 relative overflow-hidden"
    >
      {/* Decorative luxury arches & geometric lines */}
      <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 border border-brand-nude/10 rounded-full pointer-events-none"></div>
      <div className="absolute bottom-10 left-0 -ml-24 w-64 h-64 border border-brand-nude/10 rounded-full pointer-events-none"></div>
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Navigation Bar */}
        <div className="flex items-center justify-between mb-12 border-b border-brand-nude/10 pb-6">
          <button
            onClick={onClose}
            className="flex items-center space-x-3 text-[10px] uppercase tracking-[0.25em] font-bold text-brand-black hover:text-brand-nude transition-colors cursor-pointer group"
          >
            <ArrowLeft size={14} className="transform transition-transform group-hover:-translate-x-1" />
            <span>Return to Salon</span>
          </button>
          
          <button
            onClick={() => fetchUserBookings(false)}
            disabled={fetching}
            className="p-2.5 text-brand-black hover:text-brand-nude hover:scale-105 transition-all cursor-pointer rounded-full hover:bg-brand-blush/30"
            title="Refresh List"
          >
            <RefreshCw size={14} className={fetching ? 'animate-spin text-brand-nude' : ''} />
          </button>
        </div>

        {/* Title / Header */}
        <div className="text-center md:text-left mb-12">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
            <Sparkles className="text-brand-nude" size={13} />
            <span className="text-[10px] uppercase tracking-[0.5em] text-brand-nude font-bold">VIP Private Access</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif text-brand-black tracking-tight leading-tight">
            My <span className="italic font-light text-brand-nude">Booking</span>
          </h1>
          <p className="text-xs md:text-sm text-brand-black/50 font-light mt-3 max-w-xl leading-relaxed">
            Personal appointment logs, appointment statuses, and customizable salon styling requests curated at Dolores Beauty Salon.
          </p>
        </div>

        {/* Status Alerts */}
        {errorMsg && (
          <div className="p-4 mb-6 bg-amber-50/80 text-amber-900 rounded-2xl text-xs font-light leading-relaxed border border-amber-200/50 flex items-start space-x-3 animate-fade-in">
            <AlertCircle className="flex-shrink-0 mt-0.5 text-amber-600" size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-4 mb-6 bg-emerald-50/80 text-emerald-900 rounded-2xl text-xs font-light leading-relaxed border border-emerald-200/50 flex items-start space-x-3 animate-fade-in">
            <CheckCircle2 className="flex-shrink-0 mt-0.5 text-emerald-600" size={16} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Main List Area */}
        {!user ? (
          <div className="bg-white/80 backdrop-blur-md rounded-[40px] p-12 text-center border border-brand-nude/15 shadow-xl flex flex-col items-center">
            <AlertCircle size={40} className="text-brand-nude mb-4" />
            <h3 className="font-serif text-2xl mb-2 text-brand-black">Please Sign In</h3>
            <p className="text-xs text-brand-black/60 font-light mb-6 max-w-sm">
              You must be authenticated to securely retrieve and view your verified reservation schedules.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-brand-black text-white text-[10px] uppercase tracking-[0.2em] font-bold rounded-full hover:bg-brand-nude transition-all duration-300 cursor-pointer shadow-lg hover:shadow-brand-nude/10"
            >
              Back to Lounge
            </button>
          </div>
        ) : fetching ? (
          <div className="bg-white/80 backdrop-blur-md rounded-[40px] border border-brand-nude/15 p-24 text-center shadow-lg flex flex-col items-center justify-center space-y-6">
            <div className="relative w-12 h-12">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 border-2 border-brand-nude/10 border-t-brand-nude rounded-full"
              />
              <div className="absolute inset-2 flex items-center justify-center">
                <Sparkles className="text-brand-nude animate-pulse" size={16} />
              </div>
            </div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-brand-black/40 font-bold">Synchronizing Salon Schedule</p>
          </div>
        ) : userBookings.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-md rounded-[40px] border border-brand-nude/15 p-16 text-center shadow-xl flex flex-col items-center max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-brand-beige rounded-full flex items-center justify-center mb-6 border border-brand-blush/30">
              <Calendar className="text-brand-nude" size={24} />
            </div>
            <h3 className="font-serif text-3xl text-brand-black mb-3">No Active Bookings</h3>
            <p className="text-xs text-brand-black/60 font-light mb-8 max-w-sm leading-relaxed">
              You do not have any salon treatment services scheduled at the moment. Return to our homepage to request a curated styling experience!
            </p>
            <button
              onClick={onClose}
              className="px-8 py-4 bg-brand-black text-white text-[10px] uppercase tracking-[0.25em] font-bold rounded-full hover:bg-brand-nude hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              Book an Appointment
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {userBookings.map((booking) => {
              const statusInfo = getStatusStyle(booking.status);
              return (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={booking.id}
                  className="bg-white/90 backdrop-blur-md rounded-[32px] p-6 md:p-8 border border-brand-nude/15 shadow-[0_8px_30px_rgb(0,0,0,0.01)] hover:shadow-xl hover:border-brand-nude/35 transition-all duration-300 relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                >
                  <div className="space-y-4 flex-grow max-w-xl">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-serif text-2xl text-brand-black tracking-tight leading-tight">
                        {getServiceLabel(booking.service)}
                      </h3>
                      <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full border text-[9px] uppercase tracking-widest font-bold ${statusInfo.badgeClass}`}>
                        {statusInfo.icon}
                        <span>{statusInfo.label}</span>
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-light text-brand-black/60 font-sans">
                      <span className="flex items-center">
                        <Calendar size={13} className="mr-2 text-brand-nude opacity-80" />
                        {booking.date}
                      </span>
                      <span className="flex items-center border-l border-brand-blush/85 pl-6 hidden sm:inline"></span>
                      <span className="flex items-center">
                        <Clock size={13} className="mr-2 text-brand-nude opacity-80" />
                        {booking.time}
                      </span>
                    </div>

                    {booking.notes && (
                      <div className="border-l-2 border-brand-nude/35 pl-4 py-1.5 mt-3 bg-brand-beige/40 rounded-r-2xl border border-transparent">
                        <p className="text-xs italic text-brand-black/60 font-light leading-relaxed">
                          "{booking.notes}"
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-stretch self-stretch md:self-center md:items-end justify-center min-w-[130px]">
                    {booking.status === 'pending' ? (
                      <button
                        onClick={() => handleCancelBooking(booking.id)}
                        className="py-2.5 px-6 border border-red-200 text-red-700 hover:text-white rounded-full text-[10px] uppercase tracking-widest font-bold hover:bg-red-600 hover:border-red-600 transition-all duration-300 cursor-pointer text-center whitespace-nowrap shadow-sm"
                      >
                        Cancel Booking
                      </button>
                    ) : (
                      <span className="text-[10px] uppercase tracking-[0.2em] text-brand-black/35 text-center font-bold tracking-widest">
                        {booking.status === 'confirmed' ? '✦ Reserved' : '✦ Closed'}
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Footer Advice */}
        <div className="mt-20 text-center border-t border-brand-nude/15 pt-8">
          <div className="flex items-center justify-center space-x-2 text-brand-nude mb-2">
            <Sparkles size={14} className="animate-spin-slow" />
            <span className="text-xs uppercase tracking-[0.3em] font-bold font-serif">Dolores Salon Policy</span>
          </div>
          <p className="text-[11px] text-brand-black/40 font-light max-w-md mx-auto leading-relaxed">
            Please notify us at least 24 hours in advance if you need to reschedule or alter your booked session. Same-day cancellations may require review. Thank you for your brand loyalty!
          </p>
        </div>

      </div>
    </motion.div>
  );
}
