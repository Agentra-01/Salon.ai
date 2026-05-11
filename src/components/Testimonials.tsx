import { motion } from 'motion/react';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Jenkins',
    role: 'Client since 2022',
    text: 'Amazing results and definitely worth the wait. The stylists at Dolores really listen and know exactly what works for my hair type.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150'
  },
  {
    name: 'Victoria Rossi',
    role: 'New York Professional',
    text: 'Best haircut and voluminous blowout I\'ve had in the city! The staff is friendly, polite, and respectful. Truly a luxury experience.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150'
  },
  {
    name: 'Elena Gilbert',
    role: 'Regular Client',
    text: 'Reasonable prices and excellent service. I love the warm hospitality and the relaxing atmosphere. My go-to salon in NYC.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150'
  }
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-brand-blush/30 overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 space-y-6 md:space-y-0">
          <div className="max-w-xl">
            <span className="text-xs uppercase tracking-[0.4em] text-brand-nude mb-4 block font-semibold">Kind Words</span>
            <h2 className="text-4xl md:text-5xl font-serif leading-tight">
              Voices of our <br /><span className="italic text-brand-nude">Beautiful</span> Clients
            </h2>
          </div>
          <div className="flex items-center space-x-4 bg-white/50 backdrop-blur-sm p-6 rounded-3xl border border-white/50">
            <div className="text-center">
              <p className="text-3xl font-serif text-brand-black">4.4</p>
              <div className="flex justify-center text-brand-gold my-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={12} fill={i < 4 ? "currentColor" : "none"} />
                ))}
              </div>
              <p className="text-[10px] uppercase tracking-widest text-brand-black/50">107+ Reviews</p>
            </div>
            <div className="w-[1px] h-12 bg-brand-nude/20"></div>
            <div>
              <p className="text-xs font-medium text-brand-black">Google Verified</p>
              <p className="text-[10px] text-brand-black/60">Top Rated NYC Salon</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-10 rounded-[40px] shadow-sm relative group hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
            >
              <div className="absolute top-8 right-10 text-brand-blush group-hover:text-brand-nude transition-colors">
                <Quote size={40} />
              </div>
              
              <div className="flex space-x-1 text-brand-gold mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
              </div>

              <p className="text-brand-black/80 font-light leading-relaxed mb-8 italic">
                "{testimonial.text}"
              </p>

              <div className="flex items-center space-x-4 pt-6 border-t border-brand-blush/30">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-brand-blush ring-offset-2"
                />
                <div>
                  <h4 className="font-serif text-lg leading-none mb-1">{testimonial.name}</h4>
                  <p className="text-[10px] uppercase tracking-widest text-brand-black/50">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
