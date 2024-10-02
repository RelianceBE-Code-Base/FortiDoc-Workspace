import * as React from 'react';
import { Web } from '@pnp/sp';
import '@pnp/odata';
import styles from './Announcement.module.scss';
import PinIcon from '../PinIcon/PinIcon';

const AnnouncementImg = require('./assets/Announcement.png');
const CloseIcon = require('./assets/close-square.png');

interface MicrosoftAnnouncementProps {
  pinned: boolean;
  onPinClick: () => void;
  onRemoveClick: () => void;
  tenantUrl: string;
}

interface IAnnouncement {
  ID: number;
  Title: string;
  Description: string;
  LinkUrl: string;
  ImageUrl: string;
}

const Announcement: React.FC<MicrosoftAnnouncementProps> = ({ pinned, onPinClick, onRemoveClick, tenantUrl }) => {
  const [announcements, setAnnouncements] = React.useState<IAnnouncement[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [viewMode, setViewMode] = React.useState<'list' | 'card'>('list'); // Default to 'list'
  const [isDropdownVisible, setDropdownVisible] = React.useState<boolean>(false);

  React.useEffect(() => {
    const fetchAnnouncements = async (): Promise<void> => {
      try {
        const listName = 'Announcement';
        const web = new Web(tenantUrl);
        const list = await web.lists.getByTitle(listName);
        if (!list) {
          console.error(`List '${listName}' does not exist`);
          return;
        }
        const items = await list.items.select('ID', 'Title', 'Description', 'LinkUrl').expand('AttachmentFiles').get();

        const itemsWithAttachments = items.map(item => ({
          ...item,
          ImageUrl: item.AttachmentFiles.length > 0 ? item.AttachmentFiles[0].ServerRelativeUrl : '',
        }))

        itemsWithAttachments.reverse()

        setAnnouncements(itemsWithAttachments);
      } catch (error) {
        console.error('Error fetching announcements:', error);
        setError('Failed to load announcements.');
      }
    };

    fetchAnnouncements().catch(error => console.error('Error in fetchAnnouncements:', error));
  }, [tenantUrl]);

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  const handleViewModeChange = (mode: 'list' | 'card') => {
    setViewMode(mode);
    setDropdownVisible(false);
  };

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.card}>
      <div className={styles['card-header']}>
        <img src={AnnouncementImg} onClick={toggleDropdown} style={{ cursor: 'pointer' }} />
        <p style={{ display: 'flex', justifySelf: 'center' }}> Announcement</p>
        <div style={{ display: 'flex' }}>
          <PinIcon pinned={pinned} onPinClick={onPinClick} componentName={''} />
          <button className="btn btn-sm" onClick={onRemoveClick} style={{ marginLeft: '-10px' }}>
            <img src={CloseIcon} style={{ display: 'flex', height: '24px', width: '24px' }} />
          </button>
          {isDropdownVisible && (
            <div className={styles.dropdown}>
              <button className={styles.dropdownItem} onClick={() => handleViewModeChange('list')}>List View</button>
              <button className={styles.dropdownItem} onClick={() => handleViewModeChange('card')}>Card View</button>
            </div>
          )}
        </div>
      </div>
      <div className={styles['Announcement-content']}>
        <div className={styles['card-body']}>
          {announcements.map((announcement, index) => (
            <div key={index} className={`${styles.announcement} ${viewMode === 'list' ? styles.listView : styles.cardView}`}>
              <div onClick={() => window.open(announcement.LinkUrl, "_blank")} className={styles.textWrapper}>
              <div className={styles.productLaunch}>{announcement.Title}</div>
              <p className={styles.Description}>{announcement.Description}</p>
              {viewMode === 'card' && announcement.ImageUrl && (
                <div className={styles.medizee}>
                    <img src={announcement.ImageUrl} alt={announcement.Title} className={styles.image} />
                  
                </div>
              )}
              </div>
              <hr className={styles.separator} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Announcement;