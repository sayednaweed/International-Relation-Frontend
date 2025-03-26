import CachedImage from "@/components/custom-ui/image/CachedImage";
import { Slider } from "@/database/tables";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState, useEffect } from "react";

interface CarouselProps {
  images: Slider[];
  autoPlayInterval?: number; // Option to set auto-play interval in milliseconds
}

const Carousel: React.FC<CarouselProps> = ({
  images,
  autoPlayInterval = 9000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Function to go to the next slide
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  // Function to go to the previous slide
  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  // Set an interval for autoPlay
  useEffect(() => {
    const intervalId = setInterval(nextSlide, autoPlayInterval);

    // Clear interval when the component unmounts
    return () => {
      clearInterval(intervalId);
    };
  }, [autoPlayInterval]);

  return (
    <div className="relative w-full shadow shadow-primary/30 h-full rounded-md overflow-hidden">
      <div className="relative h-full">
        {/* Image Slider */}
        <CachedImage
          src={images[currentIndex]?.path}
          alt="Avatar"
          ShimmerIconClassName="hidden"
          shimmerClassName="w-full min-h-full transition-transform duration-700 ease-in-out object-center"
          className="w-full min-h-full transition-transform duration-700 ease-in-out object-contain"
          routeIdentifier={"public"}
        />
      </div>

      {/* Navigation buttons */}
      <ChevronLeft
        onClick={prevSlide}
        className="absolute border border-primary-foreground/70 hover:bg-primary-foreground hover:text-primary/90 p-1 top-1/2 left-4 transform -translate-y-1/2 bg-opacity-70 size-8 sm:size-10 cursor-pointer bg-primary/60 text-primary-foreground rounded-full transition duration-300"
      />
      <ChevronRight
        onClick={prevSlide}
        className="absolute border border-primary-foreground/70 hover:bg-primary-foreground hover:text-primary/90 p-1 top-1/2 right-4 transform -translate-y-1/2 bg-opacity-70 size-8 sm:size-10 cursor-pointer bg-primary/60 text-primary-foreground rounded-full transition duration-300"
      />

      {/* Dots navigation (styled as a line) */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-x-2">
        {images.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-1 w-4 rounded-full transition-all duration-300 ease-in-out ${
              currentIndex === index ? "bg-tertiary" : "bg-gray-400"
            } cursor-pointer`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
