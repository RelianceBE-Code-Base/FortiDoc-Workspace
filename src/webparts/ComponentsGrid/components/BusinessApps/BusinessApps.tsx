import * as React from 'react';
import { IBusinessAppsState } from './IBusinessAppsState';
import styles from './BusinessApps.module.scss';


const BusinessAppsIcon = require('./assets/BusinessAppsIcon.png')



export default class BusinessApps extends React.Component<{},IBusinessAppsState>{
  constructor(props: {}){
    super(props);
    this.state = {
      applications : 
      [{
        name: "test",
        icon: require('../BusinessApps/icons/computer.svg'),
        link: "#"
      },
      {
        name: "test",
        icon: require('../BusinessApps/icons/food.png'),
        link: "#"
        
      },
      {
        name: "test",
        icon: require('../BusinessApps/icons/hrhub.png'),
        link: "#"
      },
      {
        name: "test",
        icon: require('../BusinessApps/icons/Incident.png'),
        link: "#"
      },
      {
        name: "test",
        icon: require('../BusinessApps/icons/leave.png'),
        link: "#"
      },
      {
        name: "test",
        icon: require('../BusinessApps/icons/salary-advance.png'),
        link: "#"
      }
      ,
      {
        name: "test",
        icon: require('../BusinessApps/icons/Loan.png'),
        link: "#"
      },
      {
        name: "test",
        icon: require('../BusinessApps/icons/marketplace.png'),
        link: "#"
      },
      {
        name: "test",
        icon: require('../BusinessApps/icons/petty.png'),
        link: "#"
      }
    
    
    ]
    }
  }

  render(): React.ReactNode {
    return(
    

    <div className={styles.card} >
    <div className={styles['card-header']}>
      <img src={BusinessAppsIcon} style={{display: 'flex'}}/>
        <p style={{display: 'flex', justifySelf: 'center'}}>Line of Business Apps</p>
      <div></div>
    </div>



      <div className={styles['card-body']}>
        <div className={styles.iconGrid}>

          {this.state.applications.map((application, index) => {
            return(
              <a key={index}  href={application.link}>
                <img className={styles.iconLink} src={application.icon} alt={application.name}/>
              </a>
            )
          })}

        </div>
      </div>
    </div>
    )
  }

  
}

