import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const TyperContainer = styled.div`
  display: inline-block;
  font-family: monospace;
  font-size: ${props => props.fontSize || '1rem'};
  line-height: 1.5;
`;

const Cursor = styled.span`
  display: inline-block;
  width: 0.1em;
  height: 1.2em;
  background-color: currentColor;
  animation: blink 0.7s infinite;
  vertical-align: text-bottom;

  @keyframes blink {
    50% {
      opacity: 0;
    }
  }
`;

const Typer = ({ content = [], fontSize = '1rem', typingSpeed = 100, deletingSpeed = 50, pauseDuration = 1000 }) => {
  const [text, setText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [contentIndex, setContentIndex] = useState(0);
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

  return (
    <TyperContainer ref={containerRef} fontSize={fontSize}>
      {text}
      <Cursor />
    </TyperContainer>
  );
};

export default Typer;