import * as React from 'react';

import './Calendar.module.scss'

import styles from './Calendar.module.scss';

const CalendarIcon = require('./assets/CalendarIcon.png')

const Calendar: React.FC = () => {
  return (
    <div className={styles.card}>
      <div className= {styles['card-header']} style={{backgroundColor: '#e6f6fd' }}>
      <img src={CalendarIcon} style={{display: 'flex'}}/>
      <p style={{display: 'flex', justifySelf: 'center'}}>Calendar</p>
      <div></div>
      </div>
      <div className={styles['card-body']}>
        <p>Just now - From: Account - Message...</p>
        <p>A day ago - From: IT Support - Message...</p>
        <p>2 days ago - From: IT Support - Message...</p>
      </div>
    </div>
  );
};

export default Calendar;
