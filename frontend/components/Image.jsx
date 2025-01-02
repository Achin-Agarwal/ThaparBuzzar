import React, { useEffect, useState } from "react";
import "../styles/Image.css";

const ImageSlider = ({images}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      goToNext();
    }, 3000);

    return () => clearInterval(interval); // Clear interval on component unmount
  }, [currentIndex]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="slider">
      <div className="slider-content">
        {images.map((image, index) => {
          const position =
            index === currentIndex
              ? "active"
              : index === (currentIndex - 1 + images.length) % images.length
              ? "previous"
              : index === (currentIndex + 1) % images.length
              ? "next"
              : "hidden";

          return (
            <div
              key={index}
              className={`slider-image ${position}`}
              style={{ backgroundImage: `url(${image})` }}
            ></div>
          );
        })}
      </div>
      <button className="slider-button prev" onClick={goToPrevious}>
        ❮
      </button>
      <button className="slider-button next" onClick={goToNext}>
        ❯
      </button>
    </div>
  );
};

export default ImageSlider;
