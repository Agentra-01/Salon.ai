import { motion } from 'motion/react';

export default function About() {
  return (
    <section id="about" className="py-24 bg-brand-beige overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="space-y-4 pt-12">
                <img
                  src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&q=80&w=600"
                  alt="Salon Experience 1"
                  className="rounded-[30px] w-full aspect-[3/4] object-cover shadow-lg"
                />
                <div className="bg-brand-blush p-8 rounded-[30px]">
                  <p className="text-4xl font-serif text-brand-black mb-2">107+</p>
                  <p className="text-xs uppercase tracking-widest text-brand-nude">Five Star Reviews</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-brand-black p-8 rounded-[30px] text-white">
                  <p className="text-sm font-light italic">"The best blowout I've ever had in NYC. Professional and so welcoming."</p>
                </div>
                <img
                  src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=600"
                  alt="Salon Experience 2"
                  className="rounded-[30px] w-full aspect-[3/4] object-cover shadow-lg"
                />
              </div>
            </motion.div>
            
            {/* Decors */}
            <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 border border-brand-nude/20 rounded-full"></div>
            <div className="absolute bottom-0 left-0 -ml-12 -mb-12 w-32 h-32 bg-brand-gold/10 rounded-full blur-2xl"></div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="text-xs uppercase tracking-[0.4em] text-brand-nude mb-4 block font-semibold">Our Story</span>
            <h2 className="text-4xl md:text-5xl font-serif mb-8 leading-tight">
              Crafting Beauty with <br />
              <span className="text-brand-nude italic">Passion</span> & Precision
            </h2>
            
            <p className="text-brand-black/70 leading-relaxed mb-6 font-light">
              Dolores Beauty Salon has built a reputation for exceptional hair care, friendly service, and beautiful results. Known for professional blowouts, stylish cuts, and warm hospitality, the salon offers a relaxing beauty experience for every client.
            </p>
            
            <p className="text-brand-black/70 leading-relaxed mb-10 font-light">
              Whether you're looking for a quick trim, a glamorous blowout, or a complete hair transformation, our experienced stylists are dedicated to bringing your vision to life using premium products and modern techniques.
            </p>

            <div className="grid grid-cols-2 gap-8 mb-10">
              <div>
                <h4 className="font-serif text-lg mb-2">Experienced Stylists</h4>
                <p className="text-xs text-brand-black/60 leading-relaxed">Masters of their craft with years of NYC experience.</p>
              </div>
              <div>
                <h4 className="font-serif text-lg mb-2">Friendly Staff</h4>
                <p className="text-xs text-brand-black/60 leading-relaxed">We treat every client with the utmost respect.</p>
              </div>
              <div>
                <h4 className="font-serif text-lg mb-2">Same-day Slots</h4>
                <p className="text-xs text-brand-black/60 leading-relaxed">Flexible scheduling for your busy NYC lifestyle.</p>
              </div>
              <div>
                <h4 className="font-serif text-lg mb-2">Fair Pricing</h4>
                <p className="text-xs text-brand-black/60 leading-relaxed">Luxury results at reasonable, transparent prices.</p>
              </div>
            </div>

            <button className="px-8 py-4 border-b-2 border-brand-nude uppercase tracking-[0.2em] text-xs font-semibold hover:text-brand-nude transition-colors group">
              Discover More <span className="inline-block transition-transform group-hover:translate-x-1 ml-2">→</span>
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
