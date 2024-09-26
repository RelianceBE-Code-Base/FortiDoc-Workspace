import * as React from 'react';
import { Web } from '@pnp/sp';
import '@pnp/odata';
import styles from './CompanyEvents.module.scss';
import PinIcon from '../PinIcon/PinIcon';

const CloseIcon = require('./assets/close-square.png')
const EventsImg = require('./assets/Events.png');

interface MicrosoftEventProps {
  pinned: boolean;
  onPinClick: () => void;
  onRemoveClick: () => void;
  tenantUrl: string;
}

interface ICompanyEvent {
  ID: number;
  Title: string;
  Location: string;
  EventDate: string;
  EndDate: string;
}

const CompanyEvents: React.FC<MicrosoftEventProps> = ({ pinned, onPinClick, onRemoveClick, tenantUrl }) => {
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
        const items = await list.items
          .select('ID', 'Title', 'Location', 'EventDate', 'EndDate')
          .orderBy('EventDate', true)
          .top(50)
          .get();

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const filteredAndSortedEvents = items
          .filter(event => new Date(event.EventDate) >= today)
          .sort((a, b) => new Date(a.EventDate).getTime() - new Date(b.EventDate).getTime())
          .slice(0, 15);

        setEvents(filteredAndSortedEvents);
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
          <button className="btn btn-sm" onClick={onRemoveClick} style={{ marginLeft: '-10px' }}>
          <img src={CloseIcon} style={{display: 'flex', height: '24px', width: '24px'}}/>
          </button>
        </div>
      </div>
      <div className={styles['Events-content']}>
        <div className={styles['card-body']}>
        {events.length == 0 && <p style={{alignSelf: 'center', fontWeight: 'bold', justifySelf: 'center'}}>No upcoming events</p>}
          {events.map((event, index) => (
            <div key={index} className={`${styles.event} ${(styles as { [key: string]: string })[`eventColor${index % 4 + 1}`]}`}>
              <div className={`${styles.date} ${(styles as { [key: string]: string })[`dateColor${index % 4 + 1}`]}`}>
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