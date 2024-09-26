import * as React from 'react';
import { Web } from '@pnp/sp';
import '@pnp/odata';
import styles from './Anniversary.module.scss';
import PinIcon from '../PinIcon/PinIcon';

const AnniversaryIcon = require('./assets/Anniversary.png');
const CloseIcon = require('./assets/close-square.png')

interface MicrosoftAnniversaryProps {
  pinned: boolean;
  onPinClick: () => void;
  onRemoveClick: () => void;
  tenantUrl: string;
}

interface IAnniversary {
  ID: number;
  FirstName: string;
  LastName: string;
  ResumptionDate: string;
  Designation: string;
}

const Anniversary: React.FC<MicrosoftAnniversaryProps> = ({ pinned, onPinClick, onRemoveClick, tenantUrl }) => {
  const [anniversaries, setAnniversaries] = React.useState<IAnniversary[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  const sortAndFilterAnniversaries = (anniversaries: IAnniversary[]): IAnniversary[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return anniversaries
      .map(anniversary => ({
        ...anniversary,
        sortDate: new Date(new Date(anniversary.ResumptionDate).setFullYear(today.getFullYear()))
      }))
      .sort((a, b) => {
        if (a.sortDate < today) a.sortDate.setFullYear(today.getFullYear() + 1);
        if (b.sortDate < today) b.sortDate.setFullYear(today.getFullYear() + 1);
        return a.sortDate.getTime() - b.sortDate.getTime();
      })
      .slice(0, 20);
  };

  React.useEffect(() => {
    const fetchAnniversaries = async (): Promise<void> => {
      try {
        const listName = 'Staff Details';
        const web = new Web(tenantUrl);
        const list = await web.lists.getByTitle(listName);
        if (!list) {
          console.error(`List '${listName}' does not exist`);
          return;
        }
        const items = await list.items.select('ID', 'FirstName', 'LastName', 'ResumptionDate', 'Designation').getAll();
        const sortedAndFilteredAnniversaries = sortAndFilterAnniversaries(items);
        setAnniversaries(sortedAndFilteredAnniversaries);
      } catch (error) {
        console.error('Error fetching anniversaries:', error);
        setError('Failed to load anniversaries.');
      }
    };

    fetchAnniversaries().catch(error => console.error('Error in fetchAnniversaries:', error));
  }, []);

  const determineAnniversaryStatus = (resumptionDate: string): string => {
    const today = new Date();
    const resumption = new Date(resumptionDate);
    const thisYearAnniversary = new Date(today.getFullYear(), resumption.getMonth(), resumption.getDate());

    if (thisYearAnniversary.toDateString() === today.toDateString()) {
      return 'today';
    } else if (thisYearAnniversary > today) {
      return 'upcoming';
    }
    return 'past';
  };

  const calculateYears = (resumptionDate: string): number => {
    const today = new Date();
    const resumption = new Date(resumptionDate);
    return today.getFullYear() - resumption.getFullYear();
  };

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.card}>
      <div className={styles['card-header']}>
        <img src={AnniversaryIcon} style={{ display: 'flex' }} />
        <p style={{ display: 'flex', justifySelf: 'center' }}>Anniversaries</p>
        <div style={{display: 'flex'}}>
          <PinIcon pinned={pinned} onPinClick={onPinClick} componentName={''} />
          <button className="btn btn-sm" onClick={onRemoveClick} style={{ marginLeft: '-10px' }}>
          <img src={CloseIcon} style={{display: 'flex', height: '24px', width: '24px'}}/>
          </button>
        </div>
      </div>
      <div className={styles['Anniversary-content']}>
        <div className={styles['card-body']}>
          {anniversaries.map((anniversary, index) => {
            const anniversaryStatus = determineAnniversaryStatus(anniversary.ResumptionDate);
            const isToday = anniversaryStatus === 'today';
            const isUpcoming = anniversaryStatus === 'upcoming';
            const years = calculateYears(anniversary.ResumptionDate);

            return (
              <div
                key={anniversary.ID}
                className={`${styles.event} ${(styles as { [key: string]: string })[`eventColor${index % 4 + 1}`]}`}
              >
                <div className={`${styles.date} ${(styles as { [key: string]: string })[`dateColor${index % 4 + 1}`]} ${isToday ? styles.today : ''}`}>
                  <span className={styles.day}>{new Date(anniversary.ResumptionDate).getDate()}</span>
                  <span className={styles.month}>{new Date(anniversary.ResumptionDate).toLocaleString('default', { month: 'short' })}</span>
                </div>
                <div className={styles.details}>
                  <div className={styles.title}>{isToday ? `Happy ${years} years anniversary!` : `${anniversary.FirstName} ${anniversary.LastName}`}</div>
                  <div className={styles.venue}>
                    {isToday ? `${anniversary.FirstName} ${anniversary.LastName}` : (isUpcoming ? anniversary.Designation : anniversary.Designation)}
                  </div>
                  <div className={styles.designation}>
                    {isToday ? anniversary.Designation : (isUpcoming ? 'Upcoming Anniversary' : '')}
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

export default Anniversary;