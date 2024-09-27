import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Typer from './Typer';

const HeartContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
`;

const Heart = styled.div`
  position: absolute;
  font-size: 40px;
  user-select: none;
  will-change: transform;
  color: pink;
  line-height: 1;  // No space between lines
  margin: 0;       // Remove any margin
  padding: 0;      // Remove any padding
`;

const TyperWrapper = styled.div`
  position: absolute;
  left: 5%;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: auto;
  z-index: 10;
  color: white;
`;

const Hearts = ({ speed = 120, count = 500, maxActiveHearts = 15 }) => {
  const [hearts, setHearts] = useState([]);
  const [activeHearts, setActiveHearts] = useState(0); // Track currently active hearts
  const containerRef = useRef(null);
  const typerRef = useRef(null);
  const animationFrameRef = useRef(null);
  const landedPositions = useRef({}); // Track the height of settled hearts in columns

  const createHeart = (x = Math.random() * 100, y = -30) => ({
    id: Math.random(),
    left: x,
    top: y,
    speed: speed + Math.random() * speed * 0.5,
    swayAmount: Math.random() * 40 - 20,
    spinAmount: 360 + Math.random() * 360,
    rotation: 0,
    settled: false,
    hasFoundation: false,
  });

  const checkCollision = (heart, allHearts) => {
    const heartElement = document.getElementById(`heart-${heart.id}`);
    if (!heartElement) return null;

    const heartRect = heartElement.getBoundingClientRect();
    const typerRect = typerRef.current?.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();

    // Check collision with the Typer component
    if (typerRect) {
      if (heartRect.bottom >= typerRect.top &&
          heartRect.top <= typerRect.bottom &&
          heartRect.right >= typerRect.left &&
          heartRect.left <= typerRect.right) {
        // Check if the heart is sitting on top of the Typer
        if (Math.abs(heartRect.bottom - typerRect.top) < 5) {
          return { top: typerRect.top - heartRect.height, left: heart.left, onTyper: true, hasFoundation: false };
        }
        return 'delete'; // Signal to delete this heart if it's inside the Typer
      }
    }

    // Check collision with the bottom of the container
    if (heartRect.bottom >= containerRect.bottom) {
      return { top: containerRect.bottom - heartRect.height, left: heart.left, hasFoundation: true };
    }

    // Check collision with other settled hearts
    const settledHearts = allHearts.filter(h => h.settled && h.id !== heart.id);
    let highestCollision = null;

    for (const settledHeart of settledHearts) {
      const settledElement = document.getElementById(`heart-${settledHeart.id}`);
      if (!settledElement) continue;

      const settledRect = settledElement.getBoundingClientRect();

      if (heartRect.bottom >= settledRect.top &&
          heartRect.left < settledRect.right &&
          heartRect.right > settledRect.left) {
        const collisionTop = settledRect.top - heartRect.height;
        if (!highestCollision || collisionTop < highestCollision.top) {
          highestCollision = {
            top: collisionTop,
            left: heart.left,
            hasFoundation: settledHeart.hasFoundation,
          };
        }
      }
    }

    return highestCollision;
  };

  useEffect(() => {
    // Initialize with maxActiveHearts
    setHearts(Array.from({ length: maxActiveHearts }, () => createHeart()));
    setActiveHearts(maxActiveHearts);

    const updateHearts = (timestamp) => {
      const containerRect = containerRef.current?.getBoundingClientRect();
      const typerRect = typerRef.current?.getBoundingClientRect();

      setHearts(prevHearts => {
        const newHearts = prevHearts.reduce((acc, heart) => {
          const heartElement = document.getElementById(`heart-${heart.id}`);
          if (!heartElement) return acc;

          const heartRect = heartElement.getBoundingClientRect();

          if (heart.settled) {
            // Check if the heart should start falling
            if (!heart.hasFoundation && heartRect.bottom < typerRect.top - 5) {
              heart.settled = false;
              heart.onTyper = false;
            } else {
              acc.push(heart);
              return acc;
            }
          }

          // Update heart position
          heart.top += heart.speed * (timestamp - (heart.lastTimestamp || timestamp)) / 1000;
          
          // Only update rotation if the heart is not settled
          if (!heart.settled) {
            heart.rotation += heart.spinAmount * (timestamp - (heart.lastTimestamp || timestamp)) / 1000;
          }
          
          heart.lastTimestamp = timestamp;

          const collisionResult = checkCollision(heart, acc);
          
          if (collisionResult === 'delete') {
            setActiveHearts(prev => prev - 1);
            // Don't add this heart to acc, effectively deleting it
          } else if (collisionResult) {
            heart.settled = true;
            heart.top = collisionResult.top;
            heart.onTyper = collisionResult.onTyper || false;
            heart.hasFoundation = collisionResult.hasFoundation;
            if (heart.onTyper) {
              heart.rotation = 0; // Reset rotation when settling on Typer
            }
            setActiveHearts(prev => prev - 1);
            acc.push(heart);
          } else if (heart.top > containerRect.height) {
            setActiveHearts(prev => prev - 1);
            // Don't add this heart to acc if it's out of bounds
          } else {
            acc.push(heart);
          }
          return acc;
        }, []);

        // Add new hearts to replace deleted or settled ones
        while (newHearts.length < count && newHearts.filter(h => !h.settled).length < maxActiveHearts) {
          newHearts.push(createHeart());
          setActiveHearts(prev => prev + 1);
        }

        return newHearts;
      });

      animationFrameRef.current = requestAnimationFrame(updateHearts);
    };

    animationFrameRef.current = requestAnimationFrame(updateHearts);

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [speed, count, maxActiveHearts]);

  return (
    <HeartContainer ref={containerRef}>
      {hearts.map((heart) => (
        <Heart
          id={`heart-${heart.id}`}
          key={heart.id}
          style={{
            left: `${heart.left}%`,
            transform: `translateY(${heart.top}px) translateX(${Math.sin(heart.top / 50) * heart.swayAmount}px) rotate(${heart.rotation}deg)`,
          }}
        >
          {'<3'}
        </Heart>
      ))}
      <TyperWrapper ref={typerRef}>
        <Typer 
          content={[
            "New Builds",
            "By New Systems",
            "09/27/24 - 09/29/24",
            "📍 Toronto", 
            "See you soon :)"
          ]}
          fontSize="4rem"
          typingSpeed={13}
          deletingSpeed={11}
          pauseDuration={16}
        />
      </TyperWrapper>
    </HeartContainer>
  );
};

export default Hearts;