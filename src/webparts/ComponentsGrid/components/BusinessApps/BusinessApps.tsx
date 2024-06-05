import * as React from 'react';
import { IBusinessApps } from './IBusinessAppsState';
import styles from './BusinessApps.module.scss';



export default class BusinessApps extends React.Component<{},IBusinessApps>{
  constructor(props: {}){
    super(props);
    this.state = {
      applications : 
      [{
        name: require('../BusinessApps/microsoft-excel-2019.svg'),
        icon: "test",
        link: "test"
      },
      {
        name: require('../BusinessApps/Outlook.png'),
        icon: "test",
        link: "test"
      },
      {
        name: require('../BusinessApps/Outlook.png'),
        icon: "test",
        link: "test"
      },
      {
        name: require('../BusinessApps/Outlook.png'),
        icon: "test",
        link: "test"
      },
      {
        name: require('../BusinessApps/Outlook.png'),
        icon: "test",
        link: "test"
      }
    ]
    }
  }

  render(): React.ReactNode {
    return(
      // <section className="card" >
      //   <div className="card-header" style={{backgroundColor: '#e6f6fd' }}>Business Apps</div>
      //   <div className={`${styles.iconGrid}}`}>
      //   {this.state.applications.map((application, index) => {
      //     return(
            
      //       <div key= {index} className={styles.iconLink}>
      //         <img src={application.name}/>
      //       </div>
      //     )
      //   })
      // } 
      //   </div>
      // </section>


      <div className="" style={{ height: '380px' }}>
      <div className="" style={{ backgroundColor: '#E6f6fd', color: '#1e90ff' }}>
        <p className="">Line of Business Apps</p>
      </div>
      <div className="" style={{ backgroundColor: 'white', height: '200px' }}>
        <div className={styles.iconGrid}>
          <a className={styles.iconLink} href="https://office.com" target="_blank" style={{ backgroundImage: 'url(https://static2.sharepointonline.com/files/fabric/assets/brand-icons/product/png/office_96x1.png)' }}></a>
          <a className={styles.iconLink} href="https://office.com/launch/word" target="_blank" style={{ backgroundImage: 'url(https://static2.sharepointonline.com/files/fabric/assets/brand-icons/product/png/word_96x1.png)' }}></a>
          <a className={styles.iconLink} href="https://office.com/launch/excel" target="_blank" style={{ backgroundImage: 'url(https://static2.sharepointonline.com/files/fabric/assets/brand-icons/product/png/excel_96x1.png)' }}></a>
          <a className={styles.iconLink} href="https://office.com/launch/powerpoint" target="_blank" style={{ backgroundImage: 'url(https://static2.sharepointonline.com/files/fabric/assets/brand-icons/product/png/powerpoint_96x1.png)' }}></a>
          <a className={styles.iconLink} href="https://office.com" target="_blank" style={{ backgroundImage: 'url(https://static2.sharepointonline.com/files/fabric/assets/brand-icons/product/png/access_96x1.png)' }}></a>
          <a className={styles.iconLink} href="https://office.com/launch/onenote" target="_blank" style={{ backgroundImage: 'url(https://static2.sharepointonline.com/files/fabric/assets/brand-icons/product/png/onenote_96x1.png)' }}></a>
          <a className={styles.iconLink} href="https://office.com" target="_blank" style={{ backgroundImage: 'url(https://static2.sharepointonline.com/files/fabric/assets/brand-icons/product/png/onedrive_96x1.png)' }}></a>
          <a className={styles.iconLink} href="https://www.microsoft.com/en-us/microsoft-365/project/project-management-software" target="_blank" style={{ backgroundImage: 'url(https://static2.sharepointonline.com/files/fabric/assets/brand-icons/product/png/project_96x1.png)' }}></a>
          <a className={styles.iconLink} href="https://office.live.com/start/visio.aspx" target="_blank" style={{ backgroundImage: 'url(https://static2.sharepointonline.com/files/fabric/assets/brand-icons/product/png/visio_96x1.png)' }}></a>
        </div>
      </div>
    </div>
    )
  }

  
}

