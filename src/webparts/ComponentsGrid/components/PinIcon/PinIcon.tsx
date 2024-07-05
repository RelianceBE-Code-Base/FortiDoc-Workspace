import * as React from 'react';

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
      {pinned? '📌' : '📍'}
    </span>
  );
};

export default PinIcon;
