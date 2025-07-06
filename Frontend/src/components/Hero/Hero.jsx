import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import heroImage1 from "../../assets/hero.jpg";
import heroImage2 from "../../assets/move1.png";
import heroImage3 from "../../assets/move2.jpg";

const images = [heroImage1, heroImage2, heroImage3];

export default function Hero() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto slideshow every 5s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index) => setCurrentIndex(index);

  return (
    <div className="relative w-full min-h-[75vh] overflow-hidden bg-black">
      {/* Background Slides */}
      {images.map((img, i) => (
        <img
          key={i}
          src={img}
          alt={`Slide ${i + 1}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            i === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Text Content */}
      <div className="relative z-10 h-full flex items-center justify-end px-6 md:px-16 text-white">
        <div className="text-right max-w-xl mt-56 mr-14 animate-fade-in-up">
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4 drop-shadow-xl">
            A bite full of love and goodness
          </h1>
          <p className="text-base md:text-lg font-light mb-6 drop-shadow-md">
            Smart choices lead to a healthier life. Discover Nepal’s premium dry fruits curated just for you.
          </p>
          <button
            onClick={() => navigate("/all")}
            className="px-6 py-2 border border-white text-white hover:bg-white hover:text-black transition text-sm font-medium rounded-md"
          >
            Shop Now
          </button>
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {images.map((_, i) => (
          <button
            key={i}
            className={`w-3 h-3 rounded-full transition ${
              i === currentIndex ? "bg-white" : "bg-gray-400"
            }`}
            onClick={() => goToSlide(i)}
          />
        ))}
      </div>
    </div>
  );
}
