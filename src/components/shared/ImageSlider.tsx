import React, { useState, useEffect } from 'react';

const ImageSlider = ({ images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [images.length]);

  if (window.innerWidth < 1280) return null;

  return (
    <div className="relative mt-10 mr-10 w-1/2 object-cover h-screen">
      {images.map((image, index) => (
        <img
          key={index}
          src={image}
          alt={`image_${index}`}
          className={`absolute top-0 left-0 transition-opacity duration-1000 ${
            index === currentImageIndex ? 'opacity-100' : 'opacity-0'
          } w-full h-4/5 rounded-xl`}
        />
      ))}
    </div>
  );
};

export default ImageSlider;
