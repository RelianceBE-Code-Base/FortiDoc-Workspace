import * as React from 'react';
import { Web} from '@pnp/sp';
import '@pnp/odata';
import styles from './Announcement.module.scss'; 
import PinIcon from '../PinIcon/PinIcon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindowClose } from '@fortawesome/free-solid-svg-icons';

const AnnouncementImg = require('./assets/Announcement.png')

interface MicrosoftAnnouncementProps {
  pinned: boolean;
  onPinClick: () => void;
  onRemove: () => void;
}

interface IAnnouncement {
  ID: number;
  Title: string;
  Description: string;
  LinkUrl: string;
  ImageUrl: string; // This will hold the attachment URL
}

const Announcement: React.FC<MicrosoftAnnouncementProps> = ({ pinned, onPinClick, onRemove }) => {
  const [announcements, setAnnouncements] = React.useState<IAnnouncement[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchAnnouncements = async (): Promise<void> => {
      try {
        const listName = 'Announcement';
        const tenantUrl = 'https://microdev.sharepoint.com/sites/IntranetPortal2'; // Replace with your tenant-specific URL
        const web = new Web(tenantUrl);
        const list = await web.lists.getByTitle(listName);
        if (!list) {
          console.error(`List '${listName}' does not exist`);
          return;
        }
        const items = await list.items.select('ID', 'Title', 'Description', 'LinkUrl').expand('AttachmentFiles').get();

        // Fetch attachments for each item
        const itemsWithAttachments = items.map(item => ({
          ...item,
          ImageUrl: item.AttachmentFiles.length > 0 ? item.AttachmentFiles[0].ServerRelativeUrl : '', // Use the first attachment as the image
        }));

        setAnnouncements(itemsWithAttachments);
      } catch (error) {
        console.error('Error fetching announcements:', error);
        setError('Failed to load announcements.');
      }
    };

    fetchAnnouncements().catch(error => console.error('Error in fetchAnnouncements:', error));
  }, []);

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.card}>
      <div className={styles['card-header']}>
      <img src={AnnouncementImg}/>
      <p style={{display: 'flex', justifySelf: 'center'}}> Announcement</p>
      <div style={{display: 'flex'}}>
          <PinIcon pinned={pinned} onPinClick={onPinClick} componentName={''} />
          <FontAwesomeIcon onClick={onRemove} icon={faWindowClose} size='sm' color="red" style={{margin: '5px', cursor: 'pointer'}}/>
          </div>
      </div>
        <div className={styles['Announcement-content']}>
        <div className={styles['card-body']}> 
        {announcements.map((announcement, index) => (
          <div key={index} className={styles.announcement}>
            <div className={styles.productLaunch}>{announcement.Title}</div>
            <p className={styles.Description}>{announcement.Description}</p>
            <div className={styles.medizee}>
              {announcement.ImageUrl && (
                <a href={announcement.LinkUrl} target="_blank" rel="noopener noreferrer">
                  <img src={announcement.ImageUrl} alt={announcement.Title} className={styles.image} />
                </a>
              )}
            </div>
            <p className={styles.Description}> ==================[ END ]==================</p>
          </div>
          
        ))}
        </div>
      </div>
    </div>
  );
};

export default Announcement;
