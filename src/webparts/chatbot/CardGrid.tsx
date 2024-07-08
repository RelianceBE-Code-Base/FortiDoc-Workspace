import React from 'react';
import styles from './CardGrid.module.scss';

interface CardProps {
  icon: string;
  title: string;
  description: string;
  onClick: (description: string) => void;
}

const Card: React.FC<CardProps> = ({ icon, title, description, onClick }) => (
  <div className={styles.card} onClick={() => onClick(description)}>
    <div className={styles.cardIcon}>{icon}</div>
    <h3 className={styles.cardTitle}>{title}</h3>
    <p className={styles.cardDescription}>{description}</p>
  </div>
);

const CardGrid: React.FC = () => {
  const handleClick = (description: string) => {
    console.log(`Card clicked: ${description}`);
    // You can add more logic here, such as updating state or calling an API
  };

  const cards: Omit<CardProps, 'onClick'>[] = [
    { icon: '💡', title: 'Generate blog ideas', description: "Create a list of engaging blog post ideas for our company's tech blog." },
    { icon: '📊', title: 'Suggest data visualizations', description: 'Propose creative ways to visualize our quarterly sales data for the board meeting.' },
    { icon: '🎨', title: 'Design social media posts', description: 'Develop concepts for a series of Instagram posts to promote our new product line.' },
    { icon: '📝', title: 'Write email templates', description: 'Draft templates for customer onboarding emails to improve engagement.' },
    { icon: '🎭', title: 'Create persona profiles', description: 'Generate detailed buyer personas for our target market segments.' },
    { icon: '🚀', title: 'Brainstorm campaign ideas', description: 'Generate creative marketing campaign ideas for our new product launch.' },
  ];

  return (
    <div className={styles.cardGrid}>
      {cards.map((card, index) => (
        <Card key={index} {...card} onClick={handleClick} />
      ))}
      <div className={styles.emptyCard}></div>
      <div className={styles.emptyCard}></div>
      <div className={styles.emptyCard}></div>
    </div>
  );
};

export default CardGrid;