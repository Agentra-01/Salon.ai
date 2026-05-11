import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, User, Phone, Mail, Sparkle } from 'lucide-react';

export default function Booking() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 5000);
    }, 1500);
  };

  return (
    <section id="booking" className="py-24 bg-brand-beige/50">
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-6xl mx-auto bg-white rounded-[60px] overflow-hidden shadow-2xl flex flex-col lg:flex-row">
          {/* Info Side */}
          <div className="lg:w-5/12 bg-brand-black p-12 lg:p-20 text-white relative overflow-hidden">
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
                    <p className="font-serif text-lg">Professional Consultation</p>
                    <p className="text-xs text-white/50 leading-relaxed">Every service begins with a personal strategy session.</p>
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

          {/* Form Side */}
          <div className="lg:w-7/12 p-12 lg:p-20">
            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center py-20"
              >
                <div className="w-24 h-24 bg-brand-blush rounded-full flex items-center justify-center text-brand-nude mb-8">
                  <Calendar size={48} />
                </div>
                <h3 className="text-3xl font-serif mb-4">Reservation Requested!</h3>
                <p className="text-brand-black/60 font-light mb-8 max-w-sm px-10">
                  Thank you for choosing Dolores. Our concierge will contact you shortly to confirm your stylish session.
                </p>
                <button
                  onClick={() => setIsSuccess(false)}
                  className="text-brand-nude uppercase tracking-widest text-xs font-semibold border-b border-brand-nude pb-1 hover:text-brand-black hover:border-brand-black transition-all"
                >
                  Book another session
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="relative group">
                    <label className="text-[10px] uppercase tracking-widest text-brand-black/50 mb-2 block font-semibold">Full Name</label>
                    <div className="flex items-center border-b border-brand-blush py-3 group-focus-within:border-brand-nude transition-colors">
                      <User className="text-brand-nude mr-3" size={18} />
                      <input
                        required
                        type="text"
                        placeholder="e.g. Jane Doe"
                        className="w-full bg-transparent border-none outline-none text-sm font-light placeholder:text-gray-300"
                      />
                    </div>
                  </div>
                  <div className="relative group">
                    <label className="text-[10px] uppercase tracking-widest text-brand-black/50 mb-2 block font-semibold">Phone Number</label>
                    <div className="flex items-center border-b border-brand-blush py-3 group-focus-within:border-brand-nude transition-colors">
                      <Phone className="text-brand-nude mr-3" size={18} />
                      <input
                        required
                        type="tel"
                        placeholder="+1 (___) ___-____"
                        className="w-full bg-transparent border-none outline-none text-sm font-light placeholder:text-gray-300"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="relative group">
                    <label className="text-[10px] uppercase tracking-widest text-brand-black/50 mb-2 block font-semibold">Email Address</label>
                    <div className="flex items-center border-b border-brand-blush py-3 group-focus-within:border-brand-nude transition-colors">
                      <Mail className="text-brand-nude mr-3" size={18} />
                      <input
                        required
                        type="email"
                        placeholder="jane@example.com"
                        className="w-full bg-transparent border-none outline-none text-sm font-light placeholder:text-gray-300"
                      />
                    </div>
                  </div>
                  <div className="relative group">
                    <label className="text-[10px] uppercase tracking-widest text-brand-black/50 mb-2 block font-semibold">Select Service</label>
                    <div className="flex items-center border-b border-brand-blush py-3 group-focus-within:border-brand-nude transition-colors overflow-hidden">
                      <Sparkle className="text-brand-nude mr-3 flex-shrink-0" size={18} />
                      <select className="w-full bg-transparent border-none outline-none text-sm font-light appearance-none cursor-pointer">
                        <option value="blowout">Signature Blowout</option>
                        <option value="haircut">Precision Haircut</option>
                        <option value="color">Professional Color</option>
                        <option value="curly">Curly Hair Session</option>
                        <option value="treatment">Beauty Treatment</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="relative group">
                    <label className="text-[10px] uppercase tracking-widest text-brand-black/50 mb-2 block font-semibold">Preferred Date</label>
                    <div className="flex items-center border-b border-brand-blush py-3 group-focus-within:border-brand-nude transition-colors">
                      <Calendar className="text-brand-nude mr-3" size={18} />
                      <input
                        required
                        type="date"
                        className="w-full bg-transparent border-none outline-none text-sm font-light"
                      />
                    </div>
                  </div>
                  <div className="relative group">
                    <label className="text-[10px] uppercase tracking-widest text-brand-black/50 mb-2 block font-semibold">Preferred Time</label>
                    <div className="flex items-center border-b border-brand-blush py-3 group-focus-within:border-brand-nude transition-colors">
                      <Clock className="text-brand-nude mr-3" size={18} />
                      <select className="w-full bg-transparent border-none outline-none text-sm font-light appearance-none">
                        <option>10:00 AM</option>
                        <option>11:30 AM</option>
                        <option>01:00 PM</option>
                        <option>02:30 PM</option>
                        <option>04:00 PM</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-8">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-5 bg-brand-black text-white text-xs uppercase tracking-[0.3em] font-semibold rounded-full hover:bg-brand-nude transition-all shadow-xl hover:shadow-brand-nude/20 transform hover:-translate-y-1 relative overflow-hidden"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center space-x-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        />
                        <span>Confirming...</span>
                      </span>
                    ) : (
                      'Reserve Your Experience'
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
