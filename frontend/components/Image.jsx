// import React, { useEffect, useState } from "react";
// import "../styles/Image.css";
// import url from "../url";

// const baseUrl = "url/images/productimages/";

// const ImageSlider = ({ images }) => {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const formattedImages = images.map(image => `${url}/images/productImages/${image}`);
//   console.log("formatted Images",formattedImages);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       goToNext();
//     }, 3000);

//     return () => clearInterval(interval);
//   }, [currentIndex]);

//   const goToPrevious = () => {
//     setCurrentIndex((prevIndex) =>
//       prevIndex === 0 ? formattedImages.length - 1 : prevIndex - 1
//     );
//   };

//   const goToNext = () => {
//     setCurrentIndex((prevIndex) =>
//       prevIndex === formattedImages.length - 1 ? 0 : prevIndex + 1
//     );
//   };

//   return (
//     <div className="slider">
//       <div className="slider-content">
//         {formattedImages.map((image, index) => {
//           const position =
//             index === currentIndex
//               ? "active"
//               : index === (currentIndex - 1 + formattedImages.length) % formattedImages.length
//               ? "previous"
//               : index === (currentIndex + 1) % formattedImages.length
//               ? "next"
//               : "hidden";

//           return (
//             <div
//               key={index}
//               className={`slider-image ${position}`}
//               style={{ backgroundImage: `url(${image})` }}
//             ></div>
//           );
//         })}
//       </div>
//       <button className="slider-button prev" onClick={goToPrevious}>
//         ❮
//       </button>
//       <button className="slider-button next" onClick={goToNext}>
//         ❯
//       </button>
//     </div>
//   );
// };

// export default ImageSlider;

import React, { useEffect, useState } from "react";
import "../styles/Image.css";

// Import images directly
import image1 from "../src/assets/announce/1.jpg";
import image2 from "../src/assets/announce/2.jpg";
import image3 from "../src/assets/announce/3.jpg";

const ImageSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Define image array using imports
  const images = [image1, image2, image3];

  useEffect(() => {
    const interval = setInterval(() => {
      goToNext();
    }, 3000);
    return () => clearInterval(interval);
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
