import * as React from 'react';
import { useState, useEffect } from 'react';
import { MSGraphClientV3 } from '@microsoft/sp-http';
import styles from './Calendar.module.scss';
import './Calendar.module.scss';
import PinIcon from '../PinIcon/PinIcon';

const CalendarIcon = require('./assets/CalendarIcon.png');
const CloseIcon = require('./assets/close-square.png')

interface CalendarProps {
  graphClient: MSGraphClientV3;
  pinned: boolean;
  onPinClick: () => void;
  onRemoveClick: () => void;
}

interface Event {
  id: string;
  subject: string;
  start: { dateTime: string; timeZone: string };
  end: { dateTime: string; timeZone: string };
  location: { displayName: string };
  organizer: { emailAddress: { name: string; address: string } };
}

const formatEventTime = (dateTime: string) => {
  const date = new Date(dateTime);
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });
};

const Calendar: React.FC<CalendarProps> = ({ graphClient, pinned, onPinClick, onRemoveClick }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

      const response = await graphClient.api('/me/calendarview')
     // .header('Prefer', 'outlook.timezone="Africa/Nairobi"')
        .header('Prefer', 'outlook.timezone="UTC"')
        .query({
          startDateTime: startOfDay.toISOString(),
          endDateTime: endOfDay.toISOString()
        })
        .select('subject,start,end,organizer,location')
        .orderby('start/dateTime')
        .get();

      const eventsData: Event[] = response.value;
      setEvents(eventsData);
    } catch (error) {
      console.error('Error fetching events', error);
      setError('Failed to load events.');
    }
  };

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.card}>
      <div className={styles['card-header']}>
        <img src={CalendarIcon} style={{ display: 'flex' }} />
        <p style={{ display: 'flex', justifySelf: 'center' }}>Calendar</p>
        <div style={{display: 'flex'}}>
          <PinIcon pinned={pinned} onPinClick={onPinClick} componentName={''} />
          <button className="btn btn-sm" onClick={onRemoveClick} style={{ marginLeft: '-10px' }}>
            <img src={CloseIcon} style={{display: 'flex', height: '24px', width: '24px'}}/>
          </button>
        </div>
      </div>
      <div className={styles['Calendar-content']}>
        <div className={styles['card-body']}>
          {events.length === 0 && <p style={{alignSelf: 'center', fontWeight: 'bold', justifySelf: 'center'}}>No upcoming Meetings</p>}
          {events.map((event, index) => (
            <div key={index} className={`${styles.event} ${(styles as {[key: string]: string})[`eventColor${index % 4 + 1}`]}`}>
              <div className={`${styles.date} ${(styles as { [key: string]: string })[`dateColor${index % 4 + 1}`]}`}>
                <span className={styles.day}>
                  {new Date(event.start.dateTime).getDate()}
                </span>
                <span className={styles.month}>
                  {new Date(event.start.dateTime).toLocaleString(undefined, { month: 'short' })}
                </span>
              </div>
              <div className={styles.details}>
                <div className={styles.title}>{event.subject}</div>
                <div className={styles.venue}>
                  {formatEventTime(event.start.dateTime)} - {formatEventTime(event.end.dateTime)}
                </div>
                <div className={styles.time}>Organizer: {event.organizer.emailAddress.name}</div>
                {event.location && event.location.displayName && (
                  <div className={styles.venue as keyof typeof styles}>Location: {event.location.displayName}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calendar;