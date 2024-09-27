import React, { useState, useEffect, useRef } from 'react';
import './Snow.css';

const MAX_FALLING_SNOWFLAKES = 100;

const Snow = ({ text = '❄', count = 500, speed = 5, color = '#fff', size = '1em' }) => {
    const [snowflakes, setSnowflakes] = useState([]);
  const snowflakeQueue = useRef([]);
  const containerRef = useRef(null);
  const landedPositions = useRef({});
  const highestLandedPosition = useRef(100);

  const createSnowflake = (id) => ({
    id,
    x: Math.random() * 100,
    y: -(Math.random() * 20), // Start just above the screen
    speed: (Math.random() * speed + 1) / 10,
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 3,
    landed: false,
  });

  useEffect(() => {
    // Initialize the queue with all snowflakes
    snowflakeQueue.current = Array.from({ length: count }, (_, index) => createSnowflake(index));
    
    // Activate initial snowflakes
    setSnowflakes(snowflakeQueue.current.splice(0, MAX_FALLING_SNOWFLAKES));

    const animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [count, speed]);

  const checkCollision = (x, y) => {
    const column = Math.floor(x / 2) * 2;
    const pileHeight = 100 - (landedPositions.current[column] || 0);
    return y + 2 >= pileHeight; // Check if the next position will collide
  };

  const landSnowflake = (x, y) => {
    const column = Math.floor(x / 2) * 2;
    const currentHeight = landedPositions.current[column] || 0;
    const newHeight = Math.max(currentHeight, 100 - y);
    landedPositions.current[column] = newHeight;
    highestLandedPosition.current = Math.min(highestLandedPosition.current, 100 - newHeight);
    return 100 - newHeight;
  };

  const animate = () => {
    setSnowflakes(prevSnowflakes => {
      const updatedSnowflakes = prevSnowflakes.map(flake => {
        if (flake.landed) return flake;

        const newY = flake.y + flake.speed;
        const newRotation = (flake.rotation + flake.rotationSpeed) % 360;

        if (checkCollision(flake.x, newY)) {
          const landingY = landSnowflake(flake.x, newY);
          return { ...flake, y: landingY, landed: true, rotation: newRotation };
        }

        return { ...flake, y: newY, rotation: newRotation };
      });

      // Count falling snowflakes
      const fallingFlakes = updatedSnowflakes.filter(flake => !flake.landed);
      
      // Add new snowflakes if there are less than MAX_FALLING_SNOWFLAKES
      const newFlakesCount = MAX_FALLING_SNOWFLAKES - fallingFlakes.length;
      const newFlakes = snowflakeQueue.current.splice(0, newFlakesCount);

      if (newFlakes.length < newFlakesCount && snowflakeQueue.current.length === 0) {
        // If queue is empty, regenerate snowflakes
        snowflakeQueue.current = Array.from({ length: count }, (_, index) => createSnowflake(index + count));
      }

      return [...updatedSnowflakes, ...newFlakes];
    });

    requestAnimationFrame(animate);
  };

  return (
    <div ref={containerRef} className="snow-container bg-black">
      {snowflakes.map(flake => (
        <span
          key={flake.id}
          className={`snowflake ${flake.landed ? 'landed' : ''}`}
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
    </div>
  );
};


export default Snow;