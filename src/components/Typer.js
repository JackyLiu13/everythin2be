import React, { useState, useEffect, useRef } from 'react';
const Typer = ({ content = [], fontSize = 'text-5xl', typingSpeed = 100, deletingSpeed = 50, pauseDuration = 1000 }) => {
  const [text, setText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [contentIndex, setContentIndex] = useState(0);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef(null);

  useEffect(() => {
    let timer;
    const currentContent = content[contentIndex];

    if (isTyping) {
      if (text.length < currentContent.length) {
        timer = setTimeout(() => {
          setText(currentContent.slice(0, text.length + 1));
        }, typingSpeed);
      } else {
        timer = setTimeout(() => setIsTyping(false), pauseDuration);
      }
    } else {
      if (text.length > 0) {
        timer = setTimeout(() => {
          setText(text.slice(0, -1));
        }, deletingSpeed);
      } else {
        setContentIndex((prevIndex) => (prevIndex + 1) % content.length);
        setIsTyping(true);
      }
    }

    return () => clearTimeout(timer);
  }, [text, isTyping, contentIndex, content, typingSpeed, deletingSpeed, pauseDuration]);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { offsetWidth, offsetHeight } = containerRef.current;
        setDimensions({ width: offsetWidth, height: offsetHeight });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => window.removeEventListener('resize', updateDimensions);
  }, [text]);

  useEffect(() => {
    // console.log('Typer dimensions:', dimensions);
  }, [dimensions]);

  return (
    <div ref={containerRef} className={`inline-block font-mono ${fontSize} leading-normal`}>
      {text}
      <span className="inline-block w-[0.1em] h-[1.2em] bg-black animate-blink align-text-bottom"></span>
    </div>
  );
};

export default Typer;