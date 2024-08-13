import * as React from 'react';
import pinnedIcon from './assets/PinIcon.png';
import unpinnedIcon from './assets/UnPinIcon.png';

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
      <img src={pinned ? pinnedIcon : unpinnedIcon} alt={pinned ? 'Pinned' : 'Unpinned'} style={{height: '25px', width: '24px'}}/>
    </span>
  );
};

export default PinIcon;
