import React, { useState, useEffect } from "react";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import clsx from "clsx";

const Carousel = ({
  children,
  visibleSlides = 3,
  totalSlides,
  step = 1,
  interval = 2000,
  showDots = false,
  showArrow = true,
  autoPlay = false,
  infinite = false,
  dotClass = "",
  dotColor = "#3399cc",
  leftButtonClass = "",
  leftButtonStyle = {},
  rightButtonClass = "",
  rightButtonStyle = {},
  sx = {},
  dotGroupMarginTop = "2rem",
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);

  // Convert children to an array
  const childArray = React.Children.toArray(children);

  // Use total slides from prop or child array length
  const slidesToRender = totalSlides || childArray.length;

  const handlePrev = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide === 0 ? slidesToRender - 1 : prevSlide - 1
    );
  };

  const handleNext = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide === slidesToRender - 1 ? 0 : prevSlide + 1
    );
  };

  const handleDotClick = (index) => {
    setCurrentSlide(index);
  };

  // Autoplay functionality
  useEffect(() => {
    let intervalId;
    if (isPlaying) {
      intervalId = setInterval(handleNext, interval);
    }
    return () => clearInterval(intervalId);
  }, [isPlaying, interval]);

  const renderDots = () => {
    const total = slidesToRender;
    const dots = [];
    for (let i = 0; i < total; i += step) {
      dots.push(
        <div
          className={clsx(dotClass, { active: currentSlide === i })}
          style={{
            backgroundColor: currentSlide === i ? dotColor : "#ddd",
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            margin: "0 5px",
            cursor: "pointer",
          }}
          key={i}
          onClick={() => handleDotClick(i)}
        />
      );
    }
    return dots;
  };

  return (
    <div className="carousel-container" style={{ ...sx, position: "relative" }}>
      <div
        className="carousel-wrapper"
        style={{
          display: "flex",
          overflow: "hidden",
          width: "100%",
        }}
      >
        {childArray
          .slice(currentSlide, currentSlide + visibleSlides)
          .map((child, index) => (
            <div
              key={`slide-${index}`}
              style={{
                flex: `0 0 ${100 / visibleSlides}%`,
                maxWidth: `${100 / visibleSlides}%`,
                padding: "0 10px",
                boxSizing: "border-box",
              }}
            >
              {child}
            </div>
          ))}
      </div>

      {totalSlides > 3 && showArrow ? (
        <>
          {/* Left Arrow */}
          <button
            onClick={handlePrev}
            className={clsx(leftButtonClass)}
            disabled={false}
            style={{
              ...leftButtonStyle,
              position: "absolute",
              top: "50%",
              left: "10px",
              transform: "translateY(-50%)",
              zIndex: 10,
              background: "#3399cc",
              border: "none",
              borderRadius: "50%",
              padding: "10px",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            <ArrowBack fontSize="small" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={handleNext}
            className={clsx(rightButtonClass)}
            style={{
              ...rightButtonStyle,
              position: "absolute",
              top: "50%",
              right: "10px",
              transform: "translateY(-50%)",
              zIndex: 10,
              background: "#3399cc",
              border: "none",
              borderRadius: "50%",
              padding: "10px",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            <ArrowForward fontSize="small" />
          </button>
        </>
      ) : (
        <></>
      )}

      {showDots && (
        <div
          className="dot-group"
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: dotGroupMarginTop,
          }}
        >
          {renderDots()}
        </div>
      )}
    </div>
  );
};

export default Carousel;
