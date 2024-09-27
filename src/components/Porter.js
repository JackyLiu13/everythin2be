import React, { useState, useEffect, useRef, useCallback } from "react";
import TypewriterText from "./TypewriterText";
import "./Porter.css";

const MAX_FALLING_PORTER_FLAKES = 200;

const Porter = ({
  text = "❄",
  count = 500,
  speed = 5,
  color = "#fff",
  size = "1em",
  sentences = [
    "Hello, World!",
    "Welcome to Porter Robinson",
    "Enjoy the show!",
  ],
}) => {
  const [porterflakes, setPorterflakes] = useState([]);
  const [textDimensions, setTextDimensions] = useState(null);
  const containerRef = useRef(null);
  const uniqueIdRef = useRef(0);
  const animationFrameRef = useRef(null);
  const isAnimatingRef = useRef(false);

  const createPorterflake = useCallback(() => ({
    id: uniqueIdRef.current++,
    x: Math.random() * 100,
    y: -5,
    speed: (Math.random() * speed + 1) / 10,
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 3,
  }), [speed]);

  const checkTypewriterCollision = useCallback((flake) => {
    if (!textDimensions || !containerRef.current) return false;

    const containerRect = containerRef.current.getBoundingClientRect();
    const typewriterLeft = (textDimensions.left / containerRect.width) * 100;
    const typewriterRight = ((textDimensions.left + textDimensions.width) / containerRect.width) * 100;
    const typewriterTop = (textDimensions.top / containerRect.height) * 100;
    const typewriterBottom = ((textDimensions.top + textDimensions.height) / containerRect.height) * 100;

    return (
      flake.x >= typewriterLeft &&
      flake.x <= typewriterRight &&
      flake.y >= typewriterTop &&
      flake.y <= typewriterBottom
    );
  }, [textDimensions]);

  const animate = useCallback(() => {
    if (!isAnimatingRef.current) return;

    setPorterflakes((prevPorterflakes) => {
      return prevPorterflakes.map((flake) => {
        const updatedFlake = {
          ...flake,
          y: flake.y + flake.speed,
          rotation: (flake.rotation + flake.rotationSpeed) % 360,
        };

        if (checkTypewriterCollision(updatedFlake) || updatedFlake.y > 105) {
          return createPorterflake(); // Reset on collision or out of bounds
        }

        return updatedFlake;
      });
    });

    animationFrameRef.current = requestAnimationFrame(animate);
  }, [createPorterflake, checkTypewriterCollision]);

  useEffect(() => {
    const initialPorterflakes = Array.from({ length: MAX_FALLING_PORTER_FLAKES }, createPorterflake);
    setPorterflakes(initialPorterflakes);

    isAnimatingRef.current = true;
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      isAnimatingRef.current = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [animate, createPorterflake]);

  const handleDimensionsChange = useCallback((dimensions) => {
    setTextDimensions(dimensions);
  }, []);

  return (
    <div ref={containerRef} className="porter-container bg-black">
      {porterflakes.map((flake) => (
        <span
          key={flake.id}
          className="porterflake"
          style={{
            left: `${flake.x}%`,
            top: `${flake.y}%`,
            transform: `rotate(${flake.rotation}deg)`,
            color: color,
            fontSize: size,
          }}
        >
          {text}
        </span>
      ))}
      <div className="typewriter-container">
        <TypewriterText sentences={sentences} onDimensionsChange={handleDimensionsChange} />
      </div>
      {textDimensions && (
        <div
          style={{
            position: 'absolute',
            left: `${(textDimensions.left / containerRef.current.getBoundingClientRect().width) * 100}%`,
            top: `${(textDimensions.top / containerRef.current.getBoundingClientRect().height) * 100}%`,
            width: `${(textDimensions.width / containerRef.current.getBoundingClientRect().width) * 100}%`,
            height: `${(textDimensions.height / containerRef.current.getBoundingClientRect().height) * 100}%`,
            border: '1px solid red',
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  );
};

export default Porter;
