import React, { useState, useEffect, useRef } from "react";

const TypewriterText = ({
  sentences,
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseDuration = 1000,
}) => {
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [sentenceIndex, setSentenceIndex] = useState(0);
  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 500);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const currentSentence = sentences[sentenceIndex];

    if (isDeleting) {
      if (text === "") {
        setIsDeleting(false);
        setSentenceIndex((prevIndex) => (prevIndex + 1) % sentences.length);
        setTimeout(typeNextChar, pauseDuration);
      } else {
        setTimeout(() => {
          setText((prev) => prev.slice(0, -1));
        }, deletingSpeed);
      }
    } else {
      if (text === currentSentence) {
        setTimeout(() => setIsDeleting(true), pauseDuration);
      } else {
        setTimeout(typeNextChar, typingSpeed);
      }
    }
  }, [
    text,
    isDeleting,
    sentenceIndex,
    sentences,
    typingSpeed,
    deletingSpeed,
    pauseDuration,
  ]);

  const typeNextChar = () => {
    const currentSentence = sentences[sentenceIndex];
    setText((prev) => currentSentence.slice(0, prev.length + 1));
  };

  return (
    <div className="typewriter-text">
      {text}
      <span className={`cursor ${cursorVisible ? "visible" : "invisible"}`}>
        |
      </span>
    </div>
  );
};

export default TypewriterText;
