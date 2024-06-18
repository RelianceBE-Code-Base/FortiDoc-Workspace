import * as React from 'react';
import { sp } from '@pnp/sp';
import '@pnp/odata';
import styles from './Announcement.module.scss'; 
const AnnouncementImg = require('./assets/Announcement.png')


interface IAnnouncement {
  ID: number;
  Title: string;
  Description: string;
  LinkUrl: string;
  ImageUrl: string; // This will hold the attachment URL
}

const Announcement: React.FC = () => {
  const [announcements, setAnnouncements] = React.useState<IAnnouncement[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchAnnouncements = async (): Promise<void> => {
      try {
        const items = await sp.web.lists.getByTitle('Announcement').items.select('ID', 'Title', 'Description', 'LinkUrl').expand('AttachmentFiles').get();

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
      <div></div>
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
          </div>
          
        ))}
        </div>
      </div>
    </div>
  );
};

export default Announcement;
