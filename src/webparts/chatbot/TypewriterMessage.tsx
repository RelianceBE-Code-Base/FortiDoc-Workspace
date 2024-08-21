import React, { useEffect, useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface TypewriterMessageProps {
  content: string;
  speed?: number;
}

const TypewriterMessage: React.FC<TypewriterMessageProps> = ({ content, speed = 20 }) => {
  const [displayedContent, setDisplayedContent] = useState('');
  const index = useRef(0);

  useEffect(() => {
    if (index.current < content.length) {
      const timer = setTimeout(() => {
        setDisplayedContent((prev) => prev + content[index.current]);
        index.current += 1;
      }, speed);

      return () => clearTimeout(timer);
    }
  }, [content, speed, displayedContent]);

  return <ReactMarkdown remarkPlugins={[remarkGfm]}>{displayedContent}</ReactMarkdown>;
};

export default TypewriterMessage;