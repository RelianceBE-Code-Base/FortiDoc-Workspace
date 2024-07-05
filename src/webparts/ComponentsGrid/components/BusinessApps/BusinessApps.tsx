import * as React from 'react';
import styles from './BusinessApps.module.scss';
import PinIcon from '../PinIcon/PinIcon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindowClose } from '@fortawesome/free-solid-svg-icons';
import { Web } from '@pnp/sp';


interface BusinessAppsProps {
  pinned: boolean;
  onPinClick: () => void;
  onRemove: () => void; // specify the type as () => void
}

interface IBusinessAppsState {
  applications: Array<{ name: string; icon: string; link: string }>;
}

const BusinessAppsIcon = require('./assets/BusinessAppsIcon.png');

export default class BusinessApps extends React.Component<BusinessAppsProps, IBusinessAppsState> {
  constructor(props: BusinessAppsProps) {
    super(props);
    this.state = {
      applications: [],
    };
  }

  componentDidMount() {
    this.fetchApplications();
  }

  fetchApplications = async () => {
    try {
      const listName = 'LOB Apps';
      const tenantUrl = 'https://microdev.sharepoint.com/sites/IntranetPortal2'; // Replace with your tenant-specific URL
      const web = new Web(tenantUrl);
      const list = await web.lists.getByTitle(listName);
      if (!list) {
        console.error(`List '${listName}' does not exist`);
        return;
      }
      const items = await list.items.select('Title', 'ApplicationLink').expand('AttachmentFiles').get();
      const applications = items.map(item => ({
        name: item.Title,
        icon: item.AttachmentFiles.length > 0 ? item.AttachmentFiles[0].ServerRelativeUrl : '',
        link: item.ApplicationLink,
      }));
      this.setState({ applications });
    } catch (error) {
      console.error("Error fetching applications: ", error);
    }
  }

  render(): React.ReactNode {
    const { pinned, onPinClick, onRemove } = this.props;

    return (
      <div className={styles.card}>
        <div className={styles['card-header']}>
          <img src={BusinessAppsIcon} style={{ display: 'flex' }} alt="Business Apps Icon" />
          <p style={{ display: 'flex', justifySelf: 'center' }}>Business Apps</p>
          <div style={{ display: 'flex' }}>
          <PinIcon pinned={pinned} onPinClick={onPinClick} componentName={''} />
          <FontAwesomeIcon onClick={onRemove} icon={faWindowClose} size='sm' color="red" style={{margin: '5px', cursor: 'pointer'}}/>
          </div>
        </div>
        <div className={styles['card-body']}>
          <div className={styles.iconGrid}>
            {this.state.applications.map((application, index) => {
              return (
                <a key={index} href={application.link} target="_blank" rel="noopener noreferrer">
                  <img className={styles.iconLink} src={application.icon} alt={application.name} />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}
