import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ZoomIn } from 'lucide-react';

const galleryImages = [
  {
    url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=800',
    category: 'Blowout',
    title: 'Voluminous Signature'
  },
  {
    url: 'https://images.unsplash.com/photo-1593121925328-369cc8459c08?auto=format&fit=crop&q=80&w=800',
    category: 'Haircut',
    title: 'Modern Shag'
  },
  {
    url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800',
    category: 'Salon',
    title: 'Our Workspace'
  },
  {
    url: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=800',
    category: 'Styling',
    title: 'Elegant Updo'
  },
  {
    url: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=800',
    category: 'Interior',
    title: 'Luxury Vibe'
  },
  {
    url: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&q=80&w=800',
    category: 'Details',
    title: 'Professional Tools'
  }
];

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <section id="gallery" className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.4em] text-brand-nude mb-4 block font-semibold">Visual Journey</span>
          <h2 className="text-4xl md:text-5xl font-serif mb-6">Our <span className="italic text-brand-nude">Portfolio</span></h2>
          <p className="text-brand-black/60 font-light max-w-lg mx-auto">Explore transformations and the elegant atmosphere that awaits you at Dolores Beauty Salon.</p>
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
          {galleryImages.map((image, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="relative group overflow-hidden rounded-3xl cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500"
              onClick={() => setSelectedImage(image.url)}
            >
              <img
                src={image.url}
                alt={image.title}
                className="w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-brand-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8 text-white">
                <span className="text-[10px] uppercase tracking-widest text-brand-blush mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">{image.category}</span>
                <div className="flex justify-between items-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100">
                  <h4 className="text-xl font-serif">{image.title}</h4>
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <ZoomIn size={18} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 flex flex-col items-center">
          <div className="flex items-center space-x-4 mb-8">
            <svg 
              viewBox="0 0 24 24" 
              fill="currentColor" 
              className="w-6 h-6 text-brand-nude"
            >
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
            <p className="text-sm font-medium tracking-widest uppercase">Follow us @DoloresBeautyNYC</p>
          </div>
          <a 
            href="https://www.instagram.com/doloresbeauty_salon/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-10 py-4 bg-brand-black text-white text-xs uppercase tracking-widest rounded-full hover:bg-brand-nude transition-colors"
          >
            View Instagram Feed
          </a>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-brand-black/95 flex items-center justify-center p-4 md:p-12"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-10 right-10 text-white hover:text-brand-blush transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <X size={40} />
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={selectedImage}
              alt="Gallery Preview"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
