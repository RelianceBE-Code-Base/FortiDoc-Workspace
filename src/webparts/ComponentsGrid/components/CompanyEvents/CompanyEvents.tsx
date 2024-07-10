import * as React from 'react';
import { Web } from '@pnp/sp';
import '@pnp/odata';
import styles from './CompanyEvents.module.scss';
import PinIcon from '../PinIcon/PinIcon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindowClose } from '@fortawesome/free-solid-svg-icons';

const EventsImg = require('./assets/Events.png');

interface MicrosoftEventProps {
  pinned: boolean;
  onPinClick: () => void;
  onRemoveClick: () => void; // Correct prop name
  tenantUrl: string;
}

interface ICompanyEvent {
  ID: number;
  Title: string;
  Location: string;
  EventDate: string;
  EndDate: string;
}

const CompanyEvents: React.FC<MicrosoftEventProps> = ({ pinned, onPinClick, onRemoveClick, tenantUrl }) => { // Correct prop name
  const [events, setEvents] = React.useState<ICompanyEvent[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchEvents = async (): Promise<void> => {
      try {
        const listName = 'Events';
        const web = new Web(tenantUrl);
        const list = await web.lists.getByTitle(listName);
        if (!list) {
          console.error(`List '${listName}' does not exist`);
          return;
        }
        const items = await list.items.select('ID', 'Title', 'Location', 'EventDate', 'EndDate').get();
        setEvents(items);
      } catch (error) {
        console.error('Error fetching events:', error);
        setError('Failed to load events.');
      }
    };

    fetchEvents().catch(error => console.error('Error in fetchEvents:', error));
  }, [tenantUrl]);

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.card}>
      <div className={styles['card-header']}>
        <img src={EventsImg} />
        <p style={{ display: 'flex', justifySelf: 'center' }}>Company Events</p>
        <div style={{ display: 'flex' }}>
          <PinIcon pinned={pinned} onPinClick={onPinClick} componentName={''} />
          <FontAwesomeIcon onClick={onRemoveClick} icon={faWindowClose} size='sm' color="red" style={{ margin: '5px', cursor: 'pointer' }} />
        </div>
      </div>
      <div className={styles['Events-content']}>
        <div className={styles['card-body']}>
          {events.map((event, index) => (
            <div key={index} className={`${styles.event} ${(styles as { [key: string]: string })[`eventColor${index % 4 + 1}`]}`}>
              <div className={styles.date}>
                <span className={styles.day}>{new Date(event.EventDate).getDate()}</span>
                <span className={styles.month}>{new Date(event.EventDate).toLocaleString('default', { month: 'short' })}</span>
              </div>
              <div className={styles.details}>
                <div className={styles.title}>{event.Title}</div>
                <div className={styles.venue}>Venue: {event.Location}</div>
                <div className={styles.time}>
                  {new Date(event.EventDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(event.EndDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompanyEvents;
