import * as React from 'react';
import { IBusinessApps } from './IBusinessAppsState';
import styles from './BusinessApps.module.scss';



export default class BusinessApps extends React.Component<{},IBusinessApps>{
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
    

      <div className="card" >
     <div className="card-header" style={{backgroundColor: '#e6f6fd' }}>
        Line of Business Apps
    </div>
      <div className="" style={{ backgroundColor: 'white', height: '200px' }}>
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

