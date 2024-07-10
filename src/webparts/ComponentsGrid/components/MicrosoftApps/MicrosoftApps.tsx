import * as React from 'react';
import styles from './MicrosoftApps.module.scss'; 
import PinIcon from '../PinIcon/PinIcon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindowClose } from '@fortawesome/free-solid-svg-icons';

interface MicrosoftAppProps {
  pinned: boolean;
  onPinClick: () => void;
  onRemoveClick: () => void; // Correct prop name
}

const MicrosoftAppsIcon = require('./assets/MicrosoftAppsIcon.png')

const MicrosoftApps: React.FC<MicrosoftAppProps> = ({ pinned, onPinClick, onRemoveClick }) => {

  

  return (
    <div className={styles.card} >
  <div className={styles['card-header']} >
    <img src={MicrosoftAppsIcon} style={{display: 'flex'}}/>
    <p style={{display: 'flex', justifySelf: 'center'}}>Microsoft Apps</p>
    <div style={{display: 'flex'}}>
          <PinIcon pinned={pinned} onPinClick={onPinClick} componentName={''} />
          <FontAwesomeIcon onClick={onRemoveClick} icon={faWindowClose} size='sm' color="red" style={{margin: '5px', cursor: 'pointer'}}/>
          </div>
  </div>
  <div className='card-body' style={{ marginBottom: '10px' }}>
    <div className={styles.iconGrid}>
      <a className={styles.iconLink} href="https://office.com" target="_blank" style={{ backgroundImage: 'url(https://static2.sharepointonline.com/files/fabric/assets/brand-icons/product/png/office_96x1.png)' }}></a>
      <a className={styles.iconLink} href="https://office.com/launch/word" target="_blank" style={{ backgroundImage: 'url(https://static2.sharepointonline.com/files/fabric/assets/brand-icons/product/png/word_96x1.png)' }}></a>
      <a className={styles.iconLink} href="https://office.com/launch/excel" target="_blank" style={{ backgroundImage: 'url(https://static2.sharepointonline.com/files/fabric/assets/brand-icons/product/png/excel_96x1.png)' }}></a>
      <a className={styles.iconLink} href="https://office.com/launch/powerpoint" target="_blank" style={{ backgroundImage: 'url(https://static2.sharepointonline.com/files/fabric/assets/brand-icons/product/png/powerpoint_96x1.png)' }}></a>
      <a className={styles.iconLink} href="https://office.com" target="_blank" style={{ backgroundImage: 'url(https://static2.sharepointonline.com/files/fabric/assets/brand-icons/product/png/access_96x1.png)' }}></a>
      <a className={styles.iconLink} href="https://office.com/launch/onenote" target="_blank" style={{ backgroundImage: 'url(https://static2.sharepointonline.com/files/fabric/assets/brand-icons/product/png/onenote_96x1.png)' }}></a>
      <a className={styles.iconLink} href="https://office.com" target="_blank" style={{ backgroundImage: 'url(https://static2.sharepointonline.com/files/fabric/assets/brand-icons/product/png/onedrive_96x1.png)' }}></a>
      <a className={styles.iconLink} href="https://www.microsoft.com/en-us/microsoft-365/project/project-management-software" target="_blank" style={{ backgroundImage: 'url(https://static2.sharepointonline.com/files/fabric/assets/brand-icons/product/png/project_96x1.png)' }}></a>
      <a className={styles.iconLink} href="https://office.live.com/start/visio.aspx" target="_blank" style={{ backgroundImage: 'url(https://static2.sharepointonline.com/files/fabric/assets/brand-icons/product/png/visio_96x1.png)' }}></a>
    </div>
  </div>
</div>

  );
};

export default MicrosoftApps;
