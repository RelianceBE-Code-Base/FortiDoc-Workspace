import React, { useState } from 'react';
// import './Carousel.css';
import styles from './Carousel.module.scss';
import invokePrompt from './services/ChatService';

interface CarouselProps {
  items: CarouselItem[];
}

interface CarouselItem {
    image: string;
    alt: string;
    caption: string;
    description: string; // Add this new field
  }

const Carousel: React.FC<CarouselProps> = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(1);

  const nextSlide = (): void => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
  };

  const prevSlide = (): void => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length);
  };

  const getVisibleItems = (): CarouselItem[] => {
    const itemsCopy = [...items, ...items, ...items]; // Triple the array to handle wrap-around
    const startIndex = currentIndex + items.length - 1;
    return itemsCopy.slice(startIndex, startIndex + 3);
  };


return (
    <div className={styles.carousel}>
      <button onClick={prevSlide} className={`${styles.navButton} ${styles.prev}`}>{'<'}</button>
      <div className={styles.carouselContainer}>
        {getVisibleItems().map((item, index) => (
        //   <div key={index} className={`${styles.carouselItem} ${index === 1 ? styles.active : ''}`}>
          <div key={index} className={`${styles.carouselItem} ${index === 1 ? styles.active : ''}`} onClick={() => {invokePrompt([{role: 'user', content: item.caption}])}}>
            <div className={styles.imageWrapper}>
              <img src={item.image} alt={item.alt} className={styles.image} onClick={() => {invokePrompt([{role: 'user', content: item.caption}])}}/>
              <div className={styles.cardOverlay}>
                <div className={styles.caption}>{item.caption}</div>
                <div className={styles.description}>{item.description}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button onClick={nextSlide} className={`${styles.navButton} ${styles.next}`}>{'>'}</button>
    </div>
  );
};

export default Carousel;