import * as React from 'react';

import styles from './MicrosoftTeams.module.scss';

const TeamsIcon = require('./assets/TeamsIcon.png')


const MicrosoftTeams: React.FC = () => {
  return (
    <div className={styles.card}>
      <div className={styles['card-header']} style={{backgroundColor: '#e6f6fd' }}>
        <img src={TeamsIcon} style={{display: 'flex'}}/>
        <p style={{display: 'flex', justifySelf: 'center'}}>Microsoft Teams</p>
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

export default MicrosoftTeams;
