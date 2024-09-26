import * as React from 'react';
import styles from './MicrosoftApps.module.scss'; 
import PinIcon from '../PinIcon/PinIcon';
const VivaIcon = require('./assets/icons/viva.svg');


interface MicrosoftAppProps {
  pinned: boolean;
  onPinClick: () => void;
  onRemoveClick: () => void; // Correct prop name
}

const MicrosoftAppsIcon = require('./assets/MicrosoftAppsIcon.png')
const CloseIcon = require('./assets/close-square.png')

const MicrosoftApps: React.FC<MicrosoftAppProps> = ({ pinned, onPinClick, onRemoveClick }) => {

  

  return (
    <div className={styles.card} >
  <div className={styles['card-header']} >
    <img src={MicrosoftAppsIcon} style={{display: 'flex'}}/>
    <p style={{display: 'flex', justifySelf: 'center'}}>Microsoft Apps</p>
    <div style={{display: 'flex'}}>
          <PinIcon pinned={pinned} onPinClick={onPinClick} componentName={''} />
          <button className="btn btn-sm" onClick={onRemoveClick} style={{ marginLeft: '-10px' }}>
          <img src={CloseIcon} style={{display: 'flex', height: '24px', width: '24px'}}/>
          </button>
          </div>
  </div>
  <div className='card-body' style={{ marginBottom: '10px' }}>
    <div className={styles.iconGrid}>
      <a className={styles.iconLink} href="https://www.office.com" target="_blank" style={{ backgroundImage: 'url(https://img.icons8.com/fluency/144/microsoft-365.png)' }}></a>
      <a className={styles.iconLink} href="https://office.com/launch/word" target="_blank" style={{ backgroundImage: 'url(https://static2.sharepointonline.com/files/fabric/assets/brand-icons/product/png/word_96x1.png)' }}></a>
      <a className={styles.iconLink} href="https://office.com/launch/excel" target="_blank" style={{ backgroundImage: 'url(https://static2.sharepointonline.com/files/fabric/assets/brand-icons/product/png/excel_96x1.png)' }}></a>
      <a className={styles.iconLink} href="https://office.com/launch/powerpoint" target="_blank" style={{ backgroundImage: 'url(https://static2.sharepointonline.com/files/fabric/assets/brand-icons/product/png/powerpoint_96x1.png)' }}></a>
      <a className={styles.iconLink} href="https://office.com" target="_blank" style={{ backgroundImage: 'url(https://static2.sharepointonline.com/files/fabric/assets/brand-icons/product/png/access_96x1.png)' }}></a>
      <a className={styles.iconLink} href="https://office.com/launch/onenote" target="_blank" style={{ backgroundImage: 'url(https://static2.sharepointonline.com/files/fabric/assets/brand-icons/product/png/onenote_96x1.png)' }}></a>
      <a className={styles.iconLink} href="https://office.com" target="_blank" style={{ backgroundImage: 'url(https://static2.sharepointonline.com/files/fabric/assets/brand-icons/product/png/onedrive_96x1.png)' }}></a>
      <a className={styles.iconLink} href="https://www.microsoft.com/en-us/microsoft-365/project/project-management-software" target="_blank" style={{ backgroundImage: 'url(https://static2.sharepointonline.com/files/fabric/assets/brand-icons/product/png/project_96x1.png)' }}></a>
      <a className={styles.iconLink} href="https://office.live.com/start/visio.aspx" target="_blank" style={{ backgroundImage: 'url(https://static2.sharepointonline.com/files/fabric/assets/brand-icons/product/png/visio_96x1.png)' }}></a>
      <a className={styles.iconLink} href="https://outlook.office.com" target="_blank" style={{ backgroundImage: 'url(https://static2.sharepointonline.com/files/fabric/assets/brand-icons/product/png/outlook_96x1.png)' }}></a>
      <a className={styles.iconLink} href="https://teams.microsoft.com" target="_blank" style={{ backgroundImage: 'url(https://static2.sharepointonline.com/files/fabric/assets/brand-icons/product/png/teams_96x1.png)' }}></a>
      <a className={styles.iconLink} href="https://outlook.office.com/calendar" target="_blank" style={{ backgroundImage: 'url(https://img.icons8.com/color/144/outlook-calendar.png)' }}></a>
      <a className={styles.iconLink} href="https://forms.office.com" target="_blank" style={{ backgroundImage: 'url(https://img.icons8.com/color/144/microsoft-forms-2019.png)' }}></a>
      <a className={styles.iconLink} href="https://to-do.office.com" target="_blank" style={{ backgroundImage: 'url(https://img.icons8.com/color/144/microsoft-to-do-app.png)' }}></a>
      <a className={styles.iconLink} href="https://www.microsoft365.com/launch/stream?auth=2" target="_blank" style={{ backgroundImage: 'url(https://img.icons8.com/color/144/microsoft-stream-2019.png)' }}></a>
      <a className={styles.iconLink} href="https://viva.cloud.microsoft/"  target="_blank" style={{ backgroundImage: `url(${VivaIcon})` }}></a>
      <a className={styles.iconLink} href="https://outlook.office.com/people/" target="_blank" style={{ backgroundImage: 'url(https://img.icons8.com/fluency/144/microsoft-people.png)' }}></a>
      <a className={styles.iconLink} href="https://outlook.office.com/bookings" target="_blank" style={{ backgroundImage: 'url(https://img.icons8.com/fluency/144/microsoft-bookings.png)' }}></a>
    </div>
  </div>
</div>
  );
};

export default MicrosoftApps;
