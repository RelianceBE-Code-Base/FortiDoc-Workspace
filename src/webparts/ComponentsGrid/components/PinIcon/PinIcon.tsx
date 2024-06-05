// PinIcon.tsx
import * as React from 'react';

interface PinIconProps {
  pinned: boolean;
  onPinClick: () => void;
}

const PinIcon: React.FC<PinIconProps> = ({ pinned, onPinClick }) => {
  return (
    <span onClick={onPinClick} style={{ cursor: 'pointer' }}>
      {pinned ? '📌' : '📍'}
    </span>
  );
};

export default PinIcon;
