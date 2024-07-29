import * as React from 'react';
import pinImage from './assets/PinIcon.png';

interface PinIconProps {
  componentName: string;
  onPinClick: () => void;
  pinned: boolean;
}

const PinIcon: React.FC<PinIconProps> = ({ componentName, onPinClick, pinned }) => {
  const togglePin = async () => {
    onPinClick();
  };

  return (
    <span onClick={togglePin} style={{ cursor: 'pointer' }}>
      <img src={pinImage} alt={pinned ? 'Pinned' : 'Not pinned'} style={{ width: '24px', height: '24px' }} />
    </span>
  );
};

export default PinIcon;
