import React, { useState, useEffect, useRef } from 'react';
import TypewriterText from './TypewriterText';
import './Porter.css';

const MAX_FALLING_PORTER_FLAKES = 100;

const Porter = ({ text = '❄', count = 500, speed = 5, color = '#fff', size = '1em', sentences = ['Hello, World!', 'Welcome to Porter Robinson', 'Enjoy the show!'] }) => {
  const [Porterflakes, setPorterflakes] = useState([]);
  const PorterflakeQueue = useRef([]);
  const containerRef = useRef(null);
  const landedPositions = useRef({});
  const highestLandedPosition = useRef(100);
  const textAreaRef = useRef(null);
  const [currentText, setCurrentText] = useState('');

  const createPorterflake = (id) => ({
    id,
    x: Math.random() * 100,
    y: -(Math.random() * 20),
    speed: (Math.random() * speed + 1) / 10,
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 3,
    landed: false,
    landedOnText: false,
  });

  useEffect(() => {
    PorterflakeQueue.current = Array.from({ length: count }, (_, index) => createPorterflake(index));
    setPorterflakes(PorterflakeQueue.current.splice(0, MAX_FALLING_PORTER_FLAKES));

    const animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [count, speed]);

  const checkCollision = (x, y) => {
    const column = Math.floor(x / 2) * 2;
    const pileHeight = 100 - (landedPositions.current[column] || 0);
    return y + 2 >= pileHeight;
  };

  const landPorterflake = (x, y) => {
    const column = Math.floor(x / 2) * 2;
    const currentHeight = landedPositions.current[column] || 0;
    const newHeight = Math.max(currentHeight, 100 - y);
    landedPositions.current[column] = newHeight;
    highestLandedPosition.current = Math.min(highestLandedPosition.current, 100 - newHeight);
    return 100 - newHeight;
  };

  const checkTextCollision = (x, y) => {
    if (!textAreaRef.current || !containerRef.current) return false;
    const containerRect = containerRef.current.getBoundingClientRect();
    const textRect = textAreaRef.current.getBoundingClientRect();
    const flakeX = (x / 100) * containerRect.width;
    const flakeY = (y / 100) * containerRect.height;
    return (
      flakeX >= textRect.left - containerRect.left &&
      flakeX <= textRect.right - containerRect.left &&
      flakeY >= textRect.top - containerRect.top &&
      flakeY <= textRect.bottom - containerRect.top
    );
  };

  const animate = () => {
    setPorterflakes(prevPorterflakes => {
      const updatedPorterflakes = prevPorterflakes.map(flake => {
        if (flake.landed && !flake.landedOnText) return flake;

        const newY = flake.y + flake.speed;
        const newRotation = (flake.rotation + flake.rotationSpeed) % 360;

        if (checkTextCollision(flake.x, newY)) {
          if (!flake.landedOnText) {
            return { ...flake, y: newY, rotation: newRotation, landedOnText: true };
          }
          return flake;
        } else if (flake.landedOnText) {
          return { ...flake, landedOnText: false };
        } else if (checkCollision(flake.x, newY)) {
          const landingY = landPorterflake(flake.x, newY);
          return { ...flake, y: landingY, landed: true, rotation: newRotation };
        }

        return { ...flake, y: newY, rotation: newRotation };
      });

      const fallingFlakes = updatedPorterflakes.filter(flake => !flake.landed && !flake.landedOnText);
      const newFlakesCount = MAX_FALLING_PORTER_FLAKES - fallingFlakes.length;
      const newFlakes = PorterflakeQueue.current.splice(0, newFlakesCount);

      if (newFlakes.length < newFlakesCount && PorterflakeQueue.current.length === 0) {
        PorterflakeQueue.current = Array.from({ length: count }, (_, index) => createPorterflake(index + count));
      }

      return [...updatedPorterflakes, ...newFlakes];
    });

    requestAnimationFrame(animate);
  };

  const handleTextChange = (newText) => {
    setCurrentText(newText);
  };

  return (
    <div ref={containerRef} className="porter-container bg-black">
      {Porterflakes.map(flake => (
        <span
          key={flake.id}
          className={`porterflake ${flake.landed ? 'landed' : ''} ${flake.landedOnText ? 'landed-on-text' : ''}`}
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
      <div className="typewriter-container" ref={textAreaRef}>
        <TypewriterText sentences={sentences} onTextChange={handleTextChange} />
      </div>
    </div>
  );
};

export default Porter;