import { MapPin, Phone, Mail } from 'lucide-react';
import { motion } from 'motion/react';

export default function Contact() {
  return (
    <section id="contact" className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <span className="text-xs uppercase tracking-[0.4em] text-brand-nude mb-4 block font-semibold">Visit Us</span>
            <h2 className="text-4xl md:text-5xl font-serif mb-12">Let's Connect in <br /><span className="italic text-brand-nude">New York</span></h2>

            <div className="space-y-10">
              <div className="flex items-start space-x-6">
                <div className="w-12 h-12 bg-brand-blush/50 rounded-2xl flex items-center justify-center text-brand-nude flex-shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-serif text-xl mb-2">Our Location</h4>
                  <p className="text-brand-black/60 font-light leading-relaxed">
                    133 E 4th St #A, <br />
                    New York, NY 10003, USA <br />
                    <span className="text-[10px] uppercase font-semibold text-brand-nude mt-2 block">Located in Jennifer's Cafe</span>
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-6">
                <div className="w-12 h-12 bg-brand-blush/50 rounded-2xl flex items-center justify-center text-brand-nude flex-shrink-0">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="font-serif text-xl mb-2">Call Directly</h4>
                  <a href="tel:+12124609432" className="text-brand-black/60 font-light text-lg hover:text-brand-nude transition-colors">
                    +1 212-460-9432
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-6">
                <div className="w-12 h-12 bg-brand-blush/50 rounded-2xl flex items-center justify-center text-brand-nude flex-shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="font-serif text-xl mb-2">Email Support</h4>
                  <a href="mailto:hello@doloresbeautynyc.com" className="text-brand-black/60 font-light hover:text-brand-nude transition-colors">
                    hello@doloresbeautynyc.com
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-16">
              <p className="text-[10px] uppercase tracking-widest text-brand-black/40 mb-6 font-semibold">Join the conversation</p>
              <div className="flex space-x-6">
                <a 
                  href="https://www.instagram.com/doloresbeauty_salon/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-10 h-10 border border-brand-blush rounded-full flex items-center justify-center text-brand-black hover:bg-brand-nude hover:text-white hover:border-brand-nude transition-all duration-300"
                  title="Follow us on Instagram"
                >
                  <span className="sr-only">Instagram</span>
                  <svg 
                    viewBox="0 0 24 24" 
                    fill="currentColor" 
                    className="w-[18px] h-[18px]"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-full aspect-[4/3] lg:aspect-square bg-brand-beige rounded-[60px] overflow-hidden relative shadow-2xl group"
          >
            {/* Real Map embed or Placeholder */}
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3023.496522198!2d-73.9897184!3d40.7280!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c2599b50b5722d%3A0xc33e218c57134372!2s133%20E%204th%20St%20%23A%2C%20New%20York%2C%20NY%2010003%2C%20USA!5e0!3m2!1sen!2sus!4v1715433229!5m2!1sen!2sus"
              className="w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-700"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
            
            <div className="absolute bottom-8 left-8 right-8 glass-morphism p-6 rounded-3xl transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                <p className="text-xs uppercase tracking-widest text-brand-black font-semibold mb-1">Dolores Beauty Salon</p>
                <p className="text-[10px] text-brand-black/60">Professional Haircare in the Heart of NYC</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
