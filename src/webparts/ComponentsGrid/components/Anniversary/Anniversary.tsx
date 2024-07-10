import * as React from 'react';
import { Web} from '@pnp/sp';
import '@pnp/odata';
import styles from './Anniversary.module.scss';
import PinIcon from '../PinIcon/PinIcon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindowClose } from '@fortawesome/free-solid-svg-icons';

const AnniversaryIcon = require('./assets/Anniversary.png');

interface MicrosoftAnniversaryProps {
  pinned: boolean;
  onPinClick: () => void;
  onRemoveClick: () => void; // Correct prop name
  tenantUrl: string; // Add tenantUrl as a prop
}

interface IAnniversary {
  ID: number;
  FirstName: string;
  LastName: string;
  ResumptionDate: string;
  Designation: string;
}

const Anniversary: React.FC<MicrosoftAnniversaryProps> = ({ pinned, onPinClick, onRemoveClick,tenantUrl }) => {
  const [anniversaries, setAnniversaries] = React.useState<IAnniversary[]>([]);
  const [error, setError] = React.useState<string | null>(null);

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
        const items = await list.items.select('ID', 'FirstName', 'LastName', 'ResumptionDate', 'Designation').get();
        setAnniversaries(items);
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
    } else if (thisYearAnniversary.getTime() > today.getTime()) {
      return 'next';
    }
    return '';
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
          <FontAwesomeIcon onClick={onRemoveClick} icon={faWindowClose} size='sm' color="red" style={{margin: '5px', cursor: 'pointer'}}/>
          </div>
      </div>
      <div className={styles['Anniversary-content']}>
        <div className={styles['card-body']}>
          {anniversaries.map((anniversary, index) => {
            const anniversaryStatus = determineAnniversaryStatus(anniversary.ResumptionDate);
            const isToday = anniversaryStatus === 'today';
            const isNext = anniversaryStatus === 'next';
            const years = calculateYears(anniversary.ResumptionDate);

            return (
              <div
                key={anniversary.ID}
                className={`${styles.event} ${(styles as { [key: string]: string })[`eventColor${index % 4 + 1}`]} ${isToday ? styles.today : ''}`}
              >
                <div className={styles.date}>
                  <span className={styles.day}>{new Date(anniversary.ResumptionDate).getDate()}</span>
                  <span className={styles.month}>{new Date(anniversary.ResumptionDate).toLocaleString('default', { month: 'short' })}</span>
                </div>
                <div className={styles.details}>
                  <div className={styles.title}>{isToday ? `Happy ${years} years anniversary!` : `${anniversary.FirstName} ${anniversary.LastName}`}</div>
                  <div className={styles.venue}>
                    {isToday ? `${anniversary.FirstName} ${anniversary.LastName}` : (isNext ? anniversary.Designation : anniversary.Designation)}
                  </div>
                  <div className={styles.designation}>
                    {isToday ? anniversary.Designation : (isNext ? 'Next Anniversary' : '')}
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
