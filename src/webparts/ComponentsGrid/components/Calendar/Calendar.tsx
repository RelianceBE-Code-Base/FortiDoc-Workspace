import * as React from 'react';
import { useState, useEffect } from 'react';
import { MSGraphClientV3 } from '@microsoft/sp-http';
import styles from './Calendar.module.scss';
import './Calendar.module.scss';

const CalendarIcon = require('./assets/CalendarIcon.png');

interface CalendarProps {
  graphClient: MSGraphClientV3;
}

interface Event {
  id: string;
  subject: string;
  start: { dateTime: string; timeZone: string };
  end: { dateTime: string; timeZone: string };
  location: { displayName: string };
}

const Calendar: React.FC<CalendarProps> = ({ graphClient }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await graphClient.api('/me/events').top(5).get();
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
        <div></div>
        </div>
        <div className={styles['Calendar-content']}>
      <div className={styles['card-body']}>
        {events.length == 0 && <p style={{alignSelf: 'center', fontWeight: 'bold', justifySelf: 'center'}}>No upcoming events</p>}
        {events.map((event, index) => (
           <div key={index} className={`${styles.event} ${(styles as {[key: string]: string})[`eventColor${index % 4 + 1}`]}`}>
            <div className={styles.date}>
              <span className={styles.day}>{new Date(event.start.dateTime).getDate()}</span>
              <span className={styles.month}>{new Date(event.start.dateTime).toLocaleString('default', { month: 'short' })}</span>
            </div>
            <div className={styles.details}>
              <div className={styles.title}>{event.subject}</div>
              <div className={styles.venue}>Venue: {event.location.displayName}</div>
              <div className={styles.time}>
                {new Date(event.start.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(event.end.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
    
  );
};

export default Calendar;
