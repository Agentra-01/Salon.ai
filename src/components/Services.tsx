import { motion } from 'motion/react';
import { Scissors, Wind, Palette, Sparkles, Wand2, Ruler, Flower2 } from 'lucide-react';

const services = [
  {
    title: 'Precision Haircuts',
    description: 'Expertly tailored cuts for all hair types and styles.',
    price: 'From $45',
    icon: <Scissors size={24} />,
    image: 'https://images.unsplash.com/photo-1593121925328-369cc8459c08?auto=format&fit=crop&q=80&w=600'
  },
  {
    title: 'Signature Blowouts',
    description: 'High-volume, long-lasting blowouts for a polished look.',
    price: 'From $40',
    icon: <Wind size={24} />,
    image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80&w=600'
  },
  {
    title: 'Professional Coloring',
    description: 'Balayage, highlights, and full color transformations.',
    price: 'From $120',
    icon: <Palette size={24} />,
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=600'
  },
  {
    title: 'Wash & Set',
    description: 'Refreshing cleanse followed by precision styling.',
    price: 'From $35',
    icon: <Sparkles size={24} />,
    image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=600'
  },
  {
    title: 'Curly Hair Care',
    description: 'Specialized techniques for defined, healthy curls.',
    price: 'From $55',
    icon: <Flower2 size={24} />,
    image: 'https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?auto=format&fit=crop&q=80&w=600'
  },
  {
    title: 'Beauty Treatments',
    description: 'Deep conditioning and keratin smoothing treatments.',
    price: 'From $80',
    icon: <Wand2 size={24} />,
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=600'
  }
];

export default function Services() {
  return (
    <section id="services" className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs uppercase tracking-[0.4em] text-brand-nude mb-4 block font-semibold"
          >
            Our Expertise
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-serif mb-6"
          >
            Boutique Services for <br /> Modern <span className="italic text-brand-nude">Elegance</span>
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 80 }}
            viewport={{ once: true }}
            className="h-[2px] bg-brand-gold mx-auto"
          ></motion.div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group relative overflow-hidden rounded-[40px] bg-brand-beige"
            >
              <div className="aspect-[4/5] overflow-hidden relative">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Floating Icon */}
                <div className="absolute top-6 right-6 w-12 h-12 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-brand-nude opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0 shadow-lg">
                  {service.icon}
                </div>
              </div>

              <div className="p-8 relative">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-serif">{service.title}</h3>
                  <span className="text-brand-nude font-medium">{service.price}</span>
                </div>
                <p className="text-brand-black/60 text-sm font-light leading-relaxed mb-6">
                  {service.description}
                </p>
                <button
                  onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full py-4 border border-brand-nude text-brand-nude text-xs uppercase tracking-widest font-semibold rounded-full hover:bg-brand-nude hover:text-white transition-all duration-300 transform group-hover:shadow-lg"
                >
                  Book Appointment
                </button>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-20 text-center">
            <p className="text-black font-bold text-xs uppercase tracking-[0.2em] mb-4">* All prices are starting values and may vary based on hair length and complexity.</p>
        </div>
      </div>
    </section>
  );
}
