import * as React from 'react';
import styles from './BusinessApps.module.scss';
import PinIcon from '../PinIcon/PinIcon';

import { Web } from '@pnp/sp';

interface BusinessAppsProps {
  pinned: boolean;
  onPinClick: () => void;
  onRemoveClick: () => void; // Correct prop name
  tenantUrl: string; // Add tenantUrl as a prop
}

interface IBusinessAppsState {
  applications: Array<{ name: string; icon: string; link: string }>;
  
}
const CloseIcon = require('./assets/close-square.png')
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
      const { tenantUrl } = this.props; // Use the tenantUrl prop
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
    const { pinned,onPinClick, onRemoveClick } = this.props;

    return (
      <div className={styles.card}>
        <div className={styles['card-header']}>
          <img src={BusinessAppsIcon} style={{ display: 'flex' }} alt="Business Apps Icon" />
          <p style={{ display: 'flex', justifySelf: 'center' }}>Business Apps</p>
          <div style={{ display: 'flex' }}>
            <PinIcon pinned={pinned} onPinClick={onPinClick} componentName={''} />
            <button className="btn btn-sm" onClick={onRemoveClick} style={{ marginLeft: '0px' }}>
          <img src={CloseIcon} style={{display: 'flex'}}/>
          </button>
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
