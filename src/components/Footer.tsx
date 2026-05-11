import { Phone, Mail, MapPin, Instagram, Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-black pt-20 pb-10 text-white overflow-hidden relative">
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <div className="space-y-8">
            <div className="flex flex-col">
              <span className="text-3xl font-serif tracking-widest uppercase text-white">Dolores</span>
              <span className="text-[10px] uppercase tracking-[0.3em] text-brand-blush">Beauty Salon</span>
            </div>
            <p className="text-sm font-light text-white/50 leading-relaxed max-w-xs">
              Exceptional hair care and boutique beauty services in the heart of New York City. We believe in beauty through precision and passion.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-brand-nude transition-colors text-white/70 italic text-sm">Follow the glow →</a>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="font-serif text-xl tracking-wide">Quick Links</h4>
            <ul className="space-y-4 text-sm font-light text-white/60">
              <li><a href="#" className="hover:text-brand-blush transition-colors">Home</a></li>
              <li><a href="#about" className="hover:text-brand-blush transition-colors">Our Story</a></li>
              <li><a href="#services" className="hover:text-brand-blush transition-colors">Services</a></li>
              <li><a href="#gallery" className="hover:text-brand-blush transition-colors">Gallery</a></li>
              <li><a href="#booking" className="hover:text-brand-blush transition-colors">Book Now</a></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="font-serif text-xl tracking-wide">Our Services</h4>
            <ul className="space-y-4 text-sm font-light text-white/60">
              <li><a href="#services" className="hover:text-brand-blush transition-colors">Precision Haircuts</a></li>
              <li><a href="#services" className="hover:text-brand-blush transition-colors">Signature Blowouts</a></li>
              <li><a href="#services" className="hover:text-brand-blush transition-colors">Boutique Coloring</a></li>
              <li><a href="#services" className="hover:text-brand-blush transition-colors">Curly Hair Care</a></li>
              <li><a href="#services" className="hover:text-brand-blush transition-colors">Beauty Treatments</a></li>
            </ul>
          </div>

          <div className="space-y-8">
            <h4 className="font-serif text-xl tracking-wide">Newsletter</h4>
            <div className="space-y-4">
              <p className="text-xs text-white/50 leading-relaxed">
                Join our VIP list for exclusive styling tips and NYC salon updates.
              </p>
              <div className="relative group">
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full bg-white/5 border border-white/10 rounded-full py-4 px-6 text-sm focus:outline-none focus:border-brand-blush transition-all"
                />
                <button className="absolute right-2 top-2 h-10 px-4 bg-brand-blush text-brand-black rounded-full text-[10px] uppercase font-bold tracking-widest hover:bg-white transition-colors">
                  Join
                </button>
              </div>
            </div>
            
            <div className="space-y-4 pt-4">
              <div className="flex items-center space-x-3 text-white/40">
                <MapPin size={14} className="text-brand-nude" />
                <span className="text-[10px] uppercase tracking-widest">East Village, NYC</span>
              </div>
              <div className="flex items-center space-x-3 text-white/40">
                <Phone size={14} className="text-brand-nude" />
                <span className="text-[10px] uppercase tracking-widest">+1 212-460-9432</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/30">
            © {currentYear} Dolores Beauty Salon. All rights reserved.
          </p>
          <div className="flex items-center text-[10px] uppercase tracking-[0.2em] text-white/30">
            Crafted with <Heart size={10} className="mx-2 text-brand-blush animate-pulse fill-brand-blush" /> in NYC
          </div>
        </div>
      </div>

      {/* Decorative Text */}
      <div className="absolute -bottom-10 -left-10 text-[12vw] font-serif text-white/5 whitespace-nowrap select-none italic pointer-events-none uppercase">
        NYC's Preeminent Salon Experience
      </div>
    </footer>
  );
}
