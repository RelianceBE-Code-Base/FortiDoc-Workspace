import * as React from 'react';
import { Web} from '@pnp/sp';
import '@pnp/odata';
import styles from './Birthday.module.scss';

const BirthdayIcon = require('./assets/Birthday.png');

interface IBirthday {
  ID: number;
  FirstName: string;
  LastName: string;
  DateOfBirth: string;
  Designation: string;
}

const Birthday: React.FC = () => {
  const [birthdays, setBirthdays] = React.useState<IBirthday[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchBirthdays = async (): Promise<void> => {
      try {
        const listName = 'Staff Details';
        const tenantUrl = 'https://microdev.sharepoint.com/sites/IntranetPortal2'; // Replace with your tenant-specific URL
        const web = new Web(tenantUrl);
        const list = await web.lists.getByTitle(listName);
        if (!list) {
          console.error(`List '${listName}' does not exist`);
          return;
        }
        const items = await list.items.select('ID', 'FirstName', 'LastName', 'DateOfBirth', 'Designation').get();
        setBirthdays(items);
      } catch (error) {
        console.error('Error fetching birthdays:', error);
        setError('Failed to load birthdays.');
      }
    };
      
    fetchBirthdays().catch(error => console.error('Error in fetchBirthdays:', error));
  }, []);

  const determineBirthdayStatus = (dateOfBirth: string): string => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    const thisYearBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());

    if (thisYearBirthday.toDateString() === today.toDateString()) {
      return 'today';
    } else if (thisYearBirthday.getTime() > today.getTime()) {
      return 'next';
    }
    return '';
  };

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.card}>
      <div className={styles['card-header']}>
        <img src={BirthdayIcon} style={{ display: 'flex' }} />
        <p style={{ display: 'flex', justifySelf: 'center' }}>Birthdays</p>
        <div></div>
      </div>
      <div className={styles['Birthday-content']}>
        <div className={styles['card-body']}>
          {birthdays.map((birthday, index) => {
            const birthdayStatus = determineBirthdayStatus(birthday.DateOfBirth);
            const isToday = birthdayStatus === 'today';
            const isNext = birthdayStatus === 'next';
            return (
              <div
                key={birthday.ID}
                className={`${styles.event} ${(styles as { [key: string]: string })[`eventColor${index % 4 + 1}`]} ${isToday ? styles.today : ''}`}
              >
                <div className={styles.date}>
                  <span className={styles.day}>{new Date(birthday.DateOfBirth).getDate()}</span>
                  <span className={styles.month}>{new Date(birthday.DateOfBirth).toLocaleString('default', { month: 'short' })}</span>
                </div>
                <div className={styles.details}>
                  <div className={styles.title}>{isToday ? 'Happy Birthday To You!' : `${birthday.FirstName} ${birthday.LastName}`}</div>
                  <div className={styles.venue}>
                    {isToday ? `${birthday.FirstName} ${birthday.LastName}` : (isNext ? birthday.Designation : birthday.Designation)}
                  </div>
                  <div className={styles.designation}>
                    {isToday ? birthday.Designation : (isNext ? 'Next Birthday' : '')}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Birthday;
