import { useEffect, useState } from 'react';
import img1 from '../../Assets/gemini-3-pro-image-preview-2k_a_add_people_black_sho.png';
import img2 from '../../Assets/gemini-3-pro-image-preview-2k_a_give_me_image_for_we (3).png';
import img3 from '../../Assets/gemini-3-pro-image-preview-2k_a_give_me_image_for_we (5).png';

const images = [img1, img2, img3];

export default function BannerCarousel() {
  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 3000);
    return () => clearInterval(id);
  }, [isHovered]);

  return (
    <div
      className="w-screen overflow-hidden"
      style={{ height: '100vh' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full h-full">
        {images.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={`banner-${i}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
              i === index ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          />
        ))}

        {/* Black gradient from bottom (covers full height) */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-0 right-0 h-full bg-gradient-to-t from-black/80 to-transparent" />
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-3 h-3 rounded-full ${i === index ? 'bg-white' : 'bg-white/50'}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
