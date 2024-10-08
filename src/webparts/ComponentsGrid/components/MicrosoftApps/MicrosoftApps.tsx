import * as React from 'react';
import styles from './MicrosoftApps.module.scss'; 
import PinIcon from '../PinIcon/PinIcon';
const VivaIcon = require('./assets/icons/viva.svg');

interface MicrosoftAppProps {
  pinned: boolean;
  onPinClick: () => void;
  onRemoveClick: () => void;
}

const MicrosoftAppsIcon = require('./assets/MicrosoftAppsIcon.png')
const CloseIcon = require('./assets/close-square.png')

const AppIcon: React.FC<{ href: string; style: React.CSSProperties; appName: string }> = ({ href, style, appName }) => (
  <a 
    className={styles.iconLink} 
    href={href} 
    target="_blank" 
    style={style}
    title={appName}
  ></a>
);

const MicrosoftApps: React.FC<MicrosoftAppProps> = ({ pinned, onPinClick, onRemoveClick }) => {
  return (
    <div className={styles.card}>
      <div className={styles['card-header']}>
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
          <AppIcon href="https://www.office.com" style={{ backgroundImage: 'url(https://img.icons8.com/fluency/144/microsoft-365.png)' }} appName="Microsoft 365" />
          <AppIcon href="https://office.com/launch/word" style={{ backgroundImage: 'url(https://static2.sharepointonline.com/files/fabric/assets/brand-icons/product/png/word_96x1.png)' }} appName="Word" />
          <AppIcon href="https://office.com/launch/excel" style={{ backgroundImage: 'url(https://static2.sharepointonline.com/files/fabric/assets/brand-icons/product/png/excel_96x1.png)' }} appName="Excel" />
          <AppIcon href="https://office.com/launch/powerpoint" style={{ backgroundImage: 'url(https://static2.sharepointonline.com/files/fabric/assets/brand-icons/product/png/powerpoint_96x1.png)' }} appName="PowerPoint" />
          <AppIcon href="https://office.com" style={{ backgroundImage: 'url(https://static2.sharepointonline.com/files/fabric/assets/brand-icons/product/png/access_96x1.png)' }} appName="Access" />
          <AppIcon href="https://office.com/launch/onenote" style={{ backgroundImage: 'url(https://static2.sharepointonline.com/files/fabric/assets/brand-icons/product/png/onenote_96x1.png)' }} appName="OneNote" />
          <AppIcon href="https://office.com" style={{ backgroundImage: 'url(https://static2.sharepointonline.com/files/fabric/assets/brand-icons/product/png/onedrive_96x1.png)' }} appName="OneDrive" />
          <AppIcon href="https://www.microsoft.com/en-us/microsoft-365/project/project-management-software" style={{ backgroundImage: 'url(https://static2.sharepointonline.com/files/fabric/assets/brand-icons/product/png/project_96x1.png)' }} appName="Project" />
          <AppIcon href="https://office.live.com/start/visio.aspx" style={{ backgroundImage: 'url(https://static2.sharepointonline.com/files/fabric/assets/brand-icons/product/png/visio_96x1.png)' }} appName="Visio" />
          <AppIcon href="https://outlook.office.com" style={{ backgroundImage: 'url(https://static2.sharepointonline.com/files/fabric/assets/brand-icons/product/png/outlook_96x1.png)' }} appName="Outlook" />
          <AppIcon href="https://teams.microsoft.com" style={{ backgroundImage: 'url(https://static2.sharepointonline.com/files/fabric/assets/brand-icons/product/png/teams_96x1.png)' }} appName="Teams" />
          <AppIcon href="https://outlook.office.com/calendar" style={{ backgroundImage: 'url(https://img.icons8.com/color/144/outlook-calendar.png)' }} appName="Calendar" />
          <AppIcon href="https://forms.office.com" style={{ backgroundImage: 'url(https://img.icons8.com/color/144/microsoft-forms-2019.png)' }} appName="Forms" />
          <AppIcon href="https://to-do.office.com" style={{ backgroundImage: 'url(https://img.icons8.com/color/144/microsoft-to-do-app.png)' }} appName="To Do" />
          <AppIcon href="https://www.microsoft365.com/launch/stream?auth=2" style={{ backgroundImage: 'url(https://img.icons8.com/color/144/microsoft-stream-2019.png)' }} appName="Stream" />
          <AppIcon href="https://viva.cloud.microsoft/" style={{ backgroundImage: `url(${VivaIcon})` }} appName="Viva" />
          <AppIcon href="https://outlook.office.com/people/" style={{ backgroundImage: 'url(https://img.icons8.com/fluency/144/microsoft-people.png)' }} appName="People" />
          <AppIcon href="https://outlook.office.com/bookings" style={{ backgroundImage: 'url(https://img.icons8.com/fluency/144/microsoft-bookings.png)' }} appName="Bookings" />
        </div>
      </div>
    </div>
  );
};

export default MicrosoftApps;