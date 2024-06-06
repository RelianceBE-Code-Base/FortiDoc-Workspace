import * as React from 'react';
import styles from './MicrosoftApps.module.scss'; 
// import { IMicrosoftAppsState } from './IMicrosoftAppsState';


// export default class MicrosoftApps extends React.Component<{},IMicrosoftAppsState>{

//   constructor(props: {}) {
//     super(props);
//     this.state = {
//       applications: [
//         {name: '',
//           icon: 'url(https://static2.sharepointonline.com/files/fabric/assets/brand-icons/product/png/office_96x1.png)',
//           link: "https://office.com"
//         }
//       ]
//     }
//   }


//   render(): React.ReactNode {
//     return(

//       <div className="card" >
//       <div className="card-header" style={{backgroundColor: '#e6f6fd' }}>
//             Microsoft Apps
//       </div>
//       <div className="" style={{ backgroundColor: 'white', height: '200px' }}>
//       <div className={styles.iconGrid}>
//         {this.state.applications.map((application, index) => {
//           return(
//             <a className={styles.iconLink} href={application.link} target="_blank" style={{ backgroundImage: application.link }}></a>
//           )
//         })}
//       </div>
//       </div>
//       </div>
//     )
//   }

// }

const MicrosoftApps: React.FC = () => {

  

  return (
    <div className="card" >
  <div className="card-header" style={{backgroundColor: '#e6f6fd' }}>
        Microsoft Apps
  </div>
  <div className={styles['grid-holder']} style={{ backgroundColor: 'white', height: '200px' }}>
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

  );
};

export default MicrosoftApps;
