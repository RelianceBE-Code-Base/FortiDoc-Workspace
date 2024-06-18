import * as React from 'react';
import { sp } from '@pnp/sp';
import '@pnp/odata';
import styles from './Announcement.module.scss'; 


interface IAnnouncement {
  Title: string;
  Description: string;
  ImageUrl: string;
  LinkUrl: string;
}

const Announcement: React.FC = () => {
  const [announcements, setAnnouncements] = React.useState<IAnnouncement[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchAnnouncements = async (): Promise<void> => {
      try {
        const items: IAnnouncement[] = await sp.web.lists.getByTitle('Announcement').items.select('Title', 'Description', 'ImageUrl', 'LinkUrl').get();
        setAnnouncements(items);
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
        {/* <i className={`ms-Icon ms-Icon--Megaphone ${styles.icon}`} aria-hidden="true"></i> */}
        Announcement
      </div>
      <div className={styles['card-body']}>
        {announcements.map((announcement, index) => (
          <div key={index} className={styles.announcement}>
            <div className={styles.productLaunch}>{announcement.Title}</div>
            
            <p className={styles.Description}>{announcement.Description}</p>
            <div className={styles.medizee}>
            <a href={announcement.LinkUrl}>
              <img src={announcement.ImageUrl} alt={announcement.Title} className={styles.image} />  
              </a>
            </div> 
          </div>
        ))}
      </div>
    </div>
  );
};

export default Announcement;
