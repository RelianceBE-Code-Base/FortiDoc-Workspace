import * as React from 'react';
import { Web } from '@pnp/sp';
import '@pnp/odata';
import styles from './Birthday.module.scss';
import PinIcon from '../PinIcon/PinIcon';

const BirthdayIcon = require('./assets/Birthday.png');
const CloseIcon = require('./assets/close-square.png')

interface MicrosoftBirthdayProps {
  pinned: boolean;
  onPinClick: () => void;
  onRemoveClick: () => void;
  tenantUrl: string;
}

interface IBirthday {
  ID: number;
  FirstName: string;
  LastName: string;
  DateOfBirth: string;
  Designation: string;
}

const Birthday: React.FC<MicrosoftBirthdayProps> = ({ pinned, onPinClick, onRemoveClick, tenantUrl }) => {
  const [birthdays, setBirthdays] = React.useState<IBirthday[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  const sortAndFilterBirthdays = (birthdays: IBirthday[]): IBirthday[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return birthdays
      .map(birthday => ({
        ...birthday,
        sortDate: new Date(new Date(birthday.DateOfBirth).setFullYear(today.getFullYear()))
      }))
      .sort((a, b) => {
        if (a.sortDate < today) a.sortDate.setFullYear(today.getFullYear() + 1);
        if (b.sortDate < today) b.sortDate.setFullYear(today.getFullYear() + 1);
        return a.sortDate.getTime() - b.sortDate.getTime();
      })
      .slice(0, 20);
  };

  React.useEffect(() => {
    const fetchBirthdays = async (): Promise<void> => {
      try {
        const listName = 'Staff Details';
        const web = new Web(tenantUrl);
        const list = await web.lists.getByTitle(listName);
        if (!list) {
          console.error(`List '${listName}' does not exist`);
          return;
        }
        const items = await list.items.select('ID', 'FirstName', 'LastName', 'DateOfBirth', 'Designation').getAll();
        const sortedAndFilteredBirthdays = sortAndFilterBirthdays(items);
        setBirthdays(sortedAndFilteredBirthdays);
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
        <div style={{display: 'flex'}}>
          <PinIcon pinned={pinned} onPinClick={onPinClick} componentName={''} />
          <button className="btn btn-sm" onClick={onRemoveClick} style={{ marginLeft: '-10px' }}>
          <img src={CloseIcon} style={{display: 'flex', height: '24px', width: '24px'}}/>
          </button>
        </div>
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
                <div className={`${styles.date} ${(styles as { [key: string]: string })[`dateColor${index % 4 + 1}`]}`}>
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